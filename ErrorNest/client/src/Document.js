import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios'

import './css/document.scss'
import Aside from "./Aside";

function Document(props) {
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [renderedContents, setRenderedContents] = useState([])
    const [renderedIndex, setRenderedIndex] = useState([])
    const [indexList, setIndexList] = useState([])

    const extractElements = (htmlString) => { // 문자열에서 HTML 요소 추출 및 재귀적 처리
        const wrapper = document.createElement('div')
        wrapper.innerHTML = htmlString

        return Array.from(wrapper.childNodes).map((node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase()
                const content = extractElements(node.innerHTML)
                const classList = node.classList;
                if (tagName === 'h2'){
                    const aText = node.querySelector('a') ? node.querySelector('a').textContent : null;
                    const spanText = node.querySelector('span') ? node.querySelector('span').textContent : null;
                    indexList.push({ aText: aText, spanText: spanText });
                }
                const props = { key: index, className: classList[0]}
                if (node.id && node.id.startsWith('s-')) {
                    props.id = node.id; // id 추가
                    props.href = '#top'; // href 추가
                }
                return React.createElement(tagName, props, content)
            }
            return null
        })
    }

    function scrollToElement(id) {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }

    function drawIndex(indexList, depth = 1) {
        let result = [];
        while (indexList.length > 0) {
            let index = indexList[0];
            let levels = index.aText.split('.').filter(Boolean);  // "2.1.1." => ["2", "1", "1"]

            if (levels.length === depth) {
                result.push(
                    <span key={index.aText}>
                        <a href={"#s-"+index.aText.substring(0,index.aText.length-1)}>{index.aText}</a>
                        {' ' + index.spanText}
                    </span>
                );
                indexList.shift();
            } else if (levels.length > depth) {
                let childIndexes = [];
                while (indexList.length > 0 && indexList[0].aText.split('.').filter(Boolean).length > depth) {
                    childIndexes.push(indexList.shift());
                }
                result.push(<div className={"index-space"} key={'div'+depth}>{drawIndex(childIndexes, depth + 1)}</div>);
            } else {
                break;
            }
        }
        return result;
    }

    function initIndexHtml() {
        return drawIndex(indexList);
    }

    const urlDatatest = async(this_url) => {
        const res = await axios.get(this_url)

        const content = res.data.content
        const renderedContents = extractElements(content) // JSX 로 변환하여 렌더링

        const indexHtml = initIndexHtml(indexList)

        setTitle(res.data.title)
        setRenderedContents(renderedContents)
        setRenderedIndex(indexHtml)
    }

    useEffect(() => {
        const this_url = location.pathname
        const hash = location.hash ? location.hash : undefined

        setIndexList([])

        urlDatatest(this_url).then(r => {
            if(hash) scrollToElement(hash.substring(1, hash.length))
        })

    }, [ location.pathname, location.hash ])

    return (
        <>
            <div className="container">
                <article>
                    <h1>{title}</h1>
                    <div className={"document-navi"}><Link to={"/edit/" + title}>편집</Link><Link to={"/history/" + title}>역사</Link></div>
                    {/*<div className={"documet-update"}></div>*/}
                    <div className="index-list" id="top">{renderedIndex}</div>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    {renderedContents}
                </article>
                <Aside></Aside>
            </div>
        </>
    )
}

export default Document