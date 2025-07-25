import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '../ActionContext/PageActionContext';
import { PriceContext } from '../ActionContext/PriceContext';
import { QuantityContext } from '../ActionContext/QuantityContext';
import '../style/clothmenu_style.css';
import { PageNumberContext } from '../ActionContext/PageNumberContext';

function ClothMenu() {

  const [clothList, setClothList] = useState([]);
  const { setTotalPrice } = useContext(PriceContext);
  const { setTotalQuantity } = useContext(QuantityContext);
  const { setPageNumber } = useContext(PageNumberContext);
  const [ kind, setKind] = useState("人身衣著類");
  const navigate = useNavigate();
  const actionRef = usePageAction();

  // const [buttonKey, setButtonKey] = useState(0);

  // const perClothList = clothList.slice(buttonKey*7, (buttonKey+1)*7);

  // 取得 Cloth 資料
  useEffect(() => {
    fetch('http://localhost:8081/rest/home',{credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      setClothList(data.data); // 後端回傳 ApiResponse<List<ClothDto>>
    })
    .catch(error => console.error('Fetch error:', error));
    setPageNumber(0);
  }, []);

  useEffect(() => {
    const total = clothList.map(cloth => cloth.clothQuantity*cloth.clothPrice).reduce((sum, current) => sum + current, 0);
    setTotalPrice(total);
    const quantity = clothList.map(cloth => cloth.clothQuantity).reduce((sum, current) => sum + current, 0);
    setTotalQuantity(quantity);
  }, [clothList])

  useEffect(() => {
    if (actionRef) {
      actionRef.current = async (e) => {
        if (clothList.every(cloth => cloth.clothQuantity==0)){
          alert("尚未下單，請填選訂單。");
          return;
        }
        /*e.preventDefault();*/
        const response = await fetch('http://localhost:8081/rest/update',{
            method: 'POST',
            // 傳入 session
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clothList)
        });
        // 導向寄件和收件人清單
        navigate('/deliver');
      };
    }
  }, [actionRef, clothList]);

  // 增減數量處理
  const handleQuantityChange = (id, delta) => {
    setClothList(prevList =>
      prevList.map(cloth =>
        cloth.clothId === id
          ? { ...cloth, clothQuantity: Math.max(0, cloth.clothQuantity + delta) }
          : cloth
      )
    );
  };

  
  return (
    <div>
      <div className="kind_box">
        <div className="kind_title">
          <h5>洗衣類別</h5>
        </div>
        <div className="kind_button">
          <button onClick={()=>setKind("人身衣著類")}>人身衣著類</button>
          <button onClick={()=>setKind("床寢類")}>床寢類</button>
          <button onClick={()=>setKind("其他類")}>其他類</button>
        </div>
      </div>
      <div className="cloth">
        <div className="cloth_container">
          {clothList.map(cloth => 
            (cloth.clothKind === kind &&(
              <div className="cloth_card" key={cloth.clothId}>
                <div className="cart_item">
                  <img src={cloth.clothImg} alt={cloth.clothName}/>
                  <div className="cart_description">
                    <h3 className='description_name'>{cloth.clothName}</h3>
                    <div>{cloth.clothDescription}</div>
                  </div>
                  <div className="cart_pricelist">
                    <p>價格：${cloth.clothPrice}</p>
                  </div>
                </div>
                <div className="count_price">
                  <button onClick={() => handleQuantityChange(cloth.clothId, -1)}>{'<'}</button>
                  <span style={{ margin: '0 10px' }}>{cloth.clothQuantity}</span>
                  <button onClick={() => handleQuantityChange(cloth.clothId, 1)}>{'>'}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/*<button type="submit" onClick={handleSubmit}>送出</button>*/ }
    </div>
  );
};

export default ClothMenu;