import React from 'react'
import { TextInput, PasswordInput, Button } from '@mantine/core';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div style={{'backgroundColor': '#FFF2EF'}} className='md:py-8 py-6 px-4 min-h-screen flex justify-center items-center'>
      <form className="flex flex-col w-11/12 xs:w-10/12 sm:w-9/12 md:w-6/12 lg:w-5/12 xl:w-[40rem] items-center gap-5">
        <h1 className='font-bold'>Welcome to STC Metaverse!</h1>
        <TextInput
          placeholder="Enter your name"
          label="Name"
          withAsterisk
          className='w-full'
        />
        <TextInput
          placeholder="Enter your email address"
          label="Email Address"
          withAsterisk
          className='w-full'
        />
        <PasswordInput className='w-full' label="Password" placeholder='Enter your password' />
        <PasswordInput className='w-full' label="Confirm Password" placeholder='Gotta match' />
        <p className='text-xs -mt-4 self-end'>Forgot Password?</p>
        <Button className='w-4/12 max-w-[15rem] min-w-[9rem]' style={{'background':'#8A94F4'}}>
          Register
        </Button>
        <p className='text-sm'>Already have an account? <Link  to={"/login"}>Great, login!</Link></p>
      </form>
    </div>
  )
}
