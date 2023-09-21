import React, { SetStateAction } from 'react'
import { TApp } from '../pages/Dashboard'
import AppOption from './AppOption'



const AppList = ({apps, setApps}: {apps: TApp[], setApps: React.Dispatch<SetStateAction<TApp[]>>}) => {
  return <div className='flex flex-col gap-4 items-center'>
    {
        apps.map((app, i) => {
            return <AppOption key={app.name + i} app={app} setApps={setApps}/>
          })
    }
  </div>
}

export default AppList
