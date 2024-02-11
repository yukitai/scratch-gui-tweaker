import { UIComponent, h } from "./uicomponent"

class ListUI extends UIComponent {
  components: UIComponent[]

  constructor(components: UIComponent[]) {
    super()
    this.components = components
  }

  render(): HTMLElement {
    return h(
      "ul",
      "tari-list",
      this.components.map(component =>
        h("li", "tari-item", [component.render()]),
      ),
    )
  }
}

export { ListUI }
