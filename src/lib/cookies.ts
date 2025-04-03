import Cookies from "js-cookie"

export function setCookie(key: string, value: string) {
  Cookies.set(key, value, {
    expires: 1, // 1 dia
    path: "/", // Importante para o cookie ser acessível em toda a aplicação
    sameSite: "lax",
  })
}
export function getCookie(key: string) {
  return Cookies.get(key)
}

export function removeCookie(key: string) {
  Cookies.remove(key)
}
