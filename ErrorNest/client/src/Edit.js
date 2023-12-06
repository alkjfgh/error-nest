import React, { useState, useEffect } from "react"
import {Link, useLocation, useNavigate } from 'react-router-dom'
import { parse } from 'node-html-parser';
import axios from "axios"
import algoliasearch from "algoliasearch"

import './css/edit.scss'

const Edit = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [version, setVersion] = useState('')
    const [writer, setWriter] = useState('')
    const [updateAT, setUpdateAt] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState([])
    const [categoryText, setCategoryText] = useState('')

    const client  = algoliasearch('71RW9A7WPG', '00ceb7dfa83484290df56b46cdecde1d')
    const index = client.initIndex('document-title')

    function arrToText(category) {
        let text = ""
        category.map((cg) => {
            text += cg
            text += ','
        })
        if (text.endsWith(",")) text = text.slice(0, -1)
        return text
    }

    const getIp = async () => {
        const response = await fetch("https://api64.ipify.org?format=json")
        const data = await response.json()
        return data.ip
    }

    async function getDocument(this_url, versionURI) {
        const res = await axios.get(this_url+versionURI)

        setTitle(res.data.title)
        setVersion(res.data.version)
        setUpdateAt(res.data.updateAt)
        setContent(res.data.content)
        setCategory(res.data.category)
        setWriter(await getIp())
        setCategoryText(arrToText(res.data.category))
    }

    useEffect( () => {
        const this_url = location.pathname
        getDocument(this_url, location.search).then(r => {})
    }, [location.pathname])

    useEffect(()=>{
        setCategory(categoryText.split(','))
    }, [categoryText])

    const editSubmit = async (e) => {
        const this_url = location.pathname
        const res = await axios.post(this_url,{title, content, category, version, writer})
        if(res.data.success){
            const addClient  = algoliasearch('71RW9A7WPG', '0bb48fee2961ce2138ef237912abd0df')
            const addIndex = addClient.initIndex('document-title')

            // 이미 존재하는 title인지 확인
            const existingObject = await addIndex.getObject(title).catch(() => null)

            if (existingObject === null) {  // 존재하지 않는 title인 경우에만 저장
                const document = [
                    {
                        objectID: title,
                        title: title
                    }
                ]

                addIndex
                    .saveObjects(document)
                    .then(() => {
                    })
                    .catch(err => {
                        console.error(err)
                    })
            }

            navigate('/document/' + title)
        }
        else alert("failed update")
    }

    const contentChange = (e) => {
        setContent(e.target.value)
    }

    function categoryTextChange(e) {
        setCategoryText(e.target.value)
    }

    return (
        <>
            <h1>{title} - {"(Version "+version+")"}</h1>
            <div className={"document-navi"}><Link to={"/document/" + title}>돌아가기</Link><Link to={"/history/" + title}>역사</Link></div>
            <input type="text" value={writer} readOnly/>
            <input type="text" value={categoryText} onChange={categoryTextChange}/>
            <textarea value={content} onChange={contentChange}></textarea>
            <button onClick={editSubmit}>편집 완료</button>
        </>
    )
}

export default Edit