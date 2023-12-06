import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios'

import './css/document.scss'

function Document(props) {
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState([])
    const [writer, setWriter] = useState('')
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
                let content = null
                if(tagName!=='img') content = extractElements(node.innerHTML)
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
                if(tagName === 'img'){
                    props.src = node.getAttribute('src')
                    // HTML의 style 속성을 가져옵니다.
                    let styleString = node.getAttribute('style');
                    console.log(styleString)

                    // style 속성이 있다면,
                    if (styleString) {
                        let styleObject = {};

                        // 스타일 속성을 분리합니다.
                        let styles = styleString.split(';');

                        for (let style of styles) {
                            // 각 스타일을 속성과 값으로 분리합니다.
                            let [property, value] = style.split(':');

                            // 속성이나 값이 없는 경우 건너뜁니다.
                            if (!property || !value) continue;

                            // 속성 이름을 camelCase로 변환합니다. (예: 'background-color' -> 'backgroundColor')
                            let propertyName = property.trim().replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

                            console.log(property,value)
                            // 속성 값을 정리합니다.
                            let propertyValue = value.trim();

                            // 스타일 객체에 속성을 추가합니다.
                            styleObject[propertyName] = propertyValue;
                        }

                        // props에 스타일 객체를 추가합니다.
                        props.style = styleObject;
                    }
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

    function transHtml(content) {
        let contentArr = content.split('\n')
        let htmlText = ""
        let subTitle = [0,]
        let bq = true

        console.log(contentArr)

        const transLinkImage = (line) => {
            let regex = /<<([^>>]+)>>/g;

            line = line.replace(regex, function (match) {
                // match는 찾은 문자열을 가리킵니다. 예: '<<some text>>'
                let extracted = match.slice(2, -2);  // 꺾쇠괄호를 제거합니다.
                let [href, text] = extracted.split(',')
                return `<a href="${href}">${text}</a>`;  // 변환된 문자열을 다시 꺾쇠괄호로 둘러싸서 반환합니다.
            })

            regex = /\[\[([^\]]+)\]\]/g;
            return line.replace(regex, function (match) {
                // match는 찾은 문자열을 가리킵니다. 예: '<<some text>>'
                let extracted = match.slice(2, -2);  // 꺾쇠괄호를 제거합니다.
                let [src, width, height] = extracted.split(',')
                // return `<img src="/upload/${src}" style={{ width: "${width}", height: "${height}" }} alt="" />`;
                return `<img src="/upload/${src}" style="width: ${width};height: ${height};" alt=""/>`;  // 변환된 문자열을 다시 꺾쇠괄호로 둘러싸서 반환합니다.
            })
        }

        contentArr.map((line) => {
            if(line.startsWith("==")){
                const ctr = (line.split('=').length - 1) / 2 - 2
                const title = line.replaceAll('=','')
                let id = ''

                if(subTitle[ctr] === undefined) subTitle[ctr] = 1
                else subTitle[ctr]++

                for(let i=0;i<=ctr;i++) id += subTitle[i] + '.'
                // id = id.slice(0,-1)

                htmlText += `<h2><a id="s-${id}" href="#top" class="content-link">${id}</a><span>${title}</span></h2>`
            }else if(line.startsWith("$$")){
                if(bq) htmlText += `<div><blockquote>`
                else htmlText += `</blockquote></div>`
                bq = !bq
            }else{
                if(bq) htmlText += `<div><div>`
                htmlText += transLinkImage(line)
                if(bq) htmlText += `</div></div>`
            }
            //TODO image 문법 추가
        })

        return htmlText;
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
            const category = res.data.category
            const writer = res.data.writer
            const content = res.data.content
            const recent = res.data.recent
            const transContent = transHtml(content)
            console.log(transContent)
            const renderedContents = extractElements(transContent) // JSX 로 변환하여 렌더링
            const indexHtml = initIndexHtml(indexList)
            const params = new URLSearchParams(location.search)

            setRenderedContents(renderedContents)
            setRenderedIndex(indexHtml)
            setVersion(parseInt(params.get('version')) || null)
            setCategory(category)
            setWriter(writer)
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
        setCategory([])

        getDocument(this_url, versionURI).then(r => {
            if(hash) scrollToElement(hash.substring(1, hash.length))
        })

    }, [ location.pathname, location.hash ])

    return (
        <>
            <div>
                분류:
                {category.map((cg, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                    <Link to={"/document/" + cg}>{cg}</Link>
                ))}
                {writer && "작성자 : " + writer}
            </div>
            <h1>{title} {version ? "Version: " + version : null}</h1>
            <div className={"document-navi"}>
                {!isFile && <Link to={"/edit/" + title + "?version=" + version}>편집</Link>}
                {!isFile && <Link to={"/history/" + title}>역사</Link>}
                {!isFile && <Link to={"/report/" + title + "?version=" + version}>신고</Link>}
            </div>
            <div className="index-list" id="top">{renderedIndex}</div>
            {renderedContents}
        </>
    )
}

export default Document