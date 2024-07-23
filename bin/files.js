import fs from 'node:fs/promises'
import path from 'node:path'

async function getMigrationNames() {
  const migrationNames = await fs.readdir(path.join(__dirname, './migrations'))
  return migrationNames.sort()
}


async function getMigrationSql(migrationName) {
  return fs.readFile(path.join(__dirname, './migrations', migrationName), {
    encoding: 'utf-8',
  })
}

export  {
  getMigrationNames,
  getMigrationSql,
}
