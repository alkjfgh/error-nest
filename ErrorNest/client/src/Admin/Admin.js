import React, {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import '../css/admin.scss'
import MemberListView from "./MemberListView";
import BanListView from "./BanListView";
import EditHistoryView from "./EditHistoryView";
import BanHistoryView from "./BanHistoryView";

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
                {/*{currentView === "신고 목록" && <EditHistoryView axiosLoading={axiosLoading}/>}*/}
            </div>
        </>
    )
}

export default Admin;