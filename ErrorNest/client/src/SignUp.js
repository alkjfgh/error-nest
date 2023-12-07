import React, {useEffect, useState} from 'react';
import emailjs from 'emailjs-com';
import axios from "axios";
import {useNavigate} from "react-router-dom";

function SignUp(props) {
    const [members, setMembers] = useState([{}]);
    const [isAuth, setIsAuth] = useState("none");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [authCheck, setAuthCheck] = useState("");
    const [inputs, setInputs] = useState({
        id: '',
        pw: '',
        email: '',
        name: ''
    });

    const navigate = useNavigate(); // navigation 주는거임

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
        if(flag){
            const response= await axios.post('/member/insert', data)
                .then(()=>alert("회원가입 되었습니다."))
                .then(()=>navigate("/"));
            // console.log(response.data.success);
        }
        else{
            alert("인증 먼저 해주세요.");
        }

        // if(response.data.success) getMembers().then(r => {});
    };

    const AuthCode = Math.random().toString(36).substr(2,6); //랜덤 문자열 6자리 생성
    const sendAuthCode = async () => {
        // 이메일 보내기
        // 여기서 정의해야하는 것은 위에서 만든 메일 템플릿에 지정한 변수({{ }})에 대한 값을 담아줘야한다.
        const data = {
            to_email: inputs.email,// 수신 이메일 ex) test@test.gmail.com,
            message: AuthCode,
            email_id: "heo1356@gmail.com",
            to_name: inputs.name
        };
        console.log(data);
        const myRe = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}$";
        if(inputs.pw.match(myRe)){
            emailjs
                .send(
                    'Error-Nest', // 서비스 ID
                    'Error-Nest-Template', // 템플릿 ID
                    data,
                    'J6nfhXFXy8JaKsOwj', // public-key
                )
                .then((response) => {
                    console.log('이메일이 성공적으로 보내졌습니다:', response);
                    setIsEmailSent(true);
                    // 이메일 전송 성공 처리 로직 추가
                })
                .catch((error) => {
                    console.error('이메일 보내기 실패:', error);
                    // 이메일 전송 실패 처리 로직 추가
                });
            await axios.post('/token', {data:{id: inputs.id, token: AuthCode}});
        }
        else{
            alert("비밀번호를 영어 소문자, 숫자, 특수문자가 각각 1개 이상 포함되도록 8~20자를 적어주세요.");
        }
        // console.log("들어옴");
    }

    let flag = 0;

    const checkAuth = async (e) => {
        const res = await axios.post('/token/check', {data:{id: inputs.id, token: authCheck}});
        // console.log(res.data.answer);
        // console.log(inputs.id);
        // console.log(authCheck);
        if(res.data.answer){
            alert("인증되었습니다.");
            flag = 1;
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                name: <input type="test" name="name" onChange={handleChange} required/><br/>
                id: <input type="text" name="id" onChange={handleChange} required/><br/>
                pw: <input type="password" name="pw" onChange={handleChange} required/><br/>
                email: <input type="email" name="email" onChange={handleChange} required/>
                <button type="button" onClick={() => {
                        const myRe = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}$";
                        if(inputs.pw.match(myRe))
                            setIsAuth("block")
                        sendAuthCode();
                    }
                }>인증</button><br/>
                {isAuth === "block" && (
                    <div style={{display: isAuth}}>
                        인증: <input type="text" onChange={(e) => setAuthCheck(e.target.value)}/>
                        <button type="button" onClick={checkAuth}>확인</button><br/>
                    </div>
                )}
                <button type="submit">회원가입</button>
            </form>
        </>
    );
}

export default SignUp;