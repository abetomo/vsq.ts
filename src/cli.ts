
import { existsSync } from 'fs'
import * as path from 'path'
import * as program from 'commander'

import { VerySimpleQueue } from './vsq'
import { VerySimpleQueueLikeSQS } from './vsq_sqs'

const packageJson = existsSync(path.join(process.cwd(), 'package.json'))
  ? require(path.join(process.cwd(), 'package.json'))
  : {}
const vsq = new VerySimpleQueue()
const vsqLikeSqs = new VerySimpleQueueLikeSQS()

program
  .command('unshift')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((prg) => {
    if (prg.db == null || prg.value == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsq.load(prg.db)
    vsq.unshift(prg.value)
  })

program
  .command('push')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((prg) => {
    if (prg.db == null || prg.value == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsq.load(prg.db)
    vsq.push(prg.value)
  })

program
  .command('shift')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .action((prg) => {
    if (prg.db == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsq.load(prg.db)
    const value = vsq.shift()
    if (value != null) console.log(value)
  })

program
  .command('pop')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueue')
  .action((prg) => {
    if (prg.db == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsq.load(prg.db)
    const value = vsq.pop()
    if (value != null) console.log(value)
  })

program
  .command('send')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueueLikeSQS')
  .option('-v, --value [VALUE]', 'Data to be added (string)')
  .action((prg) => {
    if (prg.db == null || prg.value == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsqLikeSqs.load(prg.db)
    console.log(vsqLikeSqs.send(prg.value))
  })

program
  .command('receive')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueueLikeSQS')
  .action((prg) => {
    if (prg.db == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsqLikeSqs.load(prg.db)
    console.log(JSON.stringify(vsqLikeSqs.receive(), null, '  '))
  })

program
  .command('delete')
  .option('-d, --db [DB_FILE_PATH]', 'Path of DB file used by VerySimpleQueueLikeSQS')
  .option('-i, --id [DATA_ID]', 'Id of the data to delete')
  .action((prg) => {
    if (prg.db == null || prg.id == null) {
      prg.outputHelp()
      process.exit(255)
    }
    vsqLikeSqs.load(prg.db)
    console.log(vsqLikeSqs.delete(prg.id))
  })

program
  .version(packageJson.version)
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
  process.exit(255)
}
