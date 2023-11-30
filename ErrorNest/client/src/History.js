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
        const histories = res.data.histories
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
                </article>
                <Aside></Aside>
            </div>
        </>
    )
}

export default History;