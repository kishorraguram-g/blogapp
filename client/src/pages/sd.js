import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setUserInfo} = useContext(UserContext);
    const [redirect,setRedirect]=useState(false);
    async function login(ev) {
        ev.preventDefault();
        try{
        const response = await fetch('http://localhost:4000/login', {
          method: 'POST',
          body: JSON.stringify({username,password}),
          headers: {'Content-Type':'application/json'},
        });
        if(response.ok){
            
            const userInfo=await response.json();
            setUserInfo(userInfo);
            alert("Login Successfull");
            setRedirect(true);
        }
        else{
            alert("Invalid Username or password");
        }
      }catch(err){
        console.log("Error during login:",err);
        alert("Login failed.Pleader tru again");
      }
    }
    if(redirect){
        return <Navigate to ="/" />
    }
    return (
    <div>
            <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Login</button>
    </form>
    </div>
  )
}

export default LoginPage