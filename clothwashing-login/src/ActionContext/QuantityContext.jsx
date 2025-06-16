import { createContext } from 'react';

export const QuantityContext = createContext({
  totalQuantity: 0,
  updateTotalQuantity: () => {}
});