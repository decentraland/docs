---
description: Aprende cómo agregar sonidos a tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/sounds
---

# Sonidos

El sonido es una excelente manera de proporcionar retroalimentación a las acciones y eventos del jugador, los sonidos de fondo también pueden darle más contexto a tu escena y mejorar la inmersión del jugador en ella.

{% hint style="warning" %}
**📔 Nota**: Ten en cuenta que los sonidos solo son escuchados por jugadores que están parados dentro de las parcelas que componen la escena donde se generó el sonido, incluso si de otro modo estarían dentro del rango auditivo. Los jugadores también pueden optar por desactivar todos los sonidos en su configuración.
{% endhint %}

Los formatos de sonido compatibles varían según el navegador, pero se recomienda usar _.mp3_.

Los archivos _.wav_ también son compatibles pero generalmente no se recomiendan ya que son significativamente más pesados.

## Reproducir sonidos

La forma más fácil de reproducir un sonido es agregar un componente **Audio Source** visualmente en el [Scene Editor](../../scene-editor/get-started/about-editor.md) y configurarlo para **Start Playing** y **Loop**. Consulta [Agregar Componentes](../../scene-editor/build/components.md#add-components).



También puedes activar la reproducción de un sonido de forma sin código a través de **Actions**, consulta [Hacer cualquier elemento inteligente](../../scene-editor/interactivity/smart-items.md).

Para reproducir un sonido mediante código, usa la función `AudioSource.playSound`.

```ts
// Crear entidad
const sourceEntity = engine.addEntity()

// Reproducir sonido
AudioSource.playSound(sourceEntity, 'assets/sounds/sound-effect.mp3')
```

El archivo de sonido debe estar dentro de la carpeta del proyecto. En el ejemplo anterior, el archivo de audio se encuentra en una carpeta `assets/sounds`, que está ubicada en el nivel raíz de la carpeta del proyecto de la escena.

{% hint style="warning" %}
**📔 Nota**: El componente `AudioSource` debe importarse mediante

> `import { AudioSource } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../../../creator/sdk7/getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

La función `AudioSource.playSound()` toma los siguientes argumentos:

* `entity`: En qué entidad aplicar el sonido. El sonido se escuchará desde la posición de esta entidad, lo que significa que se vuelve más fuerte a medida que el jugador se acerca a ella.
* `src`: La ubicación del archivo de sonido dentro de tu proyecto.

{% hint style="info" %}
**💡 Consejo**: Para mayor claridad, recomendamos mantener tus archivos de sonido separados en una carpeta `assets/sounds` dentro de tu escena.
{% endhint %}

* `resetCursor`: _(opcional)_ Si es true, el sonido siempre comienza desde el principio. De lo contrario, continúa desde la posición actual del cursor. Útil para pausar y reanudar.

Otra forma de reproducir sonidos es crear manualmente un componente `AudioSource` en una entidad. Usa este enfoque para tener más control sobre el sonido, por ejemplo para hacerlo loop o establecer el volumen.

```ts
// Crear entidad
const sourceEntity = engine.addEntity()

// Crear componente AudioSource
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/sound-effect.mp3',
	loop: true,
	playing: true,
})
```

Se pueden establecer las siguientes propiedades:

* `audioClipUrl`: La ubicación del archivo de sonido dentro de tu proyecto.
* `playing`: Si es true, el sonido comienza a reproducirse. Puedes crear un sonido con `playing` establecido en false, y luego establecerlo en true en un momento posterior.
* `volume`: _(opcional)_ El volumen del archivo de sonido. 1 por defecto, que es el volumen completo.
* `pitch`: _(opcional)_ Modificar el tono de un sonido. 1 es el predeterminado, hazlo más bajo para un sonido más grave y más alto para un tono más agudo.

{% hint style="info" %}
**💡 Consejo**: Para evitar que un efecto de sonido se vuelva demasiado repetitivo durante un juego, es útil aleatorizar algunas ligeras variaciones en el tono del sonido cada vez que se reproduce.
{% endhint %}

* `currentTime`: _(opcional)_ 0 por defecto. Establece este valor para evitar comenzar desde el principio del archivo de sonido.

Cada entidad solo puede tener un solo componente `AudioSource`, que solo puede reproducir un clip a la vez. Esta limitación se puede superar fácilmente modificando el audio source en el momento de reproducir un nuevo sonido, o incluyendo múltiples entidades hijas invisibles, cada una con su propio sonido.

{% hint style="warning" %}
**📔 Nota**: Los sonidos se reproducen en la instancia local de cada jugador. Otros jugadores cercanos no escucharán los mismos sonidos a menos que su escena local los reproduzca explícitamente también.
{% endhint %}

## Detener sonidos

Para detener una entidad de reproducir su sonido, usa la función `AudioSource.stopSound()`. Solo necesitas especificar la entidad, ya que cada entidad tiene un solo componente `AudioSource`, y cada componente `AudioSource` reproduce un solo archivo a la vez.

```ts
AudioSource.stopSound(sourceEntity)
```

Otra forma de detener un sonido es establecer la propiedad `playing` en false.

```ts
// Crear entidad
const sourceEntity = engine.addEntity()

