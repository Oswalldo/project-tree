export type Pair<T,U> = {key: T, value: U}

export interface ITree<K,V> {
    isEmpty(): boolean
    insert(key: any, value: any): void
    eliminar(key: K): V | null
    clean(): void
    search(key: K): V | null
    includes(key: K): boolean
    size(): number
    height(): number
    level(): number
    max(): K 
    min(): K 
    levelOrder(): Array<K>
    preOrder(): Array<K>
    postOrder(): Array<K>
    inOrder(): Array<K>
}
