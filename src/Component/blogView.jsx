import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import BaseUrl from "../BaseUrl";
import { SquarePen, Trash2, TriangleAlert } from "lucide-react";
import Navbar from "./NavBar";

const ViewBlog = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [blogIdToDelete, setBlogIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = () => {
        setIsLoading(true);
        axios
            .get(`${BaseUrl}blogs`)
            .then((res) => {
                if (res.data.status) {
                    const updatedBlogs = res.data.data.map((blog) => {
                        if (blog.cover_image && !blog.cover_image.startsWith('http')) {
                            blog.cover_image = `${BaseUrl.replace(/\/$/, '')}${blog.cover_image}`;
                        }
                        return blog;
                    });
                    setBlogs(updatedBlogs);
                } else {
                    setError(res.data.message || "Failed to fetch blogs");
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blogs:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                setError("Failed to fetch blogs");
                setIsLoading(false);
            });
    };

    const handleDelete = (id) => {
        setBlogIdToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = () => {
        axios
            .delete(`${BaseUrl}blogs/${blogIdToDelete}`)
            .then((res) => {
                if (res.data.status) {
                    setBlogs(blogs.filter((blog) => blog.id !== blogIdToDelete));
                    setError(res.data.message);
                } else {
                    setError(res.data.message || "Failed to delete blog");
                }
                setShowModal(false);
                setBlogIdToDelete(null);
            })
            .catch((err) => {
                console.error("Error deleting blog:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
                setError("Failed to delete blog");
                setShowModal(false);
                setBlogIdToDelete(null);
            });
    };

    const cancelDelete = () => {
        setShowModal(false);
        setBlogIdToDelete(null);
    };

    const handlePost = (id) => {
        navigate(`/blogs-details?id=${id}`);
    };

    return (
        <>
            <div className="head">
                <Navbar />
                <p className="text-white text-[4em] font-bold py-14 uppercase text-center">Blog App</p>
            </div>
            <div className="min-h-screen bg-gray-100">
                <div className="py-6">
                    <div className="container mx-auto px-4">
                        <h2 className="text-black text-4xl uppercase font-bold text-start py-5">Blogs</h2>
                        <div className="flex justify-center">
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    {error && <p className="text-center text-red-500 mb-4">{error}</p>}
                                    {blogs.length === 0 ? (
                                        <div className="flex flex-col pt-10 items-center justify-center">
                                            <p className="text-lg font-medium text-red-600 mb-4">Sorry, No Blogs Available at the Moment</p>
                                            <TriangleAlert size={30} className="text-red-500" />
                                        </div>
                                    ) : (
                                        <div>
                                            {blogs[0] && (
                                                <div className="mb-8">
                                                    <div
                                                        onClick={() => handlePost(blogs[0].id)}
                                                        className="cursor-pointer bg-white border-0 rounded-lg shadow-md"
                                                    >
                                                        <div className="flex flex-col md:flex-row items-center">
                                                            <div className="md:w-1/2">
                                                                {blogs[0].cover_image ? (
                                                                    <img
                                                                        src={blogs[0].cover_image}
                                                                        alt={blogs[0].title}
                                                                        className="w-100 h-60 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                                                        onError={(e) => {
                                                                            console.error(`Failed to load image: ${blogs[0].cover_image}`);
                                                                            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <p className="text-gray-500 p-4">No cover image</p>
                                                                )}
                                                            </div>
                                                            <div className="md:w-1/2 p-6">
                                                                <p className="text-red-700 text-2xl font-bold uppercase">Blogs</p>
                                                                <h1 className="text-xl font-semibold mb-2">{blogs[0].title}</h1>
                                                                <p className="text-gray-600 line-clamp-3">{blogs[0].message}</p>
                                                                <p className="text-gray-500 text-sm italic mt-2">
                                                                    Published on {moment(blogs[0].created_at).format("Do MMM, YYYY")} | Admin
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {blogs.map((post) => (
                                                    <div
                                                        key={post.id}
                                                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                                                    >
                                                        <div onClick={() => handlePost(post.id)} className="cursor-pointer">
                                                            {post.cover_image ? (
                                                                <img
                                                                    src={post.cover_image}
                                                                    alt={post.title}
                                                                    className="w-100 h-80 object-cover rounded-md mb-4"
                                                                    onError={(e) => {
                                                                        console.error(`Failed to load image: ${post.cover_image}`);
                                                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <p className="text-gray-500 mb-4">No cover image</p>
                                                            )}
                                                            <h4 className="text-xl font-semibold mb-2">{post.title}</h4>
                                                            <p className="text-gray-600 line-clamp-3">{post.message}</p>
                                                            <p className="text-gray-500 text-sm italic mt-2">
                                                                Published on {moment(post.created_at).format("Do MMM, YYYY")} | Admin
                                                            </p>
                                                        </div>
                                                        <div className="flex justify-between mt-4">
                                                            <Link
                                                                to={`/?id=${post.id}`}
                                                                className="text-blue-500 px-4 py-2 rounded-md hover:text-blue-600 flex items-center"
                                                            >
                                                                <SquarePen className="w-5 h-5 mr-2" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(post.id)}
                                                                className="text-red-500 px-4 py-2 rounded-md hover:text-red-600 flex items-center"
                                                            >
                                                                <Trash2 className="w-5 h-5 mr-2" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-6">
                            <Link
                                to="/"
                                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                            >
                                Add New Blog
                            </Link>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={cancelDelete}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ViewBlog;