import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "axios";


const ReportBoard = (props) => {
    const axiosLoading = props.axiosLoading;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [cookies] = useCookies();

    const writer = searchParams.get('writer');
    const reportNo = searchParams.get('reportNo');

    const getReport = async (dataInfo) => {
        const thisUrl = location.pathname;
        console.log(thisUrl);
        dataInfo.writer = writer;
        dataInfo.reportNo = reportNo;

        const response = await axios.post(thisUrl, dataInfo);
        console.log(response);
    }

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
        getUserInfo().then((user) => getReport(user));
    }, []);

    return (
        <>
            <h2>ReportBoard Page </h2>
            writer: {writer} <br/>
            reportNo: {reportNo}
        </>
    )
}

export default  ReportBoard;