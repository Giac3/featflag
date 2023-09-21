import  { Dispatch, SetStateAction, useState } from 'react'
import { HiEye } from 'react-icons/hi'
import { TiCancel, TiTick, TiTrash } from 'react-icons/ti'
import { FiCopy } from 'react-icons/fi'

export type APIKey = {
    user_id:string,
    app_id:string,
    key: string,
    id:string,
    environment: string
}

type props = {
    keyObject: APIKey
    setApiKeys: Dispatch<SetStateAction<APIKey[]>>
}

const ApiKeyItem = ({keyObject, setApiKeys}:props) => {
    const [isLooking, setIsLooking] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(keyObject.key);
    }

    const handleDeleteKey = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/keys/${keyObject.id}`, {
              method: "DELETE",
              credentials: "include"
            })
      
            const data = await res.json()
            
            if (data && data.status === "success") {
              setApiKeys((prev) => {
                const filtered = prev.filter(prevKey => prevKey.id !== keyObject.id)
                return filtered
              })
            }
          } catch (error) {
            console.log(error)
          }
    }

  return (
    <div className='w-full rounded-md shadow-custom2 h-10 mb-2 flex p-2 items-center justify-between gap-4'>
        <h1 className='text-black text-xs w-full bg-gray-200 p-2 shadow-inner rounded-md overflow-x-auto no-scrollbar  whitespace-nowrap'>{isLooking ? keyObject.key : `${keyObject.key.slice(0, 10)}.....${keyObject.key.slice(keyObject.key.length-5, keyObject.key.length)}`}</h1>
        {
            !isDeleting && <div className='h-full flex items-center justify-center gap-2'>
            <button onClick={handleCopy} className='h-full aspect-square shadow-custom2 rounded-md flex active:bg-green-400 items-center justify-center hover:bg-gray-600 hover:text-white duration-150 text-gray-600'>
                <FiCopy />    
                </button>
            <button onClick={() => {setIsLooking(!isLooking)}} className='h-full aspect-square shadow-custom2 rounded-md flex items-center justify-center hover:bg-black hover:text-white duration-150 text-black'>
                <HiEye />    
                </button>
                <button onClick={() => {setIsDeleting(true)}} className='h-full aspect-square shadow-custom2 rounded-md flex items-center justify-center duration-150 text-red-400 hover:bg-red-400 hover:text-white '>
                <TiTrash />
                </button>
                
            </div>
        }
        {
            isDeleting && <div className='h-full flex items-center justify-center gap-2'>
                <button onClick={() => {setIsDeleting(false)}} className='h-full aspect-square shadow-custom2 rounded-md flex items-center justify-center duration-150 text-red-400 hover:bg-red-400 hover:text-white '>
                <TiCancel />
                </button>
                <button onClick={handleDeleteKey} className='h-full aspect-square shadow-custom2 rounded-md flex active:bg-green-400 items-center justify-center hover:bg-gray-600 hover:text-white duration-150 text-gray-600'>
                <TiTick />    
                </button>
            </div>
        }
    </div>
  )
}

export default ApiKeyItem
