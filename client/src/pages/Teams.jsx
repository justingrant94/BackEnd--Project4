import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeams } from '../api/client'
import StatusMessage from '../components/StatusMessage'

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

      {loading && <StatusMessage>Loading teams...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      <div className="team-grid">
        {teams.map((team) => (
          <Link
            to={`/players?team=${team.abbreviation || team.name}`}
            className="team-card"
            key={team.id}
            style={{ '--team-color': team.primary_color || '#111827' }}
          >
            {team.logo && <img src={team.logo} alt="" />}
            <div>
              <p className="eyebrow">{team.abbreviation}</p>
              <h2>{team.name}</h2>
              <p>{team.conference} conference, {team.division} division</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Teams
