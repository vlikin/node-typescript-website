

export interface IMemento<T> {
    save(obj: T): Promise<any>
    load(): Promise<T>
}

export class BaseMemento {

}