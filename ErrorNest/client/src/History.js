import React, { useState, useEffect } from "react";
import {Link, useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
import Aside from "./Aside";


const History = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')

    useEffect( () => {
        const this_url = location.pathname

    }, [location.pathname])

    return (
        <>
            <div className="container">
                <article>
                </article>
                <Aside></Aside>
            </div>
        </>
    )
}

export default History;