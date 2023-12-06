import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";

const Report = () => {

    const location = useLocation();

    const [url, setUrl] = useState("조병준_url");
    const [title, setTitle] = useState("조병준_title");
    const [writer, setWriter] = useState("조병준_writer");
    const [version, setVersion] = useState(1);
    const [comment, setComment] = useState("");

    const getDocument = async (thisUri, versionURI) => {
        console.log(`axios(get) >> ${thisUri + versionURI}`);

        const res = await axios.get(thisUri + versionURI);
        console.log(res.data);

        console.log(`title >> ${res.data.title}`);
        console.log(`version >> ${res.data.version}`);

        setTitle(res.data.title);
        setVersion(res.data.version);
    }

    useEffect(() => {
        const thisUri= location.pathname;
        console.log(`this_url >> ${thisUri}`);
        // setUrl(thisUri);

        const params = new URLSearchParams(location.search);
        console.log(`params >> ${params}`);

        const versionURI = location.search;
        console.log(`versionURI >> ${versionURI}`);

        setVersion(parseInt(params.get('version')) || 5)
        setUrl(thisUri);

        getDocument(thisUri, versionURI);

    }, []);

    const reportSubmit = () => {
        alert(`신고 구현 시작!!`);
    }

    const reportChange = (e) => {
        setComment(e.target.value);
    }

    return (
        <>
            <h2>신고: {title} - {`(Version ${version})`}</h2>
            <div className={"document-navi"}><Link to={"/document/" + title}>돌아가기</Link></div>
            <textarea value={comment} onChange={reportChange}></textarea>
            <button onClick={reportSubmit}>신고 완료</button>
        </>
    )
}
export default Report;