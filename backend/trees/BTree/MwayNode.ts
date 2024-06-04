import {type Pair} from "../types.d"

export class MwayNode<K,V>{
    readonly MAX_CHILD: number
    elements: Pair<K,V>[]
    children: (MwayNode<K,V> | null)[]

    static isNonEmpty<K,V>(node: MwayNode<K,V> | null): node is MwayNode<K,V>{
        return node !== null && node.elements.length > 0
    }

    constructor(max_child: number, key?: K, value?:V){
        this.MAX_CHILD = max_child
        this.elements = []
        this.children = []
        for(let i=0; i < max_child; i++){
            this.children.push(null) 
        }
        if(key !== undefined && value !== undefined){
            this.elements.push({key: key, value: value})
        }
    }

    isNonLeaf(): boolean{
        return this.children.some((node) => node !== null)
    }

    setElement(newKey: K, newValue: V, index?: number): boolean {
        if(typeof index === 'number'){
            this.elements[index] = {key: newKey, value: newValue}
        }else{
            this.elements.push({key: newKey, value: newValue})
            this.elements.sort((a, b) => {
                const elementA = a.key
                const elementB = b.key

                if (elementA === elementB) {
                    return 0;
                } else {
                    return elementA < elementB ? -1 : 1;
                }
            })
        }
        return this.elements.length <= this.MAX_CHILD-1
    }

    getElement(index: number): Pair<K,V>{
        return this.elements[index]
    }

    setChild(index: number, node: MwayNode<K,V> | null): boolean{
        this.children[index] = node
        return this.children.length <= this.MAX_CHILD
    }

    getChild(index: number): MwayNode<K,V> | null{
        return this.children[index]
    }

}
