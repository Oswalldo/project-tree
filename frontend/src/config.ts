import {createContext} from 'react'

export const { VITE_API_HOST : API_HOST} = import.meta.env

export const FileContext = createContext<File | undefined>(undefined)
