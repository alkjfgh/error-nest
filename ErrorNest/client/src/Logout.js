import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Logout = () => {
    const [cookies, removeCookie] = useCookies(['myCookie']);
    const navigate = useNavigate();

    useEffect(() => {
        removeCookie('myCookie');
        alert("로그아웃 되었습니다.");
        navigate('/document');
    }, []);
}

export default Logout;