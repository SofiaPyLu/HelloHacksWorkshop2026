import { useState } from 'react'
import './App.css'

const types = [
  { name: 'Fire', color: 'bg-orange-100 text-orange-800 ring-orange-200' },
  { name: 'Water', color: 'bg-sky-100 text-sky-800 ring-sky-200' },
  { name: 'Grass', color: 'bg-green-100 text-green-800 ring-green-200' },
  { name: 'Ground', color: 'bg-amber-100 text-amber-900 ring-amber-200' },
]

function formatTypeNames(names) {
  if (names.length < 2) return names[0] || 'no types'
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

function App() {
  const [selectedType, setSelectedType] = useState('')
  const [matchup, setMatchup] = useState(null)

  async function getMatchup(type) {
    try {
      const response = await fetch(
        `http://localhost:5001/api/type/${encodeURIComponent(type.toLowerCase())}`,
      )

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Could not get type matchup:', error)
      return { error: 'Could not load the type matchup. Is the backend running?' }
    }
  }

  async function handleTypeClick(type) {
    setSelectedType(type)
    setMatchup(null)
    setMatchup(await getMatchup(type))
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4 py-12 text-slate-800">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
        <div className="mb-7 flex items-center gap-3">
          <span aria-hidden="true" className="pokeball-mark" />
          <span className="text-sm font-semibold tracking-wide text-red-600">POKÉMON BATTLE ASSISTANT!!!</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose a type</h1>
        <p className="mt-3 text-slate-600">What type of Pokémon are you fighting?</p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {types.map(({ name, color }) => (
            <button
              key={name}
              type="button"
              aria-pressed={selectedType === name}
              onClick={() => handleTypeClick(name)}
              className={`rounded-xl px-4 py-3 font-semibold ring-1 ring-inset transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${color} ${selectedType === name ? 'selected-type' : ''}`}
            >
              {name}
            </button>
          ))}
        </div>

        <p
          aria-live="polite"
          className={`mt-6 min-h-6 ${selectedType ? `text-base font-bold ${types.find(({ name }) => name === selectedType)?.color.split(' ')[1]}` : 'text-sm text-slate-500'}`}
        >
          {!selectedType && 'Select a type to get started.'}
          {selectedType && !matchup && 'Loading matchup…'}
          {matchup?.error && matchup.error}
          {matchup && !matchup.error && (
            <span className="block space-y-1">
              <span className="block">
                {matchup.double_damage_from.length
                  ? `${formatTypeNames(matchup.double_damage_from)} moves deal double damage to ${selectedType}.`
                  : `${selectedType} has no listed weaknesses.`}
              </span>
              <span className="block">
                {matchup.half_damage_to.length
                  ? `${selectedType}-type moves deal half damage to ${formatTypeNames(matchup.half_damage_to)} Pokémon.`
                  : `${selectedType}-type moves have no listed resistances.`}
              </span>
            </span>
          )}
        </p>
      </section>
    </main>
  )
}

export default App
