---
description: >-
  Aprende cómo crear animaciones que pueden ser embebidas en modelos 3D
  importados a Decentraland.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/3d-modeling-and-animations/animations
---

# Animaciones

La animación es el arte de dar vida a las cosas. Y no hay mejor manera de hacer tu escena más viva que agregando algunas animaciones a tus modelos 3D.

Sin embargo, hay un par de formas de hacerlo: a través de **object animation** o a través de un **rig (skeletal animation)**.

**Object animation** es mejor para modelos simples, como una pelota rebotando, un globo girando o una silla flotante y no necesita un armature. Es importante mencionar que object animation es diferente de **vertex animation**. En object animation, el modelo se animará como un todo, mientras que en vertex animation, como su nombre lo dice, cada vértice del objeto puede ser animado por separado (lo cual es súper útil para crear shape keys, por ejemplo). Aunque object animation está perfectamente bien para usar, **vertex animation actualmente no es soportado por el motor de Decentraland**.

Si tienes un modelo más complejo, como una persona, criatura o maquinaria, entonces necesitarás un **rig**. Un rig no es más que un esqueleto digital que moverá y deformará el mesh. El proceso de vincular el mesh al skeleton se llama Skinning, donde defines qué bone afectará a cada vertex group y qué tan fuerte será esa influencia, asegurándote de que el modelo se deforme de la mejor manera posible.

Para cualquiera de los dos métodos, todas las animaciones de un modelo 3D deben estar embebidas dentro de su archivo _glTF_ ya que no puedes referenciar animaciones en archivos separados.

### Creando una Animación

Así es como creas animaciones usando Blender.

#### Object Animation

* Asegúrate de tener la pestaña _**Dope Sheet**_ > _**Action Editor**_ abierta y haz clic en _**New**_ para agregar un animation clip.
* Renómbralo como mejor te parezca y asegúrate de activar _**Fake User**_ (el ícono del escudo) para que tu animación se guarde.
* Establece un keyframe en el primer frame seleccionando el objeto y presionando _**I**_. Luego mueve el objeto, rótalo o escálalo y, en otro frame en el timeline, presiona _**I**_ nuevamente para establecer otro keyframe con los transforms actuales.
* El frame final de la animación debe ser igual al primero, así que simplemente copia el primer frame y pégalo en el último.

![](../images/3d-models-and-animations/animations/01_object_animation_02.gif)

_Creando un animation clip y agregando keyframes._

#### Rig Animation

