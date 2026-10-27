El World Explorer [reserva un rango](modules/engine-api.md#identifying) de IDs de entidad para su propio uso. De este rango, los identificadores `0`, `1` y `2` están pre-asignados a un conjunto de entidades básicas garantizadas de existir.

Estos son:

- `0`: `RootEntity`
- `1`: `PlayerEntity`
- `2`: `CameraEntity`

Estas entidades tienen un conjunto conocido de componentes adjuntos que son gestionados por el runtime, es decir, su estado es de solo lectura para la escena. Obtener el estado inicial de estos componentes es parte de la [inicialización de escena](execution.md#onStart).

{% hint style="info" %}
Componentes adicionales para estas entidades están en desarrollo. El [mecanismo de sincronización CRDT](modules/engine-api.md#synchronization) se está expandiendo para proporcionar parte de la funcionalidad ofrecida por diferentes módulos.

Por ejemplo, las escenas podrán detectar el estado de la ventana del Explorer para optimizar su uso de red y CPU, o acceder a información más rica sobre el jugador, el sistema de comms y la cámara del juego.
{% endhint %}

##### `RootEntity` (`0`) {#RootEntity}

Contiene información general sobre el contexto de la escena.

- [`Transform`](basic-components.md#Transform): información posicional del punto de origen de la escena, al cual todos los demás transforms sin un padre explícito son relativos.

El componente `Transform` de la `RootEntity` se inicializa con los siguientes valores:

```yml
scale: [1, 1, 1] # XYZ
position: [0, 0, 0] # XYZ
rotation: [0, 0, 0, 1] # XYZW
```

##### `PlayerEntity` (`1`) {#PlayerEntity}

Contiene datos sobre el jugador, su identidad, su avatar y ubicación.

- [`Transform`](basic-components.md#Transform): la información posicional para el avatar del jugador.

##### `CameraEntity` (`2`) {#CameraEntity}

Contiene información sobre la cámara del juego. Todos los componentes son gestionados por el renderizador.

- [`Transform`](basic-components.md#Transform): la información posicional de la cámara misma.
- [`PointerLocked`](basic-components.md#PointerLock): si el puntero sigue la dirección de la cámara o se mueve independientemente.
