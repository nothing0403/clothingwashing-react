import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { usePageAction } from '../ActionContext/PageActionContext';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/deliver_style.css'

function Deliver() {

  const navigate = useNavigate();
  const actionRef = usePageAction();

  const [senderDto, setSenderDto] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderDate: null,
    senderTimePeriod: "",
    senderPayment: ""
  });

  const [receiverDto, setReceiverDto] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverDate: null
  });

  // const senddate = new Date();
  const [senddate, setSendDate] = useState([]);

  const handleSenderDate = (e) => {
    setSenderDto({ ...senderDto, [e.target.name]: e.target.value });
    const date = new Date(e.target.value);
    date.setDate(date.getDate() + 5);
    const formatted = date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    setReceiverDto({...receiverDto, 'receiverDate': formatted})
  };

  const handleSenderChange = (e) => {
    setSenderDto({ ...senderDto, [e.target.name]: e.target.value });
  };

  const handleReceiverChange = (e) => {
    setReceiverDto({ ...receiverDto, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const date = new Date();
    for(let i=0; i<4; i++){
      date.setDate(date.getDate()+1);
      const formatted = date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      setSendDate(senddate => [...senddate, formatted]);
    }
  }, [])

  useEffect(() => {
    // 拿到Ref物件
    if (actionRef) {
      actionRef.current = async (e) => {
        if (!Object.values(senderDto).every(val =>!!val)){
          alert("寄件人資料未完成。");
          return;
        }
        else if (!Object.values(receiverDto).every(val =>!!val)){
          alert("收件人資料未完成。");
          return;
        }
        /*e.preventDefault();*/
        console.log({receiverDto, senderDto})
        const response = await fetch('http://localhost:8081/rest/deliver',{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({receiverDto, senderDto})
        });
        // 導向結帳清單
        navigate('/result');
      };
    }
    // 讓useState監聽receiver、sender的更新
  }, [actionRef, receiverDto, senderDto]);

  return (
    <div>
      <div className="deliver_container">
        <div className="sender_container">
          <div className="sender_box">
            <h3>寄件人資訊</h3>
            <div>
              姓名
              <input
                type="text"
                name='senderName'
                placeholder="請輸入姓名"
                value={senderDto.senderName}
                onChange={handleSenderChange}
                required
              />
            </div>
            <div>
              電話
              <input
                type="text"
                name='senderPhone'
                placeholder="請輸入電話"
                value={senderDto.senderPhone}
                onChange={handleSenderChange}
                required
              />
            </div>
            <div>
              地址
              <input
                type="text"
                name='senderAddress'
                placeholder="請輸入地址"
                value={senderDto.senderAddress}
                onChange={handleSenderChange}
                required
              />
            </div>
          </div>
          <div className="date_box">
            <div className="receive_date">
              <div>
                收件日期
                <select  className="selectedDate" name="senderDate" onChange={handleSenderDate} placeholder="請輸入收件日期">
                  <option value={senddate[0]}>{senddate[0]}</option>
                  <option value={senddate[1]}>{senddate[1]}</option>
                  <option value={senddate[2]}>{senddate[2]}</option>
                  <option value={senddate[3]}>{senddate[3]}</option>
                </select>
              </div>
              <div>
                選擇收件時段
                <input type="radio" name="senderTimePeriod" value="morning" onChange={handleSenderChange}/>上午9點至上午12點
                <input type="radio" name="senderTimePeriod" value="afternoon" onChange={handleSenderChange}/>上午12點至下午3點
                <input type="radio" name="senderTimePeriod" value="evening" onChange={handleSenderChange}/>下午3點至下午6點
              </div>
              <div>
                付款方式
                <input type="radio" name="senderPayment" value="credit_card" onChange={handleSenderChange}/>信用卡
                <input type="radio" name="senderPayment" value="pay_cash" onChange={handleSenderChange}/>付現
              </div>
            </div>
          </div>
        </div>
        <div className="receiver_container">
          <div className="receiver_box">
            <h3>收件人資訊</h3>
            <div>
              姓名
              <input
                type="text"
                name="receiverName"
                placeholder="請輸入姓名"
                value={receiverDto.receiverName}
                onChange={handleReceiverChange}
                required
              />
            </div>
            <div> 
              電話
              <input
                type="text"
                name="receiverPhone"
                placeholder="請輸入電話"
                value={receiverDto.receiverPhone}
                onChange={handleReceiverChange}
                required
              />
            </div>
            <div>
              地址
              <input
                type="text"
                name="receiverAddress"
                placeholder="請輸入地址"
                value={receiverDto.receiverAddress}
                onChange={handleReceiverChange}
                required
              />
            </div>
          </div>
          <div className="send_date">
            到件日期估計為: {receiverDto.receiverDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliver;