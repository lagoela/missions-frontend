import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard'
import LoginPopup from '../components/LoginPopup'
import { generateMissions, FALLBACK_MISSIONS, type Mission } from '../api/missions'
import { useAuth } from '../context/AuthContext'

const GUEST_LIMIT = 3
const AUTH_LIMIT = 10
const SAVED_KEY = 'saved_missions'

const btnBase = 'font-serif text-sm tracking-widest uppercase transition-colors duration-200 rounded-sm cursor-pointer'
const btnGhost = `${btnBase} text-[#3a3530] border border-[#3a3530]/40 px-6 py-2.5 hover:bg-[#3a3530]/8`
const btnSolid = `${btnBase} text-[#e8e4dc] bg-[#3a3530] px-6 py-2.5 hover:bg-[#2a2520]`

function loadSaved(): Mission[] {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]') } catch { return [] }
}

function persistSaved(missions: Mission[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(missions))
}

type Tab = 'missions' | 'saved'

export default function HomePage() {
  const { token, handleLogout } = useAuth()
  const navigate = useNavigate()
  const isAuth = !!token
  const limit = isAuth ? AUTH_LIMIT : GUEST_LIMIT

  const [tab, setTab] = useState<Tab>('missions')
  const [missions, setMissions] = useState<Mission[]>(FALLBACK_MISSIONS.slice(0, GUEST_LIMIT))
  const [index, setIndex] = useState(0)
  const [saved, setSaved] = useState<Mission[]>(loadSaved)
  const [showPopup, setShowPopup] = useState(false)
  const [generating, setGenerating] = useState(false)

  const atEnd = index === missions.length - 1
  const currentMission = missions[index]
  const alreadySaved = saved.some((m) => m.title === currentMission?.title)

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

  // Reset to missions tab on logout
  useEffect(() => {
    if (!isAuth) setTab('missions')
  }, [isAuth])

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

  function handleSave() {
    if (alreadySaved) return
    const updated = [...saved, currentMission]
    setSaved(updated)
    persistSaved(updated)
  }

  function handleUnsave(title: string) {
    const updated = saved.filter((m) => m.title !== title)
    setSaved(updated)
    persistSaved(updated)
  }

  return (
    <main
      className="relative min-h-screen flex flex-col items-center p-8 pt-20"
      style={{ backgroundColor: '#d6d0c4' }}
    >
      <nav className="absolute top-6 right-8">
        {isAuth
          ? <button className={btnGhost} onClick={handleLogout}>Log out</button>
          : <button className={btnGhost} onClick={() => navigate('/login')}>Login</button>
        }
      </nav>

      <header className="flex flex-col items-center gap-2 mb-8">
        <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#3a3530]/60">Daily</p>
        <h1 className="font-serif text-4xl font-bold text-[#1a1a1a] tracking-tight leading-none">Missions</h1>
        <div className="w-12 h-px bg-[#3a3530]/30 mt-1" />
      </header>

      {isAuth && (
        <div className="flex items-center gap-8 mb-10">
          {(['missions', 'saved'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-serif text-xs tracking-[0.25em] uppercase pb-1.5 border-b transition-colors duration-200 cursor-pointer ${
                tab === t
                  ? 'text-[#1a1a1a] border-[#1a1a1a]'
                  : 'text-[#3a3530]/40 border-transparent hover:text-[#3a3530]/70'
              }`}
            >
              {t === 'saved' ? `Saved (${saved.length})` : t}
            </button>
          ))}
        </div>
      )}

      {tab === 'missions' && (
        <div className="flex flex-col items-center gap-8">
          <BookCard {...currentMission} />

          <p className="font-serif text-xs text-[#3a3530]/40 tracking-widest">
            {index + 1} / {missions.length}
          </p>

          <div className="flex items-center gap-4">
            <button className={btnGhost} onClick={handleNext} disabled={generating}>
              {atEnd && isAuth ? (generating ? 'Generating…' : 'Generate more') : 'New mission'}
            </button>
            <button
              className={btnSolid + (alreadySaved ? ' opacity-50 cursor-not-allowed' : '')}
              onClick={handleSave}
              disabled={alreadySaved}
            >
              {alreadySaved ? 'Saved' : 'Save mission'}
            </button>
          </div>
        </div>
      )}

      {tab === 'saved' && (
        <div className="flex flex-col items-center gap-6 w-full">
          {saved.length === 0 ? (
            <p className="font-serif text-[17px] text-[#3a3530]/50 leading-relaxed mt-8">
              No saved missions yet.
            </p>
          ) : (
            saved.map((mission) => (
              <div key={mission.title} className="relative group">
                <BookCard {...mission} />
                <button
                  onClick={() => handleUnsave(mission.title)}
                  className="absolute top-4 right-4 font-serif text-xs tracking-[0.15em] uppercase text-[#3a3530]/30 hover:text-red-700 transition-colors duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {showPopup && (
        <LoginPopup
          onLogin={() => { setShowPopup(false); navigate('/login') }}
          onClose={() => setShowPopup(false)}
        />
      )}
    </main>
  )
}
