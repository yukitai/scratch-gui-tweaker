import { InputTip, Tari } from "../core"
import { Key } from "../shortcuts"
import { TariError } from "../types/error"
import { Result as ResultT } from "../types/result"

type AddonMeta = {
  id: string
  author?: string
  name?: string
}
;(Tari => {
  const { Result, UI, Logger, CachedStorage } = Tari

  const ID = "tari.addon_installer"

  const addon = Result.unwrap(Tari.create_addon(ID))

  const storage = new CachedStorage()

  const load_raw = (id: string, content: string) => {
    const addon_fn = new Function("Tari", content)
    try {
      addon_fn(Tari)
    } catch (e) {
      Logger.error("error while loading addon: %s", id)
      console.error(e)
    }
  }

  const load_installed_addons = () => {
    const installed = Result.unwrap(storage.get_item("tari_installed_addons"))
    Logger.info("found user-loaded addons: ", installed)

    for (const id of installed.split(",")) {
      const content = Result.unwrap(storage.get_item(`tari_installed_id_${id}`))
      load_raw(id, content)
    }
  }

  const install_addon = (content: string): ResultT<null, TariError> => {
    let meta: AddonMeta
    try {
      const head_comment_regex =
        /^\/\*([^a-zA-Z_\-0-9]*?([a-zA-Z_-]+)\s*:\s*(\S[^\n]*)\n)*[^a-zA-Z_-]*\*\//
      const comment = content.match(head_comment_regex)[0]
      const entries_regex = /^[^a-zA-Z_\-0-9]*([a-zA-Z_\-0-9]+)\s*:\s*(.+?)$/gms
      const entries = [...comment.matchAll(entries_regex)].map(match => [
        match[1],
        match[2],
      ])
      meta = Object.fromEntries(entries)
      if (!meta.id) {
        throw ""
      }
    } catch (e) {
      console.error(e)
      return Result.err(new Error(`invailed addon format: ${e}`))
    }
    const id = meta.id
    if (Result.unwrap(storage.has_item(`tari_installed_id_${id}`))) {
      Tari.unregister(id)
    }
    storage.set_item(`tari_installed_id_${id}`, content)
    storage.set_item(
      "tari_installed_addons",
      `${Result.unwrap(storage.get_item("tari_installed_addons"))},${id}`,
    )
    load_raw(id, content)
    return Result.ok(null)
  }

  const uninstall_addon = (id: string): ResultT<null, TariError> => {
    throw "not implemented yet"
  }

  addon.on("init", () => {
    addon.register(
      Tari.Command("install", (args: string[]): ResultT<null, TariError> => {
        if (args[0]) {
          fetch(args[0])
            .then(res => res.text())
            .then(install_addon)
            .then(res => {
              if (Result.is_err(res)) {
                // todo! open an error reporter here
              }
            })
          return Result.ok(null)
        }
        Tari.run_command("install_panel")
        return Result.ok(null)
      }),
    )

    addon.register(
      Tari.Command(
        "uninstall",
        (args: string[]): ResultT<null, TariError> => {
          if (!args[0]) {
            return Result.err(new Error(`uninstall: expected an addon id`))
          }
          return uninstall_addon(args[0])
        },
        "uninstall an addon",
        (): InputTip[] => {
          const installed = Result.unwrap(
            storage.get_item("tari_installed_addons"),
          ).split(",")
          return installed.map(item => {
            return { value: `uninstall ${item}`, from: ID }
          })
        },
      ),
    )

    addon.register(
      Tari.Command(
        "install_addon",
        (args: string[]): ResultT<null, TariError> => {
          UI.request_lock(ui => {
            ui.render()
          })
          return Result.ok(null)
        },
      ),
    )

    addon.register(
      Tari.Command(
        "loaded_addons",
        (args: string[]): ResultT<null, TariError> => {
          UI.request_lock(ui => {
            ui.render()
          })
          return Result.ok(null)
        },
      ),
    )

    load_installed_addons()
  })

  addon.on("unregister", () => {})

  Tari.register(addon)
})(Tari)
