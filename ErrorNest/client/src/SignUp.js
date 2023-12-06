import React, {useEffect, useState} from 'react';
import axios from "axios";

function SignUp(props) {
    const [members, setMembers] = useState([{}]);
    const [inputs, setInputs] = useState({
        id: '',
        pw: '',
        email: '',
        name: ''
    });
    const { id, pw, email, name} = inputs;
    useEffect(() => {
        return () => {
            getMembers().then(r => {});
        }
    },[]);

    /** 유저 목록 조회 */
    const getMembers = async () => {
        const response = await axios.get('/member');
        setMembers(response.data.members);
        console.log(response.data.members);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
        // console.log(inputs);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = inputs;
        // console.log(data);
        const response= await axios.post('/member/insert', data);
        console.log(response.data.success);
        if(response.data.success) getMembers().then(r => {});
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                name: <input type="test" name="name" onChange={handleChange} required/><br/>
                id: <input type="text" name="id" onChange={handleChange} required/><br/>
                pw: <input type="password" name="pw" onChange={handleChange} required/><br/>
                email: <input type="email" name="email" onChange={handleChange} required/><br/>
                <button type="submit">insert</button>
            </form>
            <table>
                <tbody>
                <tr>
                    <th>name</th>
                    <th>id</th>
                    <th>password</th>
                    <th>email</th>
                    <th>date</th>
                </tr>
                {members && members.map((member) => (
                    <tr>
                        <td>{member.name}</td>
                        <td>{member.id}</td>
                        <td>{member.pw}</td>
                        <td>{member.email}</td>
                        <td>{member.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default SignUp;