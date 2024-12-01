import { createContext } from 'react'
import {atom,selector} from 'recoil'

export  const server = atom({
    key:"server",
    default:selector({
        key:"serverjoin",
        get:async ({get})=>{
            const connection = await fetch("https://chatbackend-cdp3.onrender.com")
            return connection.json()
        }
    })
})
