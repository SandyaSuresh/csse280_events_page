import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'

async function login() {
    try {
        let username = document.getElementById("username_text").value;
        let password = document.getElementById("password_text").value;
        let response = await fetch("/login",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            });
        
        let reponseData = await response.json();
        let access_token = reponseData["access_token"];
        if(!access_token){
            alert("Login Failed");
            return; 
        }
        console.log("help")
        localStorage.setItem("access_token", access_token);
        window.location.href = "/explore.html";

    }
    catch (ex) {
        console.error(ex);
    }
}

function Login(){
    return (
    <>
        <h2>Campus Events</h2>
        <div id="login">
            <h3>Login</h3>
                <form action="/account" method="POST" encType="application/x-www-form-urlencoded">
                        <p>
                            <label htmlFor="username_text">Username:</label>
                            <input id="username_text" type="text" name="username"/>
                        </p>
                        <p>
                            <label htmlFor="password_text">Password:</label>
                            <input id="password_text" type="password" name="password"/>
                        </p>
                        <input id="create_button" type="submit" value="Create Account"/>
                        <button id="login_button" type="button" onClick={login}>Login</button>
                </form>
        </div>
    </>);

}

export default Login;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)