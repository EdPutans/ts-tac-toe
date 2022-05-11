export type Board = (undefined | Player)[]
export type Player = 'X' | 'O';

export type Status = {
  message: 'playing' | 'draw' | 'X wins!' | 'O wins!';
  combo?: number[];
};

export type State = {
  board: Board;
  player: Player;
  status: Status
}