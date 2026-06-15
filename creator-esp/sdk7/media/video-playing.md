---
description: Transmite video a una escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/media/video-playing
---

# Reproducción de Video

Hay tres formas diferentes en las que puedes mostrar un video en una escena:

- Subir un archivo de video como parte del contenido de la escena
- Transmitir el video desde una fuente externa
- Transmitir en vivo vía Decentraland cast

{% hint style="info" %}
**💡 Tip**: En el [Scene Editor](../scene-editor/get-started/about-editor.md), puedes usar un **Video Player** [Smart Item](../scene-editor/interactivity/smart-items.md) para lograr esto sin código.
{% endhint %}

En todos los casos, necesitarás:

- Una entidad con una [forma primitiva](../sdk7/3d-essentials/shape-components.md) como un plano, cubo, o incluso un cono.
- Un [material](../sdk7/3d-essentials/materials.md) con una `VideoTexture` asignada a su textura
- Un componente `VideoPlayer` para controlar el estado del video.

### Consideraciones de rendimiento

Ten en cuenta que transmitir video demanda un esfuerzo significativo de la máquina del jugador. Se recomienda evitar reproducir más de un video a la vez.

Si demasiados videos se reproducen al mismo tiempo en tu escena, algunos serán pausados por el motor. La prioridad para pausar una pantalla se determina basándose en varios factores que incluyen proximidad al jugador, tamaño, y si la pantalla está en el campo de visión del jugador. La cantidad máxima de videos simultáneos depende de la configuración de calidad del jugador.

- Baja: 1
- Media: 5
- Alta: 10

También recomendamos comenzar a reproducir el video cuando el jugador esté cerca o realice una acción para hacerlo. Comenzar a reproducir un video cuando tu escena se carga lejos en el horizonte afectará innecesariamente el rendimiento mientras los jugadores visitan escenas vecinas.

También evita transmitir videos que están en muy alta resolución, no uses nada por encima de _HD_.

También es ideal reproducir videos en materiales Basic (unlit), para reducir la carga de rendimiento, como es el caso en todos los ejemplos de código a continuación.

### Mostrar un video

Las siguientes instrucciones aplican a las tres opciones de mostrar video:

1. Crea una entidad para que sirva como pantalla de video. Dale a esta entidad un componente `MeshRenderer` para que tenga una forma visible.
2. Crea un componente `VideoPlayer`, ya sea referenciando una URL de streaming o una ruta a un archivo de video. Aquí también puedes establecer el estado `playing` del video, y su volumen. Este componente puede asignarse a la entidad de pantalla de video, o a cualquier otra entidad en la escena.
3. Crea un objeto `VideoTexture`, y en su propiedad `videoPlayerEntity` asigna la entidad que posee el componente `VideoPlayer`.
4. Crea un `Material`, asígnalo a la entidad de pantalla, y establece su `texture` al `VideoTexture` que creaste.

Este ejemplo usa un video que está almacenado localmente en una carpeta `/videos` en el proyecto de escena:

```ts
// #1
const screen = engine.addEntity()
MeshRenderer.setPlane(screen)
Transform.create(screen, { position: { x: 4, y: 1, z: 4 } })

// #2
VideoPlayer.create(screen, {
	src: 'videos/myVideo.mp4',
	playing: true,
})

// #3
const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

// #4
Material.setBasicMaterial(screen, {
	texture: videoTexture,
})
```

Para usar un video de una URL de streaming externa, simplemente cambia el paso 2 para que la propiedad `src` en el componente `VideoPlayer` referencie la ruta al archivo.

```ts
// #2
VideoPlayer.create(screen, {
	src: 'https://player.vimeo.com/external/552481870.m3u8?s=c312c8533f97e808fccc92b0510b085c8122a875',
	playing: true,
})
```

