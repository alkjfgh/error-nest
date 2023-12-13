import React, {useEffect, useState} from 'react';
import AxiosLoadingContext from './AxiosLoadingContext';
import {useCookies} from "react-cookie";
import axios from "axios";
import {Link, useLocation} from "react-router-dom"; // 경로는 실제 context 파일 위치에 따라 다름

import './css/aside.scss'

const Aside = (props) => {
    const axiosLoading = React.useContext(AxiosLoadingContext);

    const location = useLocation()
    const [cookies, setCookies, removeCookies] = useCookies();

    const [favorites, setFavorites] = useState([{}])
    const [favoriteElements, setFavoriteElements] = useState([]); // 추가된 상태변수

    const getUser = async () => {
        if(cookies.username) return cookies.username
        else{
            const response = await fetch("https://api64.ipify.org?format=json")
            const data = await response.json()
            return data.ip
        }
    }

    const getFavoriteList = async () => {
        const user = await getUser()
        const res = await axios.post('/favorite/list', {target: user})
        const favorites = res.data.favorites
        setFavorites(favorites)
        //TODO 짤라서 보여주기
        const elements = favorites.map((favorite, index) => ( // favorites 배열을 JSX 형태로 변환하여 favoriteElements를 업데이트
            <div key={index}><Link to={`/document/${favorite.title}`}>{favorite.title}</Link><span onClick={() => unFavorite(favorite.title)}>삭제</span></div>
        ));
        setFavoriteElements(elements);
    };

    const unFavorite = async (title) => {
        const user = await getUser()
        const res = await axios.post('/favorite/update',{title: title, target: user})
        getFavoriteList().then(r => {})
    }

    useEffect(() => {
        setInterval(getFavoriteList, 5000)
        // getFavoriteList().then(r => {})
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const bannerTop = document.querySelector('.container').offsetTop;
            const chaseElem = document.querySelector(".banner"); // 현재 스크롤 위치를 가져옵니다.
            let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            scrollPosition += 10

            // 스크롤 위치에 따라 chaseElem의 top 위치를 조정합니다.
            if (scrollPosition > bannerTop) {
                chaseElem.style.top = `${scrollPosition - 96}px`;
            } else {
                chaseElem.style.top = `${bannerTop - 96}px`;
            }

        };

        window.addEventListener('scroll', handleScroll);

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <aside className="banner">
            {favorites.length === 0 &&
                <div>즐겨찾기한 한 항목이 없습니다</div>
            }
            {favoriteElements}
        </aside>
    );
}

export default Aside;