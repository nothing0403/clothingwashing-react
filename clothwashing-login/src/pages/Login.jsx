import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { LoginContext} from '../ActionContext/LoginContext';
import { AccountContext } from '../ActionContext/AccountContext';

function Login() {

  const [loginForm, setLoginForm] = useState({useraccount:'', userpassword:''})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { setIsLoggedIn } = useContext(LoginContext);
  const { setLoginAccount } = useContext(AccountContext);
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

      const result = await response.json();

      if (response.ok) {
        console.log(result)
        setLoginAccount(result.data.userName);
        setIsLoggedIn(true);
        Swal.fire({
        title: '登入成功！',
        text: '歡迎光臨！',
        icon: 'success',
        confirmButtonText: '前往主畫面'
      }).then(() => {
        // 使用者按下確認後，導向主畫面
        setSuccess('登入成功');
        if(result.data.userRole === "customer"){
            navigate('/'); // 或你想去的路由
        }
        else{
            navigate('/ordersearch'); 
        }
        
      });
      } else {
        Swal.fire({
          title: '登入失敗',
          text: '請確認帳號密碼是否正確',
          icon: 'error',
          confirmButtonText: '確定'
        });
        setError('登入失敗');
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
      <Link to="/login/submit">註冊</Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  )
}

export default Login;
