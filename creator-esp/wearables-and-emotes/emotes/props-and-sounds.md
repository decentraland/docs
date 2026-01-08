---
description: Directrices para agregar props y sonidos a los emotes.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/emotes/props-and-sounds
---

# Props and Sounds

Para llevar tus Emotes de Decentraland al siguiente nivel puedes agregar props (geometría 3d) y/o sonidos a ellos, ¡haciendo los emotes mucho más divertidos y atractivos! En esta directriz encontrarás todo lo que necesitas saber para exportarlos correctamente.

## **Los Conceptos Básicos y Limitaciones**

Para comenzar a agregar los props a tus emotes es importante usar el [Decentraland Template File](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/BaseMale_Rig_1.0.blend) que tendrá el rig para el avatar y también la Ground Reference para mantener tu trabajo dentro de los límites de espacio permitidos.

**Actualmente, las animaciones de props solo funcionan con Animaciones de Armature/Huesos lo que significa que las \_animaciones de transform**\_\*\* no están permitidas.\*\*

El emote con sus props debe exportarse todo junto en un solo archivo _.glb_ (Avatar\_Armature + Props\_Armature con sus animaciones).

* No más de 3 MB en total.
* No más de 3k tris para props en total.
* No más de 2 materiales y 2 texturas para props.
* No más de 62 huesos para la armature de prop.
* El emote debe tener una animación para el avatar y una animación para el prop. _Actualmente múltiples animaciones no están permitidas._
* Ambas animaciones (Avatar y Prop) deben tener la misma longitud de keyframe.
* Las animaciones no pueden exceder 300 frames o 10 segundos.
* Los límites de espacio son 4 metros cuadrados. Los props y partículas deben permanecer dentro del cubo de referencia proporcionado en el Avatar File. Para el movimiento del avatar, consulta la sección [Ground Reference and Animation Area](https://github.com/decentraland/docs-creator/blob/main/creator/wearables-and-emotes/emotes/creating-emotes.md#ground-reference-and-animation-area).

## **Convenciones de Nomenclatura:**

¡Las convenciones de nomenclatura deben seguirse estrictamente para que los emotes funcionen! De lo contrario, no se reproducirán correctamente ni en el builder ni en el mundo.

#### Convenciones de Nombre de Armatures:

**Para Avatar:**

`Armature`

**Para Props:**

`Armature_Prop`

#### Convenciones de Nombre de Animaciones:

**Para Avatar:**

`AnimationName_Avatar`

* Ejemplo: `TennisServe_Avatar`, `GunShoot_Avatar`

**Para Props:**

`AnimationName_Prop`

* Ejemplo: `TennisServe_Prop`, `GunShoot_Prop`

## **Comenzando**

Antes de comenzar tu animación, tendrás que crear un rig para el prop. Si no estás familiarizado con el proceso, consulta [Create a Rig](https://github.com/decentraland/docs-creator/blob/main/creator/3d-modeling/create-a-rig/README.md) para más información sobre cómo hacerlo.

Asegúrate de que el objeto prop y la armature tengan sus orígenes ubicados en la posición 0,0 dentro de Blender. Además, aplica transformaciones al objeto prop y armature, asegurándote de que estén congelados en una escala de 1,1,1. Esto es crucial para prevenir cualquier problema potencial con el comportamiento del prop cuando se utilice dentro del mundo o durante las animaciones.

#### Hacer que el Prop Siga el Rig del Avatar

Algunos props pueden tener que estar adjuntos a ciertas partes del cuerpo, como una raqueta de tenis a la mano. Eso se puede hacer simplemente agregando una restricción. Para hacerlo, en _**Pose Mode**_, selecciona el hueso del prop (el de la raqueta de tenis, por ejemplo), presiona _**CTRL + Shift + C**_ en tu teclado y selecciona _**Child of**_ o simplemente haz clic en la pestaña _**Bone Constraint Properties**_ y, en el menú desplegable, selecciona _**Child of**_.

_Agrega una restricción presionando `Ctrl + Shift + C` en tu teclado._

Luego, en _**Target**_, selecciona la armature del avatar y en _**Bone**_ selecciona el hueso que deseas que el prop siga. Para mantener la posición original del prop, haz clic en _**Set Inverse**_ una vez que agregues la restricción. Si la influencia es 1, el prop seguirá completamente el hueso seleccionado, si es 0, la restricción estará deshabilitada. Puedes establecer keyframes en la influencia para activarla y desactivarla a lo largo de la animación. Para hacer eso, simplemente presiona I mientras el cursor está encima de _**Influence**_.

_Menú de restricción **Child of**. Haz keyframe de la influencia para activarla y desactivarla._

{% hint style="info" %}
**💡Tip de Animación!** Si usas el deslizador para desactivar la Influence, el prop no mantendrá su posición anterior, haciendo difícil mantener la animación fluida. Para evitar tener que arreglar manualmente la posición, en lugar de usar el deslizador, haz clic en la X junto a Influence, establece un keyframe en él y otro en todos los atributos de transformación. ¡De esta manera el prop mantendrá la misma posición que cuando la Influence estaba activada!
{% endhint %}

{% hint style="info" %}
**💡Tip de Animación**

¡No dejes el prop visible desde el inicio! Para evitar arruinar lo que está por suceder y una transición abrupta, comienza la animación con el prop escalado a 0.001 y solo cámbialo a 1 cuando quieras que aparezca. Recuerda escalar de vuelta a 0 al final de la acción. ¡Esto hará las transiciones mucho más fluidas y geniales!
{% endhint %}

### Animation Slots

Blender 4.4 introdujo una nueva función: animation slots. Según la documentación de Blender, "el propósito de los slots es permitir que una acción almacene datos de animación distintos para múltiples data-blocks". En pocas palabras, los slots hacen posible almacenar la animación de múltiples cosas en la misma Acción. ¿Cómo afecta esto a los emotes 2.0?

Nueva función de Blender 4.4: animation slots.

Aunque es posible tener tanto el avatar como el prop compartiendo el mismo clip de acción, debido a la convención de nomenclatura y número de clips de animación involucrados en Emotes 2.0, no funcionará. Así que el proceso para esto sería:

1. Crea un clip de animación para el avatar, o renombra el proporcionado (_**Starting\_Pose**_). Ya tiene un animation slot, pero siéntete libre de usarlo (_**Avatar\_Animation**_) o crear uno nuevo.
2. Renombra el clip de animación _**AnimationName\_Avatar**_
3. Crea un clip de animación para el prop y renómbralo _**AnimationName\_Prop**_
4. Haz clic en el botón _**New**_ para crear un animation slot para él (recibirá un nombre automático: _**Armature\_Prop**_)
5. Anima como lo harías en versiones anteriores de Blender.

Creando un clip de acción y un slot para la animación del prop.

## **NLA Tracks**

Para que todas las animaciones se exporten, los clips deben agregarse a los NLA Tracks. Asegúrate de que solo haya un clip de animación para el avatar y otro para el prop, **deben tener exactamente el mismo número de frames.**

En _**Object Mode**_, selecciona la armature del avatar, ve a _**Pose Mode**_, selecciona el clip de animación respectivo en el menú Browse Action, haz clic en _**Action**_ y luego la opción _**Push Down**_.

Luego, cambia de vuelta a _**Object Mode**_, selecciona la armature del prop, ve a _**Pose mode**_, selecciona el clip de animación respectivo en el menú Browse Action, haz clic en _**Action**_ y luego la opción _**Push Down**_.

Empujando acciones hacia abajo a los NLA tracks.

{% hint style="warning" %}
⚠️ Ten cuidado al empujar acciones hacia abajo. Asegúrate de seleccionar la armature deseada con la animación respectiva. No solo cambies la animación y la empujes hacia abajo antes de seleccionar la otra armature o de lo contrario estarás asignando dos acciones a una armature y ninguna a la otra.
{% endhint %}

Los NLA tracks deberían verse así: una animación para cada armature.

{% hint style="info" %}
**🔥 Tip de Optimización**

**Antes de este paso asegúrate de hacer un respaldo de tu proyecto.**

Si tienes diferentes objetos para tus props puedes fusionarlos juntos en una sola malla. Puedes hacer esto simplemente seleccionando los objetos y presionando el atajo ctrl + J.

Esto ayudaría a reducir los draw calls en el juego haciendo el emote más eficiente.

Ten en cuenta que esto no funcionará para partículas, sin embargo.

_Selecciona objetos y presiona `Ctrl+J` para fusionarlos._
{% endhint %}

## **Exporting**

Los Emotes 2.0 se exportan de la misma manera que los emotes comunes. Asegúrate de que solo la armature del avatar, armature del prop y mallas del prop estén visibles y oculta todo lo demás.

Ten solo la armature del avatar, armature del prop y malla del prop visibles para exportar.

Para exportar, ve a File > Export > glTF2.0 (.glb, .gltf)&#x20;

Para la configuración de exportación, expande Include y en Limit to activa Visible Objects. Luego, expande la pestaña Data, expande Armature y habilita Export Deformation Bones Only.

| Configuración de Exportación | Animación |
| ---------------------------- | --------- |
|                              |           |

¡Presiona Export y has terminado!

## **Agregar Audio a los Emotes**

### Formato y Limitaciones para Clips de Audio

* El formato correcto para exportar sonidos para tus emotes son `.mp3` y `.ogg`.
* El clip de audio debe tener la misma duración que el emote.
* Aunque no hay limitación de tamaño para el audio, el emote con props y sonidos no puede ser mayor de 3mb.

{% hint style="info" %}
**📔 Nota**: Si el emote tiene sonido (mp3 u ogg), debe ser comprimido con el .glb. Después de eso, simplemente arrastra y suelta el .zip al builder. Más detalles se pueden encontrar aquí: [Uploading emote with sound](https://docs.decentraland.org/creator/wearables-and-emotes/manage-collections/uploading-emotes/#uploading-emotes-using-a-zip-file)
{% endhint %}

{% hint style="info" %}
**💡 ¡Atención!** Ten en consideración que los clips de audio usados en el emote deben ser IP original (Propiedad Intelectual), teniendo los derechos para reproducir y sigue los criterios de la [Content Policy](https://decentraland.org/content/).
{% endhint %}

### Editando Sonidos

Para agregar sonidos a tus emotes puedes hacerlo de diferentes maneras:

1. **Edita tus sonidos directamente en Blender**

Una forma de agregar sonidos a tus emotes es usando el editor de secuenciador de video que Blender proporciona.

Para comenzar a agregar sonidos ve a _Editor Type> Video Sequencer._

Arrastra y Suelta tus sonidos a la interfaz de canales.

Presiona el atajo `N` para ver más opciones para manejar tus sonidos como mostrar forma de onda, hacer tus sonidos Mono o cambiar el volumen.

{% hint style="info" %}
Si quieres hacer fade in y out simplemente puedes hacerlo agregando keyframes de 0 a 1 y viceversa a la propiedad de volumen.
{% endhint %}

Una vez que termines de editar tus sonidos puedes exportarlo yendo a _Render> Render Audio_. En la opción de exportación necesitas seleccionar formato `.mp3` o `.ogg` en la sección _Container_ y luego _Mixdown_. **Solo se exportará el audio dentro del rango de frames.**

2. **Renderiza la animación y agrega sonido con un software de edición de sonido**

Aunque editar sonidos directamente en Blender puede ser conveniente, no es muy flexible porque el software no está principalmente enfocado en edición de sonido. Las herramientas disponibles son muy básicas. Si quieres agregar un toque más profesional a tus sonidos, recomendamos usar software de edición de sonido dedicado de tu elección.

Hay varias opciones de software que puedes usar, como [Audacity](https://www.audacityteam.org/) (Gratuito y OpenSource), Adobe Audition, Ableton Live o ProTools. Usar software de edición de sonido dedicado te proporcionará una gama más amplia de herramientas, funcionalidades y efectos de sonido, permitiéndote mejorar tus sonidos y darles una sensación más profesional.

Para renderizar tu emote simplemente puedes agregar una cámara a tu escena de Blender y posicionarla de manera que puedas ver todos los elementos lo más claramente posible para luego tener una buena referencia para agregar sonidos.

Al renderizar un emote, es importante incluir solo el rango de frames de tu emote y no más. Elige una relación de aspecto que se adapte a tus necesidades y selecciona la carpeta de salida donde quieres que se guarde el video o secuencia de imágenes.

{% hint style="info" %}
**¡Hint!**

_¡Antes de renderizar asegúrate de hacer un render de bajo sampling para ahorrar tiempo en tu render!_
{% endhint %}

Una vez que este paso esté completo, usa tu video como referencia para crear los sonidos correspondientes usando tu software de edición de sonido preferido. **Asegúrate de que la secuencia de video coincida con el framerate de la animación de 30 frames por segundo (fps)**
