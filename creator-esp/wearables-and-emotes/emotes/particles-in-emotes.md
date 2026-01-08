---
description: Cómo exportar partículas en tus Emotes usando Armature
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/emotes/particles-in-emotes
---

# Particles in Emotes

Los Emotes 2.0 pueden tener sonidos y props, ¿pero sabías que también es posible usar partículas? ¡Pueden ser muy divertidas y agregar esa chispa visual extra! Y también pueden acelerar el proceso de animación.

Pero como la animación de objetos y los sistemas de partículas no están soportados en Emotes 2.0, necesitamos convertir estas partículas en una armature (que sí está soportada) para poder agregarlas a los emotes. Estaremos usando un add-on de Blender desarrollado por el Content Team de la Foundation para este proceso, que se puede descargar desde el enlace a continuación.

¡Usa el [Particles to Bones Addon for Blender](https://github.com/decentraland/docs/blob/main/creator/images/emotes/particle_system_to_bone_animation.py) para comenzar!

![](../images/wearables-and-emotes/particles-emotes/01_love_grenade.png) ![](../images/wearables-and-emotes/particles-emotes/02_guitar.png)

El proceso de agregar partículas a tu emote involucrará dos pasos, puedes seguir las directrices junto con estos videos:

* **Convirtiendo partículas a armature**

[![Video Preview](https://i.vimeocdn.com/video/1803452887-82f74713a8f16df8c3618654f539cfddf78cb1f9dfac951d99d340004ac26ad6-d_590x332)](https://vimeo.com/916038156)

* **Fusionando partículas armature a prop armature**

[![Video Preview](https://i.vimeocdn.com/video/1803464351-0e8bf5158cb87707397a547948f99278b1af45d7669622887a43c3bd9340c064-d_590x332)](https://vimeo.com/916037817)

{% hint style="info" %}
**¡Atención!**

⚠️ Crear un sistema de partículas no se cubrirá en esta documentación. El objetivo es ayudar a implementarlo en tu emote.
{% endhint %}

### Convirtiendo Partículas en Armature

Como se mencionó anteriormente, los Emotes 2.0 no soportan animación de objetos o ninguna forma de sistema de partículas. Es por esto que necesitamos convertir las partículas en una armature.

Para comenzar, necesitarás un sistema de partículas funcionando y el add-on. El sistema de partículas mostrado a continuación es uno muy simple, es solo un ejemplo para mostrar cómo funciona el add-on. Asegúrate de que tu sistema de partículas coincida con las animaciones de tu emote para un mejor resultado.

![](../images/wearables-and-emotes/particles-emotes/03_particles.gif)

_Sistema de partículas simple._

A continuación, descargas e instalas el add-on. Para hacerlo, ve a Edit > Preferences > Add-ons y haz clic en Install para buscar el archivo en tu computadora.

![](../images/wearables-and-emotes/particles-emotes/04_add_on_01.png)

_Haz clic en Edit > Preferences._

![](../images/wearables-and-emotes/particles-emotes/05_add_on_02.png)

_Selecciona Add-ons a la derecha y haz clic en Install._

Una vez hecho eso, haz clic en la casilla para habilitarlo. Una pestaña llamada Converter aparecerá en el lado derecho del Viewport.

![](../images/wearables-and-emotes/particles-emotes/06_add_on_03.png)

_Haz clic en la casilla para habilitar el add-on._

![](../images/wearables-and-emotes/particles-emotes/07_add_on_04.png)

_Encontrarás la pestaña Converter a la derecha del Viewport._

A continuación, selecciona el objeto, ve a la pestaña Converter, renombra el Output Collection como mejor te parezca, define Start y End Frames y haz clic en Particle System to Armature Converter, como se muestra a continuación.

![](../images/wearables-and-emotes/particles-emotes/08_particles_converter.gif)

Notarás que se creó una colección en el Outliner, con la armature de partículas. También se creó un clip de animación, horneando todo el movimiento de cada objeto.

![](../images/wearables-and-emotes/particles-emotes/09_add_on_05.png)

_Armature generada por el add-on._

![](../images/wearables-and-emotes/particles-emotes/10_add_on_06.png)

_Clip de animación generado por el add-on._

¡Y eso es todo para convertir tus partículas en una armature! Recuerda guardar tu archivo con un nombre diferente (mantén el original como respaldo), lo necesitaremos para el siguiente paso.

{% hint style="info" %}
**¡Atención!**

⚠️ Las partículas deben ser el último elemento agregado a tu emote. Cuando el emote esté listo, tendrás la longitud exacta de la animación, lo que facilitará sincronizar las partículas con la acción realizada.
{% endhint %}

### Fusionando Partículas Armature a Prop Armature

Los Emotes 2.0 solo pueden tener dos armatures y dos clips de animación por archivo. Si solo importamos las partículas, terminaremos con tres armatures y tres clips de animación. La forma de arreglar esto es fusionar la armature de partículas con la armature de prop. La razón para fusionarla con prop y no con la armature de avatar es muy simple: el rig del avatar no puede editarse de ninguna manera agregando o eliminando huesos. Esto deja la armature de prop como la única opción.

### Fusionando Partículas Armature a Prop Armature

Los Emotes 2.0 solo pueden tener dos armatures y dos clips de animación por archivo. Si solo importamos las partículas, terminaremos con tres armatures y tres clips de animación. La forma de arreglar esto es fusionar la armature de partículas con la armature de prop. La razón para fusionarla con prop y no con la armature de avatar es muy simple: el rig del avatar no puede editarse de ninguna manera agregando o eliminando huesos. Esto deja la armature de prop como la única opción.

Lo primero que tenemos que hacer es importar o adjuntar la colección generada por el add-on. Siempre podrías exportar el archivo glb para eso e importarlo a tu archivo de emote. O simplemente podrías adjuntar la colección, que es mucho más fácil y rápido, yendo a _**File**_ > _**Append**_, busca el archivo de partículas en tu computadora, selecciona la carpeta _**Collection**_ y elige la colección deseada.

![](../images/wearables-and-emotes/particles-emotes/11_merge_01.png)

_Para adjuntar una colección, ve a File > Append._

![](../images/wearables-and-emotes/particles-emotes/12_collection_01.png)

_Una vez que busques el archivo de partículas, selecciona la carpeta Collection._

![](../images/wearables-and-emotes/particles-emotes/13_collection_02.png)

_Elige la colección generada por el add-on (que tuviste la oportunidad de renombrar). Particles\_Out es solo cómo se renombró para este ejemplo._

A continuación, vamos a fusionar las armatures. En Object Mode, selecciona primero la armature de partículas, luego mantén presionado Shift para seleccionar la armature de prop y presiona Ctrl+J para unir/fusionarlas, como se muestra a continuación.

![](../images/wearables-and-emotes/particles-emotes/14_merge_armature.gif)

Una vez que hagas eso, las partículas pueden verse desordenadas, pero no te preocupes, esto es parte del proceso. Para arreglar eso, selecciona cada objeto de partícula en el Outliner uno a la vez, ve a Object Properties (ícono de cuadrado naranja) y bajo Relations, verifica si el padre es Armature\_Prop. Haz esto para todos los objetos de partícula. Esto significa que todos los objetos son hijos de Armature\_Prop.

![](../images/wearables-and-emotes/particles-emotes/15_armature_parent_01.png)

_Asegúrate de que Armature\_Prop sea el padre para cada objeto de partícula._

Después de hacer eso para todos los objetos de partícula, selecciona el primer objeto de partícula en el Outliner, ve a Modifiers (el ícono de llave inglesa azul) y el campo Object estará vacío. Como esta es la pestaña Modifiers, eso significa que aquí elegirás qué armature dirigirá el objeto. Así que solo haz clic en Object y selecciona Armature\_Prop y repite esto para todos los objetos de partícula. A medida que lo hagas, notarás que los objetos de partículas están volviendo a sus tamaños originales, arreglando todo ese desorden creado cuando se fusionaron las armatures.

![](../images/wearables-and-emotes/particles-emotes/16_armature_parent_02.png)

_Selecciona la armature apropiada para dirigir los objetos._

Ahora que la armature está correctamente fusionada y configurada, hay un último paso para que esto funcione. Si intentas reproducir la animación, notarás que las partículas no se están moviendo. Y eso es porque ahora son parte de Armature\_Prop, y la animación que está siendo reproducida por ella es la del prop. ¿Recuerdas que las partículas tenían su propio clip de animación? Lo que necesitamos hacer ahora es copiar los keyframes del clip de animación de partículas y pegarlos en el clip de animación de prop.

Para hacerlo, ve a _**Pose Mode**_ y en el Outliner, expande _**Armature\_Prop**_ y luego _**Pose**_. Selecciona todos los huesos que pertenecen a partículas.

![](../images/wearables-and-emotes/particles-emotes/17_merge_armature_02.gif)

_Seleccionando todos los huesos de partículas._

Con los huesos seleccionados, en el Action Editor, selecciona el clip de animación original para partículas que tiene todos los keyframes. Selecciona todos los keyframes presionando A, haz clic derecho y copia los keyframes. Luego, selecciona la animación de prop, establece un keyframe en el primer frame y pega los keyframes del clip de animación de partículas.

![](../images/wearables-and-emotes/particles-emotes/18_merge_armature_04.gif)

_Copiando frames de animación de partículas a animación de prop._

¡Y has terminado! Guarda el archivo, asegúrate de eliminar el clip de animación original de partículas y exporta como lo harías usualmente.

Si necesitas más información sobre cómo hacerlo, consulta la sección _**Exporting**_ en la documentación de [Adding Props and Sounds to your Emotes](https://docs.decentraland.org/creator/emotes/props-and-sounds/).