// Crear componente AudioSource
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/explosion.mp3',
	playing: true,
})

// Definir una función simple
function stopSound(entity: Entity) {
	// obtener versión mutable del componente audio source
	const audioSource = AudioSource.getMutable(entity)

	// modificar su valor playing
	audioSource.playing = false
}

// llamar función
stopSound(sourceEntity)
```

## Loop

Para mantener un sonido reproduciéndose en un loop continuo, establece el campo `loop` del componente `AudioSource` en _true_ antes de comenzar a reproducirlo.

```ts
// Crear entidad
const sourceEntity = engine.addEntity()

// Crear componente AudioSource
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/sound-effect.mp3',
	playing: true,
	loop: true,
})
```

Los sonidos en loop son especialmente útiles para agregar música de fondo u otros sonidos ambientales.

## Establecer volumen

Puedes establecer la propiedad `volume` del componente `AudioSource` para cambiar el volumen de un sonido.

El volumen se expresa como un número de _0_ a _1_.

```ts
// Crear entidad
const sourceEntity = engine.addEntity()

// Crear componente AudioSource
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/sound-effect.mp3',
	playing: true,
	volume: 0.5,
})
```

{% hint style="warning" %}
**📔 Nota**: Por supuesto, el volumen de un sonido también se ve afectado por la distancia del jugador desde el audio source. A medida que el jugador se aleja, el volumen será más bajo.
{% endhint %}

## Sonidos globales

Por defecto, todos los sonidos de un `AudioSource` son posicionales. Esto significa que parecen generarse desde la posición del componente `Transform`, y sonarán más fuertes a medida que el jugador se acerque. Pero también puedes configurar un sonido para que sea global, de modo que el volumen sea constante, sin importar dónde esté parado el jugador. Esto es ideal para usar en música de fondo, sonidos de notificación y otros sonidos no posicionales.

{% hint style="warning" %}
**📔 Nota**: Los Sonidos Globales son una característica que solo es compatible con el cliente de escritorio DCL 2.0.
{% endhint %}

Para hacer un sonido global, establece la propiedad `global` en _true_.

```ts
AudioSource.create(sourceEntity, {
	audioClipUrl: 'sounds/music.mp3',
	playing: true,
	global: true,
})
```

## Reproducir un segmento de un sonido

Para reproducir un segmento de un archivo de sonido más largo, usa `playSoundSegment()` en la biblioteca SDK Utils. Consulta [SDK7 Utils](https://github.com/decentraland/sdk7-utils).

También puedes lograr esto estableciendo explícitamente la propiedad `currentTime` en un componente `AudioSource`, y luego deteniéndolo después de esperar un período de tiempo.

## Streaming de audio

Consulta [Streaming de audio](../media/audio-streaming.md) para aprender cómo puedes reproducir un stream de audio en vivo desde una fuente externa.
