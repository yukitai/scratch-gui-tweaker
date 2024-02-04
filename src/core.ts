import { TariAddonInstance } from "./addon"
import { Logger } from "./logger"
import { TariError } from "./types/error"
import { Result, err, ok } from "./types/result"
import * as result from "./types/result"
import * as nullable from "./types/nullable"
import { TariUI } from "./ui"

type TariId = string
type Handler =
  | ((
    args: string[],
    kwargs: Record<string, string>,
    raw: string,
  ) => Result<any, TariError>)
  | ((
    args: string[],
    kwargs: Record<string, string>,
  ) => Result<any, TariError>)
  | ((
    args: string[]
  ) => Result<any, TariError>)
  | (() => Result<any, TariError>)

type InputTip = {
  value: string,
  from: string,
  description?: string,
  rank: number,
  matches: Match[],
}

type Match = {
  type: MatchType,
  value: string,
}

enum MatchType {
  Unmatched,
  Matched,
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
  command: {
    description?: string,
    handler: Handler,
    input_tips_provider?: InputTipsProvider,
  },
}

type Command = {
  from: string,
  description?: string,
  handler: Handler,
  input_tips_provider?: InputTipsProvider,
}

class Tari {

  static UI = new TariUI(document.querySelector("body"))
  static Logger = Logger
  static Result = result
  static Nullable = nullable
  static _addons: Record<TariId, TariAddonInstance> = {}
  static _commands: Record<TariId, Command> = {}

  static Command (
    id: TariId,
    handler: Handler,
    description?: string,
    input_tips_provider?: InputTipsProvider
  ): CommandInfo {
    return {
      id,
      command: {
        handler,
        description,
        input_tips_provider
      },
      type: RegisterTypeEnum.COMMAND,
    }
  }

  static create_addon (id: TariId): Result<TariAddonInstance, TariError> {
    if (Tari._addons[id]) {
      return err(new Error(`error: Addon \`${id}\` already exists`))
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

  static run_command (cmd: string): Result<any, TariError> {
    const parsed = Tari.parse_command(cmd)
    const result = Tari.handle_command(
      parsed.cmd,
      parsed.args,
      parsed.kwargs,
      parsed.raw
    )
    return result
  }

  static get_input_tips (cmd: string): InputTip[] {
    if (cmd === "") {
      return []
    }
    const parsed = Tari.parse_command(cmd)
    return [
      ...Tari.handle_get_input_tips(parsed.cmd, parsed.args, parsed.kwargs, parsed.raw),
      ...Tari.get_all_matched_command_tips(cmd)
    ].toSorted((a, b) => b.rank - a.rank)
  }

  static get_all_matched_command_tips (cmd: string): InputTip[] {
    return Object .entries(this._commands)
                  .filter(command => command[0].indexOf(cmd) !== -1)
                  .map(command => {
                    const start = command[0].indexOf(cmd)
                    const end = start + cmd.length
                    const matches = [
                      {
                        type: MatchType.Unmatched,
                        value: command[0].slice(0, start),
                      },
                      {
                        type: MatchType.Matched,
                        value: command[0].slice(start, end),
                      },
                      {
                        type: MatchType.Unmatched,
                        value: command[0].slice(end),
                      },
                    ]
                    return {
                      rank: 1,
                      from: command[1].from,
                      description: command[1].description,
                      value: command[0],
                      matches,
                    }
                  })
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
    raw: string
  ): InputTip[] {
    const cmd = Tari._commands[id]
    if (!cmd || !cmd.input_tips_provider) {
      return []
    }
    return cmd.input_tips_provider(args, kwargs, raw)
  }
}

export {
  type Match,
  MatchType,
  Tari,
  TariId,
  Handler,
  RegisterInfo,
  RegisterTypeEnum,
  CommandInfo,
  InputTip,
  InputTipsProvider,
}