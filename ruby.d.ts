import type { Parent } from "mdast";

export interface Ruby extends Parent {
  type: "ruby";
  base: string;
  text: string;
  children: [];
  data: {
    hName: string;
    hChildren: (RubyText | RubyElement)[];
  };
}

export interface RubyText {
  type: string;
  value: string;
}

export interface RubyElement {
  type: string;
  children: RubyText[];
  tagName: string;
}

declare module "mdast" {
  interface StaticPhrasingContentMap {
    ruby: Ruby;
  }
}
