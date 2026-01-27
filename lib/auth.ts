export const auth = {
  isLoggedIn(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem("authToken") === "1"
  },

  login(name: string, email: string) {
    localStorage.setItem("authToken", "1")
    localStorage.setItem("authName", name)
    localStorage.setItem("authEmail", email)
  },

  logout() {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authName")
    localStorage.removeItem("authEmail")
  },

  getUser() {
    if (typeof window === "undefined") return { name: "", email: "" }
    return {
      name: localStorage.getItem("authName") || "",
      email: localStorage.getItem("authEmail") || "",
    }
  },
}
