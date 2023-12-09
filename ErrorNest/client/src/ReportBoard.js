import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


const ReportBoard = (props) => {
    const axiosLoading = props.axiosLoading;
    const location = useLocation();

    const [url, setUrl] = useState("");
    const [uri, setUri] = useState("");

    const getReportBoard = () => {

    }

    useEffect(() => {
        const thisUrl = location.pathname;
        const thisUri = location.search;

        setUrl(thisUrl);
        setUri(thisUri);

    }, []);

    return (
        <>
            <h2>ReportBoard Page </h2>
            thisUrl: {url} <br/>
            thisUri: {uri} <br/>
        </>
    )
}

export default  ReportBoard;