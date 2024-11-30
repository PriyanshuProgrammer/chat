import {atom} from 'recoil'


export const view = atom({
    key:"atom",
    default:"home"
})

export const username = atom({
    key:"username",
    default:""
})

export const roomId = atom({
    key:"roomId",
    default:''
})

export const messages = atom({
    key:"messages",
    default:[]
})

export const hitclient = atom({
    key:"hitclient",
    default:0
})

