import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style/submit_style.css';

function Submit() {
  const [submitForm, setSubmitForm] = useState({
    username: '',
    useraccount: '',
    userpassword: '',
    userphone: '',
    useraddress: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitForm((submitForm) => ({ ...submitForm, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!Object.values(submitForm).every(val =>!!val)){
      alert("註冊資料未完成。");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8081/rest/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(submitForm),
      });

      if (response.ok) {
        Swal.fire({
          title: '已寄送驗證信。',
          text: '請確認驗證信再登入。',
          icon: 'success',
          confirmButtonText: '回首頁',
        }).then(() => {
          navigate('/'); 
        });
      } else {
        Swal.fire({
          title: '驗證信寄送失敗',
          text: '請確認資料是否輸入完成',
          icon: 'error',
          confirmButtonText: '確定',
        });
      }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };

  return (
    <div className="submit-container">
      <form className="submit-form">
        <h2>會員註冊</h2>

        <label>名字</label>
        <input
          type="text"
          name="username"
          value={submitForm.username}
          onChange={handleChange}
          placeholder="請輸入姓名"
        />

        <label>電話</label>
        <input
          type="text"
          name="userphone"
          value={submitForm.userphone}
          onChange={handleChange}
          placeholder="請輸入電話"
        />

        <label>地址</label>
        <input
          type="text"
          name="useraddress"
          value={submitForm.useraddress}
          onChange={handleChange}
          placeholder="請輸入地址"
        />

        <label>帳號</label>
        <input
          type="text"
          name="useraccount"
          value={submitForm.useraccount}
          onChange={handleChange}
          placeholder="請輸入帳號"
        />

        <label>密碼</label>
        <input
          type="password"
          name="userpassword"
          value={submitForm.userpassword}
          onChange={handleChange}
          placeholder="請輸入密碼"
        />

        <button type="submit" onClick={handleClick}>註冊</button>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </form>
    </div>
  );
}

export default Submit;