Consulta [Transmisión usando Decentraland cast](video-playing.md#streaming-using-decentraland-cast) para detalles sobre cómo usar este tercer método alternativo.

### Acerca de la Transmisión Externa

La fuente de la transmisión debe ser una URL _https_ (las URLs _http_ no son soportadas).

Hay varias opciones para transmitir video. La opción más simple es usar un proveedor de hosting administrado como [Vimeo](https://vimeo.com/), [Livepeer Studio](https://livepeer.studio/) o [Serraform](https://serraform.gitbook.io/streaming-docs/guides/decentraland-playback) donde pagas una tarifa al proveedor para gestionar toda la infraestructura de streaming.

La otra alternativa recomendada es configurar tu propio servidor, usando software gratuito pero pagando por hosting en una plataforma como [Digital Ocean](https://try.digitalocean.com/developerbrand/?_campaign=emea_brand_kw_en_cpc&_adgroup=digitalocean_exact_exact&_keyword=digitalocean&_device=c&_adposition=&_content=conversion&_medium=cpc&_source=bing&msclkid=160bfc160a2a1bab9bbf9933594bd9c5&utm_source=bing&utm_medium=cpc&utm_campaign=emea_brand_kw_en_cpc&utm_term=digitalocean&utm_content=DigitalOcean%20Exact_Exact) o [Cloudflare](https://www.cloudflare.com/products/cloudflare-stream/). Puedes desplegar algo como un [Node Media Server](https://github.com/illuspas/Node-Media-Server), que proporciona la mayor parte de lo que necesitas listo para usar.

Todas estas opciones tienen pros y contras para diferentes escenarios. Debes evaluar qué es mejor para ti teniendo en cuenta tus necesidades, habilidades técnicas y presupuesto.

### Configurar OBS para streaming exitoso

[OBS](https://obsproject.com/) es una herramienta popular y gratuita para gestionar tus transmisiones.

Ya sea que estés usando la clave de transmisión de un venue o tu propio servidor RTMP, tu configuración en OBS es importante para el éxito de tu transmisión. Debes apuntar a una conexión sólida y consistente.

#### Configuración simple de OBS

Se recomienda la siguiente configuración simple:

- Bitrate 2500kbps (que funcionará con todos los venues de Decentraland)
- Audio bitrate 160kbps
- Video encoder preset: Hardware NVENC
- Audio Encoder AAC
- Broadest Resolution: 720 (cualquier mayor causa problemas en DCL)
- Frame rate 30fps

#### Consejo para nuevos streamers

- Las pruebas de sonido tempranas son esenciales para probar tu configuración con el venue.
- Pequeños errores como un dígito incorrecto en la clave de transmisión son los más probables de arruinar la transmisión.
- No subas por encima de la resolución 720 o un bitrate de 2500 kbps.

### Transmisión en vivo

Puedes transmitir en vivo desde tu cámara o compartir tu pantalla usando la funcionalidad de [Live streaming](../scene-editor/live-ops/live-streaming.md) del smart item [Admin tools](../scene-editor/live-ops/scene-admin.md).

Este método de streaming usa la misma arquitectura de comunicaciones usada para comunicaciones en vivo entre jugadores, y es fácil de configurar y tiene mucho menos retraso que la transmisión desde fuentes externas.

1. Agrega un smart item [Admin tools](../scene-editor/live-ops/scene-admin.md) a tu escena, así como un smart item [Video player](../scene-editor/interactivity/video-screen.md).
2. Publica tu escena, ya sea en un World o en Genesis City.
3. Entra a la escena como un jugador con permiso para usar las Admin tools.
4. Abre la consola Admin, selecciona la pestaña **Video**, luego selecciona la funcionalidad **Live** y haz clic en el botón **Get Stream Key**.
5. Copia la **Server URL** y _Streaming key_ a tu software de streaming (por ejemplo OBS).
6. Presiona el botón **Activate** para comenzar a transmitir.

En lugar de agregar un smart item Video player a tu escena, también puedes usar la URL `livekit-video://current-stream` como la fuente de video, para reproducir la transmisión en tu escena. Aún necesitarás las Admin tools para obtener la clave de transmisión.

```ts
// #1
const screen = engine.addEntity()
MeshRenderer.setPlane(screen)
Transform.create(screen, { position: { x: 4, y: 1, z: 4 } })

// #2
VideoPlayer.create(screen, {
	src: `livekit-video://current-stream`,
	playing: true,
})

// #3
const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

// #4
Material.setBasicMaterial(screen, {
	texture: videoTexture,
})
```

### Materiales de Video

La mayoría de las veces, querrás reproducir videos en un [material Basic](../sdk7/3d-essentials/materials.md#unlit-materials) sin iluminación, en lugar de un material PBR. Esto resulta en una imagen mucho más brillante y nítida, y es mejor para el rendimiento.

```ts
Material.setBasicMaterial(screen, {
	texture: videoTexture,
})
```

Usualmente se recomienda reproducir videos en materiales Basic sin iluminación, ya que esto es mejor para el rendimiento, pero si en su lugar quieres proyectar un video en un material PBR, ten en cuenta que las propiedades predeterminadas hacen que el video se vea bastante opaco. Puedes mejorar eso alterando otras propiedades del material. Aquí hay algunas configuraciones recomendadas para que el video destaque más:

```ts
Material.setPbrMaterial(screen, {
	texture: videoTexture,
	roughness: 1.0,
	specularIntensity: 0,
	metallic: 0,
	emissiveTexture: videoTexture,
	emissiveIntensity: 0.6,
	emissiveColor: Color3.White(),
})
```

{% hint style="info" %}
**💡 Tip**: Como el video es una textura que se agrega a un material, también puedes experimentar con otras propiedades de materiales, como teñirlo con un color, o agregar otras capas de textura. Por ejemplo para producir un efecto de pantalla sucia.

Consulta [materiales](../sdk7/3d-essentials/materials.md) para más detalles.
{% endhint %}

### Acerca de los Archivos de Video

Los siguientes formatos de archivo son soportados:

- _.mp4_
- _.ogg_
- _.webm_

Ten en cuenta que un archivo de video se suma al tamaño total de la escena, lo que hace que la escena tarde más en descargarse para los jugadores que caminan hacia tu escena. El tamaño del video también podría hacer que excedas las [limitaciones de escena](../sdk7/optimizing/scene-limitations.md), ya que tienes un máximo de 15 MB por parcela para usar. Recomendamos comprimir el video tanto como sea posible, para que sea menos problemático.

También recomendamos comenzar a reproducir el video cuando el jugador esté cerca o realice una acción para hacerlo. Comenzar a reproducir un video cuando tu escena se carga lejos en el horizonte afectará innecesariamente el rendimiento mientras los jugadores visitan escenas vecinas.

### Iniciar pausar y detener un video

Para comenzar a reproducir el video o pausarlo, establece la propiedad `playing` en _true_ o _false_. Si `playing` está establecido en false, el video se pausa en el último fotograma mostrado.

Puedes hacer que una pantalla sea toggleable agregando un evento de puntero como se muestra a continuación:

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: screen,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Play/Pause' },
	},
	function () {
		const videoPlayer = VideoPlayer.getMutable(screen)
		videoPlayer.playing = !videoPlayer.playing
	}
)
```

Para detener el video y enviarlo de vuelta al primer fotograma, establece la propiedad `position` en 0. En el siguiente ejemplo, hacer clic en el video lo detiene.

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: screen,
		opts: { button: InputAction.IA_POINTER, hoverText: 'STOP' },
	},
	function () {
		const videoPlayer = VideoPlayer.getMutable(screen)
		videoPlayer.playing = false
		videoPlayer.position = 0
	}
)
```

### Configurar el reproductor de video

Las siguientes propiedades opcionales están disponibles para establecer en el componente `VideoPlayer`:

- `playing`: Determina si el video se está reproduciendo actualmente. Si es false, el video está pausado.

{% hint style="warning" %}
**📔 Nota**: Solo puede haber un componente `VideoPlayer` activo a la vez en cada escena.
{% endhint %}

- `playbackRate`: Cambia la velocidad a la que se reproduce el video. _1_ por defecto.
- `volume`: Te permite cambiar el volumen del audio. _1_ por defecto.
- `position`: Te permite establecer una posición de inicio diferente en el video. Se expresa en segundos después del inicio original del video. _-1_ por defecto, lo que hace que comience en el inicio real del video.
- `loop`: Booleano que determina si el video se reproduce continuamente en un loop, o si se detiene después de reproducirse una vez. _false_ por defecto.
- `playbackRate`: La velocidad a la que se reproduce el video

### Reproducir múltiples videos

Para evitar problemas de rendimiento, cada escena solo puede reproducir una sola textura de video a la vez. Sin embargo, una escena puede reproducir múltiples copias de una misma textura de video en varias pantallas diferentes. Esa acción no está restringida ya que impacta el rendimiento considerablemente menos que reproducir videos separados. Para reproducir un mismo video en múltiples entidades, simplemente asigna la misma instancia del objeto de textura de video a los componentes `Material` de cada entidad de pantalla.

```ts
// #1
const screen1 = engine.addEntity()
MeshRenderer.setPlane(screen1)
Transform.create(screen1, { position: { x: 4, y: 1, z: 4 } })

