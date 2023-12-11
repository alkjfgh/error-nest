import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";


const ReportBoard = (props) => {
    const axiosLoading = props.axiosLoading;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [cookies,] = useCookies()

    const writer = searchParams.get("writer");
    const reportNo = searchParams.get("reportNo");

    const [reportInfo, setReportInfo] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);


    const getReportBoard = async (data) => {
        data.writer = writer;
        data.reportNo = reportNo;

        console.log(data);
        const result = await axios.post('/report/select', data);
        console.log(result.data);
        console.log(result.data.reportInfo);

        setReportInfo(result.data.reportInfo);

        if (result.data.userLevel === 'admin')
            setIsAdmin(true);
    };

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

    const getData = async () => {
        getUserInfo().then(data => getReportBoard(data))
    };

    useEffect(() => {
        axiosLoading(getData);
    }, []);

    return (
        <>
            {reportInfo && (
                <>
                    <h2>{reportInfo.title} - ver {reportInfo.version}</h2>
                    <p>writer: {reportInfo.writer}</p>
                    <p>Status: {reportInfo.status}</p>
                    <p>Comment: {reportInfo.comment}</p>
                    <p>CreatedAt: {reportInfo.createAt}</p>
                </>
            )}
            <div className={"document-navi"}>
                {isAdmin && <Link to={`/profile/${reportInfo.writer}`}>프로필</Link>}
                <Link to="/reportHistory">돌아가기</Link>
            </div>
        </>
    )
}

export default ReportBoard;