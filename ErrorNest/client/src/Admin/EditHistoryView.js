import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import '../css/memberListView.scss'

import axios from "axios";
function EditHistoryView(props) {
    const location = useLocation()

    const [editHistories, setEditHistories] = useState([{}])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [isEditing, setIsEditing] = useState(false);

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

            <div className="EditHistoryView-container">
                <table className="adminListView-table">
                    <thead>
                    <tr>
                        <th><h1>title</h1></th>
                        <th><h1>updateAt</h1></th>
                        <th><h1>version</h1></th>
                        <th><h1>writer</h1></th>
                    </tr>
                    </thead>
                    <tbody>
                    {editHistories.length > 0 && editHistories.map((editHistory, index) => {
                        return (
                            <tr key={index}>
                                <td className="tdStyle"><Link to={`/document/${editHistory.title}?version=${editHistory.version}`}>{editHistory.title}</Link></td>
                                <td className="tdStyle">{editHistory.updateAt}</td>
                                <td className="tdStyle">{editHistory.version}</td>
                                <td className="tdStyle"><Link to={`/profile/${editHistory.writer}`}>{editHistory.writer}</Link></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>

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
        </>
    );
}

export default EditHistoryView;