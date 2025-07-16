import React from 'react'

import {Background, LoadingText} from './css/lodingStyle';

import Spinner from './img/Spinner-1s-200px.gif'

export const Loading = () => {
    return (
        <Background>
            <LoadingText>잠시만 기다려 주세요.</LoadingText>
            <img src={Spinner} alt="로딩중" width="5%" />
        </Background>
    )
}

export default Loading