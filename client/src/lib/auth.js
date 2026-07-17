const TOKEN_KEY = 'bestInGameToken'
const USER_KEY = 'bestInGameUser'

export function saveSession(token, user = null) {
  localStorage.setItem(TOKEN_KEY, token)

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY)

  if (!user) {
    return null
  }

  try {
    return JSON.parse(user)
  } catch (_error) {
    return null
  }
}
