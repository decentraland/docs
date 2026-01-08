---
description: Aprende cuándo y cómo ejecutar funciones asíncronas en el código de tu escena.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/programming-patterns/async-functions
---

# Funciones Async

### Descripción general

La mayor parte del código en tu escena se ejecuta sincrónicamente usando un solo hilo. Eso significa que los comandos se ejecutan secuencialmente línea por línea. Cada comando primero debe esperar a que el comando anterior termine de ejecutarse antes de que pueda comenzar.

Incluso las funciones en los sistemas de tu escena se ejecutan una por una, siguiendo un [orden de prioridad](../sdk7/architecture/systems.md#system-execution-order).

Ejecutar código sincrónicamente asegura consistencia, ya que siempre puedes estar seguro de conocer el orden en que se ejecutan los comandos en tu código.

Por otro lado, tu escena necesita actualizarse muchas veces por segundo, construyendo el siguiente fotograma. Si una parte de tu código tarda demasiado en responder, entonces todo el hilo principal se queda atascado y esto resulta en tasas de fotogramas con lag.

Es por eso que, en algunos casos quieres que algunos comandos se ejecuten asincrónicamente. Esto significa que puedes iniciar una tarea en un nuevo hilo, y mientras tanto el hilo principal puede seguir ejecutando las siguientes líneas de código.

Esto es especialmente útil para tareas que dependen de servicios externos que podrían tardar en responder, ya que no quieres que ese tiempo de espera para esa respuesta bloquee otras tareas.

Por ejemplo:

* Al recuperar datos de una API REST
* Al realizar una transacción en blockchain

{% hint style="warning" %}
**📔 Nota**: Ten en cuenta que varios fotogramas de tu escena podrían renderizarse antes de que la tarea termine de ejecutarse. Asegúrate de que el código de tu escena sea lo suficientemente flexible para manejar los escenarios intermedios mientras se completa la tarea asíncrona.
{% endhint %}

### Ejecutar una función async

Marca cualquier función como `async` para que se ejecute en un hilo separado del hilo principal de la escena cada vez que se la llama.

```ts
// declarar función async
async function myAsyncTask() {
	// ejecutar pasos de la función
}

// llamar función async
myAsyncTask()

// el resto del código sigue siendo ejecutado
```

### La función executeTask

La función `executeTask()` ejecuta una función lambda asincrónicamente, en un hilo separado del hilo principal de la escena. `executeTask()` nos permite declarar y ejecutar la función todo en una misma declaración.

```ts
executeTask(async () => {
	let data = await myAsyncTask()
	console.log(data)
})

// el resto del código sigue siendo ejecutado
```

### La función then

La función `then` toma una función lambda como argumento, que solo se ejecuta una vez que la declaración anterior ha terminado. Esta función lambda puede tener opcionalmente entradas que se mapean desde lo que la declaración anterior devuelve.

```ts
myAsyncTask().then((data) => {
	console.log(data)
})
```

{% hint style="warning" %}
**📔 Nota**: Generalmente es mejor usar el enfoque de `executeTask` en lugar de la función `then`. En este ejemplo, la escena no se considerará completamente cargada por el explorador hasta que la función `myAsyncTask()` se complete, lo que puede afectar los tiempos de carga. Además, si dependes demasiado de la función `then` en múltiples niveles anidados, puedes terminar con lo que se conoce como "callback hell", donde el código puede volverse muy difícil de leer y mantener.
{% endhint %}

### Funciones PointerEvents y RayCast

Cuando tu escena usa un componente `PointerEvent` o `RayCast`, los cálculos de colisiones se llevan a cabo async en el motor. El motor luego devuelve un evento de resultados a la escena, que puede llegar uno o varios ticks del bucle del juego más tarde que cuando se invocó el evento.

Luego necesitas crear un sistema para procesar estos resultados en el fotograma cuando lleguen.

{% hint style="warning" %}
**📔 Nota**: Si manejas clics a través del enfoque [**Register a callback**](../sdk7/interactivity/button-events/register-callback.md), no necesitas crear explícitamente un sistema para manejar esto, pero lo mismo ocurre en segundo plano.
{% endhint %}

Consulta [eventos de clic](../sdk7/interactivity/button-events/click-events.md) y [raycasting](../sdk7/interactivity/raycasting.md).

{% hint style="info" %}
**💡 Tip**: Si el procesamiento de los resultados de un raycast requiere muchos cálculos (como ejecutar un algoritmo de path-finding) puede que quieras ejecutar ese cómputo en una función asíncrona.
{% endhint %}

### La declaración await

Una declaración `await` fuerza la ejecución a esperar una respuesta antes de pasar a la siguiente línea de código. Las declaraciones `await` solo pueden usarse dentro de un bloque de código async.

```ts
// declarar función
async function myAsyncTask() {
	try {
		let response = await fetch(callUrl)
		let json = await response.json()
		console.log(json)
	} catch {
		console.log('failed to reach the URL')
	}
}

// llamar función
myAsyncTask()

// El resto del código sigue siendo ejecutado
```

El ejemplo anterior ejecuta una función que incluye una operación `fetch()` para recuperar datos de una API externa. La operación `fetch()` es asíncrona, ya que no podemos predecir cuánto tardará el servidor en responder. Sin embargo, la siguiente línea necesita que el output de esta operación esté listo antes de que podamos parsearlo como json. La declaración `await` aquí asegura que la siguiente línea solo se ejecutará una vez que esa operación haya devuelto un valor. De manera similar, la función `response.json()` también es asíncrona, pero la siguiente línea necesita que el json esté parseado antes de que pueda registrarlo. La segunda declaración `await` fuerza a la siguiente línea a que solo sea llamada una vez que el parseo del json haya terminado, sin importar cuánto tarde.
