import {useState} from "react";
import axios from "axios";
function Login(){
    const [user, setUser] = useState({
        id: "",
        pw: ""
    });

    const handleForm = (e) => {

        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
        console.log(user)
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post('/member', user);
            console.log(response.data);
            if(response.data.answer){
                alert("로그인 성공 되셨습니다.")
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