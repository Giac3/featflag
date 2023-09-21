import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import EnvSelect from '../components/EnvSelect'
import { useContext, useEffect, useRef, useState } from 'react'
import {AiFillFlag} from 'react-icons/ai'
import { MdOutlineCancel } from 'react-icons/md'
import FlagList from '../components/FlagList'
import { makeGetRequest } from '../utils/makeGetRequest'
import { AuthContext } from '../context/AuthProvider'
import { FaDotCircle } from 'react-icons/fa'
import { LuKeySquare } from 'react-icons/lu'
import ViewKeys from '../components/ViewKeys'
import { APIKey } from '../components/ApiKeyItem'

export type TEnv = "dev" | "staging" | "prod"

export type TFlag = {
    id: string
    name: string,
    environment: TEnv,
    description: string,
    reference: string,
    created: Date,
    changed: Date,
    dev_state: boolean
    staging_state: boolean
    prod_state: boolean
    app_id: string
}

const ManageApp = () => {
    const {appName, appId, env} = useParams()
    const [disabled, setDisabled] = useState(false)
    const [showNewFlag, setShowNewFlag] = useState(false)
    const {user} = useContext(AuthContext)
    const [flags, setFlags] = useState<TFlag[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [newFlagDevState, setNewFlagDevState] = useState(false)
    const [newFlagStagingState, setNewFlaStagingState] = useState(false)
    const [newFlagProdState, setNewFlagProdState] = useState(false)
    const [showApiKeys,setShowApiKeys] = useState(false)
    const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const referenceRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const descRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>
    const [keys, setKeys] = useState<APIKey[]>([])
    
    useEffect(() => {
      (async () => {
        const data = await makeGetRequest(`http://localhost:8080/api/flags/${appId}`) 
        if (data) {
          setFlags(data)
          setIsLoading(false)
          return
        }
      })()
    }, [])    

    useEffect(() => {
      (async () => {
        const data = await makeGetRequest(`http://localhost:8080/api/keys/${appId}`) 
        if (data) {
          setKeys(data)
          return
        }
      })()
    }, [])    
    const handleNewFlag = async () => {
      if (nameRef.current.value === "" || descRef.current.value === "" || referenceRef.current.value === "" || !user?.id) {
        return 
      }
      setDisabled(true)
      try {
        const res = await fetch(`http://localhost:8080/api/flags/${appId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: nameRef.current.value,
            description: descRef.current.value,
            reference: referenceRef.current.value,
            dev_state: newFlagDevState,
            staging_state: newFlagStagingState,
            prod_state: newFlagProdState,
          })
        })
  
        const data = await res.json()
        
        if (data && data.name) {
          setFlags(prev => [...prev, data])
        }
      } catch (error) {
        console.log(error)
      }
  
      setShowNewFlag(false)
      setDisabled(false)
    }

  return (
    <div className='w-full h-screen bg-main flex'>
      <div className='flex flex-col gap-4 p-4 w-full'>
      <div className='flex items-center justify-between '>
      <div className='flex items-center justify-center gap-4'>
      <h1 className='font-LuckiestGuy text-xl mt-3'>{appName}</h1>
      <EnvSelect  disabled={disabled}/>
      <button onClick={() => {setShowNewFlag(true)}} className="rounded-md bg-white py-1.5 pl-3 pr-3 gap-4 hover:bg-gray-200 duration-200  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6 cursor-pointer flex self-end items-center justify-between">
        <p>New flag</p>
        <AiFillFlag/>
        </button>
      </div>
      <div className='flex items-center justify-center gap-4'>
      <button onClick={() => {setShowApiKeys(true)}} className="rounded-md bg-white py-1.5 pl-3 pr-3 gap-4 hover:bg-gray-200 duration-200  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6 cursor-pointer flex self-end items-center justify-between">
        <p>Keys</p>
        <LuKeySquare/>
        </button>
      <Link to={"/manage"} className='bg-green-100 rounded-md p-2 shadow-md hover:bg-green-200 duration-200 text-sm'>All Apps</Link>
      </div>
      </div>
      <div className='w-full overflow-scroll pb-4 pt-4'>
      {
        flags.length > 0 && !isLoading && <FlagList flags={flags} setFlags={setFlags}/>
      }
      {
        flags.length === 0 && !isLoading &&  <h2>You have no flags for the {env} env</h2>
      }
      </div>
      </div>
      {
        showNewFlag && <div className='absolute w-screen h-screen bg-black bg-opacity-20 flex items-center justify-center'>
        <div className='bg-main rounded-md shadow-md p-2 w-[300px] gap-2 flex flex-col'>
          <input ref={nameRef} placeholder='Flag name' className='h-10 outline-none rounded-md p-1 w-full'/>
          <input ref={referenceRef} placeholder='Reference Name' className='h-10 outline-none rounded-md p-1 w-full'/>
          <textarea ref={descRef} placeholder='Flag Description' className=' outline-none rounded-md p-1 w-full resize-none'/>
          <div className='flex flex-col items-center justify-center'>
         <div onClick={() => {setNewFlagDevState(!newFlagDevState)}}  className="rounded-md bg-white py-1.5 pl-3 pr-3 gap-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6 cursor-pointer flex mt-2 items-center w-36 justify-between">
         <FaDotCircle className="text-red-200"/>
                    dev
         <div className="bg-[#D9D9D9] w-6 h-6 rounded-full shadow-inner flex items-center justify-center z-10">
          
                {
                    newFlagDevState && <button onClick={() => {setNewFlagDevState(false)}} className="bg-[#88FF77] h-5 w-5 rounded-full shadow-md absolute"></button>
                }
                {
                    !newFlagDevState && <button onClick={() => {setNewFlagDevState(true)}} className="bg-[#FF7777] h-5 w-5 rounded-full shadow-md absolute"></button>
                }
          </div>
         </div>
         <div onClick={() => {setNewFlaStagingState(!newFlagStagingState)}}  className="rounded-md bg-white py-1.5 pl-3 pr-3 gap-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6 cursor-pointer flex mt-2 items-center w-36 justify-between">
         <FaDotCircle className="text-orange-200"/>
                    staging
         <div className="bg-[#D9D9D9] w-6 h-6 rounded-full shadow-inner flex items-center justify-center z-10">
          
                {
                    newFlagStagingState && <button onClick={() => {setNewFlaStagingState(false)}} className="bg-[#88FF77] h-5 w-5 rounded-full shadow-md absolute"></button>
                }
                {
                    !newFlagStagingState && <button onClick={() => {setNewFlaStagingState(true)}} className="bg-[#FF7777] h-5 w-5 rounded-full shadow-md absolute"></button>
                }
          </div>
         </div>
         <div onClick={() => {setNewFlagProdState(!newFlagProdState)}}  className="rounded-md bg-white py-1.5 pl-3 pr-3 gap-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:text-sm sm:leading-6 cursor-pointer flex mt-2 items-center w-36 justify-between">
         <FaDotCircle className="text-green-200"/>
                    prod
         <div className="bg-[#D9D9D9] w-6 h-6 rounded-full shadow-inner flex items-center justify-center z-10">
          
                {
                    newFlagProdState && <button onClick={() => {setNewFlagProdState(false)}} className="bg-[#88FF77] h-5 w-5 rounded-full shadow-md absolute"></button>
                }
                {
                    !newFlagProdState && <button onClick={() => {setNewFlagProdState(true)}} className="bg-[#FF7777] h-5 w-5 rounded-full shadow-md absolute"></button>
                }
          </div>
         </div>   
         </div> 
          <div className='flex items-center justify-between'>
            <button onClick={() => {setShowNewFlag(false)}} className='bg-white p-2 rounded-md shadow-md'><MdOutlineCancel className="text-[#FF7777]"/></button>
            
            <button onClick={handleNewFlag} className='p-2 rounded-md shadow-md bg-green-200'>Create Flag</button>
          </div>
        </div>
      </div>
      }
      {
        showApiKeys &&<ViewKeys setShowApiKeys={setShowApiKeys} setKeys={setKeys} keys={keys}/>
      }
    </div>
  )
}

export default ManageApp
