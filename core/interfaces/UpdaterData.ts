export interface ModuleItem {
  name: string
  size: string
  src: string
  version: string
}

export default interface UpdaterData {
  base_url: string
  modules: ModuleItem[]
  release_notes: { [ version: string ]: string }
}
