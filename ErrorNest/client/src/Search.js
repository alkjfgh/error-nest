
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const [resultQuery, setResultQuery] = useState("");

    console.log(`location >> ${location}`);
    console.log(`location.search >> ${location.search}`);

    const getData = async (thisURL) => {
        console.log(thisURL);
        const res = await axios.get(`${thisURL}?title=${query}`);

        setResultQuery(res.data.searchTitle);

    };

    useEffect(() => {
        const thisURL = location.pathname;
        getData(thisURL);
    }, [query]);

    if (query === resultQuery) {
        return (
            <div>
                <h2>Search Page Success !!!</h2>
                <p>Search Result >> {query}</p>
            </div>
        )
    } else {
        return (
            <div>
                <h2>Search Page Failed...</h2>
            </div>
        )
    }

}

export default Search;