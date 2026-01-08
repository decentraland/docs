---
description: >-
  Aprende qué propiedades de mesh son compatibles con modelos 3D importados a
  Decentraland.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/3d-modeling-and-animations/meshes
---

# Meshes

Los modelos 3D tienen un _mesh_ compuesto de _faces_ triangulares. Estas faces se encuentran entre sí en _edges_ (las líneas a lo largo de las cuales se tocan) y _vertices_ (los puntos donde sus esquinas se unen).

### Limitaciones de Espacio

Todos los modelos 3D en tu escena deben caber dentro de los límites de sus parcels. Si alguna parte de tus modelos se extiende más allá de estos límites al ejecutar un preview, estas partes que se extienden serán cortadas y no renderizadas.

![](../images/editor/cut-train.png)

En el editor del Creator Hub, verás el modelo teñido de rojo y su bounding box marcado en rojo.

![](../images/editor/train-out-of-bounds.png)

{% hint style="info" %}
**📔 Nota**: En el antiguo cliente Web de Decentraland, por razones de performance, si alguna parte de un modelo 3D estaba fuera de límites, incluso si solo era el bounding box, entonces el modelo completo no se renderizaba. A partir del cliente desktop de Decentraland 2.0, solo las partes de un modelo que están fuera de límites se cortan. Las partes del modelo que están dentro de la escena se renderizan.
{% endhint %}

### Bounding Boxes

Si tienes un modelo que tiene todos sus vértices ordenadamente dentro del área de la escena, pero que tiene grandes bounding boxes que están mayormente vacíos y se extienden más allá de los límites de la escena, el modelo completo será marcado como fuera de los límites de la escena en el Creator Hub. Las partes del modelo que están dentro de tus parcels se renderizarán correctamente, y se te permitirá publicar tu escena.

Cada mesh tiene un bounding box, que rodea los límites de la forma. Para hacer un modelo 3D más utilizable dentro de Decentraland, asegúrate de que sus bounding boxes no se extiendan más allá del modelo más de lo necesario.

Para evitar este problema, puedes limpiar tus modelos 3D para restablecer posiciones y rotaciones de meshes para que los bounding boxes no se extiendan más allá de los meshes que envuelven.

![](../images/3d-models-and-animations/3d-essentials/07-apply-rotations.gif)

_En Blender puedes hacer eso seleccionando los objetos, presionando Ctrl+A y luego Apply "All transforms"._

Por ejemplo, ten cuidado al rotar un sub-mesh cerca del borde de tu modelo. Como los bounding boxes son cubos, incluso si el mesh es redondo, las esquinas de su bounding box pueden terminar sobresaliendo después de rotarlo 45°.

![](../images/3d-models-and-animations/3d-essentials/10-apply-rotation.png)

Recomendamos que hornees la rotation y scale de cada mesh en el modelo, para asegurarte de que no haya bounding boxes no deseados extendiéndose más allá del tamaño que necesitan tener.

### Limitaciones de Triángulos

Porque Decentraland es un mundo abierto lleno de diferentes escenas y objetos que se están descargando sobre la marcha (en el mismo espacio 3D), es importante optimizar nuestros meshes para tener un buen performance mientras se juega. En ese sentido, hay algunas limitaciones de escena que siempre debemos tener en cuenta cuando se trata de meshes:

> n representa el número de parcels que ocupa una escena.

* **Triangles:** n x 10000 Cantidad total de triángulos para todos los modelos en la escena.
* **Height:** log2(n+1) x 20 Altura en metros.
* **File size:** 15 MB por parcel - 300 MB max Tamaño total de los archivos cargados al content server. Incluye modelos 3D y audio. No incluye archivos que no se cargan, como paquetes node.js.
* **Max file size 50 MB por archivo** Ningún archivo individual de ningún tipo en la escena puede exceder 50 MB, sin importar cuántos parcels tenga la escena.

