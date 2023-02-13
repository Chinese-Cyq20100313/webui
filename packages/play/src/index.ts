import { makeArray } from '@koishijs/core'
import { MarketResult } from '@koishijs/registry'
import { Loader, unwrapExports } from '@koishijs/loader'

export * from '@koishijs/loader'

function resolveName(name: string) {
  if (name[0] === '@') {
    const [left, right] = name.split('/')
    return [`${left}/koishi-plugin-${right}`]
  } else {
    return [`@koishijs/plugin-${name}`, `koishi-plugin-${name}`]
  }
}

export default class BrowserLoader extends Loader {
  public envData = {}
  public config = { plugins: {} }
  private _initTask: Promise<void>

  private async prepare() {
    if (!process.env.KOISHI_REGISTRY) return
    const market: MarketResult = await fetch(process.env.KOISHI_REGISTRY + '/play.json').then(res => res.json())
    for (const object of market.objects) {
      this.cache[object.shortname] = `${process.env.KOISHI_REGISTRY}/modules/${object.name}/index.js`
    }
  }

  readConfig() {
    return {}
  }

  writeConfig() {
    this.app.emit('config')
  }

  async resolve(name: string) {
    await (this._initTask ||= this.prepare())
    return this.cache[name]
  }

  async resolvePlugin(name: string) {
    await (this._initTask ||= this.prepare())
    const urls = process.env.KOISHI_REGISTRY
      ? makeArray(this.cache[name])
      : resolveName(name).map(name => `/modules/${name}/index.js`)
    for (const url of urls) {
      try {
        return unwrapExports(await import(/* @vite-ignore */ url))
      } catch (err) {}
    }
    console.warn(`cannot resolve plugin ${name}`)
  }

  fullReload() {
    console.info('trigger full reload')
  }
}
