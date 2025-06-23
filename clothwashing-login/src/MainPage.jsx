import './style/mainpage_style.css';
import './reset.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Swal from 'sweetalert2';
import { Outlet } from 'react-router-dom';
import { PageActionContext } from './ActionContext/PageActionContext';
import { PriceContext } from './ActionContext/PriceContext';
import { QuantityContext } from './ActionContext/QuantityContext'; 
import { LoginContext } from './ActionContext/LoginContext';
import { LoadingContext } from './ActionContext/LoadingContext';
import { AccountContext } from './ActionContext/AccountContext';
import { PageNumberContext } from './ActionContext/PageNumberContext';
import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function MainPage() {

  const actionRef = useRef(null);

  const [totalPrice, setTotalPrice] = useState(0);

  const [totalQuantity, setTotalQuantity] = useState(0);

  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext);

  const [isLoading, setIsLoading] = useState(false);

  const {loginAccount} = useContext(AccountContext);

  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(0);


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
        Swal.fire({
        title: '已登出。',
        text: '',
        scrollbarPadding: false,
        icon: 'success',
        confirmButtonText: '返回'
      }).then(() => {
        // 使用者按下確認後，導向主畫面
        navigate('/'); // 或你想去的路由
      });
      } 

      // if (response.ok) {
      //   setIsLoggedIn(false);
      //   setSuccess('登出成功！');
      //   setError('');
      // } else {
      //   const result = await response.json();
      //   setError(result.message || '登出失敗');
      // }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };

  return (
    <>
      <div className="container">
        <Link className="title" to='/'><img src="./Logo02.png"/></Link>
        <nav className="nav_bar">
          <div className="menu">洗衣優惠</div>
          <div className="menu">洗衣價目</div>
          <div className="menu">送洗優惠</div>
          <div className="menu">關於我們</div>
        </nav>
        <div className="customer_menu">
            {isLoggedIn ? (
              <div className='sign_out'>
                <p>使用者: {loginAccount}</p>
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
            <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
              <PageNumberContext.Provider value={{ pageNumber, setPageNumber}}>
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
                        <div className='price_items'>
                          <label><input type="checkbox" checked={true} readOnly/>選擇送洗項目</label>
                          <p>加洗 {totalQuantity} 件</p>
                        </div>
                        <label><input type="checkbox" checked={pageNumber > 0} readOnly/>選擇送洗通路</label>
                        <label><input type="checkbox" checked={pageNumber > 1} readOnly/>填寫送洗資訊</label>
                      </div>
                      <div className="price_total">總估價金額 {totalPrice} 元</div>
                      { !isLoading ? (<button className="next" onClick={handleTrigger}><p>下一步</p></button>):
                      (<div className='next'><p>訂單處理中</p></div>)} 
                    </div>
                  </div>
                </div>
              </PageNumberContext.Provider>
            </LoadingContext.Provider>
          </QuantityContext.Provider>
        </PriceContext.Provider>
      </PageActionContext.Provider>

      <footer className="footer_box">
        <nav className="footer_nav">
          <img src="./Logo01.png"/>
        </nav>
      </footer>
    </>
  );
};

export default MainPage;