const screen2 = engine.addEntity()
MeshRenderer.setPlane(screen2)
Transform.create(screen2, { position: { x: 6, y: 1, z: 4 } })

// #2
VideoPlayer.create(screen1, {
	src: 'https://player.vimeo.com/external/552481870.m3u8?s=c312c8533f97e808fccc92b0510b085c8122a875',
	playing: true,
})

// #3
const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen1 })

// #4
Material.setBasicMaterial(screen1, {
	texture: videoTexture,
})

Material.setBasicMaterial(screen2, {
	texture: videoTexture,
})
```

Ten en cuenta que en el ejemplo anterior, solo es necesario crear un componente `VideoPlayer`, que controla el estado de ambas pantallas de video. En este caso este componente está asignado para pertenecer a la entidad `screen1`, pero también podría asignarse para pertenecer a cualquier otra entidad en la escena, no necesariamente una de las pantallas.

### Eventos de video

Maneja fácilmente cambios de estado en un video, para responder cuando un video comienza a reproducirse, se pausa, etc. Esto puede usarse por ejemplo para reproducir animaciones en perfecto sincronismo con un video, asegurando que comiencen al mismo tiempo que el video.

Usa 'videoEventsSystem.registerVideoEventsEntity' para definir una función que se ejecuta cada vez que cambia el estado del video asignado a una entidad. Cada vez que cambia el estado, tu función puede verificar el nuevo estado y responder en consecuencia.

```ts
import {
	engine,
	Entity,
	VideoPlayer,
	videoEventsSystem,
	VideoState,
} from '@dcl/sdk/ecs'