Para más información verifica todas las limitaciones de escena [aquí.](https://docs.decentraland.org/creator/development-guide/scene-limitations/)

{% hint style="warning" %}
**🔥Tip de Optimización🔥: Agregar Polygon Count** Un tip valioso es siempre mantener un seguimiento del polycount de tus modelos. Para hacer eso en blender necesitas activar statistics en el panel viewport overlays.

<img src="../images/3d-models-and-animations/3d-essentials/41-stats.gif" alt="" data-size="original">
{% endhint %}

### Meshes en Escenas Grandes

Al crear meshes, debemos tener en cuenta estas 2 mejores prácticas:

* **Modularity:** Divide meshes grandes en partes más pequeñas y modulares. Por ejemplo, en lugar de tener un solo mesh para un edificio completo, el edificio podría dividirse en meshes separados para cada pared, piso y sección del edificio. Esto permite que el frustum culling de Unity funcione más efectivamente, ya que solo las partes visibles necesitan ser consideradas para rendering. También mejorará el memory foot-print, porque un mesh puede ser reutilizado varias veces para el mismo objeto en diferentes ubicaciones (para lograr esto necesitarás referenciar el mismo mesh en tu definición de escena SDK7 o usar instancias en lugar de objetos duplicados al exportar la escena desde Blender).
* **Bounding Volume**: Asegúrate de que el bounding volume de cada objeto se ajuste lo más apretado posible. El espacio extraño en el bounding volume puede causar que los objetos se rendericen cuando no son visibles.

![](../images/3d-models-and-animations/3d-essentials/40-modularity.png)

#### ¿Qué es Frustrum Culling?

Frustum Culling es una técnica de optimización que desactiva los renderers (meshes) para objetos que están fuera del área de visualización de la cámara. Ve estos 2 ejemplos:

![](../images/3d-models-and-animations/3d-essentials/18-frustum-culling.png)

_Un nivel interior tipo laberinto. Esta vista de escena normal muestra todos los Game Objects visibles._

![](../images/3d-models-and-animations/3d-essentials/19-frustum-culling-2.gif)

_El frustum culling regular solo renderiza objetos dentro de la vista de la cámara. Esto es automático y siempre sucede._

### Instancing Objects vs Duplicating Objects

En Blender, duplicar un objeto crea una copia completamente separada del objeto, mientras que hacer instancing de un objeto crea un duplicado que comparte los mismos datos que el objeto original.

Cuando un objeto se duplica, crea un nuevo objeto con un conjunto completamente independiente de datos, incluyendo toda su geometría, materials y animaciones. Esto significa que cualquier cambio hecho al objeto original no se reflejará en el objeto duplicado, y viceversa.

Por otro lado, cuando un objeto tiene instancing, cualquier cambio hecho al objeto original se reflejará en todas sus instancias, y viceversa. Esto es porque todas las instancias comparten los mismos datos subyacentes.

En términos de performance, el instancing puede ser mucho más eficiente que duplicar, especialmente cuando se trabaja con escenas complejas o grandes números de objetos. Esto es porque el instancing usa menos memoria que duplicar, ya que no crea nuevos datos para cada instancia. Además, el instancing puede permitir que Blender optimice el proceso de rendering tratando todas las instancias como un solo objeto, en lugar de renderizar cada duplicado por separado.

En general, el instancing puede ser una herramienta poderosa para mejorar el performance y la eficiencia del flujo de trabajo en Blender y en tu Escena de Decentraland, especialmente cuando se trabaja con escenas grandes y complejas.

![](../images/3d-models-and-animations/3d-essentials/20-duplicate-objects.png)

En algunos casos, al duplicar objetos como árboles, plantas y postes de luz, el instancing puede mejorar significativamente el performance en comparación con duplicarlos. Por ejemplo, esta escena tiene catorce postes de luz, todos exactamente iguales. Sabemos que cada poste de luz tiene dos texturas diferentes, una para el poste y otra para la luz. Así que en este caso tendremos dos draw calls, uno por textura.

![](../images/3d-models-and-animations/3d-essentials/21-duplicate-objects-2.png)

En Blender, cuando estás en la etapa de clonar y posicionar elementos en el espacio, tienes tres opciones. Duplicate, Instance o Merge objects.

Analicemos cuáles son los pros y contras de cada procedimiento.

#### Duplicate Objects

| Menu:   | Object ‣ Duplicate Objects |
| ------- | -------------------------- |
| Hotkey: | Shift-D                    |

Esto creará una copia visualmente idéntica del objeto seleccionado pero serán tratados como objetos diferentes. Así que cuando lo exportes tendrá 2 draw calls por objeto, 2 \* 14 = 28 draw calls, y un uso total de disco de 320kb.

![](../images/3d-models-and-animations/3d-essentials/22-duplicate-objects-3.png)

#### Instancing Objects

| Panel:  | Toolbar ‣ Tools ‣ Edit ‣ Duplicate Linked |
| ------- | ----------------------------------------- |
| Menu:   | Object ‣ Duplicate Linked                 |
| Hotkey: | Alt-D                                     |

Esto creará un nuevo objeto con todos sus datos vinculados al objeto original. Si modificas uno de los objetos vinculados en Edit Mode, todas las copias vinculadas se modifican. Las propiedades Transform todavía permanecen como copias, no links, así que aún puedes rotar, escalar y mover libremente sin afectar las otras copias.

![](../images/3d-models-and-animations/3d-essentials/23-instancing.png)

_Cuando exportamos estos modelos, todavía tendremos el mismo número de draw calls (28). Sin embargo, nota que ahora tenemos solo un mesh, lo que reduce significativamente el uso de disco (41 kb)._

![](../images/3d-models-and-animations/3d-essentials/24-instancing-2.png)

_Para mantener las cosas organizadas puedes simplemente hacer instance de collections en tu escena, de esta manera te permite controlar todas las instancias desde una sola carpeta y fuente._

### Nomenclatura de Mesh

Usa nombres significativos para tus meshes. El nombre debe dar contexto de dónde se usa el asset o a qué parte del objeto se relaciona.

Para la nomenclatura de assets usa una mezcla de `PascalCase` y `snake_case`, que podemos llamar `PascalSnake_case`. Las reglas básicas allí son: una palabra nueva o palabra después del separador (`_`) comienza con **Letra Mayúscula.**

* Usa nombres significativos para tus meshes **Ejemplos:** 🟢 **Prefiere** nombres - `Theater`, `Tram` 🔴 **Evita** nombres - `Untitiled.008`, `primitive(1)`, `Cylinder.091`, `_sphere-AB`
* Usa guión bajo `_` como separador para aportar más contexto al nombre. Pon las cosas más comunes primero y los específicos al final. **Ejemplos:** 🟢 **Prefiere** nombres - `FountainStatue`, `TheaterMainWall`, `TramWheelLeft` 🔴 **Evita** nombres - `North_MainWall_Theater`, `Tram_LeftFront_Wheel`

Si hay más de un objeto con el mismo nombre agrega un número después de la palabra: `FountainStatue01, FountainStatue02, etc.`

### Herramientas para Crear Modelos

Hay muchos addons y herramientas externas que facilitan el trabajo al crear assets para hacer el pipeline más rápido y eficiente, algunos de ellos son gratuitos y algunos para comprar, por nombrar algunos:

#### Decimate

Este es un modifier bien conocido que puede usarse para reducir la cantidad de tris de tu mesh mientras mantiene la estructura de superficie del modelo. Aunque esta es una herramienta muy poderosa para optimizar modelos, ten en cuenta que una vez que el modelo está decimated, la topología puede verse afectada causando una mala topología (porque rompe la geometría en piezas impredecibles). Por otro lado, la decimation convertirá los quads de tu mesh en triángulos haciéndolo difícil de modificar después de ser usado. En ese sentido **la decimation puede ser útil para modelos estáticos pero no es preferida para modelos animados.**

![](../images/3d-models-and-animations/3d-essentials/42-decimate-01.png) ![](../images/3d-models-and-animations/3d-essentials/43-decimate-02.png)

Otra forma de optimizar tus meshes usando decimation es decimate el modelo y luego hacer una retopología adecuada. De esta manera puedes asegurar un resultado más predecible y una topología limpia.

Algunos addons de retopología que pueden ser útiles son (algunos de ellos son pagos):

* **Simplygon:** https://www.simplygon.com/
* **Speedretopo:** https://blendermarket.com/products/speedretopo?ref=2
* **Retopoflow:** https://blendermarket.com/products/retopoflow

#### Mirror Modifier

El Mirror Modifier en Blender es una herramienta usada para crear modelos simétricos reflejando una mitad de un objeto en cualquier dirección (X,Y,Z). Es una gran herramienta cuando tienes modelos simétricos porque reduce el tiempo de modelado 3D, haciendo UV Unwrapping (porque solo necesitarás desenvolver una parte del modelo y el resto compartirá las mismas coordenadas UV) y también optimiza tus texturas evitando desperdiciar resolución de textura en partes que son esencialmente reflejadas.

![](../images/3d-models-and-animations/3d-essentials/44-mirror-modifier.png)

#### Batch Rename

Una herramienta muy útil para cambiar convenciones de nombres de manera fácil es usar el Batch Rename que Blender tiene integrado en su toolkit. Para acceder a él ve a _Edit_ y luego _Batch Rename_.

![](../images/3d-models-and-animations/3d-essentials/45-batch-rename.png)

Selecciona los objetos que quieres cambiar el nombre y simplemente reemplaza el nombre de objeto por defecto por el nuevo. Esta herramienta proporciona diferentes métodos y tipos de asset para renombrar así que es muy flexible para cambiar los nombres también para meshes, animations, bones, etc.

![](../images/3d-models-and-animations/3d-essentials/47-batch-rename-methods.png) ![](../images/3d-models-and-animations/3d-essentials/46-batch-rename-types.png)

### Mejores prácticas para geometrías

* Ten en cuenta cuántas faces agregas a tus modelos 3D, ya que más faces hacen su rendering más exigente. Ve [**scene limitations**](https://docs.decentraland.org/creator/development-guide/scene-limitations/) para los límites impuestos por una escena.
* Asegúrate de que no haya faces ocultas que no se puedan ver pero que se agreguen al triangle count.
* Para formas que deberían tener lados redondeados, configúralas para que sean _smooth_ en lugar de agregar faces adicionales.
* Asegúrate de que las _normals_ de todas las faces estén mirando hacia afuera en lugar de hacia adentro. Si hay faces en tu modelo que parecen no estar allí cuando lo renderizas, esto es probablemente la causa.
* Hornea la rotation y scale de tus meshes, para que sus bounding boxes no se extiendan innecesariamente.
