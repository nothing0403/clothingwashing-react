import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate} from 'react-router-dom';
import '../style/login_style.css';

function Forget() {
  const [loginForm, setLoginForm] = useState({ useraccount: '', userpassword: '', usernewpassword: ''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((loginForm) => ({ ...loginForm, [name]: value }));
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if(!Object.values(loginForm).every(val => !!val)){
      alert("請填寫帳號和密碼欄位。");
      return;
    }
    if(loginForm.userpassword.trim() !== loginForm.usernewpassword.trim()){
       setError("密碼輸入錯誤。");
       return;
    }
    try {
      const response = await fetch('http://localhost:8081/rest/login/forget', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(loginForm),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        Swal.fire({
            title: '密碼已重設！',
            icon: 'success',
            confirmButtonText: '前往登入畫面',
            }).then(() => {
            navigate('/login');
        });
      } else {
        setError('找不到該帳號，密碼重設失敗。');
      }
    } catch (err) {
      setError('找不到該帳號。');
    }
  };

  return (
    <div className="login-container">

      <form className="login-form">
        <h2>重設密碼</h2>
        <label>帳號</label>
        <input
          type="text"
          name="useraccount"
          value={loginForm.useraccount}
          onChange={handleChange}
          placeholder="請輸入帳號"
        />

        <label>新密碼</label>
        <input
          type="text"
          name="userpassword"
          value={loginForm.userpassword}
          onChange={handleChange}
          placeholder="請輸入新密碼"
        />

        <label>確認密碼</label>
        <input
          type="text"
          name="usernewpassword"
          value={loginForm.usernewpassword}
          onChange={handleChange}
          placeholder="請再度輸入新密碼"
        />

        <button type="button" onClick={handleCheck}>
          確認
        </button>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </form>
    </div>
  );
}

export default Forget;