import { useEffect, useState } from "react"
import { toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks'

import { type Data } from "../types"
import { searchData } from "../services/search"
import { switchTree } from "../services/switch"

const DEBOUNCE_TIME = 300

const TREE_STATUS ={
    USING_AVL: 'AVL-Tree',
    USING_B: 'M-way-Tree',
}

const BOTTON_AVL_TEXT = {
    [TREE_STATUS.USING_B]: 'Usar Arbol-AVL',
    [TREE_STATUS.USING_AVL]: 'Usando Arbol-AVL...'
}

const BOTTON_B_TEXT = {
    [TREE_STATUS.USING_AVL]: 'Usar Arbol-Mvias',
    [TREE_STATUS.USING_B]: 'Usando Arbol-M-vias...'
}

type TreeStatusType = typeof TREE_STATUS[keyof typeof TREE_STATUS]

export const Search = ({initialData}: {initialData: Data} ) => {
    const [treeStatus, setTreeStatus] = useState<TreeStatusType>(TREE_STATUS.USING_AVL)
    const [data, setData] = useState<Data>(initialData)
    const [search, setSearch] = useState<string>(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const debounceSearch = useDebounce(search, DEBOUNCE_TIME)
    
    const handleOnClik = () => {

        const newTreeStatus = treeStatus === TREE_STATUS.USING_AVL ? 
            TREE_STATUS.USING_B : 
            TREE_STATUS.USING_AVL;

        setTreeStatus(newTreeStatus);
    
        switchTree(newTreeStatus);
    
        console.log(`Tree switched: Using ${newTreeStatus}`); 
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const handleKeyDown = (event:any) => {
        //prevent fire enter key
        if (event.keyCode === 13) {
            event.preventDefault()
        }
    }

    useEffect(() => {
        const newPathname = debounceSearch === ''
        ? window.location.pathname
        : `?q=${debounceSearch}`

        window.history.replaceState({}, '', newPathname)
    },[debounceSearch])

    useEffect(() => {
        if(!debounceSearch){
            setData(initialData)
            return
        }
        
        searchData(debounceSearch)
            .then(response => {
                const [err, newData] = response
                if(err){
                    toast.error(err.message)
                    return
                }

                if(newData) setData(newData)
            })
    }, [debounceSearch, initialData])

    return (
        <div>
            <h1>BUSCADOR</h1>
            <form>
                <input 
                    onKeyDown={handleKeyDown}
                    onChange={handleSearch} 
                    type="search" 
                    placeholder="Buscar información..." 
                    defaultValue={search}
                />
            </form>
            
            <div style={{marginBottom: '10px'}}></div>

            <div style={{display: 'flex', gap: '10px'}}>

                <button 
                    disabled={treeStatus === TREE_STATUS.USING_AVL}
                    onClick={handleOnClik}>
                    {BOTTON_AVL_TEXT[treeStatus]}
                </button>

                <button 
                    disabled={treeStatus === TREE_STATUS.USING_B}
                    onClick={handleOnClik}>
                    {BOTTON_B_TEXT[treeStatus]}
                </button>

            </div>
            
            <ul>{
                data.map((row) => (
                    <li key={row.ID}>
                        <article>
                            {Object
                                .entries(row)
                                .map(([key, value]) => 
                                <p key={key}>
                                    <strong>{key}:</strong>{value}
                                </p>)
                            }
                        </article>
                    </li>
                ))
            }</ul>
        </div>
    )
}