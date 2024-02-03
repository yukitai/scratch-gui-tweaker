import { InputUI } from "./inputui";
import { UIComponent, h } from "./uicomponent";

type Tip = {
  from: string,
  value: string,
  string: string,
}

class PanelUI extends UIComponent {

  search: UIComponent

  constructor () {
    super()
    this.search = new InputUI("type command here ...")
  }

  static tip_item (tip: Tip, $input: HTMLInputElement) {
    const highlighted = h("span", "", [])
    highlighted.innerHTML = tip.string
    return h(
      "li", "tari-item tari-tip tari-text-btn tari-tip-btn",
      [
        highlighted,
        h("span", "tari-comment", [tip.from]),
      ],
      {
        onclick: () => {
          $input.value = tip.value
        }
      }
    )
  }

  render (): HTMLElement {
    const $input = this.search.render() as HTMLInputElement
    const tips_list = [
      { from: "fast-jump", value: "jumpif", string: `<span class="tari-highlight">jump</span>if` },
      { from: "fast-jump", value: "jumpto", string: `<span class="tari-highlight">jump</span>to` },
      { from: "fast-jump", value: "jumpto menu", string: `<span class="tari-highlight">jump</span>to menu` },
    ].map(tip => PanelUI.tip_item(tip, $input))
    const $tips = h("ul", "tari-list", tips_list)
    return h(
      "div", "tari-search",
      [
        $input,
        h(
          "div", "tari-tips",
          [ $tips ]
        ),
      ]
    )
  }
}

export {
  PanelUI,
}