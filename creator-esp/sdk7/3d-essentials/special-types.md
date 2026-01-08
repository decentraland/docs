---
description: Aprende qué tipos especiales existen, incluyendo Vector, Quaternions y más
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/special-types
---

# Tipos de geometría

## Vector3

Decentraland usa datos de _vector3_ para representar rutas, puntos en el espacio y direcciones. Los vectores también pueden usarse para definir orientaciones de rotación, como una alternativa más amigable a los _quaternions_. Un objeto Vector3 contiene valores numéricos para cada uno de los ejes _x_, _y_ y _z_.

```ts
const myVector: Vector3 = { x: 8, y: 1, z: 8 }
```

El namespace `Vector3` contiene una serie de métodos útiles que puedes llamar para evitar tener que lidiar con la mayoría de las operaciones matemáticas de vectores. Escribe `Vector3.`, y VS Studio mostrará un menú desplegable con todas las funciones disponibles.

A continuación se muestran algunas líneas que muestran la sintaxis para algunas operaciones básicas con vectores.

```ts
// Crear un objeto vector
let myVector = Vector3.create(3, 1, 5)

// Sintaxis alternativa para crear un objeto vector
let myOtherVector: Vector3 = { x: 8, y: 1, z: 8 }

// Editar uno de sus valores
myVector.x = 5

// Llamar funciones del namespace Vector3,
// Todas estas funciones requieren pasar objetos Vector3 en sus parámetros

let normalizedVector = Vector3.normalize(myVector)

let distance = Vector3.distance(myVector, myOtherVector)

let midPoint = Vector3.lerp(myVector, myOtherVector, 0.5)
```

Los objetos Vector3 a menudo se requieren en los campos de varios componentes. Por ejemplo, el componente `Transform` contiene valores `Vector3` para la _posición_ y _escala_ de la entidad.

Para crear un [componente personalizado](../architecture/custom-components.md) con parámetros que requieren valores Vector3, establece el tipo de estos parámetros como `Schema.Vector3`.

{% hint style="warning" %}
**📔 Nota**: `Vector3` debe importarse mediante

> `import { Vector3 } from "@dcl/sdk/math"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

### Atajos para escribir vectores de dirección

Existen los siguientes atajos para definir vectores genéricos:

* `Vector3.Zero()` devuelve _(0, 0, 0)_
* `Vector3.Up()` devuelve _(0, 1, 0)_
* `Vector3.Down()` devuelve _(0, -1, 0)_
* `Vector3.Left()` devuelve _(-1, 0, 0)_
* `Vector3.Right()` devuelve _(1, 0, 0)_
* `Vector3.Forward()` devuelve _(0, 0, 1)_
* `Vector3.Backward()` devuelve _(0, 0, -1)_

## Quaternions

Los Quaternions se usan para almacenar información de rotación para el componente Transform. Un Quaternion está compuesto por cuatro valores numéricos entre -1 y 1: _x_, _y_, _z_, _w_.

```ts
const myQuaternion: Vector3 = { x: 0, y: 0, z: 0, w: 1 }
```

Los Quaternions son diferentes de los ángulos [_Euler_](https://en.wikipedia.org/wiki/Euler_angles), la notación más común de _x_, _y_ y _z_ con números que van de 0 a 360 con la que la mayoría de la gente está familiarizada. El motor expresa todas las rotaciones como Quaternions, por lo que tiene sentido evitar cálculos para convertir desde y hacia euler siempre que sea posible.

El namespace `Quaternion` contiene una serie de métodos útiles que puedes llamar para evitar tener que lidiar con muchas operaciones matemáticas. Escribe `Quaternion.`, y VS Studio mostrará un menú desplegable con todas las funciones disponibles.

A continuación se muestran algunas líneas que muestran la sintaxis para algunas operaciones básicas con Quaternions.

```ts
// Crear un objeto quaternion
let myQuaternion = Quaternion.crate(0, 0, 0, 1)

// Editar uno de sus valores
myQuaternion.x = 1

// Llamar funciones del namespace quaternion
let midPoint = Quaternion.slerp(myQuaternion1, myQuaternion2, 0.5)

let rotationDifference = Quaternion.fromToRotation(
  myQuaternion1,
  myQuaternion2,
  Quaternion.Zero()
)
```

Dado que es mucho más fácil pensar en términos de grados Euler, el SDK incluye un par de funciones para convertir desde y hacia Quaternions y Euler.

{% hint style="info" %}
**💡 Consejo**: Evita ejecutar estas conversiones como parte de lógica recurrente dentro de un sistema, que se ejecuta en cada tick, ya que eso puede volverse costoso. Estas conversiones son principalmente útiles para operaciones puntuales, como establecer la rotación de una nueva entidad.
{% endhint %}

```ts
// De euler a Quaternion
let myQuaternion = Quaternion.fromEulerDegrees(90, 0, 0)

// De quaternion a Euler
let myEuler = Quaternion.toEulerAngles(myQuaternion)
```

Los objetos Quaternion a menudo se requieren en los campos de los componentes. Por ejemplo, el componente `Transform` contiene valores `Quaternion` para la rotación de la entidad.

Para crear un [componente personalizado](../architecture/custom-components.md) con parámetros que requieren valores Quaternion, establece el tipo de estos parámetros como `Schema.Quaternion`.

{% hint style="warning" %}
**📔 Nota**: `Quaternion` debe importarse mediante

> `import { Quaternion } from "@dcl/sdk/math"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Scalars

Un scalar no es más que un número. Por esa razón, no tiene mucho sentido instanciar un objeto `Scalar` para almacenar datos, ya que puedes hacer lo mismo con un número. Sin embargo, las funciones en el namespace `Scalar` exponen varias funciones útiles (similares a las del namespace _Vector3_), que pueden usarse en números.

```ts
// Llamar funciones de la clase Scalar
let random = Scalar.randomRange(1, 100)

let midPoint = Scalar.lerp(number1, number2, 0.5)

let clampedValue = Scalar.clamp(myInput, 0, 100)
```

{% hint style="warning" %}
**📔 Nota**: `Scalar` debe importarse mediante

> `import { Scalar } from "@dcl/sdk/math"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}
