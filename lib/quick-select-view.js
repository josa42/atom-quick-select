'use babel';

import path from 'path'
import SelectList from 'atom-select-list'
import fuzzaldrin from 'fuzzaldrin'

export default class QuickSelectView {

  constructor(items, options, doneCallback) {
    
    this.options = options
    this.doneCallback = doneCallback
    
    this.selectListView = new SelectList(Object.assign({}, options, {
      items,
      
      elementForItem: (item) => this.elementForItem(item),
      
      didChangeQuery() { console.log('didChangeQuery()', ...arguments) },
      
      didChangeSelection() { console.log('didChangeSelection()', ...arguments) },
      
      didConfirmSelection: (item) => this.doneCallback(item),
      didConfirmEmptySelection: () => { /* nothing for now */ },
      didCancelSelection: () => this.doneCallback(),
      
      filterKeyForItem: (item) => {
        if (typeof item === 'object') {
          return [item.label, item.description].filter(e => e).join(' ')
        }
        return item;
      },
      
      /*
      maxResults
      filter
      filterQuery
      query
      order
      emptyMessage
      errorMessage
      infoMessage
      loadingMessage
      loadingBadge
      itemsClassList
      */
    }))
    
    this.selectListView.element.classList.add('fuzzy-finder')
    
    document.body.appendChild(this.selectListView.element)
  }
  
  
  elementForItem(item) {
    if (typeof item === 'object', item.label) {
      return this.detailedElementForItem(item)
    }
    
    return this.simpleElementForItem(item)
  }
  
  detailedElementForItem({ label, description = ''}) {
    
    const filterQuery = this.selectListView ? this.selectListView.getFilterQuery() : ''
  
    const li = document.createElement('li')
    li.classList.add('two-lines')
    
    const primaryLine = document.createElement('div')
    primaryLine.classList.add('primary-line')
    // primaryLine.innerHTML = (label || '')
    primaryLine.appendChild(highlight(label, fuzzaldrin.match(label, filterQuery)))
    li.appendChild(primaryLine)

    const secondaryLine = document.createElement('div')
    secondaryLine.classList.add('secondary-line')
    // secondaryLine.innerHTML = (description || '')
    secondaryLine.appendChild(highlight(description, fuzzaldrin.match(description, filterQuery)))
    li.appendChild(secondaryLine)
    
    return li
  }

  simpleElementForItem(item) {
    const li = document.createElement('li')
    li.innerHTML = item
    return li
  }
  
  toggle () {
    if (this.panel && this.panel.isVisible()) {
      this.hide()
    } else {
      this.show()
    }
  }
  
  show () {
    this.previouslyFocusedElement = document.activeElement
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({item: this})
    }
    this.panel.show()
    this.selectListView.focus()
  }
  
  hide () {
    if (this.panel) {
      this.panel.hide()
    }
    
    this.selectListView.reset()

    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  destroy() {
    if (this.panel) {
      this.panel.destroy()
    }

    if (this.subscriptions) {
      this.subscriptions.dispose()
      this.subscriptions = null
    }

    return this.selectListView.destroy()
  }

  get element () {
    return this.selectListView.element
  }
}

function highlight (str, matches, offsetIndex = 0) {
  let lastIndex = 0
  let matchedChars = []
  const fragment = document.createDocumentFragment()
  for (let matchIndex of matches) {
    matchIndex -= offsetIndex
    // If marking up the basename, omit path matches
    if (matchIndex < 0) {
      continue
    }
    const unmatched = str.substring(lastIndex, matchIndex)
    if (unmatched) {
      if (matchedChars.length > 0) {
        const span = document.createElement('span')
        span.classList.add('character-match')
        span.textContent = matchedChars.join('')
        fragment.appendChild(span)
        matchedChars = []
      }

      fragment.appendChild(document.createTextNode(unmatched))
    }

    matchedChars.push(str[matchIndex])
    lastIndex = matchIndex + 1
  }

  if (matchedChars.length > 0) {
    const span = document.createElement('span')
    span.classList.add('character-match')
    span.textContent = matchedChars.join('')
    fragment.appendChild(span)
  }

  // Remaining characters are plain text
  fragment.appendChild(document.createTextNode(str.substring(lastIndex)))
  
  return fragment
}