import { UIComponent, h } from "./uicomponent"

class GroupUI extends UIComponent {
  components: UIComponent[]

  constructor(components: UIComponent[]) {
    super()
    this.components = components
  }

  render(): HTMLElement {
    return h(
      "tari-g",
      "",
      this.components.map(comonent => comonent.render()),
    )
  }
}

export { GroupUI }
