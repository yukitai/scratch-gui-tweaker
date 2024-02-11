import { Result as ResultT, ok } from "../types/result"
import { Tari } from "../core"
import { TariError } from "../types/error"
;import { UIInstance } from "../ui";
(Tari => {
  const { Result, UI } = Tari
  const { h, PanelUI } = UI

  const addon = Result.unwrap(Tari.create_addon("tari.shortcuts"))

  class ShortcutsPanelUI extends PanelUI {

    constructor (ui: UIInstance) {
      super(
        Infinity,
        ui.InputUI("search for shortcuts here ..."),
        () => [],
        () => {},
        PanelUI.close_panel
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
