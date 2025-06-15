import { useState } from 'react'

function Submit() {

  const [submitForm, setSubmitForm] = useState({username:'', useraccount:'', userpassword:'', userphone:'', useraddress:''})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
        setSuccess('註冊成功！');
        setError('');
      } else {
        const result = await response.json();
        setError(result.message || '註冊失敗');
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
