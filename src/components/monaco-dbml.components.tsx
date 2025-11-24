import { DBML_COLUMN_TYPES } from "@/packages/dbml/dbml-column/constants/dbml-column.constants";
import { type EditorProps, type Monaco } from "@monaco-editor/react";

export const DBML_LANGUAGE = "dbml";

export function registerDBMLLanguage(monaco: Monaco) {
  // Check if language is already registered
  const languages = monaco.languages.getLanguages();
  if (languages.find((lang) => lang.id === DBML_LANGUAGE)) {
    return;
  }

  // Register DBML language
  monaco.languages.register({ id: DBML_LANGUAGE });

  // Define DBML tokens
  monaco.languages.setMonarchTokensProvider(DBML_LANGUAGE, {
    keywords: [
      "Table",
      "Ref",
      "Enum",
      "TableGroup",
      "Project",
      "Note",
      "Indexes",
      "as",
      "ref",
      "enum",
      "tablegroup",
      "project",
    ],

    columnTypes: DBML_COLUMN_TYPES,

    properties: [
      "pk",
      "primary key",
      "null",
      "not null",
      "unique",
      "increment",
      "default",
      "note",
      "ref",
      "auto_increment",
    ],

    operators: [">", "<", "-", ":", ",", "."],

    symbols: /[=><!~?:&|+\-*/^%]+/,

    tokenizer: {
      root: [
        [/\b(Table|Ref|Enum|TableGroup|Project)\b/, "keyword"],
        [createColumnTypeRegex(DBML_COLUMN_TYPES), "type"],
        [
          /\b(pk|primary key|null|not null|unique|increment|default|note|ref|auto_increment)\b/i,
          "property",
        ],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string_double"],
        [/'/, "string", "@string_single"],
        [/`/, "identifier", "@identifier"],
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],
        [/\d+/, "number"],
        [/[{}()[\]]/, "@brackets"],
        [/@symbols/, "operator"],
      ],

      string_double: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@pop"],
      ],

      string_single: [
        [/[^\\']+/, "string"],
        [/\\./, "string.escape"],
        [/'/, "string", "@pop"],
      ],

      identifier: [
        [/[^`]+/, "identifier"],
        [/`/, "identifier", "@pop"],
      ],

      comment: [
        [/[^/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
    },
  });

  // Configure autocomplete for DBML
  monaco.languages.registerCompletionItemProvider(DBML_LANGUAGE, {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const columnTypes = DBML_COLUMN_TYPES;

      const properties = [
        "pk",
        "primary key",
        "null",
        "not null",
        "unique",
        "increment",
        "default",
        "note",
        "ref",
        "auto_increment",
      ];

      const keywords = ["Table", "Ref", "Enum", "TableGroup", "Project", "Indexes"];

      const suggestions = [
        ...columnTypes.map((type) => ({
          label: type,
          kind: monaco.languages.CompletionItemKind.TypeParameter,
          insertText: type,
          range: range,
          detail: "Column Type",
        })),
        ...properties.map((prop) => ({
          label: prop,
          kind: monaco.languages.CompletionItemKind.Property,
          insertText: prop,
          range: range,
          detail: "Column Property",
        })),
        ...keywords.map((kw) => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range: range,
          detail: "Keyword",
        })),
      ];

      return { suggestions };
    },
  });
}

export function getEditorProps(props: EditorProps): EditorProps {
  const { options, ...rest } = props;
  return {
    height: "90vh",
    theme: "vs-dark",
    language: "javascript",
    beforeMount: registerDBMLLanguage,
    options: {
      ...options,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: "off",
    },
    ...rest,
  };
}

function createColumnTypeRegex(types: readonly string[]): RegExp {
  const pattern = `\\b(${types.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`;
  return new RegExp(pattern, "i");
}
