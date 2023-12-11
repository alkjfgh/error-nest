import React, { useState, useEffect, useRef } from "react"
import {Link, useLocation, useNavigate } from 'react-router-dom'
import { useCookies } from "react-cookie"
import axios from "axios"

import '../css/edit.scss'
import {CodeEdit} from "./CodeEdit";

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
        axiosLoading(async () => {
            const this_url = location.pathname
            const res = await axios.post(this_url, {title, content, category, version, writer})
            if (res.data.success) {
                const addIndex = props.algolia.addIndex
                // 이미 존재하는 title인지 확인
                await addAlgolia([title], "title")
                await addAlgolia(category, "category")
            } else alert("failed update")
        })
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
        const cursorPosition = textRef.current["selectionStart"]
        const textBeforeCursor = content.slice(0, cursorPosition)
        const textAfterCursor = content.slice(cursorPosition)
        const newText = textBeforeCursor + addText + textAfterCursor
        // const newText = content + addText
        setContent(newText)
    }

    const init = async () => {
        const textarea = document.querySelector("textarea");
        const lineNumbers = document.querySelector(".line-numbers");

        textarea.addEventListener("keyup", (event) => {
            const numberOfLines = event.target.value.split("\n").length;

            lineNumbers.innerHTML = Array(numberOfLines)
                .fill("<span></span>")
                .join("");
        });

        textarea.addEventListener("keydown", (event) => {
            if (event.key === "Tab") {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                textarea.value =
                    textarea.value.substring(0, start) +
                    "\t" +
                    textarea.value.substring(end);

                event.preventDefault();
            }
        });
    };

    useEffect( () => {
        const this_url = location.pathname
        init().then(() => {
            getDocument(this_url, location.search).then(() => {
            })
        })
    }, [])

    useEffect(()=>{
        setCategory(categoryText.split(',').map((cg) => {return cg.trim()}))
    }, [categoryText])

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

            {/*<CodeEdit*/}
            {/*    name="test-textarea"*/}
            {/*    value={content}*/}
            {/*    onValueChange={(content) => setContent(content)}*/}
            {/*    numOfLines={10}*/}
            {/*/>*/}

            <div className="editor">
                <div className="line-numbers">
                    <span></span>
                </div>
                <textarea ref={textRef} value={content} onChange={contentChange}></textarea>
            </div>

            <button onClick={editSubmit}>편집 완료</button>
        </div>
    )
}

export default Edit