// ... Crear videoPlayerEntity con componente VideoPlayer, Transform, MeshRenderer.setPlane(), etc. ...

videoEventsSystem.registerVideoEventsEntity(
	videoPlayerEntity,
	function (videoEvent) {
		console.log(
			'video event - state: ' +
				videoEvent.state +
				'\ncurrent offset:' +
				videoEvent.currentOffset +
				'\nvideo length:' +
				videoEvent.videoLength
		)

		switch (videoEvent.state) {
			case VideoState.VS_READY:
				console.log('video event - video is READY')
				break
			case VideoState.VS_NONE:
				console.log('video event - video is in NO STATE')
				break
			case VideoState.VS_ERROR:
				console.log('video event - video ERROR')
				break
			case VideoState.VS_SEEKING:
				console.log('video event - video is SEEKING')
				break
			case VideoState.VS_LOADING:
				console.log('video event - video is LOADING')
				break
			case VideoState.VS_BUFFERING:
				console.log('video event - video is BUFFERING')
				break
			case VideoState.VS_PLAYING:
				console.log('video event - video started PLAYING')
				break
			case VideoState.VS_PAUSED:
				console.log('video event - video is PAUSED')
				break
		}
	}
)
```

El objeto videoEvent pasado como entrada para la función contiene las siguientes propiedades:

- `currentOffset` (_number_): El valor actual de la propiedad `seek` en el video. Este valor muestra segundos después del inicio original del video. _-1_ por defecto, si el video no ha comenzado a reproducirse.
- `state`: El valor para el nuevo estado de video del video, expresado como un valor del enum `VideoState`. Este enum puede contener los siguientes valores posibles:
  - `VideoState.VS_READY`
  - `VideoState.VS_NONE`
  - `VideoState.VS_ERROR`
  - `VideoState.VS_SEEKING`
  - `VideoState.VS_LOADING`
  - `VideoState.VS_BUFFERING`
  - `VideoState.VS_PLAYING`
  - `VideoState.VS_PAUSED`
- `videoLength` (_number_): La duración en segundos de todo el video. _-1_ si la duración es desconocida.
- `timeStamp` (_number_): Un timestamp _lamport_ que se incrementa cada vez que el video cambia de estado.
- `tickNumber` (_number_): El tiempo en el que ocurrió el evento, expresado como conteo de ticks desde que la escena comenzó a ejecutarse.

#### Último evento de video

Consulta un video por su último cambio de estado usando `videoEventsSystem.getVideoState()`. Esta función siempre devuelve el último valor `VideoEvent` para el video.

```ts
function mySystem() {
	const latestVideoEvent = videoEventsSystem.getVideoState(videoPlayerEntity)
	if (!latestVideoEvent) return

	console.log(`state: ${latestVideoEvent.state}
    \ncurrentOffset: ${latestVideoEvent.currentOffset}
    \nvideoLength: ${latestVideoEvent.videoLength}`)
}
```

### Máscaras alfa en videos

Un truco ingenioso para tener pantallas de video no rectangulares es aplicar una textura alfa encima de un plano. Puedes recortar parte del plano en cualquier forma que desees.

Usa la siguiente imagen para recortar tu video en una forma circular, con esquinas transparentes.

```ts
const videoTexture = Material.Texture.Video({
	videoPlayerEntity: screen,
})
const alphaMask = Material.Texture.Common({
	src: 'assets/scene/circle_mask.png',
	wrapMode: TextureWrapMode.TWM_MIRROR,
})

