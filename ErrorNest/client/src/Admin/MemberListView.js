import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import axios from "axios";

import '../css/memberListView.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBan} from "@fortawesome/free-solid-svg-icons";

function MemberListView(props) {
    const location = useLocation()

    const [members, setMembers] = useState([{}]);
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [isEditing, setIsEditing] = useState(false);

    const axiosLoading = props.axiosLoading

    useEffect(() => {
        setMembers([{}])
        axiosLoading(getMembers)
    },[]);

    useEffect(() => {
        setMembers([{}])
        axiosLoading(getMembers)
    }, [page]);

    /** 유저 목록 조회 */
    const getMembers = async () => {
        const response = await axios.get(`/member/admin?page=${page}`);
        const formattedMembers = response.data.members.map((member) => ({
            ...member,
            date: new Date(member.date).toLocaleDateString().slice(0, -1) // 원하는 날짜 형식으로 변환
        }));
        const maxPage = Math.floor(response.data.maxPage)
        
        setMembers(formattedMembers);
        setMaxPage(maxPage);
    };



    const handleDelete = async (id) => {
        const data = await axios.delete('/member/delete', {data:{ id: id}})
            .then(()=>getMembers());
    }

    return (
        <>
            <div className="memberListView-container">
                <div className="pagination-con">
                    <div className="pagination">
                        <button className="prevPage" onClick={() => setPage(page - 1)}
                                disabled={page === 1}>Prev
                        </button>
                        {isEditing ? (
                            <input
                                className={'pageId'}
                                type="number"
                                value={page}
                                min={1}
                                max={maxPage}
                                onChange={(e) => {
                                    if (+e.target.value <= maxPage && +e.target.value >= 1) setPage(+e.target.value)
                                }}
                                onBlur={() => {
                                    setIsEditing(false)
                                }}
                                autoFocus
                            />
                        ) : (
                            <div className="pageId" onClick={() => setIsEditing(true)}>
                                {page}
                            </div>
                        )}
                        <button className="nextPage" onClick={(() => setPage(page + 1))}
                                disabled={page === maxPage}>Next
                        </button>
                    </div>
                </div>
                <div className="memberListView-table-container">
                    <table className="adminListView-table">
                        <thead>
                        <tr>

                            <th><h1>name</h1></th>
                            <th><h1>hashtag</h1></th>
                            <th><h1>id</h1></th>
                            <th><h1>password</h1></th>
                            <th><h1>email</h1></th>
                            <th><h1>date</h1></th>
                            <th><h1>level</h1></th>
                            <th><h1 className="tabelTitle-delete">delete</h1></th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.length > 0 && members.map((member, index) => {
                            let hashtag = member.hashtag ? member.hashtag.toString().padStart(4, '0') : '';
                            return (
                                <tr key={index}>
                                    <td className="tdStyle"><Link
                                        to={`/profile/${member.name}#${hashtag}`}>{member.name}</Link></td>
                                    <td className="tdStyle">{hashtag}</td>
                                    <td className="tdStyle">{member.id}</td>
                                    <td className="tdStyle">{member.pw}</td>
                                    <td className="tdStyle">{member.email}</td>
                                    <td className="tdStyle">{member.date}</td>
                                    <td className="tdStyle">{member.level}</td>

                                    <button type="button" className="member-delete-btn" name={member.id}
                                            onClick={() => handleDelete(member.id)}>
                                        <FontAwesomeIcon icon={faBan} className="fa-light"/>
                                    </button>
                                    {/*<span name={member.id} onClick={handleDelete}>삭제</span>*/}

                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MemberListView;