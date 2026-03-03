export interface ApiHealthResponse {
  status: string
  message: string
}

const DEFAULT_API_BASE_URL = '/api'

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined
  return envUrl && envUrl.trim().length > 0 ? envUrl : DEFAULT_API_BASE_URL
}

export async function fetchHealth(): Promise<ApiHealthResponse> {
  const baseUrl = getApiBaseUrl()
  const res = await fetch(`${baseUrl}/health`)

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`)
  }

  return (await res.json()) as ApiHealthResponse
}

export interface ProtectedResponse {
  message: string
}

export async function fetchProtected(token: string): Promise<ProtectedResponse> {
  const baseUrl = getApiBaseUrl()
  const res = await fetch(`${baseUrl}/protected`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Protected API failed with status ${res.status}`)
  }

  return (await res.json()) as ProtectedResponse
}


