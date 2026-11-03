
El runtime de escena asegura la existencia de ciertos objetos y funciones dentro del entorno Javascript en sandbox, además de las utilidades estándar como `Promise`, `Date` o `Math`.

{% hint style="info" %}
Los globales descritos abajo son conceptos típicos de JavaScript, pero están adaptados al runtime de escena de Decentraland y pueden no comportarse idénticamente a sus contrapartes en entornos de navegador o Node.
{% endhint %}


## Globals

El runtime inyecta 6 definiciones en el ámbito global de la escena:

1. [`console`](#console): una versión simplificada del objeto `console` típico.
2. [`exports`](#module): un objeto donde la escena puede agregar su [interfaz pública](execution.md).
3. [`module`](#module): un contenedor para el objeto `exports`.
4. [`require`](#module): una función para cargar módulos proporcionados por el runtime por nombre.
5. [`fetch`](#http): una implementación restringida de la función `fetch` del navegador.
6. [`WebSocket`](#http): una implementación restringida de la clase `WebSocket` del navegador.

Todas estas se definen como propiedades de solo lectura, por lo que no pueden ser reasignadas. Algunas lanzarán excepciones cuando se usen a menos que se otorguen ciertos [permisos](../content/entity-types/scenes.md#permissions) a la escena.


## Console {#console}

Las escenas tienen acceso a un objeto `console`, muy parecido al proporcionado por un entorno de navegador o Node, aunque limitado a solo algunos de los métodos que normalmente encontrarías.

```ts
type Console = {
  log(...args: any): void
  info(...args: any): void
  debug(...args: any): void
  warning(...args: any): void
  error(...args: any): void
}
```

Al igual que sus contrapartes estándar, cada método toma argumentos variables de cualquier tipo y los renderiza como mensajes legibles para humanos. Por ejemplo, esto es válido:

```js
console.log("The thing just appeared", { thing: "foo" }, [1, 2, 3])
```

El comportamiento preciso de estos métodos depende del proveedor, pero los mensajes deben ser accesibles para los desarrolladores de escenas depurando su código.

{% hint style="info" %}
En el World Explorer basado en navegador de la Foundation, los mensajes de log aparecen en el panel de herramientas de desarrollador.
{% endhint %}


## Imports and Exports {#module}

Las escenas pueden importar y exportar objetos usando la interfaz de módulo tradicional [CommonJS](https://wiki.commonjs.org/wiki/Modules/1.0).

```ts
exports: Object
require(moduleName: string): Object
```

La función `require` permite a las escenas acceder a módulos proporcionados por el runtime (como [EngineApi](modules/engine-api.md) o [RestrictedActions](modules/restricted-actions.md)), y nada más (**no** accede a paquetes NPM o módulos por ruta).

Las propiedades agregadas al objeto `exports` son la interfaz pública de la escena y serán expuestas al runtime. De hecho, las escenas _deben_ exponer al menos un método para ejecutarse apropiadamente (ver [execution](execution.md)).

{% hint style="info" %}
Las escenas escritas en lenguajes como TypeScript usan las declaraciones más modernas `import` y `export`, que pueden ser transpiladas a usos compatibles con CommonJS de `require` y `exports`.
{% endhint %}


## HTTP and WebSockets {#http}

Los globales `fetch` y `WebSocket` funcionan exactamente como sus contrapartes bien conocidas (ver [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) y [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) en MDN), pero con algunas restricciones impuestas por el runtime.

Al llamar la función `fetch`:

- Se lanza un error si la URL no comienza con `https://`.
- Se lanza un error si la escena no tiene el [permiso `USE_FETCH`](../content/entity-types/scenes.md#permissions).
- Un timeout definido por la implementación puede abortar la solicitud.

Al usar la clase `WebSocket`:

- Se lanza un error si la URL no comienza con `wss:`
- Se lanza un error si la escena no tiene el [permiso `USE_WEBSOCKET`](../content/entity-types/scenes.md#permissions).

Aparte de estas diferencias, ambos casos siguen el comportamiento estándar.
