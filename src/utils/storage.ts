import { TariError } from "../types/error"
import { Result, err, ok } from "../types/result"

class CachedStorage {
  cache: Record<string, string>

  constructor() {
    this.cache = {}
  }

  get_item(key: string): Result<string, TariError> {
    if (this.cache[key]) {
      return ok(this.cache[key])
    }
    try {
      return ok(localStorage.getItem(key) ?? "")
    } catch (e) {
      return err(e)
    }
  }

  set_item(key: string, value: string): Result<null, TariError> {
    try {
      localStorage.setItem(key, value)
      this.cache[key] = value
      return ok(null)
    } catch (e) {
      return err(e)
    }
  }

  has_item(key: string): Result<boolean, TariError> {
    try {
      return ok(localStorage.getItem(key) !== null)
    } catch (e) {
      return err(e)
    }
  }
}

export { CachedStorage }
