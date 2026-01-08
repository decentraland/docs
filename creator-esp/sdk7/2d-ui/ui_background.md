---
description: Establece un fondo y borde de una entidad UI.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/ui_background
---

# Fondo UI

Las siguientes propiedades se usan para establecer un fondo y borde en una entidad UI.

### Fondo

Un componente `uiBackground` da color o una textura al área de una entidad. Usa el tamaño y posición definidos por el `uiTransform` de la entidad.

Los siguientes campos pueden configurarse, todos son opcionales:

* `color`: El color a usar en la entidad, como un valor [Color4](../sdk7/3d-essentials/color-types.md).

{% hint style="info" %}
**💡 Tip**: Haz una entidad semi-transparente estableciendo el 4to valor del `Color4` a menos de 1.
{% endhint %}

*   `texture`: La textura a mostrar en la entidad, esto toma un objeto con varios parámetros sobre la textura. Las mismas propiedades están disponibles que en texturas en [materiales en entidades 3D](../sdk7/3d-essentials/materials.md#using-textures).

    * `src`: La ruta al archivo de imagen a usar como textura. (string)
    * `filterMode`: _(opcional)_ Determina cómo se estiran o comprimen los píxeles en la textura cuando se renderizan. Consulta [Escalado de Textura](../sdk7/3d-essentials/materials.md#texture-scaling). (FilterMode = 'point' | 'bi-linear' | 'tri-linear')
    * `wrapMode`: _(opcional)_ Determina cómo se coloca una textura en mosaico sobre una entidad. Esto toma un valor del enum `TextureWrapMode`. (WrapMode = 'repeat' | 'clamp' | 'mirror' | 'mirror-once')

    > Tip: Puedes combinar ambas propiedades `texture` y `color` en un solo componente `uiBackground` para producir una textura teñida.
* `textureMode`: Selecciona cómo quieres que la textura se adapte al tamaño de la entidad a la que se aplica. (TextureMode = 'nine-slices' | 'center' | 'stretch') enum, que soporta los siguientes valores:
  * `center`: La textura no se estira, se posiciona centrada en la entidad y partes de ella pueden recortarse dependiendo del tamaño de la entidad.
  * `stretch`: La textura se estira para coincidir con toda la superficie de la entidad.
  * `nine-slices`: Partes de la textura se estiran para coincidir con toda la superficie de la entidad, dejando márgenes sin estirar. Consulta [texturas nine-slice](ui_background.md#nine-slice-textures).
* `avatarTexture`: Muestra una miniatura de perfil de avatar, basada en un ID de avatar. Consulta [Retratos de Avatar](ui_background.md).
* `textureSlices`: Determina los márgenes a usar al usar el modo de textura nine-slice, consulta [texturas nine-slice](ui_background.md#nine-slice-textures). Establece un número menor que 1, como una fracción del ancho o alto total de la imagen.

Color simple:

_**Archivo ui.tsx:**_

```tsx
import { ReactEcs, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400
    }}
    uiBackground={{
		color: Color4.create(0.5, 0.8, 0.1, 0.6)
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

Patrón de textura repetida:

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400
    }}
    uiBackground={{
		textureMode: 'center'
		texture: {
			src: "images/brick-wall-texture.png",
			wrapMode: 'repeat'
		}
	}}
  />
)
```

### Bordes

Algunas propiedades se usan para establecer un borde alrededor de una entidad UI. Estas propiedades existen en el componente `uiTransform`. Cada una te permite establecer ya sea un solo valor para todos los lados del borde, o diferentes valores para cada lado.

* `borderColor`: El color a usar en la entidad, como un valor [Color4](../sdk7/3d-essentials/color-types.md).
* `borderWidth`: El ancho del borde, como un número en píxeles. También soporta valores en porcentajes, por ejemplo `borderWidth: '2%'` establecerá el ancho del borde al 2% del ancho de la entidad.
* `borderRadius`: Usa esta propiedad para darle a las esquinas de la entidad un borde redondeado. Establece el radio de las esquinas en píxeles.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400,
      borderColor: Color4.Red(),
      borderWidth: 4,
      borderRadius: 10
    }}
  />
)
```

`borderWidth`, `borderColor` y `borderRadius` también pueden establecerse con diferentes valores para cada lado de la entidad.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400,
      borderColor: { top: Color4.White(), left: Color4.Red(), right: Color4.Blue(), bottom: Color4.Gray() },
      borderRadius: { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight:0 },
      borderWidth: { top: 3, left: 2, right: 3, bottom: 4 }
    }}
  />
)
```

### Opacidad

Usa la propiedad `opacity` en el `Transform` de una `UiEntity` para agregar transparencia a la entidad y todos sus hijos. La propiedad opacity es un valor de 0 a 1, donde 0 es completamente transparente y 1 completamente opaco.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400,
      opacity: 0.7
    }}
    uiBackground={{ color: Color4.Green() }}
  >
    <UiEntity
        uiTransform={{
          width: 100,
          height: 30,
        }}
        uiText={{
          value: "Este texto también es transparente",
          fontSize: 40
        }}
      />
   </UiEntity>
)
```

El valor de opacity afecta todos los hijos de una UiEntity, aplicando transparencia a colores de fondo, colores de texto e imágenes de fondo. Cuando tanto el padre como un hijo tienen valores de opacity, la opacidad final del hijo es el producto de su propio valor y el del padre.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 700,
      height: 400,
      opacity: 0.7
    }}
    uiBackground={{ color: Color4.Green() }}
  >
    <UiEntity
      uiTransform={{
        width: 100,
        height: 30,
        opacity: 0.7
      }}
      uiText={{
        value: "Este texto es aún más transparente",
        fontSize: 40
      }}
    />
  </UiEntity>
)
```

