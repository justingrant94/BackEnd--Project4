const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('bestInGameToken')
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token && options.auth !== false) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.detail || data?.message || data?.Message || 'Something went wrong.'
    throw new Error(message)
  }

  return data
}

export function getPlayers(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return apiRequest(`/basketball/${query ? `?${query}` : ''}`, { auth: false })
}

export function getPlayer(id) {
  return apiRequest(`/basketball/${id}/`, { auth: false })
}

export function getTeams() {
  return apiRequest('/teams/', { auth: false })
}

export function loginUser(payload) {
  return apiRequest('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function registerUser(payload) {
  return apiRequest('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createComment(payload) {
  return apiRequest('/comments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteComment(id) {
  return apiRequest(`/comments/${id}/`, {
    method: 'DELETE',
  })
}

export function getGameSessions() {
  return apiRequest('/games/sessions/')
}

export function saveGameSession(payload) {
  return apiRequest('/games/sessions/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getGameLeaderboard() {
  return apiRequest('/games/leaderboard/')
}

export function getGameStats() {
  return apiRequest('/games/stats/')
}
