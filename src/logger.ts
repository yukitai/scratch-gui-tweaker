class Logger {

  static readonly STYLE1 = "color: #ffffff;"
                         + "font-weight: 700;"
                         + "background-color: #ff7f7f;"
                         + "padding: 0.1rem;"
  static readonly STYLE2 = ""

  static log (fmt: string, ...args: string[]) {
    console.log(
      `%c Tari Loader %c ${fmt} %c`,
      Logger.STYLE1,
      Logger.STYLE2,
      ...args,
      ""
    )
  }

  static warn (fmt: string, ...args: string[]) {
    console.warn(
      `%c Tari Loader %c ${fmt} %c`,
      Logger.STYLE1,
      Logger.STYLE2,
      ...args,
      ""
    )
  }

  static error (fmt: string, ...args: string[]) {
    console.error(
      `%c Tari Loader %c ${fmt} %c`,
      Logger.STYLE1,
      Logger.STYLE2,
      ...args,
      ""
    )
  }

  static info (fmt: string, ...args: string[]) {
    console.info(
      `%c Tari Loader %c ${fmt} %c`,
      Logger.STYLE1,
      Logger.STYLE2,
      ...args,
      ""
    )
  }
}

export {
  Logger,
}