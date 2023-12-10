import React from 'react';
import { Link } from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";

import '../css/nomalize.scss'

const Profile = (props) => {
    const [cookies] = useCookies([]);

    return (
        <>
            <h3>{cookies.username}</h3>
            <div>
                <div>이메일</div>
                <div>벤 관련</div>
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