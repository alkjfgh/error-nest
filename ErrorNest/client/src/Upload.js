import React, {useEffect, useRef, useState} from 'react'
import axios from "axios"
import algoliasearch from "algoliasearch"
import {Link, useNavigate} from "react-router-dom"

const Upload = () => {
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

    const client  = algoliasearch('71RW9A7WPG', '00ceb7dfa83484290df56b46cdecde1d')
    const index = client.initIndex('document-title');

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
                const addClient = algoliasearch('71RW9A7WPG', '0bb48fee2961ce2138ef237912abd0df')
                const addIndex = addClient.initIndex('document-title')
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
                                    <button key={index} className={`search-result-item`} onMouseDown={() => handleCategoryClick(hit.title)}>
                                        {hit.title}
                                    </button>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button type="submit">업로드</button>
                </div>
            </form>
        </>
    )
}

export default Upload
