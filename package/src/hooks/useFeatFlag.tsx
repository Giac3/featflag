/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { FeatFlagContext } from "../context/FeatFlagProvider"


const useFeatFlag = (flagReference: string, defaultState: boolean, token: string) => {

    const [flagState, setFlagState] = useState(defaultState)
    const [loadingFlag, setLoadingFlag] = useState(true)

    const {flags, setFlags} = useContext(FeatFlagContext)

    useEffect(() => {
        if (Object.prototype.hasOwnProperty.call(flags, flagReference)) {
            setFlagState(flags[flagReference].current_state)
            setLoadingFlag(false)
        } else {
            (async () => {            
                try {
                    const res = await fetch(`http://localhost:8080/check/${flagReference}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    if (res.status - 400 >=0 && res.status - 400 <100) {
                        setFlagState(defaultState)
                        setLoadingFlag(false)
                        return
                    }
                    const data = await res.json()
    
                    if (data && data.valid) {
                        setFlagState(data.current_state)
                        setFlags((prev) => {
                            const clone = structuredClone(prev)
                            prev[flagReference] = {
                                current_state: data.current_state,
                                id: data.id
                            }
                            return clone
                        })
                        setLoadingFlag(false)
                    } else {
                        setFlagState(defaultState)
                        setLoadingFlag(false)
                        return
                    }
    
                } catch (error) {
                    console.log(error)
                    setFlagState(defaultState)
                    setLoadingFlag(false)
                    return
                }
            })()
        }
    }, [])

    return {
        flagState,
        loadingFlag
    }
}

export {useFeatFlag}