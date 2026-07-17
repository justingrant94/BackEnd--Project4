import { Link } from 'react-router-dom'
import SafeImage from './SafeImage'
import TeamChip from './TeamChip'

function PlayerCard({ player, teams = [], featured = false }) {
  const playerTeams = Array.isArray(player.teams) ? player.teams : []
  const resolvedTeams = playerTeams
    .map((team) => typeof team === 'number' ? teams.find((teamRecord) => teamRecord.id === team) : team)
    .filter(Boolean)

  return (
    <article className={`player-card${featured ? ' player-card--featured' : ''}`}>
      <Link to={`/players/${player.id}`} className="player-card__media" aria-label={`View ${player.names}`}>
        <SafeImage src={player.image} alt={player.names} fallbackLabel={player.names} loading="lazy" />
        <span className={`status-badge ${player.retired ? 'status-badge--retired' : 'status-badge--active'}`}>
          {player.retired ? 'Retired' : 'Active'}
        </span>
      </Link>

      <div className="player-card__body">
        <div>
          <p className="eyebrow">{player.position || 'Basketball Player'}</p>
          <h3>{player.names}</h3>
        </div>
        <p>{player.description}</p>
        <div className="team-chip-list">
          {resolvedTeams.slice(0, 3).map((team) => <TeamChip key={team.id || team.name} team={team} />)}
        </div>
        <dl className="mini-stats">
          <div>
            <dt>Titles</dt>
            <dd>{player.championships ?? 0}</dd>
          </div>
          <div>
            <dt>MVPs</dt>
            <dd>{player.mvps ?? 0}</dd>
          </div>
          <div>
            <dt>Stars</dt>
            <dd>{player.all_star_appearances ?? 0}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export default PlayerCard
