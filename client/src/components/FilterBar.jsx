function FilterBar({ filters, teams, onChange, onReset }) {
  function updateFilter(event) {
    const { name, value } = event.target
    onChange({ ...filters, [name]: value, page: 1 })
  }

  return (
    <form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
      <label>
        <span>Search players</span>
        <input
          name="search"
          type="search"
          placeholder="LeBron, Curry, Jordan..."
          value={filters.search}
          onChange={updateFilter}
        />
      </label>

      <label>
        <span>Status</span>
        <select name="retired" value={filters.retired} onChange={updateFilter}>
          <option value="">All</option>
          <option value="false">Active</option>
          <option value="true">Retired</option>
        </select>
      </label>

      <label>
        <span>Position</span>
        <select name="position" value={filters.position} onChange={updateFilter}>
          <option value="">All positions</option>
          <option value="Point Guard">Point Guard</option>
          <option value="Shooting Guard">Shooting Guard</option>
          <option value="Guard">Guard</option>
          <option value="Forward">Forward</option>
          <option value="Power Forward">Power Forward</option>
          <option value="Center">Center</option>
        </select>
      </label>

      <label>
        <span>Team</span>
        <select name="team" value={filters.team} onChange={updateFilter}>
          <option value="">All teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.abbreviation || team.name}>{team.name}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Sort</span>
        <select name="sort" value={filters.sort} onChange={updateFilter}>
          <option value="name">Name A-Z</option>
          <option value="-championships">Most championships</option>
          <option value="-mvps">Most MVPs</option>
          <option value="-all_stars">Most All-Stars</option>
        </select>
      </label>

      <button type="button" className="button button--ghost" onClick={onReset}>Reset</button>
    </form>
  )
}

export default FilterBar
