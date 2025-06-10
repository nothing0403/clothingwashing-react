import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { usePageAction } from '../ActionContext/PageActionContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Deliver() {

  const navigate = useNavigate();
  const actionRef = usePageAction();

  const [sender, setSender] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderDate: ""
  });

  const [receiver, setReceiver] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverDate: ""
  });

  const deliver = [receiver,sender];

  const senddate = new Date();
  const receivedate = new Date();
  senddate.setDate(senddate.getDate() + 1);
  receivedate.setDate(receivedate.getDate() + 5);

  const handleSenderChange = (e) => {
    setSender({ ...sender, [e.target.name]: e.target.value });
  };

  const handleReceiverChange = (e) => {
    setReceiver({ ...receiver, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (actionRef) {
      actionRef.current = async (e) => {
        /*e.preventDefault();*/
        const response = await fetch('http://localhost:8081/rest/deliver',{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deliver)
        });
        // 導向結帳清單
        navigate('/result');
      };
    }
  }, [actionRef]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold mb-4">寄件人與收件人資訊</h2>
      
      {/* 寄件人欄位 */}
      <div>
        <h3 className="text-xl font-semibold mb-2">寄件人資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="senderName"
            placeholder="姓名"
            value={sender.senderName}
            onChange={handleSenderChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="senderPhone"
            placeholder="電話"
            value={sender.senderPhone}
            onChange={handleSenderChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="senderAddress"
            placeholder="地址"
            value={sender.senderAddress}
            onChange={handleSenderChange}
            className="border p-2 rounded md:col-span-2"
            required
          />
          <label>選擇日期：</label>
          <DatePicker
            selected={sender.senderDate}
            onChange={(date) => {
              const formatted = date.toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
              });
              handleSenderChange(formatted)}
            }
            minDate={senddate}
            dateFormat="yyyy/MM/dd"
            placeholderText="請選擇日期"
          />
        </div>
      </div>

      {/* 收件人欄位 */}
      <div>
        <h3 className="text-xl font-semibold mb-2">收件人資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="receiverName"
            placeholder="姓名"
            value={receiver.receiverName}
            onChange={handleReceiverChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="receiverPhone"
            placeholder="電話"
            value={receiver.receiverPhone}
            onChange={handleReceiverChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="receiverAddress"
            placeholder="地址"
            value={receiver.receiverAddress}
            onChange={handleReceiverChange}
            className="border p-2 rounded md:col-span-2"
            required
          />
          <label>選擇日期：</label>
          <DatePicker
            selected={receiver.receiverDate}
            onChange={(date) => {
              const formatted = date.toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
              });
              handleReceiverChange(formatted)}
            }
            minDate={receivedate}
            dateFormat="yyyy/MM/dd"
            placeholderText="請選擇日期"
          />
        </div>
      </div>
    </div>
  );
};

export default Deliver;