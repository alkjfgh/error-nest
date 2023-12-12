import React, {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";


import MemberListView from "./MemberListView";
import BanListView from "./BanListView";
import EditHistoryView from "./EditHistoryView";
import BanHistoryView from "./BanHistoryView";
import ReportHistory from "../report/ReportHistory";

// css 관련 import
import '../css/admin.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAtom, faDisease, faDna, faSeedling} from "@fortawesome/free-solid-svg-icons";
// import { faDna, faChartMixed, faAtom, faSeedling, faDisease };

function Admin(props) {
    const [cookies] = useCookies();
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState("main");


    const axiosLoading = props.axiosLoading

    useEffect(() => {
        axiosLoading(levelCheck)
    },[]);

    const levelCheck = async () => {
        let level = ""
        if(cookies.userid) {
            const res = await axios.post('/member/levelCheck', {userid: cookies.userid, username: cookies.username, userkey:cookies.userkey});
            level = res.data.level
        }
        if(level !== "admin") {
            alert('권한이 없습니다.')
            navigate("/")
        }
    }

    const viewHandler = (e) => {
        const currentView = e.target.innerHTML
        setCurrentView(currentView);
    }

    const mainView = () => {
        setCurrentView('main')
    }

    return (
        <>

            <div className="admin-container">
            <h1>Neumorphic buttons</h1>
            <div className="admin-buttons">
                <button className="neumorphic">
                    <FontAwesomeIcon icon={faDna} className="fa-light" />
                    <span>Button 2</span>
                </button>
                <button className="neumorphic">
                    <FontAwesomeIcon icon={faAtom} className="fa-light" />
                    <span>Button 3</span>
                </button>
                <button className="neumorphic">
                    <FontAwesomeIcon icon={faAtom} className="fa-light" />
                    <span>Button 4</span>
                </button>
                <button className="neumorphic">
                    <FontAwesomeIcon icon={faSeedling} className="fa-light" />
                    <span>Button 5</span>
                </button>
                <button className="neumorphic">
                    <FontAwesomeIcon icon={faDisease} className="fa-light" />
                    <span>Button 6</span>
                </button>
            </div>




            {currentView === 'main' &&
                <div className="admin-view-btn-con">
                    <div className="admin-view-btn" onClick={viewHandler}>유저 목록</div>
                    <div className="admin-view-btn" onClick={viewHandler}>벤 상태</div>
                    <div className="admin-view-btn" onClick={viewHandler}>벤 로그</div>
                    <div className="admin-view-btn" onClick={viewHandler}>편집 로그</div>
                    <div className="admin-view-btn" onClick={viewHandler}>신고 목록</div>
                </div>
            }
            {currentView !== 'main' &&
                <div onClick={mainView}>돌아가기</div>
            }
            <div className="admin-view-con">
                {currentView === "유저 목록" && <MemberListView axiosLoading={axiosLoading}/>}
                {currentView === "벤 상태" && <BanListView axiosLoading={axiosLoading}/>}
                {currentView === "벤 로그" && <BanHistoryView axiosLoading={axiosLoading}/>}
                {currentView === "편집 로그" && <EditHistoryView axiosLoading={axiosLoading}/>}
                {currentView === "신고 목록" && <ReportHistory axiosLoading={axiosLoading}/>}
            </div>
            </div>
        </>
    )
}

export default Admin;