import React, { useContext, useRef, useState } from 'react'
import {z} from 'zod'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthProvider'

const ZEmail = z.string().email()

const LogIn = () => {

    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const navigate = useNavigate()
    const [showErrorEmailMessage, setShowErrorEmailMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const {setUser} = useContext(AuthContext)

    const requestLogIn = async (email: string, password: string) => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await res.json()
            if (data && data.status === "success") {
                setUser(data.user)
                return true
            } else {
                return false
            }
        } catch (error) {
            return null
        }
    }

    const handleLogIn = async () => {
        const parsedEmail = ZEmail.safeParse(emailRef.current.value)
        
        if (!parsedEmail.success) {
            setShowErrorEmailMessage(true)
            emailRef.current.style.border = "1px solid #FF7777"
            setTimeout(() => {
                emailRef.current.style.border = ""
                setShowErrorEmailMessage(false)
            }, 1000);
            return
        }

        if (passwordRef.current.value === "") {
            passwordRef.current.style.border = "1px solid #FF7777"
            setTimeout(() => {
            passwordRef.current.style.border = ""
            }, 1000);
            return
        }
        
        try {
            setLoading(true)
            const loggedIn = await requestLogIn(emailRef.current.value, passwordRef.current.value)
            if (loggedIn) {
                navigate("/manage")
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
    <div className='w-full h-screen flex flex-col gap-10 bg-main p-12 items-center justify-center'>
      <h1 className=" font-LuckiestGuy text-6xl ">FeatFlag</h1>
      <div className='w-[400px] shadow-md p-8 rounded-md flex flex-col items-center gap-4'>
        {
            loading ? <Loader/> : <>
            <h1>Log In with your email and password</h1>
        <div className='w-full flex flex-col gap-1'>
        <input ref={emailRef} type='email' placeholder='Email' className='w-full rounded-md outline-none shadow-md bg-white h-10 p-2'/>
        {
            showErrorEmailMessage && <h1 className='text-xs ml-1 text-[#FF7777]'>Invalid Email</h1>
        }
        </div>
        <input ref={passwordRef} type='password' placeholder='Password' className='w-full rounded-md outline-none shadow-md bg-white h-10 p-2'/>
        <div className='w-full flex flex-col gap-1'>
        </div>
        <button onClick={handleLogIn} className='bg-green-200 rounded-md p-2 shadow-md'>Log In</button>
        <div>
            Don't have an account? <a href='/signup' className='p-1 text-xs bg-white rounded-md shadow-md'>Sign Up</a>
        </div>
        </>
        }
      </div>
    </div>
  )
}

export default LogIn
