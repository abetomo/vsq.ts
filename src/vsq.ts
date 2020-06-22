import { existsSync, readFileSync, writeFileSync } from 'fs'

export interface VsqData {
  name: string,
  value: string[]
}

export class VerySimpleQueue {
  private data: VsqData
  private filePath: string

  _load (filePath: string): VsqData {
    if (existsSync(filePath)) {
      const vsqData: VsqData = JSON.parse(readFileSync(filePath).toString())
      if (vsqData.name !== 'VerySimpleQueue' || !Array.isArray(vsqData.value)) {
        throw new Error('not a data file of VerySimpleQueue')
      }
      return vsqData
    }
    const vsqData = {
      name: 'VerySimpleQueue',
      value: []
    }
    writeFileSync(filePath, JSON.stringify(vsqData))
    return vsqData
  }

  load (filePath: string): VsqData {
    this.data = this._load(filePath)
    this.filePath = filePath
    return this.data
  }

  size (): number {
    return this.data.value.length
  }

  shift (): string {
    if (this.size() === 0) return null
    const value = this.data.value.shift()
    writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  pop (): string {
    if (this.size() === 0) return null
    const value = this.data.value.pop()
    writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  unshift (data: string): number {
    this.data.value.unshift(data)
    writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }

  push (data: string): number {
    this.data.value.push(data)
    writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }
}
