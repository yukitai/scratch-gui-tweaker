type Nullable<T> = T | null

const is_null = <T>(x: Nullable<T>): x is null => {
  return x === null
}

const has_value = <T>(x: Nullable<T>): x is T => {
  return x !== null
}

export {
  type Nullable,
  is_null,
  has_value,
}