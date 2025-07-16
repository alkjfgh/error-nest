import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import '../css/memberListView.scss'
import axios from "axios";
function BanHistoryView(props) {
    const location = useLocation()

    const [banHistories, setBanHistories] = useState([{}])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [isEditing, setIsEditing] = useState(false);

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
            <div className="BanHistoryView-container">
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
                <table className="adminListView-table">
                    <tbody>
                    <tr>
                        <th><h1>target</h1></th>
                        <th><h1>type</h1></th>
                        <th><h1>comment</h1></th>
                        <th><h1>status</h1></th>
                        <th><h1>remainDate</h1></th>
                        <th><h1>createdAt</h1></th>
                        <th><h1>expireAt</h1></th>
                    </tr>
                    {banHistories.length > 0 && banHistories.map((banHistory, index) => {
                        return (
                            <tr key={index}>
                                <td className="tdStyle">{banHistory.target}</td>
                                <td className="tdStyle">{banHistory.type}</td>
                                <td className="tdStyle">{banHistory.comment}</td>
                                <td className="tdStyle">{banHistory.status}</td>
                                <td className="tdStyle">{banHistory.remainDate}</td>
                                <td className="tdStyle">{banHistory.createdAt}</td>
                                <td className="tdStyle">{banHistory.expireAt}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default BanHistoryView;