import React from 'react'

function contact() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='md:w-[50%] w-[90%] p-10 text-black'>
      <h1 className='text-3xl font-bold mb-5'>Contact Us</h1>
      <form action="" className='text-xl'>
        <label htmlFor="name">Name</label>
        <br />
        <input className='mb-4 p-1 w-[100%]' type="text" id='name' placeholder='Enter your name' />
        <br/>

        <label htmlFor="email">Email</label>
        <br />
        <input className='mb-4 p-1 w-[100%]' type="email" id='email' placeholder='Email address'/>
        <br />

        <label htmlFor='message'>Message</label>
        <br />
        <textarea id='message' placeholder='Type your message' className='w-[100%]'/>
        <br />

        <button className='bg-blue-500 text-white px-3 py-2 rounded-md mt-10' type='submit'>Submit</button>
      </form>
      </div>
    </div>
  )
}

export default contact
