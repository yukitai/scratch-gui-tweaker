abstract class UIComponent {
  abstract render (): HTMLElement
}

const h = (
  tag: string,
  classList: string,
  inner: HTMLElement[],
  attrs?: Record<string, any>
): HTMLElement => {
  const el = document.createElement(tag)
  el.classList.add(classList)
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