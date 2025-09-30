import './index.css';
import { Route, Routes } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import AddBlog from './Component/addBlog';
import ViewBlog from './Component/blogView';
import BlogDetails from './Component/blogDetails';



const Routing = () => {
  return (

    <Router>
    <Routes>


      <Route path="/" element={<AddBlog />} />
      <Route path="/view-blog" element={<ViewBlog />} />
      <Route path="/blogs-details" element={<BlogDetails />} />

      </Routes>
      </Router>
  )
}

export default Routing