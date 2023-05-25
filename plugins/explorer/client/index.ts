import { Context } from '@koishijs/client'
import {} from '@koishijs/plugin-explorer/src'
import FilePicker from './file-picker.vue'
import Layout from './index.vue'
import Status from './status.vue'
import Upload from './upload.vue'
import './icons'
import './editor'

import './editor.scss'

export default (ctx: Context) => {
  ctx.schema({
    type: 'string',
    role: 'path',
    component: FilePicker,
    validate: value => typeof value === 'string',
  })

  ctx.slot({
    type: 'global',
    component: Upload,
  })

  ctx.page({
    path: '/files/:name*',
    name: '资源管理器',
    icon: 'activity:explorer',
    order: 600,
    fields: ['explorer'],
    component: Layout,
  })

  ctx.slot({
    type: 'status-right',
    component: Status,
  })
}
