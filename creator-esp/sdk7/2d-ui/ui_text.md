---
description: Escribe texto en entidades UI.
metaLinks:
  alternates:
    - https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/ui_text
---

# Texto UI

Agrega texto a tu UI creando una entidad `Label`.

Una entidad `Label` tiene los siguientes campos que pueden configurarse:

* `value`: La cadena a mostrar
*   `fontSize`: El tamaño del texto, como un número.

    > NOTA: El `fontSize` no se ve afectado por el tamaño de su entidad o entidades padre.
* `color`: El color del texto, como un [Color4](../sdk7/3d-essentials/color-types.md).
* `font`: La fuente a usar, tomando un valor del enum `Font`. Los valores soportados son:
  * `serif`
  * `sans-serif` _(predeterminado)_
  * `monospace`
* `textAlign`: Cómo se alineará el texto con su padre. Toma un valor del tipo `TextAlingType`. TextAlignType = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
* `textWrap`: Si el texto usa saltos de línea para asegurar que todo se ajuste en el ancho máximo permitido. Cuando se usa react-ecs (el componente `Label` o la propiedad `uiText` en `UiEntity`), el ajuste de texto está **activado por defecto** (`'wrap'`). Si usas el componente SDK de nivel inferior `UiText` directamente (`UiText.create` / `UiText.createOrReplace`) sin establecer este campo, el motor vuelve al comportamiento sin ajuste. Para un comportamiento predecible independientemente de la capa SDK, siempre establece `textWrap` explícitamente.

{% hint style="warning" %}
**📔 Nota**: El `fontSize` no se ve afectado por el tamaño de su entidad o entidades padre.
{% endhint %}

Una entidad `Label` también puede tener otros componentes comunes encontrados en otros tipos de entidades UI, como `uiTransform` y `uiBackground`.

_**Archivo ui.tsx:**_

```ts
import { UiEntity, Label, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity uiTransform={{ width: 'auto', height: 'auto' }}>
		<Label
			value="This is a label"
			color={Color4.Red()}
			fontSize={29}
			font="serif"
			textAlign="top-left"
		/>
	</UiEntity>
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

Si una línea de texto es demasiado larga para ajustarse en el ancho asignado, o el ancho máximo de su contenedor, el texto continuará en la siguiente línea. Puedes desactivar esto cambiando el valor de la propiedad `textWrap` a `'nowrap'`.

También puedes forzar un salto de línea agregando explícitamente `\n` a la cadena.

```ts
import { TextWrap } from "@dcl/sdk/ecs";
import { UiEntity, Label, ReactEcs } from '@dcl/sdk/react-ecs'

export const uiMenu = () => (
	<UiEntity uiTransform={{ width: 700, height: 400 }}>
		<Label 
			value="Hello World!\nEsta otra parte es bastante larga. Probablemente no quepa en una sola línea, así que incluirá un salto de línea en alguna parte.\nCuarta línea"
			textWrap= {`nowrap`} 
		/>
	</UiEntity>
)
```

Si no se establece explícitamente `height` o `width` en el `uiTransform` del contenedor, el contenedor usará el valor `auto`, que se ajusta para ajustarse a todo el texto. Puedes establecer un `maxWidth` y un `maxHeight` para asegurar que no exceda ciertos límites. También puedes usar `minWidth` y `minHeight` para asegurar que el contenedor no crezca demasiado pequeño, incluso si el texto es más corto.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity
		uiTransform={{
			minWidth: 100,
			maxWidth: 300,
			height: 'auto',
			alignSelf: 'center',
			padding: 10,
		}}
		uiBackground={{
			color: Color4.Red(),
		}}
		uiText={{
			value: 'Hello world!',
			fontSize: 18,
		}}
	/>
)
```

### Tamaño de texto responsivo

Usa la función `scaleFontSize()` para proporcionar valores de fuente que se ajusten al tamaño de pantalla del jugador. Al establecer la propiedad `fontSize` de una entidad UI de texto, pasa esta función en lugar de un solo número.

```ts
import { scaleFontSize } from '@dcl/sdk/react-ecs'
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 'auto',
      height: 'auto',
      alignSelf: 'center',
      padding: 10,
    }}
    uiText={{
      value: 'Hello world!',
      fontSize={scaleFontSize(15)}
    }}
  />
)
```

La función `scaleFontSize()` requiere dos parámetros:

* `fontSize`: El tamaño de fuente base a usar.
* `scaleUnit` _(opcional)_: El factor de escalado. Esto determina si el texto debe ajustarse basándose en el ancho o alto de la pantalla, y un multiplicador de cuánto adaptarse. Predeterminado: `"0.39vh"`. Los valores pueden ser:
  * _Number_: Un número simple, en este caso se interpreta como relativo al _width_
  * _String terminando en **vw**_: Esto hace que el número sea relativo al ancho de la vista. Por ejemplo `"0.8vw"`
  * _String terminando en **vh**_: Esto hace que el número sea relativo al alto de la vista. Por ejemplo `"0.8vh"`

{% hint style="info" %}
**💡 Tip**: Esta función funciona similar a la función CSS `calc()`.
{% endhint %}

El valor de `scaleUnit` es un porcentaje del ancho o alto de la ventana. Así que un `scaleUnit` de `"100vw"` es 100% del ancho de la pantalla, un valor de `"0.5vw"` es 0.5% del ancho de la pantalla.

La fórmula que `scaleFontSize()` sigue es que multiplica el ancho o alto de la pantalla por el `scaleUnit` y agrega a eso el `fontSize` pasado en el primer parámetro.

```ts
tamaño de fuente final = fontSize + (ancho de pantalla * scaleUnit / 100 )
```

Por ejemplo, en el fragmento a continuación usa un valor de `scaleUnit` de 0.8. Si el ancho de pantalla es _1280px_ eso resultará en texto de tamaño de **26.84**, habiendo seguido la ecuación `15 + (1280 * 0.8 / 100)`.

```ts
import { scaleFontSize } from '@dcl/sdk/react-ecs'
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 'auto',
      height: 'auto',
      alignSelf: 'center',
      padding: 10,
    }}
    uiText={{
      value: 'Hello world!',
      fontSize={scaleFontSize(15, 0.8)}
    }}
  />
)
```

{% hint style="info" %}
**💡 Tip**: Si no tienes diferentes tamaños de pantalla para probar, puedes intentar usar el Web Explorer y redimensionar la ventana donde ejecutas la vista previa. El texto se ajustará instantáneamente cada vez que cambies la ventana.
{% endhint %}

Como alternativa a usar la función `scaleFontSize()`, también puedes ajustar el tamaño de fuente al tamaño de pantalla usando los métodos descritos en [Tamaño UI Responsivo](../sdk7/2d-ui/ui-positioning.md#responsive-ui-size).
