import { lazy } from "react";

// Lazy load workers
const loadWorkers = async () => {
  const [editorWorker, jsonWorker, cssWorker, htmlWorker, tsWorker] =
    await Promise.all([
      import("monaco-editor/esm/vs/editor/editor.worker?worker"),
      import("monaco-editor/esm/vs/language/json/json.worker?worker"),
      import("monaco-editor/esm/vs/language/css/css.worker?worker"),
      import("monaco-editor/esm/vs/language/html/html.worker?worker"),
      import("monaco-editor/esm/vs/language/typescript/ts.worker?worker"),
    ]);

  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === "json") return new jsonWorker.default();
      if (label === "css" || label === "scss" || label === "less")
        return new cssWorker.default();
      if (label === "html" || label === "handlebars" || label === "razor")
        return new htmlWorker.default();
      if (label === "typescript" || label === "javascript")
        return new tsWorker.default();
      return new editorWorker.default();
    },
  };
};

export const initMonaco = async () => {
  await loadWorkers();
  const monaco = await import("monaco-editor");
  monaco.languages.register({ id: "python" });
  monaco.languages.setMonarchTokensProvider("python", {
    defaultToken: "",
    tokenPostfix: ".python",
    keywords: [
      "and",
      "as",
      "assert",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "exec",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "not",
      "or",
      "pass",
      "print",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield",
    ],
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
    ],
    tokenizer: {
      root: [
        [
          /[a-zA-Z_]\w*/,
          { cases: { "@keywords": "keyword", "@default": "identifier" } },
        ],
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/[=+\-*/<>!&|^~]/, "operator"],
        [/@?[a-zA-Z_]\w*/, "identifier"],
        [/[0-9]+/, "number"],
        [/".*?"/, "string"],
        [/'.*?'/, "string"],
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/#.*$/, "comment"],
      ],
    },
  });
};

// Lazy load the editor component
export const MonacoEditor = lazy(() => import("@monaco-editor/react"));
