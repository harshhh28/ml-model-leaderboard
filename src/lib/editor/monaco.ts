import * as monaco from "monaco-editor";

self.MonacoEnvironment = {
  getWorker() {
    return new Worker(
      new URL(
        "/monaco-editor/esm/vs/editor/editor.worker.js",
        window.location.origin
      ),
      { type: "module" }
    );
  },
};

export function initMonaco() {
  monaco.languages.register({ id: "python" });
  monaco.languages.setMonarchTokensProvider("python", {
    defaultToken: "",
    tokenPostfix: ".python",
    keywords: [
      "def",
      "class",
      "from",
      "import",
      "return",
      "if",
      "else",
      "try",
      "except",
      "for",
      "while",
      "in",
      "is",
      "not",
      "and",
      "or",
      "self",
    ],
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
    ],
    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@numbers" },
        { include: "@strings" },
        [/[,:;]/, "delimiter"],
        [/[{}\[\]()]/, "@brackets"],
        [/@[a-zA-Z]\w*/, "tag"],
        [
          /[a-zA-Z]\w*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier",
            },
          },
        ],
      ],
      whitespace: [
        [/\s+/, "white"],
        [/#.*$/, "comment"],
      ],
      numbers: [
        [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],
      ],
      strings: [
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'/, "string", "@string_single"],
        [/"/, "string", "@string_double"],
      ],
      string_single: [
        [/[^\\']+/, "string"],
        [/\\./, "string.escape"],
        [/'/, "string", "@pop"],
      ],
      string_double: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@pop"],
      ],
    },
  });
}
