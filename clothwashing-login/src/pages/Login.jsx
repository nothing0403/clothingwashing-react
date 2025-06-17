import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

function Login() {

  const [loginForm, setLoginForm] = useState({useraccount:'', userpassword:''})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setLoginForm( loginForm => ({...loginForm, [name]: value}));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/rest/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(loginForm)
      });

      if (response.ok) {
        Swal.fire({
        title: '登入成功！',
        text: '歡迎回來！',
        icon: 'success',
        confirmButtonText: '前往主畫面'
      }).then(() => {
        // 使用者按下確認後，導向主畫面
        navigate('/'); // 或你想去的路由
      });
      } else {
        Swal.fire({
          title: '登入失敗',
          text: '請確認帳號密碼是否正確',
          icon: 'error',
          confirmButtonText: '確定'
        });
      }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/rest/logout', {
        method: 'PUT',
        credentials: 'include'
      });

      if (response.ok) {
        setSuccess('登出成功！');
        setError('');
      } else {
        const result = await response.json();
        setError(result.message || '登出失敗');
      }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };
  
  return(
    <div>
      <label>帳號: </label>
      <input type="text" name="useraccount" value={loginForm.useraccount} onChange={handleChange}/><br />
      <label>密碼: </label>
      <input type="text" name="userpassword" value={loginForm.userpassword} onChange={handleChange}/><br />
      <button type="button" onClick={handleLogin}>登入</button>
      <button type="button" onClick={handleLogout}>登出</button>
      <Link to="/login/submit">註冊</Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  )
}

export default Login;
