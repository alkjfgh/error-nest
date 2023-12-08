import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {useLocation} from "react-router-dom";
import axios from "axios";

const ReportHistory = () => {
    const location = useLocation();
    const [cookies, setCookies] = useCookies();
    const [writer, setWriter] = useState("");
    const [level, setLevel] = useState("");
    const [reportList, setReportList] = useState([]);


    /** 로그인 한 계정의 레벨 가져오기 (user or admin) */
    const getReportList = async (user) => {
        const thisUri = location.pathname;
        console.log("---------------------");
        console.log(thisUri);
        const response = await axios.post(`${thisUri}/getReportList`,user);
        setReportList(response.data.result);
        console.log(response.data.result);
        console.log("reportList >> ");
        console.log(reportList);
        setWriter(response.data.writer);
    }

    /** 로그인 했을 시 id, 안했을 시 ip로 writer 설정 */
    const getUserInfo = async () => {
        // TODO: id를 가져와 로그인 체크 후(쿠기 값 확인) 서버에 값 전달 (아이디, 로그인체크(T or F)
        if(cookies.userid !== undefined) {
            console.log(`cookies.userid >> ${cookies.userid}`);
            return {userid: cookies.userid, username: cookies.username, isLogin: true}; // 로그인 id
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();

            console.log(`data.ip >> ${data.ip}`);
            return {userid: data.ip, username: "noName", isLogin: false}; // PC ip
        }
    }

    useEffect(() => {
        getUserInfo().then((user) => getReportList(user));
    }, []);


    /* --- 서버에서 받아온 데이터 예시 ---
    comment: "집 가고 싶다"
    createAt: "2023-12-06T09:52:46.280Z"
    title: "봇치 더 록!"
    version: 23
    writer: "211.209.78.85"
    */


    return (
        <div>
            <h2>신고 목록</h2>
            writer: {writer}<br />
            {reportList.length === 0 ? (
                <p>신고한 목록이 없습니다</p>
            ) : (
                <ul>
                    {reportList.map((report) => (
                        <li key={report._id}>
                            <p>------------------------------------</p>
                            <p>Title: {report.title}</p>
                            <p>Writer: {report.writer}</p>
                            <p>Comment: {report.comment}</p>
                            <p>CreatedAt: {report.createAt}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ReportHistory;