import React, { ChangeEvent, useContext, useRef, useState } from 'react'
import {z} from 'zod'
import { AuthContext } from '../context/AuthProvider'

const ZEmail = z.string().email()

const SignUp = () => {

    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const confirmRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const [showConfirmMessage, setShowConfirmMessage] = useState(false)
    const [showErrorEmailMessage, setShowErrorEmailMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const {setUser} = useContext(AuthContext)
    const handleConfirm = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.value !== passwordRef.current.value) {
            confirmRef.current.style.border = "1px solid #FF7777"
            if (!showConfirmMessage) {
                setShowConfirmMessage(true)
            }
        }
        if (event.currentTarget.value === passwordRef.current.value) {
            confirmRef.current.style.border = "1px solid #88FF77"
            if (showConfirmMessage) {
                setShowConfirmMessage(false)
            }
        }

        if (event.currentTarget.value === "") {
            confirmRef.current.style.border = ""
            if (showConfirmMessage) {
                setShowConfirmMessage(false)
            }
        }
    }

    const requestSignUp = async (email: string, password: string) => {
        try {
            const res = await fetch("http://localhost:8080/api/auth/signup", {
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
            if (data && data.email) {
                setUser(data)
                return true
            } else {
                return false
            }
        } catch (error) {
            return null
        }
    }

    const handleSignUp = async () => {
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
        if (passwordRef.current.value !== "" && confirmRef.current.value === "") {
            confirmRef.current.style.border = "1px solid #FF7777"
            setTimeout(() => {
            confirmRef.current.style.border = ""
            }, 1000);
            return
        }
        
        try {
            setLoading(true)
            const signedUp = await requestSignUp(emailRef.current.value, passwordRef.current.value)
            if (signedUp) {
             setLoading(false)  
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-full h-screen flex flex-col gap-10 bg-main p-12 items-center justify-center'>
      <h1 className=" font-LuckiestGuy text-6xl ">FeatFlag</h1>
      <div className='w-[400px] shadow-md p-8 rounded-md flex flex-col items-center gap-4'>
        {
            loading ? null : <>
            <h1>Sign Up with your email and password</h1>
        <div className='w-full flex flex-col gap-1'>
        <input ref={emailRef} type='email' placeholder='Email' className='w-full rounded-md outline-none shadow-md bg-white h-10 p-2'/>
        {
            showErrorEmailMessage && <h1 className='text-xs ml-1 text-[#FF7777]'>Invalid Email</h1>
        }
        </div>
        <input ref={passwordRef} type='password' placeholder='Password' className='w-full rounded-md outline-none shadow-md bg-white h-10 p-2'/>
        <div className='w-full flex flex-col gap-1'>
        <input ref={confirmRef} onChange={handleConfirm} type='password' placeholder='Confirm' className='w-full rounded-md outline-none shadow-md bg-white h-10 p-2'/>
        {
            showConfirmMessage && <h1 className='text-xs ml-1 text-[#FF7777]'>Passwords must match</h1>
        }
        </div>
        <button onClick={handleSignUp} className='bg-green-200 rounded-md p-2 shadow-md'>Sign Up</button>
        <div>
            Already have an account? <a href='/login' className='p-1 text-xs bg-white rounded-md shadow-md'>Log In</a>
        </div>
        </>
        }
      </div>
    </div>
  )
}

export default SignUp
