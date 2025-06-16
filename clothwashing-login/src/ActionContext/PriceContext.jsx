import { createContext } from 'react';

export const PriceContext = createContext({
  totalPrice: 0,
  updateTotalPrice: () => {}
});
