import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {useLocation} from "react-router-dom";
import axios from "axios";

const ReportHistory = () => {
    const location = useLocation();
    const [cookies, setCookies] = useCookies();
    const [writer, setWriter] = useState("");
    const [level, setLevel] = useState("");
    const [reportLIst, setReportList] = useState([]);

    const getReportList = async (thisUri) => {
        console.log(`thisUri >> ${thisUri}/getMember?writer=${writer}`);
        // const response = await axios.get(`/reportHistory?writer=211.209.78.85`);
        // const response = await axios.get(`${thisUri}?writer=${writer}`);
        // console.log(response);
        // axios get으로 데이터 전달
    }

    /** 로그인 한 계정의 레벨 가져오기 (user or admin) */
    const getMemberLevel = async (thisUri) => {
        const userid = cookies.userid;
        const username = cookies.username;
        const response = await axios.post(`/reportHistory/getMember`,{userid, username});
        console.log(response);
        setLevel(response.data.level);
        setWriter(response.data.id);
    }

    /** 로그인 했을 시 id, 안했을 시 ip로 writer 설정 */
    const getWriter = async () => {
        if(cookies.userid !== undefined) {
            console.log(`cookies.userid >> ${cookies.userid}`);
            setWriter(cookies.userid);
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();

            console.log(`data.ip >> ${data.ip}`);
            setWriter(data.ip);
        }
    }

    useEffect(() => {
        const thisUri = location.pathname;
        getWriter().then(() => getMemberLevel(thisUri));
    }, []);


    /** 예시 데이터 */
    const posts = [
        { id: 1, title: '첫 번째 글' },
        { id: 2, title: '두 번째 글' },
        { id: 3, title: '세 번째 글' },
        // ... 필요한 만큼 데이터 추가
    ];

    return (
        <div>
            <h2>신고 목록</h2>
            writer: {writer}<br />
            writerName: {cookies.username}<br />
            level: {level}<br />
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default ReportHistory;