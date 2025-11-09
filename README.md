# json-storage-formatter 🌟

![Image John Avatar](https://raw.githubusercontent.com/johnny-quesada-developer/global-hooks-example/main/public/avatar2.jpeg)

A **lightweight solution** to format complex JavaScript objects for string-based storage systems **without losing their types**. 🚀

## 🤔 The Problem?

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

When working with tools like **localStorage**, **sessionStorage**, **AsyncStorage**, or even databases like **Redis** or **PostgreSQL (JSON columns)**, we often need to store application state or configuration objects as strings using `JSON.stringify`.

_But there’s a catch!:_

`JSON.stringify` has no idea what to do with values like `Date`, `Map`, or `Set`...  
It just flattens them into empty objects or strings, making you lose the original data types or the entire structure.

---

## 💡 What json-storage-formatter Does

Exposes **two simple functions**:

1. `formatToStore(value)` → safely prepares your data for storage, returning a JSON string representation.
2. `formatFromStore(value)` → restores it to the **exact original shape and types**.

As simple as that.

# Let’s see a couple of examples

---

## ⚙️ Example: useDashboardConfig Hook

Let’s create a hook that syncs `localStorage` with React state:

```ts
import { formatToStore, formatFromStore } from 'json-storage-formatter';

type DashboardConfig = {
  theme: 'light' | 'dark' | 'system';
  widgets: Map<string, WidgetConfig>;
  hiddenWidgets: Set<string>;
  lastCustomizedAt: Date;
};

const useDashboardConfig = () => {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    const json = localStorage.getItem('dashboard-config');

    if (json) return formatFromStore<DashboardConfig>(json);

    return getDefaultDashboardConfig();
  });

  const saveConfig = (newConfig: DashboardConfig) => {
    localStorage.setItem('dashboard-config', formatToStore(newConfig));
    setConfig(newConfig);
  };

  return { config, saveConfig };
};

// Even if the config contains Maps, Sets, or Dates, they will be preserved.
const example: DashboardConfig = {
  theme: 'dark',
  widgets: new Map([
    ['weather', { location: 'New York', units: 'metric' }],
    ['stocks', { symbols: ['AAPL', 'GOOGL'] }],
  ]),
  hiddenWidgets: new Set(['news']),
  lastCustomizedAt: new Date(),
};
```

---

## 🌐 Example: Sync Dashboard Queries Through URL (Dashboards / Reports)

This pattern is common in dashboards, where filters are shared via URL.  
You can safely serialize complex filters (with Dates, Sets, Maps, etc.) and encode them for sharing.

```tsx
import { formatToStore, formatFromStore } from 'json-storage-formatter';

type DashboardQuery = {
  dateRange: { from: Date; to: Date };
  selectedCategories: Set<string>;
  additionalSettings: Map<string, unknown>;
};

const useUrlQuery = () => {
  const [query, setQuery] = useState<DashboardQuery>(() => {
    const params = new URLSearchParams(location.search);
    const storedQuery = params.get('query');

    if (storedQuery) {
      // decode from base64 and restore types
      return formatFromStore<DashboardQuery>(atob(storedQuery));
    }

    return getDefaultDashboardQuery();
  });

  const updateQuery = (newQuery: DashboardQuery) => {
    const encoded = btoa(formatToStore(newQuery));

    // encode the JSON as base64 to make it URL-safe
    // avoids breaking query strings with +, /, or = characters
    window.history.replaceState(null, '', `\${location.pathname}?query=\${encoded}`);

    setQuery(newQuery);
  };

  return { query, updateQuery };
};
```

The examples above use React, but the library itself is **framework-agnostic**  
and can be used anywhere in JavaScript or TypeScript projects.

---

## 🧩 Why It’s Useful

This becomes incredibly powerful when your app needs to **sync complex state**
to a string-based storage layer — like when syncing to **localStorage**, **Redis**, or a **shared dashboard URL**.

Instead of being limited by what JSON can handle,
you can now serialize **any structure** — Maps, Sets, nested objects, or Dates —
and restore it back without losing context or meaning.

---

## 🧠 How It Works

Under the hood, `formatToStore` adds small metadata markers to every special value.  
Each piece of data gets a structure like this:

```json
{
  "$t": "map",
  "$v": [["key", { "$t": "date", "$v": "2024-10-01T10:30:00.000Z" }]]
}
```

The `$t` field stores the **type**, and `$v` holds the actual value.  
When using `formatFromStore`, it reads that metadata and recreates your data structure  
exactly as it was before — even if it’s deeply nested.

Resulting in:

```ts
new Map([['key', new Date('2024-10-01T10:30:00.000Z')]]);
```

---

## ⚙️ API Reference

### 🟣 formatToStore

Converts any value into a JSON-safe structure with internal type metadata.

```ts
const objectWithMetadata = formatToStore(object);
```

### 🔵 formatFromStore<T>

Restores the serialized object back to its original types.

```ts
const result = formatFromStore<Map<string, unknown>>(objectWithMetadata);
```

Both functions work directly with strings,  
so you can safely use them with localStorage, AsyncStorage, or URLs.

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

or

```bash
yarn add json-storage-formatter
```

---

## 🎯 Ready to Try It?

📘 **NPM:** [json-storage-formatter](https://www.npmjs.com/package/json-storage-formatter)  
Serialize, store, and restore **any JavaScript data type** without losing its identity — lightweight, fast. ✨
