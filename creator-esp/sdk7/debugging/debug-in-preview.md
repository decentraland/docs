---
description: Cómo puedes depurar tu scene mientras la ejecutas localmente en preview
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/debugging/debug-in-preview
---

# Debug in Preview

Ejecutar un preview proporciona información de depuración útil y herramientas para ayudarte a entender cómo se renderiza la scene.

Si la scene no puede compilarse, solo verás el suelo vacío, sin nada renderizado en él. Si esto ocurre, hay varios lugares donde puedes buscar mensajes de error para ayudarte a entender qué salió mal:

1. Verifica tu editor de código para asegurarte de que no haya marcado ningún error de sintaxis o lógica.
2. Verifica la consola en la ventana de preview para cualquier mensaje de error. Abre la consola haciendo clic en el ícono ![](../images/console-icon.png) en la esquina superior derecha.
3. Si ejecutaste la scene usando el Creator Hub, verifica la ventana con la salida de consola de la scene. Si ejecutaste la scene usando el CLI, verifica la salida de la línea de comandos donde ejecutaste `npm run start`

{% hint style="info" %}
**💡 Tip**: Antes de publicar tu scene en el entorno de producción, publícala en el entorno de prueba para probarla en un contexto que está mucho más cerca de producción. Consulta [Development Workflow](../sdk7/getting-started/dev-workflow.md#deploy-to-the-test-environment)
{% endhint %}

### Usar la consola

Abre la consola haciendo clic en el ícono ![](../images/console-icon.png) en la esquina superior derecha.

También puedes alternarla presionando la tecla de tilde invertida en tu teclado: **`**. Esta tecla está a la izquierda de la tecla 1 en la mayoría de los teclados de idioma inglés. O sino presiona Shift + **\`** para abrir una vista más ancha de la consola, en caso de que necesites ver más texto.

Genera mensajes de salida a la consola (usando `console.log()`). Luego puedes ver estos mensajes a medida que se generan abriendo la consola de la scene.

La consola también muestra mensajes de error, estos están marcados en rojo.

### El panel de debug

Abre la consola de debug haciendo clic en el ícono ![](../images/debug-icon.png) en la esquina superior derecha.

Esto abre un panel en la esquina inferior derecha con información sobre el motor de renderizado, y se actualiza en tiempo real a medida que las cosas cambian.

![](../images/debug-panel.png)

#### Current scene

La pestaña **CURRENT SCENE** incluye información sobre la scene en la que estás parado actualmente. Esto incluye:

* El número de parcelas en la scene
* La altura máxima a la que puedes construir (que es proporcional al número de parcelas en la scene)

También puedes marcar la opción **Show Scene Bounds** para ver muros rojos alrededor de la scene, que marcan los límites de la scene.

#### Memory

La sección **MEMORY** muestra la memoria utilizada por Decentraland. Siempre intenta mantener este valor por debajo de los **Memory Budget Thresholds**. Si este valor crece demasiado, corre el riesgo de crashear la app para los jugadores que visitan tu scene. Ten en cuenta que en producción, la scene podría cargarse junto con otras scenes y jugadores circundantes, lo que puede contribuir a elevar el consumo de memoria más alto de lo que ves en preview.

#### Performance

La pestaña **PERFORMANCE** incluye varios campos relacionados con _FPS_ (Frames Por Segundo). Este valor tenderá a ser más bajo a medida que la scene crezca en complejidad, asegúrate de mantener siempre este valor por encima de 25 FPS, para asegurar una buena experiencia para tus jugadores. Los FPS variarán dependiendo de la máquina en la que ejecutes esto.

El valor más importante aquí es el **Average FPS**, que redondea los FPS de los últimos 1000 frames.

![](../images/fps-debug-panel.png)

{% hint style="warning" %}
**📔 Nota**: Los FPS del renderer no son los mismos que las actualizaciones del game loop de la scene por segundo. La lógica de la scene está limitada a 30 FPS, los FPS del renderer pueden llegar a 60 o más.
{% endhint %}

Los hiccups se refieren a pausas momentáneas en la tasa de frames, que pueden tener poco impacto en el número general de FPS pero pueden ser muy notorios para el jugador. Estos típicamente pueden ocurrir cuando se cargan assets pesados o similares.

#### Web Requests

La sección **WEB REQUESTS** te permite abrir la pestaña Network de Chrome Devtools, que muestra el número de solicitudes web realizadas por la scene y sus contenidos. Esto es útil para saber si la scene está haciendo demasiadas solicitudes a servidores, lo que puede impactar el rendimiento de la scene.

Si tu scene interactúa con un servidor de terceros, a menudo es útil ver qué datos entran y salen. Haz clic en **Open Chrome Devtools** para abrir una nueva ventana de Chrome con la pestaña Network abierta.

{% hint style="warning" %}
**📔 Nota**: Para usar esta característica, primero debes instalar el [Creator Hub](../scene-editor/get-started/editor-installation.md), ya que las dependencias necesarias vienen empaquetadas con esa instalación.

No necesitas tener el Creator Hub abierto o ejecutar tu preview de scene via el Creator Hub para usar esta característica, también se puede usar si estás usando el CLI para ejecutar tu preview de scene.
{% endhint %}

Como alternativa, hay varias herramientas gratuitas que puedes ejecutar en tu máquina que reportan todos los datos que entran y salen de la aplicación de Decentraland. Por ejemplo [Charles](https://www.charlesproxy.com/) o [Wireshark](https://www.wireshark.org/).

### Quick reload

Cada vez que hagas cambios en la scene, el preview se recarga y actualiza automáticamente, por lo que no hay necesidad de abrir y cerrar la ventana de preview.

Si necesitas recargar la scene en la que estás parado, haz clic en el botón **Reload Scene** en la esquina superior izquierda de la ventana de preview.

![](../images/reload-button.png)

También puedes recargar la scene escribiendo lo siguiente en el chat y presionando enter:

`/reload`

### Reportar un bug

Si encuentras un problema que no es con tu scene, sino con el SDK de Decentraland en general, por favor consulta [Report a bug](../sdk7/debugging/report-bug.md).

### Versiones de dependencias

Asegúrate de usar siempre las últimas versiones de todas las dependencias en tu scene, ya que cualquier problema que estés experimentando podría estar ya corregido en versiones más nuevas. El Creator Hub te notificará cuando haya actualizaciones para instalar en tu scene de Decentraland.

![](../images/new-dependencies.png)

También puedes actualizar manualmente las dependencias via la línea de comandos. Ejecutar una scene de Decentraland localmente depende de dos bibliotecas principales: `@dcl/sdk` y `@dcl/js-runtime`, que se instala en cada carpeta de proyecto. Asegúrate de que ambas estén actualizadas. Puedes ejecutar los siguientes comandos para actualizar manualmente ambas bibliotecas a la última versión estable:

```bash
npm i @dcl/js-runtime@latest
npm i @dcl/sdk@latest
```

Si tu scene usa smart items, también puede estar usando la biblioteca `@dcl/asset-packs`, que puedes actualizar via:

```bash
npm i @dcl/asset-packs@latest
```

Si estás usando cualquiera de las [utils libraries](https://studios.decentraland.org/resources?sdk_version=SDK7\&resource_type=Library) asegúrate de que también estén actualizadas, ya que versiones antiguas de estas bibliotecas pueden no ser compatibles con versiones más nuevas de `@dcl/sdk`.

### Condiciones de iluminación

La hora del día en el mundo tiene un gran impacto en cómo se ven los modelos 3d. El color de la fuente de luz cambia sutilmente, teniendo un tinte azulado por la noche, y un tinte rojizo durante el amanecer y el atardecer. La dirección de la luz también se mueve a través del cielo, proyectando sombras en diferentes direcciones.

Verifica que tu scene se vea bien en todos los momentos del día cambiando el reloj del juego a diferentes valores. Haz clic en el ícono **skybox time** en el panel izquierdo de la pantalla para establecer cualquier hora que prefieras. Si este deslizador está en gris, asegúrate de que la opción **Auto** esté deshabilitada.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/daylight-settings.png" alt="Dynamic skybox" width="300"><figcaption><p>Instrucciones en el mundo</p></figcaption></figure>

Los materiales de tu modelo 3d pueden no verse igual a como se veían en la herramienta de modelado con la que lo creaste. Esto es de esperarse, ya que todos los motores de renderizado 3d tienen diferencias sutiles en cómo manejan la luz y los materiales.

También puedes configurar tu scene para que la hora del día esté fija y la iluminación no cambie. Consulta [Skybox control](../sdk7/interactivity/skybox-control.md) para más detalles.

### Pruebas multijugador

Si lanzas un preview de scene y lo abres en dos (o más) ventanas de explorer diferentes, cada ventana abierta será interpretada como un jugador separado, y un servidor de comunicaciones simulado mantendrá a estos jugadores sincronizados.

Interactúa con la scene en una ventana, luego cambia a la otra para ver que los efectos de esa interacción también son visibles allí.

Usando el Creator Hub, haz clic en el botón Preview una segunda vez, y eso abre una segunda ventana del Decentraland explorer. Debes conectarte en ambas ventanas con diferentes direcciones. Las mismas sesiones permanecerán abiertas mientras la scene se recargue. Puede que necesites cerrar sesión y volver a iniciar sesión en la segunda ventana para seleccionar una cuenta diferente.

![](../images/editor/preview-button.png)

Ambos jugadores se verán entre sí, y pueden interactuar entre sí. Si la scene tiene cualquier lógica multijugador, funcionará como se espera y se sincronizará entre los dos jugadores.

Como alternativa, puedes abrir una segunda ventana del Decentraland explorer escribiendo lo siguiente en una URL del navegador:

> `decentraland://realm=http://127.0.0.1:8000&local-scene=true&debug=true`

### Usando la red de prueba de Ethereum

Mientras pruebas tu scene, para evitar transferir MANA real u otras monedas, puedes usar la red de prueba Sepolia de Ethereum y transferir MANA de testnet falso en su lugar.

Para usar la red de prueba debes configurar tu extensión de Chrome Metamask para usar la _red de prueba Sepolia_ en lugar de _Main network_. También debes poseer MANA en la blockchain de Sepolia, que puedes adquirir gratis de Decentraland.

{% hint style="info" %}
**💡 Tip**: Para ejecutar la transacción de transferir MANA de Sepolia a tu wallet, necesitarás pagar una tarifa de gas en Ether de Sepolia.
{% endhint %}

Cualquier transacción que aceptes mientras ves la scene en este modo solo ocurrirá en la red de prueba y no afectará el balance de MANA en tu wallet real.

Para previsualizar tu scene usando la red de prueba, pega la siguiente URL en una pestaña del navegador. Esto abrirá la scene en el cliente de escritorio de Decentraland:

> decentraland://realm=http://127.0.0.1:8000\&local-scene=true\&debug=true\&dclenv=zone\&position=0,0

{% hint style="info" %}
**💡 Tip**: Cambia el parámetro position a las coordenadas de tu scene, para cargar directamente en tu scene. Cualquier transacción que aceptes mientras ves la scene en este modo solo ocurrirá en la red de prueba y no afectará el balance de MANA en tu wallet real.
{% endhint %}

Si necesitas probar transacciones en la Testnet de Polygon y necesitas tener MANA en esa testnet, necesitarás intercambiar MANA a esa red después de adquirirlo en Sepolia. Para puentear MANA de Sepolia a la Testnet de Polygon, visita tu página de cuenta de Decentraland en Sepolia y haz clic en 'swap' en el lado de MANA de Ethereum.
