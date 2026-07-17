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

        {loading && (
          <div className="featured-panel featured-panel--loading">
            <StatusMessage loading title="Loading featured player">
              Pulling the latest player records from the database.
            </StatusMessage>
          </div>
        )}

        {!loading && featured && (
          <div className="featured-panel">
            <SafeImage src={featured.image} alt={featured.names} fallbackLabel={featured.names} />
            <div>
              <p className="eyebrow">Featured legend</p>
              <h2>{featured.names}</h2>
              <p>{featured.position}</p>
            </div>
          </div>
        )}

        {!loading && !featured && !error && (
          <div className="featured-panel featured-panel--empty">
            <StatusMessage type="empty" title="No featured player yet">
              We are working on adding more players to the database, so this spotlight will appear as the records grow.
            </StatusMessage>
          </div>
        )}
      </section>

      <section className="stat-strip" aria-label="Directory summary">
        <div><span>{players.length}</span><p>Previewed Players</p></div>
        <div><span>{activeCount}</span><p>Active Players</p></div>
        <div><span>{retiredCount}</span><p>Retired Legends</p></div>
        <div><span>{teams.length}</span><p>Teams</p></div>
      </section>

      <section className="page-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Featured Players</p>
            <h2>Championship pedigree, all-time impact, and modern stars.</h2>
          </div>
          <Link className="section-action" to="/players">View all players</Link>
        </div>

        {loading && (
          <StatusMessage loading title="Loading players">
            Pulling player profiles, career stats, and team links from the database.
          </StatusMessage>
        )}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {!loading && !error && players.length > 0 && (
          <div className="player-grid">
            {players.slice(0, 6).map((player) => <PlayerCard key={player.id} player={player} teams={teams} featured />)}
          </div>
        )}
        {!loading && !error && !players.length && (
          <StatusMessage type="empty" title="No player data yet">
            We are working on adding more players to the database. Check back soon for new profiles and career records.
          </StatusMessage>
        )}
      </section>
    </main>
  )
}

export default Home
