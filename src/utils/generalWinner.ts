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
    // 这个方法很显然就是单纯用来做数量计算的，并不掺杂任何其他的逻辑
    // 所以在这里可以进行优化、边界判定等
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
