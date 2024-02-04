import { Nullable, nullable } from "../types/nullable";
import { UIComponent, h } from "./uicomponent";

type InputEventHandler = (e: InputEvent) => void

class InputUI extends UIComponent {
  
  placeholder: string
  oninput: Nullable<InputEventHandler>

  constructor (placeholder: string, oninput?: InputEventHandler) {
    super()
    this.placeholder = placeholder
    this.oninput = nullable(oninput)
  }

  render (): HTMLElement {
    return h(
      "input", "tari-input",
      [],
      {
        type: "text",
        placeholder: this.placeholder,
        oninput: this.oninput,
      }
    )
  }
}

export {
  type InputEventHandler,
  InputUI,
}