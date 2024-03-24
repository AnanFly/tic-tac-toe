import { GameConfig } from '@/constant/gameType';
import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';

const gameConfigValue = GameConfig.TicTacToe;

export const gameConfigSlice = createSlice({
    name: 'appGameConfig',
    initialState: { gameConfigValue },
    reducers: {
        // 更改游戏配置
        setGameConfig: (state, action) => {
            state.gameConfigValue = action.payload;
        },
    },
});

export const { setGameConfig } = gameConfigSlice.actions;

/**
 *@description 选择游戏配置
 */
export const selectGameConfig = (state: RootState) => state.gameConfig;
export default gameConfigSlice.reducer;

