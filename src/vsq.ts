import * as fs from 'fs'

interface VsqData {
  name: string,
  value: Array<string>
}

export class VerySimpleQueue {
  private data: VsqData
  private filePath: string

  _load (filePath: string) {
    if (fs.existsSync(filePath)) {
      const vsqData: VsqData = JSON.parse(fs.readFileSync(filePath).toString())
      if (vsqData.name !== 'VerySimpleQueue' || !Array.isArray(vsqData.value)) {
        throw new Error('not a data file of VerySimpleQueue')
      }
      return vsqData
    }
    const vsqData = {
      name: 'VerySimpleQueue',
      value: []
    }
    fs.writeFileSync(filePath, JSON.stringify(vsqData))
    return vsqData
  }

  load (filePath: string) {
    this.data = this._load(filePath)
    this.filePath = filePath
    return this.data
  }

  size () {
    return this.data.value.length
  }

  shift () {
    if (this.size() === 0) return null
    const value = this.data.value.shift()
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  pop () {
    if (this.size() === 0) return null
    const value = this.data.value.pop()
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return value
  }

  unshift (data: string) {
    this.data.value.unshift(data)
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }

  push (data: string) {
    this.data.value.push(data)
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return this.size()
  }
}
