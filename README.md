# json-storage-formatter 🌟

<div align="center">
  <img src="https://raw.githubusercontent.com/johnny-quesada-developer/global-hooks-example/main/public/avatar2.jpeg" width="100" alt="John Avatar" />

  <br />
  <b>Type-safe serialization for any JavaScript object.<br />
  Store and restore Maps, Sets, Dates, RegExps, Errors, and more.<br />
  <br />
  <i>One line. No data loss. No headaches.</i> 🚀</b>
  <br /><br />
  <a href="https://www.npmjs.com/package/json-storage-formatter"><img src="https://img.shields.io/npm/v/json-storage-formatter.svg" /></a>
  <a href="https://www.npmjs.com/package/json-storage-formatter"><img src="https://img.shields.io/npm/dm/json-storage-formatter.svg" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/json-storage-formatter.svg" /></a>
</div>

---

## 🎯 The Problem

```ts
const userProfile = {
  id: 42,
  createdAt: new Date('2024-10-01T10:30:00Z'),
  preferences: new Map([
    ['theme', 'dark'],
    ['languages', new Set(['en', 'es'])],
  ]),
};

console.log(JSON.stringify(userProfile, null, 2));
```

**Console Output:**

```json
{
  "id": 42,
  "createdAt": "2024-10-01T10:30:00.000Z",
  "preferences": {}
}
```

**JSON.stringify** loses all type information for Dates, Maps, Sets, RegExps, and more. Your data is flattened, and restoring it is impossible.

---

<div align="center">
<b>json-storage-formatter lets you serialize <i>any</i> JavaScript value for storage,<br />
and restore it to its original type — <i>automatically</i>.</b>
</div>

---

## 🚀 Why Use This Library?

## 🟢 Quick Start

### Instantly Store and Restore Complex Data

```ts
import { formatToStore, formatFromStore } from 'json-storage-formatter';

// Imagine you want to save this to localStorage, a URL, or a DB:
const userProfile = {
  id: 42,
  createdAt: new Date('2024-10-01T10:30:00Z'),
  preferences: new Map([
    ['theme', 'dark'],
    ['languages', new Set(['en', 'es'])],
  ]),
};

// Serialize for storage (preserves all types!)
const stored = formatToStore(userProfile);
localStorage.setItem('profile', stored);

// ...later, or in another environment:
const loaded = localStorage.getItem('profile');
const restored = formatFromStore<typeof userProfile>(loaded);

// restored.createdAt is a Date
// restored.preferences is a Map with a Set inside
```

// Works for any structure: deeply nested, with Dates, Sets, Maps, RegExps, Errors, undefined, NaN, etc.

---

## 🟣 Complex Types Example

```ts
const complex = {
  date: new Date('2024-10-01T10:30:00Z'),
  set: new Set(['a', 'b']),
  map: new Map([
    ['x', 1],
    ['y', 2],
  ]),
  regex: /abc/i,
  error: new Error('fail'),
  undef: undefined,
  nan: NaN,
  inf: Infinity,
};

const stored = formatToStore(complex);
const restored = formatFromStore<typeof complex>(stored);
// All types are preserved!
```

---

### 🔒 Type-Safe Storage

Store and restore Maps, Sets, Dates, RegExps, Errors, and more — not just plain objects.

```ts
import { formatToStore, formatFromStore } from 'json-storage-formatter';

const original = new Map([
  ['created', new Date('2024-10-01T10:30:00Z')],
  ['tags', new Set(['a', 'b'])],
]);

const json = formatToStore(original); // string for storage
const restored = formatFromStore<Map<string, unknown>>(json);
```

### ⚡ No Boilerplate

Just call `formatToStore` before saving, and `formatFromStore` when loading. No config, no setup, no custom revivers.

```ts
localStorage.setItem('profile', formatToStore(profile));
const profile = formatFromStore(localStorage.getItem('profile'));
```

---

## 🛠️ How It Works

`formatToStore` adds a tiny type marker to every special value:

```json
{
  "$t": "map",
  "$v": [["key", { "$t": "date", "$v": "2024-10-01T10:30:00.000Z" }]]
}
```

When you call `formatFromStore`, it reads those markers and reconstructs the original types — even deeply nested.

---

## ✨ Real-World Examples

### 1️⃣ React: Syncing Complex State to localStorage

