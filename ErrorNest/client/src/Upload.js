import React, { useRef, useState } from 'react'
import axios from "axios"

const Upload = () => {
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('') // 선택된 파일명을 저장할 상태
    const [inputs, setInputs] = useState({ // 사용자가 입력한 파일 이름, 설명, 분류를 저장할 상태
        inputFileName: '',
        fileDes: '',
        category: ''
    })

    const handleButtonClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const fileUploadSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('file', fileInputRef.current.files[0]) // 파일 데이터 추가
        formData.append('fileName', inputs.inputFileName + '.' + fileName.split('.')[1]) // 그 외의 입력 데이터 추가
        formData.append('fileDes', inputs.fileDes)
        formData.append('category', inputs.category)

        console.log(formData.get('file'))
        console.log(formData.get('fileName'))
        console.log(formData.get('fileDes'))
        console.log(formData.get('category'))

        // 서버에 데이터 전송
        await axios.post("/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                category: inputs.category,
                fileName: inputs.inputFileName + '.' + fileName.split('.')[1],
                fileDes: inputs.fileDes,
            }
        }).then((res) => {
            console.log(res)
            //TODO algoria에도 올라가도록
        })
    }


    return (
        <>
            <h1>파일 올리기</h1>
            <form onSubmit={fileUploadSubmit}>
                <div>
                    <label htmlFor="fakeFileInput">파일 선택</label>
                    <div>
                        <input type="text" id="fakeFileInput" readOnly value={fileName}/>
                        <span>
                            <button type="button" onClick={handleButtonClick}>Select</button>
                        </span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept=".jpg,.png,.gif,.webp,.bmp,.svg,.ico"
                            name={"fileData"}
                            required={true}
                        />
                    </div>
                    <div>
                        <label htmlFor="fileName">파일 이름</label><br/>
                        <input type="text" name={"inputFileName"} value={inputs.inputFileName} onChange={handleChange} required={true}/>
                    </div>
                    <div>
                        <label htmlFor="fileDes">파일 설명</label><br/>
                        <textarea name={"fileDes"} value={inputs.fileDes} onChange={handleChange} required={true}></textarea>
                    </div>
                    <div>
                        <label htmlFor="category">분류</label><br/>
                        <input type="text" name={"category"} value={inputs.category} onChange={handleChange} required={true}/>
                    </div>
                    <button type="submit">업로드</button>
                </div>
            </form>
        </>
    )
}

export default Upload
