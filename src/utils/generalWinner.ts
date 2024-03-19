/* eslint-disable id-length */
interface ChessnewBoard {
    newBoard: string[][]; // 棋盘状态
    winLength: number; // 定义的赢的长度
}
/**
 *
 * @param chessnewBoard  棋盘状态和赢的长度
 * @returns
 */
const checkWinner = (chessBoard: ChessnewBoard): string | null => {
    const { newBoard, winLength } = chessBoard;
    const rows = newBoard.length;
    const cols = newBoard[0].length;
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
    ];

    /**
     *
     * @description 检查当前位置是否有获胜者
     * @param rowOffset 行偏移
     * @param colOffset 列偏移
     */
    const check = (row: number, col: number, rowOffset: number, colOffset: number): string | null => {
        const player = newBoard[row][col];
        if (!player) return null; // 如果当前位置没有棋子,直接返回null

        let count = 1;
        let r = row + rowOffset;
        let c = col + colOffset;

        // 向一个方向计算连续相同棋子的数量
        while (r >= 0 && r < rows && c >= 0 && c < cols && newBoard[r][c] === player) {
            count++;
            r += rowOffset;
            c += colOffset;
        }

        // 如果已经达到获胜条件,直接返回获胜者
        if (count >= winLength) {
            return player;
        }

        return null;
    };

    // 只需要检查棋盘的一半位置,利用对称性减少重复计算
    const maxRow = Math.floor(rows / 2);
    const maxCol = Math.floor(cols / 2);

    for (let row = 0; row < maxRow; row++) {
        for (let col = 0; col < maxCol; col++) {
            for (const [rowOffset, colOffset] of directions) {
                const winner = check(row, col, rowOffset, colOffset);
                if (winner) {
                    return winner;
                }
            }
        }
    }

    return null;
};
export default checkWinner;
