import React, { useState, useEffect } from 'react';
import '../style/contentlist_style.css';

function ContentList() {
  const [userDto, setUserDto] = useState([]);
  const [receiveDate, setReceiveDate] = useState('');
  const [sendDate, setSendDate] = useState('');
  const [hasreceived, setHasReceived] = useState(false);
  const [hassent, setHasSent] = useState(false);
  const [contents, setContents] = useState([]);
  const [expandedContentId, setExpandedContentId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/rest/ordersearch',{credentials: 'include',})
      .then(res => res.json())
      .then(data => {
        setUserDto(data.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handleContentState = (contentId) => {
    const updated = contents.map(content =>
      content.contentId === contentId
        ? {
            
          }
        : content
    );
    setContents(updated);
  }; 

  const handleItemState = (contentId, itemId) => {
    const updatedContents = contents.map(content =>
      content.contentId === contentId
        ? {
            ...content,
            itemDtos: content.itemDtos.map(item =>
              item.itemId === itemId
                ? { ...item, itemState: true }
                : item
            ),
            receiverDto: {
              ...content.receiverDto,
              receiverState: true
            }
          }
        : content
    );
    setContents(updatedContents);
  }

  const handleReceiverState = (contentId) => {
    const updated = contents.map(content =>
      content.contentId === contentId
        ? {
            ...content,
            receiverDto: {
              ...content.receiverDto,
              receiverState: true  
            }
          }
        : content
    );
    setContents(updated);
  };

  const handleSenderState = (contentId) => {
    const updated = contents.map(content =>
      content.contentId === contentId
        ? {
            ...content,
            senderDto: {
              ...content.senderDto,
              senderState: true  
            }
          }
        : content
    );
    setContents(updated);
  };

  const handleReceiveSearch = async () => {
    console.log(receiveDate);
    const response = await fetch(`http://localhost:8081/rest/contentlist/search?receiveDate=${receiveDate}`, {
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result);
    setContents(result.data);
    setExpandedContentId(null);
  };

  const handleSendSearch = async () => {
    console.log(sendDate);
    const response = await fetch(`http://localhost:8081/rest/contentlist/search?sendDate=${sendDate}`, {
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result);
    setContents(result.data);
    setExpandedContentId(null);
  };

  const toggleExpand = (contentId) => {
    setExpandedContentId(expandedContentId === contentId ? null : contentId);
  };

  return (
    <div className="order-search-container">
      <h2>根據收件日期查詢訂單</h2>
      
      <div className="search-bar">
        <input
          type="date"
          value={sendDate}
          placeholder='查詢寄件日期'
          onChange={(e) => setSendDate(e.target.value)}
        />
        <button onClick={() => handleSendSearch()}>搜尋</button>
      </div>
      
      <div className="search-bar">
        <input
          type="date"
          value={receiveDate}
          placeholder='查詢收件日期'
          onChange={(e) => setReceiveDate(e.target.value)}
        />
        <button onClick={() => handleReceiveSearch()}>搜尋</button>
      </div>
      
      {userDto.userRole == 'laundryman' && (
        <div className="order-list">
          {contents.map((content) => (
            <div key={content.contentId} className="order-item">
              <div className="order-summary" onClick={() => toggleExpand(content.contentId)}>
                <p>訂單編號：{content.contentId}</p>
                <p>項目數量：{content.itemDtos.length}</p>
                <p>寄送日期：{content.contentSendDate}</p>
                <p>訂單狀態：
                   {content.contentState?
                    '可寄送'
                    :
                    '待處理'
                   } 
                </p>
              </div>
              {expandedContentId === content.contentId && (
                <div className="item-detail">
                  {content.itemDtos.map((item) => (
                    <div key={item.itemId} className="item-card">
                      <img src={item.clothDto.clothImg} alt={item.clothDto.clothName} />
                      <div>
                        <h4>{item.clothDto.clothName}</h4>
                        <p>尺寸：{item.clothDto.clothSize}</p>
                        <p>數量：{item.itemQuantity}</p>
                        <p>狀態：
                           {item.itemState ? 
                            '已完成' 
                            : 
                            '處理中'
                            (<button onClick={() => {handleItemState(content.contentId, item.itemId)}}>確定</button>)
                           }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {userDto.userRole == 'driver' && (
        <div className="order-list">
          {contents.map((content) => (
            <div key={content.contentId} className="order-item">
              <div className="order-summary" onClick={() => toggleExpand(content.contentId)}>
                <p>收件編號：{content.receiverDto.receiverId}</p>
                <p>收件人：{content.receiverDto.receiverName}</p>
                <p>收件地址：{content.receiverDto.receiverAddress}</p>
                <p>收件人電話：{content.receiverDto.receiverPhone}</p>
                <p>寄件狀態: 
                   {content.receiverDto.receiverState? 
                    '已送達'
                    :
                    '寄送中'
                    (<button onClick={() => {handleReceiverState(content.contentId)}}>確定</button>)
                   }             
                </p>
              </div>
              {expandedContentId === content.contentId && (
                <div className="item-detail">
                  {content.itemDtos.map((item) => (
                    <div key={item.itemId} className="item-card">
                      <img src={item.clothDto.clothImg} alt={item.clothDto.clothName} />
                      <div>
                        <h4>{item.clothDto.clothName}</h4>
                        <p>尺寸：{item.clothDto.clothSize}</p>
                        <p>數量：{item.itemQuantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-summary" onClick={() => toggleExpand(content.contentId)}>
                <p>寄件編號：{content.senderDto.senderId}</p>
                <p>寄件人：{content.senderDto.senderName}</p>
                <p>寄件地址：{content.senderDto.senderAddress}</p>
                <p>寄件人電話：{content.senderDto.senderPhone}</p>
                <p>收件狀態： 
                  {content.senderDto.senderState? 
                    '已收件'
                    :
                    '待收件'
                    (<button onClick={() => {handleSenderState(content.contentId)}}>確定</button>)
                  }          
                </p>
              </div>
              {expandedContentId === content.contentId && (
                <div className="item-detail">
                  {content.itemDtos.map((item) => (
                    <div key={item.itemId} className="item-card">
                      <img src={item.clothDto.clothImg} alt={item.clothDto.clothName} />
                      <div>
                        <h4>{item.clothDto.clothName}</h4>
                        <p>尺寸：{item.clothDto.clothSize}</p>
                        <p>數量：{item.itemQuantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContentList;