import { RootState } from '@/store';
import { createEmptyBoard } from '@/utils/toolsFun';
import { createSlice } from '@reduxjs/toolkit';

export interface initialBoardState {
    history: string[][][]; // 整盘棋局状态
    winnerStep: number; // 赢家的步数
    currentStep: number; // 当前步数
    currentPlayer: string; // 当前玩家
    winner: string | null; // 赢家
}

const initialState: initialBoardState = {
    history: [createEmptyBoard(3, 3)], // 整盘棋局状态
    winnerStep: 0, // 赢家的步数
    currentStep: 0, // 当前步数
    currentPlayer: 'O', // 当前玩家
    winner: null, // 赢家
};

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        // 根据传入的配置初始化棋盘
        initBoard: (state, action) => {
            const { row, col } = action.payload;
            state.history = [createEmptyBoard(row, col)];
        },

        // 重置棋盘
        resetBoard: (state) => {
            state.history = [createEmptyBoard(state.history[0].length, state.history[0][0].length)];
            state.currentStep = 0;
            state.currentPlayer = 'O';
            state.winner = null;
            state.winnerStep = 0;
        },

        // 设置当前玩家
        setCurrentPlayer: (state, action) => {
            state.currentPlayer = action.payload;
        },

        // 更改状态
        setBoardState: (state, action) => {
            const { history, currentStep, currentPlayer, winner, winnerStep } = action.payload;
            state.history = history;
            state.currentStep = currentStep;
            state.currentPlayer = currentPlayer;
            state.winner = winner;
            state.winnerStep = winnerStep;
        },
    },
});

export const { initBoard, resetBoard, setCurrentPlayer, setBoardState } = boardSlice.actions;
/**
 *
 * @description 选择棋盘状态
 */
export const selectBoard = (state: RootState) => state.board;
export default boardSlice.reducer;

