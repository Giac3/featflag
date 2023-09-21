import React, { SetStateAction, useRef, useState } from 'react'
import {  TApp } from '../pages/Dashboard'
import { Link } from 'react-router-dom'
import AppSettings from './AppSettings'

const AppOption = ({app, setApps}: {app: TApp, setApps: React.Dispatch<SetStateAction<TApp[]>>}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const editNameRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const editDescRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>

  const handleDeleteApp = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/apps/${app.id}`, {
          method: "DELETE",
          credentials: "include",
      })
      const data = await res.json()
      if (data && data.status === "success"){
        setApps((prev) => {
          const newApps = prev.filter(prevApp => prevApp.id !== app.id)
          return newApps
        })
      }
      setIsEditing(false)
  } catch (error) {
      console.log(error)      
      setIsEditing(false)
  }
  }
  const handleSaveEdit = async () => {
    const newName = editNameRef.current.value
    const newDesc = editDescRef.current.value
    if (newName === "" || newDesc === "") {
      return
    }

    try {
      const res = await fetch(`http://localhost:8080/api/apps/${app.id}`, {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            name: newName,
            description: newDesc,
          })
      })
      const data = await res.json()
      if (data && data.name && data.description && data.id){
        setApps((prev) => {
          const newApps = prev.map((prevApp) => {
            if (prevApp.id === app.id) {
              return data
            }
            return prevApp
          })
          return newApps
        })
      }
      setIsEditing(false)
  } catch (error) {
      console.log(error)      
      setIsEditing(false)
  }
  }

  return (
    <div className='w-full max-w-[600px] h-40 rounded-md shadow-md'>
      
      {
        !isEditing && !isDeleting && <div className='p-4 flex flex-row gap-4 overflow-hidden max-w-[600px] h-40'>
        <div className='h-full aspect-square rounded-md bg-gray-200 shadow-sm'>
          {
            app.imgUrl && <img src={app.imgUrl} className='w-full h-full rounded-md shadow-md'/>
          }
        </div>
        <div className='w-full h-full flex flex-col justify-between'>
          <div>
          <div className='flex justify-between items-center'>
          <h1 className=' font-LuckiestGuy text-lg'>{app.name}</h1>
          
        <div className=' -mt-8 flex items-center justify-center gap-1'>
        <AppSettings setIsDeleting={setIsDeleting} setIsEditing={setIsEditing}/>
          <Link to={`/manage/${app.id}/${app.name}/dev`} className='bg-green-200 rounded-md shadow-md text-xs p-1'>View</Link>
        </div>
        
          </div>
          <p className='bg-white rounded-md shadow-md p-2 overflow-hidden max-h-[60px] overflow-y-scroll'>{app.description}</p>
          </div>
          <p className=' font-bold text-xs'>Created: {new Date(app.created).toDateString()}</p>
        </div>
        </div>
      }
      {
        isEditing && <div className='w-full h-full flex items-center justify-center flex-col gap-2 px-8'>
          <input ref={editNameRef} defaultValue={app.name} placeholder='Name' className=' outline-none rounded-md p-1 shadow-md w-full'/>
          <textarea ref={editDescRef} defaultValue={app.description} placeholder='Description' className=' outline-none rounded-md p-1 shadow-md w-full resize-none'/>
          <div className='flex gap-2 w-full justify-between'>
          <button onClick={() => {setIsEditing(false)}} className='p-2 rounded-md shadow-md bg-white text-xs'>Cancel</button>
          <button onClick={handleSaveEdit} className='p-2 rounded-md shadow-md bg-green-200 text-xs'>Save</button>
          </div>
        </div>
      }
      {
        isDeleting && <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
          <h1 className=' text-lg font-LuckiestGuy'>Are you sure?</h1>
          <div className='flex gap-2 '>
          <button onClick={() => {setIsDeleting(false)}} className='p-2 rounded-md shadow-md bg-white text-sm'>Cancel</button>
          <button onClick={handleDeleteApp} className='p-2 rounded-md shadow-md bg-red-200 text-sm'>Delete</button>
          </div>
        </div>
      }
    </div>
  )
}

export default AppOption
