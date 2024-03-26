import { aiPlayer, ownPlayer } from '@/constant/gameType';

/**
 * 计算连子数量
 * @param direction 方向
 * @param board 游戏棋盘
 * @param lastMove 落子位置
 * @param player 棋子样式
 * @returns 相同棋子数量
 */
const calculateCount = (direction: number[], board: (string | null)[][], lastMove: [number, number], player: string,) => {
    let count = 0;
    let [row, col] = lastMove;
    // 计算连子数量
    while (
        row >= 0 && col >= 0 &&
        row < board.length && col < board[0].length &&
        board[row][col] === player
    ) {
        row += direction[0];
        col += direction[1];
        count += 1;
    }
    return count;
};

/**
 * 判断是否获胜
 * @param board 游戏棋盘
 * @param lastMove 落子的位置
 * @param player 棋子样式
 * @returns 是否获胜
 */
export const isWin = (board: (string | null)[][], lastMove: [number, number], player: string, winLength: number): boolean => {
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ];
    return directions.reduce((isWinning: boolean, direction: number[]) => {
        if (isWinning) return true; // 如果已经判断出获胜，则直接返回true

        const count = calculateCount(direction, board, lastMove, player);
        const reverseDirection = [direction[0] * -1, direction[1] * -1];
        const count2 = calculateCount(reverseDirection, board, lastMove, player);

        // 判定胜负逻辑
        return (count + count2 - 1 >= winLength) || isWinning;
    }, false);
};

/**
 *
 * @param board 棋盘
 * @param player 当前玩家
 */
export const getBestAiMove = (board: string[][], player: string) => {
    return minimax(board, player);
};
/**
 * 极小极大算法
 * @description 计算每个位置的得分，返回最高得分的位置
 */
const minimax = (board: string[][], player: string) => {
    const newBoard = board.map((row) => [...row]);
    // 获取棋盘空位
    const availSpots = getEmptyIndexies(newBoard);

    if (winning(newBoard, ownPlayer)) {
        return {
            point: [-1, -1],
            score: -10,
        };
    } else if (winning(newBoard, aiPlayer)) {
        return {
            point: [-1, -1],
            score: 10,
        };
    } else if (availSpots.length === 0) {
        return {
            point: [-1, -1],
            score: 0,
        };
    }

    const moves = [];
    for (let index = 0; index < availSpots.length; index++) {
        const moveInfo = {} as { point: number[], score: number };
        const [row, col] = availSpots[index];
        moveInfo.point = [row, col];

        // 将空位设置为当前玩家
        newBoard[row][col] = player;

        if (player === aiPlayer) {
            const result = minimax(newBoard, ownPlayer);
            moveInfo.score = result.score;
        } else {
            const result = minimax(newBoard, aiPlayer);
            moveInfo.score = result.score;
        }

        // 重置空位
        newBoard[row][col] = '';

        // 将对象推入数组
        moves.push(moveInfo);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let index = 0; index < moves.length; index++) {
            if (moves[index].score > bestScore) {
                bestScore = moves[index].score;
                bestMove = index;
            }
        }
    } else {
        // 循环遍历移动并选择得分最低的移动
        let bestScore = 10000;
        for (let index = 0; index < moves.length; index++) {
            if (moves[index].score < bestScore) {
                bestScore = moves[index].score;
                bestMove = index;
            }
        }
    }
    // 返回数组中选择的移动（对象）到更高的深度
    return moves[bestMove as number];
};

/**
 * 获取棋盘的所有空位
 */
const getEmptyIndexies = (board: string[][]) => {
    const emptyIndexies = [] as [number, number][];
    board.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if (col === '') {
                emptyIndexies.push([rowIndex, colIndex]);
            }
        });
    });

    return emptyIndexies;
};

/**
 * 判断是否获胜
 * @description 由于不便传入最后一次落子的位置，且井字棋条件简单，故直接判断是否获胜
*/
const winning = (board: string[][], player: string) => {
    // 所有胜利条件
    const winArr = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    if (winArr.some((item) => item.every((index) => board[Math.floor(index / 3)][index % 3] === player))) {
        return true;
    }
    return false;
};
