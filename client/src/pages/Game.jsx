import { useEffect, useMemo, useState } from 'react'
import { getGameLeaderboard, getGameSessions, getGameStats, getPlayers, getTeams, saveGameSession } from '../api/client'
import SafeImage from '../components/SafeImage'
import StatusMessage from '../components/StatusMessage'
import clueBank from '../data/playerGameClues.json'

const ROUND_COUNT = 10

const difficultySettings = {
  easy: { label: 'Easy', choices: 4, maxClues: 4, scores: [100, 75, 50, 25], shotClock: 30, description: 'Direct facts, more clues, and forgiving scoring.' },
  mid: { label: 'Mid', choices: 4, maxClues: 3, scores: [120, 85, 55], shotClock: 24, description: 'Stats, style clues, and fewer chances to narrow it down.' },
  hard: { label: 'Hard', choices: 6, maxClues: 3, scores: [150, 100, 60], shotClock: 15, description: 'Legacy clues, six choices, and a tighter shot clock.' },
}

const gameModes = {
  all: { label: 'All players', test: () => true },
  active: { label: 'Active only', test: (player) => !player.retired },
  legends: { label: 'Retired legends', test: (player) => player.retired },
  champions: { label: 'Champions', test: (player) => (player.championships || 0) > 0 },
  mvps: { label: 'MVP club', test: (player) => (player.mvps || 0) > 0 },
  guards: { label: 'Guards', test: (player) => (player.position || '').toLowerCase().includes('guard') },
  bigs: { label: 'Bigs', test: (player) => /(center|forward)/i.test(player.position || '') },
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

function makeRounds(players, teams, difficulty, mode) {
  const setting = difficultySettings[difficulty]
  const modePlayers = players.filter(gameModes[mode].test)
  const eligiblePlayers = modePlayers.length >= setting.choices ? modePlayers : players

  return shuffle(eligiblePlayers).slice(0, Math.min(ROUND_COUNT, eligiblePlayers.length)).map((player) => ({
    answer: player,
    choices: makeOptions(player, eligiblePlayers, setting.choices),
    clues: getClues(player, teams, difficulty),
  }))
}

function getRoundPoints(setting, visibleClues, timedOut, streak) {
  if (timedOut) return 0
  const basePoints = setting.scores[Math.min(visibleClues - 1, setting.scores.length - 1)] || 0
  const streakBonus = streak >= 2 ? streak * 10 : 0
  return basePoints + streakBonus
}

function Game() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [mode, setMode] = useState('all')
  const [shotClockEnabled, setShotClockEnabled] = useState(false)
  const [rounds, setRounds] = useState([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [visibleClues, setVisibleClues] = useState(1)
  const [selectedId, setSelectedId] = useState(null)
  const [timedOut, setTimedOut] = useState(false)
  const [timeLeft, setTimeLeft] = useState(difficultySettings.easy.shotClock)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [roundHistory, setRoundHistory] = useState([])
  const [gameStartedAt, setGameStartedAt] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [stats, setStats] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [recentSessions, setRecentSessions] = useState([])

  const setting = difficultySettings[difficulty]
  const currentRound = rounds[roundIndex]
  const hasAnswered = selectedId !== null || timedOut
  const selectedCorrectly = hasAnswered && selectedId === currentRound?.answer.id
  const gameFinished = rounds.length > 0 && roundIndex >= rounds.length
  const filteredPlayerCount = useMemo(() => players.filter(gameModes[mode].test).length, [players, mode])
  const currentWorth = currentRound && !hasAnswered ? getRoundPoints(setting, visibleClues, false, streak + 1) : 0

  async function loadGameMeta() {
    const [statsResult, leaderboardResult, sessionsResult] = await Promise.allSettled([
      getGameStats(),
      getGameLeaderboard(),
      getGameSessions(),
    ])

    if (statsResult.status === 'fulfilled') setStats(statsResult.value)
    if (leaderboardResult.status === 'fulfilled') setLeaderboard(leaderboardResult.value)
    if (sessionsResult.status === 'fulfilled') setRecentSessions(sessionsResult.value)
  }

  function selectAnswer(playerId, timeout = false) {
    if (hasAnswered || !currentRound) return

    const isCorrect = playerId === currentRound.answer.id
    const nextStreak = isCorrect ? streak + 1 : 0
    const earnedPoints = isCorrect ? getRoundPoints(setting, visibleClues, timeout, nextStreak) : 0
    const selectedPlayer = currentRound.choices.find((player) => player.id === playerId)

    setSelectedId(playerId)
    setTimedOut(timeout)
    setScore((currentScore) => currentScore + earnedPoints)
    setCorrectAnswers((currentTotal) => currentTotal + (isCorrect ? 1 : 0))
    setStreak(nextStreak)
    setBestStreak((currentBest) => Math.max(currentBest, nextStreak))
    setRoundHistory((history) => [...history, {
      round: roundIndex + 1,
      answer: currentRound.answer.names,
      selected: timeout ? 'Shot clock expired' : selectedPlayer?.names || 'No answer',
      correct: isCorrect,
      clues_used: visibleClues,
      points: earnedPoints,
    }])
  }

  function showNextClue() {
    if (!currentRound || hasAnswered) return
    setVisibleClues((currentTotal) => Math.min(currentRound.clues.length, currentTotal + 1))
  }

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
        await loadGameMeta()
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadGameData()
  }, [])

  useEffect(() => {
    if (!currentRound || !shotClockEnabled || hasAnswered || gameFinished) return undefined
    if (timeLeft <= 0) {
      selectAnswer(null, true)
      return undefined
    }

    const timerId = window.setTimeout(() => setTimeLeft((current) => current - 1), 1000)
    return () => window.clearTimeout(timerId)
  }, [currentRound, gameFinished, hasAnswered, shotClockEnabled, timeLeft])

  useEffect(() => {
    function handleKeydown(event) {
      if (!currentRound) return
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

      if (!hasAnswered && event.key.toLowerCase() === 'c') {
        event.preventDefault()
        showNextClue()
      }

      if (!hasAnswered && /^[1-6]$/.test(event.key)) {
        const option = currentRound.choices[Number(event.key) - 1]
        if (option) {
          event.preventDefault()
          selectAnswer(option.id)
        }
      }

      if (hasAnswered && event.key === 'Enter') {
        event.preventDefault()
        nextRound()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [currentRound, hasAnswered, visibleClues, selectedId, timedOut])

  function startGame(nextDifficulty = difficulty, nextMode = mode) {
    const nextSetting = difficultySettings[nextDifficulty]

    setDifficulty(nextDifficulty)
    setMode(nextMode)
    setRounds(makeRounds(players, teams, nextDifficulty, nextMode))
    setRoundIndex(0)
    setVisibleClues(1)
    setSelectedId(null)
    setTimedOut(false)
    setTimeLeft(nextSetting.shotClock)
    setScore(0)
    setCorrectAnswers(0)
    setStreak(0)
    setBestStreak(0)
    setRoundHistory([])
    setGameStartedAt(Date.now())
    setSaveStatus('idle')
  }

  async function finishGame() {
    setRoundIndex(rounds.length)

    if (!rounds.length || saveStatus === 'saving' || saveStatus === 'saved') return

    setSaveStatus('saving')

    try {
      await saveGameSession({
        difficulty,
        mode,
        score,
        rounds_played: rounds.length,
        correct_answers: correctAnswers,
        best_streak: bestStreak,
        duration_seconds: gameStartedAt ? Math.max(1, Math.round((Date.now() - gameStartedAt) / 1000)) : 0,
        summary: roundHistory,
      })
      setSaveStatus('saved')
      await loadGameMeta()
    } catch (_err) {
      setSaveStatus('failed')
    }
  }

  function nextRound() {
    if (roundIndex >= rounds.length - 1) {
      finishGame()
      return
    }

    setRoundIndex((currentIndex) => currentIndex + 1)
    setVisibleClues(1)
    setSelectedId(null)
    setTimedOut(false)
    setTimeLeft(setting.shotClock)
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
        <p>Ask for clues, manage the shot clock, build a streak, and save your best runs to the leaderboard.</p>
      </section>

      <section className="game-dashboard" aria-label="Your game stats">
        <div><span>{stats?.best_score ?? 0}</span><p>Best score</p></div>
        <div><span>{stats?.accuracy ?? 0}%</span><p>Accuracy</p></div>
        <div><span>{stats?.best_streak ?? 0}</span><p>Best streak</p></div>
        <div><span>{stats?.games_played ?? 0}</span><p>Saved games</p></div>
      </section>

      <section className="game-panel">
        <div className="game-settings">
          {Object.entries(difficultySettings).map(([key, value]) => (
            <button key={key} type="button" className={key === difficulty ? 'is-active' : ''} onClick={() => rounds.length ? startGame(key, mode) : setDifficulty(key)}>
              <span>{value.label}</span>
              <small>{value.description}</small>
            </button>
          ))}
        </div>

        <div className="game-mode-bar">
          <label>
            <span>Run type</span>
            <select value={mode} onChange={(event) => rounds.length ? startGame(difficulty, event.target.value) : setMode(event.target.value)}>
              {Object.entries(gameModes).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
          </label>
          <label className="toggle-row">
            <input type="checkbox" checked={shotClockEnabled} onChange={(event) => setShotClockEnabled(event.target.checked)} />
            <span>Shot Clock Mode ({setting.shotClock}s)</span>
          </label>
          <p>{filteredPlayerCount || players.length} eligible players. Keyboard: 1-6 answers, C clue, Enter next.</p>
        </div>

        {!rounds.length && (
          <div className="game-start-card">
            <div>
              <p className="eyebrow">Guess Who format</p>
              <h2>Pick a mode and start a 10-round run.</h2>
              <p>Every correct answer earns points, longer streaks add bonuses, and each saved run updates your profile stats.</p>
            </div>
            <button className="button" type="button" onClick={() => startGame()}>Start game</button>
          </div>
        )}

        {gameFinished && (
          <div className="game-results-layout">
            <div className="game-start-card game-start-card--finished">
              <div>
                <p className="eyebrow">Final buzzer</p>
                <h2>{score} points</h2>
                <p>You guessed {correctAnswers} of {rounds.length} legends correctly on {setting.label} mode with a best streak of {bestStreak}.</p>
                <p className={`save-status save-status--${saveStatus}`}>{saveStatus === 'saved' ? 'Saved to your profile and leaderboard.' : saveStatus === 'failed' ? 'Game finished, but saving failed. Try again after checking your login.' : 'Saving your run...'}</p>
              </div>
              <button className="button" type="button" onClick={() => startGame()}>Run it back</button>
            </div>

            <section className="round-summary">
              <div className="section-heading">
                <p className="eyebrow">Run summary</p>
                <h2>Every possession</h2>
              </div>
              {roundHistory.map((round) => (
                <article key={round.round} className={round.correct ? 'is-correct' : 'is-wrong'}>
                  <span>Round {round.round}</span>
                  <strong>{round.answer}</strong>
                  <p>{round.correct ? `${round.points} points with ${round.clues_used} clue${round.clues_used === 1 ? '' : 's'}.` : `Picked ${round.selected}.`}</p>
                </article>
              ))}
            </section>
          </div>
        )}

        {currentRound && !gameFinished && (
          <div className="game-board">
            <aside className="mystery-card">
              <div className={`mystery-card__image${hasAnswered ? ' is-revealed' : ''}`} style={{ '--reveal-blur': `${Math.max(2, 18 - visibleClues * 4)}px` }}>
                <SafeImage src={currentRound.answer.image} alt={hasAnswered ? currentRound.answer.names : 'Mystery player'} fallbackLabel={currentRound.answer.names} />
                {!hasAnswered && <span>?</span>}
              </div>
              <div>
                <p className="eyebrow">Round {roundIndex + 1} / {rounds.length}</p>
                <h2>{hasAnswered ? currentRound.answer.names : 'Mystery legend'}</h2>
                <p>{hasAnswered ? currentRound.answer.description : `${setting.label} ${gameModes[mode].label}. Current answer worth ${currentWorth} points.`}</p>
              </div>
              <dl className="game-score-strip">
                <div><dt>Score</dt><dd>{score}</dd></div>
                <div><dt>Streak</dt><dd>{streak}</dd></div>
                <div><dt>Clock</dt><dd>{shotClockEnabled ? timeLeft : 'Off'}</dd></div>
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
                {currentRound.choices.map((player, index) => {
                  const isSelected = selectedId === player.id
                  const isAnswer = hasAnswered && player.id === currentRound.answer.id
                  return (
                    <button key={player.id} type="button" className={`${isSelected ? 'is-selected' : ''}${isAnswer ? ' is-answer' : ''}`} disabled={hasAnswered} onClick={() => selectAnswer(player.id)}>
                      <span>{index + 1}</span>
                      {player.names}
                    </button>
                  )
                })}
              </div>

              {hasAnswered && (
                <div className={`game-result ${selectedCorrectly ? 'game-result--correct' : 'game-result--wrong'}`} aria-live="polite">
                  <div>
                    <strong>{selectedCorrectly ? 'Correct' : timedOut ? `Shot clock expired. It was ${currentRound.answer.names}` : `It was ${currentRound.answer.names}`}</strong>
                    <p>{selectedCorrectly ? `${roundHistory.at(-1)?.points || 0} points. ${streak >= 2 ? `Streak bonus active at ${streak} straight.` : 'Build a streak for bonus points.'}` : 'No points this round, but the scouting report is yours now.'}</p>
                  </div>
                  <button className="button" type="button" onClick={nextRound}>{roundIndex >= rounds.length - 1 ? 'Finish game' : 'Next round'}</button>
                </div>
              )}
            </section>
          </div>
        )}
      </section>

      <section className="game-side-panels">
        <div className="leaderboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Leaderboard</p>
            <h2>Top saved runs</h2>
          </div>
          {leaderboard.length ? leaderboard.map((session, index) => (
            <article key={session.id}>
              <span>#{index + 1}</span>
              <strong>{session.owner_username}</strong>
              <p>{session.score} pts - {session.difficulty} - {session.mode}</p>
            </article>
          )) : <p className="muted">No saved runs yet.</p>}
        </div>

        <div className="leaderboard-panel">
          <div className="section-heading">
            <p className="eyebrow">Your history</p>
            <h2>Recent runs</h2>
          </div>
          {recentSessions.length ? recentSessions.slice(0, 5).map((session) => (
            <article key={session.id}>
              <span>{session.correct_answers}/{session.rounds_played}</span>
              <strong>{session.score} points</strong>
              <p>{session.difficulty} - {session.mode} - streak {session.best_streak}</p>
            </article>
          )) : <p className="muted">Your saved runs will appear here.</p>}
        </div>
      </section>
    </main>
  )
}

export default Game