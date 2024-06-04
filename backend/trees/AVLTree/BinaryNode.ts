export class BinaryNode<K, V>{
    private _key: K | null
    private _value: V | null
    private _left: BinaryNode<K,V> | null
    private _right: BinaryNode<K,V> | null

    constructor(key?: K, value?: V){
        if(key!== undefined && value !== undefined){
            this._key = key
            this._value = value
        }else{
            this._key = null
            this._value = null
        }
        this._left = null
        this._right = null
    }

    static isNonEmpty<K,V>(node: BinaryNode<K, V> | null): node is BinaryNode<K,V>{
        return node !== null && node.key !== null
    }
    
    isLeftEmpty(): boolean{
        return !BinaryNode.isNonEmpty(this.left)
    }

    isRightEmpty(): boolean{
        return !BinaryNode.isNonEmpty(this.right)
    }

    get left(): BinaryNode<K,V> | null {
        return this._left
    }

    set left(node: BinaryNode<K,V> | null){
        this._left = node
    }

    get right(): BinaryNode<K,V> | null {
        return this._right
    }

    set right(node: BinaryNode<K,V> | null){
        this._right = node
    }

    get key(): K | null {
        return this._key
    }

    set key(key: K | null){
        this._key = key
    }

    get value(): V | null {
        return this._value
    }

    set value(value: V | null){
        this._value = value
    }

    isLeaf(): boolean{
        return this.isLeftEmpty() && this.isRightEmpty()
    }
}