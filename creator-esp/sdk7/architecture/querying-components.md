---
description: >-
  Aprende sobre cómo obtener listas de entidades que tienen componentes en
  común, para facilitar su verificación o actualización.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/architecture/querying-components
---

# Consultar Componentes

Puedes [consultar componentes](../sdk7/architecture/querying-components.md) con el método `engine.getEntitiesWith(...components)` para rastrear todas las entidades en la escena que tienen ciertos componentes.

Los [Sistemas](../sdk7/architecture/systems.md) típicamente iteran sobre las entidades en estas consultas, realizando las mismas operaciones en cada una. Tener un grupo predefinido de entidades válidas es una excelente manera de ahorrar recursos, especialmente para funciones que se ejecutan en cada tick del bucle del juego. Si en cada tick tu sistema tuviera que iterar sobre cada entidad individual en la escena buscando las que necesita, eso sería muy ineficiente.

Puedes acceder a las entidades en una consulta de la siguiente manera.

```ts
for (const [entity] of engine.getEntitiesWith(Transform)) {
	//...
}
```

### Componentes requeridos

Al hacer una consulta, especifica qué componentes deben estar presentes en cada entidad que se agrega al grupo. Puedes listar tantos componentes como quieras, la consulta solo devolverá entidades que tengan **todos** los componentes listados.

```ts
for (const [entity] of engine.getEntitiesWith(
	Transform,
	Physics,
	NextPosition
)) {
	//...
}
```

{% hint style="info" %}
**💡 Tip**: Si tu consulta devuelve entidades con las que no necesitas trabajar, considera crear un componente personalizado para actuar como una [bandera](../sdk7/architecture/entities-components.md#components-as-flags). Este componente no necesita tener ninguna propiedad, pero puede usarse para marcar un subgrupo específico de entidades que tal vez quieras tratar de manera diferente.
{% endhint %}

### Usar consultas en un sistema

```ts
// Definir un Sistema
function PhysicsSystem(dt: number) {

  // consultar entidades que incluyen tanto un componente Transform como Physics
  for (const [entity] of engine.getEntitiesWith(Transform, Physics)) {
    const transform = Transform.getMutable(entity)
	const vel = Physics.get(entity).velocity
	transform.position.x += vel.x
	transform.position.y += vel.y
	transform.position.z += vel.z

  }
}

// Agregar el sistema al motor
engine.addSystem(PhysicsSystem)

```

En el ejemplo anterior, la función `PhysicsSystem` itera sobre las entidades en la consulta, que se ejecuta en cada tick del bucle del juego.

* Si la escena tiene varias entidades _ball_, cada una con un componente `Transform` y `Physics`, entonces serán manejadas, y su posición será actualizada en cada tick.
* Si tu escena también tiene otras entidades, por ejemplo un _hoop_ y un _scoreBoard_ que solo tienen un `Transform` pero no un componente `Physics`, entonces no serán afectadas por `PhysicsSystem`.

### Trabajar con las entidades y componentes

La función `getEntitiesWith` devuelve una colección, que incluye referencias a un conjunto de entidades y también puede incluir opcionalmente referencias a los componentes listados.

Usando la sintaxis más simple, obtienes solo una lista de referencias a las entidades correspondientes.

```ts
const [entity] of engine.getEntitiesWith(myComponent, myOtherComponent)
```

Mientras iteras sobre esta lista de entidades, luego puedes obtener versiones de solo lectura o mutables de sus componentes, usando `.get` o `getMutable`.

```ts
for (const [entity] of engine.getEntitiesWith(Transform)) {
	//obtener versión de solo lectura
	const transformReadOnly = Transform.get(entity)

	// obtener versión mutable
	const transformMutable = Transform.getMutable(entity)
}
```

Opcionalmente también puedes obtener referencias a cada uno de los componentes listados directamente como parte de la colección devuelta por la consulta. Para hacer esto, simplemente declara múltiples referencias juntas, una para cada componente que quieras obtener. Agregar estas referencias es opcional, y tampoco necesitas declarar referencias a _todos_ los componentes en la consulta.

```ts
// devuelve referencias a la entidad y el primer componente listado
for (const [entity, component1] of engine.getEntitiesWith(
	MyCustomComponent1,
	MyCustomComponent2
)) {
	// iterar sobre lista de entidades
}

// devuelve referencias a la entidad y los dos primeros componentes listados
for (const [entity, component1, component2] of engine.getEntitiesWith(
	MyCustomComponent1,
	MyCustomComponent2
)) {
	// iterar sobre lista de entidades
}
```

{% hint style="warning" %}
**📔 Nota**: Estas referencias son de solo lectura. Para obtener versiones mutables de esos componentes, necesitas usar la función `.getMutable` referenciando la entidad.
{% endhint %}

Luego puedes referirte a estas referencias mientras iteras sobre la colección de resultados, en cada entrada tendrás acceso a la entidad y sus referencias de componentes correspondientes.

```ts
for (const [entity, transformReadOnly] of engine.getEntitiesWith(Transform)) {
	console.log('entity id: ', entity)
	console.log('has position : ', transformReadOnly.position)
}
```

### Suscribirse a cambios

Un caso de uso común es solo ejecutar una función en caso de que los datos en un cierto componente cambien. Usa la función [OnChange](../sdk7/architecture/subscribe-to-changes.md) para evitar tener que definir un sistema y tener que comparar explícitamente valores antiguos con valores nuevos.
