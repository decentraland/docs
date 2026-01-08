---
description: Aprende cómo agregar materiales y texturas a entidades con formas primitivas
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/3d-essentials/materials
---

# Materiales mediante código

## Materiales

Los materiales pueden aplicarse a entidades que usan formas primitivas (cubo, esfera, plano, etc) agregando un componente `Material`. Este componente tiene varios campos que te permiten configurar las propiedades del material, agregar una textura, etc.

Los modelos _glTF_ incluyen sus propios materiales que se importan implícitamente a una escena junto con el modelo. Para modificar o anular estos materiales, usa el componente `GltfNodeModifiers`. Consulta [Modificar materiales glTF](materials.md#modify-gltf-materials) para más detalles.

Al importar un modelo 3D con sus propios materiales, ten en cuenta que no todos los shaders son compatibles con el motor de Decentraland. Solo se admiten materiales estándar y materiales PBR (physically based rendering). Consulta [consideraciones de modelos 3D externos](../../../creator/3d-modeling/materials/) para más detalles.

Hay diferentes tipos de materiales compatibles:

* PBR (Physically Based Rendering): El tipo más común de material en Decentraland. Admite colores planos o texturas, y diferentes propiedades como metálico, emisivo, transparencia, etc. Lee más sobre [PBR](https://en.wikipedia.org/wiki/Physically_based_rendering).
* Materiales básicos: No responden a luces y sombras, lo que los hace ideales para mostrar imágenes de billboard.

## Usar el Scene Editor

La forma más fácil de darle un Material a una entidad es usar el [Scene Editor](../../scene-editor/about-editor.md). Puedes agregar un componente **Material** a tu entidad y luego configurar todos los campos disponibles en la UI del Scene Editor. Consulta [Agregar Componentes](../../scene-editor/components.md#add-components).

## Agregar un material

El siguiente ejemplo crea un material PBR y establece algunos de sus campos para darle un color rojo y propiedades metálicas. Este material se agrega a una entidad que también tiene una forma de caja, por lo que coloreará la caja con este material.

```ts
//Crear entidad y asignar forma
const meshEntity = engine.addEntity()
Transform.create(meshEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(meshEntity)

//Crear material y configurar sus campos
Material.setPbrMaterial(meshEntity, {
	albedoColor: Color4.Red(),
	metallic: 0.8,
	roughness: 0.1,
})
```

Para cambiar el material de una entidad que ya tiene un componente `Material`, ejecuta `Material.setPbrMaterial()` o cualquiera de las otras funciones auxiliares y sobrescribirá el material original. No hay necesidad de eliminar el `Material` original o de usar la sintaxis avanzada.

```ts
//Crear entidad y asignar forma
const meshEntity = engine.addEntity()
Transform.create(meshEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(meshEntity)

//Crear material y configurar sus campos
Material.setPbrMaterial(meshEntity, {
	albedoColor: Color4.Red(),
})

//Sobrescribir con nuevo componente material
Material.setPbrMaterial(meshEntity, {
	albedoColor: Color4.Blue(),
})
```

{% hint style="warning" %}
**📔 Nota**: El componente `Material` debe importarse mediante

> `import { Material } from "@dcl/sdk/ecs"`

Consulta [Importaciones](../getting-started/coding-scenes.md#imports) para saber cómo manejarlas fácilmente.
{% endhint %}

## Colores de material

Dale un color plano a un material. En un Material PBR, estableces el campo `albedoColor`. Los colores albedo responden a la luz y pueden incluir sombras en ellos.

Los valores de color son de tipo `Color4`, compuestos por valores _r_, _g_ y _b_ (rojo, verde y azul). Cada uno de estos toma valores entre 0 y 1. Al establecer diferentes valores para estos, puedes componer cualquier color visible. Para negro, establece los tres en 0. Para blanco, establece todos en 1.

{% hint style="warning" %}
**📔 Nota**: Si estableces cualquier color en `albedoColor` a un valor mayor que _1_, aparecerá como _emisivo_, con más intensidad cuanto mayor sea el valor. Entonces, por ejemplo, `{r: 15, g: 0, b: 0}` produce un brillo rojo muy brillante.
{% endhint %}

Consulta [tipos de color](color-types.md) para más detalles sobre cómo establecer colores.

También puedes editar los siguientes campos en un Material PBR para ajustar cómo se percibe su color:

* _emissiveColor_: El color emitido desde el material.
* _reflectivityColor_: AKA _Specular Color_ en otra nomenclatura.

Para crear un material de color plano que no sea afectado por luz y sombras en el entorno, crea un material básico en lugar de un material PBR.

```ts
Material.setBasicMaterial(myEntity, {
	diffuseColor: Color4.Black(),
})
```

## Usar texturas

Establece un archivo de imagen como textura en un material estableciendo el parámetro `texture`.

```ts
//Crear entidad y asignar forma
const meshEntity = engine.addEntity()
Transform.create(meshEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(meshEntity)

//Crear material y configurar sus campos
Material.setPbrMaterial(meshEntity, {
	texture: Material.Texture.Common({
		src: 'assets/materials/wood.png',
	}),
})
```

En el ejemplo anterior, la imagen para el material se encuentra en una carpeta `assets/materials`, que está ubicada a nivel raíz de la carpeta del proyecto de la escena.

{% hint style="info" %}
**💡 Consejo**: Recomendamos mantener tus archivos de imagen de textura en algún lugar de la carpeta `/assets` dentro de tu escena.
{% endhint %}

Al crear una textura, también puedes pasar parámetros adicionales:

* `filterMode`: Determina cómo se estiran o comprimen los píxeles en la textura cuando se renderizan. Esto toma un valor del enum `TextureFilterMode`. Consulta [Escalado de textura](materials.md#texture-scaling).
* `wrapMode`: Determina cómo se coloca una textura en mosaico en un objeto. Esto toma un valor del enum `TextureWrapMode`. Consulta [Envoltura de textura](materials.md#texture-wrapping).

```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'assets/materials/wood.png',
		filterMode: TextureFilterMode.TFM_BILINEAR,
		wrapMode: TextureWrapMode.TWM_CLAMP,
	}),
})
```

Para crear una textura que no sea afectada por luz y sombras en el entorno, crea un material básico en lugar de un material PBR.

```ts
Material.setBasicMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'assets/materials/wood.png',
	}),
})
```

### Texturas desde una URL externa

Puedes apuntar la textura de tu material a una URL externa en lugar de una ruta interna en el proyecto de la escena.

```ts
Material.setBasicMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'https://wearable-api.decentraland.org/v2/collections/community_contest/wearables/cw_tuxedo_tshirt_upper_body/thumbnail',
	}),
})
```

La URL debe comenzar con `https`, las URLs `http` no son compatibles. El sitio donde se aloja la imagen también debe tener [políticas CORS (Cross Origin Resource Sharing)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) que permitan acceso externo.

### Envoltura de textura

Puedes establecer cómo se alinea una textura con una superficie. Por defecto, la textura se estira para ocupar la superficie una vez, pero puedes escalarla y desplazarla.

Los siguientes campos están disponibles en todas las texturas:

* `offset`: Desplaza la textura para cambiar su alineación. El valor es un Vector2, donde ambos ejes van de 0 a 1, donde 1 es el ancho o alto completo de la textura.
* `tiling`: Escala la textura. El valor predeterminado es el Vector 2 `[1, 1]`, que hace que la imagen se repita una vez cubriendo toda la superficie.
* `TextureWrapMode`: Determina qué sucede si el mosaico de la imagen no cubre toda la superficie. Esta propiedad toma sus valores del enum `TextureWrapMode`, que permite los siguientes valores:
  * `TextureWrapMode.TWM_CLAMP`: La textura solo se muestra una vez en el tamaño especificado. El resto de la superficie del mesh se deja transparente. El valor de `tiling` se ignora.
  * `TextureWrapMode.TWM_REPEAT`: La textura se repite tantas veces como quepa en el mesh, usando el tamaño especificado.
  * `TextureWrapMode.TWM_MIRROR`: Como en wrap, la textura se repite tantas veces como quepa, pero la orientación de estas repeticiones está reflejada.

```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'assets/materials/wood.png',
		wrapMode: TextureWrapMode.TWM_REPEAT,
		offset: Vector2.create(0, 0.2),
		tiling: Vector2.create(1, 1),
	}),
})
```

{% hint style="warning" %}
**📔 Nota**: Las propiedades `offset` y `tiling` solo son compatibles con el cliente de escritorio DCL 2.0.
{% endhint %}

Usa esta característica para cubrir una gran superficie con un patrón de mosaico. Por ejemplo, repite la siguiente imagen:



```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'assets/materials/wood.png',
		wrapMode: TextureWrapMode.TWM_REPEAT,
		tiling: Vector2.create(8, 8),
	}),
})
```



En el ejemplo a continuación, la textura usa un modo de envoltura _mirror_, y cada repetición de la textura toma solo 1/4 de la superficie. Esto significa que veremos 4 copias de la imagen, reflejadas entre sí en ambos ejes.

```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/atlas.png',
		wrapMode: TextureWrapMode.TWM_MIRROR,
		tiling: Vector2.create(0.25, 0.25),
	}),
})
```

### Tweens de textura

Haz que una textura se deslice suavemente usando un componente `Tween`, configurado con el modo `TextureMove`. El tween cambia gradualmente el valor de las propiedades `offset` o `tiling` de una textura durante un período de tiempo, de manera suave y optimizada.

{% hint style="warning" %}
**📔 Nota**: Los Tweens de Textura son una característica que solo es compatible con el cliente de escritorio DCL 2.0.
{% endhint %}

Usa el componente `Tween` con la función `setTextureMove` para mover la textura entre dos posiciones.

```ts
Tween.setTextureMove(myEntity, Vector2.create(0, 0), Vector2.create(1, 0), 2000)
```

El tween de textura toma la siguiente información:

* `entity`: La entidad para mover la textura
* `start`: Un Vector2 para la posición inicial
* `end`: Un Vector2 para la posición final
* `duration`: Cuántos milisegundos toma moverse entre las dos posiciones

Este otro parámetro opcional también está disponible:

* `movementType`: define si el movimiento será en el campo `offset` o `tiling`. Por defecto usa `offset`.
* `easingFunction`: La curva para la tasa de cambio a lo largo del tiempo, el valor predeterminado es `EasingFunction.EF_LINEAR`. Otros valores hacen que el cambio acelere y/o desacelere a diferentes ritmos.

```ts
const myEntity = engine.addEntity()

MeshRenderer.setPlane(myEntity)

Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})

Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/water.png',
		wrapMode: TextureWrapMode.TWM_REPEAT,
	}),
})

Tween.setTextureMove(myEntity, Vector2.create(0, 0), Vector2.create(0, 1), 1000)
```

El ejemplo anterior ejecuta un tween que dura 1 segundo y mueve la textura solo una vez. Para lograr un movimiento continuo, por ejemplo para simular la caída de una cascada, necesitas usar `setTextureMoveContinuous`.

```ts
const myEntity = engine.addEntity()

MeshRenderer.setPlane(myEntity)

Transform.create(myEntity, {
	position: Vector3.create(4, 1, 4),
})

Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/water.png',
		wrapMode: TextureWrapMode.TWM_REPEAT,
	}),
})

Tween.setTextureMoveContinuous(myEntity, Vector2.create(0, 1), 1)
```

El ejemplo anterior usa `setTextureMoveContinuous`, con una dirección de `(0, 1)`, y una velocidad de 1 unidad por segundo.

El tween continuo de textura toma la siguiente información:

* `entity`: La entidad para mover la textura
* `direction`: Un Vector2 para el movimiento
* `speed`: Cuántas unidades por segundo se moverá la entidad

Estos otros parámetros opcionales también están disponibles:

* `movementType`: (opcional), define si el movimiento será en el campo offset o tiling. Por defecto usa offset.
* `duration`: Cuántos milisegundos sostener el movimiento. Después de este tiempo, el movimiento se detendrá.

#### Secuencias complejas de tweens

También puedes hacer que los movimientos de textura sigan una secuencia compleja con tantos pasos como desees. Usa el campo `sequence` para listar tantos tweens como desees, se ejecutarán secuencialmente después del primer tween descrito en el componente `Tween`.

```ts
//(...)
Tween.setTextureMove(myEntity, Vector2.create(0, 0), Vector2.create(0, 1), 1000)

TweenSequence.create(myEntity, {
	sequence: [
		{
			mode: Tween.Mode.TextureMove({
				start: Vector2.create(0, 1),
				end: Vector2.create(1, 1),
			}),
			duration: 1000,
			easingFunction: EasingFunction.EF_LINEAR,
		},
		{
			mode: Tween.Mode.TextureMove({
				start: Vector2.create(1, 1),
				end: Vector2.create(1, 0),
			}),
			duration: 1000,
			easingFunction: EasingFunction.EF_LINEAR,
		},
		{
			mode: Tween.Mode.TextureMove({
				start: Vector2.create(1, 0),
				end: Vector2.create(0, 0),
			}),
			duration: 1000,
			easingFunction: EasingFunction.EF_LINEAR,
		},
	],
	loop: TweenLoop.TL_RESTART,
})
```

Ten en cuenta que al definir un tween dentro de un TweenSequence, necesitas usar el formato más verboso de `Tween.Mode.TextureMove` para definir el tween.

### Texturas de múltiples capas

Puedes usar varios archivos de imagen como capas para componer texturas más realistas, por ejemplo incluyendo un `bumpTexture` y un `emissiveTexture`.

```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/wood.png',
	}),
	bumpTexture: Material.Texture.Common({
		src: 'materials/woodBump.png',
	}),
	emissiveTexture: Material.Texture.Common({
		src: 'materials/glow.png',
	}),
})
```

El `bumpTexture` puede simular protuberancias y arrugas en una superficie, modificando cómo se comportan las normales de la superficie en cada píxel.



El `emissiveTexture` puede acentuar el brillo en ciertas partes de un material, para lograr efectos muy interesantes.

#### Establecer UVs

Otra alternativa para cambiar la escala o alineación de una textura es configurar propiedades _uv_ en el [componente MeshRenderer](shape-components.md).

Estableces coordenadas _u_ y _v_ en la imagen 2D de la textura para que correspondan a los vértices de la forma. Cuantos más vértices tenga la entidad, más puntos _uv_ deben definirse en la textura, un plano por ejemplo necesita tener 8 puntos _uv_ definidos, 4 para cada una de sus dos caras.

```ts
const meshEntity = engine.addEntity()
Transform.create(meshEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setPlane(
	meshEntity,
	[
		0, 0.75,

		0.25, 0.75,

		0.25, 1,

		0, 1,

		0, 0.75,

		0.25, 0.75,

		0.25, 1,

		0, 1,
	]
)

Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/wood.png',
		wrapMode: TextureWrapMode.TWM_REPEAT,
	}),
})
```

El siguiente ejemplo incluye una función que simplifica la configuración de uvs. La función `setUVs` definida aquí recibe un número de filas y columnas como parámetros, y establece los uvs para que la imagen de textura se repita un número específico de veces.

```ts
const meshEntity = engine.addEntity()
Transform.create(meshEntity, {
	position: Vector3.create(4, 1, 4),
})
MeshRenderer.setBox(meshEntity, setUVs(3, 3))

Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/atlas.png',
		wrapMode: TextureWrapMode.TWM_REPEAT,
	}),
})

function setUVs(rows: number, cols: number) {
	return [
		// Lado norte del plano sin rotar
		0, //esquina inferior izquierda
		0,

		cols, //esquina inferior derecha
		0,

		cols, //esquina superior derecha
		rows,

		0, //esquina superior izquierda
		rows,

		// Lado sur del plano sin rotar
		cols, // esquina inferior derecha
		0,

		0, // esquina inferior izquierda
		0,

		0, // esquina superior izquierda
		rows,

		cols, // esquina superior derecha
		rows,
	]
}
```

Para establecer los UVs para una forma de mesh `box`, se aplica la misma estructura. Cada una de las 6 caras del cubo toma 4 pares de coordenadas, uno para cada esquina. Todos estos 48 valores se listan como un solo array.

{% hint style="warning" %}
**📔 Nota**: Las propiedades uv actualmente solo están disponibles en formas `plane` y `box`. Además, los valores _uv_ afectan todas las capas de textura por igual, ya que se establecen en la _forma_.
{% endhint %}

### Escalado de textura

Cuando las texturas se estiran o encogen a un tamaño diferente de la imagen de textura original, esto a veces puede crear artefactos. En un entorno 3D, los efectos de la perspectiva causan esto naturalmente. Existen varios algoritmos de [filtrado de textura](https://en.wikipedia.org/wiki/Texture_filtering) que existen para compensar esto de diferentes maneras.

El objeto `Material` usa el algoritmo _bilinear_ por defecto, pero te permite configurarlo para usar los algoritmos _nearest neighbor_ o _trilinear_ en su lugar estableciendo la propiedad `samplingMode` de la textura. Esto toma un valor del enum `TextureFilterMode`:

* `TextureFilterMode.TFM_POINT`: Usa un algoritmo de "vecino más cercano". Esta configuración es ideal para gráficos de estilo pixel art, ya que los contornos permanecerán marcados de manera nítida a medida que la textura se vea más grande en pantalla en lugar de difuminarse.
* `TextureFilterMode.TFM_BILINEAR`: Usa un algoritmo bilineal para estimar el color de cada píxel.
* `TextureFilterMode.TFM_TRILINEAR`: Usa un algoritmo trilineal para estimar el color de cada píxel.

```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Common({
		src: 'materials/atlas.png',
		filterMode: TextureFilterMode.TFM_BILINEAR,
	}),
})
```

## Materiales sin iluminación

La mayoría de las veces querrás que los materiales en tu escena sean afectados por las condiciones de iluminación, incluyendo sombras y siendo teñidos por los cambios de tonalidad de diferentes momentos del día. Pero en otros casos es posible que desees mostrar los colores en su estado puro. Esto es útil al reproducir videos, o también para marcadores abstractos que necesitan destacarse, que están destinados a señalar pistas al jugador.

Para crear un material sin iluminación, usa `Material.setBasicMaterial`. Los materiales básicos no tienen todas las mismas propiedades que los materiales PBR, solo tienen lo esencial:

* `diffuseColor`: Color4 para el color
* `texture`: Textura
* `alphaTexture`: Textura separada para la capa de transparencia
* `alphaTest`: Umbral para lograr transparencia basada en el color de la textura
* `castShadows`: Si es false, no se proyectan sombras sobre otras entidades en la escena.

```ts
Material.setBasicMaterial(screen, {
	diffuseColor: Color4.Red(),
})
```

## Retratos de avatar

Para mostrar una imagen en miniatura de cualquier jugador, usa `Material.Texture.Avatar` al establecer la textura de tu material, pasando la dirección de un jugador existente. Esto crea una textura desde una imagen de 256x256 del jugador, mostrando cabeza y hombros. El jugador se muestra usando el conjunto de wearables que el servidor actual registró por última vez.

```ts
Material.setPbrMaterial(myEntity, {
	texture: Material.Texture.Avatar({
		userId: '0x517....',
	}),
})
```

Puedes obtener el retrato de cualquier jugador de Decentraland, incluso si no están conectados actualmente, e incluso si no tienen un nombre de Decentraland reclamado.

Las siguientes propiedades son compatibles dentro del objeto que pasas como argumento:

* `userId`: ID del usuario cuyo perfil deseas mostrar
* `filterMode`: Determina cómo se estiran o comprimen los píxeles en la textura cuando se renderizan. Esto toma un valor del enum `TextureFilterMode`. Consulta [Escalado de textura](materials.md#texture-scaling).
* `wrapMode`: Determina cómo se coloca una textura en mosaico en un objeto. Esto toma un valor del enum `TextureWrapMode`. Consulta [Envoltura de textura](materials.md#texture-wrapping).

## Materiales transparentes

Para hacer un material con un color plano transparente, simplemente define el color como un `Color4`, y establece el 4º valor a algo entre _0_ y _1_. Cuanto más cerca de _1_, más opaco será.

```typescript
let transparentRed = Color4.create(1, 0, 0, 0.5)

Material.setPbrMaterial(meshEntity, {
	albedoColor: transparentRed,
})
```

Si un material usa una textura .png que incluye transparencia, será opaco por defecto, pero puedes activar su transparencia estableciendo el `transparencyMode` en `MaterialTransparencyMode.MTM_ALPHA_BLEND`.



```typescript
Material.setPbrMaterial(floor, {
	texture: Material.Texture.Common({
		src: 'assets/scene/transparent-image.png',
	}),
	transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
})
```

El `transparencyMode` puede tener los siguientes valores:

* `MaterialTransparencyMode.MTM_OPAQUE`: Sin transparencia en absoluto
* `MaterialTransparencyMode.MTM_ALPHA_TEST`: Cada píxel es completamente opaco o completamente transparente, basado en un umbral.
* `MaterialTransparencyMode.MTM_ALPHA_BLEND`: Valores intermedios son posibles basados en el valor de cada píxel.
* `MaterialTransparencyMode.MTM_ALPHA_TEST_AND_ALPHA_BLEND`: Usa una combinación de ambos métodos.
* `MaterialTransparencyMode.MTM_AUTO`: Determina el método basado en la textura proporcionada.

Si estableces el `transparencyMode` en `MaterialTransparencyMode.MTM_ALPHA_TEST`, puedes ajustar el umbral usado para determinar si cada píxel es transparente o no. Establece la propiedad `alphaTest` entre _0_ y _1_. Por defecto su valor es _0.5_.

```ts
// Usando alpha test
Material.setPbrMaterial(meshEntity1, {
	texture: Material.Texture.Common({
		src: 'images/myTexture.png',
	}),
	transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
	alphaTest: 1,
})
```

Al usar un [material sin iluminación](materials.md#unlit-materials), puedes agregar un `alphaTexture` para hacer solo ciertas regiones del material transparentes, basadas en una textura.

{% hint style="warning" %}
**📔 Nota**: Esta debe ser una imagen de un solo canal. En esta imagen usa el color rojo o negro para determinar qué partes de la textura real deben ser transparentes.
{% endhint %}



```ts
// Usando alpha test
Material.setPbrMaterial(meshEntity1, {
	texture: Material.Texture.Common({
		src: 'images/myTexture.png',
	}),
	alphaTexture: Material.Texture.Common({
		src: 'assets/scene/circle_mask.png',
		wrapMode: TextureWrapMode.TWM_MIRROR,
	}),
})
```

Esto se puede usar de formas muy interesantes junto con videos. Consulta [reproducción de video](../media/video-playing.md).

## Reproducción de video

Para transmitir video desde una URL a un material, o reproducir un video desde un archivo almacenado en la escena, consulta [reproducción de video](../media/video-playing.md).

El video se usa como una textura en un material, puedes establecer cualquiera de las otras propiedades de materiales para alterar cómo se ve la pantalla de video.

## Sintaxis avanzada

La sintaxis completa para crear un componente `Materials`, sin ningún helper para simplificarlo, se ve así:

```ts
Material.create(myEntity, {
	texture: {
		tex: {
			$case: 'texture',
			texture: {
				src: 'images/scene-thumbnail.png',
			},
		},
	},
})

Material.create(myEntity, {
	texture: {
		tex: {
			$case: 'avatarTexture',
			avatarTexture: {
				userId: '0x517....',
			},
		},
	},
})
```

Así es como el protocolo base interpreta los componentes Materials. Las funciones auxiliares abstraen esto y exponen una sintaxis más amigable, pero detrás de escena generan esta sintaxis.

El campo `$case` te permite especificar uno de los tipos permitidos. Cada tipo admite un conjunto diferente de parámetros. En el ejemplo anterior, el tipo `box` admite un campo `uvs`.

Los valores compatibles para `$case` son los siguientes:

* `texture`
* `avatarTexture`

Dependiendo del valor de `$case`, es válido definir el objeto para la forma correspondiente, pasando las propiedades relevantes.

Para agregar un componente `Material` a una entidad que potencialmente ya tiene una instancia de este componente, usa `Material.createOrReplace()`. Las funciones auxiliares como `MeshRenderer.setPbrMaterial()` manejan la sobrescritura de instancias existentes del componente, pero ejecutar `Material.create()` en una entidad que ya tiene este componente devuelve un error.

## Modificar materiales glTF

Usa el componente `GltfNodeModifiers` para modificar los materiales de un modelo _glTF_. Este componente te permite anular los materiales de un modelo _glTF_ con tus propios materiales. Puedes usar cualquiera de las propiedades del componente `Material`, incluyendo textura, textura de video, materiales sin iluminación, etc.

Hay dos formas de usar el componente `GltfNodeModifiers`:

* Modificar el material de todo el modelo dejando la propiedad `path` como una cadena vacía.
* Modificar el material de un nodo específico en el modelo (o varios nodos) estableciendo la propiedad `path` a la ruta del nodo.

### Modificar el material de todo el modelo

El siguiente ejemplo muestra cómo modificar el material de un modelo _glTF_. En este caso, el material de todo el modelo se modifica para ser rojo.

```ts
import { GltfNodeModifiers, GltfContainer, Transform } from '@dcl/sdk/ecs'

const myEntity = engine.addEntity()

GltfContainer.create(myEntity, {
	src: 'models/myModel.glb',
})

Transform.create(myEntity, {
	position: Vector3.create(4, 0, 4),
})

GltfNodeModifiers.create(myEntity, {
	modifiers: [
		{
			path: '',
			material: {
				material: {
					$case: 'pbr',
					pbr: {
						albedoColor: Color4.Red(),
					},
				},
			},
		},
	],
})
```

El componente `GltfNodeModifiers` tiene las siguientes propiedades:

* `modifiers`: Un array de modificadores. Cada modificador tiene las siguientes propiedades:
  * `path`: La ruta al nodo en el modelo a modificar.
  * `material`: El material a usar.

La propiedad `path` es una cadena que representa la ruta al nodo en el modelo _glTF_ a modificar. Si deseas modificar el material de todo el modelo, puedes usar una cadena vacía. Si deseas modificar el material de un nodo específico, puedes usar la ruta al nodo. La ruta debe apuntar a un nodo de mesh, no a un nodo de vértice.

{% hint style="info" %}
**💡 Consejo**: Puedes usar la [aplicación Babylon Sandbox](https://sandbox.babylonjs.com/) para inspeccionar el modelo _glTF_ y encontrar la ruta al nodo que deseas modificar.

En algunos modelos, sin embargo, el sandbox de Babylon puede listar rutas que pertenecen a vértices en lugar de meshes, lo cual no funcionará. Si intentas usar una ruta que no es válida, la consola de la escena mostrará un mensaje de error que incluye la lista completa de rutas válidas en ese modelo.
{% endhint %}

La propiedad `material` es un objeto que representa el material a usar. Debe escribirse usando la [sintaxis avanzada](materials.md#advanced-syntax) para materiales, como se muestra en el ejemplo anterior. Las funciones auxiliares como `Material.setPbrMaterial()` no se pueden usar aquí.

### Modificar el material de un nodo específico en el modelo

El siguiente ejemplo muestra cómo modificar el material de un nodo específico en el modelo _glTF_. En este caso, el material de la cabeza se modifica para usar una textura alternativa.

```ts
import { GltfNodeModifiers, GltfContainer, Transform } from '@dcl/sdk/ecs'

const myEntity = engine.addEntity()

GltfContainer.create(myEntity, {
	src: 'models/myModel.glb',
})

Transform.create(myEntity, {
	position: Vector3.create(4, 0, 4),
})

GltfNodeModifiers.create(myEntity, {
	modifiers: [
		{
			path: 'M_Head_BaseMesh',
			material: {
				material: {
					$case: 'pbr',
					pbr: {
						texture: Material.Texture.Common({
							src: 'assets/scene/images/blinking-head.png',
						}),
					},
				},
			},
		},
	],
})
```

Un `GltfNodeModifiers` puede contener varios modificadores, cada uno modificando un nodo diferente en el modelo. El siguiente ejemplo muestra cómo modificar el material de la cabeza y el cuerpo de un modelo _glTF_.

```ts
import { GltfNodeModifiers, GltfContainer, Transform } from '@dcl/sdk/ecs'

const myEntity = engine.addEntity()

GltfContainer.create(myEntity, {
	src: 'models/myModel.glb',
})

Transform.create(myEntity, {
	position: Vector3.create(4, 0, 4),
})

GltfNodeModifiers.create(myEntity, {
	modifiers: [
		{
			path: 'M_Head_BaseMesh',
			material: {
				material: {
					$case: 'pbr',
					pbr: {
						albedoColor: Color4.Red(),
					},
				},
			},
		},
		{
			path: 'M_Body_BaseMesh',
			material: {
				material: {
					$case: 'pbr',
					pbr: {
						albedoColor: Color4.Blue(),
					},
				},
			},
		},
	],
})
```

### Eliminar sombras de un modelo glTF

Para eliminar sombras de un modelo _glTF_, puedes establecer la propiedad `castShadows` en `false` en el objeto `GltfNodeModifiers`. Esto retiene el material original del modelo, pero evita que proyecte sombras. Esto es útil para modelos que no están destinados a proyectar sombras, como rayos de luz.

```ts
import { GltfNodeModifiers } from '@dcl/sdk/ecs'

GltfNodeModifiers.create(myEntity, {
	modifiers: [
		{
			path: '',
			castShadows: false,
		},
	],
})
```
