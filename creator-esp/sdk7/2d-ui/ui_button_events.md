---
description: Maneja eventos de botón en entidades UI.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/ui_button_events
---

# Eventos de Botón UI

Para crear un botón en tu UI, crea un elemento UI `Button` con las siguientes propiedades:

* `value`: Una cadena con el texto a mostrar en el botón.
* `onMouseDown`: Una función callback que se ejecuta cada vez que el usuario presiona el botón del puntero en la entidad.
* `uiTransform`: Propiedades de posicionamiento del elemento UI.

El siguiente ejemplo muestra cómo crear un botón UI clicable.

_**Archivo ui.tsx:**_

```tsx
import { Button } from '@dcl/sdk/react-ecs'

export const uiMenu = () => (
	<Button
		value="Click me"
		uiTransform={{ width: 100, height: 100 }}
		onMouseDown={() => {
			console.log('Clicked on the UI')
		}}
	/>
)
```

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu)
}
```

{% hint style="warning" %}
**📔 Nota**: Todos los siguientes fragmentos en esta página asumen que tienes un `.ts` similar al anterior, ejecutando la función `ReactEcsRenderer.setUiRenderer()`.
{% endhint %}

También puedes escribir la función que es ejecutada por el clic fuera de la definición de la UI, y referenciarla por nombre. Esto ayuda a mantener el código de la UI más legible, y también es útil si múltiples entidades UI clicables necesitan llamar a la misma función.

```tsx
import { Button } from '@dcl/sdk/react-ecs'

function handleClick() {
	// Hacer algo onClick
	console.log('Clicked on the UI')
}
export const uiMenu = () => (
	<Button
		value="Click me"
		uiTransform={{ width: 100 }}
		onMouseDown={{ handleClick }}
	/>
)
```

Los siguientes campos pueden agregarse a un elemento UI `Button`:

* `onMouseDown`: Una función callback que se ejecuta cada vez que el usuario presiona el botón del puntero en la entidad.
* `onMouseUp`: Una función callback que se ejecuta cada vez que el botón del puntero se levanta mientras apunta a la entidad.
* `onMouseEnter`: Una función callback que se ejecuta cada vez que el puntero comienza a pasar sobre el botón.
* `onMouseLeave`: Una función callback que se ejecuta cada vez que el puntero deja de pasar sobre el botón.
* `color`: Color de fondo del botón.
* `font`: Fuente del texto en el botón.
* `textAlign`: Alineación del texto dentro del botón
* `uiTransform`: Propiedades de posicionamiento del elemento UI.
* `uiBackground`: Establece el color o textura del elemento UI.
* `variant`: Usa esta propiedad para establecer el estilo del botón como uno de los predeterminados. `primary` y `secondary` están disponibles.
* `disabled`: Booleano para establecer un botón deshabilitado. Cuando disabled está establecido en _true_, las acciones `onMouseDown` y `onMouseUp` ya no se llaman. También el valor `alpha` del color tanto del texto como del fondo se reduce a la mitad, por lo que el botón está "atenuado" y destaca menos.

### Estilo de botón

Establece el variant a `primary` o `secondary` para aprovechar las opciones de estilo predeterminadas para botones. `primary` hace que tu botón sea rojo con texto blanco, `secondary` hace que tu botón sea blanco con texto rojo.

```tsx
import { UiEntity, Button, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity
		uiTransform={{
			width: 500,
			height: 230,
			margin: '16px 0 8px 270px',
			padding: 4,
			alignSelf: 'center',
		}}
		uiBackground={{ color: Color4.Gray() }}
	>
		<Button
			value="Click Me"
			variant="primary"
			uiTransform={{ width: 80, height: 20, margin: 4 }}
			onMouseDown={() => {
				console.log('Clicked on the UI')
			}}
		/>
		<Button
			value="Click Me"
			variant="secondary"
			uiTransform={{ width: 80, height: 20, margin: 4 }}
			onMouseDown={() => {
				console.log('Clicked on the UI')
			}}
		/>
	</UiEntity>
)
```

También eres libre de usar todas las propiedades de fondo libremente. También puedes establecer un variant y luego sobrescribir algunas de sus propiedades. Este ejemplo usa el variant `primary`, pero sobrescribe el color para que sea verde:

```tsx
import { Button } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<Button
		value="My Button!"
		variant="primary"
		uiTransform={{ width: 100, height: 100 }}
		onMouseDown={() => {
			console.log('Clicked on My Button!')
		}}
		uiBackground={{
			color: Color4.Green(),
		}}
	/>
)
```

### Botones togglables

Un caso de uso común es hacer que un botón alterne entre dos estados, como un interruptor. El ejemplo a continuación cambia entre dos colores cada vez que se presiona el botón:

```tsx
import { Button } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

