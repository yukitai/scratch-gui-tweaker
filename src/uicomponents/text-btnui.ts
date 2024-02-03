import { UIComponent, h } from "./uicomponent";

class InputUI extends UIComponent {
  
  inner: UIComponent

  constructor (inner: UIComponent) {
    super()
    this.inner = inner
  }

  render (): HTMLElement {
    return h(
      "span", "tari-text-btn",
      [ this.inner.render() ]
    )
  }
}

export {
  InputUI,
}