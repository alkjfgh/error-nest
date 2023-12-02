import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import Aside from "./Aside";


const History = () => {
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [histories, setHistories] = useState([])

    async function getHistory(this_url, page) {
        const res = await axios.get(this_url + page)
        const title = res.data.title
        const histories = res.data.histories
        const maxPage = Math.floor(res.data.maxPage)

        setTitle(title)
        setHistories(histories) // API 응답으로 받은 histories를 상태로 설정
        setMaxPage(maxPage)
    }

    useEffect( () => {
        const this_url = location.pathname
        const params = new URLSearchParams(location.search)
        const page = parseInt(params.get('page')) || 1

        if(page) setPage(page)

        getHistory(this_url, location.search).then(r => {})
    }, [location.pathname, location.search])

    return (
        <>
            <h1>{title} 역사</h1>
            <div className={"document-navi"}><Link to={"/document/" + title}>돌아가기</Link><Link to={"/edit/" + title}>편집</Link></div>
            <div>
                        <span>
                            {page - 1 > 0 ? (
                                <Link to={"/history/" + title + "?page=" + (page - 1)}>{"<"}Prev</Link>
                            ) : (
                                "<Prev"
                            )}
                        </span>
                <span>
                            {page + 1 <= maxPage ? (
                                <Link to={"/history/" + title + "?page=" + (page + 1)}>Next{">"}</Link>
                            ) : (
                                "Next>"
                            )}
                        </span>
            </div>
            <ul>
                {histories.map((history, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                    <li key={index}>
                        <Link to={"/document/" + title + "?version="+history.version}>
                            <span>{history.updateAt}</span>`
                            <span>{history.version}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default History;