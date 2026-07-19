import { useEffect, useState } from 'react'
import { getPlayers, getTeams } from '../api/client'
import SafeImage from '../components/SafeImage'
import StatusMessage from '../components/StatusMessage'
import clueBank from '../data/playerGameClues.json'

const ROUND_COUNT = 10

const difficultySettings = {
  easy: { label: 'Easy', choices: 4, maxClues: 4, scores: [100, 75, 50, 25] },
  mid: { label: 'Mid', choices: 4, maxClues: 3, scores: [120, 85, 55] },
  hard: { label: 'Hard', choices: 6, maxClues: 3, scores: [150, 100, 60] },
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function formatValue(value, fallback = 'unknown') {
  return value === null || value === undefined || value === '' ? fallback : value
}

function cleanDescription(player) {
  return (player.description || '')
    .replace(new RegExp(player.names, 'gi'), 'This legend')
    .replace(/\s+/g, ' ')
    .trim()
}

function getPlayerTeams(player, teams) {
  const playerTeams = Array.isArray(player.teams) ? player.teams : []
  return playerTeams
    .map((team) => typeof team === 'number' ? teams.find((teamRecord) => teamRecord.id === team) : team)
    .filter(Boolean)
}

function generatedClues(player, teams) {
  const playerTeams = getPlayerTeams(player, teams)
  const teamNames = playerTeams.map((team) => team.name || team.abbreviation).filter(Boolean)
  const careerEnd = player.career_end || (player.retired ? 'an earlier era' : 'the present')
  const cleanedDescription = cleanDescription(player)

  return {
    easy: [
      `This legend plays ${formatValue(player.position, 'a basketball role')}.`,
      `This legend is ${player.retired ? 'retired' : 'still active'}.`,
      `This legend has ${player.championships ?? 0} championships.`,
      teamNames.length ? `This legend is linked with ${teamNames[0]}.` : `This legend is from ${formatValue(player.nationality)}.`,
    ],
    mid: [
      `This legend started their career in ${formatValue(player.career_start)}.`,
      `This legend has ${player.mvps ?? 0} MVP awards and ${player.all_star_appearances ?? 0} All-Star selections.`,
      `This legend's listed height is ${formatValue(player.height)}.`,
      `This legend's career runs from ${formatValue(player.career_start)} to ${careerEnd}.`,
    ],
    hard: [
      cleanedDescription || `This legend has a ${formatValue(player.position)} profile and a distinct place in basketball history.`,
      `This legend's national background is ${formatValue(player.nationality)}.`,
      `This legend's title count is ${player.championships ?? 0}, but the name stays hidden.`,
      player.hall_of_fame ? 'This legend has reached the Hall of Fame.' : 'This legend is not currently marked as Hall of Fame in the data.',
    ],
  }
}

function getClues(player, teams, difficulty) {
  const generated = generatedClues(player, teams)
  const custom = clueBank[player.names] || {}
  const clues = [...(custom[difficulty] || []), ...generated[difficulty]]
  return [...new Set(clues)].slice(0, difficultySettings[difficulty].maxClues)
}

function makeOptions(answer, players, choiceCount) {
  const wrongAnswers = shuffle(players.filter((player) => player.id !== answer.id)).slice(0, choiceCount - 1)
  return shuffle([answer, ...wrongAnswers])
}

function makeRounds(players, teams, difficulty) {
  const setting = difficultySettings[difficulty]
  return shuffle(players).slice(0, Math.min(ROUND_COUNT, players.length)).map((player) => ({
    answer: player,
    choices: makeOptions(player, players, setting.choices),
    clues: getClues(player, teams, difficulty),
  }))
}

function Game() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [rounds, setRounds] = useState([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [visibleClues, setVisibleClues] = useState(1)
  const [selectedId, setSelectedId] = useState(null)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  useEffect(() => {
    async function loadGameData() {
      setLoading(true)
      setError('')

      try {
        const [playerData, teamData] = await Promise.all([
          getPlayers({ page_size: 100, sort: 'name' }),
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

    loadGameData()
  }, [])

  const currentRound = rounds[roundIndex]
  const hasAnswered = selectedId !== null
  const selectedCorrectly = hasAnswered && selectedId === currentRound?.answer.id
  const setting = difficultySettings[difficulty]
  const gameFinished = rounds.length > 0 && roundIndex >= rounds.length

  function startGame(nextDifficulty = difficulty) {
    setDifficulty(nextDifficulty)
    setRounds(makeRounds(players, teams, nextDifficulty))
    setRoundIndex(0)
    setVisibleClues(1)
    setSelectedId(null)
    setScore(0)
    setCorrectAnswers(0)
  }

  function selectAnswer(playerId) {
    if (hasAnswered || !currentRound) return

    setSelectedId(playerId)

    if (playerId === currentRound.answer.id) {
      const earnedPoints = setting.scores[Math.min(visibleClues - 1, setting.scores.length - 1)] || 0
      setScore((currentScore) => currentScore + earnedPoints)
      setCorrectAnswers((currentTotal) => currentTotal + 1)
    }
  }

  function showNextClue() {
    if (!currentRound) return
    setVisibleClues((currentTotal) => Math.min(currentRound.clues.length, currentTotal + 1))
  }

  function nextRound() {
    if (roundIndex >= rounds.length - 1) {
      setRoundIndex(rounds.length)
      setSelectedId(null)
      return
    }

    setRoundIndex((currentIndex) => currentIndex + 1)
    setVisibleClues(1)
    setSelectedId(null)
  }

  if (loading) {
    return (
      <main className="page-shell">
        <StatusMessage loading title="Loading game data">
          Building your mystery player board from the current player directory.
        </StatusMessage>
      </main>
    )
  }

  if (error) {
    return <main className="page-shell"><StatusMessage type="error">{error}</StatusMessage></main>
  }

  if (players.length < 6) {
    return (
      <main className="page-shell">
        <StatusMessage type="empty" title="More players needed">
          Add at least six players before starting Guess the Legend.
        </StatusMessage>
      </main>
    )
  }

  return (
    <main className="page-shell game-page">
      <section className="page-heading game-heading">
        <p className="eyebrow">Members game mode</p>
        <h1>Guess the Legend</h1>
        <p>Ask for clues, read the player profile, and identify the hidden basketball legend before the score drops.</p>
      </section>

      <section className="game-panel">
        <div className="game-settings">
          {Object.entries(difficultySettings).map(([key, value]) => (
            <button key={key} type="button" className={key === difficulty ? 'is-active' : ''} onClick={() => startGame(key)}>
              <span>{value.label}</span>
              <small>{value.choices} choices, {value.maxClues} clues</small>
            </button>
          ))}
        </div>

        {!rounds.length && (
          <div className="game-start-card">
            <div>
              <p className="eyebrow">Guess Who format</p>
              <h2>Pick a mode and start a 10-round run.</h2>
              <p>Easy leans on direct facts, Mid mixes stats with style, and Hard hides the obvious names behind legacy clues.</p>
            </div>
            <button className="button" type="button" onClick={() => startGame()}>Start game</button>
          </div>
        )}

        {gameFinished && (
          <div className="game-start-card game-start-card--finished">
            <div>
              <p className="eyebrow">Final score</p>
              <h2>{score} points</h2>
              <p>You guessed {correctAnswers} of {rounds.length} legends correctly on {setting.label} mode.</p>
            </div>
            <button className="button" type="button" onClick={() => startGame()}>Run it back</button>
          </div>
        )}

        {currentRound && !gameFinished && (
          <div className="game-board">
            <aside className="mystery-card">
              <div className={`mystery-card__image${hasAnswered ? ' is-revealed' : ''}`}>
                {hasAnswered ? <SafeImage src={currentRound.answer.image} alt={currentRound.answer.names} fallbackLabel={currentRound.answer.names} /> : <span>?</span>}
              </div>
              <div>
                <p className="eyebrow">Round {roundIndex + 1} / {rounds.length}</p>
                <h2>{hasAnswered ? currentRound.answer.names : 'Mystery legend'}</h2>
                <p>{hasAnswered ? currentRound.answer.description : `${setting.label} mode. Use fewer clues for a higher score.`}</p>
              </div>
              <dl className="game-score-strip">
                <div><dt>Score</dt><dd>{score}</dd></div>
                <div><dt>Correct</dt><dd>{correctAnswers}</dd></div>
                <div><dt>Clues</dt><dd>{visibleClues}/{currentRound.clues.length}</dd></div>
              </dl>
            </aside>

            <section className="clue-board">
              <div className="section-heading section-heading--split">
                <div>
                  <p className="eyebrow">Clue board</p>
                  <h2>Who is the hidden player?</h2>
                </div>
                <button className="button button--ghost" type="button" disabled={hasAnswered || visibleClues >= currentRound.clues.length} onClick={showNextClue}>Ask for clue</button>
              </div>

              <ol className="clue-list">
                {currentRound.clues.slice(0, visibleClues).map((clue) => <li key={clue}>{clue}</li>)}
              </ol>

              <div className="answer-grid">
                {currentRound.choices.map((player) => {
                  const isSelected = selectedId === player.id
                  const isAnswer = hasAnswered && player.id === currentRound.answer.id
                  return (
                    <button key={player.id} type="button" className={`${isSelected ? 'is-selected' : ''}${isAnswer ? ' is-answer' : ''}`} disabled={hasAnswered} onClick={() => selectAnswer(player.id)}>
                      {player.names}
                    </button>
                  )
                })}
              </div>

              {hasAnswered && (
                <div className={`game-result ${selectedCorrectly ? 'game-result--correct' : 'game-result--wrong'}`}>
                  <strong>{selectedCorrectly ? 'Correct' : `It was ${currentRound.answer.names}`}</strong>
                  <p>{selectedCorrectly ? `You scored ${setting.scores[Math.min(visibleClues - 1, setting.scores.length - 1)] || 0} points.` : 'No points this round, but the scouting report is yours now.'}</p>
                  <button className="button" type="button" onClick={nextRound}>{roundIndex >= rounds.length - 1 ? 'Finish game' : 'Next round'}</button>
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  )
}

export default Game