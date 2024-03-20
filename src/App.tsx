import { Component } from 'react';
import { GameConfig, GameType } from './constant/gameType';
import Board from './baseComponent/board/board';
import { Button } from 'antd';
import { initBoard, resetBoard, setCurrentPlayer } from './features/boardSlice';
import { connect } from 'react-redux';
import { RootState } from './store';
import { selectGameConfig, setGameConfig } from './features/appGameSlice';

interface AppProps {
    gameConfig: GameConfig;
    setGameConfig: (config: GameConfig) => void;
    resetBoard: () => void;
    setCurrentPlayer: (player: string) => void;
    initBoard: (config: { row: number, col: number }) => void;
}

class App extends Component<AppProps> {
    componentDidMount () {
        const { resetBoard, setCurrentPlayer, gameConfig, initBoard } = this.props;
        resetBoard();
        setCurrentPlayer(gameConfig.playerList[0]);
        initBoard({ row: gameConfig.row, col: gameConfig.col });
    }

    render () {
        const { gameConfig, setGameConfig } = this.props;

        return (
            <div>
                <Button
                    onClick={() => {
                        if (gameConfig.enumName === GameType.Gobang) {
                            setGameConfig(GameConfig[GameType.TicTacToe]);
                        } else {
                            setGameConfig(GameConfig[GameType.Gobang]);
                        }
                    }}
                    type="primary"
                >
                    切换游戏
                </Button>
                <Board />
            </div>
        );
    }
}

/**
 * @description: 将state映射到组件的props中
 */
const mapStateToProps = (state: RootState) => ({ gameConfig: selectGameConfig(state) });

const mapDispatchToProps = {
    setGameConfig,
    resetBoard,
    setCurrentPlayer,
    initBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
