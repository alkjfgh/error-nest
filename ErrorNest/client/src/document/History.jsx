import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";

import '../css/history.scss'

const History = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [histories, setHistories] = useState([])
    const [isEditing, setIsEditing] = useState(false);

    async function getHistory(this_url, page) {
        const res = await axios.get(this_url + page)
        const title = res.data.title
        const histories = res.data.histories
        const maxPage = Math.floor(res.data.maxPage)

        histories.map((history) => {
            let dateObj = new Date(history.updateAt);
            let year = dateObj.getUTCFullYear();  // 년도
            let month = dateObj.getUTCMonth() + 1;  // 월 (0부터 시작하므로 1을 더해줍니다)
            let date = dateObj.getUTCDate();  // 일

            let hours = dateObj.getUTCHours();  // 시간
            let minutes = dateObj.getUTCMinutes();  // 분
            let seconds = dateObj.getUTCSeconds();  // 초

            let dateStrFormat = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`; // 년-월-일
            let timeStrFormat = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // 시:분:초

            history.date = dateStrFormat
            history.time = timeStrFormat
        })

        setTitle(title)
        setHistories(histories)
        setMaxPage(maxPage)
    }

    useEffect( () => {
        const this_url = location.pathname
        const params = new URLSearchParams(location.search)
        const page = parseInt(params.get('page')) || 1

        if(page) setPage(page)

        getHistory(this_url, location.search).then(r => {document.addEventListener("DOMContentLoaded", function () {
            const prevButton = document.getElementsByClassName("prevPage");
            const nextButton = document.getElementsByClassName("nextPage");
            prevButton.disabled = page === 0;
            nextButton.disabled = page === maxPage;
        });

        })
    }, [location.pathname, location.search])

    return (
        <div>
            <h1>{title} 역사</h1>
            <div className={"document-navi"}>
                <button onClick={() => {
                    navigate("/document/" + title)
                }} className={"button"}>
                    <span>
                        <Link to={"/document/" + title} className={"document-navi-btn"}>돌아가기</Link>
                    </span>
                </button>
            </div>

            <div className="pagination">
                <button className="prevPage" onClick={() => navigate("/history/" + title + "?page=" + (page - 1))} disabled={page === 1}>Prev</button>
                {isEditing ? (
                    <input
                        className={'pageId'}
                        type="number"
                        value={page}
                        min={1}
                        max={maxPage}
                        onChange={(e) => setPage(+e.target.value)}
                        onBlur={() => {
                            // navigate("/history/" + title + "?page=" + page)
                            setIsEditing(false)
                        }}
                        autoFocus
                    />
                ) : (
                    <div className="pageId" onClick={() => setIsEditing(true)}>
                        {page}
                    </div>
                )}
                {/*<div className="pageId">{page}</div>*/}
                <button className="nextPage" onClick={() => navigate("/history/" + title + "?page=" + (page + 1))} disabled={page === maxPage}>Next</button>
            </div>

            <div className={'history-con'}>
                <ul className="history-list">
                    {histories.map((history, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                        <>
                            <li key={index}>
                                <span></span>
                                <div className="title"><Link
                                    to={"/document/" + title + "?version=" + history.version}>{history.title}</Link>
                                </div>
                                <div className="info">버전: {history.version}</div>
                                <div className="name">
                                    <Link to={`/profile/${history.writer}`}>작성자: {history.writer}</Link>
                                </div>
                                <div className="time">
                                    <span>{history.date}</span>
                                    <span>{history.time}</span>
                                </div>
                            </li>
                        </>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default History;