export type ToolId =
  | "json-formatter"
  | "jwt-decoder"
  | "base64"
  | "uuid-generator"
  | "text-counter";

export type ToolDefinition = {
  id: ToolId;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  inputLabel: string;
  placeholder: string;
  actionLabel: string;
  steps: string[];
  privacyNote: string;
  useCases: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const tools: ToolDefinition[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    shortDescription: "Make JSON readable and catch syntax errors in seconds.",
    description:
      "Format, minify and validate JSON directly in your browser. The formatter reports parsing errors and keeps your payload on your device.",
    category: "Data",
    inputLabel: "Paste JSON",
    placeholder: '{\n  "name": "ByteMint",\n  "active": true\n}',
    actionLabel: "Format JSON",
    steps: [
      "Paste or type a JSON document.",
      "Choose Format or Minify.",
      "Copy the result or fix the reported syntax error.",
    ],
    privacyNote:
      "Your JSON is processed locally in this tab. It is not uploaded to ByteMint.",
    useCases: [
      "Inspect API responses",
      "Clean configuration files",
      "Validate request payloads",
    ],
    faqs: [
      {
        question: "Does the formatter upload my JSON?",
        answer:
          "No. Formatting and parsing happen in your browser. The JSON is not sent to our server.",
      },
      {
        question: "Which JSON values are supported?",
        answer:
          "The tool supports standard JSON objects, arrays, strings, numbers, booleans and null values.",
      },
    ],
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription:
      "Inspect a JWT header and payload without sending it anywhere.",
    description:
      "Decode the Base64URL-encoded header and payload of a JSON Web Token locally. This is an inspection helper, not a signature verifier.",
    category: "Security",
    inputLabel: "JSON Web Token",
    placeholder: "eyJhbGciOi...",
    actionLabel: "Decode token",
    steps: [
      "Paste a JWT with three dot-separated segments.",
      "Decode the header and payload.",
      "Check claims such as issuer, audience and expiration yourself.",
    ],
    privacyNote:
      "The token is decoded locally and never transmitted. Do not paste production secrets into any debugging tool.",
    useCases: [
      "Inspect token claims",
      "Debug authentication flows",
      "Understand JWT structure",
    ],
    faqs: [
      {
        question: "Does this verify the JWT signature?",
        answer:
          "No. It only decodes the header and payload. A decoded token is not proof that the signature is valid or that the token should be trusted.",
      },
      {
        question: "Can I paste an access token?",
        answer:
          "Avoid pasting live production credentials into tools. Although this page runs locally, use test tokens and keep secrets out of screenshots and shared devices.",
      },
    ],
  },
  {
    id: "base64",
    name: "Base64 Encoder & Decoder",
    shortDescription: "Encode and decode UTF-8 text with Base64.",
    description:
      "Convert plain UTF-8 text to Base64 or decode Base64 back to readable text. Conversion runs in your browser and supports non-English characters.",
    category: "Encoding",
    inputLabel: "Text or Base64 string",
    placeholder: "Type or paste text here...",
    actionLabel: "Encode as Base64",
    steps: [
      "Enter text or a Base64 string.",
      "Select Encode or Decode.",
      "Copy the converted output.",
    ],
    privacyNote:
      "Text conversion happens locally in your browser. Base64 is an encoding format, not encryption.",
    useCases: [
      "Prepare data URLs",
      "Inspect encoded text",
      "Debug API integrations",
    ],
    faqs: [
      {
        question: "Is Base64 encryption?",
        answer:
          "No. Base64 is reversible encoding. Anyone with the encoded value can decode it, so never use it to protect secrets.",
      },
      {
        question: "Does it support Unicode?",
        answer:
          "Yes. The tool converts text through UTF-8 bytes before Base64 encoding.",
      },
    ],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate random UUID v4 identifiers in one click.",
    description:
      "Create one or more UUID version 4 identifiers using the browser's cryptographically secure random number generator when available.",
    category: "Generators",
    inputLabel: "Number of UUIDs",
    placeholder: "1",
    actionLabel: "Generate UUIDs",
    steps: [
      "Choose how many identifiers you need.",
      "Generate up to 20 UUID v4 values.",
      "Copy one identifier or the whole list.",
    ],
    privacyNote:
      "UUIDs are generated in your browser. Nothing is sent to our server.",
    useCases: [
      "Create test fixture IDs",
      "Generate local development identifiers",
      "Seed sample records",
    ],
    faqs: [
      {
        question: "Which UUID version is generated?",
        answer: "The tool generates random UUID version 4 identifiers.",
      },
      {
        question: "Can I generate multiple IDs?",
        answer: "Yes. You can generate between 1 and 20 identifiers at a time.",
      },
    ],
  },
  {
    id: "text-counter",
    name: "Text & Word Counter",
    shortDescription:
      "Count words, characters, lines and estimated reading time.",
    description:
      "Get instant text statistics while you write: characters, characters without spaces, words, lines and approximate reading time.",
    category: "Writing",
    inputLabel: "Your text",
    placeholder: "Start typing or paste your text...",
    actionLabel: "Update statistics",
    steps: [
      "Paste or type your text.",
      "Review live word and character counts.",
      "Use the statistics to check content length.",
    ],
    privacyNote:
      "Text statistics are calculated in your browser. Your text is not uploaded.",
    useCases: [
      "Check article length",
      "Prepare social posts",
      "Estimate reading time",
    ],
    faqs: [
      {
        question: "How is reading time estimated?",
        answer:
          "The estimate uses 200 words per minute and rounds up to at least one minute for non-empty text.",
      },
      {
        question: "What counts as a word?",
        answer:
          "Sequences of letters or numbers, including internal apostrophes and hyphens, are counted as words.",
      },
    ],
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id);
}
