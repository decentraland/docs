---
description: Qué puedes ver en el preview de una scene
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/getting-started/preview-scene
---

# Preview Your Scene

Una vez que hayas [construido una nueva scene](preview-scene.md#create-your-first-scene) o descargado un [example de scene](https://studios.decentraland.org/resources?sdk_version=SDK7) puedes previsualizarla localmente.

## Usando el Scene Editor

Asegúrate de haber [instalado el Creator Hub](../get-started/editor-installation.md).

1. Abre tu proyecto de scene.
2. Haz clic en el botón **Preview** en la esquina superior derecha. Esto abrirá una nueva ventana con el Decentraland Desktop Explorer, ejecutando solo tu scene. Allí puedes moverte por la scene e interactuar con ítems interactivos.

![](../images/editor/preview-button.png)

Configura diferentes opciones de preview desde el menú desplegable junto al botón **Preview**:

* **Open Console Window During Preview**: Abre una nueva ventana con la salida de consola de la scene. Esto es útil para depurar errores en la scene.
* **Skip Auth Screen**: Omite la pantalla de selección de cuenta y automáticamente te loguea con tu cuenta actualmente logueada. Esto está deshabilitado por defecto, habilítalo si quieres probar múltiples cuentas.
* **Landscape Terrain Enabled**: Alterna el paisaje alrededor de la scene. Esto está habilitado por defecto, desactívalo para reducir la huella de memoria de la scene.

## Usando el CLI

Para previsualizar una scene ejecuta el siguiente comando en la carpeta principal de la scene:

```bash
npm run start -- --explorer-alpha
```

Cualquier dependencia que falte se instala y luego el CLI abre la scene en una nueva pestaña del navegador automáticamente. Crea un servidor web local en tu sistema y apunta la pestaña del navegador web a esta dirección local.

Cada vez que hagas cambios en la scene, el preview se recarga y actualiza automáticamente, por lo que no hay necesidad de ejecutar el comando nuevamente.

{% hint style="warning" %}
**📔 Nota**: Algunas scenes dependen de comunicarse con un servidor externo para llevar a cabo lógica personalizada o almacenar y recuperar datos. Al previsualizar una de estas scenes, probablemente también tendrás que ejecutar el servidor localmente en otro puerto. Consulta el readme de la scene para instrucciones sobre cómo lanzar el servidor así como la scene.
{% endhint %}

### Parámetros del comando preview

Puedes agregar las siguientes banderas al comando `npm run start` para cambiar su comportamiento:

* `-- --web3` Conecta el preview a la wallet del navegador para usar el avatar y cuenta asociados.
* `-- --no-debug` Deshabilita el panel de debug, que muestra estadísticas de scene y rendimiento.
* `-- --explorer-alpha` Ejecuta el preview en el nuevo cliente Decentraland Desktop.
* `-- --skip-version-checks` Evita verificar si la versión del framework SDK de la scene coincide con tu versión CLI, y lanza el preview de todos modos.
* `-- --port` para asignar un puerto específico para ejecutar la scene. De lo contrario usará cualquier puerto que esté disponible.
* `-- --no-browser` para prevenir que el preview abra una nueva pestaña del navegador.
* `-- --w` o `-- --no-watch` para no abrir watch para cambios del sistema de archivos y evitar hot-reload cada vez que el código de la scene cambie.
* `-- --c` o `-- --ci` Para ejecutar el previsualizador de parcela en un servidor unix remoto

{% hint style="warning" %}
**📔 Nota**: Los parámetros necesitan ser agregados con dos series de guiones, por ejemplo `npm run start -- --web3`.
{% endhint %}

## Subir una scene a decentraland

Una vez que estés satisfecho con tu scene, puedes subirla y publicarla en Decentraland. Para esto debes poseer LAND, un NAME de Decentraland, o un nombre ENS ETH, o tener permisos dados por alguien que sí los tiene. Consulta [publishing](../publishing/publishing.md) para instrucciones sobre cómo hacerlo.

## Tamaño del preview de scene

El tamaño de scene mostrado en el preview se basa en la configuración de la scene.

Edita esto en la segunda pestaña del menú de scene en el Scene Editor.

![](../images/editor/scene-parcels-3x3.png)

Usa los desplegables y haz clic en **Apply Layout** para cambiar las dimensiones de tu scene. También puedes hacer clic en cada parcela individual para desactivarla de tu diseño.

![](../images/editor/scene-parcels-toggled.png)

También puedes editar el archivo _scene.json_ para listar múltiples parcelas en el campo "parcels". Consulta [set parcels via the command line](../projects/scene-metadata.md#scene-parcels) para más detalles.

{% hint style="info" %}
**💡 Tip**: Mientras ejecutas el preview, las coordenadas de parcela no necesitan coincidir con las que tu scene realmente usará, siempre que sean adyacentes y estén organizadas en la misma forma. Tendrás que reemplazarlas con las coordenadas reales más tarde cuando [despliegues la scene](preview-scene.md#upload-a-scene-to-decentraland).
{% endhint %}

## Ver la consola de la scene

Presiona la tecla **\`** en tu teclado para abrir la consola de la scene. Aquí puedes ver cualquier mensaje de error, y también cualquier texto que tu scene imprima a la consola via `console.log()`.

También puedes presionar Shift + **\`** para abrir la consola aún más ancha, en caso de que necesites ver más texto.

## Probar una scene multijugador localmente

Si lanzas un preview de scene y lo abres en dos (o más) ventanas de explorer diferentes, cada ventana abierta será interpretada como un jugador separado, y un servidor de comunicaciones simulado mantendrá a estos jugadores sincronizados.

Interactúa con la scene en una ventana, luego cambia a la otra para ver que los efectos de esa interacción también son visibles allí.

Usando el Creator Hub, haz clic en el botón Preview una segunda vez, y eso abre una segunda ventana del Decentraland explorer. Debes conectarte en ambas ventanas con diferentes direcciones. Las mismas sesiones permanecerán abiertas mientras la scene se recargue.

![](../images/editor/preview-button.png)

Como alternativa, puedes abrir una segunda ventana del Decentraland explorer escribiendo lo siguiente en una URL del navegador:

> `decentraland://realm=http://127.0.0.1:8000&local-scene=true&debug=true`
