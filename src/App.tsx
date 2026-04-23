import { useState } from 'react'
import BookCard from './components/BookCard'

const missions = [
  {
    title: '1. Fast for 24 hours',
    content: [
      'Hunger exposes who is in control.',
      'Your body will beg. Your mind will negotiate.',
      'Watch how quickly excuses appear.',
      'Discipline begins when you refuse them.',
    ],
  },
  {
    title: '2. Wake before the sun',
    content: [
      'The morning belongs to no one yet.',
      'Rise before the world makes its demands.',
      'An hour of silence is worth three of noise.',
      'What you do first shapes everything after.',
    ],
  },
  {
    title: '3. Carry something heavy',
    content: [
      'Comfort is the enemy of growth.',
      'Load the bar. Walk the distance. Feel the weight.',
      'The body learns what the mind resists.',
      'Strength is built where ease is abandoned.',
    ],
  },
]

export default function App() {
  const [index, setIndex] = useState(0)

  function next() {
    setIndex((i) => (i + 1) % missions.length)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8" style={{ backgroundColor: '#d6d0c4' }}>
      <BookCard {...missions[index]} />
      <button
        onClick={next}
        className="font-serif text-sm tracking-widest uppercase text-[#3a3530] border border-[#3a3530]/40 px-6 py-2.5 rounded-sm hover:bg-[#3a3530]/8 transition-colors duration-200"
      >
        New mission
      </button>
    </main>
  )
}
