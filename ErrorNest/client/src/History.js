import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import Aside from "./Aside";


const History = () => {
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [histories, setHistories] = useState([])

    async function getHistory(this_url) {
        const res = await axios.get(this_url)
        const title = res.data.title
        const histories = res.data.histories

        setTitle(title)
        setHistories(histories) // API 응답으로 받은 histories를 상태로 설정
    }

    useEffect( () => {
        const this_url = location.pathname

        getHistory(this_url).then(r => {})
    }, [location.pathname])

    return (
        <>
            <div className="container">
                <article>
                    <h1>{title} 역사</h1>
                    <div className={"document-navi"}><Link to={"/document/" + title}>돌아가기</Link><Link to={"/edit/" + title}>편집</Link></div>
                    <ul>
                        {histories.map((history, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                            <li key={index}>
                                <Link to={"/document/"+title+"?version="+history.version}>
                                    <span>{history.updateAt}</span>`
                                    <span>{history.version}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </article>
                <Aside></Aside>
            </div>
        </>
    )
}

export default History;