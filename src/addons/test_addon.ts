import { Tari } from "../core";

const addon = Tari.Result.unwrap(Tari.create_addon("yukitai.test_addon"))

addon.on("init", () => {
  Tari.Logger.info("`yukitai.test_addon` is ready")

  addon.register(Tari.Command("panel", () => {
    const ui = Tari.Result.unwrap(Tari.UI.lock())
    ui.render(ui.PanelUI())
  }))

  Tari.run_command("panel")
})

addon.on("unregister", () => {
  Tari.Logger.info("unregistering `yukitai.test_addon`")
})

Tari.register(addon)