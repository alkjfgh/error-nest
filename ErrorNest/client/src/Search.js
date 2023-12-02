import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import algoliasearch from "algoliasearch"

const Search = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const searchParams = new URLSearchParams(location.search)
    const query = searchParams.get('q')

    const client  = algoliasearch('71RW9A7WPG', '00ceb7dfa83484290df56b46cdecde1d')
    const index = client.initIndex('document-title');

    const [message, setMessage] = useState("")
    const [hits, setHits] = useState([])

    console.log(`location >> ${location}`)
    console.log(`location.search >> ${location.search}`)

    const searchDocument = async (thisURL) => {
        console.log(thisURL)
        const res = await axios.get(`${thisURL}?title=${query}`)
        console.log(`resultQuery <> >> ${res.data.searchTitle}`)
        setMessage("searching..")
        setHits([])

        if (query === res.data.searchTitle && res.data.searchTitle !== "") navigate(`/document/${query}`)
    }

    useEffect(() => {
        const thisURL = location.pathname
        searchDocument(thisURL).then(r => {
            index
                .search(query)
                .then(({ hits }) => {
                    setHits(hits)
                    setMessage("검색 결과가 없습니다")
                })
                .catch(err => {
                    console.error(err);
                });
        })
    }, [query])


    return (
        <>
            {hits.length > 0 ? (
                hits.map((hit, index) => (
                    <Link key={index} to={`/search?q=${encodeURIComponent(hit.title).replace(/%20/g, '+')}`} className="search-result-item">
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