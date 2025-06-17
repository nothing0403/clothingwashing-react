import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import ClothMenu from './pages/ClothMenu.jsx'
import Deliver from './pages/Deliver.jsx'
import Login from './pages/Login.jsx'
import Submit from './pages/Submit.jsx'
import MainPage from './MainPage.jsx'
import Cart from './pages/Cart.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}>
          <Route index element={<ClothMenu/>}/>
          <Route path="deliver" element={<Deliver/>}/>
          <Route path="cart" element={<Cart/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/login/submit" element={<Submit/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
