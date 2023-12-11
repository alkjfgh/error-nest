import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";


const ReportBoard = (props) => {
    const axiosLoading = props.axiosLoading;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [cookies, setCookies] = useCookies()

    const writer = searchParams.get("writer");
    const reportNo = searchParams.get("reportNo");

    const [reportInfo, setReportInfo] = useState({});


    const getReportBoard = async (data) => { // report/select
        // TODO: writer랑 reportNo를 넘겨서 가져와야 하는 것: report 모든 정보, id랑 writer랑 동일한지 체크한 값(T or F)

        data.writer = writer;
        data.reportNo = reportNo;

        console.log(data);
        const result = await axios.post('/report/select', data);
        console.log(result.data);
        console.log(result.data.reportInfo);

        setReportInfo(result.data.reportInfo);
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



    useEffect(() => {
        getUserInfo().then(data => getReportBoard(data))
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

                    <div className={"document-navi"}>
                        <Link to="/reportHistory">돌아가기</Link>
                    </div>
                </>
            )}
        </>
    )
}

export default ReportBoard;