import Coller from './Coller'

export default class CollerGrp {
  public name: string
  public label: string
  public collers: Coller[] = []

  constructor (name: string, label: string) {
    this.name = name
    this.label = label
  }
}
