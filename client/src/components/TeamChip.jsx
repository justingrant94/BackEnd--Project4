import { getTeamThemeClass } from '../lib/teamTheme'

function TeamChip({ team }) {
  if (!team) {
    return null
  }

  return (
    <span className={`team-chip ${getTeamThemeClass(team)}`}>
      {team.abbreviation || team.name}
    </span>
  )
}

export default TeamChip
