Las escenas son las [entidades](../entities) que producen comportamiento en diferentes partes de Decentraland. Pueden abarcar múltiples parcelas land, y los jugadores caminando a través de ellas en un World Explorer ejecutarán código especial proporcionado por la escena.

Puedes encontrar un ejemplo completo de la vida real en [el manifest de esta escena](https://peer.decentraland.org/content/contents/bafkreidihplrc5cxarjkji2enmzhicpjoa2vrlqyyffnholmxb3o2xft3u) en el servidor de contenido de la Foundation.

## Punteros {#pointers}

Las escenas tienen uno o más [punteros](../pointers) asociados en forma de cadenas de coordenadas de parcela, como `"0,0"`. Cada parcela ejecutando la escena se listará en el [array `pointers`](../entities#properties) del manifest de entidad, y todos esos punteros serán resueltos por el servidor de contenido a esa escena.

En otras palabras, puedes elegir las coordenadas x/y de una parcela y localizar la escena que está ejecutando consultando al servidor de contenido por el puntero `"<x>,<y>"`. Esta es la forma en que los World Explorers deciden si habilitar el comportamiento de una escena mientras el jugador navega el mundo.

Un array `pointers` típico se ve así:

```json
{
  "pointers": [
    "-113,-134",
    "-113,-133",
    "-113,-132",
  ],
  // ... otras propiedades de entidad
}
```

Estos datos también están disponibles en el campo `metadata.scene.parcels` detallado abajo, en caso de que quieras guardar solo el objeto específico de escena en el manifest.

## Campos de Metadata

Hay varias propiedades especiales para [entidades](../entities) de tipo `scene` ubicadas en el campo de nivel superior `metadata`.

| Campo | Valor |
| ----- | --- |
| `owner` | Información sobre el mantenedor de la escena.
| `main` | El [nombre de archivo interno](../entities#files) al archivo JavaScript principal de esta escena.
| `tags` | Un array de etiquetas de cadena descriptivas de esta escena.
| `display` | Información sobre la escena para que Explorers muestren a jugadores (ver abajo).
| `scene` | Las parcelas en las que esta escena está activa, y su ubicación central (ver abajo).
| `contact` | Nombre y dirección de correo electrónico para contactar a los creadores o mantenedores de la escena (ver abajo).
| `spawnPoints` | Ubicaciones y ángulos de cámara para jugadores saltando a esta escena (ver abajo).
| `requiredPermissions` | Permisos recomendados para que Explorers soliciten a jugadores (ver abajo).
| `featureToggles` | Configuraciones para banderas de características

{% hint style="info" %}
Recuerda que las entidades y sus metadatos pueden tener campos personalizados. Puedes encontrar algunas propiedades allá afuera que no están listadas aquí.
{% endhint %}

### Display

En `metadata.display`, encontrarás propiedades útiles para informar a jugadores sobre la escena antes de entrar.

| Campo | Valor |
| ----- | --- |
| `title` | El nombre de visualización de esta escena.
| `description` | Una descripción extendida de esta escena.
| `favicon` | _Obsoleto_ El [nombre de archivo interno](../entities#files) a un ícono, mostrado cuando esta escena está activa.
| `navmapThumbnail` | El [nombre de archivo interno](../entities#files) a la miniatura de esta escena para el mapa del mundo.

Un ejemplo:

```json
{
  "title": "my_cool_scene",
  "favicon": "favicon.png",
  "navmapThumbnail": "thumbnail.png"
}
```

### Scene

La propiedad `metadata.scene` es un objeto describiendo la posición de esta escena en el mapa del mundo.

| Campo | Valor |
| ----- | --- |
| `parcels` | Un array de punteros de parcela que ejecutan esta escena.
| `base` | El puntero de parcela para el punto de origen de esta escena.

En la práctica, se ve así:

```json
{
  "parcels": [
    "17,-112", 
    "17,-113"
  ],
  "base": "17,-112"
}
```

El campo `base` siempre está incluido en el array `parcels`.

### Contact

El objeto `metadata.contact` contiene la información de contacto del propietario o mantenedor de la escena.

| Campo | Valor |
| ----- | --- |
| `name` | Un nombre para este contacto.
| `email` | (Opcional) Una dirección de correo electrónico para contactar.

En JSON:

```json
{
  "name": "cool_scene_maker",
  "email": "hello@decentraland.org"
}
```

Mientras que el campo `name` se llena en cada escena, encontrarás que en la práctica real el campo `email` a menudo es una cadena vacía. Esta es una elección de privacidad hecha por el creador de la escena.

### Spawn Points

El campo `metadata.spawnPoints` define un array de puntos y direcciones de cámara determinando dónde deben aparecer los jugadores al entrar a la escena, y dónde deben estar mirando inicialmente. Debe haber al menos un punto de spawn definido.

Cada elemento en el array tiene varias propiedades:

| Campo | Valor |
| ----- | --- |
| `name` | Una etiqueta para identificar este punto de spawn.
| `position` | La posición inicial en un objeto `{ x, y, z }` con coordenadas float.
| `cameraTarget` | La dirección inicial de la cámara en un objeto `{ x, y, z }` con coordenadas float.
| `default` | Si este punto de spawn se usa a menos que se especifique lo contrario.

Por ejemplo:

```json
[
  {
    "name": "spawn1",
    "position": { "x": 10.02, "y": 5.27, "z": 15.23  },
    "cameraTarget": { "x": 10.02, "y": 6.27, "z": 31.23 },
    "default": true
  }
]
```

{% hint style="info" %}
**📔 Nota**: El Spawn Area y Camera Target pueden definirse visualmente desde Creator Hub. Para más, ir a la documentación de [Spawn Areas](../../../creator/scene-editor/build/spawn-areas.md) docs.
{% endhint %}

### Permisos Requeridos {#permissions}

En `metadata.requiredPermissions` encontrarás un array de cadenas conocidas declarando qué permisos deben solicitarse al jugador antes de que el World Explorer permita ciertas acciones. Esto recae sobre el Explorer, otros clientes construidos para diferentes propósitos pueden elegir ignorar esto.

Este es el conjunto actual de permisos soportados:

| Permiso | Propósito |
| ----- | --- |
| `USE_FETCH` | Permitir que la escena realice solicitudes HTTP externas.
| `USE_WEBSOCKET` | Permitir que la escena use la API Websocket para establecer conexiones externas.
| `OPEN_EXTERNAL_LINK` | Permitir que la escena abra una URL (en una pestaña del navegador o vista web).
| `USE_WEB3_API` | Permitir que la escena se comunique con una wallet.
| `ALLOW_TO_TRIGGER_AVATAR_EMOTE` | Permitir que la escena anime el avatar del jugador con un emote.
| `ALLOW_TO_MOVE_PLAYER_INSIDE_SCENE` | Permitir que la escena cambie la posición del jugador.

### Feature Toggles

El campo `metadata.featureToggles` permite a una escena indicar si ciertas características del World Explorer deben habilitarse o deshabilitarse.

El campo contiene un objeto de la forma `{ [featureName]: 'enabled' | 'disabled' }`, como este:

```json
{
  "voiceChat": "enabled"
}
```

Actualmente, `voiceChat` es la única bandera de característica comúnmente soportada.
