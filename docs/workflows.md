# Workflows

## Extension workflows

After making changes in the `extension` package, you need to run:
```bash
npm run build:ext
```

If you are going to make continous changes in the extension package you need to run the extension in development mode then run:

```bash
npm run webpack:dev:ext
```

If you are going to make continous changes in any extension or packages that the extension depends on then run:

```bash
npm run dev:ext
```

## CLI workflows

After making changes in the `CLI` or any `CLI-dashboard` or any CLI related packages, you need to run:
```bash
npm run build:cli
```

If you are going to make continous changes only in the cli package you need to run the cli in development mode then run:

```bash
npm run webpack:dev:cli
```

If you are going to make continous changes in CLI or packages that CLI relies on then run:

```bash
npm run dev:cli
```

## Typescript build workflows

To build all the packages together run:

```bash
npm run build:all
```

To build all the typescript packages together run:

```bash
npm run build:tsc-packages
```

To build individual packages you can utilise the following syntax:

```bash
npm run build:[package-name]
```

## Update the cookie database

Any changes to the cookie database needs to be updated before a release is being done. To update the cookie database run:
To build all the packages together run:

```bash
npm run cookie-db:update
```
