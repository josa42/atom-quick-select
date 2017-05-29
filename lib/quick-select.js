'use babel'

import QuickSelectView from './quick-select-view'

export default function quicSelect (items, options = {}) {
  return new Promise((resolve) => {
    let active = true

    const select = new QuickSelectView(items, options, (selection) => {
      if (active) {
        resolve(selection)
      }

      // TODO: Move the active check into QuickSelectView
      active = false
      select.destroy()
    })

    select.show()
  })
}
