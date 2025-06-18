import './style/mainpage_style.css';
import './reset.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Outlet } from 'react-router-dom';
import { PageActionContext } from './ActionContext/PageActionContext';
import { PriceContext } from './ActionContext/PriceContext';
import { QuantityContext } from './ActionContext/QuantityContext'; 
import { LoginContext} from './ActionContext/LoginContext';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';


function MainPage() {

  const actionRef = useRef(null);

  const [totalPrice, setTotalPrice] = useState(0);

  const [totalQuantity, setTotalQuantity] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTrigger = () => {
    if (actionRef.current) {
      actionRef.current(); // 執行子頁面傳來的函式
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/rest/logout', {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setSuccess('登出成功！');
        setError('');
      } else {
        const result = await response.json();
        setError(result.message || '登出失敗');
      }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };

  return (
    <>
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn}}>
        <div className="container">
          <div className="title"><img src="./Logo02.png"/></div>
          <nav className="nav_bar">
            <div className="menu">洗衣優惠</div>
            <div className="menu">洗衣價目</div>
            <div className="menu">送洗優惠</div>
            <div className="menu">關於我們</div>
          </nav>
          <div className="customer_menu">
              {isLoggedIn ? (
                <div>
                  <p>已登入</p>
                  <button onClick={handleLogout}>登出</button>
                </div>
              ) : (
                <Link className="sign_in" to="/login">會員登入</Link>
              )}
              <div className="cloth_menu">洗衣選單</div>
          </div>
        </div>
        
        <Swiper
          className="swiper"
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          slidesPerView={2}
          spaceBetween={20}
          centeredSlides={true}
          pagination={{ clickable: true }}
          >
            {[...Array(5)].map((_, i) => (
              <SwiperSlide className="swiper-slide" key={i}>
                <img src="https://www.tww.com.tw/img/Banner/5267af47-2f22-46ea-9c45-12b9daf8cf14.jpg" alt="" />
              </SwiperSlide>
            ))}
        </Swiper>

        <PageActionContext.Provider  value={actionRef}>
          <PriceContext.Provider value={{ totalPrice, setTotalPrice }}>
            <QuantityContext.Provider value={{ totalQuantity, setTotalQuantity }}>
              <div className="cart">
                <div className='price'> 
                  <div>
                    <Outlet />
                  </div>
                  <div className="price_container">
                    <div className="price_title">
                      <h6>訂購總覽</h6>
                    </div>
                    <div className="price_process">
                      <label><input type="checkbox" />選擇送洗通路</label>
                      <div className='price_items'>
                        <label><input type="checkbox" />選擇送洗項目</label>
                        <p>加洗 {totalQuantity} 件</p>
                      </div>
                      <label><input type="checkbox" />填寫送洗資訊</label>
                    </div>
                    <div className="price_total">總估價金額 {totalPrice} 元</div>
                    <button className="next" onClick={handleTrigger}><p>下一步</p></button>
                  </div>
                </div>
              </div>
            </QuantityContext.Provider>
          </PriceContext.Provider>
        </PageActionContext.Provider>

        <footer className="footer_box">
          <nav className="footer_nav">
            <img src="./Logo01.png"/>
            <div className="menu"><p>洗衣優惠</p></div>
            <div className="menu"><p>洗衣價目</p></div>
            <div className="menu"><p>送洗優惠</p></div>
            <div className="menu"><p>關於我們</p></div>
          </nav>
        </footer>
      </LoginContext.Provider>
    </>
  );
};

export default MainPage;