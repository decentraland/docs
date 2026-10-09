---
description: Aprende cómo funcionan las texturas en Decentraland
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/3d-modeling-and-animations/textures
---

# Textures

Las texturas son una parte clave del pipeline de arte 3D para lograr el look and feel que deseas para tu escena. En esta sección encontrarás todo lo que necesitas saber para crear tus texturas, limitaciones, nodos en Blender y optimizarlas para que rindan de la mejor manera!

### Limitaciones

#### Restricciones de Tamaño de Textura

Actualmente el Decentraland Explorer comprime las texturas a un máximo de 1024px con fines de optimización usando un Asset Bundle Converter después de que la escena se carga a los content servers. ¡Asegúrate de tener en cuenta estas limitaciones al crear tus assets!

Otro punto importante a tener en cuenta es que las texturas siempre deben ser power of two, cualquier textura que no siga esta especificación puede traer problemas al renderizar la escena.

Los tamaños de textura deben usar números de width y height (en píxeles) que coincidan con los siguientes números:

```
1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024
```

> Esta secuencia está compuesta de potencias de dos: `f(x) = 2 ^ x`. **512px es el número máximo que permitimos para un tamaño de textura.** Este es un requisito bastante común entre otros motores de rendering, está ahí debido a optimizaciones internas de los procesadores gráficos.

El width y height no necesitan tener el mismo número, pero ambos necesitan pertenecer a esta secuencia.

**El tamaño recomendado para texturas es 1024x1024**, hemos encontrado que este es el tamaño óptimo para ser transportado a través de redes domésticas y para proporcionar experiencias razonables de carga/calidad.

Ejemplos de otros tamaños válidos:

```
32x32px
64x32px
512x256px
512x512px
1024x1024px
```

Por otro lado hay un límite para texturas por parcel:

```
log2(n+1) x 10 Cantidad de texturas por parcel. Incluye texturas importadas como parte de modelos.
```

### UVMapping

UVmapping es el proceso de desenvolver las faces de tu modelo 3D en una coordenada 2D que se usará más tarde para agregar los diferentes maps a tus assets. Es una parte clave del proceso de creación. Hacer un unwrap correcto de tus modelos es un factor clave para exprimir la resolución de tus modelos y también organizará tus maps para que sean flexibles para modificación.

Para saber más sobre UV Unwrapping puedes ver este increíble video hecho por Blender Foundation:

