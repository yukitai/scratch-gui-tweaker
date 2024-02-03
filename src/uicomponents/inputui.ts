import { UIComponent, h } from "./uicomponent";

class InputUI extends UIComponent {
  
  placeholder: string

  constructor (placeholder: string) {
    super()
    this.placeholder = placeholder
  }

  render (): HTMLElement {
    return h(
      "input", "tari-input",
      [],
      {
        type: "text",
        placeholder: this.placeholder,
      }
    )
  }
}

export {
  InputUI,
}