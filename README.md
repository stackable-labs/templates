# Stackable Templates

Project templates for the [Stackable](https://stackable.com) extension platform.

## Templates

| Template | Description | Usage |
|---|---|---|
| [app-extension](./app-extension) | Full-stack extension starter with preview host | `npx @stackable-labs/create-extension my-extension` |

## Usage

The easiest way to use these templates is through the Stackable CLI:

```bash
npx @stackable-labs/create-extension my-extension
```

This will scaffold a new extension project with:
- `packages/extension/` — Your extension source code
- `packages/preview/` — Local preview host app for development
- Preconfigured Vite, TypeScript, and Turborepo setup
- Hot-reload development workflow via `pnpm dev`

## License

See individual template directories for license information.
