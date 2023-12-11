import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import axios from "axios";

function BanListView(props) {
    const location = useLocation()

    const [banList, setBanList] = useState([{}])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    const axiosLoading = props.axiosLoading

    useEffect(() => {
        setBanList([{}])
        axiosLoading(getBanList)
    },[]);

    useEffect(() => {
        setBanList([{}])
        axiosLoading(getBanList)
    }, [page]);

    const getBanList = async () => {
        const response = await axios.get(`/ban/list?page=${page}`);
        const maxPage = Math.floor(response.data.maxPage)

        setBanList(response.data.banList)
        setMaxPage(maxPage);
    }

    return (
        <>
            <table>
                <tbody>
                <tr>
                    <th>target</th>
                    <th>type</th>
                    <th>comment</th>
                    <th>status</th>
                    <th>remainDate</th>
                    <th>createdAt</th>
                    <th>expireAt</th>
                </tr>
                {banList.length > 0 && banList.map((banInfo, index) => {
                    return (
                        <tr key={index}>
                            <td>{banInfo.target}</td>
                            <td>{banInfo.type}</td>
                            <td>{banInfo.comment}</td>
                            <td>{banInfo.status}</td>
                            <td>{banInfo.remainDate}</td>
                            <td>{banInfo.createdAt}</td>
                            <td>{banInfo.expireAt}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div>
                {/* TODO 유저 여러개 넣어서 테스트 해봐야 함*/}
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
    );
}

export default BanListView;