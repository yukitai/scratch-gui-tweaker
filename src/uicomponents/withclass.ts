import { UIComponent } from "./uicomponent";

class WithClass extends UIComponent {
  
  component: UIComponent
  className: string

  constructor (component: UIComponent, className: string) {
    super()
    this.component = component
    this.className = className
  }

  render (): HTMLElement {
    const result = this.component.render()
    result.classList.add(this.className)
    return result
  }
}

export {
  WithClass,
}