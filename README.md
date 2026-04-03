# Neat Note

🧹 A VS Code extension to normalize Python comments.

## Features

- 🚫 **Remove Emojis**: Clean up AI-generated emojis in comments (e.g., `# 🚀` → `#`).
- 📏 **Fix Spacing**: Ensure space after `#` (e.g., `#fix` → `# fix`).
- ⚙️ **Configurable**: Enable/disable rules via settings.
- ⚡ **Fast**: Supports Format Document & Format On Save.

## Usage

1. Open a Python file.
2. Run command `Neat Note: Normalize Comments` from Command Palette.
3. Or use `Format Document` (Shift+Alt+F).
4. Or enable `Editor: Format On Save`.

## Configuration

| Setting | Default | Description |
| :--- | :--- | :--- |
| `neat-note.removeEmoji` | `true` | Remove emojis from comments |
| `neat-note.fixSpacing` | `true` | Fix spacing after # |

## Installation from VSIX

1. Download the `.vsix` file.
2. Open VS Code Extensions panel.
3. Click `...` → `Install from VSIX...`.
4. Select the file.

## License

MIT