import { UIComponent, h } from "./uicomponent";

class ListUI extends UIComponent {

  components: UIComponent[]

  constructor (components: UIComponent[]) {
    super()
    this.components = components
  }

  render (): HTMLElement {
    return h(
      "ul", "tari_ul",
      this.components.map(component => component.render())
    )
  }
}

export {
  ListUI
}