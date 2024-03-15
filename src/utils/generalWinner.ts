interface ChessnewBoard {
    newBoard: string[][]; // 棋盘状态
    winLength: number; // 定义的赢的长度
}
const checkWinner = (chessnewBoard: ChessnewBoard): string | null => {
    const { newBoard, winLength } = chessnewBoard;
    const rows = newBoard.length; // 行数
    const cols = newBoard[0].length; // 列数

    // 检查行
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= cols - winLength; col++) {
            const segment = newBoard[row].slice(col, col + winLength);
            const player = segment[0];
            if (player && segment.every((value) => value === player)) {
                return player;
            }
        }
    }

    // 检查列
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row <= rows - winLength; row++) {
            const segment = Array(winLength)
                .fill("")
                .map((_, i) => newBoard[row + i][col]);
            const player = segment[0];
            if (player && segment.every((value) => value === player)) {
                return player;
            }
        }
    }

    // 检查主对角线
    for (let row = 0; row <= rows - winLength; row++) {
        for (let col = 0; col <= cols - winLength; col++) {
            const segment = Array(winLength)
                .fill("")
                .map((_, i) => newBoard[row + i][col + i]);
            const player = segment[0];
            if (player && segment.every((value) => value === player)) {
                return player;
            }
        }
    }

    // 检查副对角线
    for (let row = 0; row <= rows - winLength; row++) {
        for (let col = winLength - 1; col < cols; col++) {
            const segment = Array(winLength)
                .fill("")
                .map((_, i) => newBoard[row + i][col - i]);
            const player = segment[0];
            if (player && segment.every((value) => value === player)) {
                return player;
            }
        }
    }

    return null;
};
export default checkWinner;