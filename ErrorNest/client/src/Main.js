import React from 'react';
import { Link } from 'react-router-dom';

import './css/nomalize.scss'

const Main = (props) => {
    return (
        <>
            <h3>안녕하세요. 메인페이지 입니다.</h3>
            <ul>
                <Link to="/document/봇치 더 록!"><li>document 봇치 더 록!</li></Link>
                <Link to="/user"><li>user</li></Link>
                <Link to="/test"><li>test</li></Link>
            </ul>
            <div className={"test123"}></div>
        </>
    );
};

export default Main;