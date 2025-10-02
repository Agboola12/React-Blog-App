import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import BaseUrl from '../BaseUrl';
import Navbar from './NavBar';

const AddBlog = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [user, setUser] = useState({
        title: '',
        message: '',
        cover_image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            FetchData(id);
        }
    }, [searchParams]);

    const FetchData = (id) => {
        axios.get(`${BaseUrl}blogs/${id}`)
            .then(res => {
                if (res.data.status) {
                    setUser({
                        title: res.data.data.title,
                        message: res.data.data.message,
                        cover_image: null,
                    });
                    if (res.data.data.cover_image) {
                        setImagePreview(res.data.data.cover_image);
                    }
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
            const file = files[0];
            setUser({ ...user, cover_image: file });
            setImagePreview(file ? URL.createObjectURL(file) : null);
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

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
            },
        };

        const request = id
            ? axios.post(`${BaseUrl}blogs/${id}`, formData, config)
            : axios.post(`${BaseUrl}blogs`, formData, config);

        request
            .then(res => {
                if (res.data.status) {
                    setMessage(res.data.message);
                    navigate('/view-blog');
                } else {
                    setMessage(res.data.message || 'Failed to ' + (id ? 'update' : 'create') + ' blog');
                }
            })
            .catch(err => {
                console.error('Error ' + (id ? 'updating' : 'creating') + ' blog:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                setMessage(err.response?.data?.message || 'Failed to ' + (id ? 'update' : 'create') + ' blog');
            });
    };

    return (
        <>
            <div className='head'>
                <Navbar />
                <p className='text-white text-[4em] font-bold py-14 uppercase text-center'>Blog App</p>
            </div>
            <div className="flex items-center justify-center min-h-screen bg-gray-200">
                <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                    <h2 className="text-3xl uppercase text-blue-800 text-center font-bold mb-6">
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
                            {imagePreview && (
                                <div className="mt-4">
                                    <p className="text-gray-600">Image Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Cover preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-white border-2 border-blue-800 text-blue-800 text-xl font-bold py-3 px-4 rounded-md hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddBlog;