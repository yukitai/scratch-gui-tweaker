import { Tari } from "..";
import { UIComponent, h } from "./uicomponent";

type InputHandler = (e: InputEvent) => void

class BasicUI extends UIComponent {

  inner: () => UIComponent
  input_handler: InputHandler

  constructor (inner: () => UIComponent, input_handler: InputHandler) {
    super()
    this.inner = inner
    this.input_handler = input_handler
  }

  render (): HTMLElement {
    return h(
      "div", "tari_basic_container",
      [
        h(
          "input", "tari_input", [],
          {
            oninput: (e: InputEvent) => {
              this.input_handler(e)
            } 
          }
        ),
        h(
          "div", "",
          [ this.inner().render() ]
        )
      ]
    )
  }
}

export {
  BasicUI,
}