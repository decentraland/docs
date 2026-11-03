# Tabla de contenidos

* [Bienvenido Contribuidor](./)

## Arquitectura

* [Resumen](architecture/architecture.md)
* [Servicios Backend](architecture/services.md)
* [Red Catalyst](architecture/catalyst.md)
* [Infraestructura](architecture/infrastructure.md)

## Autenticación

* [Cadena de Autenticación](authentication/authchain.md)
* [Signed Fetch](authentication/signed-fetch.md)

## Catalyst

* [Glosario](catalyst/glossary.md)
* [Selección de Realm](catalyst/realm-selection.md)

## Contenido

* [Resumen](content/overview.md)
* [Entidades](content/entities.md)
* [Sistema de Archivos](content/file-system.md)
* [Punteros](content/pointers.md)
* [Tipos de Entidad](content/entity-types/)
  * [Escenas](content/entity-types/scenes.md)
  * [Perfiles](content/entity-types/profiles.md)
  * [Outfits](content/entity-types/outfits.md)
  * [Wearables](content/entity-types/wearables.md)
  * [Emotes](content/entity-types/emotes.md)
  * [Tiendas](content/entity-types/stores.md)
* [Instantáneas](content/snapshots.md)
* [Colecciones](content/collections.md)
* [Práctica](content/practice/)
  * [Ejemplos CLI](content/practice/cli-examples.md)
  * [Ejemplos Python](content/practice/python-examples.md)

## Runtime de Escena

* [Resumen](runtime/overview.md)
* [Globales](runtime/globals.md)
* [Ejecución](runtime/execution.md)
* [Permisos](runtime/permissions.md)
* [Entidades Básicas](runtime/basic-entities.md)
* [Componentes Básicos](runtime/basic-components.md)
* [Módulos de Runtime](runtime/modules/)
  * [API del Motor](runtime/modules/engine-api.md)
  * [Jugadores](runtime/modules/players.md)
  * [Identidad de Usuario](runtime/modules/user-identity.md)
  * [Acciones Restringidas](runtime/modules/restricted-actions.md)
  * [Signed Fetch](runtime/modules/signed-fetch.md)
  * [Runtime](../contributor/runtime/modules/runtime.md)
* [Componentes](runtime/components/)
  * [Creación de Componentes](runtime/components/component-creation.md)

## Comunicaciones

* [Resumen](communications/overview.md)
* [Realm MAIN](communications/main-realm.md)
* [Archipelago](communications/archipelago.md)
* [Mensajes](communications/messages.md)
* [Transportes](communications/transports.md)
* [Tipos de Transporte](communications/transport-types/)
  * [LiveKit](communications/transport-types/livekit.md)
  * [Websocket](communications/transport-types/websocket.md)
  * [Signed Login](communications/transport-types/signed-login.md)
  * [Offline](communications/transport-types/offline.md)
  * [Simulator](communications/transport-types/simulator.md)

## Servicio Social

* [Resumen](social-service/overview.md)
* [Cliente JavaScript](social-service/js-client.md)
* [Login](social-service/login.md)
* [Obtener Amigos](social-service/get-friends.md)
* [Actualizar Amigos](social-service/put-friends.md)
* [Websocket](social-service/ws.md)

## Tutoriales

* [Comenzando](tutorials/getting-started.md)
* [Cómo Ejecutar un Nodo Catalyst](tutorials/how-to-run-a-catalyst.md)
* [Cómo Crear un Nuevo Tipo de Entidad](tutorials/how-to-create-new-entity-type.md)

## Guías del Contribuidor

* [Resumen](contributor-guides/contributor-guides.md)
* [Documentación de API](contributor-guides/api-documentation.md)
* [Estándares de Pruebas](contributor-guides/testing-standards/)
  * [Escribir Pruebas](contributor-guides/testing-standards/writing-tests.md)
  * [Probar IUs](contributor-guides/testing-standards/testing-uis.md)
  * [Probar Servicios (WKC)](contributor-guides/testing-standards/testing-services-wkc.md)
  * [Probar Servicios (Obsoleto)](contributor-guides/testing-standards/testing-services-deprecated.md)
  * [Pruebas E2E](contributor-guides/testing-standards/testing-e2e.md)
* [Componentes Well-Known](contributor-guides/well-known-components/)
  * [Componentes](contributor-guides/well-known-components/components.md)
  * [Adaptadores](contributor-guides/well-known-components/adapters.md)
  * [Componentes Lógicos](contributor-guides/well-known-components/logic-components.md)
  * [Controladores](contributor-guides/well-known-components/controllers.md)
* [Estándares de IU](contributor-guides/ui-standards/)
  * [Configuración de Store](contributor-guides/ui-standards/store-setup.md)
  * [RTK Query](contributor-guides/ui-standards/rtk-query.md)
  * [Gestión de Estado](contributor-guides/ui-standards/state-management.md)
  * [Patrones de Componentes](contributor-guides/ui-standards/component-patterns.md)
  * [Integración Web3](contributor-guides/ui-standards/web3-integration.md)
  * [Pruebas y Rendimiento](contributor-guides/ui-standards/testing-and-performance.md)
* [Estándares de IU Web](contributor-guides/web-ui-standards/)
  * [Resumen del Proceso](contributor-guides/web-ui-standards/process-overview.md)
  * [Componentes Personalizados](contributor-guides/web-ui-standards/custom-components.md)
  * [Estilos y Tematización](contributor-guides/web-ui-standards/styling-and-theming.md)
  * [Guía de Migración](contributor-guides/web-ui-standards/migration.md)
