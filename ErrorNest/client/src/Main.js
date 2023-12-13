import React from 'react';
import { Link } from 'react-router-dom';

import './css/nomalize.scss'
import './css/main.scss'

const Main = (props) => {

    return (
        <div className="main-container">
            <div className="main-container-item">
                <div className="card card1">
                    <div className="welcome-message-container">
                    <h1 className="main-h1 main-welcome-message">ErrorNest</h1>
                    </div>
                    <div className="grainy-texture one"></div>
                </div>

                <div className="card card2">
                    <h2 className="main-h2">Hello World!</h2>
                    <div className="card-text">
                        <p><div>
                            <h2>편집 문법 설명</h2>
                            <div>
                                <div>
                                    <h4>문단 제목</h4>
                                    <div>
                                        ==문단 제목이 들어갈 공간==
                                        제목을 '=' 으로 감싸면 문단 제목이 됩니다.
                                        '=' 은 최소 2개 이상, 대칭으로 있어야 합니다.
                                        '='의 갯수를 늘릴 때마다 하위 번호가 늘어납니다.
                                    </div>
                                    <h4>블럭 쿼터</h4>
                                    <div>
                                        $$
                                        내용
                                        $$
                                        내용을 '$$' 으로 감싸면 블럭 쿼터가 됩니다.
                                        '=' 은 2개 고정, 대칭으로 있어야 합니다.
                                    </div>
                                    <h4>링크</h4>
                                    <div>
                                        {'<<'}링크 제목, 표시할 내용{'>>'}
                                        {'<<>>'} 으로 감싸면 링크가 됩니다.
                                        링크 제목에는 링크 걸 문서의 제목과 똑같이 쓰면 됩니다.
                                    </div>
                                    <h4>이미지</h4>
                                    <div>
                                        [[분류/이미지 이름, 가로, 세로]]
                                        [[]] 으로 감싸면 이미지가 됩니다.
                                        분류명/이미지 이름 으로 쓰고, 가로, 세로 길이를 주면 됩니다.(필수)
                                    </div>
                                    <h4>주석</h4>
                                    <div>
                                        ##빈 칸 or 주석 이름 주석 내용##
                                        ##으로 감싸면 주석이 됩니다.
                                        주석 이름(한 글자)을 넣으면 주석 이름대로 생기고
                                        빈 칸으로 넣으면 자동으로 번호가 붙습니다.
                                    </div>
                                    <h4>코드</h4>
                                    <div>
                                        ~언어
                                        내용
                                        ~
                                        ~~~ 으로 감싸면 코드 블럭이 됩니다.
                                        언어에는 코드의 언어를 영어 소문자로 빈칸없이 넣으면 됩니다.
                                    </div>
                                </div>
                            </div>
                        </div></p>
                        <p>Cool stuff, huh?</p>
                    </div>
                    <div className="grainy-texture two"></div>
                </div>

                <div className="card card3">
                    <h2>2023<br />서울호서<br />전공실무프로젝트</h2>
                    <div className="grainy-texture three"></div>
                </div>

                <div className="card card4">
                    <h1>created By</h1>
                    <h2>⭐️C.E.H.</h2>
                    <h2>⭐️C.B.J.</h2>
                    <h2>⭐️H.E.J.</h2>
                    <h2>⭐Y.M.J.</h2>
                    <div className="grainy-texture four"></div>
                </div>
            </div>
        </div>
    );
};

export default Main;