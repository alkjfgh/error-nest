import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import axios from "axios";

function MemberListView(props) {
    const location = useLocation()

    const [members, setMembers] = useState([{}]);
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

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



    const handleDelete = async (e) => {
        const data = await axios.delete('/member/delete', {data:{ id: e.target.name}})
            .then(()=>getMembers());
    }

    return (
        <>
            <table>
                <tbody>
                <tr>
                    <th>name</th>
                    <th>hashtag</th>
                    <th>id</th>
                    <th>password</th>
                    <th>email</th>
                    <th>date</th>
                    <th>level</th>
                </tr>
                {members.length > 0 && members.map((member, index) => {
                    let hashtag = member.hashtag ? member.hashtag.toString().padStart(4, '0') : '';
                    return (
                        <tr key={index}>
                            <td><Link to={`/profile/${member.name}#${hashtag}`}>{member.name}</Link></td>
                            <td>{hashtag}</td>
                            <td>{member.id}</td>
                            <td>{member.pw}</td>
                            <td>{member.email}</td>
                            <td>{member.date}</td>
                            <td>{member.level}</td>
                            <td>
                                <button type="button" name={member.id} onClick={handleDelete}>삭제</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div>
                {/* TODO ban 여러개 넣어서 테스트 해봐야 함*/}
                <span>
                    {page - 1 > 0 ? (
                        <span onClick={() => setPage(page - 1)}>{"<"}Prev</span>
                    ) : (
                        "<Prev"
                    )}
                </span>
                <span>
                    {page + 1 <= maxPage ? (
                        <span onClick={() => setPage(page + 1)}>Next{">"}</span>
                    ) : (
                        "Next>"
                    )}
                </span>
            </div>
        </>
    )
}

export default MemberListView;