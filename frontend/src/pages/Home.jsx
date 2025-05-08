import React from 'react'
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Axios from 'axios';
import NewsSection from '../components/NewsSection.jsx';
const Home = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await Axios.get('http://localhost:3000/news/categories', { withCredentials: true });
                setSelectedCategories(response.data);
                console.log(response.data);
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
        {console.log(selectedCategories)}
        {selectedCategories.map((category) => (
            <NewsSection key={category} category={category} apiKey={import.meta.env.VITE_API_KEY} title={category.toUpperCase()} />
        ))}


    </>
  )
}

export default Home
