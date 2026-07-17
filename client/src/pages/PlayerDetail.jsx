import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPlayer } from '../api/client'
import CommentSection from '../components/CommentSection'
import SafeImage from '../components/SafeImage'
import StatsPanel from '../components/StatsPanel'
import StatusMessage from '../components/StatusMessage'
import TeamChip from '../components/TeamChip'

function PlayerDetail() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadPlayer() {
    setLoading(true)
    setError('')

    try {
      const data = await getPlayer(id)
      setPlayer(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlayer()
  }, [id])

  if (loading) {
    return (
      <main className="page-shell">
        <StatusMessage loading title="Loading player">
          Pulling this profile, stats, teams, and comments from the database.
        </StatusMessage>
      </main>
    )
  }

  if (error) {
    return <main className="page-shell"><StatusMessage type="error">{error}</StatusMessage></main>
  }

  if (!player) {
    return (
      <main className="page-shell">
        <StatusMessage type="empty" title="Player not found">
          This player is not in the database yet. We are working on adding more profiles and career records.
        </StatusMessage>
      </main>
    )
  }

  return (
    <main className="detail-shell">
      <Link className="back-link" to="/players">Back to players</Link>

      <section className="player-detail">
        <div className="player-detail__media">
          <SafeImage src={player.image} alt={player.names} fallbackLabel={player.names} />
        </div>

        <div className="player-detail__content">
          <p className="eyebrow">{player.retired ? 'Retired legend' : 'Active player'}</p>
          <h1>{player.names}</h1>
          <div className="team-chip-list">
            {(player.teams || []).map((team) => <TeamChip key={team.id} team={team} />)}
          </div>
          {!(player.teams || []).length && (
            <StatusMessage type="empty" title="Team history coming soon">
              We are working on adding team links for this player.
            </StatusMessage>
          )}
          <p>{player.description}</p>

          <dl className="bio-list">
            <div><dt>Position</dt><dd>{player.position || 'N/A'}</dd></div>
            <div><dt>Height</dt><dd>{player.height || 'N/A'}</dd></div>
            <div><dt>Nationality</dt><dd>{player.nationality || 'N/A'}</dd></div>
            <div><dt>Age</dt><dd>{player.age || 'N/A'}</dd></div>
          </dl>
        </div>
      </section>

      <StatsPanel player={player} />
      <CommentSection playerId={player.id} comments={player.comments || []} onChanged={loadPlayer} />
    </main>
  )
}

export default PlayerDetail
