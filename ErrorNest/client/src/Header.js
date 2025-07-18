import React, {useCallback, useEffect, useRef} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useState } from "react";
import { useCookies } from "react-cookie";
import algoliasearch from "algoliasearch";

/** css & img */
import './css/header.scss'
import logoImg from './img/errorNestLogo.png'
import axios from "axios";

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
    const [view, setView] = useState(false);
    const [user, setUser] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const index = props.algolia.index

    const dropdownRef = useRef(null);

    const getUser = async () => {
        if(cookies.username) setUser(cookies.username)
        else{
            const response = await fetch("https://api64.ipify.org?format=json")
            const data = await response.json()
            setUser(data.ip)
        }
    }

    const getUserInfo = async () => {
        if(cookies.userid !== undefined) {
            return {userid: cookies.userid, username: cookies.username, userkey: cookies.userkey, isLogin: true}; // 로그인 id
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();

            return {userid: data.ip, username: "noName", userkey: cookies.userkey, isLogin: false}; // PC ip
        }
    }

    const getUserLevel = async (result) => {
        if (result.isLogin) {
            const userInfo = await axios.post('/member/levelCheck', result);
            if (userInfo.data.level === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
    }

    const clickButtonLogout = async () => {
        setIsAdmin(false);
        setView(false);
    }

    const handleRelatedSearchClick = (e, clickedText) => {
        setInputText(clickedText); // 검색어 업데이트
        setHits([]); // 검색 결과 초기화

        // 해당 페이지로 이동
        navigate(`/document/${clickedText}`);
    };

    useEffect(() => {
        // 문자열 띄어쓰기 %20에서 인코딩
        setEncodedInputText(encodeURIComponent(inputText).replace(/%20/g, '+'));
        // setHits([])
        setSelectedIndex(-1)
    }, [inputText, location.pathname])

    useEffect(() => {
        setUser('')
        getUser().then(r => {})
        getUserInfo().then(result => getUserLevel(result));
        setInputText("")
    }, [location.pathname])

    useEffect(() => {
        setHits([]);
        setView(false);
    }, [location.pathname]);

    const handleIconClick = () => {
        setView(!view);
    }

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
            if(inputText.length === 0) return
            setInputText("")
            // Enter 키를 누르면 선택된 검색 결과로 이동
            if(selectedIndex === -1 || selectedIndex === hits.length) navigate(`/search?q=${encodedInputText}`)
            else {
                const inputValue = hits[selectedIndex].title;
                // setHits([]);
                navigate(`/document/${inputValue}`)
            }
        }
    };

    return (
        <nav className="navigation">
            {/** 로고 이미지 */}
            <Link to="/" className="logo-img-link">
                <img src={logoImg} alt="로고 이미지" className="logo-image"/>
            </Link>

            {/** 검색 바 */}
            <div className="navi-button-div" id="cover">
                <div className="td" id="td">
                    <input className="navi-input-bar" type="text" placeholder="검색" value={inputText}
                           onChange={handleInputText} onKeyDown={handleKeyPress} required/>

                    {/*검색 결과*/}
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
                <div id="s-cover" className="td">
                    {
                        encodedInputText.length > 0 ?
                            <Link to={`/search?q=${encodedInputText}`}>
                                <button className="navi-button">
                                    <div id="s-circle"></div>
                                    <span></span>
                                </button>
                            </Link>
                            :
                            <button className="navi-button" disabled>
                                <div id="s-circle"></div>
                                <span></span>
                            </button>
                    }
                </div>
            </div>

            {/** 네비게이션 요소 */}
            {/*onBlur={handleBlurList}*/}
            <div className="navi-element-list-div" ref={dropdownRef}>
                <ul className="navi-element-list">
                    <div id="nav-icon3" className={view ? 'open' : ''} onClick={handleIconClick}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    {view && <div id="menu">
                        <li className="navi-element">
                            <Link to={`/profile/${user}`} onClick={() => setView(false)}>프로필</Link>
                        </li>
                        {cookies.userid === undefined && (
                            <>
                                <li className="navi-element">
                                    <Link to="/login" onClick={() => setView(false)}>로그인</Link>
                                </li>
                                <li className="navi-element">
                                    <Link to="/signup" onClick={() => setView(false)}>회원가입</Link>
                                </li>
                            </>
                        )}
                        {!(cookies.userid === undefined) && (
                            <li className="navi-element">
                                <Link to="/logout" onClick={clickButtonLogout}>로그아웃</Link>
                            </li>
                        )}
                        <li className="navi-element">
                            <Link to="/reportHistory" onClick={() => setView(false)}>신고목록</Link>
                        </li>
                        <li className="navi-element">
                            <Link to="/upload" onClick={() => setView(false)}>파일 업로드</Link>
                        </li>
                        {(!(cookies.userid === undefined) && isAdmin) && (
                            <>
                            <li className="navi-element">
                                <Link to="/admin" onClick={() => setView(false)}>관리자</Link>
                            </li>
                            </>
                        )}
                    </div>}
                </ul>
            </div>
        </nav>
    );
}

export default Header;