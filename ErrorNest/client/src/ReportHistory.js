import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {useLocation} from "react-router-dom";
import axios from "axios";

const ReportHistory = (props) => {
    const location = useLocation();
    const [cookies, setCookies] = useCookies();
    const [writer, setWriter] = useState("");
    const [reportList, setReportList] = useState([]);

    const axiosLoading = props.axiosLoading;
    /** 로그인 한 계정의 레벨 가져오기 (user or admin) */
    const getReportList = async (user) => {
        axiosLoading(async () => {
            const thisUri = location.pathname;
            console.log("---------------------");
            console.log(thisUri);
            const response = await axios.post(`${thisUri}/getReportList`,user);
            setReportList(response.data.result);
            console.log("reportList >> ");
            console.log(reportList);
            setWriter(response.data.writer);
        })
    }

    /** 로그인 했을 시 id, 안했을 시 ip로 writer 설정 */
    const getUserInfo = async () => {
        if(cookies.userid !== undefined) {
            console.log(`cookies.userid >> ${cookies.userid}`);
            return {userid: cookies.userid, username: cookies.username, userkey: cookies.userkey, isLogin: true}; // 로그인 id
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();

            console.log(`data.ip >> ${data.ip}`);
            return {userid: data.ip, username: "noName", userkey: cookies.userkey, isLogin: false}; // PC ip
        }
    }

    useEffect(() => {
        getUserInfo().then((user) => getReportList(user));
    }, []);

    return (
        <div>
            <h2>신고 목록</h2>
            {reportList.length === 0 ? (
                <p>신고한 목록이 없습니다</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Writer</th>
                        {/*<th>Comment</th>*/}
                        <th>CreatedAt</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportList.map((report) => (
                        <tr key={report._id}>
                            <td>{report.title}</td>
                            <td>{report.writer}</td>
                            {/*<td>{report.comment}</td>*/}
                            <td>{report.createAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ReportHistory;