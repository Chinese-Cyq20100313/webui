import { readFileSync } from 'fs'
import { PackageJson } from '@koishijs/registry'
import { defineProperty } from 'koishi'

export interface LocalPackage extends PackageJson {
  private?: boolean
  $active?: boolean
  $workspace?: boolean
}

export function loadManifest(name: string) {
  const filename = require.resolve(name + '/package.json')
  const meta: LocalPackage = JSON.parse(readFileSync(filename, 'utf8'))
  meta.dependencies ||= {}
  defineProperty(meta, '$workspace', !filename.includes('node_modules'))
  defineProperty(meta, '$active', require.resolve(name) in require.cache)
  return meta
}
