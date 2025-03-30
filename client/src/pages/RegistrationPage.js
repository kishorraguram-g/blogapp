import {useState} from "react";
import './Registration.css'
import { useNavigate } from "react-router-dom";
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('https://blogapp-server-mocha.vercel.app/register', {
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.status === 201) {
      alert('registration successful');
      navigate('/login');
    } 
    else if(response.status===400){
      alert('account already exists')
    }
    else {
      alert('registration failed');
console.log(response)
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
    </form>
  );
}