import { TariId } from "./core"
import { TariError } from "./types/error"
import { Nullable } from "./types/nullable"
import { Result, err, ok } from "./types/result"
import { ListUI } from "./uicomponents/listui"
import { PanelUI } from "./uicomponents/panelui"
import { RawUI } from "./uicomponents/rawui"
import { UIComponent } from "./uicomponents/uicomponent"
import { STYLE } from "./uistyle"

class TariUI {
  
  locked: boolean
  instance: Nullable<WeakRef<UIInstance>>
  el: HTMLDivElement
  css: HTMLStyleElement
  _style: Record<TariId, string>
  _html: Nullable<HTMLElement>

  constructor (el: HTMLElement) {
    this.locked = false
    this.instance = null
    this._style = {}
    this.el = document.createElement("div")
    this.css = document.createElement("style")
    this.el.classList.add("tari")
    el.appendChild(this.css)
    el.appendChild(this.el)
  }

  is_locked (): boolean {
    if (this.instance) {
      if (this.instance.deref() === undefined) {
        this.locked = false
      }
    }
    return this.locked
  }

  unsafe_lock (): UIInstance {
    this.locked = true
    const lock = new UIInstance(this)
    this.instance = new WeakRef(lock)
    return lock
  }

  // todo! return new Promise()
  lock (): Result<UIInstance, TariError> {
    if (this.is_locked()) {
      return err("error: TariUI already locked")
    }
    return ok(this.unsafe_lock())
  }

  render () {
    this.css.innerHTML = STYLE + Object.values(this._style).join("")
    this.el.innerHTML = ""
    this._html && this.el.appendChild(this._html)
  }
}

class UIInstance {

  ui: TariUI
  vaild: boolean

  constructor (ui: TariUI) {
    this.ui = ui
    this.vaild = true
  }

  unlock () {
    if (!this.vaild) {
      return
    }
    this.vaild = false
    this.ui.locked = false
  }

  inject_css (id: TariId, css: string) {
    if (!this.vaild) {
      return
    }
    this.ui._style[id] = css
  }

  clear_css (id: TariId) {
    if (!this.vaild) {
      return
    }
    delete this.ui._style[id]
  }

  ListUI (components: UIComponent[]): UIComponent {
    return new ListUI(components)
  }

  RawUI (raw: string): UIComponent {
    return new RawUI(raw)
  }

  PanelUI (): UIComponent {
    return new PanelUI()
  }

  render (component?: UIComponent) {
    this.ui._html = component ? component.render() : null
    this.ui.render()
  }
}

export {
  TariUI,
  UIInstance,
}