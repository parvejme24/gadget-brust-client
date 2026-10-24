"use client"
import { Provider } from 'react-redux';
import { store } from '../store';
import StoreHydrator from './StoreHydrator';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <StoreHydrator />
      {children}
    </Provider>
  );
}
