/**
 * @description 生成一个二维数组
 */
export const createEmptyBoard = (row: number, col: number) => {
    return Array.from({ length: row }, () => Array(col).fill(''));
};

/**
 * @description 判断当前值是黑子还是白子
 */
export const getColor = (currentValue: string, playerList: string[]): string => {
    if (currentValue === playerList[0]) {
        return 'black';
    } else if (currentValue === playerList[1]) {
        return 'white';
    }
    return '';
};
