---
description: Reproduce transmisiones de audio en vivo en tu escena.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/media/audio-streaming
---

# Transmisión de Audio

Puedes transmitir audio desde una URL. Esto es útil para reproducir música directamente desde una radio por internet, o transmitir una conferencia a tu escena.

{% hint style="info" %}
**💡 Tip**: En el [Scene Editor](../scene-editor/get-started/about-editor.md), puedes usar un **Audio Stream** [Smart Item](../scene-editor/interactivity/smart-items.md) para lograr esto sin código.
{% endhint %}

El audio en la fuente debe estar en uno de los siguientes formatos: `.mp3`, `ogg`, o `aac`. La fuente también debe ser una URL _https_ (las URLs _http_ no son soportadas), y la fuente debe tener [políticas CORS (Cross Origin Resource Sharing)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) que permitan acceder a ella externamente. Si este no es el caso, puede que necesites configurar un servidor para actuar como proxy y exponer la transmisión de una manera válida.

{% hint style="warning" %}
**📔 Nota**: Para reproducir un sonido pregrabado en tu escena, consulta [Sonidos](../sdk7/3d-essentials/sounds.md).
{% endhint %}

Para agregar una transmisión de audio a tu escena, simplemente agrega un componente `AudioStream` a una entidad:

```ts
const streamEntity = engine.addEntity()

AudioStream.create(streamEntity, {
	url: 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3',
	playing: true,
	volume: 0.8,
})
```

{% hint style="warning" %}
**📔 Nota**: El sonido transmitido no es posicional, se escuchará a un volumen consistente en toda tu escena. Si un jugador sale de la escena, no escuchará la transmisión en absoluto.
{% endhint %}

Establece el volumen del componente `AudioStream` cambiando su propiedad `volume`.

Activa o desactiva el componente `AudioStream` estableciendo su propiedad `playing` en _true_ o _false_.

{% hint style="info" %}
**📔 Nota**: No todos los servicios de streaming permiten reproducir su audio fuera de su sitio. Los siguientes son algunos ejemplos que funcionan en Decentraland:

```ts
DELTA = "https://cdn.instream.audio/:9069/stream?_=171cd6c2b6e"
GRAFFITI = "https://n07.radiojar.com/2qm1fc5kb.m4a?1617129761=&rj-tok=AAABeIR7VqwAilDFeUM39SDjmw&rj-ttl=5"
ISLA NEGRA = "https://radioislanegra.org/listen/up/basic.aac"
```
{% endhint %}

### Estado de la transmisión

Consulta el estado de una transmisión de audio usando la función `AudioStream.getAudioState()`, pasando la entidad que posee el componente `AudioStream`.

El estado devuelto es un valor del enum `MediaState`. Este enum tiene los siguientes valores posibles:

* `MS_BUFFERING`
* `MS_ERROR`
* `MS_LOADING`
* `MS_NONE`
* `MS_PAUSED`
* `MS_PLAYING`
* `MS_READY`
* `MS_SEEKING`

El siguiente ejemplo verifica el estado de una transmisión, y registra cuando hay un cambio.

```ts
export function main() {
	const entity = engine.addEntity()

	AudioStream.create(entity, {
		playing: true,
		volume: 1,
		url: 'https://audio-edge-es6pf.mia.g.radiomast.io/ref-128k-mp3-stereo',
	})

	let lastState: ReturnType<typeof AudioStream.getAudioState> = undefined
	engine.addSystem(() => {
		const currentState = AudioStream.getAudioState(entity)
		if (lastState !== currentState) {
			console.log('Stream state: ', currentState)

			if (currentState == MediaState.MS_ERROR) {
				// Intentar reconexión
			}
		}
	})
}
```
