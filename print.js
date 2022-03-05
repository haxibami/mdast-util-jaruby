import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { jarubyFromMarkdown, jarubyToMarkdown } from "./index.js";
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
