import { ApiSwitchResponse} from "../types"
import { API_HOST } from "../config"

export const switchTree = async (status: string): Promise<[Error?, string?]> => {
    const formData = new FormData()
    formData.append('status', status)
    
    try{
        const res = await fetch( `${API_HOST}/api/trees`, {
            method: 'GET',
            body: formData
        })

        if(!res.ok){
            return [new Error(`Error switching tree: ${res.statusText}`)]
        }

        const json = await res.json() as ApiSwitchResponse
        return [undefined, json.data]
    } catch (error){
        if(error instanceof Error) return [error]
    }

    return [new Error('Unknown error')]
}