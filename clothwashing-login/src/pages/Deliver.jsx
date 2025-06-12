import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { usePageAction } from '../ActionContext/PageActionContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../style/deliver_style.css'

function Deliver() {

  const navigate = useNavigate();
  const actionRef = usePageAction();

  const [senderDto, setSenderDto] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderDate: null
  });

  const [receiverDto, setReceiverDto] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverDate: null
  });

  const senddate = new Date();
  const receivedate = new Date();
  senddate.setDate(senddate.getDate() + 1);
  receivedate.setDate(receivedate.getDate() + 5);

  const handleSenderChange = (e) => {
    setSenderDto({ ...senderDto, [e.target.name]: e.target.value });
  };

  const handleReceiverChange = (e) => {
    setReceiverDto({ ...receiverDto, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (actionRef) {
      actionRef.current = async (e) => {
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
          <div className="sender_date">
            <div>
              選擇日期
              <DatePicker
                selected={senderDto.senderDate}
                onChange={(date) => {
                  const formatted = date.toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                  });
                  setSenderDto({...senderDto, 'senderDate':formatted})}
                }
                minDate={senddate}
                dateFormat="yyyy/MM/dd"
                placeholderText="請選擇日期"
              />
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
          <div className="receiver_date">
            <div>
              選擇日期
              <DatePicker
                selected={receiverDto.receiverDate}
                onChange={(date) => {
                  const formatted = date.toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                  });
                  setReceiverDto({...receiverDto,'receiverDate':formatted})}
                }
                minDate={receivedate}
                dateFormat="yyyy/MM/dd"
                placeholderText="請選擇日期"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deliver;