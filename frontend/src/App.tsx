import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { fetchHealth, fetchProtected } from './api/client'
import { auth } from './firebase/config'
import { onAuthStateChanged, signInAnonymously, signOut, User } from 'firebase/auth'

function App() {
  const [count, setCount] = useState(0)
  const [apiMessage, setApiMessage] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [protectedMessage, setProtectedMessage] = useState<string | null>(null)
  const [protectedError, setProtectedError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return unsubscribe
  }, [])

  const handleCallApi = async () => {
    setLoading(true)
    setApiError(null)
    try {
      const res = await fetchHealth()
      setApiMessage(res.message)
    } catch (error) {
      setApiMessage(null)
      setApiError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleAnonLogin = async () => {
    setApiError(null)
    setProtectedError(null)
    try {
      await signInAnonymously(auth)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to sign in')
    }
  }

  const handleLogout = async () => {
    setApiError(null)
    setProtectedError(null)
    try {
      await signOut(auth)
      setProtectedMessage(null)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to sign out')
    }
  }

  const handleCallProtected = async () => {
    setProtectedError(null)
    setProtectedMessage(null)
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('You must be logged in to call protected API')
      }
      const token = await currentUser.getIdToken()
      const res = await fetchProtected(token)
      setProtectedMessage(res.message)
    } catch (error) {
      setProtectedError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + API</h1>
      <div className="card">
        <p>
          Auth status:{' '}
          {user ? (
            <>
              Logged in (uid: <code>{user.uid}</code>)
            </>
          ) : (
            'Logged out'
          )}
        </p>
        <button onClick={handleAnonLogin} disabled={!!user}>
          Sign in anonymously
        </button>
        <button onClick={handleLogout} disabled={!user}>
          Sign out
        </button>
        <hr />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button onClick={handleCallApi} disabled={loading}>
          {loading ? 'Calling API...' : 'Call backend /api/health'}
        </button>
        {apiMessage && <p>Backend says: {apiMessage}</p>}
        {apiError && <p style={{ color: 'red' }}>Error: {apiError}</p>}
        <hr />
        <button onClick={handleCallProtected} disabled={!user}>
          Call protected /api/protected
        </button>
        {protectedMessage && <p>Protected: {protectedMessage}</p>}
        {protectedError && <p style={{ color: 'red' }}>Protected error: {protectedError}</p>}
      </div>
      <p className="read-the-docs">Click the button above to test your backend API.</p>
    </>
  )
}

export default App
