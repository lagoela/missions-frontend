import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const noiseTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`

export default function LoginPage() {
  const { handleLogin } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const token = await login(username, password)
      handleLogin(token)
      navigate('/')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#d6d0c4' }}>
      <div
        className="w-100 px-10 py-10 rounded-sm border-l border-black/8 shadow-[2px_2px_6px_rgba(0,0,0,0.15),inset_0_0_40px_rgba(0,0,0,0.04)] flex flex-col gap-7"
        style={{ backgroundColor: '#e8e4dc', backgroundImage: noiseTexture }}
      >
        <header className="flex flex-col items-center gap-2">
          <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#3a3530]/60">Welcome back</p>
          <h1 className="font-serif text-3xl font-bold text-[#1a1a1a] tracking-tight leading-none">Missions</h1>
          <div className="w-10 h-px bg-[#3a3530]/30 mt-1" />
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-serif text-xs tracking-[0.2em] uppercase text-[#3a3530]/70">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="bg-transparent border-b border-[#3a3530]/30 py-1.5 font-serif text-[15px] text-[#1a1a1a] placeholder:text-[#3a3530]/30 outline-none focus:border-[#3a3530]/70 transition-colors duration-200"
              placeholder="enter username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-serif text-xs tracking-[0.2em] uppercase text-[#3a3530]/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-transparent border-b border-[#3a3530]/30 py-1.5 font-serif text-[15px] text-[#1a1a1a] placeholder:text-[#3a3530]/30 outline-none focus:border-[#3a3530]/70 transition-colors duration-200"
              placeholder="enter password"
            />
          </div>

          {error && <p className="font-serif text-xs text-red-700 tracking-wide">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 font-serif text-sm tracking-widest uppercase text-[#e8e4dc] bg-[#3a3530] px-6 py-2.5 rounded-sm hover:bg-[#2a2520] transition-colors duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Entering…' : 'Enter'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xs text-[#3a3530]/50">No account?</span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-serif text-xs tracking-[0.15em] uppercase text-[#3a3530]/70 hover:text-[#3a3530] underline underline-offset-2 transition-colors duration-200 cursor-pointer"
            >
              Sign up
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-serif text-xs tracking-[0.2em] uppercase text-[#3a3530]/40 hover:text-[#3a3530]/70 transition-colors duration-200 cursor-pointer"
          >
            ← Back to missions
          </button>
        </div>
      </div>
    </main>
  )
}
