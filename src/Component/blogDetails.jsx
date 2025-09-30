import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import BaseUrl from '../BaseUrl';
import Navbar from './NavBar';

const BlogDetails = () => {
    const [blog, setBlog] = useState(null);
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        FetchData();
    }, [searchParams]);

    const FetchData = () => {
        const id = searchParams.get('id');
        if (!id) {
            setError('No blog ID provided');
            return;
        }
        setIsLoading(true);
        axios
            .get(`${BaseUrl}blogs/${id}`)
            .then(res => {
                // console.log("Fetched blog details:", JSON.stringify(res.data, null, 2));
                if (res.data.status) {
                    setBlog(res.data.data);
                } else {
                    setError(res.data.message || 'Failed to fetch blog details');
                }
            })
            .catch(err => {
                console.error('Error fetching blog:', err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                setError('Failed to fetch blog details');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
                 {/* <div className='head'>
                <Navbar/>
                    <p className='text-white text-[4em] font-bold py-14 uppercase text-center'>Blog App</p>
        
                </div>
                 */}
        <div className="min-h-screen bg-gray-100">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <div className="py-12">
                    {error && <p className="text-center text-red-500 mb-4">{error}</p>}
                    {blog ? (
                        <div className="container mx-auto px-4">
                            <Link
                                to="/view-blog"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Go Back 
                            </Link>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {blog.cover_image ? (
                                    <img
                                        src={blog.cover_image}
                                        alt={blog.title}
                                        className="w-full h-96 object-cover rounded-md mb-6"
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${blog.cover_image}`);
                                            e.target.src = 'https://picsum.photos/800/600';
                                        }}
                                    />
                                ) : (
                                    <p className="text-gray-500 mb-6">No cover image</p>
                                )}
                                <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                                <p className="text-gray-700 mb-4">{blog.message}</p>
                                <p className="text-gray-500 text-sm italic">
                                    Published on {moment(blog.created_at).format("Do MMM, YYYY")} | Admin
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg text-gray-600">No blog found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        </>
    );
};

export default BlogDetails;
