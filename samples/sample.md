# VS Code Theme Preview — Markdown Sample

> A comprehensive Markdown file demonstrating various syntax elements
> for previewing VS Code color themes.

---

## Table of Contents

- [Headings](#headings)
- [Text Formatting](#text-formatting)
- [Lists](#lists)
- [Code](#code)
- [Tables](#tables)
- [Links & Images](#links--images)
- [Blockquotes](#blockquotes)
- [Task Lists](#task-lists)
- [Math](#math)
- [Footnotes](#footnotes)

---

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Text Formatting

This is **bold text** and this is *italic text*. You can also use __bold__ and _italic_ with underscores.

Here's ***bold and italic*** combined, and ~~strikethrough~~ text.

This sentence has `inline code` within it.

> **Note:** This is an important callout with **bold** inside a blockquote.

---

## Lists

### Unordered List

- First item
- Second item
  - Nested item 2a
  - Nested item 2b
    - Deeply nested item
- Third item

### Ordered List

1. First step
2. Second step
   1. Sub-step 2.1
   2. Sub-step 2.2
3. Third step
4. Fourth step

### Definition List

Term 1
: Definition for term 1

Term 2
: Definition for term 2
: Another definition for term 2

---

## Code

### Inline Code

Use `console.log()` for debugging. The `Array.prototype.map()` method creates a new array.

### Fenced Code Blocks

```javascript
// JavaScript with syntax highlighting
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log(fibonacci(10)); // 55
```

```python
# Python with syntax highlighting
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    name: str
    email: str
    age: Optional[int] = None

    def greet(self) -> str:
        return f"Hello, {self.name}!"

users = [User("Alice", "alice@example.com", 30)]
```

```typescript
// TypeScript with syntax highlighting
interface Config {
  apiUrl: string;
  timeout: number;
  retries?: number;
}

async function fetchData<T>(config: Config): Promise<T> {
  const { apiUrl, timeout, retries = 3 } = config;
  const response = await fetch(apiUrl, { signal: AbortSignal.timeout(timeout) });
  return response.json() as Promise<T>;
}
```

```bash
# Shell script
#!/bin/bash
set -euo pipefail

echo "Deploying application..."
docker build -t myapp:latest .
docker push myapp:latest
kubectl rollout restart deployment/myapp
echo "✅ Deployment complete!"
```

```json
{
  "name": "theme-preview",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

```css
/* CSS example */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
```

```diff
- const oldValue = "before";
+ const newValue = "after";

- function deprecated() {
-   return null;
- }
+ function improved() {
+   return { success: true };
+ }
```

---

## Tables

| Feature        | Status     | Priority | Owner   |
|:---------------|:----------:|:--------:|--------:|
| Authentication | ✅ Done    | High     | Alice   |
| Dashboard      | 🔄 Active | Medium   | Bob     |
| API v2         | 📋 Planned | High     | Charlie |
| Dark Mode      | ✅ Done    | Low      | Diana   |
| Mobile App     | ❌ Blocked | Critical | Eve     |

### Alignment Examples

| Left-aligned | Center-aligned | Right-aligned |
|:-------------|:--------------:|--------------:|
| Content      | Content        | Content       |
| More         | More           | More          |

---

## Links & Images

### Links

- [GitHub](https://github.com)
- [VS Code Marketplace](https://marketplace.visualstudio.com)
- [Internal Link](#table-of-contents)
- <https://example.com> (autolink)

### Reference Links

Check out [React][react-docs] and [TypeScript][ts-docs] documentation.

[react-docs]: https://react.dev "React Documentation"
[ts-docs]: https://www.typescriptlang.org/docs/ "TypeScript Documentation"

### Images

![VS Code Logo](https://code.visualstudio.com/favicon.ico "Visual Studio Code")

---

## Blockquotes

> Simple blockquote.

> Multi-line blockquote that spans
> across multiple lines to demonstrate
> how longer quotes appear.

> **Nested blockquotes:**
>
> > This is a nested blockquote.
> >
> > > And this is even deeper!

> [!NOTE]
> This is a GitHub-style note admonition.

> [!WARNING]
> This is a warning — pay attention to this!

> [!TIP]
> Here's a helpful tip for better results.

---

## Task Lists

- [x] Set up project structure
- [x] Configure TypeScript
- [x] Implement authentication
- [ ] Write unit tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production
  - [x] Configure staging
  - [ ] Configure production
  - [ ] Set up monitoring

---

## Math

Inline math: $E = mc^2$

Block math:

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

---

## Footnotes

This statement needs a citation[^1]. And here's another reference[^note].

[^1]: This is the first footnote with a simple explanation.
[^note]: This is a longer footnote with more detail.

    It can span multiple paragraphs and include `code`.

---

## Horizontal Rules

Three different ways:

---

***

___

---

## HTML in Markdown

<details>
<summary>Click to expand</summary>

This content is hidden by default. It can contain:

- **Bold text**
- `Inline code`
- [Links](https://example.com)

</details>

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> — Open Command Palette

Text with <mark>highlighted</mark> content and <sup>superscript</sup> and <sub>subscript</sub>.

---

## Emoji

:rocket: :star: :heavy_check_mark: :warning: :x:

🚀 ⭐ ✅ ⚠️ ❌ 🎨 💡 📝 🔧 🐛

---

*Last updated: 2025-01-15 | Generated for VS Code theme testing*