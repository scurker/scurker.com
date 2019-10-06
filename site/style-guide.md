## Colors

<ul>
  <li class="swatch" style="--swatch-color: var(--primary-color)">Primary</li>
  <li class="swatch" style="--swatch-color: var(--accent-color)">Accent</li>
  <li class="swatch" style="--swatch-color: var(--highlight-color)">Highlight</li>
  <li class="swatch" style="--swatch-color: var(--text-color)">Text</li>
  <li class="swatch" style="--swatch-color: var(--code-variable-color)">Code Variable</li>
  <li class="swatch" style="--swatch-color: var(--code-literal-color)">Code Literal</li>
  <li class="swatch" style="--swatch-color: var(--code-value-color)">Code Value</li>
  <li class="swatch" style="--swatch-color: var(--code-comment-color)">Code Comment</li>
  <li class="swatch" style="--swatch-color: var(--code-hex-color)">Code CSS Hex</li>
  <li class="swatch" style="--swatch-color: var(--code-function-color)">Code Function</li>
  <li class="swatch" style="--swatch-color: var(--code-keyword-color)">Code Keyword</li>
</ul>

## Text

Bacon ipsum dolor amet ham hock meatloaf porchetta ball tip buffalo. Pig doner pastrami tail ground round buffalo. Meatloaf sirloin frankfurter pork loin, andouille beef sausage jowl hamburger pastrami cupim shank spare ribs venison.

## Headers

# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

## Links

<a href="https://scurker.com">Home</a>

## Avatar

### Normal

<div class="avatar"></div>

### Large

<div class="avatar--large"></div>

## Icons

TODO

## Lists

### Ordered List

1. Ordered List
1. Ordered List
1. Ordered List
1. Ordered List

### Unordered List

* Unordered List
* Unordered List
* Unordered List
* Unordered List

## Posts

<ul class="posts">
  <li class="year">Year</li>
  <li><a href="#">Entry Title <date>Month Year</date></a></li>
  <li><a href="#">Entry Title <date>Month Year</date></a></li>
  <li class="year">Year</li>
  <li><a href="#">Entry Title <date>Month Year</date></a></li>
  <li><a href="#">Entry Title <date>Month Year</date></a></li>
</ul>

## Code

### Inline

Here's some text with some inline code, like `foo` and `bar`.

### Block

```javascript
const puppeteer = require('puppeteer');

(async function() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // capture results
})();
```

### Block with Filename

<div class="code--title">path/to/file.js</div>

```javascript
const puppeteer = require('puppeteer');

(async function() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // capture results
})();
```

## Block Quote

> Bacon ipsum dolor amet ham hock meatloaf porchetta ball tip buffalo. Pig doner pastrami tail ground round buffalo. Meatloaf sirloin frankfurter pork loin, andouille beef sausage jowl hamburger pastrami cupim shank spare ribs venison.

## Bio

Jason Wilson

## Pagination

<div class="post--pagination">
  <a class="post--prev" href="#">Previous Post</a>
  <a class="post--next" href="#">Next Post</a></div>
