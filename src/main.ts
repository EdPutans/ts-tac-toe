import './styles.css'
import { Board, Player, State, Status } from './types'

const emptyTile = undefined

const winningCombos: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const initialState: State = {
  board: Array(9).fill(emptyTile),
  player: 'X',
  status: { message: 'playing' }
}

let state: State = initialState;

const tileIsTaken = (board: Board, index: number) => board[index] !== emptyTile

const boardIsFull = (board: Board): boolean => board.every(tile => tile !== emptyTile)

const getWinningCombo = (board: Board, player: Player) => {
  for (const combo of winningCombos) {
    if (combo.every(index => board[index] === player)) return combo
  }
  return null
}

const getStatus = (board: Board, player: Player): Status => {
  const winningCombo = getWinningCombo(board, player)

  if (winningCombo) return { message: `${player} wins!`, combo: winningCombo }
  if (boardIsFull(board)) return { message: 'draw' }
  return { message: 'playing' }
}

function setState(newState: State): void {
  state = {
    ...state,
    ...newState
  }
  render()
}

function restart() {
  setState(initialState)
}

function playTurn(targetIndex: number): void {
  if (state.status.message !== 'playing') return;
  if (tileIsTaken(state.board, targetIndex)) return;

  const board = state.board.map((tile, index) =>
    index === targetIndex ? state.player : tile
  )

  const player = state.player === 'X' ? 'O' : 'X'

  const status = getStatus(board, state.player)

  setState({ board, player, status })
}

function renderTop(): HTMLElement {
  const topEl = document.createElement('div')
  topEl.setAttribute('class', 'top')

  const messageEl = document.createElement('h1')
  messageEl.setAttribute('class', 'message')
  messageEl.innerText = state.status.message

  const turnEl = document.createElement('h2')
  turnEl.setAttribute('class', 'turn')
  turnEl.innerText =
    state.status.message === 'playing' ? `Turn: ${state.player}` : ''

  topEl.append(messageEl, turnEl)

  return topEl
}

function renderMiddle(): HTMLElement {
  const middleEl = document.createElement('div')
  middleEl.setAttribute('class', 'middle')

  const boardEl = document.createElement('div')
  boardEl.setAttribute('class', 'board')

  for (let i = 0; i < state.board.length; i++) {
    const tile = state.board[i]
    const tileEl = document.createElement('div')
    tileEl.setAttribute('class', 'tile')

    if (state.status.combo?.includes(i)) {
      tileEl.classList.add('winning-tile')
    }

    if (tile) tileEl.innerText = tile
    tileEl.addEventListener('click', () => playTurn(i))

    boardEl.append(tileEl)
  }

  middleEl.append(boardEl)

  return middleEl
}

function renderBottom(): HTMLElement {
  const bottomEl = document.createElement('div')
  bottomEl.setAttribute('class', 'bottom')

  if (state.status.message !== 'playing') {
    const restartBtn = document.createElement('button')
    restartBtn.innerText = 'RESTART'
    restartBtn.addEventListener('click', restart)
    bottomEl.append(restartBtn)
  }

  return bottomEl
}

function render(): void {
  const appEl = document.createElement('div')
  appEl.setAttribute('class', 'app')

  const topEl = renderTop()
  const middleEl = renderMiddle()
  const bottomEl = renderBottom()

  appEl.append(topEl, middleEl, bottomEl)

  document.body.innerHTML = ''
  document.body.append(appEl)
}

render()
