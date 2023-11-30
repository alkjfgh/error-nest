
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const [document, setDocument] = useState({});

    console.log(`location >> ${location}`);
    console.log(`location.search >> ${location.search}`);

    return (
        <div>
            <h2>Search Page Success !!!</h2>
            <p>Search Result >> {query}</p>
        </div>
    )
}

export default Search;