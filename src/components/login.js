import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "./apiRefresh";

const Login = () => {
    const navigate = useNavigate();
    const [uname, setUsername] = useState(null);
    const [pass, setPassword] = useState(null);


    const isformfilled = uname && pass;

    const handleSubmit = async () => {

        if (!uname) {
            alert("Please Enter Username");
            return;
        }
        if (!pass) {
            alert("Please Enter Password");
            return;
        }
        try {
            const response = await api.post("/login", {
                username: uname,
                password: pass
            });

            if (response.status === 200) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("role");
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                localStorage.setItem("role", response.data.Role);
                localStorage.setItem("userName", uname);
                console.log(localStorage.getItem("accessToken"));
                console.log(localStorage.getItem("refreshToken"));
                console.log(localStorage.getItem("role"));
            }
            navigate(`/`);
        } catch (error) {
            console.error("User not found", error);
            alert("User not found.");
            return;
        }


    }

    return (
        <div className="loginPage">
            <div className='headerLogo'>
                <div onClick={() => navigate("/")}>
                    <h2>Release Dashboard</h2>
                </div>
            </div>
            <table className='loginform'>
                <thead>
                    <th>
                        <a>Release Dashboard Application</a>
                    </th>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                                id='username'
                                className='credentials'
                                placeholder='Enter Username/Email'
                                onChange={(e) => setUsername(e.target.value)}
                            >
                            </input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                id='password'
                                className='credentials'
                                placeholder='Enter Password'
                                type='password'
                                onChange={(e) => setPassword(e.target.value)}
                            >
                            </input>
                        </td>
                    </tr>
                </tbody>
                <button
                    className="logint-btn"
                    type='submit'
                    value='Enter'
                    style={{
                        backgroundColor: isformfilled ? "green" : 'white',
                        color: isformfilled ? "white" : "black",
                        cursor: isformfilled ? "pointer" : "not-allowed",
                    }}
                    onClick={handleSubmit}
                >
                    Submit
                </button>

            </table>
            <img src='logo.png' style={{
                height:"40px",
                width:"80px"
            }}/>
            <p style={{
                fontSize:"8px"
            }}>Release Dashboard</p>
            
        </div>
    );
}

export default Login;