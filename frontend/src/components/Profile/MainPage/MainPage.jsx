import React from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MainPage = ({ user }) => {

    const [loggedInUser] = useLoggedInUser();
    const [posts, setPosts] = useState([]);

    

    useEffect(() => {
        fetch(`http://localhost:5000/userPost?email=${user?.email}`)
            .then(res => res.json())
            .then(data => { 
                setPosts(data);
            })
    }, [posts, user?.email]);

    console.log(posts);
    const username = user?.username;
    

    return (
        <div>
            <div className='mainPage'>
                <h3>Your Applied Companies</h3>
                <h4 className='heading-4'>@{username}</h4>
                <table className="posts-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post._id}>
                                <td>{post.title}</td>
                                <td>{post.subtitle}</td>
                                <td>{post.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

             </div>
        </div>
    )
}

export default MainPage