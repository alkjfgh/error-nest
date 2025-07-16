import React, {useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"

import "../css/upload.scss"

const Upload = (props) => {
    const navigate = useNavigate()

    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('') // 선택된 파일명을 저장할 상태
    const [inputs, setInputs] = useState({ // 사용자가 입력한 파일 이름, 설명, 분류를 저장할 상태
        inputFileName: '',
        fileDes: '',
        category: ''
    })
    const [hits, setHits] = useState([])
    const [showResults, setShowResults] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("")

    const index = props.algolia.index

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

        if(name === "category" && value !== ""){
            index
                .search(value)
                .then(({ hits }) => {
                    const filteredHits = hits.filter(hit => !hit.title.startsWith("파일:"))
                    setHits(filteredHits)
                    setShowResults(true)
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            setShowResults(false)
        }
    }

    const fileUploadSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('file', fileInputRef.current.files[0]) // 파일 데이터 추가
        formData.append('fileName', inputs.inputFileName + '.' + fileName.split('.')[1]) // 그 외의 입력 데이터 추가
        formData.append('fileDes', inputs.fileDes)
        formData.append('category', selectedCategory)

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
        }).then(async (res) => {
            if (res.data.success) {
                const addIndex = props.algolia.addIndex
                const fileName = "파일:" + res.data.fileName
                const existingObject = await addIndex.getObject(fileName).catch(() => null);

                if (existingObject === null) {  // 존재하지 않는 title인 경우에만 저장
                    const document = [
                        {
                            objectID: fileName,
                            title: fileName
                        }
                    ];

                    addIndex
                        .saveObjects(document)
                        .then(() => {
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }

                navigate('/document/' + fileName)
            }
            else{
                console.log('error')
            }
        })
    }

    const handleCategoryClick = (title) => {
        setInputs({
            ...inputs,
            category: title
        })
        setSelectedCategory(title)
        setShowResults(false)
    }

    const handleBlur = () => {
        setShowResults(false)
        if(!selectedCategory){
            setInputs({
                ...inputs,
                category: ''
            })
        }
    }

    return (
        <div className={'file-form-con'}>
            <h1>파일 올리기</h1>
            <div className="fileForm">
                <div className="form">
                    <form className="registerForm" onSubmit={fileUploadSubmit}>
                        <label htmlFor="fakeFileInput">파일 선택</label>
                        <input type="text" id="fakeFileInput" readOnly value={fileName}/>
                        <button type="button" onClick={handleButtonClick}>Select</button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                            accept=".jpg,.png,.gif,.webp,.bmp,.svg,.ico"
                            name={"fileData"}
                            required={true}
                        />

                        <label htmlFor="fileName">파일 이름</label><br/>
                        <input type="text" name={"inputFileName"} value={inputs.inputFileName}
                               onChange={handleChange} required={true}/>

                        <label htmlFor="fileDes">파일 설명</label><br/>
                        <textarea name={"fileDes"} value={inputs.fileDes} onChange={handleChange}
                                  required={true}></textarea>

                        <label htmlFor="category">분류</label><br/>
                        <input
                            type="text"
                            name={"category"}
                            value={inputs.category}
                            placeholder={selectedCategory || '분류'}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required={true}
                        />
                        {showResults && (
                            <ul className="search-results">
                                {hits.map((hit, index) => (
                                    <button key={index} className={`search-result-item`}
                                            onMouseDown={() => handleCategoryClick(hit.title)}>
                                        {hit.title}
                                    </button>
                                ))}
                            </ul>
                        )}
                        <button type="submit">업로드</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Upload
