import { Tari } from "../core";
import { unwrap } from "../types/result";
import { BasicUI } from "../uicomponents/basicui";
import { RawUI } from "../uicomponents/rawui";

const addon = unwrap(Tari.create_addon("yukitai.test_addon"))

addon.on("init", () => {
  Tari.Logger.info("`yukitai.test_addon` is ready")

  addon.register(Tari.Command("test", (_1, _2, raw) => {
    const ui = unwrap(Tari.UI.lock())

    ui.render(new BasicUI(() => {
        return new RawUI(raw)
      }, _e => {
        ui.render()
        ui.unlock()
      }))
  }))
})

addon.on("unregister", () => {
  Tari.Logger.info("unregistering `yukitai.test_addon`")
})

Tari.register(addon)