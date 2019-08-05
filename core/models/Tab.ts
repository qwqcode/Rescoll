export default class Tab {
  public name?: string
  public location?: string
  public isActive: boolean = false

  constructor (name: string, location: string) {
    this.name = name
    this.location = location
  }

  setIsActive (val: boolean): void {
    this.isActive = val
  }
}
