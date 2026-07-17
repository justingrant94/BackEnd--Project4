function StatsPanel({ player }) {
  const stats = [
    ['Championships', player.championships ?? 0],
    ['MVPs', player.mvps ?? 0],
    ['All-Star', player.all_star_appearances ?? 0],
    ['Career start', player.career_start || 'N/A'],
    ['Career end', player.career_end || (player.retired ? 'N/A' : 'Present')],
    ['Hall of Fame', player.hall_of_fame ? 'Yes' : 'No'],
  ]

  return (
    <dl className="stats-panel">
      {stats.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default StatsPanel
