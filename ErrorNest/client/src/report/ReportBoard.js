import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import "../css/report.scss";

const ReportBoard = (props) => {
    const axiosLoading = props.axiosLoading;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [cookies,] = useCookies();

    const navigate = useNavigate();

    const writer = searchParams.get("writer");
    const reportNo = searchParams.get("reportNo");

    const [reportInfo, setReportInfo] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminComment, setAdminComment] = useState("");


    const getReportBoard = async (data) => {
        data.writer = writer;
        data.reportNo = reportNo;

        console.log(data);
        const result = await axios.post('/report/select', data);
        console.log(result.data);

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

    const handlerChangeAdminComment = (e) => {
        setAdminComment(e.target.value);
    };

    const buttonClick = async (reportInfo) => {
        // TODO: 답장 버튼 눌렀을 때 -> adminComment & status(완료) 업데이트
        if (adminComment === "") {
            alert("답장을 입력해주세요.");
        } else {
            console.log(`adminComment >> ${adminComment}`);
            reportInfo.adminComment = adminComment;
            const response = await axios.put('/report/update', reportInfo);
            console.log(response);
            alert(response.data.message);
            navigate('/reportHistory');
        }
    }

    const cancelButtonClick = async (reportInfo) => {
        const userInfo = await getUserInfo();
        const response = await axios.put('/report/updateCancel', {reportInfo, userInfo});

        if (response.data.success) {
            alert(response.data.message);
            navigate('/reportHistory');
        } else {
            alert(response.data.message);
        }
    }

    useEffect(() => {
        axiosLoading(getData);
    }, []);

    return (
        <>
            {reportInfo && (
                <div>
                    <h1>신고 내용: {reportInfo.title}</h1>
                    <div className={"document-navi"}>
                        <button onClick={() => navigate("/reportHistory")} className={"button"}>
                            <span><Link to="/reportHistory">돌아가기</Link></span>
                        </button>
                    </div>
                    <div className={"report-input-icon"}>
                        <div className={"text-input"}>
                            <input type={"text"} id={"report-writer"} value={reportInfo.version} placeholder={"작성자"}
                                   readOnly/>
                            <label htmlFor={"report-writer"}>버전</label>
                        </div>
                        <div className={"text-input"}>
                            <input type={"text"} id={"report-writer"} value={reportInfo.reportId} placeholder={"작성자"}
                                   readOnly/>
                            <label htmlFor={"report-writer"}>작성자</label>
                        </div>
                        <div className={"text-input"}>
                            <input type={"text"} id={"report-writer"} value={reportInfo.status} placeholder={"작성자"}
                                   readOnly/>
                            <label htmlFor={"report-writer"}>상태</label>
                        </div>
                    </div>
                    <p>Comment: {reportInfo.comment}</p>
                    <p>CreatedAt: {reportInfo.createAt}</p>
                    {isAdmin && reportInfo.status === "대기" &&
                        <>
                        <textarea value={adminComment} onChange={(e) => handlerChangeAdminComment(e)}></textarea>
                            <button onClick={() => buttonClick(reportInfo)}>답장</button>
                        </>
                    }
                    {reportInfo.status === "완료" &&
                        <p>관리자 답장: {reportInfo.adminComment}</p>
                    }
                    {reportInfo.status === "대기" &&
                        <button onClick={() => cancelButtonClick(reportInfo)}>취소</button>
                    }
                    <div className={"document-navi"}>
                        {isAdmin && <Link to={`/profile/${reportInfo.reportId}`}>프로필</Link>}

                    </div>
                </div>
            )}

        </>
    )
}

export default ReportBoard;