import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useState } from "react";
import { useCookies } from "react-cookie";
import algoliasearch from "algoliasearch";

/** css & img */
import './css/header.scss'
import logoImg from './img/errorNestLogo.png'

/** 헤더 기능 구현 목록
 * 로고 - 메인 페이지 이동
 * 검색 바 - 버튼 눌러서 해당 버튼에 해당하는 Search.js로 이동 (/Search)
 * */
const Header = (props) => {
    const location = useLocation()
    const navigate = useNavigate()

    /** 쿠키 값 가져오기 */
    const [cookies, setCookies, removeCookies] = useCookies();
    
    /** useState 요소들 */
    const [inputText, setInputText] = useState("");
    const [encodedInputText, setEncodedInputText] = useState("");
    const [hits, setHits] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const client  = algoliasearch('71RW9A7WPG', '00ceb7dfa83484290df56b46cdecde1d');
    const index = client.initIndex('document-title');

    const handleInputText = (e) => {
        const searchText = e.target.value;
        setInputText(searchText);

        if(searchText === "") setHits([])
        else {
            index
                .search(searchText)
                .then(({ hits }) => {
                    setHits(hits)
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'ArrowDown') {
            // 아래 방향키를 누르면 선택된 인덱스를 증가
            setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, hits.length));
            e.preventDefault();  // 기본 동작 막기
        } else if (e.key === 'ArrowUp') {
            // 위 방향키를 누르면 선택된 인덱스를 감소
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
            e.preventDefault();  // 기본 동작 막기
        } else if (e.key === 'Enter') {
            setInputText("")
            // Enter 키를 누르면 선택된 검색 결과로 이동
            if(selectedIndex === -1 || selectedIndex === hits.length) navigate(`/search?q=${encodedInputText}`)
            else navigate(`/document/${hits[selectedIndex].title}`)
        }
    };

    useEffect(() => {
        // 문자열 띄어쓰기 %20에서 인코딩
        setEncodedInputText(encodeURIComponent(inputText).replace(/%20/g, '+'));
        setHits([])
        setSelectedIndex(-1)
    }, [inputText, location.pathname])

    return (
        <nav className="navigation">
            {/** 로고 이미지 */}
            <Link to="/" className="logo-img-link">
                <img src={logoImg} alt="로고 이미지" className="logo-image" />
            </Link>

            {/** 네비게이션 요소 */}
            <ul className="navi-element-list">
                {cookies.userid === undefined && (
                    <>
                        <li className="navi-element">
                            <Link to="/login">로그인</Link>
                        </li>
                        <li className="navi-element">
                            <Link to="/signup">회원가입</Link>
                        </li>
                    </>
                )}
                {!(cookies.userid === undefined) && (
                    <li className="navi-element">
                        <Link to="/logout">로그아웃</Link>
                    </li>
                )}
                {/*<li className="navi-element">*/}
                {/*    <Link to="/about">소개</Link>*/}
                {/*</li>*/}
                {/*<li className="navi-element">*/}
                {/*    <Link to="/contact">문의</Link>*/}
                {/*</li>*/}
            </ul>

            <Link to={"/upload"}>파일 업로드</Link>

            {/** 검색 바 */}
            <div className="navi-button-div">
                <div>
                    <input className="navi-input-bar" type="text" placeholder="검색" value={inputText} onChange={handleInputText} onKeyDown={handleKeyPress}/>

                    <div className="search-results">
                        {hits.slice(0, 10).map((hit, index) => (
                            <Link
                                key={index}
                                to={`/document/${hit.title}`}
                                className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                            >
                                {hit.title}
                            </Link>
                        ))}
                    </div>
                </div>

                <Link to={`/search?q=${encodedInputText}`}>
                    <button className="navi-button">검색</button>
                </Link>
            </div>
        </nav>
    );
}

export default Header;