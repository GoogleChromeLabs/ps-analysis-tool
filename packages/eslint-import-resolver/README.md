# eslint-import-resolver

Custom resolver for eslint-plugin-import to resolve packages locally in a monorepo.

```
{
  "settings": {
    "import/resolver": {
      "@cookie-analysis-tool/eslint-import-resolver": {
        "mapping": {
          "^@foo\\/(.*)": "./packages/$1/src/",
        }
      }
    }
  }
}
```

With this config, a package named @foo/bar will be looked up in packages/bar/src