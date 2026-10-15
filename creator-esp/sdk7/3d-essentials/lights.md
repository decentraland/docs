---
description: Aprende cómo usar luces en tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/lights
---

# Luces

Las luces son una parte fundamental de los gráficos 3D. Se utilizan para iluminar la escena y crear una sensación de profundidad y realismo, y se pueden usar para crear diferentes estados de ánimo y atmósferas.

Por defecto, la escena está iluminada con una única luz direccional. Esta es una luz que brilla en una dirección específica, y se utiliza para simular el sol o la luna. Consulta [Control de Skybox](../interactivity/skybox-control.md) para más información.

Puedes agregar hasta 1 luz por parcela en tu escena.

Hay dos tipos de luces compatibles:

* Luz puntual: Una luz que brilla en todas las direcciones desde un punto específico.
* Luz de foco: Una luz que brilla en una dirección específica, y cubre solo un área en forma de cono.

## Agregar una luz

Para agregar una luz a tu escena, necesitas crear una entidad de luz y agregarle el componente `LightSource`.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
})

LightSource.create(light, {
  type: LightSource.Type.Point({})
})
```

{% hint style="warning" %}
**📔 Nota**: Una luz con el brillo predeterminado apenas será visible con el sol del mediodía, como en el mundo real. Puedes usar el [Control de Skybox](../interactivity/skybox-control.md) para forzar el skybox a la noche, o aumentar el brillo estableciendo la propiedad `intensity` del componente `LightSource` a un valor más alto.
{% endhint %}

## Luces de foco

Las luces de foco son luces que brillan en una dirección específica y cubren un área específica en forma de cono. La dirección de la luz está definida por el componente Transform de la entidad. La apertura del cono está definida por las propiedades `innerAngle` y `outerAngle` del componente `LightSource`.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
  rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
})

LightSource.create(light, {
	type: LightSource.Type.Spot({
      innerAngle: 30,
      outerAngle: 60
    }),
	shadow: true
})
```

El `innerAngle` es el ángulo del cono interior, donde la luz está a pleno brillo, y el `outerAngle` es el ángulo del cono exterior, donde la luz se desvanece gradualmente hacia los bordes del cono. Puedes jugar con estos valores para crear diferentes efectos, para luces que están más enfocadas o más difusas.

## Intensidad y color

Todas las luces, tanto puntuales como de foco, tienen un color y una intensidad. El color está definido por la propiedad `color` del componente `LightSource`, y la intensidad está definida por la propiedad `intensity`.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
})

LightSource.create(light, {
  type: LightSource.Type.Point({}),
  color: Color3.Red(),
  intensity: 10000,
})
```

El color es un objeto `Color3`, si no se especifica será blanco. Puedes establecer esto a cualquier color que desees, lo que puede tener un gran impacto en el estado de ánimo de la escena.

La intensidad se expresa en candelas (lúmenes/m^2 a 1 m de distancia, o lúmenes divididos por 4\*pi).

La intensidad predeterminada es 16000, este es el brillo de una bombilla promedio en el mundo real y se puede ver hasta alrededor de 10 metros de la fuente de luz. Si necesitas que la luz sea visible desde más lejos, o durante el día, puedes aumentar la intensidad.

La distancia a la que la luz es visible es la raíz cuadrada del valor de intensidad.

* A una intensidad de 100, la luz es visible hasta alrededor de 10 metros de distancia.
* A una intensidad de 1000, la luz es visible hasta alrededor de 31 metros de distancia.
* A una intensidad de 10000, la luz es visible hasta alrededor de 100 metros de distancia.

## Sombras

Cada luz puede proyectar sombras o no. Por defecto no lo hacen, pero puedes habilitarlas estableciendo la propiedad `shadow` del componente `LightSource` en `true`.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
  rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
})

LightSource.create(light, {
	type: LightSource.Type.Spot({
      innerAngle: 30,
      outerAngle: 60
    }),
	shadow: true
})
```

{% hint style="warning" %}
**📔 Nota**: Las sombras solo son compatibles con luces de foco. Las luces puntuales no admiten sombras. Si hay múltiples luces en la escena, algunas de ellas pueden no estar proyectando sombras, consulta [Optimización de luz](lights.md#light-optimization) para más información.
{% endhint %}

## Encender y apagar una luz

El componente LightSource tiene una propiedad `active` que se puede usar para encender y apagar una luz. Esto es útil si deseas apagar una luz sin eliminarla de la escena, o sin establecer la `intensity` en 0 y perder la referencia de cuál era la intensidad original.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
  rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
})

LightSource.create(light, {
	type: LightSource.Type.Spot({
      innerAngle: 30,
      outerAngle: 60
    }),
	shadow: true
})

const switch = engine.addEntity()

Transform.create(switch, {
  position: Vector3.create(8, 1, 10),
})

MeshRenderer.setBox(switch, {})

MeshCollider.setBox(switch, {})

