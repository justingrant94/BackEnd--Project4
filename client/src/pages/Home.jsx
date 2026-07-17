import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlayers, getTeams } from '../api/client'
import PlayerCard from '../components/PlayerCard'
import SafeImage from '../components/SafeImage'
import StatusMessage from '../components/StatusMessage'

function Home() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHome() {
      try {
        const [playerData, teamData] = await Promise.all([
          getPlayers({ page_size: 8, sort: '-championships' }),
          getTeams(),
        ])
        setPlayers(playerData.results || playerData)
        setTeams(teamData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHome()
  }, [])

  const featured = players[0]
  const activeCount = players.filter((player) => !player.retired).length
  const retiredCount = players.filter((player) => player.retired).length

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Player directory</p>
          <h1>Explore the greats, the stars, and the next era.</h1>
          <p>
            A sharper home for the Best In The Game database, built around real player records, team context, and quick discovery.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/players">Browse players</Link>
            <Link className="button button--ghost" to="/teams">View teams</Link>
          </div>
        </div>

        {featured && (
          <div className="featured-panel">
            <SafeImage src={featured.image} alt={featured.names} fallbackLabel={featured.names} />
            <div>
              <p className="eyebrow">Featured legend</p>
              <h2>{featured.names}</h2>
              <p>{featured.position}</p>
            </div>
          </div>
        )}
      </section>

      <section className="stat-strip" aria-label="Directory summary">
        <div><span>{players.length}</span><p>Featured records</p></div>
        <div><span>{activeCount}</span><p>Active in preview</p></div>
        <div><span>{retiredCount}</span><p>Retired legends</p></div>
        <div><span>{teams.length}</span><p>Teams loaded</p></div>
      </section>

      <section className="page-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Featured players</p>
            <h2>Start with the championship names</h2>
          </div>
          <Link to="/players">Open full directory</Link>
        </div>

        {loading && <StatusMessage>Loading players...</StatusMessage>}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        <div className="player-grid">
          {players.slice(0, 6).map((player) => <PlayerCard key={player.id} player={player} teams={teams} featured />)}
        </div>
      </section>
    </main>
  )
}

export default Home
