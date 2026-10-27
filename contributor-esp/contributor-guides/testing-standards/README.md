# Estándares de Pruebas

Esta sección describe la forma en que se realizan las pruebas en los diferentes servicios e IUs a través de los proyectos de Decentraland.

Las palabras clave "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY" y "OPTIONAL" en este documento deben interpretarse como se describe en [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

## Resumen

Las pruebas son una parte crítica de nuestro proceso de desarrollo. Mantenemos altos estándares para la cobertura y calidad de las pruebas a través de todos nuestros proyectos. Esta documentación proporciona guías completas para:

* **[Escribir Pruebas](writing-tests.md)** - Principios generales y patrones para escribir pruebas mantenibles y claras
* **[Probar IUs](testing-uis.md)** - Probar componentes React, sagas Redux, reducers, selectores y creadores de acciones
* **[Probar Servicios (Well-Known-Component)](testing-services-wkc.md)** - Probar servicios modulares construidos con la arquitectura well-known-component
* **[Probar Servicios (Obsoleto)](testing-services-deprecated.md)** - Enfoque legado para probar servicios (para referencia)
* **[Pruebas End-to-End](testing-e2e.md)** - Pruebas E2E con Cypress (Trabajo en Progreso)

## Filosofía de Pruebas

Nuestro enfoque de pruebas enfatiza:

* **Claridad** - Las pruebas deben ser auto-documentadas y fáciles de entender
* **Mantenibilidad** - Las pruebas deben ser fáciles de actualizar cuando los requisitos cambian
* **Aislamiento** - Cada prueba debe ejecutarse independientemente sin afectar a otras
* **Cobertura** - Todos los caminos críticos y casos extremos deben ser probados
* **Valor** - Las pruebas deben proporcionar confianza de que el código funciona como se espera

## Enlaces Rápidos

* [Cómo describir contextos con `describe`](writing-tests.md#describir-y-construir-contexto)
* [Cómo escribir expectativas con `it`](writing-tests.md#describir-expectativas-y-ejecutar-código)
* [Qué probar y cuándo](writing-tests.md#qué-probar)
* [Cuándo y cómo hacer mock](writing-tests.md#cuándo-mockear)
