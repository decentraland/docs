---
description: Cómo definir valores de color
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/color-types
---

# Tipos de color

Los valores de color pueden pasarse como propiedades de diferentes componentes, como [Materiales](materials.md), [Texto](text.md) o diferentes propiedades de [entidades UI](../2d-ui/onscreen-ui.md). Los valores de color pueden ser de tipo `Color3` o `Color4`.

`Color3` contiene tres propiedades, _red_, _green_ y _blue_. `Color4` tiene esas mismas tres más `alpha`, para valores de transparencia.

## Establecer un color

Puedes crear un color usando las funciones `Color3.create()` o `Color4.create()`.

```ts
// Color rojo
const red3 = Color3.create(1, 0, 0)
const red4 = Color4.create(1, 0, 0, 1)
```

También puedes crear ciertos colores predeterminados que forman parte de los namespaces `Color3` y `Color4`.

```ts
const red = Color3.Red()
const blue = Color3.Blue()
const black = Color3.Black()
```

{% hint style="info" %}
**💡 Consejo**: Escribe `Color3.` o `Color4.` y Visual Studio debería sugerir todos los valores posibles en un menú desplegable inteligente.
{% endhint %}

De lo contrario, puedes elegir un color aleatorio usando la siguiente función:

```ts
const randomColor = Color3.Random()
```

Si prefieres describir un color en hexadecimal, usa `Color3.fromHexString()`.

```ts
const red = Color3.fromHexString('FD350A')
const blue = Color3.fromHexString('0A0CFD')
```

Cualquier valor de objeto que incluya valores numéricos para `r`, `g` y `b` puede interpretarse como un valor `Color3`. Del mismo modo, cualquier objeto que incluya esas propiedades más un valor `a` puede interpretarse como un valor `Color4`. Esto te permite usar también la siguiente sintaxis:

```ts
// Color rojo
const red3 = { r: 1, g: 0, b: 0 }
const red4 = { r: 1, g: 0, b: 0, a: 1 }
```

El siguiente ejemplo usa una propiedad de color como parte de un componente `TextShape`, para establecer el color del texto.

```ts
const myEntity = engine.addEntity()

Transform.create(myEntity, {
  position: Vector3.create(4, 1, 4),
})

TextShape.create(myEntity, {
  text: 'este texto es ROJO',
  textColor: Color4.create(1, 0, 0, 1),
})
```

{% hint style="warning" %}
**📔 Nota**: `Color3` y `Color4` deben importarse mediante

> `import { Color3, Color4 } from "@dcl/sdk/math"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Transparencia

Usa la propiedad _alpha_ de `Color4` para hacer un color translúcido.

Si alpha es 1, el color será completamente opaco, si es 0 será completamente invisible. Cualquier valor intermedio resulta en un tono parcialmente transparente.

```ts
// Completamente opaco
const opaque = Color4.create(1, 1, 1, 1)

// A mitad de camino
const half = Color4.create(1, 1, 1, 0.5)

// Casi invisible
const half = Color4.create(1, 1, 1, 0.1)
```

## Lerp

Usa la función `Color3.lerp()` o `Color4.lerp()` para definir un color que esté en algún punto entre otros dos colores. Estas funciones funcionan de manera similar a la función `Vector3.lerp()`.

Tanto `Color3.lerp()` como `Color4.lerp()` toman los siguientes argumentos:

* `left`: El primer color a usar como referencia
* `right`: El segundo color a usar como referencia
* `amount`: Un número de 0 a 1 para definir cuánto del color _left_ usar en la mezcla. Cuanto más cerca de 0, más cerca del color _left_.

```ts
const orange = Color3.lerp(Color3.Red(), Color3.Yellow(), 0.3)
```

Puedes usar un sistema para cambiar gradualmente el parámetro `amount`, para crear una transición suave.

```ts
// Sistemas
var pulseState: number = 0
const color1 = Color4.Red()
const color2 = Color4.Yellow()

export function PulseSystem(dt: number) {
  pulseState += dt
  const entitiesWithMaterial = engine.getEntitiesWith(Material)

  // iterar sobre las entidades del grupo
  for (const [entity] of entitiesWithMaterial) {
    const material = Material.getMutable(entity)
    material.albedoColor = Color4.lerp(color1, color2, Math.sin(pulseState))
  }
}

engine.addSystem(PulseSystem)
```
