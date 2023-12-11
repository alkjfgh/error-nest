import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import axios from "axios";
function BanHistoryView(props) {
    const location = useLocation()

    const [banHistories, setBanHistories] = useState([{}])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    const axiosLoading = props.axiosLoading

    const url = '/ban/history'

    useEffect(() => {
        setBanHistories([{}])
        axiosLoading(getBanHistory)
    },[]);

    useEffect(() => {
        setBanHistories([{}])
        axiosLoading(getBanHistory)
    }, [page]);

    const getBanHistory = async () => {
        const response = await axios.get(`${url}?page=${page}`);
        const maxPage = Math.floor(response.data.maxPage)

        setBanHistories(response.data.banHistories)
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
                {banHistories.length > 0 && banHistories.map((banHistory, index) => {
                    return (
                        <tr key={index}>
                            <td>{banHistory.target}</td>
                            <td>{banHistory.type}</td>
                            <td>{banHistory.comment}</td>
                            <td>{banHistory.status}</td>
                            <td>{banHistory.remainDate}</td>
                            <td>{banHistory.createdAt}</td>
                            <td>{banHistory.expireAt}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div>
                {/* TODO BanHistory 여러개 넣어서 테스트 해봐야 함*/}
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

export default BanHistoryView;