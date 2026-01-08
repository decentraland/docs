---
description: Cómo agregar texto a tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/text
---

# Formas de texto

Agrega texto a una escena usando el componente `TextShape`. Este texto se sitúa en una posición

El texto en Decentraland admite todos los caracteres _utf8_, esto incluye caracteres orientales y especiales.

{% hint style="warning" %}
**📔 Nota**: Este componente es útil para etiquetas y interfaces de usuario en el mundo que existen en el espacio 3D de la escena, no para la interfaz de usuario 2D del HUD del jugador.
{% endhint %}

El componente `TextShape` es mutuamente exclusivo con otros componentes de forma como formas primitivas y modelos 3D glTF, consulta [Componentes de forma](shape-components.md) para más detalles.

Para agregar texto como etiqueta en una entidad existente, creas una segunda entidad que tiene el componente `TextShape` y la estableces como hija de la otra entidad.

## Usar el Scene Editor

La forma más fácil de colocar texto en el mundo es agregar un [Smart item](../../scene-editor/smart-items.md) **Text** visualmente en el [Scene Editor](../../scene-editor/about-editor.md). Luego puedes establecer todos los campos disponibles en la UI del Scene Editor.



## Crear un componente de texto

El siguiente ejemplo muestra cómo crear un componente `TextShape` y agregarlo a una entidad mediante código.

```ts
const sign = engine.addEntity()

Transform.create(sign, {
	position: Vector3.create(8, 1, 8),
})

TextShape.create(sign, {
	text: 'Hola Mundo',
})
```

{% hint style="warning" %}
**📔 Nota**: Si la entidad con el componente de texto es hija de otra entidad, entonces se verá afectada por la escala del padre. Si el padre está escalado de manera desigual a lo largo de sus ejes, esto resultará en que el texto también se estire o comprima.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Los componentes `TextShape` no son clickeables. Los componentes `PointerEvents` no se activan cuando se usan en entidades que tienen un componente `TextShape`.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: `TextShape` debe importarse mediante

> `import { TextShape } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Cambiar el valor del texto

Al crear un nuevo componente de texto, le asignas una cadena para mostrar. Esta cadena se almacena en el campo `text`.

Si deseas cambiar la cadena mostrada por el componente, puedes hacerlo en cualquier momento cambiando el campo `text` en una [versión mutable](../programming-patterns/mutable-data.md) del componente.

```ts
const mutableText = TextShape.getMutable(myEntity)

mutableText.text = 'nueva cadena'
```

## Propiedades básicas del texto

El componente `TextShape` tiene varias propiedades que se pueden establecer para darle estilo al texto. A continuación se muestran algunas de las más comunes:

* `font`: Valor del enum `Font`.
* `fontSize`: _number_. Una entidad con fuente 10 mide 1 metro de altura.
* `textColor`: objeto _Color4_. Los objetos _Color4_ almacenan un color _RBG_ como tres números de 0 a 1, más _alpha_ para transparencia. Consulta [tipos de color](color-types.md) para más detalles.

```ts
TextShape.create(sign, {
	text: 'Hola Mundo',
	textColor: { r: 1, g: 0, b: 0, a: 1 },
	fontSize: 5,
	font: Font.F_SANS_SERIF,
})
```

## Fuentes

Las formas de texto pueden usar fuentes del enum `Font`. Este enum actualmente incluye las siguientes fuentes:

* `Font.FSansSerif`
* `Font.FSerif`
* `Font.FMonospace`

Por defecto usa `Font.FSansSerif`.

```ts
TextShape.create(sign, {
	text: 'Hola Mundo',
	textColor: { r: 1, g: 0, b: 0 },
	fontSize: 5,
	font: Font.FSansSerif,
})
```

{% hint style="warning" %}
**📔 Nota**: Actualmente, todas las fuentes se renderizan como Sans Serif. Este es un problema conocido a corregir en el futuro.
{% endhint %}

{% hint style="info" %}
**💡 Consejo**: Si usas VS studio u otro IDE, escribe `Font.` y deberías ver una lista de sugerencias con todas las fuentes disponibles.
{% endhint %}

## Propiedades de alineación y padding del texto

El componente `TextShape` crea una caja de texto que tiene un tamaño, padding, etc.

* `textAlign`: Selecciona un valor del enum `TextAlignMode`. Los valores posibles incluyen todas las combinaciones entre alineación vertical (_top_, _bottom_, _center_) y horizontal (_left_, _right_, _center_).
* `width`: _number_. El ancho de la caja de texto.
* `height`: _number_. La altura de la caja de texto.
* `paddingTop`: _number_. Espacio entre el texto y el contorno de la caja de texto.
* `paddingRight`: _number_. Espacio entre el texto y el contorno de la caja de texto.
* `paddingBottom`: _number_. Espacio entre el texto y el contorno de la caja de texto.
* `paddingLeft`: _number_. Espacio entre el texto y el contorno de la caja de texto.
* `zIndex`: _number_. Útil para cuando múltiples entidades planas ocupan el mismo espacio, determina cuál mostrar al frente.

{% hint style="info" %}
**💡 Consejo**: Si un texto está destinado a flotar en el espacio, es una buena idea agregar un [componente `Billboard`](entity-positioning.md#face-the-user) para que el texto rote para mirar siempre al jugador y sea legible.
{% endhint %}

## Propiedades de sombra y contorno del texto

El texto no tiene sombra por defecto, pero puedes establecer los siguientes valores para darle un efecto similar a una sombra.

* `shadowBlur`: _number_
* `shadowOffsetX`: _number_
* `shadowOffsetY`: _number_
* `shadowColor`: objeto _Color3_. Los objetos _Color3_ almacenan un color _RBG_ como tres números de 0 a 1.

```ts
TextShape.create(sign, {
	text: 'Texto con sombra',
	shadowColor: { r: 1, g: 0, b: 0 },
	shadowOffsetY: 1,
	shadowOffsetX: -1,
})
```

Las letras en el texto también pueden tener un contorno en un color diferente rodeando su perímetro.

* `outlineWidth`: _number_. Qué tan ancho será el contorno del texto, en todas las direcciones, como un número de 0 a 1. Por defecto _0_, lo que lo hace invisible.
* `outlineColor`: objeto _Color3_. Los objetos _Color3_ almacenan un color _RBG_ como tres números de 0 a 1.

## Múltiples líneas

Si deseas que tu texto abarque múltiples líneas, usa `\n` como parte de la cadena. El siguiente ejemplo tiene dos líneas separadas de texto:

```ts
TextShape.create(sign, {
	text: 'Esta es una línea. \nEsta es otra línea',
})
```

También puedes configurar las siguientes propiedades relacionadas con textos con múltiples líneas:

* `lineCount`: _number_. Cuántas líneas de texto caben en la caja de texto como máximo. Por defecto _1_. La propiedad `textWrapping` debe ser _true_ para usar más de una línea.
* `lineSpacing`: _string_. Cuánto espacio entre cada línea, expresado como una cadena. Por ejemplo "30px".
