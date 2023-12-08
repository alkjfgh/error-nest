import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useCookies} from "react-cookie";

const Report = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [version, setVersion] = useState(1);
    const [comment, setComment] = useState("");
    const [cookies, setCookies, removeCookies] = useCookies();

    const axiosLoading = props.axiosLoading

    const getDocument = async (thisUri, versionURI) => {
        axiosLoading(async () => {
            thisUri = thisUri.substring(0, 7) + `/getDocument` + thisUri.substring(7);

            console.log(`thisUri >> ${thisUri}`);
            console.log(`axios(get) >> ${thisUri + versionURI}`);

            // const res = await axios.get(thisUri + versionURI);
            const res = await axios.get(thisUri+ versionURI);
            console.log("res.data");
            console.log(res.data);

            setTitle(res.data.title);
            setVersion(res.data.version);
            setWriter(await getWriter());
        })

    }

    const getWriter = async () => {
        if(cookies.userid) return cookies.userid;
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        console.log(`data.ip >> ${data.ip}`);
        return data.ip;
    }

    const getUserInfo = async () => {
        if(cookies.userid !== undefined) {
            console.log(`cookies.userid >> ${cookies.userid}`);
            return {userid: cookies.userid, username: cookies.username, isLogin: true}; // 로그인 id
        } else {
            const response = await fetch("https://api64.ipify.org?format=json");
            const data = await response.json();

            console.log(`data.ip >> ${data.ip}`);
            return {userid: data.ip, username: "noName", isLogin: false}; // PC ip
        }
    }

    useEffect(() => {
        const thisUri= location.pathname;
        const params = new URLSearchParams(location.search);
        const versionURI = location.search;

        setVersion(parseInt(params.get('version')) || 0)
        getDocument(thisUri, versionURI).then();

    }, []);

    const reportSubmit = async () => {
        axiosLoading(async () => {
            let thisUri = location.pathname;
            thisUri = thisUri.substring(0, 7) + `/insert`;
            console.log(`thisUri >> ${thisUri}`);

            const userInfo = await getUserInfo();
            console.log("userInfo ----");
            console.log(userInfo);

            console.log("reportSubmit ----");
            const res = await axios.post(thisUri,{title, comment, version, userInfo});

            console.log(res.data);

            if (res.data.success) {
                alert(`${res.data.message}`);
                navigate(`/document/${title}`);
            }
        })
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