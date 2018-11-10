import { injectable } from 'inversify'

@injectable()
export class FooService {
  get (start: number, count: number = 0): string {
    return 'get'
  }

  create (body: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return resolve()
    })
  }

  delete (id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return resolve()
    })
  }
}
