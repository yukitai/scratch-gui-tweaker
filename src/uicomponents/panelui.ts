import { Tari } from "../core"
import { UIComponent, h } from "./uicomponent"

type PanelItem = {
  key: string
  html: (highlighted: HTMLSpanElement) => HTMLElement
}

type RenderedPanelItem = {
  key: string
  rendered: string
  rank: number
  html: (highlighted: HTMLSpanElement) => HTMLElement
}

class PanelUI extends UIComponent {
  MAX_SHOW_COUNT: number
  search: UIComponent
  $input: HTMLInputElement
  $container: HTMLDivElement
  get_list: () => PanelItem[]
  press_enter: () => void
  close: () => void

  constructor(
    max_show_count: number,
    search: UIComponent,
    get_list: () => PanelItem[],
    press_enter: () => void,
    close: () => void,
  ) {
    super()
    this.MAX_SHOW_COUNT = max_show_count
    this.search = search
    this.get_list = get_list
    this.press_enter = press_enter
    this.close = close
  }

  static close_panel() {
    Tari.UI.request_lock(ui => {
      ui.render()
    })
  }

  render_item(item: RenderedPanelItem, input_handler: () => void) {
    const highlighted = h("span", "", [])
    highlighted.innerHTML = item.rendered
    return h("li", "tari-item", [item.html(highlighted)], {
      onclick: () => {
        this.$input.value = item.key
        input_handler()
      },
    })
  }

  highlight(target: string, items: PanelItem[]): RenderedPanelItem[] {
    return items
      .map(item => {
        const key = item.key
        const parts = [{ type: "unmatched", value: "" }]
        let rank = 1
        let i = 0
        let j = 0
        let score = 0
        let jumped = 0
        while (i < target.length && j < key.length) {
          if (target[i] === key[j]) {
            if (score === 0) {
              parts.push({ type: "matched", value: "" })
            }
            rank += ++score
            ++i
          } else {
            if (score > 0) {
              parts.push({ type: "unmatched", value: "" })
            }
            score = 0
            ++jumped
          }
          parts[parts.length - 1].value += key[j++]
        }
        if (j < key.length) {
          parts.push({ type: "unmatched", value: key.slice(j) })
        }
        rank += 8192 >> jumped
        if (target.length === key.length) {
          rank += 16384
        }
        if (i < target.length) {
          rank = 0
        }
        const rendered = parts
          .map(part => {
            switch (part.type) {
              case "matched":
                return `<span class="tari-highlight">${part.value}</span>`
              default:
                return part.value
            }
          })
          .join("")
        return {
          rendered,
          rank,
          ...item,
        }
      })
      .filter(x => x.rank > 0)
      .toSorted((a, b) => b.rank - a.rank)
      .slice(0, this.MAX_SHOW_COUNT)
  }

  update() {
    const content = this.$input.value
    const items = this.highlight(content, this.get_list())
    const items_list = items.map(item => {
      return this.render_item(item, () => this.update())
    })
    this.$container.innerHTML = ""
    this.$container.appendChild(h("ul", "tari-list", items_list))
  }

  render(): HTMLElement {
    this.$input = this.search.render() as HTMLInputElement
    const items_list = []
    this.$container = h("div", "tari-tips", [
      h("ul", "tari-list", items_list),
    ]) as HTMLDivElement

    const keyup_handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter") {
        return
      }
      this.press_enter()
    }

    this.$input.oninput = () => this.update()
    this.$input.onkeyup = keyup_handler

    this.update()

    return h("div", "tari-search", [this.$input, this.$container])
  }
}

export { type PanelItem, PanelUI }
