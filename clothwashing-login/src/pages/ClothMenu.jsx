import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

function ClothMenu() {

  const [clothList, setClothList] = useState([]);
  const navigate = useNavigate();

  // 取得 Cloth 資料
  useEffect(() => {
    fetch('http://localhost:8081/rest/home')
      .then(res => res.json())
      .then(data => {
        setClothList(data.data); // 後端回傳 ApiResponse<List<ClothDto>>
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(clothList)
    const response = await fetch('http://localhost:8081/rest/update',{
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clothList)
    });
    navigate('/deliver');
  }

  return (
    <div>
      <h2>商品清單</h2>
      {clothList.map(cloth => (
        <div key={cloth.clothId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{cloth.clothName}</h3>
          <img src={cloth.clothImg} alt={cloth.clothName} style={{ width: '150px' }} />
          <div>{cloth.clothDescription}</div>
          <p>價格：${cloth.clothPrice}</p>
          <p>尺寸：{cloth.clothSize}</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => handleQuantityChange(cloth.clothId, -1)}>{'<'}</button>
            <span style={{ margin: '0 10px' }}>{cloth.clothQuantity}</span>
            <button onClick={() => handleQuantityChange(cloth.clothId, 1)}>{'>'}</button>
          </div>
        </div>
      ))}
      
      <button type="submit" onClick={handleSubmit}>送出</button>
     
    </div>
  );
};

export default ClothMenu;