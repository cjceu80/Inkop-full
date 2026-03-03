import { auth } from '../firebase/config'

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('Not authenticated')
  }

  const token = await currentUser.getIdToken()
  const headers = new Headers(init.headers || {})
  headers.set('Authorization', `Bearer ${token}`)

  return fetch(input, { ...init, headers })
}