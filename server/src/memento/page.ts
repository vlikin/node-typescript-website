import {inject, injectable} from "inversify";
import {BaseMemento, KeyObjDbContainer} from "../container/key-obj-db";
import {CType, IDynamicConfig} from "../declaration";

export interface IPageState {
  component: any,
  section: any,
}

@injectable()
export class PageMemento extends BaseMemento<IPageState> {
  constructor(
    @inject(CType.KeyObjDb)
    protected keyObjDbContainer: KeyObjDbContainer
  ) {
    super(keyObjDbContainer);
    this.key = 'memento.page';
  }
}