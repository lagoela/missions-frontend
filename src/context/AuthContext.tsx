import { createContext, useContext, useState } from 'react'

interface AuthContextValue {
  token: string | null
  handleLogin: (token: string) => void
  handleLogout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  function handleLogin(jwt: string) {
    localStorage.setItem('token', jwt)
    setToken(jwt)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
