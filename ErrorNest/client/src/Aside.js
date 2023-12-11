import React, {useEffect, useState} from 'react';
import AxiosLoadingContext from './AxiosLoadingContext';
import {useCookies} from "react-cookie";
import axios from "axios";
import {Link, useLocation} from "react-router-dom"; // 경로는 실제 context 파일 위치에 따라 다름

const Aside = (props) => {
    const axiosLoading = React.useContext(AxiosLoadingContext);

    const location = useLocation()
    const [cookies, setCookies, removeCookies] = useCookies();

    const [favorites, setFavorites] = useState([{}])

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
    };

    const unFavorite = async (title) => {
        const user = await getUser()
        const res = await axios.post('/favorite/update',{title: title, target: user})
        getFavoriteList().then(r => {})
    }

    useEffect(() => {
        getFavoriteList().then(r => {})
    }, [location.pathname]);

    return (
        <aside>
            {favorites.length === 0 &&
                <div>즐겨찾기한 한 항목이 없습니다</div>
            }
            {favorites.length > 0 && favorites.map((favorite, index) => (
                <div key={index}><Link to={`/document/${favorite.title}`}>{favorite.title}</Link><span onClick={() => unFavorite(favorite.title)}>삭제</span></div>
            ))}
        </aside>
    );
}

export default Aside;