import { createContext } from "react";

export const AccountContext = createContext({
    loginAccount:'',
    updateLoginAccount: () => {}
});