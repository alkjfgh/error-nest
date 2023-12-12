import React, { useState, useEffect, useRef } from "react"
import {Link, useLocation, useNavigate } from 'react-router-dom'
import { useCookies } from "react-cookie"
import axios from "axios"
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";
import '../css/edit.scss'

const Edit = (props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [cookies, setCookies, removeCookies] = useCookies()
    const textRef = useRef(null)

    const [title, setTitle] = useState('')
    const [version, setVersion] = useState('')
    const [writer, setWriter] = useState('')
    const [updateAT, setUpdateAt] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState([])
    const [categoryText, setCategoryText] = useState('')

    const index = props.algolia.index
    const axiosLoading = props.axiosLoading

    function arrToText(category) {
        let text = ""
        category.map((cg) => {
            text += cg
            text += ','
        })
        if (text.endsWith(",")) text = text.slice(0, -1)
        return text
    }

    const getIsBan = async () => {
        const ipReg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
        const writer = await getWriter()
        let url = ''
        if(ipReg.test(writer)) url = `/ban/${writer}/${undefined}`
        else url = `/ban/${writer.split('#')[0]}/${writer.split('#')[1]}`
        const banInfo = await axios.get(url)
        setWriter(writer)
        return banInfo.data.isBan
    }

    const getWriter = async () => {
        if(cookies.username) return cookies.username
        const response = await fetch("https://api64.ipify.org?format=json")
        const data = await response.json()
        return data.ip
    }

    const getDocument = async (this_url, versionURI) => {
        axiosLoading( async () => {
            const isBan = await getIsBan()
            if(isBan) {
                alert('편집 권한이 없습니다.')
                navigate('/')
            }
            const res = await axios.get(this_url+versionURI)

            setTitle(res.data.title)
            setVersion(res.data.version)
            setUpdateAt(res.data.updateAt)
            setContent(res.data.content)
            setCategory(res.data.category)
            setCategoryText(arrToText(res.data.category))
        })
    }

    const addAlgolia = async (titles,type) => {
        const index = props.algolia.index
        const addIndex = props.algolia.addIndex
        for (let title of titles) {
            if(type === "category") title = `분류:${title}`
            const existingObject = await index.getObject(title).catch(() => null)

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
        }

        navigate(`/document/${title}`)
    }

    const editSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const button = e.currentTarget;
        button.classList.add("loading");
        button.disabled = true;

        const this_url = location.pathname
        const res = await axios.post(this_url, {title, content, category, version, writer})
        button.classList.add("loaded");

        if (res.data.success) {
            // 이미 존재하는 title인지 확인
            await addAlgolia([title], "title")
            await addAlgolia(category, "category")
        } else alert("failed update")

        button.classList.add("finished");

        button.classList.remove("finished");
        button.classList.remove("loaded");
        button.classList.remove("loading");
        button.disabled = false;
    }

    const contentChange = (e) => {
        setContent(e.target.value)
    }

    const categoryTextChange = (e) => {
        setCategoryText(e.target.value)
    }

    /** 에디트 내용 자동 추가 버튼 핸들링 */
    const editBtnClick = (e) => {
        const type = e.target.innerHTML
        let addText = ""
        switch (type){
            case "문단 제목": addText = "==문단 제목=="; break
            case "블럭쿼터": addText = "$$내용$$"; break
            case "링크": addText = "<<링크 제목, 표시할 내용>>"; break
            case "이미지": addText = "[[분류/이미지 이름, 가로, 세로]]"; break
            case "주석": addText = "##빈칸or주석이름 주석 내용##"; break
        }
        // 커서 위치에 문자열 삽입
        // const cursorPosition = textRef.current["selectionStart"]
        // const textBeforeCursor = content.slice(0, cursorPosition)
        // const textAfterCursor = content.slice(cursorPosition)
        // const newText = textBeforeCursor + addText + textAfterCursor
        const newText = content + addText
        setContent(newText)
    }

    useEffect( () => {
        const this_url = location.pathname
        getDocument(this_url, location.search).then(() => {
        })
    }, [location.pathname, location.search])

    useEffect(()=>{
        setCategory(categoryText.split(',').map((cg) => {return cg.trim()}))
    }, [categoryText])

    const hightlightWithLineNumbers = (input, language) =>
        highlight(input, language)
            .split("\n")
            .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
            .join("\n");


    return (
        <div>
            <h1>{title} - {"(Version " + version + ")"}</h1>
            <div className={"document-navi"}>
                <button onClick={() => {
                    navigate("/document/" + title)
                }} className={"button"}>
                    <span>
                        <Link to={"/document/" + title} className={"document-navi-btn"}>돌아가기</Link>
                    </span>
                </button>
                <button onClick={() => {
                    navigate("/history/" + title)
                }} className={"button"}>
                    <span>
                        <Link to={"/history/" + title} className={"document-navi-btn"}>역사</Link>
                    </span>
                </button>
            </div>
            <div className={'edit-input-con'}>
                <div className="text-input">
                    <input type="text" id="edit-writer" value={writer} readOnly placeholder="작성자"/>
                    <label htmlFor="edit-writer">작성자</label>
                </div>
                <div className="text-input">
                    <input type="text" id="edit-category" placeholder="분류" value={categoryText}
                           onChange={categoryTextChange}/>
                    <label htmlFor="edit-category">분류</label>
                </div>
            </div>
            <div className={"editBtns-con"}>
                <div><span className={"edit-btn"} onClick={editBtnClick}>문단 제목</span></div>
                <div><span className={"edit-btn"} onClick={editBtnClick}>블럭쿼터</span></div>
                <div><span className={"edit-btn"} onClick={editBtnClick}>링크</span></div>
                <div><span className={"edit-btn"} onClick={editBtnClick}>이미지</span></div>
                <div><span className={"edit-btn"} onClick={editBtnClick}>주석</span></div>
            </div>

            {/*<textarea ref={textRef} value={content} onChange={contentChange}></textarea>*/}

            <Editor
                value={content}
                onValueChange={content => setContent(content)}
                highlight={content => hightlightWithLineNumbers(content, languages.js)}
                padding={10}
                textareaId="codeArea"
                className="editor"
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 18,
                    outline: 0
                }}
            />

            <div className={'submit-btn-con'}>
                {/*<button className={'submit-btn'} onClick={editSubmit}>편집 완료</button>*/}
                <button className="expand submit-btn" onClick={editSubmit}>
                    편집 완료
                    <span className="expand-icon expand-hover">
                      <svg className="first" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 32 32" version="1.1">
                        <path
                            d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"/>
                      </svg>
                      <span className="loader"></span>
                      <svg className="second" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 5L8 15l-5-4"/>
                      </svg>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default Edit