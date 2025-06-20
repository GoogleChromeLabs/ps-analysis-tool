# Developer Workflows

This documentation provides the commands necessary for developing the extension and CLI packages.

## Extension Workflows

### Development Mode

To run the extension in development mode for continuous changes only for the extension package, use:
```bash
npm run vite:dev:ext
```

If you are making continuous changes in the extension or any packages it depends on, use:
```bash
npm run dev:ext
```

### Build Extension

To build the extension after making changes, use:
```bash
npm run build:ext
```

## CLI Workflows

### Development Mode

To run the CLI in development mode for continuous changes only for the cli package, use:
```bash
npm run vite:dev:cli
```

If you are making continuous changes in the CLI or any packages it relies on, use:
```bash
npm run dev:cli
```

### Build CLI

After making changes in the `cli`, `cli-dashboard`, or any CLI-related packages, use:
```bash
npm run build:cli:dashboard
```

## Build Workflows

### TypeScript Packages

To build all TypeScript packages together, use:
```bash
npm run build:tsc-packages
```

### Individual Packages

To build individual packages, use the following syntax:
```bash
npm run build:[package-name]
```

### All Packages

To build all packages together, use:
```bash
npm run build:all
```

## Update the Cookie Database

Any changes to the cookie database need to be updated before a release. To update the cookie database, use:
```bash
npm run cookie-db:update
```
