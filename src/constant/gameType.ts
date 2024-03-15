// 说明：游戏类型常量
export enum GameType {
    Gobang = 'Gobang', // 五子棋
    TicTacToe = 'TicTacToe', // 井字棋
}

export interface GameConfig {
    row: number;
    col: number;
    name: string;
    winLength: number;
    enumName: GameType;
    playerList: string[];
}
interface GameConfigMap {
    [key: string]: GameConfig;
}

// 配置信息
export const GameConfig: GameConfigMap = {
    [GameType.Gobang]: {
        row: 12,
        col: 12,
        name: '五子棋',
        enumName: GameType.Gobang,
        winLength: 5,
        playerList: ['黑魁', '白煞'],
    },
    [GameType.TicTacToe]: {
        row: 3,
        col: 3,
        winLength: 3,
        name: '井字棋',
        enumName: GameType.TicTacToe,
        playerList: ['O', 'X'],
    },
}
