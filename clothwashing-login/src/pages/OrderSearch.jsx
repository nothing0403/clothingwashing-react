import React, { useState, useEffect } from 'react';
import '../style/ordersearch_style.css';

function OrderSearch() {
  const [receiveDate, setReceiveDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleSearch = async () => {
    console.log(receiveDate);
    const response = await fetch(`http://localhost:8081/rest/ordersearch?receiveDate=${receiveDate}`, {
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result);
    setOrders(result);
    setExpandedOrderId(null);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="order-search-container">
      <h2>根據取件日期查詢訂單</h2>
      <div className="search-bar">
        <input
          type="date"
          value={receiveDate}
          onChange={(e) => setReceiveDate(e.target.value)}
        />
        <button onClick={handleSearch}>搜尋</button>
      </div>

      <div className="order-list">
        {orders.map((order) => (
          <div key={order.contentId} className="order-item">
            <div className="order-summary" onClick={() => toggleExpand(order.contentId)}>
              <p>🧾 訂單編號：{order.contentId}</p>
              <p>📅 送洗日期：{order.contentSendDate}</p>
              <p>📦 狀態：{order.contentState ? '完成' : '處理中'}</p>
              <p>💰 總金額：{order.contentPrice} 元</p>
            </div>
            {expandedOrderId === order.contentId && (
              <div className="item-detail">
                {order.itemDtos.map((item) => (
                  <div key={item.itemId} className="item-card">
                    <img src={item.clothDto.clothImg} alt={item.clothDto.clothName} />
                    <div>
                      <h4>{item.clothDto.clothName}</h4>
                      <p>{item.clothDto.clothDescription}</p>
                      <p>尺寸：{item.clothDto.clothSize}</p>
                      <p>數量：{item.itemQuantity}</p>
                      <p>價格：{item.itemPrice} 元</p>
                      <p>狀態：{item.itemState ? '已完成' : '處理中'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderSearch;