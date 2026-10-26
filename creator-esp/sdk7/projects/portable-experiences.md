---
description: Experiencias portables
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/projects/portable-experiences
---

# Experiencias Portables

Las experiencias portables son esencialmente escenas que no están restringidas a parcelas de terreno. Los jugadores pueden llevarlas consigo a donde quiera que vayan en Decentraland, agregando una nueva capa de contenido sobre su experiencia. Las Experiencias Portables pueden estar vinculadas a un NAME y pueden ser cargadas por otra escena usando el SDK.

{% hint style="warning" %}
**📔 Nota**: Las experiencias portables solo pueden crearse usando SDK 7. Además, solo las escenas construidas con SDK 7 son capaces de cargar una experiencia portable.

El **Creator Hub** actualmente no soporta la creación de proyectos de Experiencia Portable.
{% endhint %}

Los Smart Wearables son un tipo de experiencia portable que está asociada a un wearable, y se activa según si el jugador está usando ese wearable. Este documento no cubre esos, consulta [smart wearables](smart-wearables.md) para más detalles.

### Comenzando

#### Usando el CLI

1. Abre una línea de comandos en una carpeta nueva y ejecuta

`npx sdk-commands init --project px-template`

### Vista Previa

Ejecutar una vista previa de una experiencia portable es igual que ejecutar la de una escena, simplemente haz clic en el botón **Run Scene** en la pestaña de Decentraland, o ejecuta `npm run start` en la línea de comandos.

Notarás que en lugar de ver una cuadrícula vacía, estás rodeado por el contenido de parcelas vacías predeterminado. En una experiencia portable, no estás restringido a ningún conjunto de parcelas, puedes agregar modelos 3D o sonidos en cualquier lugar del mundo. Como la experiencia portable está destinada a ser experimentada en cualquier lugar de Decentraland, lo más probable es que te enfoques en entidades adjuntas al jugador o UI, pero también puedes colocar entidades libremente en el mundo.

### Publicar

