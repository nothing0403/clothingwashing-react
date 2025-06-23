import { useState, useEffect, useContext, useRef} from 'react';
import { usePageAction } from '../ActionContext/PageActionContext';
import { LoadingContext } from '../ActionContext/LoadingContext';
import { LoginContext } from '../ActionContext/LoginContext';
import { PageNumberContext } from '../ActionContext/PageNumberContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style/cart_style.css';

function Cart(){

  const [clothList, setClothList] = useState([]);
  const [senderDto, setSenderDto] = useState({});
  const [receiverDto, setReceiverDto] = useState({});
  const { setPageNumber } = useContext(PageNumberContext);
  const {isLoading, setIsLoading} = useContext(LoadingContext);
  const didFetch = useRef(false);
  const navigate = useNavigate();
  const actionRef = usePageAction();
  const { isLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    if (didFetch.current) return;
    setPageNumber(2);
    didFetch.current = true;
    fetch('http://localhost:8081/rest/cart',{credentials: 'include'})
      .then(res => res.json())
      .then(data => {
        const cart = data.data; 
        setClothList(cart.clothDtos || []);
        setSenderDto(cart.senderDto || {});
        setReceiverDto(cart.receiverDto || {});
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  useEffect(() => {
    if (actionRef) {
      actionRef.current = async (e) => {
        if( !isLoggedIn ){
          alert("請登入會員。")
          return;
        }
        setIsLoading(true);
        /*e.preventDefault();*/
        const response = await fetch('http://localhost:8081/rest/result',{
            // 傳入 session
            credentials: 'include',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(clothList)
        });
        if (response.ok) {
          setIsLoading(false);
          Swal.fire({
          title: '訂單已完成！',
          text: '已發送信件！',
          scrollbarPadding: false,
          icon: 'success',
          confirmButtonText: '前往主畫面'
        }).then(() => {
          // 使用者按下確認後，導向主畫面
          navigate('/'); // 或你想去的路由
        });
        } else {
          Swal.fire({
            title: '訂單未送出',
            text: '請確認帳號密碼是否正確',
            scrollbarPadding: false,
            icon: 'error',
            confirmButtonText: '確定'
          });
        }
      };
    }
  }, [actionRef]);

  return(
    <>
      {isLoading && (
      <div className="overlay">
        <div className="loading-box"> 訂單處理中，請稍候...</div>
      </div>
      )}
      <div className='cart-title'>
        <h5>訂單結算</h5>
      </div>
      <div className='route_box'>
        <div className='route_state_all'>
          <Link to="/"><p>洗衣類別</p></Link>
          <Link to='/deliver'><p>&nbsp;&rarr;&nbsp;寄取資料</p></Link>
          <p>&nbsp;&rarr;&nbsp;訂單結算</p>
        </div>
      </div>
      <div className='cart-table'>
        <h3>衣物清單</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>圖片</th>
                <th>名稱</th>
                <th>描述</th>
                <th>價格</th>
                <th>尺寸</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              {clothList.map(cloth => (
                <tr key={cloth.clothId}>
                  <td><img src={cloth.clothImg} alt={cloth.clothName} className="cloth-img" /></td>
                  <td>{cloth.clothName}</td>
                  <td>{cloth.clothDescription}</td>
                  <td>{cloth.clothPrice}</td>
                  <td>{cloth.clothSize}</td>
                  <td>{cloth.clothQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='info-container'>
          <div className='info-block'>
            <h3>寄件人資訊</h3>
            <table className="info-table">
              <tbody>
                <tr><td>姓名</td><td>{senderDto.senderName}</td></tr>
                <tr><td>電話</td><td>{senderDto.senderPhone}</td></tr>
                <tr><td>地址</td><td>{senderDto.senderAddress}</td></tr>
                <tr><td>日期</td><td>{senderDto.senderDate}</td></tr>
                <tr><td>時段</td><td>{senderDto.senderTimePeriod}</td></tr>
                <tr><td>付款方式</td><td>{senderDto.senderPayment}</td></tr>
              </tbody>
            </table>
          </div>
          <div className='info-block'>
            <h3>收件人資訊</h3>
            <table className="info-table">
              <tbody>
                <tr><td>姓名</td><td>{receiverDto.receiverName}</td></tr>
                <tr><td>電話</td><td>{receiverDto.receiverPhone}</td></tr>
                <tr><td>地址</td><td>{receiverDto.receiverAddress}</td></tr>
                <tr><td>日期</td><td>{receiverDto.receiverDate}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
};

export default Cart; 