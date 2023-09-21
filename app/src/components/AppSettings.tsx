import React, { SetStateAction, useState } from 'react'
import { FiSettings } from 'react-icons/fi'
import ClickAwayListener from 'react-click-away-listener';

type AppSettingsProps = {
    setIsEditing: React.Dispatch<SetStateAction<boolean>>
    setIsDeleting: React.Dispatch<SetStateAction<boolean>>
}

const AppSettings = ({setIsEditing, setIsDeleting}: AppSettingsProps) => {
    const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative inline-block text-left">
  <div>
  <button onClick={() => {setIsOpen(!isOpen)}} className='bg-white rounded-md shadow-md  text-xs p-1'><FiSettings/></button>
  </div> 
  {
    isOpen && <ClickAwayListener onClickAway={() => {setIsOpen(false)}}>
        <div className="absolute right-0 z-10 mt-1 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
    <div  role="none">
      <button onClick={() => {setIsEditing(true)}}  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100  duration-200 rounded-tr-md rounded-tl-md w-full" role="menuitem" tabIndex={-1} id="menu-item-0">Edit</button>
      <button onClick={() => {setIsDeleting(true)}}  className="text-[#FF7777] block px-4 py-2 text-sm hover:bg-gray-100  duration-200 rounded-bl-md rounded-br-md w-full" role="menuitem" tabIndex={-1} id="menu-item-1">Delete</button>
    </div>
  </div>
    </ClickAwayListener>
  }
</div>
  )
}

export default AppSettings
