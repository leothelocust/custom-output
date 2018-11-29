# custom-output
An opinionated way of standardizing a JSON response from an API

# Requirements
* Typescript
* Express

# Very Basic Example

```typescript
import express from 'express'
import custom-output as Formatter from 'custom-output'

... all the express stuff here...

app.get('/', () => {
    Formatter.FormatOutput(res, null, null, 200);
})

...
```
