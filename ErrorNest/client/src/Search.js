import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

const Search = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const searchParams = new URLSearchParams(location.search)
    const query = searchParams.get('q')

    const [message, setMessage] = useState("")

    console.log(`location >> ${location}`)
    console.log(`location.search >> ${location.search}`)

    const getData = async (thisURL) => {
        console.log(thisURL)
        const res = await axios.get(`${thisURL}?title=${query}`)
        console.log(`resultQuery <> >> ${res.data.searchTitle}`)
        setMessage("searching..")

        if (query === res.data.searchTitle && res.data.searchTitle !== "")
            navigate(`/document/${query}`)
        else
            setMessage('Search Page Failed...')
    }

    useEffect(() => {
        const thisURL = location.pathname
        getData(thisURL)
    }, [query])


    return (
        <h2>{message}</h2>
    )

}

export default Search