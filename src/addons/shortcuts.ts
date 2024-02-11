import { Result as ResultT, ok } from "../types/result"
import { Tari } from "../core"
import { TariError } from "../types/error"
import { UIInstance } from "../ui"
import { Shortcut } from "../shortcuts"
;(Tari => {
  const { Result, UI } = Tari
  const { h, PanelUI } = UI

  const addon = Result.unwrap(Tari.create_addon("tari.shortcuts"))

  const get_key = key => {
    if (key.startsWith("Shift_")) {
      return key.slice(6)
    }
    if (key === " ") {
      return "Space"
    }
    return key
  }

  const render_shortcut = (shortcut: Shortcut): HTMLElement => {
    const container = h("div", "tari-shortcut", [])
    container.innerHTML =
      (shortcut.ctrl ? `<span class="tari-key">Ctrl</span>+` : "") +
      (shortcut.shift ? `<span class="tari-key">Shift</span>+` : "") +
      (shortcut.alt ? `<span class="tari-key">Alt</span>+` : "") +
      shortcut.key
        .map(x => `<span class="tari-key">${get_key(x)}</span>`)
        .join("+")
    return container
  }

  class ShortcutsPanelUI extends PanelUI {
    constructor(ui: UIInstance) {
      super(
        Infinity,
        ui.InputUI("search for shortcuts here ..."),
        () => {
          const shortcuts = Tari._shortcuts.shortcuts
          return Object.values(shortcuts).map(shortcut => {
            return {
              key: shortcut.id,
              html: highlighted => {
                return h(
                  "div",
                  "tari-shortcut-preview",
                  [highlighted, render_shortcut(shortcut.shortcut)],
                  {
                    onclick: () => {},
                  },
                )
              },
            }
          })
        },
        () => {},
        PanelUI.close_panel,
      )
    }
  }

  addon.on("init", () => {
    addon.register(
      Tari.Command(
        "shortcuts",
        (): ResultT<null, TariError> => {
          UI.request_lock(ui => {
            const panel = new ShortcutsPanelUI(ui)
            ui.render(panel, () => {
              panel.$input.focus()
            })
          })
          return ok(null)
        },
        "view the shortcuts",
      ),
    )
  })

  addon.on("unregister", () => {})

  Tari.register(addon)
})(Tari)
