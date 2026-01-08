---
description: Archivos predeterminados creados en una nueva escena.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/projects/scene-files
---

# Archivos de Escena

Después de [crear una nueva escena](../sdk7/getting-started/sdk-101.md), la carpeta de la escena tendrá una serie de archivos con contenido predeterminado.

### Archivos predeterminados en una escena

Las escenas incluyen los siguientes archivos:

* **src/index.ts**: El punto de entrada de la escena.
* **scene.json**: El manifiesto que contiene metadatos para la escena.
* **package.json** y **package-lock.json**: Especifican las versiones de todas las dependencias de la escena.
* **tsconfig.json**: Archivo de configuración de Typescript.
* **.dclignore**: Lista los archivos en tu proyecto que no se subirán cuando publiques tu escena.
* **main-composite**: Archivo autogenerado que incluye todo lo que agregaste y configuraste visualmente en el Scene Editor. No está destinado a ser legible para humanos.

#### index.ts

Este es el punto de entrada al código personalizado de tu escena. Podrías ajustar toda la lógica de tu escena en este archivo, aunque para mayor claridad en la mayoría de los casos recomendamos distribuir tu código en varios otros archivos _.ts_.

Si confías solo en el Scene Editor y [Smart Items](../scene-editor/interactivity/smart-items.md), no necesitarás modificar este archivo.

Si pretendes escribir código personalizado, lo más probable es que solo necesites editar este y otros archivos .ts para crear tu escena. Contiene el código que genera las [entidades, componentes](../sdk7/architecture/entities-components.md) y [sistemas](../sdk7/architecture/systems.md) de tu escena.

Al ejecutar la escena, el contenido de tus archivos `.ts` se compila en un solo archivo `.js` minificado, `bin/scene.js`.

{% hint style="warning" %}
**📔 Nota**: Puedes usar otra herramienta o lenguaje en lugar de TypeScript, siempre y cuando tus scripts estén contenidos dentro de un solo archivo Javascript (bin/scene.js). Todas las declaraciones de tipos proporcionadas están hechas en TypeScript, y otros lenguajes y transpiladores no son oficialmente soportados.
{% endhint %}

#### scene.json

El archivo _scene.json_ es un manifiesto formateado en JSON para una escena en el mundo. Una escena puede abarcar una sola o múltiples parcelas de LAND. El manifiesto _scene.json_ describe qué objetos existen en la escena, una lista de cualquier asset necesario para renderizarla, información de contacto para el propietario de la parcela y configuraciones de seguridad.

La mayoría de los campos del archivo _scene.json_ pueden editarse directamente en la UI del Scene Editor. Consulta [Configuración de Escena](../scene-editor/get-started/scene-editor-essentials.md#scene-settings).

Para más información consulta [metadatos de escena](../sdk7/projects/scene-metadata.md#metadata).

Todos estos metadatos son opcionales para previsualizar la escena localmente, pero parte de ellos son necesarios para desplegar. Puedes cambiar esta información manualmente en cualquier momento.

#### package.json

Este archivo proporciona información a NPM que le permite identificar el proyecto, así como manejar las dependencias del proyecto. Las escenas de Decentraland requieren un paquete principal:

* **@dcl/sdk**: La dependencia fundamental del SDK de Decentraland, incluyendo definiciones y tipos para el motor, componentes, sistemas, etc.
* **@dcl/js-runtime**: Una serie de declaraciones de tipos que hace que la integración de @dcl/sdk sea más suave.

Tu escena puede incluir cualquier número de otros paquetes, por ejemplo para incluir [librerías](https://studios.decentraland.org/resources?sdk_version=SDK7\&resource_type=Library) que pueden ayudar a hacer que la escritura de código sea más fácil, o habilitar funcionalidades especiales.

#### package-lock.json

Este archivo lista las versiones de todas las demás dependencias del proyecto. Estas versiones están bloqueadas, lo que significa que el compilador usará literalmente la misma versión menor listada aquí.

Puedes cambiar cualquier versión de paquete manualmente editando este archivo.

#### tsconfig.json

Los directorios que contienen un archivo _tsconfig.json_ son directorios raíz para Proyectos de TypeScript. El archivo _tsconfig.json_ especifica los archivos raíz y las opciones requeridas para compilar tu proyecto de TypeScript a JavaScript.

Al instalar cualquier librería adicional a tu escena, debería agregarse automáticamente una entrada a este archivo. Para instalar librerías de utilidades de Decentraland, no debería ser necesario hacer cambios manualmente a este archivo.

### Ubicaciones de archivos recomendadas

Ten en cuenta que cuando despliegas tu escena a Decentraland, cualquier asset o librería externa que sea necesaria para usar tu escena debe estar empaquetada dentro de la carpeta de la escena o disponible a través de un servidor remoto.

Cualquier cosa que esté destinada a ejecutarse en el cliente del jugador debe estar ubicada dentro de la carpeta de la escena. No debes referenciar archivos o librerías que estén instalados en otro lugar en tu máquina local, porque no estarán disponibles para la escena desplegada.

Sugerimos usar estos nombres de carpeta de manera consistente para almacenar los diferentes tipos de assets que tu escena pueda necesitar:

* Modelos 3D: `assets/scene/models`
* Videos: `assets/scene/videos`
* Archivos de sonido: `assets/scene/sounds`
* Archivos de imagen para texturas (excepto para modelos glTF): `assets/scene/materials`
* Definiciones _.ts_ para componentes `/src/components`
* Definiciones _.ts_ para sistemas `/src/systems`

{% hint style="warning" %}
**📔 Nota**: Los archivos de soporte para modelos glTF, como sus archivos de imagen de textura o archivos _.bin_, siempre deben colocarse en la misma carpeta que el archivo _.gltf_ o _.glb_ del modelo.
{% endhint %}

{% hint style="warning" %}
**📔 Nota**: Recomendamos usar siempre nombres en minúsculas para todas las carpetas y nombres de archivos, para evitar posibles problemas.
{% endhint %}

Al importar cualquier asset a través del Scene Editor, se agregan automáticamente dentro de la carpeta `assets/scene`. Al usar cualquiera de los assets predeterminados en los Asset Packs del Scene Editor, sus archivos se agregan a la carpeta `assets/builder`.

### El archivo dclignore

Todas las escenas incluyen un archivo _.dclignore_, este archivo especifica qué archivos en la carpeta de la escena ignorar al desplegar una escena a Decentraland.

Por ejemplo, podrías querer mantener los archivos de Blender para los modelos 3D en tu escena dentro de la carpeta de la escena, pero quieres evitar que esos archivos se desplieguen a Decentraland. En ese caso, podrías agregar `*.blend` a _.dclignore_ para ignorar todos los archivos con esa extensión.

| Qué ignorar          | Ejemplo             | Descripción                  |
| -------------------- | ------------------- | ---------------------------- |
| Archivos específicos | `BACKUP.ts`         | Ignora un archivo específico |
|                      | Carpetas            | `drafts/`                    |
|                      | Extensiones         | `*.blend`                    |
|                      | Secciones de nombre | `test*`                      |
