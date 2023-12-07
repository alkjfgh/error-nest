import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const ReportHistory = () => {

    const [cookies, setCookies] = useCookies();


    useEffect(() => {

    }, []);

    const posts = [
        { id: 1, title: '첫 번째 글' },
        { id: 2, title: '두 번째 글' },
        { id: 3, title: '세 번째 글' },
        // ... 필요한 만큼 데이터 추가
    ];

    return (
        <div>
            <h2>신고 목록</h2>
            <ul>

                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default ReportHistory;