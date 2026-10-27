---
description: Procedimiento recomendado para desarrollar y probar una scene
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/getting-started/dev-workflow
---

# Development Workflow

Este documento describe los pasos recomendados para desarrollar una scene para Decentraland, desde la ideación hasta la publicación y más allá.

## Instalar el Creator Hub

Asegúrate de tener instalado el Decentraland Creator Hub.

* [Guía de Instalación](../../scene-editor/get-started/editor-installation.md)

Si tienes la intención de trabajar con código, también asegúrate de instalar [Visual Studio Code](https://code.visualstudio.com/).

## Diseña tu experiencia

Piensa en cuánto espacio necesitas ocupar, qué tipo de distribución, qué tipo de mecánicas quieres que los jugadores puedan realizar, etc. Los siguientes documentos pueden servir como guía:

* [Guía de UX & UI](../design-experience/ux-ui-guide.md)
* [Restricciones de diseño para juegos](../design-experience/design-games.md)
* [Directrices de MVP de scene](../design-experience/mvp-guidelines.md)

## Dónde publicar

En Decentraland, el contenido se publica en parcelas de tierra adyacentes en una cantidad finita de espacio. Los jugadores pueden caminar libremente de una a otra. Cada scene es su propio pequeño mundo contenido, los ítems de una scene no pueden extenderse a otra scene, y el código de cada scene está aislado de todos los demás.

El permiso para publicar en cada una de estas está controlado via tokens. No necesitas tierra para desarrollar una scene, pero necesitarás acceso a tierra una vez que estés listo para publicar.

Alternativamente, tienes la opción de publicar en Decentraland [Worlds](../../worlds/about.md), que son scenes aisladas y autocontenidas.

Las siguientes opciones están disponibles:

* Rentar LAND
* Comprar LAND
* Obtener permisos de un propietario de tierra
* Publicar en un Decentraland World, consulta [worlds](../../worlds/about.md) para aprender más.

Consulta [Publishing options](../publishing/publishing-options.md) para más detalles.

## Plantillas y ejemplos

Al crear una nueva scene, elige entre varias scenes de plantilla base que incluyen algo de código básico y modelos 3d. Usa estos para comenzar más rápido.

* [Example scenes](https://studios.decentraland.org/resources?sdk_version=SDK7): aquí puedes encontrar una gran colección de scenes de ejemplo, cada una mostrando diferentes mecánicas que puedes tomar prestadas. También puedes clonar cualquiera de estas scenes y usarla como punto de partida.
* [Helper libraries](https://studios.decentraland.org/resources?sdk_version=SDK7\&resource_type=Library): estas pueden simplificar muchas tareas comunes.

## Assets de arte

Si eres un artista experimentado o tienes acceso a alguien que lo es, puedes crear modelos `.gltf` o `.glb` personalizados para tu scene. Consulta [3D model essentials](../../3d-modeling/3d-models.md) para consejos sobre cómo crear modelos 3D para Decentraland.

Hay muchas fuentes para obtener assets de arte gratuitos o pagos. Por ejemplo:

* [IWB Catalog](https://dcl-iwb.co/)
* [SketchFab](https://sketchfab.com/)
* [Clara.io](https://clara.io/)
* [Archive3D](https://archive3d.net/)
* [SketchUp 3D Warehouse](https://3dwarehouse.sketchup.com/)
* [Thingiverse](https://www.thingiverse.com/)
* [ShareCG](https://www.sharecg.com/)
* [CGTrader](https://cgtrader.com)

También puedes usar herramientas de IA Generativa para generar tus propios modelos 3D. Consulta:

* [Meshy](https://www.meshy.ai/)
* [Luma AI](https://lumalabs.ai/genie)
* [TRipo3D](https://www.tripo3d.ai/app)
* [Rodin](https://hyper3d.ai/rodin)

## Ejecutar un preview local

Para ejecutar un preview de tu scene, abre una ventana de Visual Studio Code en la carpeta raíz de tu proyecto y haz clic en el botón **Preview** en la pestaña de Decentraland.

* [Preview your scene](preview-scene.md) para más detalles.
* Consulta [Debug a scene](preview-scene.md#ver-la-consola-de-la-scene) para consejos sobre cómo depurar cualquier problema.

{% hint style="info" %}
**💡 Tip**: Cuando usas el Creator Hub, cada vez que haces un cambio en tu scene, el preview se actualiza automáticamente. Incluso mientras se está ejecutando.
{% endhint %}

## Publicar en el servidor de prueba {#deploy-to-the-test-environment}

Prueba tu scene en el servidor de prueba (testnet de Sepolia) antes de ir a mainnet. No necesitas poseer ningún LAND o nombres para publicar en el servidor de prueba.

Consulta [publishing](../publishing/publishing.md).

## Publicar en Decentraland

Una vez que estés satisfecho con tu scene y la hayas probado en el servidor de prueba, es hora de publicar en Decentraland. Para esto, necesitas poseer LAND, un NAME de Decentraland, o un nombre ENS ETH, o tener permisos dados por alguien que sí los tiene.

Consulta [publishing](../publishing/publishing.md) para instrucciones sobre cómo hacerlo.

Alternativamente, puedes publicar en [Worlds](../../worlds/about.md), un espacio 3D personal que no requiere LAND.

## Promocionar

Ahora que tu scene está ahí afuera, ¡difunde la voz! Aquí hay algunas formas de hacerlo:

* Compártela en redes sociales (#DCL)
* Anúnciala en [Discord](https://dcl.gg/discord)
* Envíala para ser destacada en [events.decentraland.org](https://events.decentraland.org/)
* Organiza un evento en tu scene
* Agrega un spawn point en un área de alto tráfico que enlace a tu scene

## Iterar

Una vez que tu scene haya estado en vivo por un tiempo y hayas recibido comentarios de los jugadores, ¡estás en una gran posición para iterar sobre ella!

Actualiza tu contenido con mejoras y nuevas características, desplegando nuevas versiones de tu scene en las mismas coordenadas.

## Devolver

Si creas una scene, juego o aplicación de la que estés orgulloso, ¡considera hacerla de código abierto! De esa manera otros pueden aprender de tu código y construir sobre tu trabajo. También puedes compartir todo el proyecto en [Awesome Repository](https://github.com/decentraland-scenes/Awesome-Repository).

Si construyes una pieza de funcionalidad reutilizable, puede que quieras convertirla en una biblioteca que otros puedan importar en sus proyectos.
