import { BinaryTree } from "./BinaryTree"
import { BinaryNode } from "./BinaryNode"

export class AVLTree<K,V> extends BinaryTree<K,V>{
    private readonly MAX_DIFFERENCE: number = 1 
    private readonly MIN_DIFFERENCE: number = -1

    constructor(element?: BinaryNode<K,V>){
        super(element)
    }

    insert(key?: K, value?: V): void{
        if(!key){
            throw new Error("Key can't be neither null nor undefined")
        }else if(!value){
            throw new Error("Value can't be neither null nor undefined")
        }else{
            super.root = this.insertCore(key, value, this.root)
        }
    }

    protected insertCore(key: K, value: V, node: BinaryNode<K,V> | null): BinaryNode<K,V>{
        node = super.insertCore(key, value, node)
        return this.rebalance(node)
    }

    eliminar(key: K): V | null {
        const value = super.search(key);
        if(value){
            super.root = this.eliminarCore(this.root!, key)
        }
        return value
    }

    protected eliminarCore(node: BinaryNode<K,V>, key: K): BinaryNode<K,V> | null{
        let nodo = super.eliminarCore(node, key)
        if (!nodo) return null;
        return this.rebalance(nodo)
    }


    private difference(node: BinaryNode<K,V>): number {
        return super.heightCore(node.left)-super.heightCore(node.right)
    }

    private rebalance(node: BinaryNode<K,V>): BinaryNode<K,V>{
        let difference = this.difference(node)

        if(difference > this.MAX_DIFFERENCE){
            if(this.difference(node.left!) >= 0){
                return this.rotateRight(node)
            }else{
                node.left = this.rotateLeft(node.left!)
                return this.rotateRight(node)
            }
        }

        if(difference < this.MIN_DIFFERENCE){
            if(this.difference(node.right!) <= 0){
                return this.rotateLeft(node)
            }else{
                node.right = this.rotateRight(node.right!)
                return this.rotateLeft(node)
            }
        }

        return node
    }

    private rotateRight(node: BinaryNode<K,V>): BinaryNode<K,V>{
        let nodeAux = node.left!
        node.left = node.left!.right
        nodeAux.right = node
        return nodeAux
    }

    private rotateLeft(node: BinaryNode<K,V>): BinaryNode<K,V>{
        let nodeAux = node.right!
        node.right = node.right!.left
        nodeAux.left = node
        return nodeAux
    }
}