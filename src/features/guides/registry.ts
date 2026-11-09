export type GuideSection = {
  heading: string;
  paragraphs: string[];
  code?: string;
  points?: string[];
};

export type GuideDefinition = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  readMinutes: number;
  toolHref: string;
  toolName: string;
  sections: GuideSection[];
};

export const guides: GuideDefinition[] = [
  {
    slug: "debug-json-api-responses",
    title: "How to Debug JSON from an API",
    description:
      "A practical workflow for finding JSON syntax errors, checking API response shapes and safely formatting payloads.",
    intro:
      "An API response can look almost correct and still fail to parse. A missing comma, an extra trailing comma or a response that is actually HTML can turn a routine request into a confusing debugging session. This guide shows how to isolate the problem before changing application code.",
    readMinutes: 5,
    toolHref: "/tools/json-formatter",
    toolName: "JSON Formatter & Validator",
    sections: [
      {
        heading: "1. Inspect the exact response first",
        paragraphs: [
          "Start with the response body received by the client, not the object you expected the server to return. In browser DevTools, open Network, select the request and inspect Response. Check the status code and Content-Type as well: a proxy or server error page may be HTML even when your frontend expects JSON.",
          "A JSON document must contain one complete JSON value. Standard JSON does not allow comments, single-quoted strings, undefined, functions or trailing commas. Those features may appear in JavaScript object literals, but they are not valid JSON syntax.",
        ],
        code: '{\n  "user": {\n    "id": 42,\n    "name": "Ada"\n  },\n  "active": true\n}',
      },
      {
        heading: "2. Separate syntax errors from shape errors",
        paragraphs: [
          'A formatter can tell you whether the text is valid JSON. It cannot tell you whether the response contains the fields your application needs. For example, a response such as {"data": []} is syntactically valid even when your component expects data to be an object with an items array.',
          "After parsing, validate the application contract separately. On a TypeScript backend or frontend, a runtime schema library such as Zod can check required properties, types, ranges and optional fields at the boundary where untrusted data enters your program.",
        ],
        code: 'import { z } from "zod";\n\nconst response = await fetch("/api/items");\nconst payload: unknown = await response.json();\n\nconst responseSchema = z.object({\n  data: z.object({\n    items: z.array(z.object({ id: z.number() }))\n  })\n});\n\nconst result = responseSchema.safeParse(payload);',
      },
      {
        heading: "3. Read parser errors from the location they report",
        paragraphs: [
          "A JSON parser usually reports an unexpected token or a position near the first invalid character. Inspect the character before that position as well: the actual mistake is often a missing comma or quote immediately before the reported location.",
          "For a large response, copy a small redacted excerpt around the error instead of repeatedly moving the whole payload between tools. Remove access tokens, passwords, personal data and production secrets before sharing any diagnostic output.",
        ],
      },
      {
        heading: "4. Format while debugging; minify only when needed",
        paragraphs: [
          "Pretty-printed JSON makes nested objects easier to inspect and compare. Minified JSON is useful when a compact string is required for a test fixture or request body, but minification does not validate the business meaning of the data and does not make it secure.",
          "ByteMint formats and parses the text in the browser tab. The JSON content is not sent to the ByteMint application server. You should still avoid using any online tool with data you are not authorized to disclose.",
        ],
      },
    ],
  },
  {
    slug: "understand-and-debug-jwt",
    title: "How to Read and Debug a JWT",
    description:
      "Understand JWT header, payload and signature segments, inspect claims and learn why decoding is not verification.",
    intro:
      "JSON Web Tokens often appear in authentication systems, API requests and browser developer tools. Their compact format can look opaque, but the structure is simple to inspect. The critical distinction is that reading a token does not prove that it is authentic.",
    readMinutes: 6,
    toolHref: "/tools/jwt-decoder",
    toolName: "JWT Decoder",
    sections: [
      {
        heading: "1. Recognize the three-part structure",
        paragraphs: [
          "A typical signed JWT uses three Base64URL-encoded segments separated by periods: header, payload and signature. The header describes the signing algorithm and token type; the payload contains claims; the signature protects the encoded header and payload from undetected changes when it is verified correctly.",
          "Base64URL uses URL-safe characters and usually omits padding. It is related to Base64, but it is not the same as encryption. Anyone who obtains a regular signed JWT can usually decode its header and payload.",
        ],
        code: "header.payload.signature",
      },
      {
        heading: "2. Inspect claims without trusting them",
        paragraphs: [
          "Common registered claims include sub (the subject), iss (the issuer), aud (the intended audience), exp (expiration time) and nbf (the time before which the token must not be accepted). The exp and nbf values are NumericDate timestamps, usually expressed in seconds since the Unix epoch.",
          "A decoded claim is only data supplied by the token. An attacker can create a token with a convincing-looking user ID or role. Never authorize a request based only on values displayed by a decoder.",
        ],
        points: [
          "Check that the backend verifies the signature with the expected key or public key.",
          "Allow only the signing algorithms configured by your application; do not trust an arbitrary alg value from the token.",
          "Validate issuer, audience, expiration and any application-specific claims.",
          "Keep signing keys and refresh tokens out of client logs and screenshots.",
        ],
      },
      {
        heading: "3. Decode and verify are different operations",
        paragraphs: [
          "A local decoder performs Base64URL conversion and parses JSON. Signature verification requires cryptographic operations and trusted key material. Claim validation additionally needs application policy, such as which issuer and audience are acceptable.",
          "Use a maintained JWT library in your backend to verify tokens. The ByteMint decoder deliberately does not claim to verify signatures, issuers, audiences or expiration; it is an inspection aid only.",
        ],
      },
      {
        heading: "4. Use test tokens, not live credentials",
        paragraphs: [
          "The decoder processes its input locally in the browser, but a token can still be exposed through browser extensions, screenshots, shared devices or accidental copy-and-paste. Prefer short-lived test tokens with non-sensitive claims when debugging.",
          "If you suspect a real access or refresh token has leaked, revoke or rotate it according to your identity provider's procedures. Decoding it does not make it safe again.",
        ],
      },
    ],
  },
  {
    slug: "base64-encoding-explained",
    title: "Base64 Explained: Encoding Is Not Encryption",
    description:
      "Learn how Base64 represents bytes as text, how UTF-8 fits into the process and when Base64URL is used.",
    intro:
      "Base64 is a common way to represent binary data using printable characters. It appears in email attachments, data URLs, APIs and token formats. The name sounds technical, but the important rule is simple: Base64 changes representation, not secrecy.",
    readMinutes: 5,
    toolHref: "/tools/base64",
    toolName: "Base64 Encoder & Decoder",
    sections: [
      {
        heading: "1. Base64 converts bytes into text",
        paragraphs: [
          "Base64 takes groups of bytes and represents them with characters from a 64-character alphabet. Three input bytes are commonly represented by four Base64 characters, so the encoded text is roughly one third larger than the original data before any padding or container overhead.",
          "Text is first converted into bytes using a character encoding such as UTF-8. That step matters for non-English text: UTF-8 characters may use multiple bytes, so treating each visible character as a single byte can corrupt the result.",
        ],
        code: 'const bytes = new TextEncoder().encode("Привет");\nconst text = new TextDecoder().decode(bytes);',
      },
      {
        heading: "2. Base64 is not a security mechanism",
        paragraphs: [
          "Anyone can decode ordinary Base64 without a password or secret key. Do not use it to hide API keys, passwords, personal data or confidential configuration. If you need confidentiality, use an established encryption scheme with proper key management and authenticated encryption.",
          "Encoding can still be useful when a protocol expects text instead of arbitrary bytes. For example, email formats and data URLs may use Base64 to carry content through text-oriented systems.",
        ],
      },
      {
        heading: "3. Know when Base64URL is used",
        paragraphs: [
          "Base64URL is a URL-safe variation used by formats such as JWT. It replaces plus and slash with hyphen and underscore, and often removes trailing equals signs. A regular Base64 decoder may not accept every Base64URL string without converting the alphabet and restoring padding.",
          "Do not confuse the two alphabets when debugging a token or building a protocol integration. Use a decoder that explicitly supports the format you are inspecting.",
        ],
      },
      {
        heading: "4. Validate UTF-8 when decoding text",
        paragraphs: [
          "A Base64 string can represent arbitrary bytes, not necessarily valid UTF-8 text. When decoding text, a strict UTF-8 decoder should reject invalid byte sequences rather than silently replacing them and hiding data corruption.",
          "The ByteMint converter handles UTF-8 text locally in your browser. It is designed for text snippets, not as a replacement for a binary file encoder or encryption tool.",
        ],
      },
    ],
  },
  {
    slug: "uuid-v4-identifiers",
    title: "UUID v4: Random Identifiers and Practical Trade-offs",
    description:
      "Understand the UUID v4 format, secure randomness, collision probability and when a UUID is a good database identifier.",
    intro:
      "UUIDs are widely used to identify records, jobs, files and events across distributed systems. Version 4 UUIDs are generated from random data, which makes them useful when different services need to create identifiers without coordinating a central counter.",
    readMinutes: 5,
    toolHref: "/tools/uuid-generator",
    toolName: "UUID Generator",
    sections: [
      {
        heading: "1. Read the UUID v4 format",
        paragraphs: [
          "A UUID is a 128-bit identifier commonly displayed as 32 hexadecimal digits separated by hyphens. In a version 4 UUID, specific bits identify the version and variant; the remaining bits are random. A correctly formatted UUID v4 therefore has a 4 in the version position and one of 8, 9, a or b in the variant position.",
          "Most modern browsers expose crypto.randomUUID(), which creates a cryptographically strong random UUID when the API is available in a secure context. The ByteMint generator uses the browser's Web Crypto API and caps each batch to keep the interface predictable.",
        ],
        code: "const id = crypto.randomUUID();\n// Example shape: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      },
      {
        heading: "2. Collisions are unlikely, not mathematically impossible",
        paragraphs: [
          "A UUID v4 contains 122 random bits after the version and variant bits are reserved. The chance of a collision remains extremely small for ordinary application workloads, but it is not exactly zero. Systems that require absolute uniqueness should still enforce a unique constraint in the database and handle a conflict safely.",
          "Do not use a generated UUID as an authorization secret. An identifier can be difficult to guess, but access control should depend on authenticated identity and server-side permissions, not on the obscurity of a record ID.",
        ],
      },
      {
        heading: "3. Choose database keys deliberately",
        paragraphs: [
          "UUIDs are useful when records are created in multiple services, imported from different systems or exposed through public APIs. They avoid a single global sequence and are harder to enumerate than simple incremental IDs.",
          "They are not automatically the best primary key for every database. Random inserts can affect index locality, and long text representations consume more space than compact integer keys. Consider the database, indexing strategy, replication needs and API exposure before choosing an identifier format.",
        ],
      },
      {
        heading: "4. Keep uniqueness as a database invariant",
        paragraphs: [
          "Generate IDs close to the point where a record is created, but let the database enforce uniqueness. If an insert collides with an existing key, retry only when the operation is safe to repeat and when the collision error is specifically identified.",
          "For test fixtures, local development and sample data, a browser UUID generator is convenient. Production systems should still own identifier validation and uniqueness enforcement on the server.",
        ],
      },
    ],
  },
  {
    slug: "word-count-and-reading-time",
    title: "How Word Count and Reading Time Are Estimated",
    description:
      "Learn why word counts vary, how characters differ from bytes and graphemes, and what a reading-time estimate can tell you.",
    intro:
      "A word counter seems simple until punctuation, Unicode, hyphenated terms and different writing systems enter the picture. This guide explains the practical limits behind common text statistics and how to use them without treating an estimate as an exact measurement.",
    readMinutes: 4,
    toolHref: "/tools/text-counter",
    toolName: "Text & Word Counter",
    sections: [
      {
        heading: "1. There is no single universal definition of a word",
        paragraphs: [
          "A simple counter often treats a sequence of letters or digits as a word and may keep internal apostrophes or hyphens together. That works for many English-language drafts, but it will not match every language, tokenizer or editorial style guide.",
          "Different tools may split contractions, hyphenated compounds, numbers, emoji and punctuation differently. When a word limit is important, check the counting rules used by the destination platform or publisher instead of assuming all counters agree.",
        ],
      },
      {
        heading: "2. Characters, bytes and visible symbols are different",
        paragraphs: [
          "JavaScript string length counts UTF-16 code units. Some visible symbols, such as many emoji, consist of multiple code units. UTF-8 byte length is a different number again, because characters can occupy one or more bytes depending on their code point.",
          "A grapheme cluster is closer to what a reader perceives as one visible character, but it can contain several Unicode code points. A word counter may reasonably use string length for a quick estimate, while an editor or SMS validator may need grapheme-aware counting or encoded byte length.",
        ],
      },
      {
        heading: "3. Treat reading time as an estimate",
        paragraphs: [
          "The ByteMint counter uses 200 words per minute as a simple baseline and rounds a non-empty text up to at least one minute. Real reading speed depends on language, topic, formatting, reader familiarity and whether the text is being skimmed or studied carefully.",
          "For technical documentation, code-heavy articles and educational material, the actual time may be longer because readers stop to inspect examples, run commands or follow links. Use the estimate as a planning hint, not a promise.",
        ],
      },
      {
        heading: "4. Word count is not an AI token count",
        paragraphs: [
          "Large language models split text into tokens using model-specific tokenizers. A token may be a whole word, a word fragment, punctuation or part of a multi-byte character. The number of tokens can vary substantially between models and languages.",
          "When planning an AI prompt or API request, use the tokenizer for the exact model rather than multiplying the word count by a fixed conversion factor. The text counter is intended for editorial length and rough reading-time estimates.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideDefinition | undefined {
  return guides.find((guide) => guide.slug === slug);
}
