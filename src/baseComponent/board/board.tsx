import { isWin } from '@/utils/generalWinner';
import { Button } from 'antd';
import { FC,  useCallback,  useRef } from 'react';
import { GameConfig } from '@/constant/gameType';
import Square from '../square/square';
import {  useDispatch } from 'react-redux';
import {
    initialBoardState,  setCurrentPlayer, setCurrentStep, setHistory, setWinner, setWinnerStep
} from '../../features/boardSlice';

interface BoardProps {
    gameConfig: GameConfig;
    gameParam: initialBoardState;
}

/**
 * @param gameConfig 游戏配置
 * @returns
 */
const Board: FC<BoardProps> = ({ gameConfig, gameParam }) => {
    const dispatch = useDispatch();
    const {  enumName, playerList, winLength } = gameConfig;
    const { currentPlayer, currentStep, history, winner, winnerStep } = gameParam;

    /**
     * 更新游戏状态
     */
    const updateGameState = (newBoard:string[][], hasWinner:Boolean) => {
        dispatch(setHistory([...history.slice(0, currentStep + 1), newBoard]));
        dispatch(setCurrentStep(currentStep + 1));
        dispatch(setCurrentPlayer(playerList[currentStep % 2 === 0 ? 1 : 0]));
        dispatch(setWinner(hasWinner ? currentPlayer : null));
        if (hasWinner) {
            dispatch(setWinnerStep(currentStep + 1));
        }
    };

    /**
     * 执行逻辑
     */
    const excutetHandleClick = (row: number, col: number) => {
        const currentBoard = history[currentStep];
        if (currentBoard[row][col] || winner) return;
        const newBoard = [...currentBoard];
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = currentPlayer;
        const hasWinner = isWin(newBoard, [row, col], currentPlayer, winLength);
        updateGameState(newBoard, hasWinner);
    };

    const handleClickRef = useRef(excutetHandleClick);
    handleClickRef.current = excutetHandleClick;


    /**
     * 点击棋子
     */
    const handleClick = useCallback(((row: number, col: number) => {
        handleClickRef.current(row, col);
    }), []);

    /**
     * @param step 步数
     * @description 回到第几步
     */
    const jumpTo = (step: number) => {
        dispatch(setCurrentStep(step));
        dispatch(setCurrentPlayer(playerList[step % 2 === 0 ? 0 : 1]));
        const winner = step === winnerStep ? playerList[(step % 2) - 1] : null;
        step === winnerStep ? dispatch(setWinner(winner)) : dispatch(setWinner(null));
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
    const squares =  history[currentStep]?.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
            {row?.map((__, colIndex) =>
                <Square
                    key={colIndex}
                    enumName={enumName}
                    playerList={playerList}
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
