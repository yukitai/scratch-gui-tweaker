import { UIComponent } from "./uicomponent"

class RawUI extends UIComponent {
  raw: string

  constructor(raw: string) {
    super()
    this.raw = raw
  }

  render(): HTMLElement {
    const el = document.createElement("div")
    el.innerHTML = this.raw
    return el
  }
}

export { RawUI }
