import { createContext } from 'react';

export const PageNumberContext = createContext({
  pageNumber: 0,
  updatePageNumber: () => {}
});