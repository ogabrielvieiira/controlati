import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import equipamentoReducer from "./equipamentoSlice";
import usuarioReducer from "./usuarioSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipamentos: equipamentoReducer,
    usuarios: usuarioReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;