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

    const writer = searchParams.get("reportId");
    const reportNo = searchParams.get("reportNo");

    const [reportInfo, setReportInfo] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminComment, setAdminComment] = useState("");


    const getReportBoard = async (data) => {
        data.writer = writer;
        data.reportNo = reportNo;

        // const result = await axios.post('/report/select', data);
        axios.post('/report/select', data).then(result=> {
            setReportInfo(result.data.reportInfo);

            if (result.data.userLevel === 'admin')
                setIsAdmin(true);
        });
    };

    const getUserInfo = async () => {
        if(cookies.userid !== undefined) {
            return {userid: cookies.userid, username: cookies.username, userkey: cookies.userkey, isLogin: true}; // 로그인 id
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();

            return {userid: data.ip, username: "noName", userkey: cookies.userkey, isLogin: false}; // PC ip
        }
    }

    const getData = async () => {
        getUserInfo().then(data => getReportBoard(data))
    };

    const handlerChangeAdminComment = (e) => {
        setAdminComment(e.target.value);
    };

    const setClassFromStatus = (status) => {
        switch (status) {
            case "대기": return "waiting";
            case "완료": return "completed";
            case "취소": return "canceled";
        }
    }

    const buttonClick = async (reportInfo) => {
        // TODO: 답장 버튼 눌렀을 때 -> adminComment & status(완료) 업데이트
        if (adminComment === "") {
            alert("답장을 입력해주세요.");
        } else {
            reportInfo.adminComment = adminComment;
            const response = await axios.put('/report/update', reportInfo);
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
            {reportInfo === undefined ? (
                <h3>신고한 내용이 없습니다.</h3>
            ) : (
                <div>
                    <h1>신고 내용: {reportInfo.title}</h1>
                    <div className={"document-navi"}>
                        {isAdmin &&
                            <button onClick={() => navigate(`/profile/${reportInfo.reportId}`)} className={"button"}>
                                <span><Link to="/reportHistory">프로필</Link></span>
                            </button>
                        }
                        <button onClick={() => navigate("/reportHistory")} className={"button"}>
                            <span><Link to="/reportHistory">돌아가기</Link></span>
                        </button>
                    </div>
                    <div className={"report-input-icon"}>
                        <div className={"text-input"}>
                            <input type={"text"} id={"report-writer"} value={reportInfo.version} placeholder={"버전"}
                                   readOnly/>
                            <label htmlFor={"report-writer"}>버전</label>
                        </div>
                        <div className={"text-input"}>
                            <input type={"text"} id={"report-writer"} value={reportInfo.reportId} placeholder={"작성자"}
                                   readOnly/>
                            <label htmlFor={"report-writer"}>작성자</label>
                        </div>
                        <div className={"text-input"}>
                            <input type={"text"} id={"report-writer"} value={reportInfo.status}
                                   className={setClassFromStatus(reportInfo.status)} placeholder={"상태"}
                                   readOnly/>
                            <label htmlFor={"report-writer"}
                                   className={setClassFromStatus(reportInfo.status)}>상태</label>
                        </div>
                    </div>
                    <div className="report-comment">
                        <h3>Comment</h3>
                        <div className={"comment"}>
                            <p>{reportInfo.comment}</p>
                        </div>
                    </div>
                    {reportInfo.status === "대기" &&
                        <button className={"button"} onClick={() => cancelButtonClick(reportInfo)}><span
                            className={"report-button"}>취소</span></button>
                    }
                    {/*<p>CreatedAt: {reportInfo.createAt}</p>*/}
                    {isAdmin && reportInfo.status === "대기" && (
                        <div className="admin-action">
                            <h3>Admin Comment</h3>
                            <textarea value={adminComment} onChange={(e) => handlerChangeAdminComment(e)}></textarea>
                            <button className={"button"} onClick={() => buttonClick(reportInfo)}><span
                                className={"report-button"}>답장</span></button>
                        </div>
                    )}
                    {reportInfo.status === "완료" && (
                        <div className="admin-action">
                            <h3>Admin Comment</h3>
                            <div className={"admin-result"}>{reportInfo.adminComment}</div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default ReportBoard;