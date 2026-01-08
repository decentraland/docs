# Estándares de IU

Esta sección proporciona guías completas para construir interfaces de usuario en aplicaciones de Decentraland usando Redux Toolkit (RTK) y RTK Query. Estos estándares aseguran gestión de estado consistente, rendimiento óptimo y código mantenible a través de todos los proyectos de IU.

## Resumen

Nuestra arquitectura de IU está construida sobre tres tecnologías fundamentales:

* **Redux Toolkit (RTK)** - Redux moderno con menos código repetitivo
* **RTK Query** - Obtención y caché de datos poderosa
* **TypeScript** - Gestión de estado type-safe

### Principios Guía

1. **Simplicidad primero** - Usar RTK Query para datos remotos; `createSlice` para estado UI/local
2. **Co-localización de características** - Mantener el código relacionado junto (slices, endpoints, selectores)
3. **Store serializable** - Nunca almacenar objetos no serializables en Redux
4. **Store ligero** - Mantener estado efímero en componentes React
5. **Tipado estricto** - Aprovechar TypeScript para mejor DX y menos bugs
6. **Consciente de Web3** - Manejar cambios de estado blockchain con gracia

## Secciones de Documentación

* [**Configuración de Store**](../../../contributor/contributor-guides/ui-standards/store-setup.md) - Configurar el store Redux, hooks tipados y estructura de carpetas
* [**RTK Query**](../../../contributor/contributor-guides/ui-standards/rtk-query.md) - Obtención de datos, caché, tags e invalidación
* [**Gestión de Estado**](../../../contributor/contributor-guides/ui-standards/state-management.md) - Crear slices y gestionar estado UI
* [**Patrones de Componentes**](../../../contributor/contributor-guides/ui-standards/component-patterns.md) - Usar hooks efectivamente en componentes
* [**Integración Web3**](../../../contributor/contributor-guides/ui-standards/web3-integration.md) - Patrones para integración blockchain
* [**Pruebas y Rendimiento**](../../../contributor/contributor-guides/ui-standards/testing-and-performance.md) - Mejores prácticas, pruebas y optimización

## Referencia Rápida: Glosario

### Conceptos Fundamentales

| Término      | Descripción                                                             |
| ------------ | ----------------------------------------------------------------------- |
| **Store**    | El árbol de estado Redux único para la app                              |
| **Slice**    | Un módulo creado con `createSlice` (nombre + estado inicial + reducers) |
| **Action**   | Un objeto plano describiendo "qué pasó" (`type` + `payload` opcional)   |
| **Reducer**  | Una función pura que actualiza estado basado en acciones                |
| **Selector** | Una función que lee/deriva datos del store (puede ser memoizada)        |

### RTK Query

| Término              | Descripción                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| **RTK Query**        | Capa de obtención de datos: endpoints, caché, refetch, invalidaciones          |
| **Base Query**       | El fetcher de bajo nivel (ej. `fetchBaseQuery`) usado por endpoints            |
| **Endpoint**         | Una operación RTK Query (`query` = lectura; `mutation` = escritura)            |
| **Tags**             | Strings/objetos para `provides`/`invalidates` de caché para sincronizar vistas |
| **`onQueryStarted`** | Hook de ciclo de vida para actualizaciones optimistas y rollback               |

### Patrones

| Término                     | Descripción                                                                      |
| --------------------------- | -------------------------------------------------------------------------------- |
| **Actualización optimista** | Actualizar temporalmente UI antes de que el servidor confirme; rollback si falla |
| **Entity Adapter**          | Helpers para gestionar colecciones normalizadas (ids/entities, ordenamiento)     |
| **Estado UI/local**         | Estado propiedad del cliente (filtros, modales, inputs de formulario)            |
| **Datos remotos**           | Datos en caché propiedad del servidor (catálogo, NFTs, órdenes)                  |
| **Hooks tipados**           | `useAppSelector`/`useAppDispatch` vinculados a `RootState`/`AppDispatch`         |

## ¿Por Qué Hooks Tipados?

Usamos `useAppSelector` y `useAppDispatch` en lugar de los hooks estándar de Redux porque:

* **Type Safety** - Los tipos de retorno del selector se verifican contra `RootState`
* **Menos Código Repetitivo** - No se necesitan genéricos `<RootState>` por uso
* **Refactors Más Fáciles** - Cambiar tipos de store una vez; todos los componentes siguen
* **Mejor DX** - Funciona perfectamente con la inferencia de tipos de RTK Query

## Comenzando

1. Revisar la [Configuración de Store](../../../contributor/contributor-guides/ui-standards/store-setup.md) para entender la estructura del proyecto
2. Aprender [RTK Query](../../../contributor/contributor-guides/ui-standards/rtk-query.md) para gestionar datos remotos
3. Entender [Gestión de Estado](../../../contributor/contributor-guides/ui-standards/state-management.md) para estado UI local
4. Estudiar [Patrones de Componentes](../../../contributor/contributor-guides/ui-standards/component-patterns.md) para implementación
5. Seguir [Integración Web3](../../../contributor/contributor-guides/ui-standards/web3-integration.md) para características blockchain
6. Aplicar [Pruebas y Rendimiento](../../../contributor/contributor-guides/ui-standards/testing-and-performance.md) mejores prácticas

## Cumplimiento de Estándares

Las palabras clave "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY" y "OPTIONAL" en esta documentación deben interpretarse como se describe en [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

## Qué es Diferente Sobre Nuestro Enfoque

### RTK Query Primero

Priorizamos RTK Query para todos los datos remotos en lugar de escribir acciones asíncronas personalizadas. Esto nos da:

* Caché y deduplicación incorporadas
* Refetch automático y actualizaciones en segundo plano
* Actualizaciones optimistas con rollback
* Estados de carga y error listos para usar

### Huella de Store Mínima

Mantenemos el store Redux enfocado en:

* **Caché de datos remotos** (vía RTK Query)
* **Estado UI global** (filtros, preferencias, sesión)
* **Estado entre componentes** (modales, notificaciones)

El estado transitorio permanece en componentes React.

### Consideraciones Web3

Nuestros patrones toman en cuenta desafíos específicos de blockchain:

* Objetos no serializables (providers, signers) permanecen fuera de Redux
* Invalidación de caché en cambios de red/cuenta
* Actualizaciones optimistas para transacciones pendientes
* Actualizaciones de estado dirigidas por eventos desde eventos blockchain

## Anti-Patrones a Evitar

{% hint style="danger" %}
**Nunca hagas esto:**

* Almacenar `window.ethereum`, providers, signers o sockets en Redux
* Duplicar la misma colección en un slice y en RTK Query
* Despachar acciones durante render de React
* Retornar nuevos objetos de selectores sin memoización
* Crear mutaciones que no invaliden o parcheen cachés
{% endhint %}

## Próximos Pasos

Comienza con [Configuración de Store](../../../contributor/contributor-guides/ui-standards/store-setup.md) para aprender cómo estructurar tu proyecto y configurar Redux apropiadamente.
