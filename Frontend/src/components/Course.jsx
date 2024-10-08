import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import { Link } from 'react-router-dom'
import axios from 'axios';

function Course() {

    const [book, setBook] = useState([]);
    useEffect(()=>{
        const getBook = async()=>{
            try {
                
                const res = await axios.get('http://localhost:4001/book');
                // console.log(res.data);
                setBook(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getBook();
    }, []);

    return (
        <>
            <div className='max-w-screen-2xl container mx-auto md:px-20 px-4'>
                <div className='mt-28 text-center'>
                    <h1 className='text-2xl md:text-4xl'>We're delighted to have you <span className='text-pink-500'>Here! :)</span></h1>

                    <p className='mt-12'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia fuga est exercitationem esse sint voluptatum molestiae eum? Asperiores, inventore molestiae porro placeat fuga voluptatibus? Blanditiis facere vero deleniti. Cupiditate eligendi possimus fugiat cumque a hic unde laborum recusandae iure eius rerum rem obcaecati, ratione non blanditiis officiis optio quo minus repudiandae. Iste illo et quae ipsum facilis? Quia, impedit optio.</p>

                    <Link to='/'>
                    <button className='bg-pink-500 text-white px-4 py-2 rounded-md mt-6 hover:bg-pink-800'>Back</button>
                    </Link>
                </div>

                <div className='mt-12 grid grid-cols-1 md:grid-cols-4'>
                    {book.map((item) =>(
                        <Cards key={item.id} item={item}/>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Course
