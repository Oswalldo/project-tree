import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJason from 'convert-csv-to-json'
import { AVLTree } from './trees/AVLTree/AVLTree'
import { MwayTree } from './trees/BTree/MwayTree'
import { ITree, type Pair } from './trees/types'

const app = express()
const port = process.env.PORT ?? 3000

const storage = multer.memoryStorage()
const uploud = multer({ storage })

let userData: Array<Record<string, string>> = [] 
const TREE_STATUS ={
  USING_AVL: 'AVL-Tree',
  USING_B: 'M-way-Tree',
}
let treeStatus = TREE_STATUS.USING_AVL
let tree: ITree<unknown,unknown>  = new AVLTree()

app.use(cors()) // Enable Cors

app.post('/api/files', uploud.single('file'), async (req, res) => {
    // 1. Extract file from request
    const { file } = req
    // 2. Validate that we have file
    if(!file){
      return res.status(200).json({ message: 'ERROR: file is required'})
    }
    // 3. Validate the mimetype (csv)
    if(file.mimetype !== 'text/csv'){
      return res.status(200).json({ message: 'ERROR: file must be csv'})
    }
    
    let json: Array<Record<string,string>> = []
    try{
      // 4. Transform File (Buffer) to string
      const stringCSV = Buffer.from(file.buffer).toString('utf-8')
      // 5. Transform string (csv) to JSON
      json = csvToJason.fieldDelimiter(',').csvStringToJson(stringCSV)
    }catch (error) {
      return res.status(200).json({ message: 'Error parsing the file'})
    }

    // 6. Save the JSON to db
    userData = json
    // 7. Return 200 with the message and the JSON
    return res.status(200).json({ data: userData, message: 'File uploaded successfully'})
})

app.get('/api/trees', async (req, res) => {
    // 1. Extract boolean value from req
    const { status } = req.body
    try{
      // 2. Switching kind of tree
      treeStatus = status
    }catch(error){
      return res.status(200).json({ message: 'Error switching tree'})
    }

    return res.status(200).json({ data: treeStatus, message: 'Kind of tree switched successfully'})
})

app.get('/api/users', async (req, res) => {
    // 1. Extract the query param 'q' from the request
    const { q } = req.query
    // 2. Validate that we have the query param
    if(!q){
      return res.status(200).json({ message: 'ERROR: query param `q` is required'})
    }
    // 3. Validate that the query is a string
    if(Array.isArray(q)){
      return res.status(200).json({ message: 'ERROR: query param `q` must be a string'})
    }
    // 4. Filter the data from db with the query param
    const search = q.toString().toLowerCase()
    
    const toStrPair = (userData: Record<string, string>[]): Pair<string,string>[] =>{
      let arr:Pair<string,string>[] = []
      userData.forEach(user => {
          Object.entries(user).forEach(([key, value]) => {
              const index = arr.findIndex(item => item.key === value.toLowerCase())
              if (index !== -1) {
                  arr[index].value += `,${user.ID}`
              } else {
                  arr.push({ key: value.toLowerCase(), value: user.ID })
              }
          })
      })
      return arr
    }

    const toFilteredData = (str:string, userData: Record<string, string>[]): Record<string, string>[] =>{
      let arr = str.split(',')
      return userData.filter((user)=> arr.includes(user.ID))
    }
    
    let arr:Pair<string,string>[] = toStrPair(userData)
    tree = (treeStatus === TREE_STATUS.USING_AVL)? new AVLTree() : new MwayTree(4) 
    arr.forEach((x)=>{ tree.insert(x.key, x.value)})
    const resultSearch = tree.search(search)
    const filteredData = (typeof resultSearch === 'string')? toFilteredData(resultSearch,userData) : []
    // 5. Return 200 with the filtered data
    return res.status(200).json({ data: filteredData})
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})