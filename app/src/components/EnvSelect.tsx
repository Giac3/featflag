import React, {  useState } from "react"
import ClickAwayListener from "react-click-away-listener"
import {FaDotCircle} from 'react-icons/fa'
import { useParams } from "react-router"
import { Link } from "react-router-dom"

type EnvSelectProps = {
    disabled: boolean
}

const EnvSelect = ({ disabled}: EnvSelectProps) => {
    const {appName, appId, env} = useParams()
    const [isOpen, setIsOpen] = useState(false)
    
  return (
    <div>
  <div className="relative mt-2">
    <button disabled={disabled} onClick={() => {setIsOpen(true)}} type="button" className="relative w-32 rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 cursor-pointer flex " aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
      <div className="flex gap-2 items-center justify-center">
        <FaDotCircle className={`${env === "dev" ? "text-red-200" : env === "staging" ? "text-orange-200" : "text-green-200"}`}/>
        {env}
      </div>
      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
        </svg>
      </span>
    </button>


    {
        isOpen && <ClickAwayListener onClickAway={() => {setIsOpen(false)}}>
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">

            <li  className="text-gray-900 relative cursor-default select-none" id="listbox-option-0" role="option">
            <Link onClick={() => {setIsOpen(false)}}  to={`/manage/${appId}/${appName}/dev`} className="flex gap-2 items-center justify-center  w-full py-2 pl-3 pr-9 hover:bg-gray-200 duration-200">
                    <FaDotCircle className="text-red-200"/>
                    dev
            </Link>
            </li>
            <li  className="text-gray-900 relative cursor-default select-none " id="listbox-option-0" role="option">
            <Link onClick={() => {setIsOpen(false)}} to={`/manage/${appId}/${appName}/staging`} className="flex gap-2 items-center justify-center  py-2 pl-3 pr-9 hover:bg-gray-200 duration-200">
                    <FaDotCircle className="text-orange-200"/>
                    staging
                    </Link>
            </li>
            <li className="text-gray-900 relative cursor-default select-none" id="listbox-option-0" role="option">
            <Link onClick={() => {setIsOpen(false)}} to={`/manage/${appId}/${appName}/prod`} className="flex gap-2 items-center justify-center py-2 pl-3 pr-9 hover:bg-gray-200 duration-200">
                    <FaDotCircle className="text-green-200"/>
                    prod
            </Link>
            </li>
            </ul>
        </ClickAwayListener>
    }
    </div>
    </div>
  )
}

export default EnvSelect
