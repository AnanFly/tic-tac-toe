import { configureStore } from '@reduxjs/toolkit';
import boardRedecer from '@/features/boardSlice';
import gameConfigSlice from '@/features/appGameSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
const store = configureStore({
    reducer: {
        board: boardRedecer,
        gameConfig: gameConfigSlice,
    },
});
// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// 在整个应用程序中使用，而不是简单的 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
