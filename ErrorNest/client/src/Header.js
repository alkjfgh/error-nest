import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";

/** css & img */
import './css/header.scss'
import logoImg from './img/errorNestLogo.png'

/** 헤더 기능 구현 목록
 * 로고 - 메인 페이지 이동
 * 검색 바 - 버튼 눌러서 해당 버튼에 해당하는 Search.js로 이동 (/Search)
 * */
const Header = (props) => {
    const [inputText, setInputText] = useState("");

    return (
        <nav className="navigation">
            {/** 로고 이미지 */}
            <Link to="/" className="logo-img-link">
                <img src={logoImg} alt="로고 이미지" className="logo-image" />
            </Link>

            {/** 네비게이션 요소 */}
            {/*<ul className="navi-element-list">*/}
            {/*    <li className="navi-element">*/}
            {/*        <Link to="/">홈</Link>*/}
            {/*    </li>*/}
            {/*    <li className="navi-element">*/}
            {/*        <Link to="/about">소개</Link>*/}
            {/*    </li>*/}
            {/*    <li className="navi-element">*/}
            {/*        <Link to="/contact">문의</Link>*/}
            {/*    </li>*/}
            {/*</ul>*/}

            {/** 검색 바 */}
            <div className="navi-button-div">
                <input className="navi-input-bar" type="text" placeholder="검색" onChange={e => e.target.value}/>
                <button className="navi-button">검색</button>
            </div>
        </nav>
    );
}

export default Header;