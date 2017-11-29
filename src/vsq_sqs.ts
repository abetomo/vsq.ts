import * as fs from 'fs'
import * as uuidv4 from 'uuid/v4'

interface VsqDataLikeSQS {
  name: string,
  value: object
}

export class VerySimpleQueueLikeSQS {
  private data: VsqDataLikeSQS
  private filePath: string

  _load (filePath: string): VsqDataLikeSQS {
    if (fs.existsSync(filePath)) {
      const vsqData: VsqDataLikeSQS = JSON.parse(fs.readFileSync(filePath).toString())
      if (
        vsqData.name !== 'VerySimpleQueueLikeSQS' ||
        Object.prototype.toString.call(vsqData.value) !== '[object Object]'
      ) {
        throw new Error('not a data file of VerySimpleQueueLikeSQS')
      }
      return vsqData
    }
    const vsqData: VsqDataLikeSQS = {
      name: 'VerySimpleQueueLikeSQS',
      value: {}
    }
    fs.writeFileSync(filePath, JSON.stringify(vsqData))
    return vsqData
  }

  load (filePath: string): VsqDataLikeSQS {
    this.data = this._load(filePath)
    this.filePath = filePath
    return this.data
  }

  size (): number {
    return Object.keys(this.data.value).length
  }

  id (): string {
    return `${parseInt(((new Date()).getTime() / 10000).toString())}-${uuidv4()}`
  }

  send (data: string): string {
    const id = this.id()
    this.data.value[id] = data
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return id
  }

  receive (): object {
    if (this.size() === 0) return null
    const key = Object.keys(this.data.value).sort()[0]
    return {
      id: key,
      body: this.data.value[key]
    }
  }

  delete (id: string): boolean {
    if (!this.data.value.hasOwnProperty(id)) return null
    const ret = delete this.data.value[id]
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
    return ret
  }
}
