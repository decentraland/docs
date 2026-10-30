---
description: Detecta cambios en un componente y ejecuta funciones en cada cambio
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/architecture/subscribe-to-changes
---

# Suscribirse a Cambios

Una forma ordenada de escribir tu código es suscribirse a eventos, y ejecutar una función cada vez que ese evento ocurre.

Varios [Event listeners](../interactivity/event-listeners.md) vienen predefinidos como parte del SDK, pero también puedes usar el método `onChange()` en cualquier componente para lograr lo mismo. Esto también funciona con cualquier [Componente Personalizado](custom-components.md) que hayas definido, sin necesidad de trabajo extra.

Por ejemplo, la siguiente función verifica el componente `AvatarEquippedData` en la entidad del jugador, y ejecuta una función si el jugador cambia cualquiera de sus wearables o emotes equipados. Los nuevos valores del componente se pasan en los argumentos de la función.

```ts
import { AvatarEquippedData } from '@dcl/sdk/ecs'

export function main() {
	AvatarEquippedData.onChange(engine.PlayerEntity, (equipped) => {
		if (!equipped) return
		console.log('Nueva lista de wearables: ', equipped.wearableUrns)
		console.log('Nueva lista de emotes : ', equipped.emoteUrns)
	})
}
```

Gracias al método `onChange()`, no es necesario crear un sistema y verificar iterativamente nuevos valores en cada fotograma, simplifica enormemente este caso de uso muy común.

{% hint style="warning" %}
**📔 Nota**: No uses `onChange()` dentro de un Sistema, ya que eso suscribiría una nueva copia de la función en cada fotograma del bucle del juego, y podría potencialmente llevar a crashes.
{% endhint %}

El mismo método funciona de manera inmediata con [Componente Personalizado](custom-components.md). Por ejemplo:

```ts
// definir componente
export const MyComponent = engine.defineComponent('myComponent', {
	value1: Schemas.Boolean,
	value2: Schemas.Float,
})

// Uso
export function main() {
	// Crear entidades
	const myEntity = engine.addEntity()

	// Crear instancias del componente
	MyComponent.create(myEntity, {
		value1: true,
		value2: 10,
	})

	// Suscribirse a cambios
	MyComponent.onChange(myEntity, (componentData) => {
		if (!componentData) return
		console.log(componentData.value1)
		console.log(componentData.value2)
	})
}
```

También puedes combinar este enfoque con [Consultar componentes](querying-components.md), para suscribir masivamente cada entidad en la escena que tiene un cierto componente a su propia función.

```ts
export function main() {
	for (const [entity] of engine.getEntitiesWith(MyComponent)) {
		MyComponent.onChange(entity, (componentData) => {
			if (!componentData) return
			console.log(componentData.value1)
			console.log(componentData.value2)
		})
	}
}
```

Ten en cuenta que este enfoque solo suscribirá a `onChange()` para entidades que existen al inicio de la escena, por ejemplo entidades creadas a través de la UI del [Creator Hub](../../scene-editor/get-started/about-editor.md).

{% hint style="info" %}
**💡 Tip**: Si prefieres en cambio manejar eventos que no están necesariamente relacionados con un componente cambiando, recomendamos importar la librería TypeScript [Mitt](https://www.npmjs.com/package/mitt) a tu escena. Esta librería ofrece funciones simples para emitir y escuchar eventos.
{% endhint %}
