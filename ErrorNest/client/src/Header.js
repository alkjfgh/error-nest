import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import algoliasearch from "algoliasearch"

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
    const [hits, setHits] = useState([])

    const client  = algoliasearch('71RW9A7WPG', '00ceb7dfa83484290df56b46cdecde1d')
    const index = client.initIndex('document-title');

    const handleInputText = (e) => {
        const searchText = e.target.value;
        setInputText(searchText);

        index
            .search(searchText)
            .then(({ hits }) => {
                setHits(hits)
            })
            .catch(err => {
                console.error(err);
            });
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
                <input className="navi-input-bar" type="text" placeholder="검색" value={inputText} onChange={handleInputText}/>
                <Link to={`/search?q=${encodedInputText}`}>
                    <button className="navi-button">검색</button>
                </Link>
            </div>
            {/* TODO 검색 결과 실시간으로 보여주기*/}
        </nav>
    );
}

export default Header;