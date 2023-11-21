import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

function Document(props) {
    const [seq, setSeq] = useState()
    const [operator, setOperator] = useState();
    const location = useLocation();

    const urlDatatest = async(this_url) => {
        console.log(this_url)
        console.log(this_url.replace(0))
        const response = await axios(this_url);
        const seq = response.data.seq;
        setSeq(seq);
    };

    useEffect(() => {
        // express로 url 보내서 처리
        const this_url = location.pathname;

        urlDatatest(this_url).then(r => {
        });

    }, [ location ])

    return (
        <>
            <h1>{seq}</h1>
        </>
    );
}

export default Document;