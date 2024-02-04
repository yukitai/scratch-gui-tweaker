import { Tari, TariId } from "./core"
import { Logger } from "./logger"
import { TariError } from "./types/error"
import { Nullable } from "./types/nullable"
import { Result, err, ok } from "./types/result"
import { GroupUI } from "./uicomponents/groupui"
import { InputEventHandler, InputUI } from "./uicomponents/inputui"
import { ListUI } from "./uicomponents/listui"
import { PanelUI } from "./uicomponents/panelui"
import { RawUI } from "./uicomponents/rawui"
import { TextBtnUI } from "./uicomponents/text-btnui"
import { UIComponent } from "./uicomponents/uicomponent"
import { WithAttr } from "./uicomponents/withattr"
import { WithClass } from "./uicomponents/withclass"
import { STYLE } from "./uistyle"

type RequestUICallback = (ui: UIInstance) => void

class TariUI {
  
  locked: boolean
  instance: Nullable<WeakRef<UIInstance>>
  el: HTMLDivElement
  css: HTMLStyleElement
  _style: Record<TariId, string>
  _html: Nullable<HTMLElement>
  _requests: RequestUICallback[]

  constructor (el: HTMLElement) {
    this.locked = false
    this.instance = null
    this._style = {}
    this._requests = []
    this.el = document.createElement("div")
    this.css = document.createElement("style")
    this.el.classList.add("tari", "tari-hidden")
    el.appendChild(this.css)
    el.appendChild(this.el)
    
    setInterval(() => {
      this.process_requests()
    }, 1000 / 60)
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

  lock (): Result<UIInstance, TariError> {
    if (this.is_locked()) {
      return err(new Error("error: TariUI already locked"))
    }
    return ok(this.unsafe_lock())
  }

  request_lock (callback: RequestUICallback) {
    this._requests.push(callback)
  }

  process_requests () {
    if (this._requests.length === 0) {
      return
    }
    if (this.is_locked()) {
      return
    }
    const ui = this.unsafe_lock()
    const callback = this._requests.shift()
    callback(ui)
    if (ui.vaild) {
      ui.unlock()
    }
  }

  render (onrendered: () => void) {
    this.css.innerHTML = STYLE + Object.values(this._style).join("")
    this.el.innerHTML = ""
    if (this._html) {
      this.el.appendChild(this._html)
      this.el.classList.remove("tari-hidden")
    } else {
      this.el.classList.add("tari-hidden")
    }
    onrendered()
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

  ListUI (components: UIComponent[]): ListUI {
    return new ListUI(components)
  }

  GroupUI (components: UIComponent[]): GroupUI {
    return new GroupUI(components)
  }

  RawUI (raw: string): RawUI {
    return new RawUI(raw)
  }

  InputUI (placeholder: string, oninput?: InputEventHandler): InputUI {
    return new InputUI(placeholder, oninput)
  }

  TextBtnUI (inner: UIComponent): TextBtnUI {
    return new TextBtnUI(inner)
  }

  PanelUI (close: () => void): PanelUI {
    return new PanelUI(close)
  }

  WithClass (className: string, component: UIComponent): WithClass {
    return new WithClass(component, className)
  }

  WithAttr (attrs: Record<string, string>, component: UIComponent): WithAttr {
    return new WithAttr(component, attrs)
  }

  render (component?: UIComponent, onrendered?: () => void) {
    this.ui._html = component ? component.render() : null
    this.ui.render(onrendered ?? (() => {}))
  }
}

export {
  TariUI,
  UIInstance,
}