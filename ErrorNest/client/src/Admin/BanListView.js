import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";


import axios from "axios";

import '../css/memberListView.scss'

function BanListView(props) {
    const location = useLocation()

    const [banList, setBanList] = useState([{}])
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [isEditing, setIsEditing] = useState(false);
    const [banUpdateMessage, setBanUpdateMessage] = useState('')

    const axiosLoading = props.axiosLoading

    useEffect(() => {
        setBanUpdateMessage('')
        setIsEditing(false)
        setBanList([{}])
        axiosLoading(getBanList)
    },[]);

    useEffect(() => {
        setBanUpdateMessage('')
        setIsEditing(false)
        setBanList([{}])
        axiosLoading(getBanList)
    }, [page]);

    const getBanList = async () => {
        const response = await axios.get(`/ban/list?page=${page}`);
        const maxPage = Math.floor(response.data.maxPage)

        setBanList(response.data.banList)
        setMaxPage(maxPage);
    }

    const updateBanInfo = async (index) => {
        if (banUpdateMessage === '밴 처리중') return
        setBanUpdateMessage('밴 처리중')
        const data = {targetId: banList[index].target, comment: banList[index].comment, remainDate: banList[index].remainDate}
        const res = await axios.post(`/ban/targetUpdate`, data);
        const success = res.data.success
        if (success) setBanUpdateMessage('밴 성공')
        else setBanUpdateMessage('밴 실패')

        setTimeout(() => setBanUpdateMessage('') , 5000)
    }

    return (
        <>
            <div className="banListView-container">
                {banUpdateMessage}
                <table className="adminListView-table">
                    <thead>
                    <tr>
                        <th><h1>target</h1></th>
                        <th><h1>type</h1></th>
                        <th><h1>comment</h1></th>
                        <th><h1>status</h1></th>
                        <th><h1>remainDate</h1></th>
                        <th><h1>createdAt</h1></th>
                        <th><h1>expireAt</h1></th>
                        <th><h1>update</h1></th>
                    </tr>
                    </thead>
                    <tbody>

                    {banList.length > 0 && banList.map((banInfo, index) => {
                        return (
                            <tr key={index}>
                                <td className="tdStyle">{banInfo.target}</td>
                                <td className="tdStyle">{banInfo.type}</td>
                                <td className="tdStyle">
                                    <input
                                        type="text"
                                        className="inputStyle"
                                        value={banInfo.comment}
                                        onChange={(e) => {
                                            const updatedBanList = [...banList];
                                            updatedBanList[index].comment = e.target.value;
                                            setBanList(updatedBanList);
                                        }}
                                    />
                                </td>
                                <td className="tdStyle">{banInfo.status}</td>
                                <td className="tdStyle">
                                    <select
                                        className="selectStyle"
                                        value={banInfo.remainDate}
                                        onChange={(e) => {
                                            const updatedBanList = [...banList];
                                            updatedBanList[index].remainDate = e.target.value;
                                            setBanList(updatedBanList);
                                        }}
                                    >
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="3">3</option>
                                        <option value="7">7</option>
                                        <option value="30">30</option>
                                        <option value="100000">100000</option>
                                    </select>
                                </td>
                                <td className="tdStyle">{banInfo.createdAt}</td>
                                <td className="tdStyle">{banInfo.expireAt}</td>
                                <td className="tdStyle">
                                    <button onClick={() => updateBanInfo(index)}>update</button>
                                </td>
                            </tr>
                        );
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

export default BanListView;