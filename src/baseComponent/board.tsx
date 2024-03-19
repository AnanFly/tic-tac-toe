import checkWinner from '@/utils/generalWinner';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { GameConfig } from '@/constant/gameType';
import Square from './square';
import { createEmptyBoard } from '@/utils/toolsFun';

interface BoardProps {
    gameConfig: GameConfig;
}

/**
 * @param gameConfig 游戏配置
 * @returns
 */
const Board: FC<BoardProps> = ({ gameConfig }) => {
    const { row, col, enumName, playerList, winLength } = gameConfig;
    const [history, setHistory] = useState<string[][][]>([
        createEmptyBoard(row, col),
    ]);
    const [winnerStep, setWinnerStep] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(playerList[0]);
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        setHistory([createEmptyBoard(row, col)]);
        setCurrentStep(0);
        setCurrentPlayer(playerList[0]);
        setWinner(null);
    }, [gameConfig]);

    /**
     * 落子
     */
    const handleClick = (row: number, col: number) => {
        const currentBoard = history[currentStep];
        if (currentBoard[row][col] || winner) return;
        const newBoard = [...currentBoard];
        newBoard[row] = [...newBoard[row]];
        newBoard[row][col] = currentPlayer;
        const newWinner = checkWinner({ newBoard, winLength });
        setHistory(history.slice(0, currentStep + 1).concat([newBoard]));
        setCurrentStep(currentStep + 1);
        setCurrentPlayer(currentPlayer === playerList[0] ? playerList[1] : playerList[0],);
        setWinner(newWinner);
        if (newWinner) {
            setWinnerStep(currentStep +  1);
        }
    };

    /**
     *
     * @param step 步数
     */
    const jumpTo = (step: number) => {
        setCurrentStep(step);
        setCurrentPlayer(step % 2 === 0 ? playerList[0] : playerList[1]);
        const winner = step === winnerStep ? playerList[(step % 2) - 1] : null;
        step === winnerStep ? setWinner(winner) : setWinner(null);
    };


    const renderSquare = (row: number, col: number) => {
        const currentValue = history[currentStep][row][col];
        return (
            <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
            >
                <Square
                    enumName={enumName}
                    playerList={playerList}
                    currentValue={currentValue}
                />
            </div>
        );
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
            {history[currentStep].map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((__, colIndex) => renderSquare(rowIndex, colIndex))}
                </div>
            ))}
            {moves}
        </>
    );
};

export default Board;
