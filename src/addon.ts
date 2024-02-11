import EventEmitter from "eventemitter3"
import {
  CommandInfo,
  RegisterInfo,
  RegisterTypeEnum,
  ShortcutInfo,
  Tari,
  TariId,
} from "./core"

class TariAddonInstance extends EventEmitter {
  id: TariId
  private registered: RegisterInfo[]

  constructor(id: TariId) {
    super()
    this.id = id
    this.registered = []
  }

  register(item: RegisterInfo) {
    switch (item.type) {
      case RegisterTypeEnum.COMMAND:
        Tari._commands[item.id] = {
          from: this.id,
          ...(item as CommandInfo).command,
        }
        break
      case RegisterTypeEnum.SHORTCUT:
        Tari._shortcuts.shortcuts[item.id] = item as ShortcutInfo
        break
      default:
        return
    }
    this.registered.push(item)
  }

  unregister() {
    this.emit("unregister")
    this.unregister_all()
  }

  private unregister_all() {
    this.registered.forEach(item => {
      this.unregister_item(item)
    })
    this.registered = []
  }

  private unregister_item(item: RegisterInfo) {
    switch (item.type) {
      case RegisterTypeEnum.COMMAND:
        delete Tari._commands[item.id]
        break
      case RegisterTypeEnum.SHORTCUT:
        delete Tari._shortcuts.shortcuts[item.id]
        break
      default:
        throw new Error(`invalid register info type \`${item.type}\``)
    }
  }
}

export { TariAddonInstance }
