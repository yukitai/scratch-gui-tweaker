type Nullable<T> = T | null

const nullable = <T>(x: T | undefined): Nullable<T> => {
  return x ?? null
}

const or_undefined = <T>(x: Nullable<T>): T | undefined => {
  return x ?? undefined
}

const is_null = <T>(x: Nullable<T>): x is null => {
  return x === null
}

const has_value = <T>(x: Nullable<T>): x is T => {
  return x !== null
}

export { type Nullable, nullable, or_undefined, is_null, has_value }
