# Tari Loader for Scratch

A powerful broswer addon loader for Scratch.

Easy to devlop an addon.

```javascript
((Tari) => {
  const { Logger, Result } = Tari

  // get the instance of our addon
  const addon = Result.unwrap(Tari.create_addon("yukitai.test_addon"))

  // this event is emitted when the addon is registered and inited
  addon.on("init", () => {
    Logger.info("`yukitai.test_addon` is ready")

    // register a command
    addon.register(Tari.Command("panel", () => {
      // get the instance of UI
      const ui = Result.unwrap(Tari.UI.lock())
      // request for a panel UI
      ui.render(ui.PanelUI())
    }))

    // run the command
    Tari.run_command("panel")
  })

  // this event is emitted when the addon is being unregistered
  addon.on("unregister", () => {
    Logger.info("unregistering `yukitai.test_addon`")
  })

  // register the addon
  Tari.register(addon)
})(Tari)
```