Para una rig animation, necesitarás un armature. Si quieres hacerlo tú mismo, consulta [Create a Rig](https://www.notion.so/686e6f59a1604585b059f990a36b2d55) para instrucciones sobre cómo configurar un armature consistente.

Cuando el rigging esté listo y el skinning tenga buenas deformaciones, ¡estás listo para comenzar tu animación! El proceso es muy similar a Object Animation, pero en lugar de hacerlo en _**Object Mode**_, lo animarás en _**Pose Mode**_.

* Ve a _**Pose Mode**_ y asegúrate de tener la pestaña _**Dope Sheet**_ > _**Action Editor**_ abierta y haz clic en _**New**_ para agregar un animation clip.
* Renómbralo como mejor te parezca y asegúrate de activar _**Fake User**_ (el ícono del escudo) para que tu animación se guarde.
* Con el mouse en el _**Viewport**_, presiona _**A**_ para seleccionar todo y luego _**I**_ para establecer un keyframe para todo el armature.
* Muévete a un frame diferente en el timeline y manipula el bone como quieras para obtener la pose que deseas. Puedes cambiar la location, rotation y scale de un bone dependiendo de cómo configuraste tu rig.
* Cuando tengas un buen resultado, establece otro keyframe para todo el armature. Sigue haciendo eso hasta que termines tu animación. Recuerda tener el primer y último frames iguales si la animación va a hacer loop.

![](../images/3d-models-and-animations/animations/02_rig_animation_02.gif)

Si eres nuevo en el proceso de animación, mira este tutorial con algunos buenos consejos para principiantes:

[![Video Preview](https://img.youtube.com/vi/-iWslh4uQIk/maxresdefault.jpg)](https://youtu.be/-iWslh4uQIk)

### Skinned Animations vs Transform Animations

**Las transform animations típicamente son mejores que las skinned mesh animations en términos de performance porque implican menos sobrecarga en términos de recursos computacionales requeridos para mostrar la animación.**

La skinned mesh animation implica usar un mesh con un skeleton de bones que están ponderados a los vértices del mesh. El skeleton se anima, lo que a su vez anima el mesh. Este proceso puede ser bastante computacionalmente intensivo, especialmente cuando hay un gran número de vértices para animar.

Las transform animations, por otro lado, implican animar las propiedades de transform de un objeto (como su position, rotation y scale) directamente. Esto puede hacerse con menos recursos computacionales que la skinned mesh animation, ya que típicamente hay menos propiedades de transform para animar que vértices en un mesh.

Además, las transform animations a menudo pueden ser pre-calculadas y almacenadas en un formato más compacto, como keyframe data, que puede ser rápidamente accedido y reproducido sin la necesidad de cálculos intensivos en tiempo real.

En general, aunque la skinned mesh animation puede producir animaciones más detalladas y realistas, las transform animations son a menudo preferidas para aplicaciones críticas de performance como videojuegos.

### Creando y Exportando Múltiples Animation Clips

Puedes tener tantos animation clips como quieras para tu modelo. Puedes ver cómo crear, navegar y eliminar animaciones en [esta sección aquí](https://www.notion.so/5e962e5d54a24bcb9b906748007eb4cc).

En el video a continuación, aprenderás cómo exportar múltiples animaciones desde Blender en un solo archivo GLB.

[![Video Preview](https://img.youtube.com/vi/YxAB4bujO_w/maxresdefault.jpg)](https://www.youtube.com/watch?v=YxAB4bujO_w\&ab_channel=Decentraland)

### Exportando Muchas Animaciones como una Sola

A diferencia de una skeletal animation, donde puedes hacer rig de múltiples objetos y combinar sus animaciones en un solo animation clip, en object animation no puedes hacer eso. Las animaciones se exportarán por separado y solo un objeto se reproducirá a la vez. Una solución para eso es fusionar muchas animaciones en una sola, para que tengas un animation clip que tenga todos los objetos moviéndose al mismo tiempo.

Para hacer eso, empuja hacia abajo al _**Nonlinear Animation Track**_ la animación de cada objeto, como se muestra a continuación.

![](../images/3d-models-and-animations/animations/03_object_animation_push_down_02.gif)

_Empuja hacia abajo la animación de cada objeto al NLA Track._

Una vez que todas las animaciones estén listadas en el NLA Editor, selecciona todos los objetos, ve a **File > Export > glTF2.0**. Expande Include y marca Selected Objects. Expande Animation, expande Animation nuevamente y desmarca **Group by NLA Track**. Puedes renombrar el animation clip en Merged Animation Name y luego simplemente presiona **Export glTF 2.0**.

![](../images/3d-models-and-animations/animations/04_export_single_animation_clip.png)

_Configuración para exportar múltiples animaciones como una sola._

Ten en cuenta que esto solo funcionará si los objetos tienen una sola animación cada uno. Si los objetos tienen múltiples animation clips, es mejor exportarlos por separado.

{% hint style="info" %}
**💡 Tip**: En lugar de crear tus propias animaciones, también puedes descargar animaciones genéricas y aplicarlas a tu modelo. Por ejemplo, para personajes 3D con características humanas, puedes descargar animaciones gratuitas o de pago desde [Mixamo](https://www.mixamo.com/#/).
{% endhint %}

### Sampling

A veces tu archivo de animación puede terminar siendo demasiado pesado debido a la cantidad de animaciones o la combinación de animación+modelo.

Sampling es una buena manera de optimizar la animación. El sampling rate definirá con qué frecuencia se horneará un keyframe en la animación. Por ejemplo, si el sampling rate se establece en 2, eso significa que se creará un keyframe cada dos frames. Un sampling rate de 3 horneará un keyframe cada tres frames y así sucesivamente. Cuanto mayor sea el sampling rate, más ligero será el archivo.

El inconveniente, sin embargo, es que la animación comenzará a ser menos y menos fluida ya que pierde algunos keyframes importantes (se distribuyen a través de la animación de manera desigual). También es importante notar que **sampling NO está dividiendo el número de frames de la animación por el sampling rate**.

Usualmente, un **sampling rate de 2 o 3** hará el truco. Esos números pueden optimizar la animación sin comprometer la calidad.

Puedes encontrar el _**Sampling Rate**_ en la configuración de exportación, bajo _**Animation**_.

![](../images/3d-models-and-animations/animations/05_sampling_rate.png)

{% hint style="info" %}
**💡 Tip**: Si el número de frames de la animación puede ser dividido por el sampling rate, ¡eso es bueno! Significa que el frame final será horneado, preservando la transición desde el final hasta el inicio de la animación.
{% endhint %}

### Implementando Animaciones

Este documento cubre cómo agregar animaciones en un modelo 3D. Ve [**handle animations**](https://docs.decentraland.org/creator/development-guide/3d-model-animations/) para instrucciones sobre cómo activar y manejar animaciones en una escena.

### Mejores Prácticas para Animaciones

* Mantén el armature lo más simple posible, solo crea bones para las partes del modelo que intentas animar. Los bones pueden afectar el performance, así que asegúrate de agregar solo lo que sea realmente necesario.
* Si la animación va a hacer loop en tu escena, asegúrate de que la pose final sea idéntica a la inicial para una mejor transición.
* Nunca dejes un personaje sin animación, incluso si realmente no están haciendo nada. Crea una animación "idle" para cuando el personaje esté quieto. El idle puede incluir movimientos sutiles como respirar y quizás miradas ocasionales.
* No dejes bones sin posar, como manos, dedos, cabeza o cuello. Los detalles son realmente importantes en una buena animación y el movimiento rígido solo la hará menos creíble.
* Evita demasiados keyframes, a menos que sea extremadamente necesario. Cuantos más keyframes agregues, mayores serán las posibilidades de obtener mala interpolación y una animación más pesada.
* Selecciona todos tus bones (incluyendo los deformantes) y establece un keyframe en el primer y último frame de tu animación. Esto evitará tener bones sin información, causando que una animación afecte a la otra involuntariamente.
* Asegúrate de que tu archivo solo tenga un armature cuando lo exportes. Al importar animaciones, también se importará un armature con él. Todas las animaciones deben ser realizadas por el mismo armature base, así que elimina cualquier cosa que no necesites.
* Siempre renombra tus bones y animaciones. ¡Mantén todo organizado!
* Al exportar el modelo _glTF_, confirma que estás exportando todos los objetos y animaciones. Algunos exportadores solo exportarán lo _**actualmente seleccionado**_ por defecto.
* Después de exportar el modelo, inspecciónalo en [Babylon Sandbox](https://sandbox.babylonjs.com/) y verifica si todas las animaciones están funcionando y están nombradas como se espera.
