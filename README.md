# custom-output
An opinionated way of standardizing a JSON response from an API

# Requirements
* Typescript
* Express

# Method Signature

```typescript
FormatOutput(
    response: any, // express response object
    error?: Error, // new Error("Message Goes Here")
    data?: any, // your API data
    successStatusCode?: number, // 200, 201, etc...
    errorStatusCode?: number, // 400, 500, etc...
    optionalMeta?: any // link params or additional data like offset, limit, etc...
): any
```

# Very Basic Example

```typescript
import express from 'express'
import {FormatOutput} from 'custom-output'

... all the express stuff here...

app.get('/', (req, res) => {
    FormatOutput(res, null, null, 200);
})

...
```
