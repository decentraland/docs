---
description: Cómo puedes depurar tu scene que está ejecutándose dentro de Decentraland
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/debugging/debug-in-prod
---

# Debug in Production

Cuando ejecutas una scene que ya está desplegada en tierra en Decentraland, hay varias cosas que puedes probar para depurarla.

### Antes de desplegar

#### Preview

Antes de desplegar tu scene en Decentraland, asegúrate de que la scene se ejecute bien en preview usando la última versión del SDK de Decentraland. Consulta [debug in preview](debug-in-preview.md).

#### El servidor de prueba

Puedes desplegar scenes en un servidor de prueba como entorno de staging, antes de publicarlas en los servidores de contenido en vivo. Este servidor no es frecuentado por ningún jugador que visite Decentraland normalmente. Para ingresar a este servidor debes escribir manualmente su URL, pero ten en cuenta que no es un entorno privado.

Consulta [The test server](../publishing/publishing.md#the-test-server) para detalles.

### Quick reload

Si necesitas recargar la scene en la que estás parado, escribe lo siguiente en el chat y presiona enter:

`/reload`

### Sobre el pipeline de publicación

Ten en cuenta que después de cada publicación, un proceso interno optimiza todos los modelos 3D antes de que puedan ser renderizados. Esto toma alrededor de 15 minutos. Si visitas la scene antes de que esto esté terminado, la scene puede aparecer rota. Este proceso puede ejecutarse incluso si los modelos 3D fueron todos previamente publicados.

Puedes verificar el estado actual de este proceso para tu scene usando [esta herramienta](https://decentraland.github.io/opscli/). Si la conversión está completa, las tres variaciones de los assets deberían tener luces verdes.

### Logs de scene

Cuando usas Decentraland normalmente, no es posible abrir la consola para verificar mensajes de debug. Para hacer la consola disponible, debes abrir decentraland con el parámetro `scene-console`. Luego puedes alternar la consola presionando la tecla de tilde invertida en tu teclado: **\`**. Esta tecla está a la izquierda de la tecla 1 en la mayoría de los teclados de idioma inglés.

Para abrir Decentraland con el parámetro `scene-console`, ya sea:

* Escribe el siguiente deep link en una ventana del navegador: `decentraland://?position=0,0&scene-console`. Esto abrirá la aplicación de escritorio de Decentraland si la tienes instalada.
* Escribe lo siguiente en la línea de comandos:
  * **macOS**: `open Decentraland.app --args --position 0,0 --scene-console true`
  * **winOS**: `"C:\Users\[YOUR-USER]\Downloads\Decentraland_windows64\Decentraland.exe" --position 0,0 --scene-console true`

\{% hint style="info" %\} **💡 Tip**: Cambia el parámetro **position** a las coordenadas de tu scene, para cargar directamente en tu scene. \{% endhint %\}

Cuando ejecutes Decentraland con el `scene-console`, puedes abrir la consola de tres maneras:

* Haz clic en el ícono ![](../../.gitbook/assets/console-icon.png) en la esquina superior derecha
* Presiona la tecla **\`** para una consola corta
* Presiona Shift + **\`** para abrir una vista más grande de la consola

Ten en cuenta que los mensajes de cada scene activa se registrarán en la consola, por lo que algunas de las cosas que ves en la consola pueden no ser relevantes para tu scene.

### Reportar un bug

Si encuentras un problema que no es con tu scene, sino con el SDK de Decentraland en general, por favor consulta [Report a bug](report-bug.md).
