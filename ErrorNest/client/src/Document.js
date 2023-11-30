import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-scroll'
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

    function initIndexHtml() {
        console.log("s-"+indexList[0].aText.substring(0,1))
        return indexList.map((index, i) => (
            <span key={i}>
                <Link to={"s-"+index.aText.substring(0,1)} spy={true} smooth={true} offset={-70} duration={500}>{index.aText}</Link>
                {index.spanText}
            </span>
        ));
    }

    const urlDatatest = async(this_url) => {
        const res = await axios.get(this_url)

        const content = res.data.content
        const renderedContents = extractElements(content) // JSX 로 변환하여 렌더링

        renderedContents.map((content) => {
            console.log(content)
        })

        const indexHtml = initIndexHtml()

        setTitle(res.data.title)
        setRenderedContents(renderedContents)
        setRenderedIndex(indexHtml)
    }

    useEffect(() => {
        const this_url = location.pathname

        setIndexList([])

        urlDatatest(this_url).then(r => {
        })

    }, [ location ])

    return (
        <>
            <div className="container">
                <article>
                    <h2>{title}</h2>
                    <div className="index-list">{renderedIndex}</div>
                    {renderedContents}
                </article>
                <aside>
                </aside>
            </div>
        </>
    )
}

export default Document