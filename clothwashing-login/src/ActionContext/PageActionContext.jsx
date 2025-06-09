import { createContext, useContext } from "react";

export const PageActionContext = createContext();

export const usePageAction = () => useContext(PageActionContext);