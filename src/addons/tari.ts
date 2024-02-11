import { Tari } from "../core"
import { Key } from "../shortcuts"
import { TariError } from "../types/error"
import { Result as ResultT } from "../types/result"
;(Tari => {
  const { Result, UI } = Tari

  const addon = Result.unwrap(Tari.create_addon("tari"))

  addon.on("init", () => {
    addon.register(
      Tari.Command("close", (): ResultT<null, TariError> => {
        UI.request_lock(ui => {
          ui.render()
        })
        return Result.ok(null)
      }),
    )

    addon.register(
      Tari.Shortcut(
        "close_panel",
        {
          key: [Key.Escape],
        },
        () => {
          Tari.run_command("close")
          return true
        },
      ),
    )
  })

  addon.on("unregister", () => {})

  Tari.register(addon)
})(Tari)
