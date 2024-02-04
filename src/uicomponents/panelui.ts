import { Tari } from "..";
import { InputTip, MatchType } from "../core";
import { is_err, is_ok, unwrap, unwrap_err } from "../types/result";
import { InputUI } from "./inputui";
import { UIComponent, h } from "./uicomponent";

type Tip = {
  from: string,
  value: string,
  string: string,
  description: string,
}

class PanelUI extends UIComponent {

  search: UIComponent
  $input: HTMLInputElement
  $tips_container: HTMLDivElement
  close: () => void

  constructor (close: () => void) {
    super()
    this.search = new InputUI("type command here ...")
    this.close = close
  }

  tip_item (
    tip: Tip,
    input_handler: () => void,  
  ) {
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
          this.$input.value = tip.value
          input_handler()
        }
      }
    )
  }

  static build_tips (tips: InputTip[]): Tip[] {
    return tips.map(PanelUI.build_tip)
  }

  static build_tip (tip: InputTip): Tip {
    const string = tip.matches.map(match => {
      switch (match.type) {
        case MatchType.Unmatched:
          return match.value
        case MatchType.Matched:
          return `<span class="tari-highlight">${match.value}</span>`
      }
    }).join("")
    return {
      value: tip.value,
      from: tip.from,
      description: tip.description ?? "",
      string,
    }
  }

  render (): HTMLElement {
    this.$input = this.search.render() as HTMLInputElement
    const tips_list = []
    this.$tips_container = h(
      "div", "tari-tips",
      [ h("ul", "tari-list", tips_list) ]
    ) as HTMLDivElement

    const input_handler = () => {
      const content = this.$input.value
      const tips = PanelUI.build_tips(Tari.get_input_tips(content))
      const tips_list = tips.map(tip => this.tip_item(tip, input_handler))
      this.$tips_container.innerHTML = ""
      this.$tips_container.appendChild(
        h("ul", "tari-list", tips_list)
      )
    }

    const keyup_handler = (e: KeyboardEvent) => {
      if (e.key !== "Enter") {
        return
      }
      const result = Tari.run_command(this.$input.value)
      if (is_ok(result)) {
        this.close()
      } else {
        this.$tips_container.innerHTML = `\
<div class="tari-error"><span class="tari-highlight">error:</span> <span>${
  unwrap_err(result).message
}</span></div>`
      }
    }

    this.$input.oninput = input_handler
    this.$input.onkeyup = keyup_handler

    return h(
      "div", "tari-search",
      [
        this.$input,
        this.$tips_container,
      ]
    )
  }
}

export {
  PanelUI,
}