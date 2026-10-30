# Infraestructura

Esta página cubre la infraestructura de soporte y servicios externos que impulsan Decentraland.

## Servicios Externos (SaaS)

### LiveKit

**Propósito**: Servidor de medios de alta calidad para voz y video

[LiveKit](https://livekit.io/) proporciona:

* Enrutamiento de medios WebRTC
* Chat de voz
* Videoconferencia
* Compartir pantalla
* Audio espacial (en desarrollo)

**Control de Acceso**: [Comms Gatekeeper](../../apis/apis/comms-gatekeeper/README.md) genera tokens de tiempo limitado

**Usado Por**:

* Archipelago Workers - Voz predeterminada
* Worlds - Canales de voz por world
* Eventos - Canales específicos de evento

### SendGrid

**Propósito**: Servicio de entrega de correo electrónico

Envía correos de notificación:

* Solicitudes de amistad
* Recordatorios de eventos
* Notificaciones del sistema

**Activado Por**: [Sistema de notificaciones](../../apis/apis/notifications-workers/README.md)

***

## Indexadores Blockchain

Múltiples servicios de indexación proporcionan consultas rápidas de blockchain:

### Squids

**Propósito**: Indexador blockchain personalizado

Indexadores basados en [Subsquid](https://www.sqd.ai/):

* Modelos de datos personalizados
* Tiempos de sincronización rápidos
* API GraphQL

**Indexa**:

* Parcelas land (NFTs LAND)
* Wearables y colecciones
* Actividad del marketplace
* Nombres ENS

### Satsuma

**Propósito**: Proveedor GraphQL alojado

Alojamiento de subgraph gestionado:

* Alta disponibilidad
* Auto-escalado
* Monitoreo incluido

### The Graph

**Propósito**: Protocolo de indexación descentralizado

Red [The Graph](https://thegraph.com/):

* Indexadores descentralizados
* Tarifas de consulta en GRT
* Operado por la comunidad

***

## Message Broker

### NATS

**Propósito**: Enrutamiento de mensajes pub/sub

[NATS](https://nats.io/) proporciona:

* Entrega de mensajes en tiempo real
* Patrones pub/sub
* Patrones request/reply
* Soporte de clustering

**Usado Por**:

| Servicio       | Propósito                   |
| -------------- | --------------------------- |
| Archipelago    | Actualizaciones de posición |
| Social Service | Estado de amigos            |
| Worlds         | Eventos de world            |

***

## Procesamiento de Medios

### Servicio de Conversión de Imágenes (Metamorph)

**Propósito**: Conversión y optimización de formato de imagen

Convierte imágenes entre formatos:

* Optimización WebP
* Generación de miniaturas
* Conversión de formato

**GitHub**: [metamorph](https://github.com/decentraland/metamorph)

### Sistema de Imágenes de Perfil

**Propósito**: Generación de miniaturas de avatar

Genera imágenes de vista previa de avatar:

* Tomas faciales
* Tomas de cuerpo completo
* Múltiples resoluciones

**Componentes**:

* **Profile Images Consumer** - Renderiza avatares
* **Profile Producer** - Escucha cambios de avatar

***

## Workers de Procesamiento de Activos

### Asset Bundle Converter

**Propósito**: Optimización de activos específica de plataforma

Convierte activos desplegados a bundles optimizados para todas las plataformas.

**Registra bundles en**: [Asset Bundle Registry](../../apis/apis/asset-bundle-registry/README.md)

### Generador de LODs

**Propósito**: Variantes de nivel de detalle

Genera versiones de menor poligonaje de modelos 3D para mejor rendimiento.

***

## Sistema de Rewards

### API de Rewards

**Propósito**: Distribución de recompensas NFT

Otorga recompensas NFT por acciones:

* Finalización de onboarding
* Participación en eventos
* Referencias

***

## Próximos Pasos

* Revisa [Servicios Backend](services.md) para especificaciones de servicios
* Consulta [Red Catalyst](catalyst.md) para infraestructura de contenido
* Ver [Resumen de Arquitectura](architecture.md) para el panorama completo
