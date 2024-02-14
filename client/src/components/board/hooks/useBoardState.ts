import { useReducer, useRef } from "react";
import { BoardState, Coord } from "@/types";

/**
 * Handles create and mutating the board's state.
 * @param length length of grid. Cells = length^2
 */
export function useBoardState(length: number) {
  // ! Using a reducer doesn't seem to work well once # of cells in around 100. Find alternative approach.
  const [boardState, boardDispatch] = useReducer(
    boardReducer,
    generateBoardInitialState(length),
  );

  const _boardCacheRef = useRef<BoardState | null>(null);

  const cacheBoard = () => {
    _boardCacheRef.current = boardState;
  };

  const loadCachedBoard = () => {
    if (_boardCacheRef.current === null) return;
    boardDispatch({ action: "setBoard", payload: _boardCacheRef.current });
  };

  return {
    boardState,
    boardDispatch,
    cacheBoard,
    loadCachedBoard,
  };
}

// dispatch type for the board reducer
export type BoardDispatch =
  | { action: "toggle"; payload: { coord: Coord } }
  | {
      action: "game-tick";
      payload: {
        gameFunction: (params: { numAlive: number; state: boolean }) => boolean;
      };
    }
  | { action: "clear" }
  | { action: "setBoard"; payload: BoardState }
  | { action: "turnOn"; payload: { coord: Coord } };

// creates an empty board length x length
const generateBoardInitialState = (length: number): BoardState =>
  Array(length).fill(Array(length).fill(false));

// just returns the state of a cell
const getCell = (boardState: BoardState, coord: Coord) =>
  boardState[coord.y][coord.x];

const setCell = (boardState: BoardState, coord: Coord, value: boolean) => {
  const board = boardState.map((row) => row.slice());
  board[coord.y][coord.x] = value;
  return board;
};

// helper functions for finding neighbors
const top = (coord: Coord): Coord => ({ ...coord, y: coord.y + 1 });
const bottom = (coord: Coord): Coord => ({ ...coord, y: coord.y - 1 });
const right = (coord: Coord): Coord => ({ ...coord, x: coord.x + 1 });
const left = (coord: Coord): Coord => ({ ...coord, x: coord.x - 1 });

// takes a coordinate and returns the neighboring coordinates that are valid. Will remove any x,y that are below 0 or above the provided length.
const getValidNeigbors = (coord: Coord, length: number): Coord[] => {
  return [
    top(coord),
    top(right(coord)),
    right(coord),
    bottom(right(coord)),
    bottom(coord),
    bottom(left(coord)),
    left(coord),
    top(left(coord)),
  ].filter(
    (coord) =>
      coord.x >= 0 && coord.y >= 0 && coord.x < length && coord.y < length,
  );
};

// reducer function for the board
const boardReducer = (boardState: BoardState, dispatch: BoardDispatch) => {
  if (dispatch.action === "turnOn") {
    return setCell(boardState, dispatch.payload.coord, true);
  }
  // toggle is when the user manipulates a single cell.
  else if (dispatch.action === "toggle") {
    const { coord } = dispatch.payload;
    return setCell(boardState, coord, !getCell(boardState, coord));
    // Game tick is for when the game is being played. Used at each step.
  } else if (dispatch.action === "game-tick") {
    // gameFunction applies the rules of the game. Determines alive/dead from number of live neighbors and cell's own state.
    const { gameFunction } = dispatch.payload;

    // create new board state
    const newBoardState =
      // for every row
      boardState.map((row, y) =>
        // for every value in the row
        row
          .map((_, x) =>
            // get the number of valid neighbors who are alive
            ({
              numAlive: getValidNeigbors({ x, y }, boardState.length).reduce(
                (accum, curr) => {
                  if (getCell(boardState, curr)) {
                    return accum + 1;
                  } else {
                    return accum;
                  }
                },
                0,
              ),
              // pass along current state
              state: getCell(boardState, { x, y }),
            }),
          )
          // apply number of alive neighbor to game function to determine if cell is alive or dead
          .map(gameFunction),
      );

    return newBoardState;
  } else if (dispatch.action === "clear") {
    return generateBoardInitialState(boardState.length);
  } else if (dispatch.action === "setBoard") {
    return dispatch.payload;
  }
  return boardState;
};
