import {useState} from "react";
import axios from "axios";
import {useCookies, Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import "../css/login.scss";

function Login(props){
    const [user, setUser] = useState({
        id: "",
        pw: ""
    });
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate(); // navigation 주는거임
    const axiosLoading = props.axiosLoading
    
    const handleForm = (e) => {
        e.target.value = e.target.value.replace(/ /g,"");
        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
    }

    const handleLogin = async () => {
        try {
            axiosLoading(async () => {
                const response = await axios.post('/member', user)
                if (response.data.answer) {
                    // alert("로그인 성공 되셨습니다.")

                    // 쿠키 만료 시간 설정
                    const expires = new Date();
                    expires.setDate(expires.getDate() + 30); // 30일 후에 만료

                    // 쿠키 설정
                    setCookies("userid", response.data.userid, {path: "/", expires: expires})
                    setCookies("username", response.data.username, {path: "/", expires: expires})
                    setCookies("userkey", response.data.userkey, {path: "/", expires: expires})
                    if (response.data.level === "admin")
                        navigate("/admin");
                    else
                        navigate("/");
                } else {
                    alert("아이디 또는 비밀번호를 틀리셨습니다.")
                }
            })
        } catch (error) {
            console.error('Error', error);
        }
    }

    return(
    <div className="loginContainer">
        <div className="loginBox">

            {/*id: <input type="text" name="id" id="" onChange={handleForm}/><br/>*/}
            {/*pw: <input type="password" name="pw" id=""  onChange={handleForm}/>*/}
            {/*<input type="button" value="login"  onClick={handleLogin}/>*/}
            <li className="list__item">

                <div className="group">
                    <input type="text" name="id" id="" onChange={handleForm} required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label htmlFor="name">Id</label>
                </div>

                <div className="group">
                    <input type="password" name="pw" id="" onChange={handleForm} required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label htmlFor="pw">Password</label>
                </div>
                <a href="#" className="login-button">
                    <span onClick={handleLogin}>
                      Login
                    </span>
                </a>
            </li>
        </div>
    </div>
    )
}

export default Login;