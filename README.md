# 下棋游戏
可配置五子棋 & 井字棋项目
/src/constant 目录下配置
如需修改游戏规则等，修改对应参数即可
```md
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
};

```
# 如何运行

## 1.安装所需依赖

```shell
pnpm i 或 npm i
```

## 2.运行项目

```shell
pnpm dev 或 npm run dev
```
