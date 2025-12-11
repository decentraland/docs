# Dependency Management Standard

This document defines the recommended practices for managing dependencies in JavaScript/TypeScript projects across Decentraland's ecosystem. It applies to front-end, back-end, SDKs, shared libraries, and any npm/yarn-based package.

> **TL;DR**: Use `peerDependencies` for shared libraries (React, @dcl/schemas, etc.) with version ranges (^). Use `dependencies` only for utilities safe to duplicate.

## 1. Rationale

Many libraries rely on global singletons, React Context, class identity, shared caches, schema enums, or shared DB pools. Installing multiple versions of the same library can cause:
- Context not shared between copies
- Duplicate caches or pools
- Failing instanceof checks
- Enum/symbol mismatches
- Increased bundle size
- Hard-to-diagnose runtime bugs

Correct dependency management prevents these issues.

## 2. Definitions

| Field | Purpose | Consumer responsibility |
|-------|---------|------------------------|
| `dependencies` | Packages used internally by the module | None - consumer is not expected to provide them |
| `peerDependencies` | Packages that must exist exactly once in runtime | Must install them |
| `devDependencies` | Tooling only used during development | None |

## 3. When to Use Each Field

### Use peerDependencies for:
- React, Redux, wagmi, ethers, viem
- @dcl/schemas and similar cross-ecosystem libraries
- decentraland/connect
- DB drivers when sharing pools
- Any library relying on singletons or context

✅ Correct:
```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "@dcl/schemas": "^20.0.0"
  }
}
```

❌ Incorrect:
```json
{
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

### Use dependencies for:
- Utilities safe to duplicate (lodash-es, date-fns)

✅ Correct:
```json
{
  "dependencies": {
    "lodash-es": "^4.17.0",
    "date-fns": "^3.0.0"
  }
}
```

### Use devDependencies for:
- Tooling (TypeScript, ESLint, testers, bundlers)

✅ Correct:
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "vitest": "^1.0.0"
  }
}
```

## 4. Versioning Rules

### Always use ranges (^ or >=)
Ensures npm/yarn can resolve a single installation.

✅ Correct:
```json
"peerDependencies": { "@dcl/schemas": "^20.2.0" }
```

❌ Incorrect:
```json
"peerDependencies": { "@dcl/schemas": "20.2.0" }
```

## 5. NPM v7+ Behavior

peerDependencies are auto-installed:
- If the project already has the dependency → that version is used
- If not → npm installs it
- Only one version is kept when ranges overlap

## 6. Common Scenarios

### Compatible ranges
`^20.2.0` and `^20.3.1` → one version installed (20.3.1+)

### Incompatible majors
`^19.x` and `^20.x` → npm warns and resolves if possible

### Exact mismatched versions
`20.2.0` vs `20.3.1` → resolution fails

## 7. Backend Considerations

Duplicate versions may cause:
- Extra DB pools
- Cache desynchronization
- Failing instanceof checks
- Schema mismatches

✅ Correct:
```json
"peerDependencies": {
  "@dcl/schemas": "^20.0.0",
  "pg": "^8.0.0"
}
```

## 8. Security & Vulnerabilities

Avoid pinning exact versions solely for security patches.

❌ Incorrect:
```json
"dependencies": { "minimatch": "3.0.8" }
```

✅ Correct:
```json
"dependencies": { "minimatch": "^3.1.0" }
```

## 9. Package.json Structure

Recommended field order:
1. name
2. version
3. description
4. main/module/types
5. scripts
6. dependencies
7. peerDependencies
8. devDependencies
9. engines
10. publishConfig

## 10. Decentraland Ecosystem Reference

Based on analysis of [Decentraland's public repositories](https://github.com/decentraland), the following packages are classified by their correct placement:

### Packages that MUST be peerDependencies

These packages rely on singletons, shared context, or must exist exactly once:

#### React Ecosystem
- `react`
- `react-dom`
- `react-redux`
- `react-router-dom`

#### State Management
- `redux`
- `@reduxjs/toolkit`

#### Web3 / Blockchain
- `ethers`
- `viem`
- `wagmi`

#### Decentraland Packages
- `@dcl/schemas`
- `@dcl/ui-env`
- `@dcl/crypto`
- `decentraland-dapps`
- `decentraland-ui`
- `decentraland-ui2`
- `decentraland-connect`

#### Backend / Database
- `pg`
- `pg-pool`

### Packages safe for dependencies

These utilities can be safely duplicated without side effects:

- `lodash-es`
- `date-fns`
- `uuid`
- `nanoid`
- `zod`
- `ajv`
- `ms`
- `mitt`
- `fp-future`

## 11. Tooling Support

To automate and enforce this standard, projects are encouraged to use [npm-package-json-lint](https://npmpackagejsonlint.org/). This tool validates the structure and contents of `package.json` files.

### Installation

```bash
npm install --save-dev npm-package-json-lint
```

### Add script to package.json

```json
{
  "scripts": {
    "lint:pkg": "npmPkgJsonLint ."
  }
}
```

### What the tool can validate

- Duplicated dependencies across fields
- Use of version ranges (caret `^`) instead of exact versions
- Incorrect placement of dependencies
- Presence or absence of specific libraries
- Consistent field ordering

### Suggested configuration

Create `.npmpackagejsonlintrc.json`:

```json
{
  "rules": {
    "prefer-caret-version-dependencies": "error",
    "prefer-caret-version-devDependencies": "error",
    "no-duplicate-properties": "error",
    "prefer-property-order": ["error", [
      "name", "version", "description", "main", "module", "types",
      "scripts", "dependencies", "peerDependencies", "devDependencies",
      "engines", "publishConfig"
    ]],
    "valid-values-dependencies": ["error", [
      "lodash-es",
      "date-fns",
      "uuid",
      "nanoid",
      "zod",
      "ajv",
      "ms",
      "mitt",
      "fp-future"
    ]],
    "valid-values-peerDependencies": ["error", [
      "react",
      "react-dom",
      "react-redux",
      "react-router-dom",
      "redux",
      "@reduxjs/toolkit",
      "ethers",
      "viem",
      "wagmi",
      "@dcl/schemas",
      "@dcl/ui-env",
      "@dcl/crypto",
      "decentraland-dapps",
      "decentraland-ui",
      "decentraland-ui2",
      "decentraland-connect",
      "pg",
      "pg-pool"
    ]]
  }
}
```

{% hint style="info" %}
In the future, we may introduce a shared configuration package (e.g., `@dcl/package-json-standard`) that repositories can extend for ecosystem-wide consistency.
{% endhint %}

## 12. Summary

### ✅ Correct:
- Use peerDependencies for shared libraries
- Use version ranges
- Keep ecosystem packages aligned

### ❌ Incorrect:
- Duplicate React or shared libs
- Pin exact peer versions
- Use dependencies for anything requiring a single instance

## 13. Related Standards

- [Testing Standards](./testing-standards/README.md)
- [UI Standards](./ui-standards/README.md)
- [Web UI Standards](./web-ui-standards/README.md)
- [WKC Architecture](./well-known-components/README.md)
- [API Documentation Guidelines](./api-documentation.md)
