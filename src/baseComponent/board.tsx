import checkWinner from '@/utils/generalWinner';
import { Button } from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { GameConfig } from '@/constant/gameType';
import squareStyle from '@/style/square.module.scss';
import Square from './square';

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
        Array(row).fill(Array(col).fill('')),
    ]);
    const [winnerStep, setWinnerStep] = useState<number>(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(playerList[0]);
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        setHistory([Array(row).fill(Array(col).fill(''))]);
        setCurrentStep(0);
        setCurrentPlayer(playerList[0]);
        setWinner(null);
    }, [gameConfig]);

    const handleClick = useCallback(
        (row: number, col: number) => {
            const currentBoard = history[currentStep];
            if (currentBoard[row][col] || winner) return;
            // const newBoard = currentBoard.map((boardRow, rowIndex) =>
            //     boardRow.map((square, colIndex) =>
            //         (rowIndex === row && colIndex === col ? currentPlayer : square),),);
            const newBoard = [...currentBoard];
            newBoard[row] = [...newBoard[row]];
            newBoard[row][col] = currentPlayer;
            const newWinner = checkWinner({ newBoard, winLength });
            setHistory(history.slice(0, currentStep + 1).concat([newBoard]));
            setCurrentStep(currentStep + 1);
            setCurrentPlayer(currentPlayer === playerList[0] ? playerList[1] : playerList[0],);
            setWinner(newWinner);
            if (newWinner) {
                setWinnerStep(currentStep + 1);
            }
        },
        [history, currentStep, currentPlayer, playerList, winner, winLength],
    );

    const jumpTo = useCallback((step: number) => {
        setCurrentStep(step);
        setCurrentPlayer(step % 2 === 0 ? playerList[0] : playerList[1]);
        step === winnerStep ? setWinner(winner) : setWinner(null);
    }, [playerList, history.length]);

    const renderSquareValue = useMemo(
        () => (currentValue: string) => {
            return (
                <Square
                    enumName={enumName}
                    playerList={playerList}
                    currentValue={currentValue}
                />
            );
        },
        [enumName, playerList],
    );

    const renderSquare = (row: number, col: number) => {
        const currentValue = history[currentStep][row][col];
        return (
            <div
                key={`${row}-${col}`}
                onClick={() => handleClick(row, col)}
                children={renderSquareValue(currentValue)}
            />
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
            <div className={squareStyle.board}>
                {history[currentStep].map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: 'flex' }}>
                        {row.map((__, colIndex) => renderSquare(rowIndex, colIndex))}
                    </div>
                ))}
            </div>
            <div>{moves}</div>
        </>
    );
};

export default Board;
