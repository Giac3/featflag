import React, { SetStateAction } from 'react'
import Flag from './Flag'
import { TFlag } from '../pages/ManageApp'


const FlagList = ({flags, setFlags}: {flags:TFlag[],setFlags: React.Dispatch<SetStateAction<TFlag[]>>}) => {
    return <div className='flex flex-col gap-4 items-center'>
    {
        flags.map((flag, i) => {
            return <Flag key={flag.name + i} flag={flag} setFlags={setFlags}/>
          })
    }
  </div>
}

export default FlagList