Material.setBasicMaterial(screen, {
	texture: videoTexture,
	alphaTexture: alphaMask,
})
```

{% hint style="warning" %}
**📔 Nota**: En versiones anteriores, la propiedad `alphaTexture` solo estaba presente en materiales PBR, actualmente solo funciona en materiales basic.
{% endhint %}

### Reproducir un video en un modelo glTF

Puedes reproducir un video en un modelo _glTF_ usando el componente [GltfNodeModifiers](../sdk7/3d-essentials/materials.md#modify-gltf-materials). Consulta [Modificar materiales glTF](../sdk7/3d-essentials/materials.md#modify-gltf-materials) para más detalles.

Esto te permite reproducir tus videos en cualquier forma, no solo planos. Por ejemplo, puedes reproducir videos en una pantalla curva, o incluso el cuerpo entero de un NPC.

```ts
const myEntity = engine.addEntity()

GltfContainer.create(myEntity, {
	src: 'models/myModel.glb',
})

Transform.create(myEntity, {
	position: Vector3.create(4, 0, 4),
})

VideoPlayer.create(myEntity, {
	src: 'https://player.vimeo.com/external/552481870.m3u8?s=c312c8533f97e808fccc92b0510b085c8122a875',
	playing: true,
})

GltfNodeModifiers.create(myEntity, {
	modifiers: [
		{
			path: '',
			material: {
				material: {
					$case: 'pbr',
					pbr: {
						texture: Material.Texture.Video({
							videoPlayerEntity: myEntity,
						}),
					},
				},
			},
		},
	],
})
```

El mapeo del video seguirá el mapeo UV original que usa el modelo. Esto significa que si el modelo tiene una textura que está mapeada a una parte específica del modelo, el video se mapeará a esa misma parte.

También puedes usar el componente `GltfNodeModifiers` para reproducir un video solo en un mesh específico dentro del modelo. Por ejemplo, puedes reproducirlo en una pared específica de un edificio, aunque el modelo abarque todo el edificio. Consulta [Modificar materiales glTF](../sdk7/3d-essentials/materials.md#modify-gltf-materials) para más detalles.
