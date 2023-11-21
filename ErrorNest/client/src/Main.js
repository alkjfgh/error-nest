import React from 'react';
import { Link } from 'react-router-dom';

const Main = (props) => {
    return (
        <>
            <h3>안녕하세요. 메인페이지 입니다.</h3>
            <ul>
                <Link to="/document/1"><li>document 1</li></Link>
                <Link to="/document/2"><li>document 2</li></Link>
                <Link to="/document/3"><li>document 3</li></Link>
                <Link to="/user"><li>user</li></Link>
                <Link to="/test"><li>test</li></Link>
            </ul>
        </>
    );
};

export default Main;