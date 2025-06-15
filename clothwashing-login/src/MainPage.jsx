import './style/mainpage_style.css';
import './reset.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Outlet } from 'react-router-dom';
import { PageActionContext } from './ActionContext/PageActionContext';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

function MainPage() {

  const actionRef = useRef(null);

  const handleTrigger = () => {
    if (actionRef.current) {
      actionRef.current(); // 執行子頁面傳來的函式
    }
  };

  return (
    <>
      <div className="container">
        <div className="title">Hello</div>
        <nav className="nav_bar">
          <div className="menu">洗衣優惠</div>
          <div className="menu">洗衣價目</div>
          <div className="menu">送洗優惠</div>
          <div className="menu">關於我們</div>
        </nav>
        <div className="customer_menu">
          <Link className="sign_in" to="/login"></Link>
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
                <label><input type="checkbox" />選擇送洗項目</label>
                <label><input type="checkbox" />填寫送洗資訊</label>
              </div>
              <div className="price_total">總估價金額 0 元</div>
              <button className="next" onClick={handleTrigger}><p>下一步</p></button>
            </div>
          </div>
        </div>
      </PageActionContext.Provider>

      <footer className="footer_box">
        <nav className="footer_nav">
          <h1>Hello</h1>
          <div className="menu"><p>洗衣優惠</p></div>
          <div className="menu"><p>洗衣價目</p></div>
          <div className="menu"><p>送洗優惠</p></div>
          <div className="menu"><p>關於我們</p></div>
        </nav>
      </footer>
    </>
  );
};

export default MainPage;