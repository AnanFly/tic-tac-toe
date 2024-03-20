import { isWin } from '@/utils/generalWinner';
import { Button } from 'antd';
import { FC, useEffect } from 'react';
import { GameConfig } from '@/constant/gameType';
import Square from '../square/square';
import { useSelector, useDispatch } from 'react-redux';
import {
    initBoard, selectBoard, setCurrentPlayer, setCurrentStep, setHistory, setWinner, setWinnerStep
} from '../../features/boardSlice';
import { selectGameConfig } from '@/features/appGameSlice';


/**
 * @param gameConfig 游戏配置
 * @returns
 */
const Board: FC = () => {
    const dispatch = useDispatch();
    const { row, col, enumName, playerList, winLength } = useSelector(selectGameConfig).gameConfigValue;
    const { currentPlayer, currentStep, history, winner, winnerStep } = useSelector(selectBoard);

    useEffect(() => {
        dispatch(initBoard({ row, col }));
    }, [row, col]);


    /**
     * 落子
     */
    const handleClick = (row: number, col: number) => {
        const currentBoard = history[currentStep];
        if (currentBoard[row][col] || winner) return;
        const newBoard = [...currentBoard];
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = currentPlayer;
        const hasWinner = isWin(newBoard, [row, col], currentPlayer, winLength);
        dispatch(setHistory([...history.slice(0, currentStep + 1), newBoard]));
        dispatch(setCurrentStep(currentStep + 1));
        dispatch(setCurrentPlayer(playerList[currentStep % 2 === 0 ? 1 : 0]));
        dispatch(setWinner(hasWinner ? currentPlayer : null));
        if (hasWinner) {
            dispatch(setWinnerStep(currentStep + 1));
        }
    };

    /**
     *
     * @param step 步数
     */
    const jumpTo = (step: number) => {
        dispatch(setCurrentStep(step));
        dispatch(setCurrentPlayer(playerList[step % 2 === 0 ? 0 : 1]));
        const winner = step === winnerStep ? playerList[(step % 2) - 1] : null;
        step === winnerStep ? dispatch(setWinner(winner)) : dispatch(setWinner(null));
    };

    const moves = history.map((__, step) => {
        if (step === 0) return null;
        return (
            <Button key={step} onClick={() => jumpTo(step)}>
                {`回退到第${step}步`}
            </Button>
        );
    });

    return (
        <>
            <h3>当前游戏: {GameConfig[enumName].name}</h3>
            <h3>当前玩家: {currentPlayer}</h3>
            {winner && <h3>胜利者: {winner}</h3>}
            {history[currentStep]?.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row?.map((__, colIndex) =>
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            enumName={enumName}
                            playerList={playerList}
                            currentValue={history[currentStep][rowIndex][colIndex]}
                            onClickQiZi={() => handleClick(rowIndex, colIndex)}
                        />)}
                </div>
            ))}
            {moves}
        </>
    );
};

export default Board;
