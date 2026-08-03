El World Explorer soporta una lista de componentes básicos que comparten su definición con escenas, proporcionando soporte integrado para posicionamiento, animación, medios, consultas de estado del mundo

Hay cinco tipos de componentes:

1. [Componentes de objeto](#object) agregan propiedades visuales y físicas a Entidades.
2. [Componentes de juego](#game) pueden solicitar acciones y recibir información del motor del juego.
3. [Componentes de medios](#media) pueden mostrar imágenes y reproducir sonidos.
4. [Componentes de área](#area) alteran el comportamiento de Entidades en zonas específicas.
5. [Componentes de UI](#ui) permiten a las escenas renderizar interfaces flotantes.

Excepto por [`Transform`](#Transform), que se especifica en detalle abajo, el estado de todos los componentes se serializa usando protocol buffers. Puedes seguir el enlace en cada título para ver la definición completa.

## Object Components {#object}

Los componentes más comunes son aquellos que adjuntan propiedades visuales y físicas a una Entidad. Pueden usarse para posicionar, redimensionar, pintar y agregar colisión a objetos en el juego.

---

##### `Transform` <small>[↗ spec](https://adr.decentraland.org/adr/ADR-153)</small> {#Transform}

Agrega posición, rotación y escala a una entidad.

Este componente es, por amplio margen, el más comúnmente usado y frecuentemente actualizado durante el tiempo de vida de una escena. Por esto, `Transform` no se serializa usando protocol buffers, y en su lugar se empaqueta en una estructura personalizada.

`Transform` tiene un tamaño de `44` bytes, con este diseño exacto:

```
.-----------------------.-------------------------------.-----------------------.-----------------.
|   x   |   y   |   z   |   x   |   y   |   z   |   w   |   x   |   y   |   z   | parent (uint32) |
'-----------------------'-------------------------------'-----------------------'-----------------'
╵  position (3x float)  ╵      rotation (4x float)      ╵   scale (3x float)    ╵

```

Este enfoque permite al runtime (especialmente en entornos de código de bajo nivel) evitar pasos intermedios de serialización y deserialización. La memoria donde reside un `Transform` puede copiarse, compartirse y apuntarse directamente.

Las coordenadas pueden ser fraccionarias, y así usan un número de punto flotante de 4 bytes.

El campo `parent` indica que esta Entidad debe posicionarse relativa a otra, identificada por su ID.

Como el valor nulo para `parent` es también el ID de [`RootEntity`](/contributor/runtime/entities#RootEntity) (`0`), cualquier `Transform` es relativo a él por defecto.

Por protocolo, `Transform` debe serializarse en orden de bytes big-endian.

---

##### `MeshRenderer` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/mesh_renderer.proto#L7)</small> {#MeshRenderer}

Proporciona comportamiento de renderizado básico para una Entidad.

Puede configurarse para renderizar un plano, una esfera, un cubo o cilindro. Para renderizar formas 3D arbitrarias, usa [`GltfContainer`](#GltfContainer).

---

##### `MeshCollider` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/mesh_collider.proto#L15)</small> {#MeshCollider}

Proporciona comportamiento de colisión básico y detección de puntero del mouse para una Entidad.

Puede configurarse para comportarse como un plano, una esfera, un cubo o cilindro. Para tener una malla de colisión personalizada, usa [`GltfContainer`](#GltfContainer).

---

##### `Material` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/material.proto#L19)</small> {#Material}

Establece las propiedades de textura, iluminación, color y transparencia de una Entidad que también tiene el componente [`MeshRenderer`](#MeshRenderer).

Es una estructura compleja diseñada para cubrir todos los casos comunes, pero cada campo tiene un valor predeterminado razonable y puede dejarse sin especificar.

Para personalizar completamente las propiedades visuales de una Entidad, usa [`GltfContainer`](#GltfContainer).

---

##### `GltfContainer` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/gltf_container.proto#L7)</small> {#GltfContainer}

Adjunta un modelo 3D a esta Entidad, dada la [ruta de archivo](/contributor/content/entities#files) de un activo `.gltf` en el manifest de la escena.

Como el modelo tiene sus propias mallas y materiales, este componente anula cualquier comportamiento de [`MeshRenderer`](#MeshRenderer), [`MeshCollider`](#MeshCollider) y [`Material`](#Material).

---

##### `Billboard` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/billboard.proto#L17)</small> {#Billboard}

Hace que una Entidad reoriente automáticamente su `Transform` para enfrentar la cámara, u opcionalmente otra Entidad referenciada mediante `target_entity`. Como el nombre indica, se usa para mostrar billboards en el juego y frecuentemente se combina con [`TextShape`](#TextShape).

Afecta todas las direcciones por defecto, pero puede configurarse para rotar solo en un eje. Si la Entidad objetivo referenciada no existe, la reorientación se suspende hasta que exista.

---

##### `Animator` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/animator.proto#L7)</small> {#Animator}

Define una o más animaciones que pueden aplicarse simultáneamente a una entidad.

Las escenas pueden establecer el estado del componente para personalizar, reproducir y transicionar entre animaciones, así como leerlo para verificar qué animaciones están disponibles o se están reproduciendo actualmente.

---

##### `AvatarAttach` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/avatar_attach.proto#L16)</small> {#AvatarAttach}

Indica que la posición de una Entidad debe seguir un punto de anclaje particular en el cuerpo de un avatar.

Puede afectar cualquier avatar, no solo el del jugador, estableciendo un ID de usuario.

---

##### `TextShape` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/text_shape.proto#L11)</small> {#TextShape}

Renderiza texto en la posición de una Entidad, dada por su `Transform`.

Es altamente configurable, soportando parámetros como tamaño, margen, padding, color, sombra y más.

---

##### `Visibility` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/visibility_component.proto#L7)</small> {#Visibility}

Establece si una Entidad es visible (el valor predeterminado) o invisible.

Los objetos invisibles aún existen, y exhibirán comportamiento de cualquier otro componente adjunto.

---

##### `AvatarShape` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/avatar_shape.proto#L8)</small> {#AvatarShape}

Contiene información sobre el avatar del jugador, incluyendo su forma de cuerpo, colores, wearables y estado transitorio.

Este componente está adjunto a entidades en la [escena de avatar](execution#avatarScene).

## Game Components {#game}

Algunos componentes básicos pueden usarse por la escena y el runtime para intercambiar información. Aprovechan el [mecanismo de sincronización ECS](modules/engine_api#synchronization) para garantizar consistencia y orden para cualquier cambio de estado o eventos.

---

##### `CameraMode` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/camera_mode.proto#L8)</small> {#CameraMode}

Puede usarse para determinar si el jugador tiene una vista en primera persona o tercera persona.

---

##### `PointerLock` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/pointer_lock.proto#L7)</small> {#PointerLock}

Puede usarse para determinar si el puntero del mouse está siguiendo automáticamente el punto de enfoque de la cámara (bloqueado), o puede moverse libremente en la pantalla (desbloqueado).

Está adjunto a la [`CameraEntity`](/contributor/runtime/entities#CameraEntity), y su estado puede leerse (pero no escribirse) desde la escena.

---

##### `PointerEvents` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/pointer_events.proto#L17)</small> {#PointerEvents}

Muestra retroalimentación visual cuando el puntero hace clic o pasa sobre una Entidad.

---

##### `PointerEventsResult` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/pointer_events_result.proto#L13)</small> {#PointerEventsResult}

Contiene información sobre entrada reciente del jugador, incluyendo teclas y acciones del puntero.

Está adjunto a la `RootEntity`, y actualizado por el runtime con cualquier nuevo evento en cada frame.

---

##### `Raycast` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/raycast.proto#L15)</small> {#Raycast}

Puede adjuntarse a una Entidad para solicitar un raycast del motor del juego. El componente `RaycastResult` será adjuntado más tarde a la misma entidad.

El origen, dirección y longitud máxima del rayo pueden configurarse.

---

##### `RaycastResult` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/raycast_result.proto#L9)</small> {#RaycastResult}

Adjuntado por el runtime a Entidades que tienen un componente [`Raycast`](#Raycast) pendiente de resultados.

Contiene información sobre el rayo original e identifica cualquier Entidad que fue golpeada.

## Media Components {#media}

Las escenas pueden adjuntar componentes especiales para mostrar imágenes, mostrar video o reproducir sonidos.

---

##### `AudioSource` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/audio_source.proto#L7)</small> {#AudioSource}

Reproduce un clip de audio empaquetado con la escena, dada la [ruta del archivo en su manifest](/contributor/content/entities#files).

El sonido se origina desde la posición de la entidad asociada. Su tono, volumen y comportamiento de bucle pueden establecerse, y el estado del reproductor de audio puede leerse.

{% hint style="info" %}
En preparación para futuras actualizaciones, el campo en `AudioSource` se llama `audio_clip_url`, pero en la versión actual del protocolo es en realidad la ruta definida en el manifest.
{% endhint %}

---

##### `AudioStream` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/audio_stream.proto#L7)</small> {#AudioStream}

Similar a [AudioSource](#AudioSource), pero el audio se transmite en tiempo real desde una URL externa.

A pesar de estar adjunto a una entidad particular, el sonido no es afectado por su posición. Su volumen puede establecerse, y el estado del reproductor de audio puede leerse.

---

##### `NftShape` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/nft_shape.proto#L36)</small> {#NftShape}

Muestra un NFT asociado a un activo de imagen o video.

Renderiza un lienzo 2D con un marco decorativo configurable.

## Area Components

Estos componentes permiten a las escenas modificar el comportamiento predeterminado de Entidades dentro de límites especificados.

---

##### `AvatarModifierArea` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/avatar_modifier_area.proto#L15)</small> {#AvatarModifierArea}

Cambia el comportamiento de avatares dentro de un espacio centrado alrededor de una Entidad.

Se define con un vector de tamaño 3D, y puede afectar si los avatares son visibles o clickeables. Avatares específicos pueden excluirse de este efecto dado el ID de su usuario.

---

##### `CameraModeArea` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/camera_mode_area.proto#L11)</small> {#CameraModeArea}

Cambia el modo de cámara (1ra persona o 3ra persona) dentro de un espacio centrado alrededor de una Entidad.

Se define con un vector de tamaño 3D y un modo de cámara deseado.

## UI Components {#ui}

Los siguientes componentes se usan para crear interfaces gráficas que flotan encima del mundo del juego.

Usualmente están adjuntos a conjuntos de Entidades que tienen componentes [`UiTransform`](#UiTransform) jerárquicos, relacionados entre sí a través del atributo `parent`.

Por ejemplo, una ventana de opciones flotante podría ser una Entidad con un componente [`UiTransform`](#UiTransform) y un [`UiBackground`](#UiBackground), más una Entidad con un [`UiTransform`](#UiTransform) hijo y un [`UiDropdown`](#UiDropdown).

---

##### `UiTransform` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_transform.proto#L77)</small> {#UiTransform}

Describe el tamaño, posicionamiento, margen y padding de un componente UI.

Está basado en el modelo flexbox y es altamente personalizable.

---

##### `UiBackground` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_background.proto#L11)</small> {#UiBackground}

Describe un color o textura para usar como fondo en una Entidad UI.

---

##### `UiDropdown` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_dropdown.proto#L11)</small> {#UiDropdown}

Define una lista de opciones mutuamente exclusivas para mostrarse en un widget dropdown.

---

##### `UiDropdownResult` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_dropdown_result.proto#L9)</small> {#UiDropdownResult}

Contiene el valor seleccionado de un [`UiDropdown`](#UiDropdown), establecido por el runtime y leído por la escena.

---

##### `UiInput` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_input.proto#L11)</small> {#UiInput}

Define un widget de entrada de texto, con algún margen para personalización.

---

##### `UiInputResult` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_input_result.proto#L9)</small> {#UiInputResult}

Contiene el valor de texto de un [`UiInput`](#UiInput), establecido por el runtime y leído por la escena.

---

##### `UiText` <small>[↗ source](https://github.com/decentraland/protocol/blob/ccb88d679f20c0e22840c324879d7b2535f6c9a6/proto/decentraland/sdk/components/ui_text.proto#L11)</small> {#UiText}

Define una vista de texto simple, con algún margen para personalización.

---
