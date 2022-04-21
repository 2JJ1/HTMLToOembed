# HTML to Oembed

Searches for embeddably links on HTML elements or text and replaces them with HTML embeds.

  

## Client Side Use

Refer to /Browser

  
### Installation

Simply download and include the oembed.js file
```html
<script src="/Browser/oembed.js">
```

  

### Usage
```js
//HTMLToOembed((HTML Element)element, (object)options)
HTMLToOembed(document.getElementByID("articleContent"))
```

  

## Server Side Use with Node.js

Refer to /NPM

  

### Installation

`npm install HTMLToOembed`

  

### Usage
`HTMLToOembed((string)html, (object)options)`

```js 
const HTMLToOembed = require("HTMLToOembed")

var articleContent = <HTMLAsString> //E.g innerHTML as sent by the client to the server

articleContent = HTMLToOembed(articleContent) //Your new HTML with links embedded
```

  

## Options

These options are usable for both the server side version and client side version of the HTMLToOembed functions

  

(bool; Default true) gyazo: Converts gyazo links to img tags

(bool; Default true) imgFile: Converts image links to img tags

(bool; Default true) videoFile: Converts video links to img tags

(bool; Default true) imgur: Embeds Imgur links. Should turn this into a plain image tag if I can figure out how to extract the image

(bool; Default true) codepen: Embeds Codepen pens

(RegEx Array; Default undefined) fileDomainWhitelist: Only domains that are matched by this whitelist will be handled for image embeds. NPM Example:
```js
await toOembed(<HTMLAsString>, {
	fileDomainWhitelist: [
		/https:\/\/(i\.)?imgur\.com/,
		/https:\/\/(i\.)?gyazo\.com/,
		/https:\/\/cdn\.discordapp\.com/,
		/https:\/\/media\.discordapp\.net/,
		/https:\/\/(cdn\.)?wearedevs\.net/,
	],
})
```