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
        remainDate: 0,
    });

    let writer = location.pathname.split('/')[2];
    writer = decodeURIComponent(writer);
    let hashtag = location.hash

    const getProfile = async () => {
        const url = `${writer}/${hashtag.split('#')[1]}`;
        const writtenList = await axios.get(`/history/${url}`);
        const baninfo = await axios.get(`/ban/${url}`);
        console.log(baninfo.data);
    }

    useEffect(() => {
        getProfile();
    }, [location.pathname])

    const handleChange = (e) => {
        const {name, value}  = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
        console.log(inputs);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`/ban/update/${writer}/${hashtag.split('#')[1]}`, {comment: inputs.comment, remainDate: inputs.remainDate});
        console.log(res.data);
    }

    return (
        <>
            <h3>{writer+hashtag}</h3>
            <div>
                <div>이메일</div>
                <div>
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