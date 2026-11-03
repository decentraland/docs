---
description: Aprende cómo se usan los sistemas para actualizar el estado de la escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/architecture/systems
---

# Sistemas

Las escenas de Decentraland dependen de _sistemas_ para actualizar cualquier dato a lo largo del tiempo, incluyendo información almacenada en los [componentes](entities-components.md) de cada entidad.

Los _sistemas_ son lo que hace que las escenas sean dinámicas, son funciones que se ejecutan periódicamente en cada tick del bucle del juego de la escena, cambiando lo que se renderizará.

El siguiente ejemplo muestra una declaración básica de sistema:

```ts
// Definir el sistema
function mySystem() {
  console.log("Ejecutado en cada tick. Mi sistema está ejecutándose")
}
// Agregar sistema al motor
engine.addSystem(mySystem)
```

La función en un sistema puede realizar cualquier cosa que desees. Típicamente, actuará sobre todas las entidades que cumplan cierta [consulta](querying-components.md), siguiendo cierta lógica para cambiar los valores almacenados en los componentes de la entidad.

```ts
function moveSystem(dt: number) {
  // iterar sobre todas las entidades con un Transform
  for (const [entity] of engine.getEntitiesWith(Transform)) {

  // obtener un componente Transform mutable
  const transform = Transform.getMutable(entity)

  // actualizar el valor de posición
    transform.position.z += 0.01
  }
}

engine.addSystem(moveSystem)
```

En el ejemplo anterior, el sistema `MoveSystem` es una función que se ejecuta en cada tick del bucle del juego, cambiando la posición de cada entidad en la escena que tiene un Transform.

Puedes tener múltiples sistemas en tu escena para desacoplar diferentes comportamientos, haciendo que tu código sea más limpio y más fácil de escalar y reutilizar. Por ejemplo, un sistema podría manejar física, otro podría hacer que una entidad obstáculo se mueva de un lado a otro continuamente, otro podría manejar la IA de personajes.

Múltiples sistemas pueden actuar sobre una sola entidad. Por ejemplo, un personaje no jugador podría moverse por su cuenta basándose en una IA, pero también ser afectado por la gravedad al caminar accidentalmente desde un acantilado. En ese escenario, la física y los sistemas de IA ni siquiera necesitan saber uno del otro. Independientemente reevalúan su estado actual en cada tick del bucle del juego e implementan su propia lógica separada.

### La función del sistema

La función de un sistema se ejecuta periódicamente, una vez por cada tick del bucle del juego. Esto sucede automáticamente, no necesitas llamar explícitamente a esta función desde ningún lugar en tu código.

En una escena de Decentraland, puedes pensar en el bucle del juego como la agregación de todas las funciones del sistema en tu escena.

{% hint style="warning" %}
**📔 Nota**: Si agregas múltiples instancias de un mismo sistema al motor, la función se ejecutará múltiples veces por tick del bucle del juego. Por ejemplo, agregar un sistema dos veces podría resultar en una entidad moviéndose al doble de la velocidad esperada, ya que avanza dos incrementos en cada tick.
{% endhint %}

### Manejar entidades por referencia

Algunos componentes y sistemas están destinados para usar solo en una entidad en la escena. Por ejemplo, en una entidad que almacena la puntuación de un juego o quizás una puerta principal que es única en la escena. Para acceder a una de esas entidades dentro de un sistema, puedes simplemente referirte a la entidad o sus componentes por nombre en las funciones del sistema.

```ts
export function main(){
	// crear una nueva entidad
	const game = engine.addEntity()

	// agregar componente a esa entidad
	ScoreComponent.create(game)
}

// Definir el sistema
export function UpdateScore() {

  // llamar referencia a entidad individual
  const points = ScoreComponent.get(game).points
  console.log(points)
}

// Agregar sistema al motor
engine.addSystem(UpdateScore)
```

Para proyectos más grandes, recomendamos que mantengas las definiciones de sistema en archivos separados de la instanciación de entidades y componentes.

### Iterar sobre una consulta de componentes

Muchas veces, tu escena tendrá múltiples entidades del mismo tipo que tendrán comportamientos similares. Por ejemplo, muchas puertas que pueden abrirse, o muchos enemigos que pueden atacar al jugador. Tiene sentido manejar todas estas entidades similares en un solo sistema, iterando sobre la lista y realizando las mismas verificaciones en cada una.

No quieres que la función de un sistema itere sobre _todo_ el conjunto de entidades en la escena, ya que esto podría ser muy costoso en términos de poder de procesamiento. Para evitar esto, puedes [consultar componentes](querying-components.md), para iterar solo sobre las entidades relevantes.

Por ejemplo, tu escena puede tener un `PhysicsSystem` que calcula el efecto de la gravedad sobre las entidades de tu escena. Algunas entidades en tu escena, como árboles, no están destinadas a moverse nunca; por lo que sería inteligente evitar calcular los efectos de la gravedad sobre estas. Puedes definir un componente `HasPhysics` para marcar entidades que podrían ser afectadas por la gravedad, y luego hacer que `PhysicsSystem` solo trate con las entidades devueltas por esta consulta.

```ts
// Definir el sistema
export function PhysicsSystem() {
  // iterar sobre todas las entidades con un HasPhysics
  for (const [entity] of engine.getEntitiesWith(HasPhysics)) {

  // obtener un componente Transform mutable
  const transform = Transform.getMutable(entity)

  // Calcular efecto de física
  }
}

// Agregar sistema al motor
engine.addSystem(PhysicsSystem)
```

### Delta time entre fotogramas

La función en un sistema puede incluir opcionalmente un argumento llamado `dt`, de tipo `number` (representando _delta time_).

