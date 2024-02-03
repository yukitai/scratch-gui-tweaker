abstract class UIComponent {
  abstract render (): HTMLElement
}

const h = (
  tag: string,
  classList: string,
  inner: (HTMLElement | string)[],
  attrs?: Record<string, any>
): HTMLElement => {
  const el = document.createElement(tag)
  classList !== "" && el.classList.add(...classList.split(" "))
  el.append(...inner)
  if (attrs) {
    Object.keys(attrs).forEach(k => {
      el[k] = attrs[k]
    })
  }
  return el
}

export {
  UIComponent,
  h
}