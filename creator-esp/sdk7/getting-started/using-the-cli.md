---
description: Cómo usar el CLI de Decentraland para ejecutar, desplegar, etc
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/getting-started/using-the-cli
---

# Using the CLI

Para construir scenes para Decentraland puedes usar:

* El [Creator Hub](../get-started/editor-installation.md)
* La Command Line Interface (CLI)

Ambas herramientas te permiten compilar y previsualizar tu scene en un entorno de desarrollo "off-chain". Después de probar tu scene localmente, puedes subir tu contenido al servidor de contenido, vinculándolo con tu LAND o WORLD.

Aunque el Scene Editor en el Creator Hub es más fácil de usar, el CLI te permite más flexibilidad, y puede usarse fácilmente en procesos automatizados.

{% hint style="warning" %}
**📔 Nota**: El Scene Editor ejecuta las mismas operaciones de línea de comandos detrás de escena.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: Consulta la [Guía de instalación](../get-started/editor-installation.md) para instrucciones sobre cómo instalar el Scene Editor.
{% endhint %}

## Antes de Comenzar

Para trabajar con la scene via la línea de comandos, por favor instala las siguientes dependencias antes de ejecutar comandos CLI con la scene:

* [Node.js](https://nodejs.org) (versión 8 o posterior)

## Iniciar un nuevo proyecto

Ejecuta `npx @dcl/sdk-commands init` en una carpeta vacía para poblarla con los archivos predeterminados de un proyecto de Decentraland.

El CLI luego te pregunta qué tipo de proyecto quieres, si quieres construir una [scene](../projects/scene-metadata.md), un [workspace](../projects/workspaces.md) o un [smart wearable](../projects/smart-wearables.md). Si seleccionas una scene, el CLI te pregunta sobre qué proyecto base usar como punto de partida.

## Actualizar la versión del SDK de una scene

Ejecuta el siguiente comando en la carpeta de la scene:

```bash
npm i @dcl/sdk@latest
```

Puedes confirmar que funcionó verificando el archivo `package.json` de la scene, y buscando la versión de `@dcl/sdk` allí.

## Ejecutar un preview

Ejecuta `npm run start` en el nivel raíz de una scene, workspace, o proyecto de smart wearable para abrir un preview en una ventana del navegador.

Consulta [preview scenes](preview-scene.md) para detalles y opciones especiales al ejecutar un preview.

## Build

Ejecuta `npm run build` para construir tu proyecto. Las scenes de Decentraland están escritas en TypeScript, pero se construyen a JavaScript minificado cuando se publican. Consulta [coding scenes](https://github.com/decentraland/docs/blob/main/creator/sdk7/getting-started/coding-scenes.md) para más detalles.

El comando build es opcional, ya que también se ejecuta en segundo plano antes de desplegar (aunque puedes agregar una bandera para saltarlo).

El comando build ejecuta verificaciones de tipo más rigurosas que las que se ejecutan con `npm run start`, ejecutarlo puede ser útil a veces para depurar una scene.

## Desplegar una scene

Ejecuta `npm run deploy` para publicar tu scene en Decentraland. Este comando abre una ventana del navegador donde puedes firmar con tu wallet para autorizar el despliegue.

Consulta [publishing](../publishing/publishing.md) para detalles y opciones especiales al publicar una scene.

## Troubleshooting

Si encuentras problemas, consulta la sección [troubleshooting](../debugging/troubleshooting.md).
