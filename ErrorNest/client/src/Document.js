import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios'

import './css/document.scss'

function Document(props) {
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [versionURI, setVersionURI] = useState('')
    const [version, setVersion] = useState(null)
    const [renderedContents, setRenderedContents] = useState([])
    const [renderedIndex, setRenderedIndex] = useState([])
    const [indexList, setIndexList] = useState([])
    const [isFile, setIsFile] = useState(false)

    const extractElements = (htmlString) => { // 문자열에서 HTML 요소 추출 및 재귀적 처리
        const wrapper = document.createElement('div')
        wrapper.innerHTML = htmlString

        return Array.from(wrapper.childNodes).map((node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase()
                const content = extractElements(node.innerHTML)
                const classList = node.classList
                if (tagName === 'h2'){
                    const aText = node.querySelector('a') ? node.querySelector('a').textContent : null
                    const spanText = node.querySelector('span') ? node.querySelector('span').textContent : null
                    indexList.push({ aText: aText, spanText: spanText })
                }
                const props = { key: index, className: classList[0]}
                let element = tagName

                if (node.id && node.id.startsWith('s-')) {
                    props.id = node.id // id 추가
                    props.href = '#top' // href 추가
                }
                if (tagName === 'a' && !node.id) {
                    element = Link
                    props.to = node.getAttribute('href')
                }
                return React.createElement(element, props, content)
            }
            return null
        })
    }

    function scrollToElement(id) {
        const element = document.getElementById(id)
        if (element) element.scrollIntoView({ behavior: 'smooth' })
    }

    function drawIndex(indexList, depth = 1) {
        let result = []
        while (indexList.length > 0) {
            let index = indexList[0]
            let levels = index.aText.split('.').filter(Boolean)  // "2.1.1." => ["2", "1", "1"]

            if (levels.length === depth) {
                result.push(
                    <span key={index.aText}>
                        <a href={"#s-"+index.aText.substring(0,index.aText.length-1)}>{index.aText}</a>
                        {' ' + index.spanText}
                    </span>
                )
                indexList.shift()
            } else if (levels.length > depth) {
                let childIndexes = []
                while (indexList.length > 0 && indexList[0].aText.split('.').filter(Boolean).length > depth) {
                    childIndexes.push(indexList.shift())
                }
                result.push(<div className={"index-space"} key={'div'+depth}>{drawIndex(childIndexes, depth + 1)}</div>)
            } else {
                break
            }
        }
        return result
    }

    function initIndexHtml() {
        return drawIndex(indexList)
    }

    const getDocument = async(this_url, versionURI) => {
        const res = await axios.get(this_url + versionURI)

        setTitle(res.data.title)

        if(res.data.isFile){
            setIsFile(res.data.isFile)
            const file = res.data
            const imageUrl = `/upload/${file.category}/${file.fileName}`
            const renderedContents = []
            renderedContents.push(<div key={Math.random()}>분류:<Link to={`/document/분류:파일/${file.category}`}>파일/{file.category}</Link></div>)
            renderedContents.push(<img key={Math.random()} src={imageUrl} alt={file.fileDes} />)
            renderedContents.push(<div key={Math.random()}>{file.fileDes}</div>)
            setRenderedContents(renderedContents);
        }
        else if(res.data.isCategory){
            const files = res.data.files
            console.log(files)
        }
        else if(res.data.hasDocument){
            const content = res.data.content
            const recent = res.data.recent
            const renderedContents = extractElements(content) // JSX 로 변환하여 렌더링
            const indexHtml = initIndexHtml(indexList)
            const params = new URLSearchParams(location.search)

            setRenderedContents(renderedContents)
            setRenderedIndex(indexHtml)
            setVersion(parseInt(params.get('version')) || null)
            if(!recent) setVersionURI("(Version " + version + ")")
        }else{
            const data = [<div key={`No Document`}>해당 문서를 찾을 수 없습니다.</div>, <Link key={`No Document Link`} to={`/edit/${res.data.title}`}>[새 문서 만들기]</Link>]
            setRenderedContents(data)
        }
    }

    useEffect(() => {
        const this_url = location.pathname
        const hash = location.hash ? location.hash : undefined
        const versionURI = location.search

        setIndexList([])
        setRenderedIndex([])

        getDocument(this_url, versionURI).then(r => {
            if(hash) scrollToElement(hash.substring(1, hash.length))
        })

    }, [ location.pathname, location.hash ])

    return (
        <>
            <h1>{title} {version}</h1>
            <div className={"document-navi"}>
                {!isFile && <Link to={"/edit/" + title + "?version="+version}>편집</Link>}
                {!isFile && <Link to={"/history/" + title}>역사</Link>}
            </div>
            <div className="index-list" id="top">{renderedIndex}</div>
            {renderedContents}
        </>
    )
}

export default Document