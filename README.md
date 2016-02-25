# gitbook-json

Javascript utility to work with JSON output from GitBook.

### Usage

```js
var json = require('gitbook-json');

// Convert a version 1 to version 2
var output = json.toVersion2(version1);

// Convert a version 2 to version 1
var output = json.toVersion1(version1);
```


