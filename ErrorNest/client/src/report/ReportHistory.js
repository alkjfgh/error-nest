import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";


import '../css/memberListView.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBan, faMagicWandSparkles, faMagnifyingGlassPlus} from "@fortawesome/free-solid-svg-icons";

const ReportHistory = (props) => {
    const location = useLocation();
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();

    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    const axiosLoading = props.axiosLoading;
    /** 로그인 한 계정의 레벨 가져오기 (user or admin) */
    const getReportList = async (user) => {
        const thisUri = location.pathname;
        console.log("---------------------");
        console.log(`${thisUri}/getReportList`);
        const response = await axios.post(`/reportHistory/getReportList?page=${page}`,user);
        const maxPage = Math.floor(response.data.maxPage)
        setMaxPage(maxPage);
        setReportList(response.data.result);
        console.log("reportList >> ");
        console.log(reportList);
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

    const buttonClick = (reportInfo) => {
         navigate(`/report/board?reportId=${reportInfo.reportId}&reportNo=${reportInfo.reportNo}`)
    }

    const getData = async () => {
        getUserInfo().then((user) => getReportList(user));
    };

    useEffect(() => {
        setReportList([{}])
        axiosLoading(getData);
    },[]);

    useEffect(() => {
        setReportList([{}])
        axiosLoading(getData);
    }, [page]);

    return (
        <div>
            <h2>신고 목록</h2>
            {!reportList ? (
                <p>신고한 목록이 없습니다</p>
            ) : (
                <table className="adminListView-table">
                    <thead>
                    <tr>
                        <th><h1>Title</h1></th>
                        <th><h1>Title</h1></th>
                        <th><h1>Status</h1></th>
                        <th><h1>No</h1></th>
                        <th><h1>Info</h1></th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportList.map((report) => (
                        <tr key={report._id}>
                            <td className="tdStyle">{report.title}</td>
                            <td className="tdStyle">{report.createAt}</td>
                            <td className="tdStyle">{report.status}</td>
                            <td className="tdStyle">{report.reportNo}</td>
                            <td>
                                <button className="member-delete-btn" onClick={() => buttonClick(report)}>
                                    {/*<i className="fa-solid fa-magnifying-glass-plus"></i>*/}
                                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="fa-light" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div>
                <span>
                    {page - 1 > 0 ? (
                        <span onClick={() => setPage(page - 1)}>{"<"}Prev</span>
                    ) : (
                        "<Prev"
                    )}
                </span>
                <span>
                    {page + 1 <= maxPage ? (
                        <span onClick={() => setPage(page + 1)}>Next{">"}</span>
                    ) : (
                        "Next>"
                    )}
                </span>
            </div>
        </div>

    );
}

export default ReportHistory;