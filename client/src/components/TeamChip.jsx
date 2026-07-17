function TeamChip({ team }) {
  if (!team) {
    return null
  }

  return (
    <span className="team-chip" style={{ '--team-color': team.primary_color || '#111827' }}>
      {team.abbreviation || team.name}
    </span>
  )
}

export default TeamChip
