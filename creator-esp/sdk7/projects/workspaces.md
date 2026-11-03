---
description: Ejecuta múltiples proyectos de DCL a la vez
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/projects/workspaces
---

# Workspaces

Ejecuta múltiples proyectos de Decentraland en vista previa agrupándolos en un workspace. Ejecuta múltiples escenas adyacentes para ver cómo encajan, o también ejecuta múltiples [smart wearables](smart-wearables.md) juntos para ver cómo interactúan entre sí y con diferentes escenas.

Ejecutar múltiples proyectos en un workspace proporciona una alternativa de prueba mucho más completa, para asegurar que diferentes contenidos funcionen bien juntos. Un workspace es una funcionalidad de depuración, no afecta la experiencia en la escena publicada.

{% hint style="warning" %}
**📔 Nota**: El **Creator Hub** actualmente no soporta el manejo de Workspaces.
{% endhint %}

### Crear un workspace

1. Descarga el repositorio [Goerli Plaza](https://github.com/decentraland/sdk7-goerli-plaza).
2. Crea una carpeta de nivel superior separada para contener el workspace.
3. Del repositorio Goerli Plaza, copia los siguientes archivos a tu workspace:
   * `dcl-workspace.json`
   * `package.json`
   * `.gitignore`
4.  Dentro de esta carpeta, agrega una carpeta a nivel raíz para cada proyecto con el que quieras trabajar. Puedes arrastrar carpetas existentes con escenas o smart wearables. Para carpetas nuevas, ejecuta `npx sdk-commands init` dentro de cada una, para crear un proyecto de Decentraland.

    > Nota: Asegúrate de que las parcelas en cada una de las escenas no se superpongan.
5.  Estando en la carpeta del workspace, ejecuta lo siguiente, para crear los archivos necesarios:

    `npm run update-parcels && npm run sync && npm run test && npm run format`

Puedes confirmar que los proyectos son parte del workspace ejecutando `dcl workspace ls`.

### Ejecutar un workspace

Ejecuta `npm run start` en la carpeta raíz del workspace. Esto ejecuta todos los proyectos al mismo tiempo, visibles en una sola ventana de vista previa. Esta vista previa se comporta igual que al previsualizar una sola escena.

Cualquier smart wearable en el workspace está disponible para probarse buscándolo en la mochila.

### Agregar proyectos

Una vez que se crea un workspace, puedes agregar proyectos adicionales `dcl workspace add`, incluyendo la dirección relativa de la carpeta que quieres agregar. Por ejemplo `dcl workspace add my-other-example`.

También puedes agregar un proyecto que no esté dentro de la carpeta del workspace, usando la ruta absoluta.

{% hint style="warning" %}
**📔 Nota**: La carpeta ya debe contener un proyecto de decentraland iniciado con `npx sdk-commands init`. No puede ser una carpeta vacía.
{% endhint %}

También puedes editar el archivo `dcl-workspace.json` manualmente para agregar o eliminar proyectos. Modifica el archivo para incluir las rutas relativas a cada uno de los proyectos en el workspace en el array `folders`.

```json
{
	"folders": [
		{
			"path": "example-scene"
		},
		{
			"path": "example-scene2"
		}
	]
}
```
