import { ITree, Pair} from "../types.d"
import { MwayNode} from "./MwayNode"

export class MwayTree<K,V> implements ITree<K,V>{
    protected _root: MwayNode<K,V> | null
    private readonly order!: number

    constructor(order?: number){
        this._root = null
        if(order){
            if(order >= 3){
                this.order = order
            }else{
                throw new Error('The order must be either 3 or higher')
            }
        }else{
            this.order = 3
        }

    }

    set root(node: MwayNode<K,V> | null){
        this._root = node
    }

    get root(): MwayNode<K,V> | null{
        return this._root
    }

    isEmpty(): boolean{
        return !MwayNode.isNonEmpty(this.root)
    }

    insert(key?: K, value?: V): void{
        if(!key){
            throw new Error("Key can't be neither null nor undefined")
        }else if(!value){
            throw new Error("Value can't be neither null nor undefined")
        }else{
            this.root = this.insertCore(this.root, key, value)
        }
    }

    private insertCore(node: MwayNode<K,V> | null, key: K, value: V): MwayNode<K,V>{
        if(!MwayNode.isNonEmpty(node)){
            return new MwayNode(this.order, key, value)
        }else{
            for(let i=0; i < this.order - 1; i++){
                if(i >= node.elements.length){
                    node.setElement(key, value)
                    return node
                }else if(key < node.getElement(i).key){
                    if(node.elements.length < this.order-1){
                        node.setElement(key, value)
                    }else{
                        node.setChild(i, this.insertCore(node.getChild(i), key, value))
                    }
                    return node
                }else if(key === node.getElement(i).key){
                    node.getElement(i).value = value
                    return node
                }
            }
            node.setChild(this.order-1, this.insertCore(node.getChild(this.order-1),key,value))
            return node
        }
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
                for(let i=0; i < node!.elements.length; i++){
                    let currentKey: K = node!.getElement(i).key
                    if(key === currentKey){
                        return node!.getElement(i).value
                    }else if(key < currentKey){
                        node = node!.getChild(i)
                        break
                    }else if(i === node!.elements.length-1){
                        node = node!.getChild(i+1)
                    }
                }
            }while(MwayNode.isNonEmpty(node))
        }
        return value
    }

    levelOrder(): K[]{
        if(this.isEmpty()){
            return []
        }
        let order: K[] = []
        let queue = [this.root]
        do{
            let node = queue.shift()!
            node.elements.forEach((e) => {
                order.push(e.key)
            })
            node.children.forEach((child) => {
                if(MwayNode.isNonEmpty(child))
                    queue.push(child)
            })
        }while(queue.length > 0)
        return order
    }

    preOrder(): K[]{
        let order: K[] = []
        this.preOrderCore(this.root!, order)
        return order 
    }

    protected preOrderCore(node: MwayNode<K,V> | null, arr: K[]): void {
        if(!MwayNode.isNonEmpty(node)) return

        for(let i=0; i < this.order; i++){
            if(i < node.elements.length) 
                arr.push(node.getElement(i).key)

            this.preOrderCore(node.getChild(i), arr)
        }
    }

    postOrder(): K[]{
        let order: K[] = []
        this.postOrderCore(this.root!, order)
        return order 
    } 
    
    protected postOrderCore(node: MwayNode<K,V> | null, arr: K[]): void {
        if(!MwayNode.isNonEmpty(node)) return
        
        this.postOrderCore(node.getChild(0), arr)
        for(let i=0; i < node.elements.length; i++){
            this.postOrderCore(node.getChild(i+1), arr)
            arr.push(node.getElement(i).key)
        }
    }
    
    inOrder(): K[]{
        let order: K[] = []
        this.inOrderCore(this.root!, order)
        return order 
    } 

    protected inOrderCore(node: MwayNode<K,V> | null, arr: K[]): void {
        if(!MwayNode.isNonEmpty(node)) return

        for(let i=0; i < this.order; i++){
            this.inOrderCore(node.getChild(i), arr)
            if(i < node.elements.length)
                arr.push(node.getElement(i).key)   
        }
    }

    size(): number{
        let size = 0
        if(!this.isEmpty()){
            let stack: MwayNode<K,V>[] = [this.root!]
            do{
                let node = stack.pop()!
                size++
                node.children.forEach((child) => {
                    if(MwayNode.isNonEmpty(child))
                        stack.push(child)
                })
            }while(stack.length > 0)
        }
        return size
    }
    
    max(): K{
        if(this.isEmpty()){
            throw new Error('ERROR: This tree is empty')
        }
        let node = this.root
        let key = node!.getElement(0).key
        do{
            let length = node!.elements.length
            key = node!.getElement(length-1).key
            node = node!.getChild(length)
        }while(MwayNode.isNonEmpty(node))
        return key
    } 

    min(): K {
        if(this.isEmpty()){
            throw new Error('ERROR: This tree is empty')
        }
        let node = this.root
        let key = node!.getElement(0).key
        do{
            key = node!.getElement(0).key
            node = node!.getChild(0)
        }while(MwayNode.isNonEmpty(node))
        return key
    } 
    
    height(): number{
        return this.heightCore(this.root)
    }

    protected heightCore(node: MwayNode<K,V> | null): number{
        if(!node){
            return 0
        }
        let heightest = -1
        for(let i=0; i <= node.elements.length; i++){
            let height = this.heightCore(node.getChild(i))
            if(height > heightest) heightest = height
        }
        return heightest+1 
    }

    level(): number{
        return this.height()-1;
    }

    includes(key: K | null): boolean{
        return key !== null && this.search(key) !== null
    }

    clean(): void{
        this.root = null
    }
    /*METODOS PENDIENTES*/
    eliminar(key: K): V | null {
        const value = this.search(key);
        if(value){
            this.root = this.eliminarCore(this.root!, key)
        }
        return value
    }

    protected eliminarCore(node: MwayNode<K,V>, key: K): MwayNode<K,V> | null{
        for(let i=0; i < node.elements.length; i++){
            if(key < node.getElement(i).key){
                node.setChild(i, this.eliminarCore(node.getChild(i)!,key))
                return node
            }else if(key === node.getElement(i).key){
                if(!node.isNonLeaf()){
                    if(node.elements.length === 1){
                        return null
                    }else{
                        node.elements = node.elements.filter((e) => 
                            e.key !== key
                        )
                        return node
                    }
                }else{
                    if(node.children.slice().some(child => child !== null)){
                        return this.sucesor(node, i)
                    }else{
                        return this.predecesor(node, i)
                    }
                }
            }
        }
        node.setChild(this.order-1, this.eliminarCore(node.getChild(this.order-1)!, key))
        return node
    }

    private predecesor(node: MwayNode<K,V>, index: number): MwayNode<K,V>{
        let pair: Pair<K,V> = node.getElement(index)
        if(!MwayNode.isNonEmpty(node.getChild(index))){
            pair = node.getElement(index-1)
            node = this.predecesor(node, index-1)
        }else{
            let child = node.getChild(index)!
            while(MwayNode.isNonEmpty(child.getChild(child.elements.length))){
                child =  child.getChild(child.elements.length)!
            }
            pair = child.getElement(child.elements.length-1)
            this.eliminar(pair.key)
        }
        node.setElement(pair.key, pair.value, index)
        return node
    }

    private sucesor(node: MwayNode<K,V>, index: number): MwayNode<K,V>{
        let pair: Pair<K,V> | undefined
        if(!MwayNode.isNonEmpty(node.getChild(index+1))){
            pair = node.getElement(index+1)
            node = this.sucesor(node, index+1)
        }else{
            let child = node.getChild(index+1)!
            while(MwayNode.isNonEmpty(child.getChild(0))){
                child =  child.getChild(0)!
            }
            pair = child.getElement(0)
            this.eliminar(pair.key)
        }
        node.setElement(pair.key, pair.value, index)
        return node
    }

}