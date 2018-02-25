<p align="right">
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/deventor.svg" alt="license" />
  </a>
</p>

<h1 align="center">deventor | <a href="https://github.com/Naimikan/deventor/blob/master/API.md">API</a></h1>

<h5 align="center">A pure Javascript event emitter</h5>

<h2 align="center">Get Started</h2>

Include the files in your `index.html`:
```html
<script src="deventor.min.js"></script>
```

<h2 align="center">Usage</h2>

```javascript
var myDeventor = new Deventor({
  name: 'myDeventor'
});

myDeventor.on('myCustomEvent', function (args) {
  // ...
});

myDeventor.emit('myCustomEvent', {
  arg1: 'arg1',
  arg2: 'arg2'
});
```

<h2 align="center">Developing</h2>

Install dependencies, build the source files and preview

```shell
git clone https://github.com/Naimikan/deventor.git
npm install
grunt && grunt preview
```
