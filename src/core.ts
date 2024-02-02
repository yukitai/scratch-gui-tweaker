import { TariAddonInstance } from "./addon"
import { Logger } from "./logger"
import { TariError } from "./types/error"
import { Result, err, ok } from "./types/result"
import { TariUI } from "./ui"

type TariId = string
type Handler =
  | ((
    args: string[],
    kwargs: Record<string, string>,
    raw: string,
  ) => void)
  | ((
    args: string[],
    kwargs: Record<string, string>,
  ) => void)
  | ((args: string[]) => void)
  | (() => void)

type InputTip = {
  value: string,
  description?: string,
}

type InputTipsProvider = (
    args: string[],
    kwargs: Record<string, string>,
    raw: string,
  ) => InputTip[]

type ParsedCommand = {
  cmd: TariId,
  args: string[],
  kwargs: Record<string, string>,
  raw,
}

enum RegisterTypeEnum {
  COMMAND,
}

interface RegisterInfo {
  type: RegisterTypeEnum,
  id: TariId,
}

type CommandInfo = {
  type: RegisterTypeEnum.COMMAND,
  id: TariId,
  command: Command,
}

type Command = {
  handler: Handler,
  input_tips_provider?: InputTipsProvider,
}

class Tari {

  static UI = new TariUI(document.querySelector("body"))
  static Logger = Logger
  static _addons: Record<TariId, TariAddonInstance> = {}
  static _commands: Record<TariId, Command> = {}

  static Command (
    id: TariId, 
    handler: Handler,
    input_tips_provider?: InputTipsProvider
  ): CommandInfo {
    return {
      id,
      command: { handler, input_tips_provider },
      type: RegisterTypeEnum.COMMAND,
    }
  }

  static create_addon (id: TariId): Result<TariAddonInstance, TariError> {
    if (Tari._addons[id]) {
      return err(`error: Addon \`${id}\` already exists`)
    }
    return ok(new TariAddonInstance(id))
  }

  static register (addon: TariAddonInstance) {
    Tari._addons[addon.id] = addon
    addon.emit("init")
  }

  static unregister (id: TariId) {
    if (!Tari._addons[id]) {
      return
    }
    Tari._addons[id].unregister()
    delete Tari._addons[id]
  }

  static run_command (cmd: string) {
    const parsed = Tari.parse_command(cmd)
    Tari.handle_command(parsed.cmd, parsed.args, parsed.kwargs, parsed.raw)
  }

  static get_input_tips (cmd: string): InputTip[] {
    const parsed = Tari.parse_command(cmd)
    return Tari.handle_get_input_tips(parsed.cmd, parsed.args, parsed.kwargs, parsed.raw)
  }

  private static parse_command(raw: string): ParsedCommand {
    let cmd = "", n: number
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
    raw: string
  ) {
    const cmd = Tari._commands[id]
    if (!cmd) {
      Tari.Logger.error(`unknown command \`${id}\``)
      return
    }
    cmd.handler(args, kwargs, raw)
  }

  private static handle_get_input_tips(
    id: TariId,
    args: string[],
    kwargs: Record<string, string>,
    raw: string
  ): InputTip[] {
    const cmd = Tari._commands[id]
    if (!cmd) {
      Tari.Logger.error(`unknown command \`${id}\``)
      return
    }
    return cmd.input_tips_provider(args, kwargs, raw)
  }
}

export {
  Tari,
  TariId,
  Handler,
  RegisterInfo,
  RegisterTypeEnum,
  CommandInfo,
  InputTip,
  InputTipsProvider,
}