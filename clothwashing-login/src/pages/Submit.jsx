import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Submit() {

  const [submitForm, setSubmitForm] = useState({username:'', useraccount:'', userpassword:'', userphone:'', useraddress:''})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setSubmitForm( submitForm => ({...submitForm, [name]: value}));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/rest/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(submitForm)
      });

      if (response.ok) {
        Swal.fire({
        title: '註冊成功！',
        text: '歡迎成為會員！',
        icon: 'success',
        confirmButtonText: '前往登入畫面'
      }).then(() => {
        // 使用者按下確認後，導向主畫面
        navigate('/login'); // 或你想去的路由
      });
      } else {
        Swal.fire({
          title: '註冊失敗',
          text: '請確認資料是否輸入完成',
          icon: 'error',
          confirmButtonText: '確定'
        });
      }
    } catch (err) {
      setError('無法連線到伺服器');
    }
  };
  
  return(
    <div>
      <h1>註冊</h1>
      <label>名字: </label>
      <input type="text" name="username" value={submitForm.username} onChange={handleChange}/><br />
      <label>電話: </label>
      <input type="text" name="userphone" value={submitForm.userphone} onChange={handleChange}/><br />
      <label>地址: </label>
      <input type="text" name="useraddress" value={submitForm.useraddress} onChange={handleChange}/><br />
      <label>帳號: </label>
      <input type="text" name="useraccount" value={submitForm.useraccount} onChange={handleChange}/><br />
      <label>密碼: </label>
      <input type="text" name="userpassword" value={submitForm.userpassword} onChange={handleChange}/><br />
      <button type="submit" onClick={handleClick}>註冊</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  )
}

export default Submit;
