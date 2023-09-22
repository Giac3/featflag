import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { makeGetRequest } from '../utils/makeGetRequest'
import Loader from './Loader'
import { Navigate } from 'react-router'
import { AuthContext } from '../context/AuthProvider'



const ProtectedRoute = ({children}: {children: ReactNode}): ReactNode => {
  
  const {user, setUser} = useContext(AuthContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
        const data = await makeGetRequest("http://localhost:8080/api/auth/validate")
        if (data && data.email) {
          setUser(data)
          setLoading(false)
          return
        } 
        setLoading(false)
        return
      })()
  }, [])

  if (!user && !loading) {
    return <Navigate to={"/login"} replace={true}/>
  }

  if (user && !loading) {
    return children
  }

  if (loading) {
    return <div className='w-screen h-screen bg-main flex items-center justify-center'>
      <Loader/>
    </div>
  }

  return <div className='w-screen h-screen bg-main flex items-center justify-center'>
  <Loader/>
</div>
}


export default ProtectedRoute