Para publicar tu experiencia portable, necesitas poseer un [NAME de Decentraland](https://builder.decentraland.org/names).

Para especificar bajo qué **nombre** hacer tu despliegue, agrega la siguiente sección en tu `scene.json`:

```json
{
	"worldConfiguration": {
		"name": "my-name.dcl.eth"
	}
}
```

{% hint style="warning" %}
**📔 Nota**: Cada NAME referencia una sola experiencia portable o world. Si tu nombre ya apuntaba a un world, desplegar una experiencia portable sobrescribirá ese contenido.
{% endhint %}

Asegúrate de estar usando la cuenta de Ethereum que posee este nombre, o una cuenta a la que se le hayan dado permisos para desplegar a este nombre.

#### Usando el CLI

Ejecuta:

```
npm run deploy --target-content https://worlds-content-server.decentraland.org
```

### Ciclo de vida de una experiencia portable en una escena

Las experiencias portables necesitan ser activadas por una escena, ya sea en Genesis City o un world.

1. El jugador visita la escena que activa la experiencia portable. La escena puede generar la experiencia portable de inmediato o usar lógica personalizada para hacerlo después de que el jugador realice una acción.
2. El jugador es solicitado sobre la experiencia portable, incluyendo detalles sobre los permisos solicitados. La experiencia portable solo se activa si el jugador da su consentimiento.
3. El jugador ahora llevará la experiencia portable consigo a donde quiera que vaya durante el resto de la sesión, incluyendo teletransportarse o saltar a worlds. Si el jugador recarga la ventana del navegador, desaparecerá.

Para generar una experiencia portable desde tu escena, usa la función `spawn()`. Para terminar una experiencia portable, usa `kill()`. En ambos casos, solo necesitas saber el nombre DCL donde se desplegó la Experiencia Portable.

```ts
import {spawn} from "~system/PortableExperiences"

// spawn
executeTask(async () => {
  const { pid } = await spawn({ ens: 'boedo.dcl.eth'})
})

// kill
executeTask(async () => {
  await kill({'boedo.dcl.eth'})
})
```

### Restringir experiencias portables

Podrías estar preocupado por prevenir el uso de experiencias portables en tu escena, ya que estas podrían dar a los jugadores habilidades que podrían considerarse trampa en un juego competitivo. Por ejemplo, en un juego de plataformas, un jugador que usa un jetpack tiene una ventaja muy injusta sobre otros.

El enfoque más simple es agregar una bandera para bloquear todas las experiencias portables completamente en tu escena en cualquier momento, o prevenir que sus UIs se muestren. Consulta [feature toggles](scene-metadata.md#feature-toggles). Esto también aplica a experiencias portables vinculadas a smart wearables.

Otro enfoque es consultar para ver las experiencias portables de un jugador, y tomar acción en consecuencia.

```ts
import {
	spawn,
	getPortableExperiencesLoaded,
	kill,
} from '~system/PortableExperiences'

executeTask(async () => {
	const { loaded } = await getPortableExperiencesLoaded({})

	for (const portableExperience of loaded) {
		const { ens, name, pid } = portableExperience
		if (name === 'some-name.dcl.eth') {
			await kill({ pid })
		}
	}
})
```

En el ejemplo anterior, la escena está usando `kill()` para terminar experiencias portables si coinciden con un cierto nombre. Podrías llevar un registro de una lista de denegación de nombres de experiencias portables no permitidas, y elegir terminar solo esas. También podrías elegir terminarlas todas.

Una alternativa a terminar experiencias portables es cambiar el comportamiento de tu escena cuando están presentes. Por ejemplo, el jugador podría mantener su experiencia portable, pero no se le permitiría comenzar una partida, o reclamar recompensas mientras tenga alguna habilitada.

### Acciones restringidas en experiencias portables

Para prevenir abusos, ciertas funcionalidades no están permitidas en experiencias portables por defecto, y requieren agregar una bandera de permiso.

Consulta [Permisos requeridos](scene-metadata.md#required-permissions) para más detalles.

{% hint style="warning" %}
**📔 Nota**: Los jugadores son notificados sobre las banderas requeridas por la experiencia portable. Evita agregar permisos que no necesites, ya que puede hacer que los jugadores desconfíen de tu experiencia portable y la rechacen.
{% endhint %}

### Limitaciones

Las experiencias portables solo se ejecutan para el jugador que la activa. Otros jugadores no ven los efectos. Por ejemplo, si la experiencia portable renderiza una mascota que sigue al jugador, otros jugadores alrededor no verán esta mascota. Sin embargo, otros jugadores verán a los avatares realizar animaciones que se ejecutan como parte de la experiencia portable, incluso [animaciones de avatar personalizadas](../interactivity/trigger-emotes.md#custom-animations) subidas como parte de los archivos de la experiencia portable.

### Consejos

* Al posicionar una entidad, ten en cuenta que las posiciones son globales, relativas a las coordenadas 0,0 de Genesis Plaza.
* Para reaccionar a jugadores cercanos:
  * Consulta [Obtener todos los jugadores](../interactivity/user-data.md#fetch-all-players) para saber cómo obtener datos de otros jugadores en los alrededores.
  * Ten en cuenta que la carga de la experiencia portable, escenas circundantes y otros jugadores puede ocurrir en diferentes órdenes dependiendo de la situación. Si el jugador ingresa a Decentraland con la experiencia portable ya activada, es probable que tu experiencia portable se cargue antes que otros jugadores. Por otro lado, si el jugador primero carga en una escena y luego activa la experiencia portable, es probable que otros jugadores ya estén cargados para cuando la experiencia portable comience a ejecutarse.
  * Para experiencias multijugador, espera hasta que el jugador esté conectado a una isla dentro de su realm. Ejecuta `getRealm()` y verifica el campo 'room'. Si el campo 'room' es null, el jugador aún no está conectado a una isla y otros jugadores no estarán cargados todavía. Puedes verificar esto periódicamente cada 1 segundo hasta que el campo 'room' esté presente, y solo entonces inicializar tu lógica.
* Para interactuar con escenas circundantes:
  * No puedes enviar instrucciones directamente a escenas cercanas u otras experiencias portables, el `messageBus` está en sandbox para cada experiencia portable/escena.
  * Puedes usar un servidor intermediario para enviar información entre la experiencia portable y una escena.
  * Si haces un raycast, puedes detectar hits contra los colliders de entidades de las escenas circundantes. Esto puede decirte la ubicación exacta del hit, dirección normal, e incluso el nombre de la entidad y nombre de mesh del modelo 3D. Esto solo funciona al golpear entidades en escenas escritas con SDK7.
* Matar una experiencia portable: Ejecuta el método `kill()` para auto-terminar una experiencia portable.
