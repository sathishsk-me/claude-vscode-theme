# Claude Code Theme

[![Version](https://vsmarketplacebadges.dev/version/sathishsk-me.claude-theme-for-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=sathishsk-me.claude-theme-for-vscode)
[![Installs](https://vsmarketplacebadges.dev/installs/sathishsk-me.claude-theme-for-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=sathishsk-me.claude-theme-for-vscode)
[![Rating](https://vsmarketplacebadges.dev/rating-star/sathishsk-me.claude-theme-for-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=sathishsk-me.claude-theme-for-vscode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A dark theme for Visual Studio Code inspired by the **Claude Code** terminal interface - featuring warm oranges, deep darks, and cream accents for a comfortable and focused coding experience.

<!-- Uncomment and add your screenshots -->
![Claude Code Theme Preview](https://raw.githubusercontent.com/sathishsk-me/claude-vscode-theme/master/images/screenshot-main.png)

---

## Theme Variants

This extension includes **two** carefully crafted dark theme variants:

### Claude Code

The primary theme with a deep, dark background and balanced contrast. Ideal for long coding sessions with carefully selected colors that reduce eye strain.

![Claude Code](https://raw.githubusercontent.com/sathishsk-me/claude-vscode-theme/master/images/screenshot-claude-code.png)

### Claude Code Warm

A warmer variation with amber and orange tones that creates a cozy, inviting atmosphere. Perfect for evening coding or if you prefer warmer color temperatures.

![Claude Code Warm](https://raw.githubusercontent.com/sathishsk-me/claude-vscode-theme/master/images/screenshot-claude-code-warm.png)

---

## Installation

### From VS Code Marketplace

1. Open **VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Claude Code Theme"**
4. Click **Install**
5. Open the Color Theme picker (`Ctrl+K Ctrl+T` / `Cmd+K Cmd+T`)
6. Select **Claude Code** or **Claude Code Warm**

### From Command Line

```bash
code --install-extension sathishsk-me.claude-theme-for-vscode
```

---

## Color Palette

| Element    | Preview                                                                    | Hex       |
|------------|----------------------------------------------------------------------------|-----------|
| Background | ![Background](https://placehold.co/60x20/1a1a1a/1a1a1a)                   | `#1a1a1a` |
| Foreground | ![Foreground](https://placehold.co/60x20/c3c1ba/c3c1ba)                   | `#c3c1ba` |
| Sidebar    | ![Sidebar](https://placehold.co/60x20/2a2a2a/2a2a2a)                      | `#2a2a2a` |
| Keywords   | ![Keywords](https://placehold.co/60x20/d87757/FFF?text=keyword)            | `#d87757` |
| Strings    | ![Strings](https://placehold.co/60x20/51a556/FFF?text=string)             | `#51a556` |
| Functions  | ![Functions](https://placehold.co/60x20/4492e7/FFF?text=function)          | `#4492e7` |
| Numbers    | ![Numbers](https://placehold.co/60x20/9c87f6/FFF?text=number)             | `#9c87f6` |
| Types      | ![Types](https://placehold.co/60x20/f7f5ee/333?text=type)                 | `#f7f5ee` |
| Comments   | ![Comments](https://placehold.co/60x20/b7b5a6/333?text=comment)           | `#b7b5a6` |

---

## Supported Languages

The theme has been tested and optimized for syntax highlighting in:

- JavaScript / TypeScript / JSX / TSX
- Python
- Java
- HTML / CSS / SCSS
- JSON / XML / YAML
- Markdown
- Bash / Shell
- Go / Rust / C / C++
- SQL
- And many more through VS Code's TextMate grammar support

---

## Customization

You can override specific colors in your `settings.json`:

```jsonc
{
  "workbench.colorCustomizations": {
    "[Claude Code]": {
      "editor.background": "#1e1e1e",
      "sideBar.background": "#1a1a1a"
    }
  },
  "editor.tokenColorCustomizations": {
    "[Claude Code]": {
      "comments": "#9a9a8a",
      "strings": "#61b566"
    }
  }
}
```

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/my-improvement`
3. Commit your changes — `git commit -m 'Add some improvement'`
4. Push to the branch — `git push origin feature/my-improvement`
5. Open a Pull Request

### Local Development

```bash
git clone https://github.com/sathishsk-me/claude-vscode-theme.git
cd claude-vscode-theme
code .

# Press F5 to launch the Extension Development Host
```

Theme files are in the `themes/` directory:

- `themes/claude-code-color-theme.json` — Claude Code (default)
- `themes/claude-code-warm-color-theme.json` — Claude Code Warm

Sample files for testing syntax highlighting are in `samples/`.

---

## Feedback

- Found a bug? [Open an issue](https://github.com/sathishsk-me/claude-vscode-theme/issues)
- Have a suggestion? [Start a discussion](https://github.com/sathishsk-me/claude-vscode-theme/discussions)
- Enjoying the theme? [Rate it on the Marketplace](https://marketplace.visualstudio.com/items?itemName=sathishsk-me.claude-theme-for-vscode&ssr=false#review-details)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Enjoy coding with Claude Code Theme.**
