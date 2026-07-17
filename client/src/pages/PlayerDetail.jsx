import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPlayer } from '../api/client'
import CommentSection from '../components/CommentSection'
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
    return <main className="page-shell"><StatusMessage>Loading player...</StatusMessage></main>
  }

  if (error) {
    return <main className="page-shell"><StatusMessage type="error">{error}</StatusMessage></main>
  }

  if (!player) {
    return <main className="page-shell"><StatusMessage>Player not found.</StatusMessage></main>
  }

  return (
    <main className="detail-shell">
      <Link className="back-link" to="/players">Back to players</Link>

      <section className="player-detail">
        <div className="player-detail__media">
          <img src={player.image} alt={player.names} />
        </div>

        <div className="player-detail__content">
          <p className="eyebrow">{player.retired ? 'Retired legend' : 'Active player'}</p>
          <h1>{player.names}</h1>
          <div className="team-chip-list">
            {(player.teams || []).map((team) => <TeamChip key={team.id} team={team} />)}
          </div>
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