```tsx
import { useState } from 'react';
import { formatToStore, formatFromStore } from 'json-storage-formatter';

type WidgetConfig = { location: string; units: string };
type DashboardConfig = {
  theme: 'light' | 'dark' | 'system';
  widgets: Map<string, WidgetConfig>;
  hiddenWidgets: Set<string>;
  lastCustomizedAt: Date;
};

function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    const json = localStorage.getItem('dashboard-config');
    return json ? formatFromStore<DashboardConfig>(json) : getDefaultDashboardConfig();
  });

  const saveConfig = (newConfig: DashboardConfig) => {
    localStorage.setItem('dashboard-config', formatToStore(newConfig));
    setConfig(newConfig);
  };

  return { config, saveConfig };
}

// Usage
const example: DashboardConfig = {
  theme: 'dark',
  widgets: new Map([
    ['weather', { location: 'New York', units: 'metric' }],
    ['stocks', { location: 'NASDAQ', units: 'USD' }],
  ]),
  hiddenWidgets: new Set(['news']),
  lastCustomizedAt: new Date(),
};
```

---

### 2️⃣ React: Syncing Filters via URL (Shareable Dashboard Queries)

```tsx
import { useState } from 'react';
import { formatToStore, formatFromStore } from 'json-storage-formatter';

type DashboardQuery = {
  dateRange: { from: Date; to: Date };
  selectedCategories: Set<string>;
  additionalSettings: Map<string, unknown>;
};

function useUrlQuery() {
  const [query, setQuery] = useState<DashboardQuery>(() => {
    const params = new URLSearchParams(window.location.search);
    const storedQuery = params.get('query');
    return storedQuery ? formatFromStore<DashboardQuery>(atob(storedQuery)) : getDefaultDashboardQuery();
  });

  const updateQuery = (newQuery: DashboardQuery) => {
    const encoded = btoa(formatToStore(newQuery));
    window.history.replaceState(null, '', `${window.location.pathname}?query=${encoded}`);
    setQuery(newQuery);
  };

  return { query, updateQuery };
}
```

---

### 3️⃣ Framework-Agnostic: Node.js/Backend Example

```js
// Save and load any structure in Redis, PostgreSQL, or files
const { formatToStore, formatFromStore } = require('json-storage-formatter');

const session = {
  userId: 123,
  expires: new Date(),
  permissions: new Set(['read', 'write']),
};

// Store in Redis
redis.set('session:123', formatToStore(session));

// Later...
const raw = await redis.get('session:123');
const restored = formatFromStore(raw);
// restored.expires is a Date, restored.permissions is a Set
```

---

## 🧩 Supported Types

| Type         | Supported? | Restored As     |
| ------------ | ---------- | --------------- |
| Date         | ✅         | Date            |
| Set          | ✅         | Set             |
| Map          | ✅         | Map             |
| RegExp       | ✅         | RegExp          |
| Error        | ✅         | Error           |
| undefined    | ✅         | undefined       |
| NaN/Infinity | ✅         | number          |
| Function     | ❌         | (not supported) |

---

## 🧰 Utility Functions

| Function      | Description                              | Example                       |
| ------------- | ---------------------------------------- | ----------------------------- |
| **isNil**     | Checks if value is `null` or `undefined` | `isNil(null); // true`        |
| **isNumber**  | Checks if value is a number              | `isNumber(42); // true`       |
| **isBoolean** | Checks if value is a boolean             | `isBoolean(false); // true`   |
| **isString**  | Checks if value is a string              | `isString('hi'); // true`     |
| **isDate**    | Checks if value is a Date                | `isDate(new Date()); // true` |

---

## ⚖️ Comparison

| Behavior      | JSON.stringify  | json-storage-formatter   |
| ------------- | --------------- | ------------------------ |
| **Date**      | Becomes string  | ✅ Restored as Date      |
| **Set**       | Lost completely | ✅ Restored as Set       |
| **Map**       | Lost completely | ✅ Restored as Map       |
| **Undefined** | Omitted         | ✅ Restored as undefined |
| **Regexp**    | Lost completely | ✅ Restored as RegExp    |
| **Error**     | Lost completely | ✅ Restored as Error     |

---

## 📦 Installation

```bash
npm install json-storage-formatter
```

```bash
yarn add json-storage-formatter
```

---

## 📝 API Reference

### formatToStore(value)

Converts any value into a JSON-safe string with type metadata.

### formatFromStore<T>(string)

Restores the serialized string back to its original types.

---

## 💡 Pro Tips

- Use with any storage: localStorage, sessionStorage, AsyncStorage, Redis, PostgreSQL JSON columns, URLs, etc.
- Works with deeply nested structures.
- Framework-agnostic: use in React, Node.js, or vanilla JS/TS.

---

<div align="center">
<b>Serialize, store, and restore <i>any</i> JavaScript data type —<br />
without losing its identity. Lightweight. Fast. Reliable.</b>
<br /><br />
<a href="https://www.npmjs.com/package/json-storage-formatter">⭐ Try it on NPM</a>
</div>
