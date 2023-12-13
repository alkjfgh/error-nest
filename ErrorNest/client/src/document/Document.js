import React, {useEffect, useLayoutEffect, useState} from 'react'
import {useLocation, useNavigate, Link} from 'react-router-dom'
import {Link as LinkScroll, animateScroll as scroll } from 'react-scroll'
import axios from 'axios'
import {useCookies} from "react-cookie";

import '../css/document.scss'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, atomDark, duotoneDark,solarizedDarkAtom } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Document(props) {
    const location = useLocation()
    const [cookies, setCookies, removeCookies] = useCookies();
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState([])
    const [writer, setWriter] = useState('')
    const [versionURI, setVersionURI] = useState('')
    const [version, setVersion] = useState(null)
    const [renderedContents, setRenderedContents] = useState([])
    const [renderedIndex, setRenderedIndex] = useState([])
    const [indexList, setIndexList] = useState([])
    const [isFile, setIsFile] = useState(false)
    const annotation = {
        numIndex: 0,
        list: {}
    }
    const [renderedAnnotation, setRenderedAnnotation] = useState([])
    const [star, setStar] = useState('☆')
    const [documentCategory, setDocumentCategory] = useState([])

    const axiosLoading = props.axiosLoading

    const extractElements = (htmlString) => { // 문자열에서 HTML 요소 추출 및 재귀적 처리
        const wrapper = document.createElement('div')
        wrapper.innerHTML = htmlString

        return Array.from(wrapper.childNodes).map((node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase()
                let content = null
                if(tagName!=='img' && tagName !=='br') content = extractElements(node.innerHTML)
                const classList = node.classList
                if (tagName === 'h2'){
                    const aText = node.querySelector('a') ? node.querySelector('a').textContent : null
                    const spanText = node.querySelector('span') ? node.querySelector('span').textContent : null
                    indexList.push({ aText: aText, spanText: spanText })
                }
                const props = { key: index, className: classList.value}
                let element = tagName

                if(node.id) props.id = node.id // id 추가
                if (tagName === 'a') {
                    if(classList.value.indexOf("scroll-link") !== -1){
                        element = LinkScroll;
                        // props.smooth = true; // smooth scroll
                        if (node.id.startsWith("s-")) {
                            props.to = 'top' // href 추가
                            props.onClick = () => {
                                window.history.pushState({}, '', '#top');
                            }
                            // props.to = '#top'
                        }
                        else{
                            props.to = node.href.split('#')[1]
                            props.onClick = () => {
                                window.history.pushState({}, '', '#' + node.href.split('#')[1]);
                            }
                            // props.to = node.href
                        }
                    }else{
                        element = Link
                        props.to = node.getAttribute('href')
                    }

                    if(classList.value.indexOf("annotation-link") !== -1){
                        props['data-content'] = node.getAttribute('data-content')
                    }
                }
                if(tagName === 'img'){
                    props.src = node.getAttribute('src')
                    // HTML의 style 속성을 가져옵니다.
                    let styleString = node.getAttribute('style')

                    // style 속성이 있다면,
                    if (styleString) {
                        let styleObject = {}

                        // 스타일 속성을 분리합니다.
                        let styles = styleString.split(';')

                        for (let style of styles) {
                            // 각 스타일을 속성과 값으로 분리합니다.
                            let [property, value] = style.split(':')

                            // 속성이나 값이 없는 경우 건너뜁니다.
                            if (!property || !value) continue

                            // 속성 이름을 camelCase로 변환합니다. (예: 'background-color' -> 'backgroundColor')
                            let propertyName = property.trim().replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())

                            // 속성 값을 정리합니다.
                            let propertyValue = value.trim()

                            // 스타일 객체에 속성을 추가합니다.
                            styleObject[propertyName] = propertyValue
                        }

                        // props에 스타일 객체를 추가합니다.
                        props.style = styleObject
                    }
                }
                if(tagName === "syntaxhighlighter"){
                    element = SyntaxHighlighter
                    props.language = node.getAttribute('language')
                    props.style = atomDark
                    // props.style = solarizedlight
                    // props.style = duotoneDark
                    // props.style = solarizedDarkAtom
                }
                return React.createElement(element, props, content)
            }
            return null
        })
    }

    function scrollToElement(id) {
        const element = document.getElementById(id)
        if (element) element.scrollIntoView()
    }

    function drawIndex(indexList, depth = 1) {
        let result = ""
        while (indexList.length > 0) {
            let index = indexList[0]
            let levels = index.aText.split('.').filter(Boolean)  // "2.1.1." => ["2", "1", "1"]

            if (levels.length === depth) {
                result += `<span key=${index.aText}>
                         <a href="#s-${index.aText.substring(0,index.aText.length-1) + '.'}" class="scroll-link">${index.aText}</a>
                         ${' ' + index.spanText}
                     </span>`
                indexList.shift()
            } else if (levels.length > depth) {
                let childIndexes = []
                while (indexList.length > 0 && indexList[0].aText.split('.').filter(Boolean).length > depth) {
                    childIndexes.push(indexList.shift())
                }
                result += `<div class="index-space" key='div${depth}'>${drawIndex(childIndexes, depth + 1)}</div>`
            } else {
                break
            }
        }
        return result
    }

    function initIndexHtml(indexList) {
        return drawIndex(indexList)
    }

    function transHtml(content) {
        let contentArr = content.split('\n')
        let htmlText = ""
        let subTitle = [0,]
        let bq = true
        let divOpen = false
        let code = false

        const transLinkImage = (line) => {
            let regex = /<<([^>>]+)>>/g

            //링크
            line = line.replace(regex, function (match) {
                // match는 찾은 문자열을 가리킵니다. 예: '<<some text>>'
                const extracted = match.slice(2, -2)  // <<>> 제거합니다.
                const [href, text] = extracted.split(',')
                const result = `<a href="${href}">${text}</a>`
                return result
            })

            //이미지
            regex = /\[\[([^\]]+)\]\]/g
            line = line.replace(regex, function (match) {
                // match는 찾은 문자열을 가리킵니다. 예: '[[some text]]'
                let extracted = match.slice(2, -2)  // [[]] 제거합니다.
                let [src, width, height] = extracted.split(',')
                const result = `<a href="/document/파일:${src.trim().split('/')[1]}"><img src="/upload/${src.trim()}" style="width:${width.trim()};height:${height.trim()};" alt=""/></a>`
                return result
            })

            //주석
            regex = /##([^#]+)##/g
            line = line.replace(regex, function (match) {
                // match는 찾은 문자열을 가리킵니다. 예: '##some text##'
                let extracted = match.slice(2, -2)  // ## 제거합니다.
                let splitIndex = extracted.indexOf(' ');
                let index, content;
                if (splitIndex === -1) index = extracted // 공백이 없는 경우
                else [index, content] = [extracted.slice(0, splitIndex), extracted.slice(splitIndex + 1)] // 공백이 있는 경우

                if(!content || index.length > 1){ //둘 중 하나만 있을 떄
                    if(index.length === 1){ // 주석만
                        content = annotation.list[index]
                    }else { // 내용만
                        content = index + ' ' + content
                        index = ++annotation.numIndex
                        annotation.list[index] = content
                    }
                }else{ // 둘 다 있을 때
                    annotation.list[index] = content
                }
                let result = '<span class="ano-con">'
                result += `<a id="fn-${index}" href="#an-${index}" class="scroll-link annotation-link" data-content="${content}">[${index}]</a>`
                result += `<span class="hover-content"><a href="#an-${index}" class="scroll-link annotation-link" data-content="${content}">[${index}]</a> ${content}</span>`
                result += '</span>'
                return result
            })

            return line
        }

        contentArr.map((line, index) => {
            if(line === "" && !code) htmlText += `</br>`
            if(line.startsWith("==")){
                htmlText += `</div></div>`
                divOpen = false
                const ctr = (line.split('=').length - 1) / 2 - 2
                const title = line.replaceAll('=','')
                let id = ''

                if(subTitle[ctr] === undefined) subTitle[ctr] = 1
                else subTitle[ctr]++

                for(let i=0;i<=ctr;i++) id += subTitle[i] + '.'

                htmlText += `<h2><a id="s-${id}" href="#top" class="scroll-link">${id}</a><span>${title}</span></h2>`
            }else if(line.startsWith("$$")){
                htmlText += `</div></div>`
                divOpen = false
                if(bq) htmlText += `<div><blockquote>`
                else htmlText += `</blockquote></div>`
                bq = !bq
            }else if(line.startsWith('~~~')){
                htmlText += `</div></div>`
                divOpen = false
                if(bq) htmlText += `<div><SyntaxHighlighter language="${line.split('~~~')[1]}">`
                else htmlText += `</SyntaxHighlighter></div>`
                bq = !bq
                code = !code
            }
            else{
                if(!divOpen && bq){
                    htmlText += `<div><div>`
                    divOpen = true
                }
                htmlText += transLinkImage(line)
                if(!code) htmlText += '<br/>'
                else htmlText += '\n'
            }
        })
        return htmlText
    }

    function initAnnotationHtml(annotation) {
        let result = ''
        const list = annotation.list

        for (let index in list) {
            const content = list[index]
            result += `<div id="an-${index}"><a href="#fn-${index}" class="scroll-link">[${index}]</a><span>${content}</span></div>`
        }
        return result;
    }

    const getDocument = async(this_url, versionURI) => {
        const res = await axios.get(this_url + versionURI)

        setTitle(res.data.title)
        await isFavorite(res.data.title)

        if(res.data.isFile){
            setIsFile(res.data.isFile)
            const file = res.data
            let fp = file.filePath.split('/')

            const imageUrl = `/upload/${file.category}/${fp[fp.length - 1]}`
            const renderedContents = []
            const category = [file.category]
            setDocumentCategory(category)
            // renderedContents.push(<div key={Math.random()}>분류:<Link to={`/document/${file.category}`}>{file.category}</Link></div>)
            renderedContents.push(<h2>이미지</h2>)
            renderedContents.push(<img key={Math.random()} src={imageUrl} alt={file.fileDes} />)
            renderedContents.push(<h2>설명</h2>)
            renderedContents.push(<div className={'file-des'} key={Math.random()}>{file.fileDes}</div>)
            setRenderedContents(renderedContents)
        }
        else if(res.data.isCategory){
            const documents = res.data.documents
            const renderedContents = []
            documents.forEach((document) =>  {
                renderedContents.push(<div className={'document-list'} onClick={() => navigate(`/document/${document}`)} key={`분류:${document}`}><Link to={`/document/${document}`}>{document.toString()}</Link></div>)
            })
            setRenderedContents(renderedContents)
        }
        else if(res.data.hasDocument){
            const category = res.data.category
            const writer = res.data.writer
            const content = res.data.content
            const recent = res.data.recent
            const transContent = transHtml(content)
            const renderedContents = extractElements(transContent) // JSX 로 변환하여 렌더링
            const indexHtml = initIndexHtml(indexList)
            const renderedIndex = extractElements(indexHtml)
            const annotationHtml = initAnnotationHtml(annotation)
            const renderedAnnotation = extractElements(annotationHtml)
            const params = new URLSearchParams(location.search)

            setRenderedContents(renderedContents)
            setRenderedIndex(renderedIndex)
            setRenderedAnnotation(renderedAnnotation)
            setVersion(parseInt(params.get('version')) || null)
            setCategory(category)
            setWriter(writer)
            if(!recent) setVersionURI("(Version " + version + ")")
        }else{
            const data = [<div key={`No Document`}>해당 문서를 찾을 수 없습니다.</div>, <Link key={`No Document Link`} to={`/edit/${res.data.title}`}>[새 문서 만들기]</Link>]
            setRenderedContents(data)
        }
    }

    const initDocument = async () => {
        const this_url = location.pathname
        const hash = location.hash ? location.hash : undefined
        const versionURI = location.search

        getDocument(this_url, versionURI).then(r => {
            if(hash) {
                setTimeout(() => {
                    scrollToElement(hash.substring(1, hash.length))
                }, 300)
            }
        })

    }

    const isFavorite = async (title) => {
        const user = await getUser()
        const res = await axios.post('/favorite',{title: title, target: user})
        const isStar = res.data.isStar
        if(isStar) setStar('★')
    }

    const updateFavorite = async () => {
        const user = await getUser()
        const res = await axios.post('/favorite/update',{title: title, target: user})
        setStar(res.data.star)
    }

    const getUser = async () => {
        if(cookies.username) return cookies.username
        else{
            const response = await fetch("https://api64.ipify.org?format=json")
            const data = await response.json()
            return data.ip
        }
    }

    useEffect(() => {
        setIndexList([])
        setRenderedContents([])
        setRenderedIndex([])
        setRenderedAnnotation([])
        setCategory([])
        setWriter("")
        setTitle("")
        setStar('☆')
        setIsFile(false)
        setDocumentCategory([])

        axiosLoading(initDocument)
    }, [ location.pathname, location.hash ])

    return (
        <div>
            <div className={'document-info'}>
                {(category.length > 0 || documentCategory.length > 0) && `분류:`}
                {category.map((cg, index) => (
                    <React.Fragment key={index}>
                        <Link to={`/document/분류:${cg}`}>{cg}</Link>
                        <span className={"category-padding"}></span>
                    </React.Fragment>
                ))}
                {documentCategory.map((cg, index) => (
                    <React.Fragment key={index}>
                        <Link to={`/document/${cg}`}>{cg}</Link>
                        <span className={"category-padding"}></span>
                    </React.Fragment>
                ))}
                {writer && <><>작성자 : </><Link to={`/profile/${writer}`}>{writer}</Link></>}
            </div>
            <h1>{title} {version ? "Version: " + version : null}</h1>
            <div className={"document-navi"}>
                {!isFile && <button onClick={() => {navigate("/edit/" + title + "?version=" + version)}} className={"button"}><span><Link to={"/edit/" + title + "?version=" + version} className={"document-navi-btn"}>편집</Link></span></button>}
                {!isFile && <button onClick={() => {navigate("/history/" + title)}} className={"button"}><span><Link to={"/history/" + title} className={"document-navi-btn"}>역사</Link></span></button>}
                {!isFile && <button onClick={() => {navigate("/report/" + title + "?version=" + version + "&writer=" + writer)}} className={"button"}><span><Link to={"/report/" + title + "?version=" + version + "&writer=" + writer} className={"document-navi-btn"}>신고</Link></span></button>}
                {!isFile && <button onClick={updateFavorite} className={"button"}><span><span className={"document-navi-btn"}>{star}</span></span></button>}
            </div>
            {renderedIndex.length > 0 && (
                <div className="index-list" id="top">
                    <div className={'index-title'}>목차</div>
                    {renderedIndex}
                </div>
            )}
            {renderedContents}
            {renderedAnnotation.length > 0 && (
                <div className="annotation-list">
                    <h3 className={'annotation-title'}>주석</h3>
                    {renderedAnnotation}
                </div>
            )}
        </div>
    )
}

export default Document