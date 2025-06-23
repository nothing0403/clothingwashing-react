import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../style/submit_style.css';

function EmployeeSubmit() {
  const [submitForm, setSubmitForm] = useState({
    useraccount: '',
    userpassword: '',
    userrole: ''
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
      const response = await fetch('http://localhost:8081/rest/employee/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(submitForm),
      });

      if (response.ok) {
        Swal.fire({
          title: '註冊成功！',
          text: '已新增員工！',
          icon: 'success',
          confirmButtonText: '前往登入畫面',
        }).then(() => {
          navigate('/contentlist');
        });
      } else {
        Swal.fire({
          title: '註冊失敗',
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
        <h2>員工註冊</h2>

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

        <label>角色類別</label>
        <input
          type="text"
          name="userrole"
          value={submitForm.userrole}
          onChange={handleChange}
          placeholder="請輸入角色類別"
        />

        <button type="submit" onClick={handleClick}>註冊</button>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </form>
    </div>
  );
}

export default EmployeeSubmit;