pointerEventsSystem.onPointerDown(
	{
		entity: switch,
		opts: {
			button: InputAction.IA_POINTER,
			hoverText: 'Click',
		},
	},
	function () {
		LightSource.getMutable(light).active = !LightSource.getMutable(light).active
	}
)
```

## Optimización de luz

Las fuentes de luz pueden tener un gran impacto en el rendimiento de tu escena. Por esta razón, el motor optimizará automáticamente la escena deshabilitando algunas de las luces o sus sombras, comenzando con las que están más lejos.

El número permitido de luces activas en una escena está limitado a una por parcela, y más allá de eso depende de la configuración de calidad seleccionada por el usuario.

* Calidad baja: Máximo 4 luces (en una escena con suficientes parcelas)
* Calidad media: Máximo 6 luces (en una escena con suficientes parcelas)
* Calidad alta: Máximo 10 luces (en una escena con suficientes parcelas)

Si hay más luces de las permitidas, el motor deshabilitará automáticamente luces basándose en la proximidad de la fuente de luz al jugador. A medida que el jugador se mueve, el motor volverá a habilitar luces que están lo suficientemente cerca del jugador.

En todos los casos, el motor solo renderizará sombras para hasta 3 fuentes de luz. Si hay más luces con sombras que 3, el motor deshabilitará automáticamente las sombras para las luces restantes que están más lejos.

Además del número máximo de luces permitidas, las sombras también dependen de la distancia del jugador.

* Menos de 10 metros de distancia: Las sombras se renderizan como sombras suaves (alta calidad)
* Entre 10 y 20 metros de distancia: Las sombras se renderizan como sombras duras (baja calidad)
* Entre 20 y 40 metros de distancia: Las sombras no se renderizan
* Más de 40 metros de distancia: Las fuentes de luz no se renderizan en absoluto

También es importante notar que las luces solo se renderizan si el jugador está parado dentro de la escena. Si el jugador está fuera de la escena, las luces no se renderizarán.

## Rango de luz

El componente lightSource tiene una propiedad `range` que se puede usar para establecer la distancia máxima a la que la luz es visible. Por defecto, el valor de la propiedad `range` es -1, lo que significa que el rango de luz depende de la intensidad de la luz.

* A una intensidad de 16000, el rango es de 10 metros.
* A una intensidad de 160000, el rango es de 31 metros.
* A una intensidad de 1600000, el rango es de 100 metros.

La configuración predeterminada asegura que la curva de caída sea suave y se vea natural. Pero en caso de que desees limitar el rango de la luz, puedes establecer la propiedad `range` a un número positivo.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
})

LightSource.create(light, {
  type: LightSource.Type.Point({}),
  intensity: 16000,
  range: 20,
})
```

{% hint style="warning" %}
**📔 Nota**: Establecer la propiedad `range` a un número positivo cortará abruptamente la luz a la distancia proporcionada. Esto es útil si deseas crear una luz que solo sea visible en un área específica, o para optimizar el rendimiento de tu escena. Establecer el `range` a un valor que sea mayor de lo que la luz realmente puede alcanzar con su intensidad actual no tendrá ningún efecto.
{% endhint %}

## Máscaras de luz

Puedes usar una máscara de luz para producir algunos efectos interesantes. En lugar de iluminar toda el área, puedes aplicar una textura para ser usada como filtro que solo iluminará partes del área.

Las máscaras se usan más típicamente con luces de foco, pero también se pueden usar con luces puntuales. A continuación se muestra un ejemplo de una luz de foco con una máscara aplicada.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
})

LightSource.create(light, {
	type: LightSource.Type.Spot({
      innerAngle: 30,
      outerAngle: 60
    }),
	shadow: true,
	shadowMaskTexture: Material.Texture.Common({src: "assets/scene/images/lightmask1.png"})         
})
```

Por ejemplo, puedes aplicar la imagen a continuación para producir un efecto divertido donde la luz solo es visible en las áreas donde la textura es blanca. Puedes usar esto con luces de cualquier color e intensidad.



Con una imagen en blanco y negro, la luz está golpeando un área o no. También es posible pasar una imagen con colores, y estos colores teñirán tu luz en cada área, esto se puede usar para proyectar un logo o imagen colorida sobre una superficie.

{% hint style="warning" %}
**📔 Nota**: La imagen usada como máscara debe tener una altura y ancho en píxeles que sea una potencia de 2 (ej: 1024, 512, 256). Esta característica no funciona para imágenes que tienen dimensiones diferentes.
{% endhint %}

Al aplicar una máscara a una luz puntual, la textura se envolverá como un cubo alrededor de la fuente de luz. Si deseas evitar tener bordes visibles entre los lados del cubo, asegúrate de que la textura tenga continuidad en los bordes.

```ts
import { engine, LightSource } from '@dcl/sdk/ecs'

const light = engine.addEntity()

Transform.create(light, {
  position: Vector3.create(10, 3, 10),
})

LightSource.create(light, {
	type: LightSource.Type.Point({}),
	shadowMaskTexture: Material.Texture.Common({src: "assets/scene/images/point-light-mask1.png"})         
})
```

Por ejemplo, la imagen a continuación muestra cada una de las letras en diferentes lados del cubo (Y arriba, -Y abajo, X derecha, -X izquierda, Z adelante, -Z atrás).

## Luces en la oscuridad

Las luces se aprecian mejor cuando el cielo no compite con ellas. El componente `Skybox` puede dejar en negro el sol, los colores del cielo (y con ellos la luz ambiental), la niebla, las nubes y las estrellas, de modo que tus luces sean la única fuente de iluminación. Consulta [Oscuridad total](../interactivity/skybox-control.md#oscuridad-total).
