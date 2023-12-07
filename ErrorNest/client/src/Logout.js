import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Logout = () => {
    const [, , removeCookie] = useCookies();
    const navigate = useNavigate();

    const logout = async () => {
        removeCookie('userid');
        removeCookie('username');
        alert("로그아웃 되었습니다.");
        navigate('/');
    }

    useEffect(() => {
        logout().then((r) => {})
    }, []);
}

export default Logout;