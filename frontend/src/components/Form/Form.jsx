import React, { useState } from 'react'
import './Form.css'
import axios from 'axios';

const Form = () => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('No file selected');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    function handleFile(event) {
        if (event.target.files.length === 0) {
            setFileName('No file selected');
            return;
        }
        event.preventDefault();
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
        setFileName(event.target.files[0].name);
    }

    

    const handleUpload = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("password", password);
        formData.append("file", file); 

        // const formData = {
        //     id: id,
        //     password: password,
        //     file: file
        // }
        
        // console.log(formData)

        axios.post(`http://localhost:5000/internshipApply`, formData)
        
        // fetch('http://localhost:5000/internshipApply', {
        //     method: 'POST',
        //     body: formData

        // }).then((response) => response.json()).then(
        //     (result) => {
        //         console.log('Success:', result)
        //     }
        // )
        // .catch(error => {
        //     console.error('Error:', error);
        // })
    }

    return (
        <div className='formContainer'>

            <div className="form-container">
                <div className="logo-container">
                    Welcome
                </div>

                <form className="form" onSubmit={handleUpload}>
                    
                    <div className="form-group">
                        <label >Email</label>
                        <input type="text" id="id" name="id" placeholder="Enter your Internshala ID" required="" onChange={(e) => setId(e.target.value)} />
                        <label >Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter your Internshala Password" required="" onChange={(e) => setPassword(e.target.value)}  />
                    </div>
                    <div className="container">
                        <div className="header">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
                                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> <p>Browse File to upload!</p>
                        </div>
                        <label htmlFor="file" className="footer">
                            <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg>
                            <p>{fileName}</p>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" strokeWidth="2"></path> <path d="M19.5 5H4.5" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" strokeWidth="2"></path> </g></svg>
                        </label>
                        {/* <input id="file" type="file" name="file" onChange={(e) => setFile(e.target.files[0])} /> */}
                        <input id="file" type="file" name="file" onChange={handleFile} />
                    </div>
                    <button className="form-submit-btn" type="submit">Apply</button>
                </form>

                {/* <p className="signup-link">
                    Don't have an account?
                    <a href="/" className="signup-link link"> Sign up now</a>
                </p> */}
            </div>
        </div>
    )
}

export default Form
