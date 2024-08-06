# ts-frontmatter

A TypeScript library to parse front matter from Markdown files.

_Just a port of [front-matter](https://github.com/jxson/front-matter)_

## Installation

Install the package using npm:

```sh
npm install ts-frontmatter
```

## Usage
### Extracting Front Matter and Body
You can use the __extractor__ function to parse the front matter and body content from a Markdown string.

#### TypeScript Example
```typescript
import { extractor, FrontMatterResult } from 'ts-frontmatter';
import * as fs from 'fs-extra';

const filePath = 'path/to/your/markdown-file.md';
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Use the extractor function to parse front matter and body
const content: FrontMatterResult = extractor(fileContent);

console.log(content.attributes); // Parsed front matter attributes
console.log(content.body); // The body of the Markdown content
console.log(content.bodyBegin); // Line number where the body begins
```

#### JavaScript Example

```javascript
const { extractor } = require('ts-frontmatter');
const fs = require('fs-extra');

const filePath = 'path/to/your/markdown-file.md';
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Use the extractor function to parse front matter and body
const content = extractor(fileContent);

console.log(content.attributes); // Parsed front matter attributes
console.log(content.body); // The body of the Markdown content
console.log(content.bodyBegin); // Line number where the body begins
```

#### Testing for Front Matter

Use the __test__ function to check if a Markdown string contains front matter.

##### TypeScript test Example

```typescript
import { test } from 'ts-frontmatter';

const markdownString = `
---
title: "Hello World"
date: "2024-08-06"
---
This is my first blog post written in Markdown.
`;

const hasFrontMatter = test(markdownString);
console.log(hasFrontMatter); // true or false
```

##### JavaScript test Example

```javascript
const { test } = require('ts-frontmatter');

const markdownString = `
---
title: "Hello World"
date: "2024-08-06"
---
This is my first blog post written in Markdown.
`;

const hasFrontMatter = test(markdownString);
console.log(hasFrontMatter); // true or false
```

#### API

`extractor(string: string, options?: { allowUnsafe?: boolean }): FrontMatterResult`

Parses the front matter and body from the given string.

##### Parameters

* `string`: The input string containing front matter and body content.
* `options`: Optional settings for the extraction process. Currently supports `allowUnsafe`

#####  Returns

An object of type `FrontMatterResult` containing the parsed front matter attributes, body content, and other metadata.

`test(string: string): boolean`
Tests if the given string contains front matter.

##### Parameters

* `string`: The input string to test.

##### Returns

* `boolean`: True if the string contains front matter, otherwise false.

## Types

`FrontMatterAttributes`
An interface representing the front matter attributes.

```typescript
interface FrontMatterAttributes {
    [key: string]: any;
}
```

`FrontMatterResult`
An interface representing the result of parsing front matter and body content.

```typescript
interface FrontMatterResult {
    attributes: FrontMatterAttributes;
    body: string;
    bodyBegin: number;
    frontmatter?: string;
}
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.

#### Running Tests

```sh
npm test
```

### License
This project is licensed under the MIT License. See the LICENSE file for details.

----

_Lots of love, Mikke_
