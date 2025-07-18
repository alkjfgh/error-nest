import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useCookies, Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

import '../css/profile.scss'
// import '../css/nomalize.scss'
import axios from "axios";

const Profile = (props) => {
    const location = useLocation()
    const [cookies] = useCookies([]);
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState(1);

    // const [inputs, setInputs] = useState({
    //     comment: '',
    //     remainDate: 1,
    // });
    const [banUpdateMessage, setBanUpdateMessage] = useState('')
    const [writtenList, setWrittenList] = useState([]);
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [target, setTarget] = useState('')
    const [url, setUrl] = useState('')
    const [user, setUser] = useState({})
    const [banInfo, setBanInfo] = useState({
        comment: '',
        remainDate: 1,
    })
    const [targetUser, setTargetUser] = useState({})
    const [isEditing, setIsEditing] = useState(false);

    let hashtag = location.hash
    const axiosLoading = props.axiosLoading

    const getTarget = async () => {
        let target = location.pathname.split('/')[2];
        target = decodeURIComponent(target);
        setTarget(target)
        hashtag = hashtag.split('#')[1]
        if(hashtag) {
            const targetUser = await axios.post('/member', {username: target, hashtag})
            setTargetUser(targetUser.data)
        }
        return target
    }

    const getUser = async (target) => {
        const ipReg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
        if(ipReg.test(target)) return true

        const user = await axios.post('/member', {id: cookies.userid, userkey: cookies.userkey})
        if(user.data){
            const username = user.data.username
            setUser(user.data)
            return user.data.level === "admin" || username === `${target}#${hashtag}`
        }
        return false
    }

    const getProfile = async () => {
        const target = await getTarget()
        const isEqual = await getUser(target)
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1
        const url = `${target}/${hashtag ? hashtag : 'ip'}`;
        const historyRes = await axios.get(`/history/${url}?page=${page}`);
        const writtenList = historyRes.data.writtenList;
        const maxPage = Math.floor(historyRes.data.maxPage)

        if(isEqual){
            const banInfoRes = await axios.get(`/ban/${url}`);
            setBanInfo(banInfoRes.data)
        }

        setUrl(url)
        setPageIndex(page)
        setPage(page)
        setWrittenList(writtenList);
        setMaxPage(maxPage);
    }

    useEffect(() => {
        axiosLoading(getProfile)
    }, [location.pathname,location.search])

    const handleChange = (e) => {
        const {name, value}  = e.target;
        setBanInfo({
            ...banInfo,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        if(user.level !== "admin") return
        if(banUpdateMessage === '밴 처리중') return
        setBanUpdateMessage('밴 처리중')
        e.preventDefault();
        const data = {comment: banInfo.comment, remainDate: banInfo.remainDate}
        const res = await axios.post(`/ban/update/${url}`, data);
        const success = res.data.success
        if(success) setBanUpdateMessage('밴 성공')
        else setBanUpdateMessage('밴 실패')
    }

    const pageChangeHandle = (e) => {
        setPage(e.target.value);
    }

    return (
        <>
            <h2>{target + hashtag}</h2>
            <div>
                {hashtag &&
                    <div id="email-div">
                        이메일 : {targetUser.useremail}
                    </div>
                }
                {banInfo && (user.username === target + hashtag || user.level === "admin") &&
                    <div className="ban-div">
                        <form onSubmit={handleSubmit}>
                            벤 사유 : &nbsp;<input type="text" name="comment" value={banInfo.comment || ''} disabled={user.level !== "admin"} onChange={handleChange}/>
                            <select onChange={handleChange} value={banInfo.remainDate} disabled={user.level !== "admin"} name="remainDate" className="select-css">
                                <option value="0">정상</option>
                                <option value="1">1일</option>
                                <option value="3">3일</option>
                                <option value="7">7일</option>
                                <option value="30">30일</option>
                                <option value="100000">영구정지</option>
                            </select>
                            {user.level === "admin" && <button type="submit">send</button>}
                            {banUpdateMessage}
                        </form>
                    </div>
                }
            </div>
            {writtenList.length > 0 &&
                <div>
                    <div className="table-container">
                        <div className="table__caption">
                            <h2 className="table__header">작성글</h2>
                        </div>
                        <div className="inner">
                            <table>
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>제목</th>
                                    <th>작성날짜</th>
                                    <th>버전</th>
                                </tr>
                                </thead>
                                <tbody>
                                {writtenList.map((history, index) => ( // histories 배열을 순회하며 각 항목을 li 태그로 렌더링
                                    <tr>
                                        <td>{index + pageIndex * 10 - 9}</td>
                                        <td><Link
                                            to={"/document/" + history.title + "?version=" + history.version}>
                                            <span>{history.title}</span>
                                        </Link></td>
                                        <td><Link
                                            to={"/document/" + history.title + "?version=" + history.version}>
                                            <span>{history.updateAt}</span>
                                        </Link></td>
                                        <td><Link
                                            to={"/document/" + history.title + "?version=" + history.version}>
                                            <span>{history.version}</span>
                                        </Link></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="pagination-con">
                        <div className="pagination">
                            <button className="prevPage" onClick={() => navigate(`/profile/${url}` + "?page=" + (page - 1))}
                                    disabled={page === 1}>Prev
                            </button>
                            {isEditing ? (
                                <input
                                    className={'pageId'}
                                    type="number"
                                    value={page}
                                    min={1}
                                    max={maxPage}
                                    onChange={pageChangeHandle}
                                    onBlur={() => {
                                        setIsEditing(false)
                                        if(page < 1) navigate(`/profile/${url}` + "?page=" + (1));
                                        else if(page > maxPage) navigate(`/profile/${url}` + "?page=" + (maxPage));
                                        if(page >= 1 && maxPage >= page) navigate(`/profile/${url}` + "?page=" + (page));
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <div className="pageId" onClick={() => setIsEditing(true)}>
                                    {page}
                                </div>
                            )}
                            <button className="nextPage" onClick={(() => navigate(`/profile/${url}` + "?page=" + (page + 1)))}
                                    disabled={page === maxPage}>Next
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Profile;