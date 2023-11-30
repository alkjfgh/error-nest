import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

import './css/document.scss'

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

    // function initIndexHtml() {
    //     return indexList.map((index, i) => (
    //             <span key={i}>
    //                 <a href={"#s-"+index.aText.substring(0,index.aText.length)}>{index.aText}</a>
    //                 {index.spanText}
    //             </span>
    //     ));
    // }

    function renderIndexItem(index) {
        return (
            <span>
      <a href={"#s-" + index.aText.substring(0, index.aText.length)}>{index.aText}</a>
                {index.spanText && (
                    <div>
                        <span>{index.spanText}</span>
                        {index.subIndex && renderIndexItem(index.subIndex)}
                    </div>
                )}
    </span>
        );
    }

    function initIndexHtml() {
        return indexList.map((index, i) => (
            <div key={i}>{renderIndexItem(index)}</div>
        ));
    }

    const urlDatatest = async(this_url) => {
        const res = await axios.get(this_url)

        const content = res.data.content
        const renderedContents = extractElements(content) // JSX 로 변환하여 렌더링

        const indexHtml = initIndexHtml()

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

    }, [ location ])

    return (
        <>
            <div className="container">
                <article>
                    <h2>{title}</h2>
                    <div className="index-list" id="top">{renderedIndex}</div>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    {renderedContents}
                </article>
                <aside>
                </aside>
            </div>
        </>
    )
}

export default Document