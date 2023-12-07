import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import algoliasearch from "algoliasearch"

const Search = () => {
    const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
    const ALGOLIA_SEARCH_API_KEY = process.env.REACT_APP_ALGOLIA_SEARCH_API_KEY
    const ALGOLIA_INSERT_API_KEY = process.env.REACT_APP_ALGOLIA_INSERT_API_KEY
    const ALGOLIA_INDEX_NAME = process.env.REACT_APP_ALGOLIA_INDEX_NAME

    const location = useLocation()
    const navigate = useNavigate()

    const searchParams = new URLSearchParams(location.search)
    const searchText = searchParams.get('q')

    const client  = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY)
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    const [message, setMessage] = useState("")
    const [hits, setHits] = useState([])

    // console.log(`location >> ${location}`)
    // console.log(`location.search >> ${location.search}`)

    const searchDocument = async (thisURL) => {
        // console.log(thisURL)
        const res = await axios.get(`${thisURL}?title=${searchText}`)
        // console.log(`resultQuery <> >> ${res.data.searchTitle}`)
        setMessage("searching..")
        setHits([])

        if (searchText === res.data.searchTitle && res.data.searchTitle !== "") navigate(`/document/${searchText}`)
    }

    const directDocument = () => {
        navigate(`/document/${searchText}`)
    }

    useEffect(() => {
        const thisURL = location.pathname
        searchDocument(thisURL).then(r => {
            index
                .search(searchText)
                .then(({ hits }) => {
                    setHits(hits)
                    setMessage("검색 결과가 없습니다")
                })
                .catch(err => {
                    console.error(err);
                });
        })
    }, [searchText])

    return (
        <>
            <div>찾는 문서가 없나요?<span onClick={directDocument}>'{searchText}'문서로 가기</span></div>
            {hits.length > 0 ? (
                hits.map((hit, index) => (
                    <Link key={index} to={`/document/${hit.title}`} className="search-result-item">
                        {hit.title} {/* hit 객체의 필드에 따라 변경 */}
                    </Link>
                ))
            ) : (
                <div className="no-results">{message}</div>
            )}
        </>
    )

}

export default Search