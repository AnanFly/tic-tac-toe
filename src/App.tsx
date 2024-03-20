import { useEffect } from 'react';
import { GameConfig, GameType } from './constant/gameType';
import Board from './baseComponent/board/board';
import { Button } from 'antd';
import {  initBoard, resetBoard, setCurrentPlayer } from './features/boardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameConfig, setGameConfig } from './features/appGameSlice';

/**
 * App组件
 */
export default function App () {
    const dispatch = useDispatch();

    const gameConfig = useSelector(selectGameConfig).gameConfigValue;

    useEffect(() => {
        dispatch(resetBoard());
        dispatch(setCurrentPlayer(gameConfig.playerList[0]));
        dispatch(initBoard({ row: gameConfig.row, col: gameConfig.col }));
    }, [gameConfig.enumName]);

    return (
        <div>
            <Button
                onClick={() => {
                    if (gameConfig.enumName === GameType.Gobang) {
                        dispatch(setGameConfig(GameConfig[GameType.TicTacToe]));
                    } else {
                        dispatch(setGameConfig(GameConfig[GameType.Gobang]));
                    }
                }}
                type="primary"
            >
        切换游戏
            </Button>
            <Board gameConfig={gameConfig} />
        </div>
    );
}
