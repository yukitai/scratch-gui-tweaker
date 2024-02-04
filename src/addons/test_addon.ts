import { Tari } from "../core";
import { TariError } from "../types/error";
import { Result as ResultT } from "../types/result"

((Tari) => {

  const { Result, UI, Logger } = Tari

  const addon = Result.unwrap(Tari.create_addon("yukitai.test_addon"))

  addon.on("init", () => {
    Logger.info("`yukitai.test_addon` is ready")

    addon.register(Tari.Command("panel", (): ResultT<null, TariError> => {
      UI.request_lock(ui => {
        const panel = ui.PanelUI(() => {
          ui.render()
          ui.unlock()
        })
        ui.render(panel, () => {
          panel.$input.focus()
        })
      })
      return Result.ok(null)
    }))

    addon.register(Tari.Command("close", (): ResultT<null, TariError> => {
      UI.request_lock(ui => {
        ui.render()
      })
      return Result.ok(null)
    }))

    Tari.run_command("panel")
  })

  addon.on("unregister", () => {
    Logger.info("unregistering `yukitai.test_addon`")
  })

  Tari.register(addon)

})(Tari)