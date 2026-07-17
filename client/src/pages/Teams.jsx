import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeams } from '../api/client'
import SafeImage from '../components/SafeImage'
import StatusMessage from '../components/StatusMessage'
import { getTeamThemeClass } from '../lib/teamTheme'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeams() {
      try {
        const data = await getTeams()
        setTeams(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [])

  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">Teams</p>
        <h1>Team directory</h1>
        <p>Browse teams and use the team cards as a route into player discovery.</p>
      </section>

      {loading && (
        <StatusMessage loading title="Loading teams">
          Pulling team records and linked players from the database.
        </StatusMessage>
      )}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && !error && teams.length > 0 && <div className="team-grid">
        {teams.map((team) => (
          <Link
            to={`/players?team=${team.abbreviation || team.name}`}
            className={`team-card ${getTeamThemeClass(team)}`}
            key={team.id}
          >
            <SafeImage className="team-logo" src={team.logo} alt={`${team.name} logo`} fallbackLabel={team.abbreviation || team.name} />
            <div>
              <p className="eyebrow">{team.abbreviation}</p>
              <h2>{team.name}</h2>
              <p>{(team.basketball || []).length} linked players</p>
              <p>{team.conference} conference, {team.division} division</p>
            </div>
          </Link>
        ))}
      </div>}

      {!loading && !error && !teams.length && (
        <StatusMessage type="empty" title="No team data yet">
          We are working on adding teams to the database. Once team records are available, they will appear here.
        </StatusMessage>
      )}
    </main>
  )
}

export default Teams
