# gitbook-json

Javascript utility to work with JSON output from GitBook.

### Usage

```js
var json = require('gitbook-json');

// Convert a version 1/2 to version 3
var output = json.toVersion3(version1);

// Convert a version 3 to version 2
var output = json.toVersion2(version3);
```


