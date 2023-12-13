import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";


import axios from "axios";

import '../css/memberListView.scss'

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
            <div className="banListView-container">

                <table className="adminListView-table">
                    <thead>
                    <tr>
                        <th><h1>target</h1></th>
                        <th><h1>type</h1></th>
                        <th><h1>comment</h1></th>
                        <th><h1>comment</h1></th>
                        <th><h1>remainDate</h1></th>
                        <th><h1>createdAt</h1></th>
                        <th><h1>expireAt</h1></th>
                    </tr>
                    </thead>
                    <tbody>

                    {banList.length > 0 && banList.map((banInfo, index) => {
                        return (
                            <tr key={index}>
                                <td className="tdStyle">{banInfo.target}</td>
                                <td className="tdStyle">{banInfo.type}</td>
                                <td className="tdStyle">{banInfo.comment}</td>
                                <td className="tdStyle">{banInfo.status}</td>
                                <td className="tdStyle">{banInfo.remainDate}</td>
                                <td className="tdStyle">{banInfo.createdAt}</td>
                                <td className="tdStyle">{banInfo.expireAt}</td>
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
            </div>
        </>
    );
}

export default BanListView;