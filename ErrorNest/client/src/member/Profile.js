import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";

import '../css/nomalize.scss'
import axios from "axios";

const Profile = (props) => {
    const location = useLocation()
    const [cookies] = useCookies([]);

    const [inputs, setInputs] = useState({
        comment: '',
        remainDate: 1,
    });
    const [banUpdateMessage, setBanUpdateMessage] = useState('')
    const [writtenList, setWrittenList] = useState([]);
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [user, setUser] = useState('')
    const [url, setUrl] = useState('')

    let hashtag = location.hash
    const axiosLoading = props.axiosLoading

    const getUser = async () => {
        let user = location.pathname.split('/')[2];
        user = decodeURIComponent(user);
        setUser(user)
        hashtag = hashtag.split('#')[1]
        return user
    }

    const getProfile = async () => {
        const user = await getUser()
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1
        setPage(page)
        console.log(parseInt(params.get('page')) || 1)
        // TODO 유저 정보, 밴 정보 띄워주기
        const url = `${user}/${hashtag ? hashtag : 'ip'}`;
        setUrl(url)
        const writtenList = await axios.get(`/history/${url}?page=${page}`);
        const banInfo = await axios.get(`/ban/${url}`);
        const result = writtenList.data.writtenList;
        const maxPage = Math.floor(writtenList.data.maxPage)

        setWrittenList(result);
        setMaxPage(maxPage);
        console.log(url)
        console.log(banInfo.data)
    }

    useEffect(() => {
        // TODO 있는 유저 인지 or 맞는 포멧의 ip인지 확인 먼저 해야함

        axiosLoading(getProfile)
    }, [location.pathname,location.search])

    const handleChange = (e) => {
        const {name, value}  = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        if(banUpdateMessage === '밴 처리중') return
        setBanUpdateMessage('밴 처리중')
        e.preventDefault();
        const data = {comment: inputs.comment, remainDate: inputs.remainDate}
        const res = await axios.post(`/ban/update/${url}`, data);
        const success = res.data.success
        if(success) setBanUpdateMessage('밴 성공')
        else setBanUpdateMessage('밴 실패')
    }

    return (
        <>
            <h3>{user + hashtag}</h3>
            <div>
                {hashtag && <div>이메일</div>}
                {/*TODO admin or 자신만 볼 수 있도록*/}
                <div>
                    {/*TODO admin만 벤 할 수 있도록*/}
                    <form onSubmit={handleSubmit}>
                        벤 사유 : <input type="text" name="comment" onChange={handleChange}/>
                        <select onChange={handleChange} name="remainDate">
                            <option value="1">1일</option>
                            <option value="3">3일</option>
                            <option value="7">7일</option>
                            <option value="30">30일</option>
                            <option value="100000">영구정지</option>
                        </select>
                        <button type="submit">send</button>
                        {banUpdateMessage}
                    </form>
                </div>
            </div>
            <div>
                <h4>작성글</h4>
                <ul>
                    {writtenList.map((history, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                        <li key={index}>
                            <Link to={"/document/" + history.title + "?version=" + history.version}>
                                <span>제목: {history.title}</span>
                                <span>, 작성날짜: {history.updateAt}</span>`
                                <span>, 버전: {history.version}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <span>
                    {page - 1 > 0 ? (
                        <Link to={`/profile/${url}` + "?page=" + (page - 1)}>{"<"}Prev</Link>
                    ) : (
                        "<Prev"
                    )}
                </span>
                <span>
                    {page + 1 <= maxPage ? (
                        <Link to={`/profile/${url}` + "?page=" + (page + 1)}>Next{">"}</Link>
                    ) : (
                        "Next>"
                    )}
                </span>
            </div>
        </>
    );
};

export default Profile;