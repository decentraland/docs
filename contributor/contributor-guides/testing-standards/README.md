# Testing Standards

This section describes the way in which tests are made in the different services and UIs across Decentraland projects.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

## Overview

Testing is a critical part of our development process. We maintain high standards for test coverage and quality across all our projects. This documentation provides comprehensive guidelines for:

* **[Writing Tests](writing-tests.md)** - General principles and patterns for writing maintainable, clear tests
* **[Testing UIs](testing-uis.md)** - Testing React components, Redux sagas, reducers, selectors, and action creators
* **[Testing Services (Well-Known-Component)](testing-services-wkc.md)** - Testing modular services built with the well-known-component architecture
* **[Testing Services (Deprecated)](testing-services-deprecated.md)** - Legacy approach for testing services (for reference)
* **[Testing End-to-End](testing-e2e.md)** - E2E testing with Cypress (Work in Progress)

## Testing Philosophy

Our testing approach emphasizes:

* **Clarity** - Tests should be self-documenting and easy to understand
* **Maintainability** - Tests should be easy to update when requirements change
* **Isolation** - Each test should run independently without affecting others
* **Coverage** - All critical paths and edge cases should be tested
* **Value** - Tests should provide confidence that the code works as intended

## Quick Links

* [How to describe contexts with `describe`](writing-tests.md#describing-and-building-context)
* [How to write expectations with `it`](writing-tests.md#describing-expectations-and-executing-code)
* [What to test and when](writing-tests.md#what-to-test)
* [When and how to mock](writing-tests.md#when-to-mock)

## Related Standards

* [Dependency Management](../dependency-management.md) - Managing npm dependencies and peerDependencies
* [UI Standards](../ui-standards/README.md) - Redux and RTK Query patterns
* [API Documentation](../api-documentation.md) - OpenAPI documentation standards

