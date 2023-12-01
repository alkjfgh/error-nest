import React, {useEffect} from 'react';
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
    const [encodedInputText, setEncodedInputText] = useState("");

    const handleInputText = (e) => {
        setInputText(e.target.value);
    };

    useEffect(() => {
        // 문자열 띄어쓰기 %20에서 인코딩
        setEncodedInputText(encodeURIComponent(inputText).replace(/%20/g, '+'));
        // console.log(encodedInputText);
    }, [inputText])

    console.log(`encodedInputText >> ${encodedInputText}`);

    return (
        <nav className="navigation">
            {/** 로고 이미지 */}
            <Link to="/" className="logo-img-link">
                <img src={logoImg} alt="로고 이미지" className="logo-image" />
            </Link>

            {/** 네비게이션 요소 */}
            <ul className="navi-element-list">
                <li className="navi-element">
                    <Link to="/report">신고</Link>
                </li>
                {/*<li className="navi-element">*/}
                {/*    <Link to="/about">소개</Link>*/}
                {/*</li>*/}
                {/*<li className="navi-element">*/}
                {/*    <Link to="/contact">문의</Link>*/}
                {/*</li>*/}
            </ul>

            {/** 검색 바 */}
            <div className="navi-button-div">
                <input className="navi-input-bar" type="text" placeholder="검색" value={inputText} onChange={handleInputText}/>
                <Link to={`/search?q=${encodedInputText}`}>
                    <button className="navi-button">검색</button>
                </Link>
            </div>
        </nav>
    );
}

export default Header;