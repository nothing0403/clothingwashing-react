import { useState, useEffect, useRef} from 'react';
import '../style/cart_style.css';

function Cart(){

  const [clothList, setClothList] = useState([]);
  const [senderDto, setSenderDto] = useState({});
  const [receiverDto, setReceiverDto] = useState({});
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
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

  return(
    <div className='cart-table'>
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
  )

};

export default Cart; 