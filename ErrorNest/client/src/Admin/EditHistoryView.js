import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import axios from "axios";
function EditHistoryView(props) {
    const location = useLocation()

    const [editHistories, setEditHistories] = useState([{}])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

    const axiosLoading = props.axiosLoading

    const url = '/history/editHistory'

    useEffect(() => {
        setEditHistories([{}])
        axiosLoading(getBanHistory)
    },[]);

    useEffect(() => {
        setEditHistories([{}])
        axiosLoading(getBanHistory)
    }, [page]);

    const getBanHistory = async () => {
        const response = await axios.put(`${url}?page=${page}`);
        const maxPage = Math.floor(response.data.maxPage)

        setEditHistories(response.data.editHistories)
        setMaxPage(maxPage);
    }

    return (
        <>
            <table>
                <tbody>
                <tr>
                    <th>title</th>
                    <th>updateAt</th>
                    <th>version</th>
                    <th>writer</th>
                </tr>
                {editHistories.length > 0 && editHistories.map((editHistory, index) => {
                    return (
                        <tr key={index}>
                            <td><Link to={`/document/${editHistory.title}?version=${editHistory.version}`}>{editHistory.title}</Link></td>
                            <td>{editHistory.updateAt}</td>
                            <td>{editHistory.version}</td>
                            <td><Link to={`/profile/${editHistory.writer}`}>{editHistory.writer}</Link></td>
                        </tr>
                    )
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

export default EditHistoryView;