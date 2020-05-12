### INSTALL

```
npm install pure-drag
```

or

```
yarn add pure-drag
```

<br>

### USAGE
css
```css
#dragparent {
    position: relative;
    width: 500px;
    height: 500px;
    border: 1px solid red
}
#dragson {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: blue;
}
```

html
```html
<div id="dragparent">
    <div id="dragson"></div>
</div>
```

js


Drag at the parent
```javascript
import Drag from 'pure-drag'

let dragParent = document.getElementById('dragparent'),
    dragSon = document.getElementById('dragson')

new Drag({
    parent: dragParent,
    dragEle: dragSon
})
```

Global drag
```javascript
import Drag from 'pure-drag'
new Drag({
    dragEle: document.getElementById('dragson')
})
```