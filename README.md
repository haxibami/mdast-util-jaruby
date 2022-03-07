# mdast-util-jaruby

[![Node.js CI](https://github.com/haxibami/mdast-util-jaruby/actions/workflows/node.js.yml/badge.svg)](https://github.com/haxibami/mdast-util-jaruby/actions/workflows/node.js.yml)
[![Node.js Package](https://github.com/haxibami/mdast-util-jaruby/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/haxibami/mdast-util-jaruby/actions/workflows/npm-publish.yml)
[![codecov](https://codecov.io/gh/haxibami/mdast-util-jaruby/branch/main/graph/badge.svg?token=T301K9XK31)](https://codecov.io/gh/haxibami/mdast-util-jaruby)
[![GitHub license](https://img.shields.io/github/license/haxibami/mdast-util-jaruby)](https://github.com/haxibami/mdast-util-jaruby/blob/main/LICENSE)

[mdast](https://github.com/syntax-tree/mdast) extension to support Japanese ruby.

## Feature

- compatible with latest mdast ecosystem
- add custom mdast node type (see `ruby.d.ts`)
- fully typed
- ESM only

## Install

```sh
npm install mdast-util-jaruby
```

## Usage

### Markdown => MDAST

```js
import { fromMarkdown } from "mdast-util-from-markdown";
import { jarubyFromMarkdown } from "mdast-util-jaruby";
import { jaruby } from "micromark-extension-jaruby";

const markdown = `
{聖剣}^(エクスカリバー)
`;

console.dir(
  fromMarkdown(markdown, {
    extensions: [jaruby()],
    mdastExtensions: [jarubyFromMarkdown()],
  }),
  { depth: null }
);
```

generates...

```json
{
  "type": "root",
  "children": [
    {
      "type": "paragraph",
      "children": [
        {
          "type": "ruby",
          "base": "聖剣",
          "text": "エクスカリバー",
          "children": [],
          "data": {
            "hName": "ruby",
            "hChildren": [
              { "type": "text", "value": "聖剣" },
              {
                "type": "element",
                "children": [{ "type": "text", "value": "(" }],
                "tagName": "rp"
              },
              {
                "type": "element",
                "children": [{ "type": "text", "value": "エクスカリバー" }],
                "tagName": "rt"
              },
              {
                "type": "element",
                "children": [{ "type": "text", "value": ")" }],
                "tagName": "rp"
              }
            ]
          },
          "position": {
            "start": { "line": 2, "column": 1, "offset": 1 },
            "end": { "line": 2, "column": 15, "offset": 15 }
          }
        }
      ],
      "position": {
        "start": { "line": 2, "column": 1, "offset": 1 },
        "end": { "line": 2, "column": 15, "offset": 15 }
      }
    }
  ],
  "position": {
    "start": { "line": 1, "column": 1, "offset": 0 },
    "end": { "line": 3, "column": 1, "offset": 16 }
  }
}
```

### MDAST => Markdown

```js
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { jarubyFromMarkdown, jarubyToMarkdown } from "./index.js";
import { jaruby } from "../micromark-extension-jaruby/index.js";

const mdast = {
  type: "root",
  children: [
    {
      type: "paragraph",
      children: [
        {
          type: "ruby",
          base: "excalibur",
          text: "the holy sword",
          children: [],
          data: {
            hName: "ruby",
            hChildren: [
              { type: "text", value: "excalibur" },
              {
                type: "element",
                children: [{ type: "text", value: "(" }],
                tagName: "rp",
              },
              {
                type: "element",
                children: [{ type: "text", value: "the holy sword" }],
                tagName: "rt",
              },
              {
                type: "element",
                children: [{ type: "text", value: ")" }],
                tagName: "rp",
              },
            ],
          },
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 29, offset: 28 },
          },
        },
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 29, offset: 28 },
      },
    },
  ],
  position: {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 29, offset: 28 },
  },
};

console.dir(
  toMarkdown(mdast, {
    extensions: [jarubyToMarkdown()],
  }),
  { depth: null }
);
```

generates...

```md
'{excalibur}^(the holy sword)\n'
```

## Note

- This package is almost a refactoring of [remark-ruby](https://github.com/laysent/remark-ruby). Original package is licensed under [MIT License](https://github.com/laysent/remark-ruby/blob/a5d2ec31cf4750e003890204ea43a71607d5e4d8/LICENSE).
- Support for text delimitation & `<rb>` tag in original package was omitted, since only few browsers can display it.
