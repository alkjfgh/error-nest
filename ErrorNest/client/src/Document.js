import React, {useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios";

function Document(props) {
    // useEffect(() => {
    // //     express로 보내서 처리
    //     const location = useLocation();
    //     console.log(location);
    // });
    const location = useLocation();
    useEffect(() => {
        // express로 url 보내서 처리
        const this_url = location.pathname;
        console.log(this_url);
        axios.get(this_url)
            .then(response => {
            })
            .catch(error => {
                console.error('GET 요청 에러:', error);
            });

    }, [ location ])

    return (
        <>
            <h1>asd</h1>
        </>
    );
}

export default Document;