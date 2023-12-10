import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";

import '../css/nomalize.scss'
import axios from "axios";

const Profile = (props) => {
    const location = useLocation()
    const [cookies] = useCookies([]);
    const [inputs, setInputs] = useState({
        comment: '',
        remainDate: 1,
    });
    const [banUpdateMessage, setBanUpdateMessage] = useState('')

    let writer = location.pathname.split('/')[2];
    writer = decodeURIComponent(writer);
    let hashtag = location.hash
    const axiosLoading = props.axiosLoading

    const getProfile = async () => {
        // TODO 작성글 불러오기 유저 정보, 밴 정보 띄워주기
        const url = `${writer}/${hashtag.split('#')[1]}`;
        // const res1 = await axios.get(`/history/${url}`);
        const banInfo = await axios.get(`/ban/${url}`);
        console.log(banInfo.data)
    }

    useEffect(() => {
        // TODO 있는 유저 인지 or 맞는 포멧의 ip인지 확인 먼저 해야함
        axiosLoading(getProfile)
    }, [location.pathname])

    const handleChange = (e) => {
        const {name, value}  = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        if(banUpdateMessage === '밴 처리중') return
        setBanUpdateMessage('밴 처리중')
        e.preventDefault();
        const data = {comment: inputs.comment, remainDate: inputs.remainDate}
        const res = await axios.post(`/ban/update/${writer}/${hashtag.split('#')[1]}`, data);
        const success = res.data.success
        if(success) setBanUpdateMessage('밴 성공')
        else setBanUpdateMessage('밴 실패')
    }

    return (
        <>
            <h3>{writer+hashtag}</h3>
            <div>
                <div>이메일</div>
                {/*TODO admin or 자신만 볼 수 있도록*/}
                <div>
                    {/*TODO admin만 벤 할 수 있도록*/}
                    <form onSubmit={handleSubmit}>
                        벤 관련<br/>
                        벤 사유 : <input type="text" name="comment" onChange={handleChange}/>
                        <select onChange={handleChange} name="remainDate" >
                            <option value="1">1일</option>
                            <option value="3">3일</option>
                            <option value="7">7일</option>
                            <option value="30">30일</option>
                            <option value="100000">영구정지</option>
                        </select>
                        <button type="submit">send</button>
                        {banUpdateMessage}
                    </form>
                </div>
            </div>
            <div>
                <div>작성글 1</div>
                <div>작성글 2</div>
                <div>작성글 3</div>
            </div>
        </>
    );
};

export default Profile;