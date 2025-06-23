import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/contentlist_style.css';

function ContentList() {
  const [userDto, setUserDto] = useState([]);
  const [receiveDate, setReceiveDate] = useState('');
  const [sendDate, setSendDate] = useState('');
  const [contents, setContents] = useState([]);
  const [useReceiveSearch, setUseReceiveSearch] = useState(false);
  const [useSendSearch, setUseSendSearch] = useState(false);
  const [expandedContentId, setExpandedContentId] = useState(null);
  const [state, setState] = useState('');

  useEffect(() => {
    fetch('http://localhost:8081/rest/contentlist',{credentials: 'include',})
      .then(res => res.json())
      .then(data => {
        setUserDto(data.data);
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  useEffect(() => {
    const postData = async () => {
    try {
      const response = await fetch('http://localhost:8081/rest/contentlist/content_update', {
        method: 'POST',
        credentials: 'include', // 傳入 cookie/session
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contents)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('回傳資料:', data);
    } catch (error) {
      console.error('發送資料失敗:', error);
    }
  };

  if(contents.length > 0){
    postData(); // 呼叫 async 函式
  }
}, [contents]);

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
    setContents(updatedContents.map(content => {
      if (content.contentId === contentId) {
        const state = content.itemDtos.every(item => item.itemState === true);
        return {
          ...content,
          contentState: state
        };
      }
      return content; // 其他的內容保持不變
    }));
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

  const handleReceiveDateSearch = async () => {
    console.log(receiveDate);
    const response = await fetch(`http://localhost:8081/rest/contentlist/receivedate_search?receiveDate=${receiveDate}`, {
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result);
    setContents(result.data);
    setUseSendSearch(true);
    setUseReceiveSearch(false);
    setExpandedContentId(null);
  };

  const handleSendDateSearch = async () => {
    console.log(sendDate);
    const response = await fetch(`http://localhost:8081/rest/contentlist/senddate_search?sendDate=${sendDate}`, {
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result);
    setContents(result.data);
    setUseReceiveSearch(true);
    setUseSendSearch(false);
    setExpandedContentId(null);
  };

  const toggleExpand = (contentId) => {
    setExpandedContentId(expandedContentId === contentId ? null : contentId);
  };

  return (
    <div className="order-search-container">
      <div className='sign-area'>
        <Link className='sign_in' to='/employee/submit'>員工註冊</Link>
      </div>
      <div className='search-bar-set'> 
        <div className="search-bar">
          <h2>收件日期查詢訂單</h2>
          <input
            type="date"
            value={receiveDate}
            onChange={(e) => setReceiveDate(e.target.value)}
          />
          <div className='button-area'>
            <button onClick={() => handleReceiveDateSearch()}>搜尋</button>
          </div>
        </div>

        <div className="search-bar">
          <h2>寄件日期查詢訂單</h2>
          <input
            type="date"
            value={sendDate}
            onChange={(e) => setSendDate(e.target.value)}
          />
          <div className='button-area'>
            <button onClick={() => handleSendDateSearch()}>搜尋</button>
          </div>
        </div>
      </div>
    
      <div className='order-container'>
         {userDto.userRole === 'laundryman' && (
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
                            <div className='item-check'>
                              {item.itemState ? 
                                '已完成' 
                                : 
                                <>
                                  處理中
                                  <button className='check-button' onClick={() => {handleItemState(content.contentId, item.itemId)}}>確定</button>
                                </>
                              }
                            </div> 
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

        {userDto.userRole === 'driver' && (
          <div className="order-list">
            {contents.map((content) => (
              <div key={content.contentId} className="order-item">
                {useReceiveSearch && (
                  <>
                    <div className="order-summary" onClick={() => toggleExpand(content.contentId)}>
                      <p>寄件編號：{content.receiverDto.receiverId}</p>
                      <p>收件人：{content.receiverDto.receiverName}</p>
                      <p>寄件地址：{content.receiverDto.receiverAddress}</p>
                      <p>收件人電話：{content.receiverDto.receiverPhone}</p>
                      <p>寄件狀態: 
                        {
                          content.contentState?
                          (
                            content.receiverDto.receiverState? 
                            '已送達'
                            :
                            (
                            <>
                              寄送中
                              <button className='check-button' onClick={() => {handleReceiverState(content.contentId)}}>確定</button>
                            </>
                            )
                          )
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
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                {useSendSearch && (
                  <>
                    <div className="order-summary" onClick={() => toggleExpand(content.contentId)}>
                      <p>收件編號：{content.senderDto.senderId}</p>
                      <p>寄件人：{content.senderDto.senderName}</p>
                      <p>收件地址：{content.senderDto.senderAddress}</p>
                      <p>寄件人電話：{content.senderDto.senderPhone}</p>
                      <p>收件狀態： 
                        {content.senderDto.senderState? 
                          '已收件'
                          :
                          (
                          <>
                            待收件
                            <button className='check-button' onClick={() => {handleSenderState(content.contentId)}}>確定</button>
                          </>
                          )
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
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {userDto.userRole === 'administrator' && (
          <div className="order-list">
            {contents.map((content) => (
              <div key={content.contentId} className="order-item">
                {(useSendSearch || useReceiveSearch) && (
                  <>
                    <div className="order-summary" onClick={() => toggleExpand(content.contentId)}>
                      <p>訂單編號：{content.contentId}</p>
                      <p>收件日期：{content.contentReceiveDate}</p>
                      <p>寄件日期：{content.contentSendDate}</p>
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
                                <div className='item-check'>
                                  {item.itemState ? 
                                    '已完成' 
                                    : 
                                    '處理中'
                                  }
                                </div> 
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentList;