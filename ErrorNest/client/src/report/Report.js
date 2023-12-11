import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";

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

        const res = await axios.post('/report/getDocument/', data);
        console.log(res.data);

        setTitle(res.data.title);
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
            return {username: cookies.username, isLogin: false}; // PC ip
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
            console.log(userInfo);

            const res = await axios.post('/report/insert',{title, comment, version, username: userInfo.username});

            console.log(res.data);

            if (res.data.success) {
                alert(`${res.data.message}`);
                navigate(`/document/${title}`);
            }
        })
    }

    const reportChange = (e) => {
        setComment(e.target.value);
    }

    return (
        <>
            <h2>신고: {title} - {`(Version ${version})`}</h2>
            <div className={"document-navi"}><Link to={"/document/" + title}>돌아가기</Link></div>
            <textarea value={comment} onChange={reportChange}></textarea>
            <button onClick={reportSubmit}>신고 완료</button>
        </>
    )
}
export default Report;