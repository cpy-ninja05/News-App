import React from 'react'
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Axios from 'axios';
const Home = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await Axios.get('http://localhost:3000/news/categories', { withCredentials: true });
                setSelectedCategories(response.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

  return (
    <>
        <Navbar />
        <div>Hello</div>



    </>
  )
}

export default Home
