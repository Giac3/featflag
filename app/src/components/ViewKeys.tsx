import React, { SetStateAction, useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { FaDotCircle, FaPlus } from 'react-icons/fa'
import { TEnv } from '../pages/ManageApp'
import ApiKeyItem, { APIKey } from './ApiKeyItem'
import { useParams } from 'react-router'

type ViewKeysProps = {
    setShowApiKeys: React.Dispatch<SetStateAction<boolean>>
    keys: APIKey[]
    setKeys: React.Dispatch<SetStateAction<APIKey[]>>
}

const ViewKeys = ({setShowApiKeys, keys, setKeys}:ViewKeysProps) => {
    const [selectedEnv, setSelectedEnv] = useState<TEnv>("dev") 
    const [disabled, setDisabled] = useState(false)
    const {appId} = useParams()

    const handleCreateKey = async () => {
        setDisabled(true)
        
          try {
            const res = await fetch(`http://localhost:8080/api/keys/${appId}/${selectedEnv}`, {
              method: "POST",
              credentials: "include",
            })
      
            const data = await res.json()
            
            if (data) {
              setKeys(prev => [...prev, data])
            }
          } catch (error) {
            console.log(error)
          }
          setDisabled(false)
    }

    
  return (
    <div className='absolute w-screen h-screen bg-black bg-opacity-20 flex items-center justify-center'>
        <ClickAwayListener onClickAway={() => {setShowApiKeys(false)}}>
        <div className='bg-main rounded-md shadow-md p-2 w-[400px] gap-2 flex flex-col'>
                  <div className='flex items-center justify-between  rounded-md bg-white shadow-md'>
                    <button onClick={() => {setSelectedEnv("dev")}} className={`flex items-center justify-center ${selectedEnv === "dev" && "bg-gray-100"} w-full h-full gap-2 hover:bg-gray-100 duration-200 p-2 rounded-bl-md rounded-tl-md`}>
                    <FaDotCircle className="text-red-200"/>
                            dev
                    </button>
                    <button onClick={() => {setSelectedEnv("staging")}} className={`flex items-center justify-center ${selectedEnv === "staging" && "bg-gray-100"} w-full h-full gap-2 hover:bg-gray-100 duration-200 p-2`}>
                    <FaDotCircle className="text-orange-200"/>
                            staging
                    </button>
                    <button onClick={() => {setSelectedEnv("prod")}} className={`flex items-center justify-center ${selectedEnv === "prod" && "bg-gray-100"} w-full h-full gap-2 hover:bg-gray-100 duration-200 p-2 rounded-br-md rounded-tr-md`}>
                    <FaDotCircle className="text-green-200"/>
                            prod
                    </button>
                  </div>
                  <div className='bg-white shadow-inner p-2 rounded-md max-h-[200px] min-h-[40px]'>
                    {
                        keys.map((key, i) => {
                            return key.environment === selectedEnv ? <ApiKeyItem key={key.key+i} keyObject={key} setApiKeys={setKeys}/> : null
                        })
                    }
                  </div>
                  <div className='flex items-center justify-end'>
                    <button disabled={disabled} onClick={handleCreateKey} className='p-2 rounded-md bg-green-200 shadow-md text-black'><FaPlus/></button>
                  </div>
                </div>
        </ClickAwayListener>
      </div>
  )
}

export default ViewKeys