[![Video Preview](https://i.ytimg.com/vi/Y7M-B6xnaEM/maxresdefault.jpg)](https://youtu.be/Y7M-B6xnaEM?si=qMnWTMsXxC-vxZAH)

Hay otro gran tutorial de nivel intermedio para desenvolver UVs hecho por \[Blender Guru] (https://www.youtube.com/@blenderguru) que explica cómo desenvolver un modelo más complejo:

[![Video Preview](https://i.ytimg.com/vi/scPSP_U858k/maxresdefault.jpg)](https://youtu.be/scPSP_U858k?si=Uw0xHbv9jtqVstDS)

### Maps

En la [sección materials](https://docs.decentraland.org/creator/3d-modeling/materials/) explicamos cómo Decentraland funciona con los shaders PBR. En esta sección vamos a mostrarte cómo cada texture map modifica el shader y el look and feel del objeto 3D que más tarde va a ser exportado al mundo.

### Diffuse Maps

Este es el color base de la superficie del objeto. Tener una paleta de colores equilibrada entre tus modelos es clave para lograr un look and feel cohesivo para tu experiencia.

![](../images/3d-models-and-animations/3d-essentials/58-difusemap.png)

¡Aquí hay un generador de paleta gratuito genial en caso de que lo necesites!

* **Coolors:** https://coolors.co/

O algo de inspiración de paleta proporcionada por películas increíbles:

* **Movies in Color:** https://moviesincolor.com/

### Metallic Maps

En un Metallic map, el map en escala de grises representa el grado de metalness que posee un objeto, siendo blanco completamente metálico y negro no metálico. En el siguiente ejemplo vemos cómo la luz afecta el modelo y cómo interactúa con el entorno.

![](../images/3d-models-and-animations/3d-essentials/64-metallic-map.png)

_En la imagen podemos ver cómo las partes oscuras de la textura afectan el modelo. Las franjas oscuras son opacas, mientras que la franja blanca se comporta bajo las propiedades del shader metallic y el gris siendo una mezcla entre ambos._

### Roughness Maps

En un roughness map, las áreas más oscuras corresponden a superficies más suaves, mientras que las áreas más brillantes corresponden a superficies rugosas. Esta representación en escala de grises es usada por los motores de rendering para determinar cómo la luz debe ser dispersada o reflejada en diferentes puntos de la superficie.

![](../images/3d-models-and-animations/3d-essentials/48-roughness.png) ![](../images/3d-models-and-animations/3d-essentials/49-roughness.gif)

### Transparent Maps

#### Alpha Clip

Alpha Clip en Blender, cuando se usa con una textura, implica usar el canal alpha de la textura para determinar qué partes del material deben ser visibles. Los píxeles con valores alpha por encima de un threshold especificado se muestran, mientras que aquellos por debajo del threshold se descartan, creando un efecto de recorte basado en la información de transparencia de la textura.

En el siguiente ejemplo usamos un material con alpha clip, usando 2 texturas, el diffuse color y la alpha texture en blanco y negro conectando el color al canal alpha.

![](../images/3d-models-and-animations/3d-essentials/33-alpha-clip-leave.jpeg) ![](../images/3d-models-and-animations/3d-essentials/33-alpha-clip-mask.jpeg)

![](../images/3d-models-and-animations/3d-essentials/33-alpha-blender.png)

_Como resultado podemos ver que las áreas pintadas en negro se descartan mientras que las áreas blancas se están renderizando_

#### Alpha Blend

_Alpha Blend_ te permite elegir valores intermedios por región.

Alpha Blend en Blender, cuando se usa con una textura, implica mezclar las áreas transparentes y opacas de la textura basándose en su canal alpha. Esto permite que la textura combine suavemente las porciones visibles y transparentes, interactuando naturalmente con el fondo u otros objetos en la escena.

![](../images/3d-models-and-animations/3d-essentials/33-alpha-blend.png)

_Mientras que Alpha Clip renderiza valores siendo 0 o 1 (en un threshold específico), Alpha Blend interpola los valores entre 0 y 1. En el ejemplo anterior, el material alpha blend muestra la transición de gradiente completa mientras que el alpha clip excluye parte de la textura establecida por el clip threshold_

{% hint style="warning" %}
**🔥Tip de Optimización🔥**

* Ten en cuenta que las texturas transparentes (RGB+A) siempre son más costosas en términos de performance que usar un valor en escala de grises para transparencias.
* La transparency siempre es una operación costosa al renderizar la escena. Trata siempre de mantener las transparencias al mínimo y usa Alpha Blend solo cuando sea necesario, de lo contrario Alpha Clip es preferido en lugar de Alpha Blend.
{% endhint %}

### Emissive Maps

Un emissive map es un tipo de texture map usado para controlar la auto-iluminación o la luz emitida de una superficie en una escena 3D. Es un componente del shader que determina cuánta luz (y color de luz) emite una parte particular de un modelo 3D, independientemente de las fuentes de luz externas. Los emissive maps se usan comúnmente para simular materiales u objetos que parecen emitir su propia luz.

![](../images/3d-models-and-animations/3d-essentials/57-emissive-map.gif)

_En este ejemplo podemos ver el uso de un emissive map combinado con emissive strength en un entorno que usa glow postprocessing para probar aproximadamente cómo se comporta el emissive en el mundo._

### Normal Maps

Un normal map es un tipo de textura usado en gráficos 3D para simular detalles finos de superficie y crear la ilusión de geometría compleja sin alterar realmente la geometría subyacente de un modelo. Se usa comúnmente para mejorar el realismo de modelos low-poly agregando la apariencia de bultos, grietas y otras irregularidades de superficie. También te permite mantener los objetos más ligeros, ya que muchos detalles se pueden proporcionar en la capa normal map en lugar de geometría compleja.

![](../images/3d-models-and-animations/3d-essentials/51-normal-map.png) ![](../images/3d-models-and-animations/3d-essentials/50-normal.gif)

Para agregar un normal map a tu material usando el _Shader Editor_, necesitarás conectar el nodo _**Normal Map**_ entre la textura y el shader _Principled BSDF_.

![](../images/3d-models-and-animations/3d-essentials/56-normal-map.png)

{% hint style="warning" %}
**⚠️Importante⚠️:** Nunca uses una textura como albedo y normal al mismo tiempo porque puede crear problemas al renderizar la escena.
{% endhint %}

### Optimizando Texturas

El proceso de optimización de texturas trae muchos beneficios al renderizar la escena en el explorer pero también es una buena manera de mantener el estilo de tu escena consistente y más flexible en el proceso de diseño. Algunos de estos beneficios son:

* Tener texturas optimizadas en tamaño y compresión hará que la escena funcione mucho más suave y rápido, haciéndola más rápida de descargar y más fácil de renderizar (especialmente para jugadores que tienen una conexión a internet lenta).
* Reduce la cantidad de memoria y poder de procesamiento para renderizar tu experiencia, resultando en una mejor experiencia de usuario para tus jugadores.
* Ahorra almacenamiento de los content servers de la comunidad.
* Usar **Texture Atlases** y/o **Trim Sheets** te dará más flexibilidad para iterar la creación de tu escena y consistencia de estilo entre los objetos. Usando estas técnicas puedes fácilmente intercambiar texturas, ajustar colores o patrones en lugar de hacerlo individualmente para cada modelo.
* Compartir texturas entre modelos permite tener menos texturas por escena, reduciendo los draw calls en juego drásticamente. Si estás trabajando con glbs (con texturas embebidas) encontrarás un extractor en las siguientes directrices para extraer las texturas de él, redirigiendo los modelos para usar la misma textura.

### Texturas Compartidas Entre Modelos glTFs

Una práctica sabia y común para optimizar tu escena es compartir texturas y materials entre modelos a través de la escena. Hacer esto reducirá los draw calls drásticamente y tu escena de Decentraland funcionará mucho más suave.

La siguiente herramienta basada en [**glTF pipeline**](https://github.com/AnalyticalGraphicsInc/gltf-pipeline)\*\*, \*\* ofrece algunas optimizaciones que harán que los modelos 3D sean más ligeros y más rápidos de descargar para los jugadores en tu escena.

**Mac:** [MAC GLB Extractor](https://github.com/decentraland/docs/blob/main/creator/images/3d-models-and-animations/glb-extractor/texture_extractor.sh)

**PC:** [PC GLB Extractor](https://github.com/decentraland/docs/blob/main/creator/images/3d-models-and-animations/glb-extractor/glb_texture_extract.bat)

Convierte el formato .gltf en .glb, que es binario y por lo tanto ocupa mucho menos. También coloca archivos de textura fuera del modelo 3D, lo que te permite usar la misma textura en múltiples modelos.

> 📔 Nota: el formato .glb por defecto siempre tiene texturas embebidas en el archivo. El motor no puede reconocer dos texturas embebidas como las mismas, necesitan ser archivos externos que compartan un mismo hash.

#### Cómo Usar GLB Texture Extractor

En esta escena de ejemplo, tenemos una escena sci-fi simple en Blender.

![](../images/3d-models-and-animations/glb-extractor/01-scene-base.png)

Esta escena contiene el entorno base para los modelos estáticos pero también hay otros dos assets, un droid y una spaceship que queremos exportar por separado para poder moverlos más tarde por código, para que puedan interactuar con los jugadores. En este caso usamos 4 texturas (una para el piso, un atlas color map para la mayoría de los assets, uno emissive y una textura UI sci-fi para los paneles)

![](../images/3d-models-and-animations/glb-extractor/02-model-01.png) ![](../images/3d-models-and-animations/glb-extractor/03-model-02.png)

Una vez que exportamos todos estos assets a la carpeta models tenemos 3 modelos, la escena estática del entorno, la spaceship y el droid.

![](../images/3d-models-and-animations/glb-extractor/04-models-folder.png)

Pero tenemos un problema, los archivos .glb tienen las texturas embebidas en ellos, así que si estás exportando diferentes assets que reutilizan las texturas, estas se duplicarían cada vez que haya un nuevo asset en la carpeta. Para evitar tener texturas duplicadas podemos usar esta herramienta útil.

{% hint style="warning" %}
⚠️ NOTA IMPORTANTE: Antes de usar la herramienta haz un BACKUP de tus modelos, ¡por si algo sale mal!!!
{% endhint %}

**En Mac**

Una vez que hayas exportado todos los assets a tu carpeta models puedes arrastrar el archivo script a ella.

![](../images/3d-models-and-animations/glb-extractor/05-texture-extractor.png)

1 - Abre la carpeta en el terminal arrastrando la carpeta a él.

![](../images/3d-models-and-animations/glb-extractor/06-move-to-terminal.png)

2 - Arrastra texture-extractor.sh al terminal.

![](../images/3d-models-and-animations/glb-extractor/06-terminal.png)

3 - Ejecuta el comando. Puede tomar algunos segundos procesar todos los assets. Después de eso, verás algo como esto:

![](../images/3d-models-and-animations/glb-extractor/07-run-terminal.png)

4 - Ve a tu carpeta models y habrá una nueva carpeta llamada "out" en la cual verás tus nuevos assets con las texturas extraídas.

![](../images/3d-models-and-animations/glb-extractor/08-out-folder.png)

5 - ¡Reemplaza todos los assets por los nuevos! También una vez que termines borra el "texture-extractor.sh" y la carpeta vacía "out".

![](../images/3d-models-and-animations/glb-extractor/09-replace-assets.png)

**En Windows**

Una vez que hayas exportado todos los assets a tu carpeta models puedes arrastrar el archivo script a ella.

![](../images/3d-models-and-animations/glb-extractor/10-windows-01.png)

1 - Haz doble clic en glb\_texture\_extract.bat para extraer los archivos. Si Windows te advierte sobre una app no reconocida, ve a **More Info** y luego **Run anyway**.

![](../images/3d-models-and-animations/glb-extractor/11-windows-02.png) ![](../images/3d-models-and-animations/glb-extractor/12-windows-03.png)

2 - El script generará una carpeta llamada out, allí encontrarás todos los nuevos archivos .glb con sus texturas extraídas.

![](../images/3d-models-and-animations/glb-extractor/13-windows-03.png)

5 - Reemplaza todos los assets con los nuevos. Una vez terminado, elimina el script "texture-extractor.bat" y la carpeta vacía "out".

Si sigues todos los pasos tu escena será mucho más rápida ahora y los assets compartirán la misma textura! ¡Cuando trabajamos con varios assets y escenas grandes la mejora es bastante notable! ¡Con esta herramienta puedes ahorrar bastantes megabytes de información!

{% hint style="warning" %}
⚠️ Después de completar este paso, es crucial verificar que cada textura siga las pautas. Si las texturas no siguen las pautas o son demasiado pesadas, optimízalas para que sean más ligeras antes de desplegar. El tamaño de textura recomendado para escenas performantes es 512x512px. También verifica la resolución, imágenes con más de 72 DPI afectarán el performance y no harán que la imagen se vea mejor.
{% endhint %}

### Texture Atlas/ Trim Sheets

Un texture atlas es un solo archivo de imagen que contiene datos de varias imágenes más pequeñas empaquetadas juntas. En lugar de tener una textura para cada mesh, varios meshes comparten una textura más grande.

Puedes crear un texture atlas antes de hacer el asset, lo que significa que el asset es UV-unwrapped según el texture atlas. Esto requiere algo de planificación temprana al crear la textura.

Alternativamente, puedes crear el texture atlas después de que el asset esté terminado fusionando texturas en software de pintura. Sin embargo, esto también significa que las UV islands deben reorganizarse según la textura.

A continuación hay una imagen que muestra varios objetos 3D que usan un set de texturas:

![](../images/3d-models-and-animations/3d-essentials/37-atlas-texture.png) ![](../images/3d-models-and-animations/3d-essentials/38-uv-atlas.png)

Otra forma de hacer Atlases es el uso de Trim Sheets, una técnica común en modelado 3D y desarrollo de juegos que grandes estudios e industria de juegos usan para asegurar consistencia visual y pipeline de arte eficiente. Trim Sheets es el uso de una sola imagen o textura que contiene múltiples pequeños detalles o elementos que se pueden aplicar a diferentes partes de un modelo. Esta técnica es muy útil al crear escenas grandes y necesita ser considerada en la primera etapa del pipeline de arte.

![](../images/3d-models-and-animations/3d-essentials/39-trim-sheets.png)

_Un ejemplo de collage de un Trim Sheet que usa una diffuse texture, normal y emissive._

Hay un gran [tutorial](https://www.artstation.com/blogs/jennifermcgarry/yd4Q/jenns-guide-to-trim-sheets) por [Jennifer McGarry](https://www.artstation.com/jennifermcgarry/blog) que explica el uso de Trim Sheets usando Blender!

### Nomenclatura de Texture

**Es crucial nombrar nuestras texturas correctamente.** Tener una nomenclatura correcta para la textura:

* Hará que tu pipeline de arte sea más eficiente, flexible, organizado, fácil de apuntar y modificar si es necesario.
* Evitará superponer texturas con el mismo nombre usando el texture extractor u otras herramientas.
* Evitará problemas de superposición de texturas al usar Asset Bundles.
* Forma más eficiente de señalar problemas al analizar la escena.

**Cómo nombrar apropiadamente tus Texturas:**

* El **nombre del Asset** debe representar claramente qué es la textura.
* El nombre de texturas debe comenzar con el prefijo `T_`.
* El nombre de textura debe terminar con el sufijo que define el tipo de textura:
  * `_D` - **Diffuse/ Color Map**
  * `_A` - **Alpha Texture**
  * `_MT` - **Metallic**
  * `_R` - **Roughness**
  * `_N` **- Normal Map**
  * `_E` - **Emission**

Ejemplo: Si es un diffuse map de textura de ladrillo para una pared, el nombre `T_BrickWall_D` podría ser apropiado. Si es un Normal Map del mismo asset el nombre podría ser `T_BrickWall_N`

**Ejemplos:**

* 🟢 **Prefiere** comenzar el nombre de textura con - `T_Parquet_D`, `T_Floor_R`, `T_Pipes_MT`,
* 🔴 **Evita** comenzar el nombre de textura con - `Image_`, `sprite_`,`Untitled`

### Herramientas Opcionales

Hay muchos addons y herramientas externas que facilitan el trabajo al crear assets para hacer el pipeline más rápido y eficiente, algunos de ellos son gratuitos y algunos para comprar, por nombrar algunos:

#### UVTools

* **UV Packer (Free)**:https://www.uv-packer.com/blender/
* **Zen UV:** https://blendermarket.com/products/zen-uv
* **Uvpackmaster 3:** https://blendermarket.com/products/uvpackmaster

#### Image Compressors

Hay varios compresores de imagen en línea que puedes usar para hacer tus texturas más ligeras. Por nombrar algunos:

* **CompressPNG:** https://compresspng.com/
* **TinyPNG:** https://tinypng.com/
* **FreeConvert:** https://www.freeconvert.com/
