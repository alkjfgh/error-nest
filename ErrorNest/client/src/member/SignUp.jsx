import React, {useEffect, useState} from 'react';
import emailjs from 'emailjs-com';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import '../css/signUp.scss';

function SignUp(props) {
    const [isAuth, setIsAuth] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [authCheck, setAuthCheck] = useState("");
    const [inputs, setInputs] = useState({
        id: '',
        pw: '',
        email: '',
        name: '',
        pwCheck: ''
    });

    const navigate = useNavigate(); // navigation 주는거임
    const [canSignup, setCanSignup] = useState();
    const[count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    const [check, setCheck] = useState(false);
    const [isCanPassword, setIsCanPassword] = useState("패스워드 형식이 맞지 않습니다.");
    const [isPwEquals, setIsPwEquals] = useState("일치하지 않습니다.");
    const [isCanEmail, setIsCanEmail] = useState(false);
    const axiosLoading = props.axiosLoading

    useEffect(() => {
        if(count > 0){
            setTimeout(() => {
                setCount((count) => count - 1);
            }, 1000);
        }
    },[count]);

    // 패스워드 정규식 체크
    useEffect(() => {
        isCanPw();
    }, [inputs.pw]);

    // 패스워드 확인 일치한지 체크
    useEffect(() => {
        pwEquals();
    },[inputs.pwCheck]);
    
    // 이메일 중복 체크
    useEffect(() => {
        isCanEm();
    }, [inputs.email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // 공백 입력 방지
        e.target.value = e.target.value.replace(/ /g,"");
        setInputs({
            ...inputs,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = inputs;
        // console.log(data);
        if(flag){
            axiosLoading(async () => {
                const response = await axios.post('/member/insert', data)
                    // .then(() => alert("회원가입 되었습니다."))
                    .then(() => navigate("/"));
                // console.log(response.data.success);
            });
        }
        else{
            alert("인증 먼저 해주세요.");
        }

        // if(response.data.success) getMembers().then(r => {});
    };

    const AuthCode = Math.random().toString(36).substr(2,6); //랜덤 문자열 6자리 생성
    const sendAuthCode = async () => {
        // 아이디, 비밀번호, 이메일, 이름 빈칸 체크 여기서부터 체크
        if(inputs.id !== '' && inputs.pw !== '' && inputs.pwCheck !== '' && inputs.email !== '' && inputs.name !== ''){
            // 아이디 중복 체크 먼저 하게 체크
            if(check){
                // 이메일 보내기
                // 여기서 정의해야하는 것은 위에서 만든 메일 템플릿에 지정한 변수({{ }})에 대한 값을 담아줘야한다.
                const data = {
                    to_email: inputs.email,// 수신 이메일 ex) test@test.gmail.com,
                    message: AuthCode,
                    email_id: props.email.REACT_APP_EMAIL,
                    to_name: inputs.name
                };
                // console.log(data);
                const myRe = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}$";
                // const checkEquals = await axios.post('/member/checkEquals', {id: inputs.id, email: inputs.email});
                const checkEquals = await axios.post('/member/checkEquals', {email: inputs.email});
                setCanSignup(checkEquals.data.answer);
                if(inputs.pw.match(myRe) && inputs.pw === inputs.pwCheck && checkEquals.data.answer && isCanEmail){
                    // 인증 유효시간
                    setCount(180);
                    emailjs
                        .send(
                            props.email.REACT_APP_SERVICEID, // 서비스 ID
                            props.email.REACT_APP_TEMPLATEID, // 템플릿 ID
                            data,
                            props.email.REACT_APP_USERID, // public-key
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
                    setIsAuth(true)
                }
                else if(inputs.pw !== inputs.pwCheck){
                    alert("비밀번호가 일치하지 않습니다.");
                }
                else if(!checkEquals.data.answer){
                    alert("이미 계정이 존재하는 이메일입니다.");
                }
                else if(!isCanEmail){
                    alert("올바른 이메일 형식을 적어주세요.");
                }
                else{
                    alert("비밀번호를 영어 소문자, 숫자, 특수문자가 각각 1개 이상 포함되도록 8~20자를 적어주세요.");
                }
            }
            else alert("아이디 중복체크를 먼저 해주세요.");
        }
        else alert("모든 칸을 입력해주세요.");
        // console.log("들어옴");
    }

    const isCanEm = () => {
        const myRe = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
        if(inputs.email.match(myRe)) setIsCanEmail(true);
        else setIsCanEmail(false);
    }

    // 패스워드 정규식 체크
    const isCanPw = () => {
        const myRe = "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}$";
        if(inputs.pw.match(myRe)) setIsCanPassword("사용가능한 형식입니다.");
        else setIsCanPassword("패스워드 형식이 맞지 않습니다.");
    }

    // 패스워드 확인 체크
    const pwEquals = () => {
        if(inputs.pw === inputs.pwCheck && inputs.pw !== '') setIsPwEquals("일치합니다.");
        else setIsPwEquals("일치하지 않습니다.");
    }

    // 인증코드 임시 저장하고 인증 확인
    const checkAuth = async (e) => {
        const res = await axios.post('/token/check', {data:{id: inputs.id, token: authCheck}});
        // console.log("인증확인");
        if(res.data.answer){
            alert("인증되었습니다.");
            setFlag(true);
        }
        else setFlag(false);
    }

    // 아이디 중복 체크
    const checkId = async () => {
        const checkEquals = await axios.post('/member/checkEquals', {id: inputs.id});
        if(checkEquals.data.answer){
            alert("사용가능한 아이디입니다.");
            setCheck(true);
        }
        else{
            alert("중복된 아이디입니다.");
            setCheck(false);
        }
    }

    return (
        <div className="signUpBox">
            <form onSubmit={handleSubmit}>
                <li className="signUp-container__item">
                    <span className="welcome-message">Welcome to ErrorNest!</span>
                    <div className="signUp-group">
                        <input type="test" name="name" onChange={handleChange} required placeholder=""/>
                        <span className="buttonClick"><button
                            className="continue action-button animate">확인</button>
                        </span>
                        <span className="signUp-highlight"></span>
                        <span className="signUp-bar"></span>
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className="signUp-group">
                        <input type="text" name="id" onChange={handleChange} required placeholder=""/>
                        <span className="buttonClick">
                            <button id="idCheck" className="continue action-button animate" type="button" onClick={() => checkId()}>중복확인</button>
                        </span>
                        <span className="signUp-highlight"></span>
                        <span className="signUp-bar"></span>
                        <label htmlFor="id">Id</label>
                    </div>
                    <div className="signUp-group pw-group">
                        <input type="password" name="pw" onChange={handleChange} required placeholder=""/>
                        <span className="buttonClick">
                            <button className="continue action-button animate">확인</button>
                        </span>
                        <div>
                            {inputs.pw.trim() && <span className="hidden">{isCanPassword}</span>}
                        </div>
                        <span className="signUp-highlight"></span>
                        <span className="signUp-bar"></span>
                        <label htmlFor="pw">Password</label>
                    </div>
                    <div className="signUp-group pw-group">
                        <input type="password" name="pwCheck" onChange={handleChange} required placeholder=""/>
                        <span className="buttonClick">
                            <button className="continue action-button animate">확인</button>
                        </span>
                        <div>
                            {inputs.pwCheck.trim() && <span className="hidden"><span>{isPwEquals}</span></span>}
                        </div>
                        <span className="signUp-highlight"></span>
                        <span className="signUp-bar"></span>
                        <label htmlFor="pwCheck">Verify Password</label>
                    </div>
                    <div className="signUp-group">
                        <input type="email" name="email" onBlur={handleChange} required placeholder=""/>
                        <span className="buttonClick">
                            <button className="continue action-button animate" type="button" onClick={() => sendAuthCode()}>인증</button>
                        </span>
                        <div>
                            {count >= 1 && count !== 0 && <span className="hidden"><span>인증 제한시간 {Math.floor(count / 60)}:{count % 60}</span></span>}
                        </div>
                        <span className="signUp-highlight"></span>
                        <span className="signUp-bar"></span>
                        <label htmlFor="email">Email</label>
                    </div>
                    {/*{isAuth && (*/}
                    <div className="signUp-group">
                        <input type="text" name="auth" onChange={(e) => setAuthCheck(e.target.value)} required placeholder=""/>
                        <span className="buttonClick">
                            <button className="continue action-button animate" type="button" onClick={checkAuth}>확인</button>
                        </span>
                        <span className="signUp-highlight"></span>
                        <span className="signUp-bar"></span>
                        <label htmlFor="auth">Auth</label>
                    </div>
                    {/*)}*/}
                    <button className="login-button" type="submit"><span>회원가입</span></button>
                </li>
            </form>
        </div>
    );
}

export default SignUp;