### Texturas Nine-slice

Puedes usar [escalado 9-slice](https://en.wikipedia.org/wiki/9-slice_scaling) con tus texturas, para asegurar que las esquinas y márgenes no se estiren de manera desigual.

Con esta técnica popular, divides una imagen en 9 segmentos, que se estirarán de diferentes maneras para preservar las proporciones de los márgenes y esquinas. Por ejemplo, usa esto para definir fondos de esquinas redondeadas que se adapten fácilmente a cualquier tamaño. Considera la siguiente imagen (tomada de [Wikipedia](https://en.wikipedia.org/wiki/9-slice_scaling#/media/File:Traditional_scaling_vs_9-slice_scaling.svg)):

En esta imagen vemos la textura original (arriba-izquierda), y el resultado de escalarla de manera tradicional (arriba-derecha); nota cómo las esquinas se deforman. Debajo de eso, vemos la textura segmentada en 9 rebanadas (abajo-izquierda), y luego el resultado de estirar la imagen según el método 9-slice (abajo-derecha).

Aquí está cómo se afecta cada segmento, usando la imagen anterior como referencia.

* El segmento 5 es la única parte de la imagen que se estira completamente en los ejes x e y.
* Los segmentos 1,3, 7, y 9 (las esquinas) no se estiran en absoluto.
* Los segmentos 2 y 8 solo se estiran horizontalmente
* Los segmentos 4 y 6 solo se estiran verticalmente.

Para usar estiramiento nine-slice en una entidad, establece el `textureMode` a `BackgroundTextureMode.NINE_SLICES`. Opcionalmente también puedes establecer un ancho para el margen en cada lado en `textureSlices`.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'

export const uiMenu = () => (
  <UiEntity
    uiTransform={{ width: 700, height: 400 }}
    uiBackground={{
      textureMode: 'nine-slices',
      texture: {
        src: 'images/rounded_alpha_square.png'
      },
      textureSlices: {
        top: 0.2,
        bottom: 0.2,
        left: 0.2,
        right: 0.2
      }
	}}
  />
)
```
