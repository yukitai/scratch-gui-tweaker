import { Nullable } from "./nullable"

type Result<T, E> = [Nullable<E>, Nullable<T>]

const is_ok = <T, E>(x: Result<T, E>): boolean => {
  return x[0] === null
}

const is_err = <T, E>(x: Result<T, E>): boolean => {
  return x[0] !== null
}

const ok = <T, E>(x: T): Result<T, E> => {
  return [null, x]
}

const err = <T, E>(x: E): Result<T, E> => {
  return [x, null]
}

const unsafe_unwrap = <T, E>(x: Result<T, E>): T => {
  return x[1] as T
}

const unsafe_unwrap_err = <T, E>(x: Result<T, E>): E => {
  return x[0] as E
}

const unwrap = <T, E>(x: Result<T, E>): T => {
  if (!x[1]) {
    console.error(x[0])
    throw new TypeError("trying to call unwrap on Result.err()")
  }
  return x[1]
}

const unwrap_err = <T, E>(x: Result<T, E>): E => {
  if (!x[0]) {
    throw new TypeError("trying to call unwrap_err on Result.ok()")
  }
  return x[0]
}

export {
  type Result,
  is_ok,
  is_err,
  ok,
  err,
  unsafe_unwrap,
  unsafe_unwrap_err,
  unwrap,
  unwrap_err,
}