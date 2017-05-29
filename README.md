# atom-quick-select

**Work in progress**

## Example: Simple

```JavaScript
'use babel';

import quickSelect from 'atom-quick-select';

const selection = await quickSelect(['One', 'Tow', 'Three'])
if (selection) {
  console.log('selection', selection)
}
```

![](https://raw.github.com/josa42/atom-quick-select/master/.github/screenshot-simple.png)

## Example: Detailed

```JavaScript
'use babel';

import quickSelect from 'atom-quick-select';

const selection = await quickSelect([
  { label: 'One', description: 'Number 1' },
  { label: 'Tow', description: 'Number 2' },
  { label: 'Three', description: 'Number 3' }
])
if (selection) {
  console.log('selection', selection)
}
```

![](https://raw.github.com/josa42/atom-quick-select/master/.github/screenshot-detailed.png)

## Example: Custom Normalization

```JavaScript
'use babel';

import quickSelect from 'atom-quick-select';

const selection = await quickSelect([
  { name: 'One' },
  { name: 'Tow' },
  { name: 'Three' }
], {
  normalizeItem: ({ name }) => { label: name }
})
if (selection) {
  console.log('selection', selection)
}
```

## Atom packages using this library

- [readme](https://atom.io/packages/readme)

## License

[The MIT License](LICENSE.md)
