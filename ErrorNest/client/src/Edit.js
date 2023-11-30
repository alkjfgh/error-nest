import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import Aside from "./Aside";

import './css/edit.scss'

const Edit = () => {
    const location = useLocation()
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [version, setVersion] = useState('')
    const [updateAT, setUpdateAt] = useState('')
    const [content, setContent] = useState('')

    async function getDocument(this_url) {
        const res = await axios.get(this_url)

        setTitle(res.data.title)
        setVersion(res.data.version)
        setUpdateAt(res.data.updateAt)
        setContent(res.data.content)
    }

    useEffect( () => {
        const this_url = location.pathname

        getDocument(this_url).then(r => {})
    }, [location.pathname])


    const editSubmit = async (e) => {
        const this_url = location.pathname
        const res = await axios.post(this_url,{title,content,version})
        if(res.data.success) navigate('/document/' + title)
        else alert("failed update")
    }

    const contentChange = (e) => {
        setContent(e.target.value)
    }

    return (
        <>
            <div className="container">
                <article>
                    <h1>{title} - {"(Version "+version+")"}</h1>
                    <div className={"document-navi"}><Link to={"/document/" + title}>돌아가기</Link><Link to={"/history/" + title}>역사</Link></div>
                    <textarea value={content} onChange={contentChange}></textarea>
                    <button onClick={editSubmit}>편집 완료</button>
                </article>
                <Aside></Aside>
            </div>
        </>
    )
}

export default Edit;