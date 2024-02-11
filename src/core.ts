import { TariAddonInstance } from "./addon"
import { Logger } from "./logger"
import { TariError } from "./types/error"
import { Result, err, ok } from "./types/result"
import * as result from "./types/result"
import * as nullable from "./types/nullable"
import { TariUI } from "./ui"
import { Shortcut, ShortcutsManager } from "./shortcuts"

type TariId = string
type CommandHandler =
  | ((
      args: string[],
      kwargs: Record<string, string>,
      raw: string,
    ) => Result<any, TariError>)
  | ((args: string[], kwargs: Record<string, string>) => Result<any, TariError>)
  | ((args: string[]) => Result<any, TariError>)
  | (() => Result<any, TariError>)
type ShortcutHandler = (() => boolean) | (() => void)

type InputTip = {
  value: string
  from: string
  description?: string
}

type InputTipsProvider = (
  args: string[],
  kwargs: Record<string, string>,
  raw: string,
) => InputTip[]

type ParsedCommand = {
  cmd: TariId
  args: string[]
  kwargs: Record<string, string>
  raw
}

enum RegisterTypeEnum {
  COMMAND,
  SHORTCUT,
}

interface RegisterInfo {
  type: RegisterTypeEnum
  id: TariId
}

type CommandInfo = {
  type: RegisterTypeEnum.COMMAND
  id: TariId
  command: {
    description?: string
    handler: CommandHandler
    input_tips_provider?: InputTipsProvider
  }
}

type Command = {
  from: string
  description?: string
  handler: CommandHandler
  input_tips_provider?: InputTipsProvider
}

type ShortcutInfo = {
  type: RegisterTypeEnum.SHORTCUT
  id: TariId
  shortcut: Shortcut
  handler: ShortcutHandler
}

const $body = document.querySelector("body")

class Tari {
  static UI = new TariUI($body)
  static _shortcuts = new ShortcutsManager($body)
  static Logger = Logger
  static Result = result
  static Nullable = nullable
  static _addons: Record<TariId, TariAddonInstance> = {}
  static _commands: Record<TariId, Command> = {}

  static Command(
    id: TariId,
    handler: CommandHandler,
    description?: string,
    input_tips_provider?: InputTipsProvider,
  ): CommandInfo {
    return {
      id,
      command: {
        handler,
        description,
        input_tips_provider,
      },
      type: RegisterTypeEnum.COMMAND,
    }
  }

  static Shortcut(
    id: TariId,
    shortcut: Shortcut,
    handler: ShortcutHandler,
  ): ShortcutInfo {
    return {
      id,
      shortcut,
      handler,
      type: RegisterTypeEnum.SHORTCUT,
    }
  }

  static create_addon(id: TariId): Result<TariAddonInstance, TariError> {
    if (Tari._addons[id]) {
      return err(new Error(`error: Addon \`${id}\` already exists`))
    }
    return ok(new TariAddonInstance(id))
  }

  static register(addon: TariAddonInstance) {
    Tari._addons[addon.id] = addon
    addon.emit("init")
  }

  static unregister(id: TariId) {
    if (!Tari._addons[id]) {
      return
    }
    Tari._addons[id].unregister()
    delete Tari._addons[id]
  }

  static run_command(cmd: string): Result<any, TariError> {
    const parsed = Tari.parse_command(cmd)
    const result = Tari.handle_command(
      parsed.cmd,
      parsed.args,
      parsed.kwargs,
      parsed.raw,
    )
    return result
  }

  static get_input_tips(cmd: string): InputTip[] {
    const parsed = Tari.parse_command(cmd)
    return [
      ...this.handle_get_input_tips(
        parsed.cmd,
        parsed.args,
        parsed.kwargs,
        parsed.raw,
      ),
      ...Object.entries(this._commands).map(([id, cmd]) => {
        return {
          from: cmd.from,
          description: cmd.description,
          value: id,
        }
      }),
    ]
  }

  private static parse_command(raw: string): ParsedCommand {
    let cmd = "",
      n: number
    const args = []
    const kwargs = {}
    raw
      .split(" ")
      .filter(x => x !== "")
      .forEach(x => {
        if (cmd === "") {
          cmd = x
        } else if ((n = x.indexOf("=")) !== -1) {
          const key = x.slice(0, n)
          const value = x.slice(n + 1)
          kwargs[key] = value
        } else {
          args.push(x)
        }
      })
    return { cmd, args, kwargs, raw }
  }

  private static handle_command(
    id: TariId,
    args: string[],
    kwargs: Record<string, string>,
    raw: string,
  ): Result<any, TariError> {
    const cmd = Tari._commands[id]
    if (!cmd) {
      return err(new Error(`unknown command \`${id}\``))
    }
    return cmd.handler(args, kwargs, raw)
  }

  private static handle_get_input_tips(
    id: TariId,
    args: string[],
    kwargs: Record<string, string>,
    raw: string,
  ): InputTip[] {
    const cmd = Tari._commands[id]
    if (!cmd || !cmd.input_tips_provider) {
      return []
    }
    return cmd.input_tips_provider(args, kwargs, raw)
  }
}

export {
  type ShortcutInfo,
  type ShortcutHandler,
  Tari,
  TariId,
  CommandHandler as Handler,
  RegisterInfo,
  RegisterTypeEnum,
  CommandInfo,
  InputTip,
  InputTipsProvider,
}
