import React, {useEffect, useState} from 'react';
import axios from "axios";

function Test(props) {
    const [tests, setTests] = useState([{}]);
    const [inputs, setInputs] = useState({
        id: '',
        pw: ''
    });
    const { id, pw, createAt } = inputs;
    useEffect(() => {
        return () => {
            getTests().then(r => {});
        }
    },[]);

    /** 유저 목록 조회 */
    const getTests = async () => {
        const response = await axios.get('/test');
        setTests(response.data.tests);
        console.log(response.data.tests);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = inputs;
        const response= await axios.post('/test/insert', data);
        console.log(response.data.success);
        if(response.data.success) getTests().then(r => {});
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                id: <input type="text" name="id" onChange={handleChange} required/>
                pw: <input type="text" name="pw" onChange={handleChange} required/>
                <button type="submit">insert</button>
            </form>
            <table>
                <tbody>
                <tr>
                    <th>id</th>
                    <th>password</th>
                    <th>createdAt</th>
                </tr>
                {tests && tests.map((test) => (
                    <tr>
                        <td>{test.id}</td>
                        <td>{test.pw}</td>
                        <td>{test.createdAt}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default Test;