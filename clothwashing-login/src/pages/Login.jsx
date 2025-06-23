import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { LoginContext } from '../ActionContext/LoginContext';
import { AccountContext } from '../ActionContext/AccountContext';
import '../style/login_style.css';

function Login() {
  const [loginForm, setLoginForm] = useState({ useraccount: '', userpassword: '' , userauthcode: ''});
  const [captchaUrl, setCaptchaUrl] = useState('http://localhost:8081/rest/captcha');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setIsLoggedIn } = useContext(LoginContext);
  const { setLoginAccount } = useContext(AccountContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((loginForm) => ({ ...loginForm, [name]: value }));
  };

  const handleAuthCode = () => {
    
    setCaptchaUrl(`http://localhost:8081/rest/captcha?${new Date().getTime()}`)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!Object.values(loginForm).every(val => !!val)){
      alert("請填寫登入欄位。");
      return;
    }
    try {
      const response = await fetch('http://localhost:8081/rest/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(loginForm),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        setLoginAccount(result.data.userName);
        setIsLoggedIn(true);
        Swal.fire({
          title: '登入成功！',
          text: '歡迎光臨！',
          icon: 'success',
          confirmButtonText: '前往主畫面',
        }).then(() => {
          setSuccess('已登入');
          if (result.data.userRole === 'customer') {
            navigate('/');
          } else {
            navigate('/contentlist');
          }
        });
      } else {
        Swal.fire({
          title: '登入失敗',
          text: '請確認帳號密碼是否正確',
          icon: 'error',
          confirmButtonText: '確定',
        });
        setError('帳密錯誤');
      }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>會員登入</h2>
        <label>帳號</label>
        <input
          type="text"
          name="useraccount"
          value={loginForm.useraccount}
          onChange={handleChange}
          placeholder="請輸入帳號"
        />

        <label>密碼</label>
        <input
          type="password"
          name="userpassword"
          value={loginForm.userpassword}
          onChange={handleChange}
          placeholder="請輸入密碼"
        />

        <label>驗證碼</label>
        <div className='authcode_form'>
          <input
            type="text"
            name="userauthcode"
            value={loginForm.userauthcode}
            onChange={handleChange}
            placeholder="請輸入驗證碼"
          />
          <img src={captchaUrl} alt="" onClick={handleAuthCode} style={{ cursor: 'pointer' }} />
        </div>

        <button type="button" onClick={handleLogin}>
          登入
        </button>

        <div className='register-box'>
          <Link className="register-link" to="/login/submit">
            註冊帳號
          </Link>
          <Link className="forget-password" to="/login/forget">
            忘記密碼
          </Link>
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
      </form>
    </div>
  );
}

export default Login;
