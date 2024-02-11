import { ShortcutInfo, TariId } from "./core"

enum Key {
  _0 = "0",
  _1 = "1",
  _2 = "2",
  _3 = "3",
  _4 = "4",
  _5 = "5",
  _6 = "6",
  _7 = "7",
  _8 = "8",
  _9 = "9",
  Shift_0 = "!",
  Shift_1 = "@",
  Shift_2 = "#",
  Shift_3 = "$",
  Shift_4 = "%",
  Shift_5 = "^",
  Shift_6 = "&",
  Shift_7 = "*",
  Shift_8 = "(",
  Shift_9 = ")",
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
  F = "f",
  G = "g",
  H = "h",
  I = "i",
  J = "j",
  K = "k",
  L = "l",
  M = "m",
  N = "n",
  O = "o",
  P = "p",
  Q = "q",
  R = "r",
  S = "s",
  T = "t",
  U = "u",
  V = "v",
  W = "w",
  X = "x",
  Y = "y",
  Z = "z",
  Shift_A = "A",
  Shift_B = "B",
  Shift_C = "C",
  Shift_D = "D",
  Shift_E = "E",
  Shift_F = "F",
  Shift_G = "G",
  Shift_H = "H",
  Shift_I = "I",
  Shift_J = "J",
  Shift_K = "K",
  Shift_L = "L",
  Shift_M = "M",
  Shift_N = "N",
  Shift_O = "O",
  Shift_P = "P",
  Shift_Q = "Q",
  Shift_R = "R",
  Shift_S = "S",
  Shift_T = "T",
  Shift_U = "U",
  Shift_V = "V",
  Shift_W = "W",
  Shift_X = "X",
  Shift_Y = "Y",
  Shift_Z = "Z",
  Control = "Control",
  Shift = "Shift",
  Alt = "Alt",
  Tab = "Tab",
  Escape = "Escape",
  Backspace = "Backspace",
  CapsLock = "CapsLock",
  Enter = "Enter",
  Meta = "Meta",
  ContextMenu = "ContextMenu",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  Insert = "Insert",
  Delete = "Delete",
  Home = "Home",
  PageUp = "PageUp",
  PageDown = "PageDown",
  End = "End",
  Backquote = "`",
  Add = "+",
  Minus = "-",
  Star = "*",
  Equal = "=",
  BracketLeft = "[",
  BracketRight = "]",
  Backslash = "\\",
  Semicolon = ";",
  Quote = "'",
  Comma = ",",
  Period = ".",
  Slash = "/",
  Shift_Backquote = "~",
  Shift_Minus = "_",
  Shift_Equal = "+",
  Shift_BracketLeft = "{",
  Shift_BracketRight = "}",
  Shift_Backslash = "|",
  Shift_Semicolon = ":",
  Shift_Quote = '"',
  Shift_Comma = "<",
  Shift_Period = ">",
  Shift_Slash = "?",
  Space = " ",
}

interface Shortcut {
  key: Key[]
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
  meta?: boolean
}

class ShortcutsManager {
  is_key_down: Record<string, boolean>
  shortcuts: Record<TariId, ShortcutInfo>

  constructor(el: HTMLElement) {
    this.is_key_down = {}
    this.shortcuts = {}

    el.addEventListener("keydown", e => {
      this.is_key_down[e.key] = true
    })
    el.addEventListener("keyup", e => {
      if (this.process_shortcuts(e)) {
        console.log("Prevented!")
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
      }
      this.is_key_down[e.key] = false
    })
  }

  process_shortcuts(e: KeyboardEvent): boolean {
    for (const shortcut of Object.values(this.shortcuts)) {
      if (this.is_match(shortcut.shortcut, e)) {
        return shortcut.handler() == true
      }
    }
    return false
  }

  is_match(shortcut: Shortcut, e: KeyboardEvent): boolean {
    if (
      (shortcut.alt && !e.altKey) ||
      (shortcut.ctrl && !e.ctrlKey) ||
      (shortcut.shift && !e.shiftKey) ||
      (shortcut.meta && !e.metaKey)
    ) {
      return false
    }
    for (const key of shortcut.key) {
      if (!this.is_key_down[key]) {
        return false
      }
    }
    return true
  }
}

export { type Shortcut, Key, ShortcutsManager }
