export default class Tab {
  public name: string
  public label: string
  public location: string
  public isActive: boolean = false
  public onClosing?: () => boolean|void

  constructor (name: string, label: string, location: string) {
    this.name = name
    this.label = label
    this.location = location
  }

  setIsActive (val: boolean): void {
    this.isActive = val
  }
}
