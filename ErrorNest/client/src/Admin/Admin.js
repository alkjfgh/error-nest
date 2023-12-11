import React, {useEffect, useState} from 'react';
import {useCookies} from "react-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Admin(props) {
    const [members, setMembers] = useState([{}]);
    const [cookies] = useCookies();
    const [level, setLevel] = useState("");
    const navigate = useNavigate();

    // ban 관련 추가 내용
    const [inputs, setInputs] = useState({
        comment: '',
        remainDate: 1,
    });
    const [banUpdateMessage, setBanUpdateMessage] = useState('')




    useEffect(() => {
        // return () => {
        //     getMembers().then(r => {});
        // }
        levelCheck().then((level) => {
            if(level === "admin") getMembers();
            else navigate("/");
            });
    },[]);


    const handleChange = (e) => {
        const {name, value}  = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    }

    const levelCheck = async () => {
        console.log("levelCheck들어옴");
        if(cookies.userid) {
            const res = await axios.post('/member/levelCheck', {userid: cookies.userid, username: cookies.username, userkey:cookies.userkey});
            return res.data.level
        }
        else return "";
        // console.log("level" + level);
    };

    /** 유저 목록 조회 */
    const getMembers = async () => {
        const response = await axios.get('/member/admin');
        // setMembers(response.data.members);
        // console.log(response.data.members);
        const formattedMembers = response.data.members.map((member) => ({
            ...member,
            date: new Date(member.date).toLocaleDateString().slice(0, -1) // 원하는 날짜 형식으로 변환
        }));
        setMembers(formattedMembers);
        console.log(formattedMembers);
    };



    const handleDelete = async (e) => {
        // alert(e.target.name);
        const data = await axios.delete('/member/delete', {data:{ id: e.target.name}})
            .then(()=>getMembers());
    }



    const banSubmit = async (e) => {
        const writer = e.target.id;
        const hashtag = e.target.name;
        if(banUpdateMessage === '밴 처리중') return
        setBanUpdateMessage('밴 처리중')
        // e.preventDefault();
        const data = {comment: inputs.comment, remainDate: inputs.remainDate}
        const res = await axios.post(`/ban/update/${writer}/${hashtag.split('#')[1]}`, data);
        const success = res.data.success
        if(success) setBanUpdateMessage('밴 성공')
        else setBanUpdateMessage('밴 실패')

    }


    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <th>name</th>
                        <th>hashtag</th>
                        <th>id</th>
                        <th>password</th>
                        <th>email</th>
                        <th>date</th>
                        <th>level</th>
                    </tr>
                    {members && members.map((member) => (
                        <tr>
                            <td>{member.name}</td>
                            <td>{member.hashtag}</td>
                            <td>{member.id}</td>
                            <td>{member.pw}</td>
                            <td>{member.email}</td>
                            <td>{member.date}</td>
                            <td>{member.level}</td> &nbsp;
                            <button type="button" name={member.id} onClick={handleDelete}>삭제</button>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/*밴 관리*/}
            <h1>ben manage</h1>
            <table>
                <tbody>
                <tr>
                    <th>name</th>
                    <th>hashtag</th>
                    <th>id</th>
                    <th>password</th>
                    <th>email</th>
                    <th>date</th>
                    <th>level</th>
                    <th>status</th>
                </tr>
                {members && members.map((member) => (
                    <tr>
                        {/*user 정보 가져오기*/}
                        <td>{member.name}</td>
                        <td>{member.hashtag}</td>
                        <td>{member.id}</td>
                        <td>{member.pw}</td>
                        <td>{member.email}</td>
                        <td>{member.date}</td>
                        <td>{member.level}</td> &nbsp;
                        <td></td>

                        {/*<form onSubmit={banSubmit}>*/}
                        벤 사유 : <input type="text" name="comment" onChange={handleChange}/>
                        <select onChange={handleChange} name="remainDate" >
                            <option value="1">1일</option>
                                <option value="3">3일</option>
                                <option value="7">7일</option>
                                <option value="30">30일</option>
                                <option value="100000">영구정지</option>
                        </select>
                        <button type="button" id={member.id} name={member.hashtag} onClick={banSubmit}>ban</button>

                    </tr>
                ))}
                </tbody>
            </table>

        </>
    );
}

export default Admin;