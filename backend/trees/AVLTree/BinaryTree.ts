import { ITree , type Pair} from "../types.d"
import { BinaryNode} from "./BinaryNode"

export class BinaryTree<K,V> implements ITree<K,V>{
    protected _root: BinaryNode<K,V> | null

    constructor(element?: Pair<K,V>[] | BinaryNode<K,V>, isPostOrden?: boolean){
        this._root = null
        if(element){
            if(element instanceof BinaryNode){
                this.root = element
            }else if(typeof isPostOrden === 'boolean'){
                this.listNonInOrdenToArbol(element, isPostOrden)
            }
        }
    }

    isEmpty(): boolean{
        return !BinaryNode.isNonEmpty(this.root)
    }

    private listNonInOrdenToArbol(arr: Pair<K,V>[], isPostOrden: boolean): void{
        if(arr.length > 0){    
            const pair: Pair<K,V> = (isPostOrden)? arr.pop()!: arr.shift()!
            this.insert(pair.key, pair.value)
            const left = arr.filter((e) => e.key < pair.key)
            const right = arr.filter((e) => e.key > pair.key)
            this.listNonInOrdenToArbol(left, isPostOrden)
            this.listNonInOrdenToArbol(right, isPostOrden)
        }
    }

    insert(key?: K, value?: V): void{
        if(!key){
            throw new Error("Key can't be neither null nor undefined")
        }else if(!value){
            throw new Error("Value can't be neither null nor undefined")
        }else{
            this.root = this.insertCore(key, value, this.root)
        }
    }

    protected insertCore(key: K, value: V, node:BinaryNode<K,V> | null): BinaryNode<K,V>{
        if(!BinaryNode.isNonEmpty(node)){
            return new BinaryNode(key,value);
        }else if(key < node.key!){ 
            node.left = this.insertCore(key, value, node.left)
        }else if(key > node.key!){ 
            node.right = this.insertCore(key, value, node.right)
        }else{
            node.value = value
        }
        return node
    }

    eliminar(key: K): V | null {
        const value = this.search(key);
        if(value){
            this.root = this.eliminarCore(this.root!, key)
        }
        return value
    }

    protected eliminarCore(node: BinaryNode<K,V>, key: K): BinaryNode<K,V> | null{
        if(key < node.key!){
            node.left = this.eliminarCore(node.left!, key)
            
        }else if(key > node.key!){
            node.right = this.eliminarCore(node.right!, key)
        }else{
            if(node.isLeaf()){
                return null
            }
            else if(!node.isRightEmpty() && !node.isLeftEmpty()){
                let nodoAux: BinaryNode<K,V> = node.right!
                while(!nodoAux.isLeftEmpty()){
                    nodoAux = nodoAux.left!
                }
                this.eliminar(nodoAux.key!)
                node.key = nodoAux.key
                node.value = nodoAux.value
            }else{
                return (node.isLeftEmpty())? node.right : node.left
            }
        }
        return node
    }

    search(key: K | null): V | null{
        let value: any = null
        if(!key){
            throw new Error(`ERROR: Key can't be neither null nor undefined`)
        }else if (this.isEmpty()){
            throw new Error(`ERROR: tree is empty`)
        }else{
            let node = this.root
            do{
                let currentKey: K = node!.key!
                if(key < currentKey){
                    node = node!.left
                }else if(key > currentKey){
                    node = node!.right
                }else{
                    value = node!.value!
                    break
                }
            }while(BinaryNode.isNonEmpty(node))
        }
        return value
    }

    size(): number{
        let size = 0
        if(!this.isEmpty()){
            let stack = [this.root]
            do{
                let node = stack.pop()!
                size++
                if(!node.isRightEmpty()){
                    stack.push(node.right)
                }
                if(!node.isLeftEmpty()){
                    stack.push(node.left)
                }
            }while(stack.length > 0)
        }
        return size
    }

    height(): number{
        return this.heightCore(this.root)
    }

    protected heightCore(node: BinaryNode<K,V> | null): number{
        if(!node){
            return 0
        }
        const left = this.heightCore(node.left)
        const right = this.heightCore(node.right)
        return (left > right)? left+1: right+1
    }

    level(): number{
        return this.levelCore(this.root)
    }

    protected levelCore(node: BinaryNode<K,V> | null): number{
        if(!node){
            return -1
        }
        const left = this.levelCore(node.left)
        const right = this.levelCore(node.right)
        return (left > right)? left+1: right+1
    }

    min(): K {
        let node = this.root
        if(!BinaryNode.isNonEmpty(node)){
            throw new Error('ERROR: tree is empty')
        }
        while(!node.isLeftEmpty()){
            node = node.left!
        }
        return node.key!
    }

    max(): K {
        let node = this.root
        if(!BinaryNode.isNonEmpty(node)){
            throw new Error('ERROR: tree is empty')
        }
        while(!node.isRightEmpty()){
            node = node.right!
        }
        return node.key!
    }

    
    levelOrder(): K[]{
        if(this.isEmpty()){
            return []
        }
        let order: K[] = []
        let queue = [this.root]
        do{
            let node = queue.shift()!
            order.push(node.key!)
            if(!node.isLeftEmpty()){
                queue.push(node.left)
            }
            if(!node.isRightEmpty()){
                queue.push(node.right)
            }
        }while(queue.length > 0)
        return order
    }


    postOrder(): K[]{
        let order: K[] = []
        if(!this.isEmpty()){
            this.postOrderCore(this.root!, order)
        }
        return order 
    }
    
    postOrderCore(node: BinaryNode<K,V>, arr: K[]): void{
        if(!node.isLeftEmpty()){
            this.postOrderCore(node.left!, arr)
        }
        if(!node.isRightEmpty()){
            this.postOrderCore(node.right!, arr)
        }
        arr.push(node.key!)
    }
    
    preOrder(): K[]{
        let order: K[] = []
        if(!this.isEmpty()){
            this.preOrderCore(this.root!, order)
        }
        return order 
    }
    
    preOrderCore(node: BinaryNode<K,V>, arr: K[]): void{
        arr.push(node.key!)
        if(!node.isLeftEmpty()){
            this.preOrderCore(node.left!, arr)
        }
        if(!node.isRightEmpty()){
            this.preOrderCore(node.right!, arr)
        }
    }
    
    inOrder(): K[]{
        let order: K[] = []
        if(!this.isEmpty()){
            this.inOrderCore(this.root!, order)
        }
        return order 
    }
    
    inOrderCore(node: BinaryNode<K,V>, arr: K[]): void{
        if(!node.isLeftEmpty()){
            this.inOrderCore(node.left!, arr)
        }
        arr.push(node.key!)
        if(!node.isRightEmpty()){
            this.inOrderCore(node.right!, arr)
        }
    }
    
    clean(): void{
        this.root = null
    }
    
    includes(key: K | null): boolean{
        return key !== null && this.search(key) !== null
    }
    
    set root(node: BinaryNode<K,V> | null){
        this._root = node
    }
    
    get root(): BinaryNode<K,V> | null{
        return this._root
    }
    
}