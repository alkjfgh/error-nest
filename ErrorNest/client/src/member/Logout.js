import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Logout = () => {
    const [, , removeCookie] = useCookies();
    const navigate = useNavigate();

    const logout = async () => {
        await removeCookie('userid');
        await removeCookie('username');
        await removeCookie('userkey');
    }

    useEffect(() => {
        logout().then((r) => {
            alert("로그아웃 되었습니다.");
            navigate('/');})
    }, []);
}

export default Logout;