---
description: Soluciones para problemas comunes
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/debugging/troubleshooting
---

# Troubleshooting

## Problemas al ejecutar preview

#### Problema: No puedo ejecutar ningún preview de scene, el mensaje de error menciona **Permissions denied** o **EACCES**

Tu sistema operativo no te permite editar permisos en la carpeta donde quieres ejecutar el proyecto. Al ejecutar la scene, algunas dependencias necesitan instalarse, pero está prohibido. Necesitas configurar los permisos de la carpeta para permitir que tu cuenta de usuario de Windows/Mac/Linux edite archivos en ellas.

Recursos útiles:

* [docs.npmjs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
* [letscodepare](https://letscodepare.com/blog/npm-resolving-eacces-permissions-denied)

#### Problema: No puedo ejecutar un preview de scene particular, el error dice **Error: Error while building the project**

Si estás ejecutando una scene que fue compartida contigo, asegúrate de que esta scene no fue compartida conteniendo una carpeta `node_modules` o `bin`, o un archivo `package-lock.json`. Estos archivos contienen dependencias que usan versiones específicas para tu OS y máquina, deberían generarse al ejecutar la scene por primera vez. Elimina estas carpetas y archivo manualmente, luego ejecuta `npm run start` nuevamente.

#### Problema: Ejecutar `npm run start` se ejecuta, sin mensaje de error, pero no se abre ventana del navegador y no hay URL en la salida para abrir el preview

Asegúrate de que tu versión de Node esté actualizada. Debe ser 16 o más nueva.

#### Problema: Ejecutar `npm run start` abre una pestaña del navegador, pero la pantalla de carga nunca termina de cargar, o veo un banner de error rojo que dice "critical error".

*   Asegúrate de tener la última versión del SDK de Decentraland instalada en tu proyecto. Ejecuta:

    `npm i @dcl/sdk@latest`

#### Problema: La scene se ejecuta, en la consola veo advertencias de `Cyclic dependencies`.

Estas se refieren a archivos en tu scene que se referencian mutuamente. Esto no es necesariamente un problema, pero no es un patrón recomendable para escribir software, ya que puede llevar a condiciones de carrera difíciles de depurar y otros problemas. Tu scene probablemente funcionará bien a pesar de estas advertencias.

Idealmente, la carga del código en tu scene debería seguir un orden secuencial claro. El código que tiene dependencias cíclicas puede sufrir un problema de gallina y el huevo, donde el compilador no sabe cuál iniciar primero. A menudo esto se resuelve sin problemas, pero es una buena práctica evitar.

Para corregir estas dependencias, a menudo debes recurrir a llamar funciones o constructores de objetos pasando referencias a entities/objetos ya instanciados en los argumentos de la función; En lugar de codificar referencias a estas entities/objetos en la función, que pueden o no estar ya instanciados.

## Problemas al desplegar

#### Problema: No tienes permisos para desplegar en estas parcelas

* Asegúrate de que el archivo `scene.json` de tu scene liste correctamente las coordenadas donde quieres desplegar.
* Asegúrate de que Metamask esté correctamente configurado para usar la wallet correcta para firmar la transacción. Esta puede ser la wallet que posee los tokens LAND, o puede tener permisos de operador otorgados por el propietario.

#### Problema: Ejecutar `npm run deploy` falla

*   Verifica los spawn points de tu scene, las tres coordenadas x,y,z de un spawn point deben ser un número o un rango. O las tres son números o las tres son rangos. No está soportado tener rangos para algunos pero números para otros.

    Por ejemplo esto no está soportado:

    `"position": {"x": [1,4], "y": 0, "z": [1,4]}`

    Esto está soportado:

    `"position": {"x": [1,4], "y": [0,0], "z": [1,4]}`
*   El servidor catalyst predeterminado al que estás asignado para desplegar podría estar caído o teniendo problemas. Puedes forzar el comando `npm run deploy` para desplegar a un servidor catalyst específico en su lugar. Para desplegar a un servidor específico en el Decentraland Editor:

    1. Abre tu scene y haz clic en **Publish**
    2. Selecciona la opción **Publish to a different server** en la parte inferior.
    3. En el desplegable, selecciona **Custom Server**
    4. Ingresa la dirección del servidor, por ejemplo `peer-testing.decentraland.org`
    5. Haz clic en **Publish to custom server**
    6. Aprueba la transacción como con un despliegue normal.

    Para hacer esto via el CLI:

    `npm run deploy -- --target-content <server-name>`

    Por ejemplo:

    `npm run deploy -- --target-content peer-ec1.decentraland.org`

    Consulta [catalyst-monitor](https://decentraland.github.io/catalyst-monitor/) para una verificación de estado de todos los servidores en la red catalyst. También puedes copiar las direcciones de cada uno, desde la parte superior de cada tarjeta.
* Verifica el `package.json` de tu scene. Un problema común es que hay una sección `bundleDependencies` y también una `bundledDependencies` (d extra). Esto a veces puede resultar de ejecutar diferentes versiones de Node en el mismo proyecto en diferentes momentos, o de compartir el proyecto entre personas que lo ejecutaron con diferentes versiones de Node instaladas. Elimina `bundleDependencies`, que se relaciona con versiones antiguas de Node.

También asegúrate de tener tu versión de Node actualizada, al menos versión 16.

#### Problema: Ejecutar `npm run deploy` o `npm run build` reporta errores de tipo

Tu scene podría tener errores de tipo reportados por TypeScript, por ejemplo indicando que una cierta variable podría ser de tipo `any` o que `undefined` o `null` no están permitidos. Al ejecutar `npm run deploy`, también ejecuta `npm run build`, que es un poco más estricto con estas verificaciones que `npm run start`.

A diferencia de JavaScript, TypeScript aplica tipado estricto de todas las variables. Aunque tu scene esté escrita de tal manera que por ejemplo cierto valor nunca será `undefined`, TypeScript necesita saber qué sucedería en ese escenario, o necesitas aclarar explícitamente que el valor solo puede ser por ejemplo un string.

Como alternativa, puedes ejecutar `npm run deploy --skip-build` para saltar la ejecución de `npm run build`, y prevenir que estas verificaciones se ejecuten.

#### Problema: Desplegué mi scene pero no veo los cambios cuando entro a Decentraland

* Ten en cuenta que puede tomar algunos minutos para que el nuevo contenido se propague a través de todos los servidores en la red catalyst, dale un poco de tiempo.
* Consulta [Verify Deployment Success](../sdk7/getting-started/preview-scene.md#verify-deployment-success) para instrucciones sobre cómo puedes asegurar que el contenido se propagó correctamente a todos los servidores.

#### Problema: Una vez desplegado, algunos modelos 3D faltan

* Asegúrate de que los modelos 3D estén todos dentro de los límites de la scene, incluso sus bounding boxes. Si alguna parte de tus modelos se extiende más allá de estos límites al ejecutar un preview, estas partes que se extienden serán cortadas y no renderizadas, tanto al ejecutar un preview como en la scene publicada.

#### Problema: Una vez desplegado, mis modelos 3D se ven diferentes

* Si las texturas se ven diferentes, ten en cuenta que las texturas en modelos 3D están limitadas a un tamaño máximo de 512x512 píxeles. Esta conversión se lleva a cabo para asegurar que Decentraland se ejecute sin problemas para todos.
*   Si los modelos se ven diferentes, podría haber un problema con la conversión de los modelos a asset bundles. Lee más sobre compresión de asset bundle [aquí](../sdk7/optimizing/performance-optimization.md#asset-bundle-conversion).

    Para validar esto, intenta ejecutar la scene con el parámetro URL `&DISABLE_ASSET_BUNDLES`. Si los modelos se ven bien con esta bandera, el problema debe estar relacionado con un bug en la conversión del modelo.

    Nota que la generación de versiones comprimidas de asset-bundle de tus modelos es un proceso que toma tiempo a los servidores (alrededor de una hora). Puedes verificar si los modelos están siendo cargados como asset bundles comprimidos o no escribiendo el siguiente comando en la ventana de chat `/detectabs`. Los modelos comprimidos están teñidos de verde, los no comprimidos están teñidos de rojo.

#### Problema: Mi scene tiene FPS bajos en producción, aunque se ejecuta sin problemas en preview.

El rendimiento de tu scene podría estar afectado por scenes vecinas que siguen malas prácticas, ya que también se ejecutan en paralelo. Puedes validar que este es el caso abriendo la configuración y estableciendo la línea de visión al mínimo, para que solo se cargue 1 parcela alrededor de tu scene actual.

Puedes reducir la línea de visión aún más ejecutando tu scene con el parámetro `&LOS=0`, para no cargar ninguna scene circundante en absoluto.

Si acabas de desplegar tu scene, la carga al cargar la scene también podría reducirse una vez que los servidores conviertan los modelos 3D en la scene a asset bundles comprimidos. Puedes verificar si los modelos están siendo cargados como asset bundles comprimidos o no escribiendo el siguiente comando en la ventana de chat `/detectabs`. Los modelos comprimidos están teñidos de verde, los no comprimidos están teñidos de rojo.

### Reportar un bug

Si encuentras un problema que no es con tu scene, sino con el SDK de Decentraland en general, por favor consulta [Report a bug](../sdk7/debugging/report-bug.md).
