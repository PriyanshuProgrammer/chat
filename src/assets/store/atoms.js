import { createContext } from 'react'
import {atom,selector} from 'recoil'

export  const server = atom({
    key:"server",
    default:selector({
        key:"serverjoin",
        get:async ({get})=>{
            const connection = await fetch("http://localhost:3000")
            return connection.json()
        }
    })
})
