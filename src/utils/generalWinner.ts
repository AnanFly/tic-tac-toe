/* eslint-disable id-length */
/* eslint-disable space-before-function-paren */
/**
 * 计算连子数量
 * @param direction 方向
 * @param board 游戏棋盘
 * @param lastMove 落子位置
 * @param player 棋子样式
 * @returns 相同棋子数量
 */
function calculateCount(direction: number[], board: (string | null)[][], lastMove: [number, number], player: string,) {
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
}

/**
 * 判断是否获胜
 * @param board 游戏棋盘
 * @param lastMove 落子的位置
 * @param player 棋子样式
 * @returns 是否获胜
 */
export function isWin(board: (string | null)[][], lastMove: [number, number], player: string, winLength: number): boolean {
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
}

// 分析二维数组的棋盘情况，返回最佳落子位置。使用极大极小值算法
/**
 * @param board 游戏棋盘
 * @param player 玩家
 * @param opponent 对手
*/
export function getBestMove(board: (string | null)[][], player: string, opponent: string, depth = 1000000): [number, number] {
    const bestMove = { row: -1, col: -1, score: -Infinity };
    const alpha = -Infinity; // α剪枝
    const beta = Infinity; // β剪枝

    const moves = generateMoves(board);
    moves.forEach((move) => {
        const newBoard = [...board];
        newBoard[move.row] = [...newBoard[move.row]];
        newBoard[move.row][move.col] = player;

        const score = minimax(newBoard, depth - 1, alpha, beta, false, player, opponent);
        if (score > bestMove.score) {
            bestMove.row = move.row;
            bestMove.col = move.col;
            bestMove.score = score;
        }
    });

    return [bestMove.row, bestMove.col];
}

/**
 * 生成所有可能的落子位置
 */
function generateMoves(board: (string | null)[][]) {
    const moves = [];
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (!board[row][col]) {
                moves.push({ row, col });
            }
        }
    }
    return moves;
}

/**
 * 极大极小值算法
 * @param board 游戏棋盘
 * @param depth 深度
 * @param alpha α剪枝
 * @param beta β剪枝
 * @param isMaximizing 是否是最大化
 * @param player 玩家
 * @param opponent 对手
 */
function minimax(board: (string | null)[][], depth: number, alpha: number, beta: number, isMaximizing: boolean, player: string, opponent: string): number {
    if (depth === 0) {
        return evaluate(board, player, opponent);
    }

    const moves = generateMoves(board);
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const newBoard = [...board];
            newBoard[move.row] = [...newBoard[move.row]];
            newBoard[move.row][move.col] = player;
            const evals = minimax(newBoard, depth - 1, alpha, beta, false, player, opponent);
            maxEval = Math.max(maxEval, evals);
            alpha = Math.max(alpha, evals);
            if (beta <= alpha) break;
        }
        return maxEval;
    }
    let minEval = Infinity;
    for (const move of moves) {
        const newBoard = [...board];
        newBoard[move.row] = [...newBoard[move.row]];
        newBoard[move.row][move.col] = opponent;
        const evals = minimax(newBoard, depth - 1, alpha, beta, true, player, opponent);
        minEval = Math.min(minEval, evals);
        beta = Math.min(beta, evals);
        if (beta <= alpha) break;
    }
    return minEval;
}

/**
 * 评估函数
 * @param board 游戏棋盘
 * @param player 玩家
 * @param opponent 对手
 */
function evaluate(board: (string | null)[][], player: string, opponent: string): number {
    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [1, -1],
    ];
    let score = 0;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] === player) {
                directions.forEach((direction) => {
                    const count = calculateCount(direction, board, [row, col], player);
                    score += count;
                });
            } else if (board[row][col] === opponent) {
                directions.forEach((direction) => {
                    const count = calculateCount(direction, board, [row, col], opponent);
                    score -= count;
                });
            }
        }
    }
    return score;
}

