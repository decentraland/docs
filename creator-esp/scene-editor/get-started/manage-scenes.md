---
description: Gestionando tus proyectos de escenas
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scene-editor/get-started/manage-scenes
---

# Gestionar Escenas

Cada una de tus escenas disponibles se muestra como una tarjeta. Abre la tarjeta para editar esa escena, desde allí también puedes hacer preview o publicarla.

### Crear una escena

Haz clic en **Create scene** para crear una nueva escena. Luego se te pedirá que elijas un template, hay algunas opciones, incluyendo una escena en blanco.

Luego se te pedirá que nombres tu escena y elijas una ubicación para guardarla.

Una vez que confirmes estos pasos, el proyecto de escena se creará. Esto puede tomar un minuto o dos, ya que descarga dependencias y configura una carpeta en tu máquina local con todo lo que necesita. Cuando termine, tu escena se abrirá en el [Scene Editor](../scene-editor/get-started/scene-editor-essentials.md).

Haz clic en los tres puntos en la tarjeta de una escena ya creada y haz clic en **Duplicate** para hacer una copia de una escena existente.

Para renombrar tu escena, ábrela y haz clic en el ícono de lápiz para cambiar el campo **Name** y otras propiedades.

### Importar una escena

El administrador de escenas muestra las escenas que encuentra en la ruta predeterminada en tu máquina.

Para agregar una escena que está en otro lugar en tu disco local, haz clic en **Import scene** y encuentra la ruta a la carpeta del proyecto. La escena importada ahora estará disponible como una nueva tarjeta en la pantalla del administrador de escenas.

La escena importada no se mueve en tu disco local.

{% hint style="warning" %}
**📔 Nota**: No renombres ni muevas manualmente la carpeta de una escena importada directamente desde tu administrador de archivos. El Scene Editor ya no podrá encontrar la escena importada en su nueva ruta.
{% endhint %}

Las escenas que creaste en el antiguo editor web se almacenan en la nube. Para trabajar en estas escenas desde el Scene Editor de escritorio, debes exportar la escena desde el Web Editor, descomprimirla en una carpeta y luego importarla en el Scene Editor de escritorio. Consulta [Migrate from Web Editor](../scene-editor/get-started/migrate-from-web.md) para más detalles.

### Eliminar una escena

En la pantalla del selector de escenas, presiona el ícono de _tres puntos_ y selecciona _Delete_.

Esto elimina la escena de tu pantalla de inicio del Scene Editor, pero no elimina los archivos de tu máquina.

Si deseas eliminar los archivos del proyecto, debes hacerlo manualmente. Por defecto, los proyectos creados a través del Scene Editor se mantienen dentro de una carpeta `.decentraland` bajo tu directorio de usuario. Puedes navegar aquí haciendo clic en los tres puntos en una tarjeta de proyecto y seleccionando **Open folder**.
