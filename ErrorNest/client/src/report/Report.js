import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";
import "../css/report.scss";

const Report = (props) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const writer = searchParams.get("writer");

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [myName, setMyName] = useState("");
    const [version, setVersion] = useState(0);
    const [comment, setComment] = useState("");
    const [cookies,] = useCookies();

    const axiosLoading = props.axiosLoading;

    /** 문서 정보 (title, version)과 내 이름을 가져옴 */
    const getDocument = async (data) => {
        const searchParams = new URLSearchParams(location.search);

        data.writer = searchParams.get("writer");
        data.version = searchParams.get("version");
        data.title = decodeURIComponent(location.pathname.replace('/report/', ''));

        setTitle(data.title);

        const res = await axios.post('/report/getDocument/', data);

        setVersion(res.data.version);
        setMyName(res.data.myName);
    }

    /** 로그인 상태와 각 상태와 관련된 정보를 가져옴 */
    const getUserInfo = async () => {
        if(cookies.userid !== undefined) {
            return {userid: cookies.userid, username: cookies.username, userkey: cookies.userkey, isLogin: true}; // 로그인 id
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();
            return {userid: data.ip, isLogin: false}; // PC ip
        }
    }

    const getData = async () => {
        getUserInfo().then((user) => getDocument(user));
    }

    useEffect(() => {
        axiosLoading(getData);
    }, []);

    const reportSubmit = async () => {
        axiosLoading(async () => {
            const userInfo = await getUserInfo();
            const res = await axios.post('/report/insert',{title, comment, version, userInfo});

            if (res.data.success)
                navigate(`/document/${title}`);
        })
    }

    const reportChange = (e) => {
        setComment(e.target.value);
    }

    return (
        <div>
            <h1>신고: {title}</h1>
            <div className={"document-navi"}>
                <button onClick={() => navigate("/document/" + title)} className={"button"}>
                    <span><Link to={"/document/" + title}>돌아가기</Link></span>
                </button>
            </div>
            <div className={"report-input-icon"}>
                <div className={"text-input"}>
                    <input type={"text"} id={"report-writer"} value={version} placeholder={"작성자"} readOnly/>
                    <label htmlFor={"report-writer"}>버전</label>
                </div>
                <div className={"text-input"}>
                    <input type={"text"} id={"report-writer"} value={writer} placeholder={"작성자"} readOnly/>
                    <label htmlFor={"report-writer"}>작성자</label>
                </div>
            </div>
            <div className={"report-writing"}>
                <textarea value={comment} onChange={reportChange}></textarea>
            </div>

            {/*<button onClick={reportSubmit} className={"button"}>*/}
            {/*    <span className={"report-button"}>신고 완료</span>*/}
            {/*</button>*/}

            <div className={'submit-btn-con'}>
                <button className="expand submit-btn" onClick={reportSubmit}>
                    신고 완료
                    <span className="expand-icon expand-hover">
                      <svg className="first" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32"
                           version="1.1">
                        <path
                            d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"/>
                      </svg>
                      <span className="loader"></span>
                      <svg className="second" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M17 5L8 15l-5-4"/>
                      </svg>
                    </span>
                </button>
            </div>
        </div>
    )
}
export default Report;