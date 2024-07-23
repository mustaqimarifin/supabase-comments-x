#!/usr/bin/env node
/* eslint-disable node/prefer-global/process */
/* eslint-disable no-console */
import { Command } from 'commander'
import packageJson from '../package.json'
import { DbClient } from './db.js'
import {getMigrationNames, getMigrationSql} from './files.js'

const program = new Command()

program.version(packageJson.version)

program
  .command('run-migrations')
  .argument('<pg-connection-string>')
  .action(async (connectionUrl) => {
    const db = await DbClient(connectionUrl)

    await db.initMigrationsTable()

    console.log('\nRUNNING MIGRATIONS\n')

    const migrationNames = await getMigrationNames()

    let successful = true

    for (const migrationName of migrationNames) {
      try {
        const hasRun = await db.hasRunMigration(migrationName)
        if (hasRun) {
          console.log(`SKIPPING MIGRATION: ${migrationName}`)
        }
        else {
          console.log(`RUNNING MIGRATION: ${migrationName}`)
          const migrationSql = await getMigrationSql(migrationName)
          await db.runMigration(migrationName, migrationSql)
        }
      }
      catch (err) {
        console.error(`\nERROR RUNNING MIGRATION: ${migrationName}\n`)
        console.error(err)
        console.log('\nSKIPPING REMAINING MIGRATIONS\n')
        successful = false
        break
      }
    }
    await db.reloadSchema()
    if (successful) {
      console.log('\nMIGRATIONS APPLIED SUCCESSFULLY\n')
    }
    process.exit(0)
  })

program.parseAsync(process.argv)
