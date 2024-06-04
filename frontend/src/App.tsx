import { useState } from 'react'
import './App.css'
import { Toaster, toast } from 'sonner'
import { FileContext } from "./config"

import { uploadFile } from './services/upload'
import { type Data } from './types'
import { Search } from './steps/Search'

const APP_STATUS ={
  IDLE: 'IDLE',
  ERROR: 'ERROR',
  READY_UPLOAD: 'READY_UPLOAD',
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED'
}

const BOTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir Archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo...'
}

type AppStatusType = typeof APP_STATUS[keyof typeof APP_STATUS]

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  let myFile = undefined

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? []
    if (file) {
      setFile(file)
      myFile = file
      //setGlobalState("defultFile", file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(appStatus !== APP_STATUS.READY_UPLOAD || !file){
      return
    }

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFile(file)
    console.log(newData)
    if(err){
      setAppStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }

    setAppStatus(APP_STATUS.UPLOADED)
    if(newData) setData(newData)
    toast.success('Archivo subido correctamente')
  }

  const showBotton = appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  const showInput = appStatus !== APP_STATUS.UPLOADED

  return (
    <>
      <Toaster />
      <h3>BUSCADOR DE DATOS EN ARCHIVOS CSV</h3>

      {
        showInput && (
          <form onSubmit = {handleSubmit}>
            <label>
              <input 
                disabled={appStatus === APP_STATUS.UPLOADING}
                onChange={handleInputChange} 
                name="file" 
                type="file" 
                accept='.csv' 
              />
            </label>
            {
              showBotton && (
                <button disabled = {appStatus===APP_STATUS.UPLOADING}> 
                  {BOTTON_TEXT[appStatus]}
                </button>
              )
            }
          </form>
        )
      }

      {
        appStatus === APP_STATUS.UPLOADED && (
          <FileContext.Provider value={myFile}>
            <Search initialData = {data} />
          </FileContext.Provider>
        )
      }
    </>
  )
}

export default App
