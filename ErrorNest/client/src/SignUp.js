import React, {useEffect, useState} from 'react';
import emailjs from 'emailjs-com';
import axios from "axios";

function SignUp(props) {
    const [members, setMembers] = useState([{}]);
    const [isAuth, setIsAuth] = useState("none");
    const [isEmailSent, setIsEmailSent] = useState(false);

    const [inputs, setInputs] = useState({
        id: '',
        pw: '',
        email: '',
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
        // console.log(inputs);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = inputs;
        // console.log(data);
        const response= await axios.post('/member/insert', data);
        console.log(response.data.success);
        // if(response.data.success) getMembers().then(r => {});
    };

    const sendAuthCode = async () => {
        // 이메일 보내기
        // 여기서 정의해야하는 것은 위에서 만든 메일 템플릿에 지정한 변수({{ }})에 대한 값을 담아줘야한다.
        const AuthCode = Math.random().toString(36).substr(2,6); //랜덤 문자열 6자리 생성
        const data = {
            to_email: inputs.email,// 수신 이메일 ex) test@test.gmail.com,
            message: AuthCode,
        };
        console.log(data);
        // console.log("들어옴");
    }

    const checkAuth = async () => {

    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                name: <input type="test" name="name" onChange={handleChange} required/><br/>
                id: <input type="text" name="id" onChange={handleChange} required/><br/>
                pw: <input type="password" name="pw" onChange={handleChange} required maxLength="20" minLength="8"/><br/>
                email: <input type="email" name="email" onChange={handleChange} required/>
                <button type="button" onClick={() => {
                        setIsAuth("block")
                        sendAuthCode();
                    }
                }>인증</button><br/>
                <div style={{display: isAuth}}>
                    인증: <input type="text"/>
                    <button type="button" onClick={checkAuth}>확인</button><br/>
                </div>
                <button type="submit">회원가입</button>
            </form>
        </>
    );
}

export default SignUp;