# Dependency Management Standard

This document defines the recommended practices for managing dependencies in JavaScript/TypeScript projects across Decentraland's ecosystem. It applies to front-end, back-end, SDKs, shared libraries, and any npm/yarn/pnpm-based package.

> **TL;DR**: 
> - **Version strategy** → Use **exact/fixed versions** for `dependencies` (security) and `devDependencies` (consistent dev environment). Use **version ranges** only for `peerDependencies` (flexibility).
> - **Libraries/shared packages** → Use `peerDependencies` with version ranges (^) for shared libraries (React, @dcl/schemas, etc.). Use `dependencies` with exact versions only for utilities safe to duplicate.
> - **Apps/final services** → Use `dependencies` with exact versions for runtime packages (React, ethers, etc.).

## 1. Rationale

Many libraries rely on global singletons, React Context, class identity, shared caches, schema enums, or shared DB pools. Installing multiple versions of the same library can cause:
- Context not shared between copies
- Duplicate caches or pools
- Failing instanceof checks
- Enum/symbol mismatches
- Increased bundle size
- Hard-to-diagnose runtime bugs

Correct dependency management prevents these issues.

### Non-goals

This standard does **not** attempt to:
- Enforce a single package manager (npm, yarn, pnpm are all supported)
- Guarantee a single physical copy in `node_modules` (focus is on runtime/bundle deduplication)

## 2. Definitions

| Field | Purpose | Consumer responsibility | Applies to |
|-------|---------|------------------------|------------|
| `dependencies` | Packages used internally by the module | None - consumer is not expected to provide them | Apps and libraries |
| `peerDependencies` | Packages that must resolve to a single effective version at runtime | Must install them (or use peerDependenciesMeta for optional) | **Libraries only** |
| `peerDependenciesMeta` | Metadata for peerDependencies, used to mark peers as optional | None - only affects package manager behavior | **Libraries only** |
| `devDependencies` | Tooling only used during development | None | Apps and libraries |

### About peerDependenciesMeta

`peerDependenciesMeta` is a field that provides metadata about your `peerDependencies`. The most common use case is marking peers as **optional**:

- **Required peers** (default): Package manager will warn if not installed
- **Optional peers**: Package manager won't warn if missing; your package should handle their absence gracefully

This is useful for packages that can work with or without certain dependencies (e.g., a utility that works with or without React, or a library that supports multiple Web3 providers).

### Apps vs Libraries

**Libraries / Shared Packages:**
- Use `peerDependencies` for packages that must resolve to a single effective version at runtime (React, ethers, @dcl/schemas)
- Consumer (app) provides these dependencies
- Prevents duplicate installations and singleton conflicts

**Apps / Final Services:**
- Often use `dependencies` for runtime packages (React, ethers, etc.)
- They are the final consumer, so duplication is not a concern
- `peerDependencies` still valid if the app might be consumed as a dependency

## 3. When to Use Each Field

