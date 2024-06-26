/**
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
 * @typedef {import('mdast-util-from-markdown').Token} Token
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import("./ruby.js").Ruby} Ruby
 * @typedef {import("./ruby.js").RubyElement} RubyElement
 * @typedef {import("./ruby.js").RubyText} RubyText
 */

/**
 * @returns {FromMarkdownExtension}
 */
export function jarubyFromMarkdown() {
  return {
    enter: {
      ruby: enterRuby,
      rubyText: enterRubyText,
      rubyPronunciation: enterRubyPronunciation,
    },
    exit: {
      ruby: exitRuby,
      rubyText: exitRubyText,
      rubyPronunciation: exitRubyPronunciation,
    },
  };

  /**
   * @type {FromMarkdownHandle}
   * @this {CompileContext}
   * @param {Token} token
   */
  function enterRuby(token) {
    this.enter(
      {
        type: "ruby",
        base: "",
        text: "",
        children: [],
        data: {
          hName: "ruby",
          hChildren: [],
        },
      },
      token,
    );
  }

  /**
   * @type {FromMarkdownHandle}
   * @this {CompileContext}
   */
  function enterRubyText() {
    this.stack.push({ type: "fragment", children: [] });
  }

  /**
   * @type {FromMarkdownHandle}
   * @this {CompileContext}
   */
  function enterRubyPronunciation() {
    this.stack.push({ type: "fragment", children: [] });
  }

  /**
   * @type {FromMarkdownHandle}
   * @this {CompileContext}
   * @param {Token} token
   */
  function exitRuby(token) {
    const element = /** @type {Ruby} */ (this.stack[this.stack.length - 1]);
    const text = element.base;
    const pronunciation = element.text;

    /** @type {RubyText[]} */
    const rubyBase = [{ type: "text", value: text }];
    /** @type {string[]} */
    const array = [];
    /** @type {RubyElement[]} */
    const rubyText = array.concat(pronunciation).map((p) => ({
      type: "element",
      children: [{ type: "text", value: p }],
      tagName: "rt",
    }));

    /** @type {RubyElement[]} */
    const opening = [
      {
        type: "element",
        children: [{ type: "text", value: "(" }],
        tagName: "rp",
      },
    ];

    /** @type {RubyElement[]} */
    const closing = [
      {
        type: "element",
        children: [{ type: "text", value: ")" }],
        tagName: "rp",
      },
    ];

    /** @type {(RubyText | RubyElement)[]} */
    element.data.hChildren = [...rubyBase, ...opening, ...rubyText, ...closing];
    this.exit(token);
  }

  /**
   * @type {FromMarkdownHandle}
   * @this {CompileContext}
   */
  function exitRubyText() {
    const data = this.resume();
    const element = /** @type {Ruby} */ (this.stack[this.stack.length - 1]);
    element.base = data;
  }

  /**
   * @type {FromMarkdownHandle}
   * @this {CompileContext}
   */
  function exitRubyPronunciation() {
    const data = this.resume();
    const element = /** @type {Ruby} */ (this.stack[this.stack.length - 1]);
    element.text = data;
  }
}

/**
 * @returns {ToMarkdownExtension}
 */
export function jarubyToMarkdown() {
  handleRuby.peek = peekRuby;

  return {
    unsafe: [{ character: "{", inConstruct: "phrasing" }],
    handlers: { ruby: handleRuby },
  };

  /**
   * @type {ToMarkdownHandle}
   * @param {Ruby} node
   */
  function handleRuby(node) {
    /** @param {string | string[]} input */
    function joinText(input) {
      if (typeof input === "string") return input;
      return input.map((text) => `[${text}]`).join("");
    }
    const base = joinText(node.base);
    const text = joinText(node.text);
    return `{${base}}^(${text})`;
  }

  /** @type {ToMarkdownHandle} */
  function peekRuby() {
    return "{";
  }
}
