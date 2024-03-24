import { isWin } from '@/utils/generalWinner';
import { Button } from 'antd';
import { FC,  useCallback, } from 'react';
import { GameConfig } from '@/constant/gameType';
import Square from '../square/square';
import {  useDispatch } from 'react-redux';
import { initialBoardState,  setBoardState, } from '../../features/boardSlice';
import store from '@/store';

interface BoardProps {
    gameConfig: GameConfig;
    gameBoardState: initialBoardState;
}

/**
 * @param gameConfig 游戏配置
 * @returns
 */
const Board: FC<BoardProps> = ({ gameConfig, gameBoardState }) => {
    const dispatch = useDispatch();
    const {  enumName, playerList } = gameConfig;
    const { currentPlayer, currentStep, history, winner, winnerStep } = gameBoardState;

    /**
     * 更新游戏状态
     */
    const updateGameState = (newBoard:string[][], hasWinner:Boolean, currentPlayer:string, currentStep:number, playerList:string[], history:string[][][]) => {
        dispatch(setBoardState({
            history: [...history.slice(0, currentStep + 1), newBoard],
            currentStep: currentStep + 1,
            currentPlayer: playerList[currentStep % 2 === 0 ? 1 : 0],
            winner: hasWinner ? currentPlayer : null,
            winnerStep: hasWinner ? currentStep + 1 : 0,
        }));
    };

    /**
     * 执行逻辑
     */
    const excutetHandleClick = (row: number, col: number) => {
        // 获取最新状态
        const { history, currentStep, currentPlayer, winner } = store.getState().board;
        const { winLength, playerList } = store.getState().gameConfig.gameConfigValue;
        // 当前棋盘
        const currentBoard = history[currentStep];
        // 如果当前位置已经有棋子或者有赢家，直接返回
        if (currentBoard[row][col] || winner) return;
        // 复制当前棋盘，修改当前位置的值
        const newBoard = [...currentBoard];
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = currentPlayer;
        // 根据坐标判断四个方向是否有胜利情况
        const hasWinner = isWin(newBoard, [row, col], currentPlayer, winLength);
        updateGameState(newBoard, hasWinner, currentPlayer, currentStep, playerList, history);
    };

    /**
     * @description 点击棋子
     */
    const handleClick = useCallback(((row: number, col: number) => {
        excutetHandleClick(row, col);
    }), []);

    /**
     * @param step 步数
     * @description 回到第几步
     */
    const jumpTo = (step: number) => {
        dispatch(setBoardState({
            ...gameBoardState,
            currentStep: step,
            currentPlayer: playerList[step % 2 === 0 ? 0 : 1],
            winner: step === winnerStep ? playerList[(step % 2) - 1] : null,
        }));
    };

    // 每一步
    const moves = history.map((__, step) => {
        if (step === 0) return null;
        return (
            <Button key={step} onClick={() => jumpTo(step)}>
                {`回退到第${step}步`}
            </Button>
        );
    });

    // 棋盘
    const squares = history[currentStep]?.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
            {row?.map((__, colIndex) =>
                <Square
                    key={colIndex}
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    currentValue={history[currentStep][rowIndex][colIndex]}
                    onClickQiZi={handleClick}
                />)}
        </div>
    ));

    return (
        <>
            <h3>当前游戏: {GameConfig[enumName].name}</h3>
            <h3>当前玩家: {currentPlayer}</h3>
            {winner && <h3>胜利者: {winner}</h3>}
            {squares}
            {moves}
        </>
    );
};

export default Board;
