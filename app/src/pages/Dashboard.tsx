import React, { useContext, useEffect, useRef, useState } from 'react'
import AppList from '../components/AppList'
import { makeGetRequest } from '../utils/makeGetRequest'
import {MdOutlineCancel} from 'react-icons/md'
import { AuthContext } from '../context/AuthProvider'
export type TApp = {
  id: string
  name: string,
  description: string,
  numFlags: string,
  created: Date,
  imgUrl: string
}

const Dashboard = () => {
  const [apps, setApps] = useState<TApp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewApp,setShowNewApp] = useState(false)

  const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const descRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>
  const {user} = useContext(AuthContext)

  useEffect(() => {
    (async () => {
      const data = await makeGetRequest("http://localhost:8080/api/apps")
      if (data) {
        setApps(data)
        setIsLoading(false)
        return
      }
    })()
  }, [])

  const handleNewApp = async () => {
    if (nameRef.current.value === "" || descRef.current.value === "" || !user?.id) {
      return 
    }
    try {
      const res = await fetch("http://localhost:8080/api/apps", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: nameRef.current.value,
          description: descRef.current.value,          
        })
      })

      const data = await res.json()
      if (data) {
        setApps(prev => [...prev, data])
      }
    } catch (error) {
      console.log(error)
      setShowNewApp(false)
    }

    setShowNewApp(false)
  }

  return (
    <div className='w-full h-screen bg-main flex'>
      <div className='flex flex-col gap-4 p-4 w-full'>
      <div className='flex items-center justify-between '>
      <h1 className='font-LuckiestGuy'>Your Apps</h1>
      <button onClick={() => {setShowNewApp(true)}} className='bg-green-100 rounded-md p-2 shadow-md hover:bg-green-200 duration-200'>New App</button>
      </div>
      <div className='w-full overflow-scroll pb-4 pt-4'>
      {
        apps.length > 0 && !isLoading && <AppList apps={apps} setApps={setApps}/> 
      }
      {
        apps.length === 0 && !isLoading &&  <h2>You have no apps yet</h2>
      }
      </div>
      </div>
      {
        showNewApp && <div className='absolute w-screen h-screen bg-black bg-opacity-20 flex items-center justify-center'>
        <div className='bg-main rounded-md shadow-md p-2 w-[300px] gap-2 flex flex-col'>
          <input ref={nameRef} placeholder='App name' className='h-10 outline-none rounded-md p-1 w-full'/>
          <textarea ref={descRef} placeholder='Description' className=' outline-none rounded-md p-1 w-full resize-none'/>
          <div className='flex items-center justify-between'>
            <button onClick={() => {setShowNewApp(false)}} className='bg-white p-2 rounded-md shadow-md'><MdOutlineCancel className="text-[#FF7777]"/></button>
            <button onClick={handleNewApp} className='p-2 rounded-md shadow-md bg-green-200'>Create</button>
          </div>
        </div>
      </div>
      }
    </div>
    
  )
}

export default Dashboard
