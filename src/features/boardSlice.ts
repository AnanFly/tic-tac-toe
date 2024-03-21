import { RootState } from '@/store';
import { createEmptyBoard } from '@/utils/toolsFun';
import { createSlice } from '@reduxjs/toolkit';

interface initialBoardState {
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

        // 更改历史记录
        setHistory: (state, action) => {
            state.history = action.payload;
        },

        // 更改当前步数
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },

        // 更改当前玩家
        setCurrentPlayer: (state, action) => {
            state.currentPlayer = action.payload;
        },

        // 更改赢家
        setWinner: (state, action) => {
            state.winner = action.payload;
        },

        // 更改赢家步数
        setWinnerStep: (state, action) => {
            state.winnerStep = action.payload;
        },
    },
});

export const { initBoard, setHistory, setCurrentPlayer, setCurrentStep, setWinner, setWinnerStep, resetBoard } = boardSlice.actions;
/**
 *
 * @description 选择棋盘状态
 */
export const selectBoard = (state: RootState) => state.board;
export default boardSlice.reducer;

