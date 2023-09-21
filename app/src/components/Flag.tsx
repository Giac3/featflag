import React, { SetStateAction, useRef, useState } from 'react'
import { TEnv, TFlag } from '../pages/ManageApp'
import AppSettings from './AppSettings'
import { useParams } from 'react-router'

const Flag = ({flag, setFlags}: {flag: TFlag, setFlags: React.Dispatch<SetStateAction<TFlag[]>>}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const {env} = useParams()
    const editNameRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const editReferenceRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const editDescRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>
    const environment: TEnv = env as TEnv
    const upadateFlag = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/flags/${flag.id}/${environment}`, {
                method: "PUT",
                credentials: "include"
            })
            const data = await res.json()
            if (data){
                return data
            }
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const handleSaveEdit = async () => {
        try {
            const newName = editNameRef.current.value
            const newDesc = editDescRef.current.value
            const newRef = editReferenceRef.current.value
            if (newName === "" || newDesc === "" || newRef === "") {
            return
            }

            try {
            const res = await fetch(`http://localhost:8080/api/flags/edit/${flag.id}`, {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({
                    name: newName,
                    description: newDesc,
                    reference: newRef,
                })
            })
            const data = await res.json()
            if (data && data.name && data.description && data.id){
                setFlags((prev) => {
                const newFlags = prev.map((prevFlag) => {
                    if (prevFlag.id === flag.id) {
                    return data
                    }
                    return prevFlag
                })
                return newFlags
                })
            }
            setIsEditing(false)
        } catch (error) {
            console.log(error)      
            setIsEditing(false)
        }
                } catch (error) {
                    console.log(error)
                    setIsEditing(false)
                }
    }


    const handleFlagChange = async (state: boolean) => {
        const data = await upadateFlag()
        if (data) {
            setFlags((prev) => {
                const clone = structuredClone(prev)
    
                const changedFlags = clone.map((prevFlag) => {
                    if (prevFlag.id === flag.id){
                        prevFlag[`${environment}_state`] = state
                        return prevFlag
                    }
                    return prevFlag
                })
    
                return changedFlags
            })
        }
    }
    const handleDelete = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/flags/${flag.app_id}/${flag.id}`, {
              method: "DELETE",
              credentials: "include",
          })
          const data = await res.json()
          if (data && data.status === "success"){
            setFlags((prev) => {
              const newApps = prev.filter(prevFlag => prevFlag.id !== flag.id)
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
    <div className='w-full max-w-[600px] h-44 rounded-md shadow-md'>
      
      {
        !isEditing && !isDeleting && <div className='p-4 flex flex-row gap-4 overflow-hidden max-w-[600px] h-40'>
        <div className='w-full h-full flex flex-col justify-between'>
          <div>
          <div className='flex justify-between items-center'>
          <h1 className=' font-LuckiestGuy text-lg'>{flag.name}</h1>
          
        <div className=' -mt-8 flex items-center justify-center gap-1'>
        <AppSettings setIsDeleting={setIsDeleting} setIsEditing={setIsEditing}/>
        <div className="bg-[#D9D9D9] w-6 h-6 rounded-full shadow-inner flex items-center justify-center z-10">
                  {
                      flag[`${environment}_state`] && <button onClick={() => {handleFlagChange(false)}} className="bg-[#88FF77] h-5 w-5 rounded-full shadow-md absolute"></button>
                  }
                  {
                      !flag[`${environment}_state`] && <button onClick={() => {handleFlagChange(true)}} className="bg-[#FF7777] h-5 w-5 rounded-full shadow-md absolute"></button>
                  }
              </div>
        </div>
        
          </div>
          <h1 className='text-sm bg-[#011727] p-1 mb-1 rounded-md text-white'>{flag.reference}</h1>
          <p className='bg-white text-sm rounded-md shadow-md p-2 overflow-hidden max-h-[60px] overflow-y-scroll mt-2'>{flag.description}</p>
          
          </div>
          <div className='w-full flex items-center gap-2 mt-3'>
          <p className=' font-bold text-xs rounded-md bg-white p-1'>Created: {new Date(flag.created).toDateString()}</p>
          <p className=' font-bold text-xs rounded-md bg-white p-1'>Last Changed: {new Date(flag.created).toDateString()}</p>
          </div>
        </div>
        </div>
      }
      {
        isEditing && <div className='w-full h-full flex items-center justify-center flex-col gap-2 px-8'>
          <input ref={editNameRef} defaultValue={flag.name} placeholder='Name' className=' outline-none rounded-md p-1 shadow-md w-full text-sm'/>
          <input ref={editReferenceRef} defaultValue={flag.reference} placeholder='Reference' className=' outline-none rounded-md p-1 shadow-md w-full text-sm'/>
          <textarea ref={editDescRef} defaultValue={flag.description} placeholder='Description' className=' outline-none rounded-md p-1 shadow-md w-full resize-none text-sm'/>
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
          <button onClick={handleDelete} className='p-2 rounded-md shadow-md bg-red-200 text-sm'>Delete</button>
          </div>
        </div>
      }
    </div>
  )
}

export default Flag
