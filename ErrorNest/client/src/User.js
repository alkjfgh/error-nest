import React, {useEffect, useState} from 'react';
import axios from "axios";

function User(props) {
    const [users, setUsers] = useState([{}]);

    useEffect(() => {
        console.log("mount");
        return () => {
            getUsers().then(r => {});
            console.log("unmount")
        }
    },[]);

    const getUsers = async () => {
        const response = await axios.get('http://localhost:8000/user');
        console.log("====getUsers=====");
        setUsers(response.data.users);
    };

    const insertTest = async () => {
        // 데이터 직접 node.js에서 바꿔야 해서 일단 막음.
        // const response= await axios.get('http://localhost:8000/user/insert')
        // console.log('success: ' + response.data.success)
        // if(response.data.success) getUsers().then(r => {});
    };

    return (
        <>
            <button onClick={insertTest}>asd</button>
            <table>
                <tbody>
                    <tr>
                        <th>name</th>
                        <th>age</th>
                        <th>married</th>
                        <th>comment</th>
                        <th>createdAt</th>
                    </tr>
                    {users.map((user) => (
                        <tr>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.married ? '결혼' : '미혼'}</td>
                            <td>{user.comment}</td>
                            <td>{user.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default User;