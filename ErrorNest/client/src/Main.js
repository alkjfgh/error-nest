import React from 'react';
import { Link } from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";

import './css/nomalize.scss'

const Main = (props) => {
    // 쿠키 설정
    const [cookies] = useCookies(["myCookie"]);
    console.log(cookies.myCookie);
    console.log("main");

    return (
        <>
            <h3>안녕하세요. 메인페이지 입니다.</h3>
            <ul>
                <Link to="/document/봇치 더 록!"><li>document 봇치 더 록!</li></Link>
            </ul>
            <div className={"test123"}></div>
        </>
    );
};

export default Main;