import React, { ReactNode, useEffect, useState } from 'react'
import { makeGetRequest } from '../utils/makeGetRequest'
import Loader from './Loader'
import { Navigate } from 'react-router'
import { TUser } from '../context/AuthProvider'


const UnProtectedRoute = ({children}: {children: ReactNode}): ReactNode => {
  const [user, setUser] = useState<TUser | null>(null)
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

  if (user && !loading) {
    return <Navigate to={"/manage"} replace={true}/>
  }

  if (!user && !loading) {
    return children
  }

  if (loading) {
    return <Loader/>
  }

  return <Loader/>
}


export default UnProtectedRoute
