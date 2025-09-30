import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import BaseUrl from '../BaseUrl';

const AddBlog = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [user, setUser] = useState({
        title: '',
        message: '',
        cover_image: null,
    });

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            FetchData(id);
        }
    }, [searchParams]);

    const FetchData = (id) => {
        axios.get(`${BaseUrl}blogs/${id}`)
            .then(res => {
                // console.log("Fetched blog:", JSON.stringify(res.data, null, 2));
                if (res.data.status) {
                    setUser({
                        title: res.data.data.title,
                        message: res.data.data.message,
                        cover_image: null,
                    });
                } else {
                    setMessage(res.data.message || 'Failed to fetch blog');
                }
            })
            .catch(err => {
                console.error('Error fetching blog:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                setMessage('Failed to fetch blog data');
            });
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'cover_image') {
            setUser({ ...user, cover_image: files[0] });
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const submitHandle = (e) => {
        e.preventDefault();
        const id = searchParams.get('id');

        const formData = new FormData();
        formData.append('title', user.title.trim());
        formData.append('message', user.message.trim());
        if (user.cover_image) {
            formData.append('cover_image', user.cover_image);
        }
        if (id) {
            formData.append('_method', 'PUT');
        }

        // Log FormData for debugging
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            },
        };

        if (id) {
            axios.post(`${BaseUrl}blogs/${id}`, formData, config)
                .then(res => {
                    // console.log("Update response:", JSON.stringify(res.data, null, 2));
                    if (res.data.status) {
                        setMessage(res.data.message);
                        navigate('/view-blog');
                    } else {
                        setMessage(res.data.message || 'Failed to update blog');
                    }
                })
                .catch(err => {
                    console.error('Error updating blog:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                    setMessage(err.response?.data?.message || 'Failed to update blog');
                });
        } else {
            axios.post(`${BaseUrl}blogs`, formData, config)
                .then(res => {
                    // console.log("Create response:", JSON.stringify(res.data, null, 2));
                    if (res.data.status) {
                        setMessage(res.data.message);
                        navigate('/view-blog');
                    } else {
                        setMessage(res.data.message || 'Failed to create blog');
                    }
                })
                .catch(err => {
                    console.error('Error creating blog:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                    setMessage(err.response?.data?.message || 'Failed to create blog');
                });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl text-gray-800 text-center font-bold mb-6">
                    {searchParams.get('id') ? 'Edit Blog' : 'Add Blog'}
                </h2>
                {message && <p className="text-center text-red-500 mb-4">{message}</p>}
                <form className="space-y-4" onSubmit={submitHandle} encType="multipart/form-data">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 text-xl font-bold">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={user.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter blog title"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 text-xl font-bold">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={user.message}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter blog message"
                            rows="5"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cover_image" className="block text-gray-700 text-xl font-bold">Cover Image</label>
                        <input
                            type="file"
                            id="cover_image"
                            name="cover_image"
                            onChange={handleChange}
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                            className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 text-white text-xl font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                    <Link
                        to="/view-blog"
                        className="block w-full text-center bg-gray-500 text-white text-xl font-bold py-2 px-4 rounded-md mt-2 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        View Blogs
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;