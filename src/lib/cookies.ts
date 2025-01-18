import Cookies from "js-cookie"

export function setCookie(key: string, value: string) {
  Cookies.set(key, value, { secure: true, sameSite: "strict", expires: 1 })
}

export function getCookie(key: string) {
  return Cookies.get(key)
}

export function removeCookie(key: string) {
  Cookies.remove(key)
}
