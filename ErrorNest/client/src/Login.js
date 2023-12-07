import {useState} from "react";
import axios from "axios";
import {useCookies, Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

function Login(){
    const [user, setUser] = useState({
        id: "",
        pw: ""
    });
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate(); // navigation 주는거임
    
    const handleForm = (e) => {

        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
        console.log(user)
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post('/member', user)
            if(response.data.answer){
                alert("로그인 성공 되셨습니다.")
                // 쿠키 설정\
                setCookies("userid", response.data.userid, {path: "/"})
                setCookies("username", response.data.name, {path: "/"})
                navigate("/");
            }
            else {
                alert("아이디 또는 비밀번호를 틀리셨습니다.")
            }

        } catch (error) {
            console.error('Error', error);
        }
    }

    return(
        <div>
            <input type="text" name="id" id="" onChange={handleForm}/><br/>
            <input type="text" name="pw" id=""  onChange={handleForm}/>
            <input type="button" value="login"  onClick={handleLogin}/>
        </div>
    )
}

export default Login;