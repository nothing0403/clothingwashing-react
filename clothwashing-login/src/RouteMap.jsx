import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import ClothMenu from './pages/ClothMenu.jsx'
import Deliver from './pages/Deliver.jsx'
import Login from './pages/Login.jsx'
import Submit from './pages/Submit.jsx'
import MainPage from './MainPage.jsx'
import Cart from './pages/Cart.jsx';
import Forget from "./pages/forget.jsx";
import EmployeeSubmit from "./pages/EmployeeSubmit.jsx";
import { LoginContext} from './ActionContext/LoginContext';
import { AccountContext } from './ActionContext/AccountContext';
import ContentList from "./pages/ContentList.jsx";

function RouteMap(){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginAccount, setLoginAccount] = useState('');

    return(
        <>
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <AccountContext.Provider value={{ loginAccount, setLoginAccount }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MainPage/>}>
                            <Route index element={<ClothMenu/>}/>
                            <Route path="deliver" element={<Deliver/>}/>
                            <Route path="cart" element={<Cart/>}/>
                        </Route>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/login/submit" element={<Submit/>}/>
                        <Route path="/login/forget" element={<Forget/>}/>
                        <Route path="/contentlist" element={<ContentList/>}/>
                        <Route path="/employee/submit" element={<EmployeeSubmit/>}/>
                    </Routes>
                </BrowserRouter>
            </AccountContext.Provider>
        </LoginContext.Provider>
        </>
    )
}

export default RouteMap;