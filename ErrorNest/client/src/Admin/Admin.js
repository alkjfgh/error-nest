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
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBan, faHand, faPenToSquare, faScroll, faUser} from "@fortawesome/free-solid-svg-icons";

// import { faDna, faChartMixed, faAtom, faSeedling, faDisease };

function Admin(props) {
    const [cookies] = useCookies();
    const navigate = useNavigate();

    const [currentView, setCurrentView] = useState("main");
    const [title, setTitle] = useState('Admin Page')

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
        // const currentView = e.target.innerHTML
        // console.log(e)
        setCurrentView(e);
        setTitle(e)
    }

    const mainView = () => {
        setCurrentView('main')
        setTitle('Admin Page')
    }

    return (
        <>
            <div className="admin-container">
            <h1 className="admin-h1">{title}</h1>
                {currentView === 'main' &&
            <div className="admin-buttons" >
                <button className="neumorphic" onClick={()=>viewHandler("유저 목록")}>
                    <FontAwesomeIcon icon={faUser} className="fa-light" />
                    <span>User List</span>
                </button>
                <button className="neumorphic" onClick={()=>viewHandler("벤 상태")}>
                    <FontAwesomeIcon icon={faBan} className="fa-light" />
                    <span onClick={viewHandler}>Ban Status</span>
                </button>
                <button className="neumorphic" onClick={()=>viewHandler("벤 로그")}>
                    {/*<i className="fa-solid fa-scroll"></i>*/}
                    <FontAwesomeIcon icon={faScroll} className="fa-light" />
                    <span onClick={viewHandler}>Ban Log</span>
                </button>
                <button className="neumorphic" onClick={()=>viewHandler("편집 로그")}>
                    {/*<i className="fa-solid fa-pen-to-square"></i>*/}
                    <FontAwesomeIcon icon={faPenToSquare} className="fa-light" />
                    <span onClick={viewHandler}>Edit Log</span>
                </button>
                <button className="neumorphic" onClick={()=>viewHandler("신고 목록")}>
                    <FontAwesomeIcon icon={faHand} className="fa-light" />
                    <span onClick={viewHandler}>Report List</span>
                </button>
            </div>}

                {currentView !== 'main' &&
                    <span>
                        <button className="admin-return-btn" onClick={mainView}>
                         뒤로가기
                        </button>
                    </span>
                }


                <div className="admin-buttons">
                    {currentView === "유저 목록" && <MemberListView axiosLoading={axiosLoading}/>}
                    {currentView === "벤 상태" && <BanListView axiosLoading={axiosLoading}/>}
                    {currentView === "벤 로그" && <BanHistoryView axiosLoading={axiosLoading}/>}
                    {currentView === "편집 로그" && <EditHistoryView axiosLoading={axiosLoading}/>}
                    {currentView === "신고 목록" && <ReportHistory axiosLoading={axiosLoading}/>}
                </div>


            {/*하단 원래 있는 내용*/}

            {/*    {currentView === 'main' &&*/}
            {/*    <div className="admin-view-btn-con">*/}
            {/*        <div className="admin-view-btn" onClick={viewHandler}>유저 목록</div>*/}
            {/*        <div className="admin-view-btn" onClick={viewHandler}>벤 상태</div>*/}
            {/*        <div className="admin-view-btn" onClick={viewHandler}>벤 로그</div>*/}
            {/*        <div className="admin-view-btn" onClick={viewHandler}>편집 로그</div>*/}
            {/*        <div className="admin-view-btn" onClick={viewHandler}>신고 목록</div>*/}
            {/*    </div>*/}
            {/*}*/}
            {/*{currentView !== 'main' &&*/}
            {/*    <div onClick={mainView}>돌아가기</div>*/}
            {/*}*/}

            {/*<div className="admin-view-con">*/}
            {/*    {currentView === "유저 목록" && <MemberListView axiosLoading={axiosLoading}/>}*/}
            {/*    {currentView === "벤 상태" && <BanListView axiosLoading={axiosLoading}/>}*/}
            {/*    {currentView === "벤 로그" && <BanHistoryView axiosLoading={axiosLoading}/>}*/}
            {/*    {currentView === "편집 로그" && <EditHistoryView axiosLoading={axiosLoading}/>}*/}
            {/*    {currentView === "신고 목록" && <ReportHistory axiosLoading={axiosLoading}/>}*/}
            {/*</div>*/}
            </div>
        </>
    )
}

export default Admin;