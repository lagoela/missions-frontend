import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard'
import LoginPopup from '../components/LoginPopup'
import { generateMissions, FALLBACK_MISSIONS, type Mission } from '../api/missions'
import { useAuth } from '../context/AuthContext'

const GUEST_LIMIT = 3
const AUTH_LIMIT = 10

const btnBase = 'font-serif text-sm tracking-widest uppercase transition-colors duration-200 rounded-sm cursor-pointer'
const btnGhost = `${btnBase} text-[#3a3530] border border-[#3a3530]/40 px-6 py-2.5 hover:bg-[#3a3530]/8`
const btnSolid = `${btnBase} text-[#e8e4dc] bg-[#3a3530] px-6 py-2.5 hover:bg-[#2a2520]`

export default function HomePage() {
  const { token, handleLogout } = useAuth()
  const navigate = useNavigate()
  const isAuth = !!token
  const limit = isAuth ? AUTH_LIMIT : GUEST_LIMIT

  const [missions, setMissions] = useState<Mission[]>(FALLBACK_MISSIONS.slice(0, GUEST_LIMIT))
  const [index, setIndex] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [generating, setGenerating] = useState(false)

  const atEnd = index === missions.length - 1

  useEffect(() => {
    let cancelled = false
    generateMissions(token)
      .then((data) => {
        if (!cancelled) { setMissions(data.slice(0, limit)); setIndex(0) }
      })
      .catch(() => {
        if (!cancelled) { setMissions(FALLBACK_MISSIONS.slice(0, Math.min(FALLBACK_MISSIONS.length, limit))); setIndex(0) }
      })
    return () => { cancelled = true }
  }, [token])

  async function handleNext() {
    if (!atEnd) { setIndex((i) => i + 1); return }
    if (!isAuth) { setShowPopup(true); return }
    setGenerating(true)
    try {
      const fresh = await generateMissions(token)
      setMissions(fresh.slice(0, AUTH_LIMIT))
      setIndex(0)
    } catch {
      setIndex(0)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center gap-8 p-8" style={{ backgroundColor: '#d6d0c4' }}>

      <nav className="absolute top-6 right-8">
        {isAuth
          ? <button className={btnGhost} onClick={handleLogout}>Log out</button>
          : <button className={btnGhost} onClick={() => navigate('/login')}>Login</button>
        }
      </nav>

      <header className="flex flex-col items-center gap-2 mb-2">
        <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#3a3530]/60">Daily</p>
        <h1 className="font-serif text-4xl font-bold text-[#1a1a1a] tracking-tight leading-none">Missions</h1>
        <div className="w-12 h-px bg-[#3a3530]/30 mt-1" />
      </header>

      <BookCard {...missions[index]} />

      <p className="font-serif text-xs text-[#3a3530]/40 tracking-widest">
        {index + 1} / {missions.length}
      </p>

      <div className="flex items-center gap-4">
        <button className={btnGhost} onClick={handleNext} disabled={generating}>
          {atEnd && isAuth ? (generating ? 'Generating…' : 'Generate more') : 'New mission'}
        </button>
        <button className={btnSolid} onClick={() => {}}>
          Save mission
        </button>
      </div>

      {showPopup && (
        <LoginPopup
          onLogin={() => { setShowPopup(false); navigate('/login') }}
          onClose={() => setShowPopup(false)}
        />
      )}

    </main>
  )
}
