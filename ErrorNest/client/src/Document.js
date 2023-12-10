import React, {useEffect, useLayoutEffect, useState} from 'react'
import {useLocation, useNavigate, Link} from 'react-router-dom'
import {Link as LinkScroll, animateScroll as scroll } from 'react-scroll'
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
    const annotation = {
        numIndex: 0,
        list: {}
    }
    const [renderedAnnotation, setRenderedAnnotation] = useState([])

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
                        // console.log(props.data_content)
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
        // let result = []
        let result = ""
        while (indexList.length > 0) {
            let index = indexList[0]
            let levels = index.aText.split('.').filter(Boolean)  // "2.1.1." => ["2", "1", "1"]

            if (levels.length === depth) {
                // result.push(
                //     <span key={index.aText}>
                //         <a href={"#s-"+index.aText.substring(0,index.aText.length-1)}>{index.aText}</a>
                //         {' ' + index.spanText}
                //     </span>
                // )
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
                // result.push(<div className={"index-space"} key={'div'+depth}>{drawIndex(childIndexes, depth + 1)}</div>)
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
                const result = `<img src="/upload/${src.trim()}" style="width:${width.trim()};height:${height.trim()};" alt=""/>`
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
                // const result = `<a id="fn-${index}" href="#an-${index}" class="scroll-link annotation-link">[${index}]</a>`
                let result = `<a id="fn-${index}" href="#an-${index}" class="scroll-link annotation-link" data-content="${content}">[${index}]</a>`
                result += `<span class="hover-content"><a href="#an-${index}" class="scroll-link annotation-link" data-content="${content}">[${index}]</a> ${content}</span>`
                return result
            })

            return line
        }

        contentArr.map((line) => {
            if(line === "") htmlText += `</br>`
            if(line.startsWith("==")){
                const ctr = (line.split('=').length - 1) / 2 - 2
                const title = line.replaceAll('=','')
                let id = ''

                if(subTitle[ctr] === undefined) subTitle[ctr] = 1
                else subTitle[ctr]++

                for(let i=0;i<=ctr;i++) id += subTitle[i] + '.'
                // id = id.slice(0,-1)

                htmlText += `<h2><a id="s-${id}" href="#top" class="scroll-link">${id}</a><span>${title}</span></h2>`
            }else if(line.startsWith("$$")){
                if(bq) htmlText += `<div><blockquote>`
                else htmlText += `</blockquote></div>`
                bq = !bq
            }else{
                if(bq) htmlText += `<div><div>`
                htmlText += transLinkImage(line)
                if(bq) htmlText += `</div></div>`
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

        if(res.data.isFile){
            setIsFile(res.data.isFile)
            const file = res.data
            const imageUrl = `/upload/${file.category}/${file.fileName}`
            const renderedContents = []
            renderedContents.push(<div key={Math.random()}>분류:<Link to={`/document/분류:파일/${file.category}`}>파일/{file.category}</Link></div>)
            renderedContents.push(<img key={Math.random()} src={imageUrl} alt={file.fileDes} />)
            renderedContents.push(<div key={Math.random()}>{file.fileDes}</div>)
            setRenderedContents(renderedContents)
        }
        else if(res.data.isCategory){
            const documents = res.data.documents
            const renderedContents = []
            documents.forEach((document) =>  {
                renderedContents.push(<div key={`분류:${document}`}><Link to={`/document/${document}`}>{document.toString()}</Link></div>)
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

    useEffect(() => {
        const this_url = location.pathname
        const hash = location.hash ? location.hash : undefined
        const versionURI = location.search

        setIndexList([])
        setRenderedIndex([])
        setRenderedAnnotation([])
        setCategory([])
        setWriter("")
        setTitle("")

        getDocument(this_url, versionURI).then(r => {
            if(hash) {
                setTimeout(() => {
                    scrollToElement(hash.substring(1, hash.length))
                }, 300)
            }
        })

    }, [ location.pathname, location.hash ])

    return (
        <div>
            <div>
                {category.length > 0 && `분류:`}
                {category.map((cg, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                    <Link key={cg} to={`/document/분류:${cg}`}>{cg}</Link>
                ))}
                작성자 : <Link to={`/profile/${writer}`}>{writer}</Link>
            </div>
            <h1>{title} {version ? "Version: " + version : null}</h1>
            <div className={"document-navi"}>
                {!isFile && <Link to={"/edit/" + title + "?version=" + version}>편집</Link>}
                {!isFile && <Link to={"/history/" + title}>역사</Link>}
                {!isFile && <Link to={"/report/" + title + "?version=" + version}>신고</Link>}
            </div>
            <div className="index-list" id="top">{renderedIndex}</div>
            {renderedContents}
            <div className="annotation-list">{renderedAnnotation}</div>
        </div>
    )
}

export default Document