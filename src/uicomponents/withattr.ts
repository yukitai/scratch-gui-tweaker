import { UIComponent } from "./uicomponent"

class WithAttr extends UIComponent {
  component: UIComponent
  attrs: Record<string, string>

  constructor(component: UIComponent, attrs: Record<string, string>) {
    super()
    this.component = component
    this.attrs = attrs
  }

  render(): HTMLElement {
    const result = this.component.render()
    Object.keys(this.attrs).forEach(k => {
      result[k] = this.attrs[k]
    })
    return result
  }
}

export { WithAttr }
