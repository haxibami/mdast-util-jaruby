import test from "tape";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { jarubyToMarkdown, jarubyFromMarkdown } from "./index.js";
import { jaruby } from "micromark-extension-jaruby";

test("markdown to mdast", (t) => {
  t.deepEqual(
    fromMarkdown("{excalibur}^(the holy sword)", {
      extensions: [jaruby()],
      mdastExtensions: [jarubyFromMarkdown()]
    }),
    {
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
                    tagName: "rp"
                  },
                  {
                    type: "element",
                    children: [{ type: "text", value: "the holy sword" }],
                    tagName: "rt"
                  },
                  {
                    type: "element",
                    children: [{ type: "text", value: ")" }],
                    tagName: "rp"
                  }
                ]
              },
              position: {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 29, offset: 28 }
              }
            }
          ],
          position: {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 29, offset: 28 }
          }
        }
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 1, column: 29, offset: 28 }
      }
    },
    "should support ruby conversion"
  );
  t.end();
});

test("mdast to markdown", (t) => {
  t.deepEqual(
    toMarkdown(
      {
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
                      tagName: "rp"
                    },
                    {
                      type: "element",
                      children: [{ type: "text", value: "the holy sword" }],
                      tagName: "rt"
                    },
                    {
                      type: "element",
                      children: [{ type: "text", value: ")" }],
                      tagName: "rp"
                    }
                  ]
                },
                position: {
                  start: { line: 1, column: 1, offset: 0 },
                  end: { line: 1, column: 29, offset: 28 }
                }
              }
            ],
            position: {
              start: { line: 1, column: 1, offset: 0 },
              end: { line: 1, column: 29, offset: 28 }
            }
          }
        ],
        position: {
          start: { line: 1, column: 1, offset: 0 },
          end: { line: 1, column: 29, offset: 28 }
        }
      },
      {
        extensions: [jarubyToMarkdown()]
      }
    ),
    "{excalibur}^(the holy sword)\n",
    "should support ruby conversion"
  );
  t.end();
});