```ts
function MySystem(dt: number) {

  // Actualizar escena
  console.log("tiempo desde el último tick: ", dt)
}

engine.addSystem(MySystem)
```

_delta time_ representa el tiempo que pasó desde el último tick del bucle del juego, en segundos.

Las escenas de Decentraland se actualizan por defecto a 30 ticks por segundo. Esto significa que el argumento `dt` pasado a todos los sistemas tenderá a ser igual a _1/30_ (0.0333...).

Si el procesamiento de un fotograma toma menos tiempo que este intervalo, entonces el motor esperará el tiempo restante para mantener las actualizaciones regularmente espaciadas y `dt` permanecerá igual a _1/30_.

Si el procesamiento de un fotograma toma más de _1/30_ segundos, el dibujo de ese fotograma se retrasa. El motor luego intenta terminar ese fotograma y mostrarlo tan pronto como sea posible. Luego procede al siguiente fotograma e intenta mostrarlo _1/30_ segundos después del último fotograma. No compensa el retraso anterior.

Idealmente, debes evitar que tu escena pierda fotogramas, ya que impacta la calidad de la experiencia del jugador. Como esto depende del poder de procesamiento de la máquina del jugador, siempre es una posibilidad que tu escena debe estar lista para manejar con gracia.

La variable `dt` es útil cuando el procesamiento de fotogramas excede el tiempo predeterminado. Asumiendo que el fotograma actual tomará tanto tiempo como el anterior, esta información puede usarse para calcular cuánto ajustar un cambio gradual, para que la tasa de cambio parezca constante y en proporción al lag entre fotogramas.

Consulta [posicionamiento de entidades](../3d-essentials/entity-positioning.md) para ejemplos de cómo usar `dt` para hacer el movimiento más suave.

### Iterar en un intervalo temporizado

Si quieres que un sistema ejecute algo en un intervalo de tiempo regular, puedes hacer esto combinando el argumento `dt` con un temporizador.

```ts
let timer: number = 10

function LoopSystem(dt: number) {
  timer -= dt
  if (timer <= 0) {
      timer = 10
      // HACER ALGO
    }
}

engine.addSystem(LoopSystem)
```

Para casos de uso más complejos, donde pueden haber múltiples retrasos y loops siendo creados dinámicamente, puede valer la pena definir un componente personalizado para almacenar un valor de temporizador individual para cada entidad. Consulta [Componentes personalizados](custom-components.md).

### Orden de ejecución del sistema {#system-execution-order}

En algunos casos, cuando tienes múltiples sistemas ejecutándose, podrías preocuparte por qué sistema es ejecutado primero por tu escena.

Por ejemplo, podrías tener un sistema de _física_ que actualiza la posición de entidades en la escena, y otro sistema de _límites_ que asegura que ninguna de las entidades esté posicionada fuera de los límites de la escena. En este caso, quieres asegurarte de que el sistema de _límites_ se ejecute último. De lo contrario, el sistema de _física_ podría mover entidades fuera de los límites de la escena pero el sistema de _límites_ no se enterará hasta que se ejecute nuevamente en el siguiente fotograma.

Al agregar un sistema al motor, establece un campo opcional `priority` para determinar cuándo se ejecuta el sistema en relación con otros sistemas.

```ts
engine.addSystem(PhysicsSystem, 1)
engine.addSystem(BoundariesSystem, 5)
```

Los sistemas con un número de prioridad más bajo se ejecutan primero, por lo que un sistema con una prioridad de _1_ se ejecuta antes que uno de prioridad _5_.

Los sistemas a los que no se les da una prioridad explícita tienen una prioridad predeterminada de _0_, por lo que estos se ejecutan primero.

Si dos sistemas tienen el mismo número de prioridad, no hay forma de saber con certeza cuál de ellos se ejecutará primero.

### Eliminar un sistema

Una instancia de un sistema puede agregarse o eliminarse del motor para activarlo o desactivarlo.

Si un sistema está definido pero no se agrega al motor, su función no es llamada por el motor.

Para eliminar un sistema, primero debes darle un nombre al agregarlo al motor, para que puedas referirte al sistema más tarde.

```ts
// declarar sistema
function mySystem(dt: number){
  console.log("retraso desde el último tick: ", dt)
}

// agregar sistema (dándole una prioridad y nombre)
engine.addSystem(mySystem, 1, "DelaySystem")

// eliminar sistema
engine.removeSystem("DelaySystem")
```

Una escena puede potencialmente tener múltiples instancias de un mismo sistema ejecutándose juntas, por lo que necesitas decirle al motor cuál de esas eliminar.

Otra forma de eliminar un sistema es declarar un puntero al sistema, y luego pasar ese puntero al método `engine.removeSystem()`.

```ts
// declarar sistema
function mySystem(dt: number){
  console.log("retraso desde el último tick: ", dt)
}

// agregar sistema (haciendo un puntero)
const mySystemInstance = engine.addSystem(mySystem)

// eliminar sistema
engine.removeSystem(mySystemInstance)
```

Ten en cuenta que el puntero es a la _instancia_ del sistema, no a la clase del sistema. En el ejemplo anterior, `engine.removeSystem()` no recibe `mySystem` (la declaración de clase del sistema). Recibe `mySystemInstance` (la instancia que fue agregada al motor).

Puedes usar el método a continuación para hacer que un sistema se auto-termine cuando su propósito esté completo.

```ts
   const mySystem = function(dt: number){
        time += dt
        if(time > 3){
		engine.removeSystem(mySystem)
        }    
    }
    engine.addSystem(mySystem)
```