let buttonEnabled = false

export const uiMenu = () => (
	<Button
		value="My Button"
		variant="primary"
		uiTransform={{ width: 100, height: 100 }}
		onMouseDown={() => {
			console.log('Clicked on My Button!')
			buttonEnabled = !buttonEnabled
			if (buttonEnabled) {
				// hacer algo
			} else {
				// hacer otra cosa
			}
		}}
		uiBackground={{
			color: buttonEnabled ? Color4.Green() : Color4.Red(),
		}}
	/>
)
```

Ten en cuenta que en el ejemplo anterior, el color depende de una variable `buttonEnabled`. Siempre que el valor de esta variable cambia, afecta inmediatamente el color de fondo.

### Retroalimentación de Hover

Otro caso de uso común es mostrar algún tipo de pista visual al pasar el cursor sobre un botón, para aclarar que esto es interactivo, o incluso mostrar un hint de hover explicando qué hace este botón. Usa los callbacks `onMouseEnter` y `onMouseLeave` para detectar cuándo el cursor del jugador está en el botón, y reaccionar en consecuencia.

```tsx
import { Button } from '@dcl/sdk/react-ecs'

let buttonEnabled = false

export const uiMenu = () => (
	<Button
		value="My Button"
		uiTransform={{ width: 100, height: 100 }}
		onMouseDown={() => {
			// función del botón
		}}
		onMouseEnter={() => {
			// mostrar hint
		}}
		onMouseLeave={() => {
			// ocultar hint
		}}
	/>
)
```

### Hacer otros elementos clicables

Cualquier elemento en la UI puede hacerse clicable agregando una propiedad `onMouseDown`, funciona idénticamente a un botón. El siguiente ejemplo agrega propiedades `onMouseDown` a imágenes de fondo y texto.

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity
		onMouseDown={() => {
			console.log('Background clicked!')
		}}
		uiTransform={{
			width: 400,
			height: 230,
		}}
		uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
	>
		<Label
			onMouseDown={() => {
				console.log('Label clicked!')
			}}
			value={`Player: ${getPlayerPosition()}`}
			fontSize={18}
			uiTransform={{ width: '100%', height: 30 }}
		/>
	</UiEntity>
)
```

### Bloqueo de puntero

Todas las entidades UI son no bloqueantes de puntero por defecto, lo que significa que los clics de los jugadores pasarán a través de ellas e interactuarán con objetos en el espacio mundial 3D detrás de ellas. Si una entidad tiene un callback `onMouseDown`, entonces se vuelve bloqueante de puntero, por lo que los clics del jugador no afectan lo que está detrás de esa entidad UI.

Puedes cambiar este comportamiento predeterminado cambiando el valor de la propiedad `pointerFilter` en el componente `uiTransform` en cualquier entidad UI. Por ejemplo, para establecer una entidad que no tiene `onMouseDown` para que sea bloqueante de puntero.

Los valores soportados para `pointerFilter` son:

* `block`: El elemento UI es bloqueante de puntero, los jugadores no pueden hacer clic en nada detrás de este elemento UI.
* `none`: El elemento UI es no bloqueante de puntero. El elemento no es clicable y cualquier cosa detrás de él puede ser clicada.

A continuación una UI simple que no tiene `onMouseDown`, pero que sobrescribe el comportamiento predeterminado de no ser bloqueante de puntero estableciendo `pointerFilter` en `block`.

```tsx
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

// dibujar UI
export const uiMenu = () => (
	<UiEntity
		uiTransform={{
			width: '100%',
			height: '100px',
			pointerFilter: `block`,
		}}
		uiText={{ value: `Este elemento es bloqueante de puntero`, fontSize: 40 }}
		uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
	/>
)
```
