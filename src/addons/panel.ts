import { Tari } from "../core"
import { Key } from "../shortcuts"
import { TariError } from "../types/error"
import { Result as ResultT } from "../types/result"
import { UIInstance } from "../ui"
;(Tari => {
  const { Result, UI } = Tari
  const { h, PanelUI } = UI

  const addon = Result.unwrap(Tari.create_addon("tari.panel"))

  class CommandPanelUI extends PanelUI {
    constructor(ui: UIInstance) {
      super(
        8,
        ui.InputUI("type command here ..."),
        () => {
          const cmd = this.$input.value
          const tips = Tari.get_input_tips(cmd)
          return tips.map(tip => {
            return {
              key: tip.value,
              html: highlighted => {
                return h(
                  "div",
                  "tari-tip tari-text-btn tari-tip-btn",
                  [highlighted, h("span", "tari-comment", [tip.from])],
                  {
                    onclick: () => {
                      this.$input.value = tip.value
                      this.update()
                    },
                  },
                )
              },
            }
          })
        },
        () => {
          const cmd = this.$input.value
          if (cmd === "") {
            this.close()
            return
          }
          const result = Tari.run_command(cmd)
          if (Result.is_ok(result)) {
            this.close()
          } else {
            this.$container.innerHTML = `\
<div class="tari-error"><span class="tari-highlight">error:</span> <span>${
              Result.unwrap_err(result).message
            }</span></div>`
          }
        },
        PanelUI.close_panel,
      )
    }
  }

  addon.on("init", () => {
    addon.register(
      Tari.Command("panel", (): ResultT<null, TariError> => {
        UI.request_lock(ui => {
          const panel = new CommandPanelUI(ui)
          ui.render(panel, () => {
            panel.$input.focus()
          })
        })
        return Result.ok(null)
      }),
    )

    addon.register(
      Tari.Shortcut(
        "open_command_panel",
        {
          key: [Key.Comma],
          ctrl: true,
        },
        () => {
          Tari.run_command("panel")
          return true
        },
      ),
    )
  })

  addon.on("unregister", () => {})

  Tari.register(addon)
})(Tari)
