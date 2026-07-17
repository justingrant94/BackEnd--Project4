import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPlayers, getTeams } from '../api/client'
import FilterBar from '../components/FilterBar'
import PlayerCard from '../components/PlayerCard'
import StatusMessage from '../components/StatusMessage'

const defaultFilters = {
  search: '',
  retired: '',
  position: '',
  team: '',
  sort: 'name',
  page: 1,
}

function Players() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    ...defaultFilters,
    team: searchParams.get('team') || '',
  })
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTeams().then(setTeams).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    async function loadPlayers() {
      setLoading(true)
      setError('')

      try {
        const data = await getPlayers({ ...filters, page_size: 12 })
        setPlayers(data.results || data)
        setCount(data.count || data.length || 0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(count / 12))

  function changePage(direction) {
    setFilters((current) => ({
      ...current,
      page: Math.min(totalPages, Math.max(1, current.page + direction)),
    }))
  }

  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">Directory</p>
        <h1>Players</h1>
        <p>Search, filter and compare the players currently loaded from your Django seed data.</p>
      </section>

      <FilterBar
        filters={filters}
        teams={teams}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      <div className="results-meta">
        <span>{count} players found</span>
        <span>Page {filters.page} of {totalPages}</span>
      </div>

      {loading && <StatusMessage>Loading players...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && !error && (
        <div className="player-grid">
          {players.map((player) => <PlayerCard key={player.id} player={player} teams={teams} />)}
        </div>
      )}

      {!loading && !players.length && !error && <StatusMessage>No players match those filters.</StatusMessage>}

      <div className="pagination-controls">
        <button className="button button--ghost" type="button" disabled={filters.page <= 1} onClick={() => changePage(-1)}>Previous</button>
        <button className="button" type="button" disabled={filters.page >= totalPages} onClick={() => changePage(1)}>Next</button>
      </div>
    </main>
  )
}

export default Players