> **Quick reference**: See [Section 10](#10-decentraland-ecosystem-reference) for a complete list of packages and their recommended placement.

### Use peerDependencies for (Libraries only):

**In shared libraries/packages**, use `peerDependencies` for packages that must resolve to a single effective version at runtime:
- React, Redux, wagmi, ethers, viem
- @dcl/schemas and similar cross-ecosystem libraries
- decentraland/connect
- DB drivers when sharing pools
- Any library relying on singletons or context

✅ Correct (Library):
```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "@dcl/schemas": "^20.0.0"
  }
}
```

❌ Incorrect (Library using dependencies for shared libs):
```json
{
  "dependencies": {
    "react": "^18.0.0"
  }
}
```

### Use dependencies for:
- Utilities safe to duplicate (lodash-es, date-fns)
- **In apps**: Runtime packages like React, ethers (when app is final consumer)

> **Important**: Always use **exact/fixed versions** in `dependencies` for security (see [Section 4](#4-versioning-rules)).

✅ Correct (Library):
```json
{
  "dependencies": {
    "lodash-es": "4.17.21",
    "date-fns": "3.6.0"
  }
}
```

✅ Correct (App):
```json
{
  "dependencies": {
    "react": "18.3.1",
    "ethers": "6.13.0",
    "lodash-es": "4.17.21"
  }
}
```

### Optional peerDependencies (peerDependenciesMeta)

For reusable packages that work with or without certain dependencies, use `peerDependenciesMeta` to mark peers as optional:

✅ Correct:
```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "ethers": "^6.0.0"
  },
  "peerDependenciesMeta": {
    "ethers": {
      "optional": true
    }
  }
}
```

**What this means:**
- `react` is **required**: Consumer must install it or package manager will warn
- `ethers` is **optional**: Consumer doesn't need to install it; your package should check for its presence before using it

**Use cases:**
- Packages that work in both React and non-React environments
- Libraries that support multiple Web3 providers (ethers, viem, etc.)
- Utilities that enhance other libraries but aren't required

### Use devDependencies for:
- Tooling (TypeScript, ESLint, testers, bundlers)

> **Important**: Always use **exact/fixed versions** in `devDependencies` to ensure a consistent development environment across the team (see [Section 4](#4-versioning-rules)).

✅ Correct:
```json
{
  "devDependencies": {
    "typescript": "5.4.5",
    "eslint": "8.57.0",
    "vitest": "1.6.0"
  }
}
```

## 4. Versioning Rules

### Use fixed versions for dependencies and devDependencies

**For dependencies (security):** Using version ranges (`^` or `~`) exposes the project to supply chain attacks. Malicious code can be injected in minor or patch releases, affecting all consumers automatically. **Use exact/fixed versions** to ensure reproducible builds and security.

**For devDependencies (consistency):** Using exact versions ensures all team members work with the same development environment, avoiding "works on my machine" issues and ensuring consistent linting, formatting, and build outputs.

**For peerDependencies:**
- Use version ranges (`^` or explicit ranges) to allow flexibility
- Example: `"react": "^18.0.0"` or `"react": ">=18.0.0 <19.0.0"`
- This allows consumers to use any compatible version

✅ Correct (dependencies - exact versions):
```json
"dependencies": { 
  "lodash-es": "4.17.21",
  "date-fns": "3.6.0"
}
```

✅ Correct (devDependencies - exact versions):
```json
"devDependencies": { 
  "typescript": "5.4.5",
  "eslint": "8.57.0"
}
```

✅ Correct (peerDependencies - version ranges):
```json
"peerDependencies": { 
  "@dcl/schemas": "^20.2.0",
  "react": ">=18.0.0 <19.0.0"
}
```

❌ Incorrect (dependencies with ranges):
```json
"dependencies": { "lodash-es": "^4.17.0" }
```

## 5. Package Manager Behavior

### NPM v7+ / Yarn / pnpm

**peerDependencies behavior:**
- If the project already has the dependency → that version is used
- If not → package manager installs it (npm v7+, yarn, pnpm)
- **Must resolve to a single effective version at runtime/bundle**
- Note: Package managers may keep multiple physical copies in node_modules, but only one version should be active in the bundle

**Package manager differences:**
- **npm**: Auto-installs peers since v7
- **yarn**: Auto-installs peers by default
- **pnpm**: Strict peer dependency resolution; may require explicit configuration

**Important:** The goal is runtime/bundle deduplication, not necessarily a single physical copy in node_modules.

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

✅ Correct (Library):
```json
"peerDependencies": {
  "@dcl/schemas": "^20.0.0",
  "pg": "^8.0.0"
}
```

## 8. Security & Vulnerabilities

### Use exact versions to prevent supply chain attacks

Using exact/fixed versions in `dependencies` and `devDependencies` protects against malicious code injection in minor or patch releases.

✅ Correct:
```json
"dependencies": { "minimatch": "3.1.2" }
```

❌ Incorrect (vulnerable to supply chain attacks):
```json
"dependencies": { "minimatch": "^3.1.0" }
```

### Use overrides / resolutions for CVEs

For security vulnerabilities in transitive dependencies, use package manager overrides:

**npm (package.json):**
```json
{
  "overrides": {
    "minimatch": "^3.1.2"
  }
}
```

**yarn (package.json):**
```json
{
  "resolutions": {
    "minimatch": "^3.1.2"
  }
}
```

**pnpm (package.json):**
```json
{
  "pnpm": {
    "overrides": {
      "minimatch": "^3.1.2"
    }
  }
}
```

This is the recommended practice for addressing CVEs without pinning versions in dependencies.

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

Based on analysis of [Decentraland's public repositories](https://github.com/decentraland), the following examples illustrate common patterns for package placement.

> **Note**: These are **examples**, not an exhaustive list. Apply the principles from [Section 2](#2-definitions) and [Section 3](#3-when-to-use-each-field) to determine the correct placement for your specific packages. These guidelines apply primarily to **libraries/shared packages**. In **apps/final services**, using `dependencies` for these packages is often acceptable and sometimes preferred.

### Example packages that SHOULD be peerDependencies (in libraries)

These examples rely on singletons, shared context, or should resolve to a single effective version at runtime:

#### React Ecosystem
- `react`, `react-dom`
- `react-redux`, `react-router-dom`

#### State Management
- `redux`, `@reduxjs/toolkit`

#### Web3 / Blockchain
- `ethers`, `viem`, `wagmi`

#### Decentraland Packages
- `@dcl/schemas`, `@dcl/ui-env`, `@dcl/crypto`
- `decentraland-dapps`, `decentraland-ui`, `decentraland-ui2`, `decentraland-connect`

#### Backend / Database
- `pg`, `pg-pool` (when sharing connection pools)

**Principle**: If a package uses singletons, shared context, or requires a single effective version at runtime, it should be a `peerDependency` in libraries.

### Example packages safe for dependencies

These utilities can be safely duplicated without side effects:

- `lodash-es`, `date-fns`
- `uuid`, `nanoid`
- `zod`, `ajv`
- `ms`, `mitt`, `fp-future`

**Principle**: Pure utility functions and stateless libraries can safely be in `dependencies` even in libraries, as they don't rely on singletons or shared state. **Always use exact versions** for security.

## 11. Tooling Support

To automate and enforce this standard, projects are encouraged to use [npm-package-json-lint](https://npmpackagejsonlint.org/). This tool validates the structure and contents of `package.json` files.

> **Reference**: See the full list of available rules at [npm-package-json-lint rules documentation](https://npmpackagejsonlint.org/docs/rules).

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
- Use of exact versions vs version ranges
- Incorrect placement of dependencies
- Presence or absence of specific libraries
- Consistent field ordering
- Disallowed dependency sources (file, git)

### Suggested configuration (per repository)

> **Important**: The configuration below is designed for **repository-specific** enforcement. For ecosystem-wide standards, use allowlists or rules that adapt to package type (library vs app).

Create `.npmpackagejsonlintrc.json`:

```json
{
  "rules": {
    "prefer-absolute-version-dependencies": "warning",
    "prefer-absolute-version-devDependencies": "warning",
    "prefer-caret-version-peerDependencies": "error",
    "no-file-dependencies": "error",
    "no-git-dependencies": "error",
    "no-duplicate-properties": "error",
    "prefer-property-order": ["error", [
      "name", "version", "description", "main", "module", "types",
      "scripts", "dependencies", "peerDependencies", "devDependencies",
      "engines", "publishConfig"
    ]]
  }
}
```

**Rule explanations:**
- `prefer-absolute-version-dependencies`: Encourages exact versions in dependencies (security against supply chain attacks)
- `prefer-absolute-version-devDependencies`: Encourages exact versions in devDependencies (consistent development environment across team)
- `prefer-caret-version-peerDependencies`: Ensures peerDependencies use ranges for flexibility
- `no-file-dependencies`: Prevents local file path dependencies (not portable)
- `no-git-dependencies`: Prevents git URL dependencies (not reproducible, security risk)

### Repository-specific allowlists (optional)

For stricter enforcement within a repository, you can add allowlists. **These should be tailored per repository**, not applied globally:

```json
{
  "rules": {
    "valid-values-dependencies": ["warn", [
      "lodash-es",
      "date-fns",
      "uuid",
      "nanoid"
    ]],
    "valid-values-peerDependencies": ["warn", [
      "react",
      "react-dom",
      "@dcl/schemas"
    ]]
  }
}
```

{% hint style="warning" %}
**Avoid global allowlists**: The strict allowlist rules shown above are **dangerous as ecosystem-wide standards**. They should only be used:
- Within a single repository with known package types
- With rules that adapt based on package type (library vs app)
- As warnings, not errors, to allow flexibility
{% endhint %}

{% hint style="info" %}
In the future, we may introduce a shared configuration package (e.g., `@dcl/package-json-standard`) that repositories can extend for ecosystem-wide consistency, with rules that adapt to package type.
{% endhint %}

## 12. Summary

### ✅ Correct:

**For Libraries:**
- Use `peerDependencies` for shared libraries (React, ethers, @dcl/schemas)
- Use version ranges (^ or explicit ranges) **only for peerDependencies**
- Use `peerDependenciesMeta` for optional peers
- Use `dependencies` only for utilities safe to duplicate

**For Apps:**
- Often use `dependencies` for runtime packages (React, ethers, etc.)
- Use `overrides`/`resolutions` for security patches (CVEs)
- Ensure packages resolve to a single effective version at runtime

**General:**
- Use **exact/fixed versions** for `dependencies` (supply chain security) and `devDependencies` (consistent dev environment)
- Use **version ranges** only for `peerDependencies` (consumer flexibility)
- Use overrides/resolutions for transitive dependency CVEs
- Configure linting per repository, not globally
- Avoid file and git dependencies

### ❌ Incorrect:
- Libraries using `dependencies` for shared singletons (React, ethers)
- Using version ranges (`^`, `~`) in dependencies/devDependencies (supply chain risk)
- Using file or git dependencies (not portable, security risk)
- Applying strict allowlists globally across ecosystem
- Assuming single physical copy (focus on runtime deduplication)

## 13. Related Standards

- [Testing Standards](./testing-standards/README.md)
- [UI Standards](./ui-standards/README.md)
- [Web UI Standards](./web-ui-standards/README.md)
- [WKC Architecture](./well-known-components/README.md)
- [API Documentation Guidelines](./api-documentation.md)
