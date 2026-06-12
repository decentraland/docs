---
description: Tips y directrices para crear Emotes de Decentraland.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/emotes/creating-emotes
---

# Creating Emotes

Esta documentación cubrirá las especificaciones del archivo, los conceptos básicos de animación en Blender, la forma correcta de exportar un Emote y cómo importar uno al Builder.

#### Animation Specs Chart

| Propiedad              | Valor                            |
| ---------------------- | -------------------------------- |
| Frame Rate             | 30 fps                           |
| Max Length             | 10 segundos (300 frames)         |
| Animations per File    | 1                                |
| Export Format          | .glb                             |
| Sampling Rate          | 2 o 3 (si es necesario)          |
| Max File Size          | 1 MB                             |
| Max Animation Distance | 1 metro (en cualquier dirección) |
| Max Animation Height   | 1 metro                          |
| Max Texture Size       | 1024 pixels                      |

Puedes encontrar una explicación más detallada de las especificaciones de animación [**abajo**](creating-emotes.md#the-animation-specifications).

### **Recursos**

Esta documentación explica la configuración para Rig 1.0, sus controles y características.

[Decentraland Blender Rig](https://raw.githubusercontent.com/decentraland/docs/main/creator/images/emotes/Avatar_File.blend)

{% hint style="info" %}
Si estás usando Maya puedes descargar este [Maya Rig](https://github.com/decentraland/docs/blob/main/creator/images/emotes/DCL_Maya_Rig.ma) y [picker](https://github.com/decentraland/docs/blob/main/creator/images/emotes/emoteAvatar.pkr) proporcionados por [SparkleStudios](https://www.sparkles.studio/) ❤️.
{% endhint %}

## **Antes de Comenzar**

### **Frame Rate**

Antes de comenzar, es importante verificar el frame rate. Las animaciones de Decentraland deben tener un frame rate de 30 fps. El archivo de rig proporcionado probablemente tenga eso configurado, pero como el valor predeterminado de Blender es 24 fps, es mejor verificarlo antes de comenzar (un frame rate incorrecto afectará la velocidad de la animación). Esa opción se puede encontrar en Output Properties (el ícono de impresora) bajo Format, como se muestra a continuación:

![Make sure the framerate is set to 30 fps before starting.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/framerate.png)

Asegúrate de que el framerate esté establecido en 30 fps antes de comenzar.

### **Pose Mode**

En Blender, un rig puede verse en tres modos diferentes: Object Mode, Edit Mode y Pose Mode. Las animaciones solo pueden hacerse en Pose Mode (en ese modo, los controles tienen colores). Con el rig seleccionado, encontrarás esa opción en un menú desplegable, en la parte superior derecha.

![Changing to Pose Mode.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/changing_pose_mode.gif)

Cambiando a Pose Mode.

### **Interface for Animations**

En el archivo de rig, además de las dos ventanas para el viewport (vista frontal y lateral), hay tres más en la parte inferior: un _**Graph Editor**_, _**a Dope Sheet**_, y un _**Timeline**_.

- _**Graph Editor**_: En este editor, es posible editar las curvas de animación de cada propiedad de transformación de los controles seleccionados. Esas curvas muestran cómo se está calculando la interpolación y pueden editarse para lograr el efecto deseado en la animación. Tanto aquí como en el dope sheet la herramienta _**Only Show Selected**_ está activada, lo que significa que solo incluirá canales relacionados con el control seleccionado. Esto puede activarse y desactivarse simplemente haciendo clic en el ícono de flecha.
- _**Dope Sheet**_: Aquí puedes editar los keyframes. También es donde puedes crear nuevas animaciones o revisar las múltiples creadas. Ten en cuenta que para tener acceso a la animación, el _**Action Editor**_ debe estar seleccionado. Esta opción está justo al lado del ícono _Dope Sheet_, en un menú desplegable.
- _**Timeline**_: Aquí es donde se encuentran la línea de tiempo y los controles de reproducción. Aquí, el _**Auto Keying**_ está activado, lo que significa que cada vez que se manipula un control automáticamente crea un keyframe. Siempre puedes deshabilitar esa función haciendo clic en el punto junto a los controles de reproducción.

¡Con este espacio de trabajo, tienes todo lo necesario para comenzar a animar!

Estas son las ventanas inferiores. La superior está en el _**Graph Editor,**_ la del medio en el _**Dope Sheet,**_ y la inferior es el _**Timeline.**_ La flecha roja superior muestra la herramienta _**Only Show Selected**_ y la inferior muestra el _**Auto Keying**_.

{% hint style="info" %}
**💡 ¡Hint!**

Como Blender es altamente personalizable, este también es un buen momento para configurar el diseño que mejor te convenga, agregando, ajustando o eliminando ventanas. Cada animador tiene sus propias preferencias, ¡así que siéntete libre de editar el diseño como quieras!
{% endhint %}

## Comenzando

#### **Starting Pose**

En el archivo de rig proporcionado, ya hay una acción, el _**Starting_Pose**_. Considerando que todas las acciones de avatar comienzan desde la pose idle, **realmente alentamos a comenzar tu animación desde esa pose y también a usarla nuevamente en el último frame**. Esto permitirá una mejor transición de Idle a Emote y una animación más fluida.

{% hint style="info" %}
**💡 ¡Hint!**

Si quieres hacer una animación en bucle, no tienes que comenzar la animación desde el Starting Pose. ¡Siéntete libre de usar la pose que tenga más sentido en tu animación!\*\*
{% endhint %}

### **Ground Reference and Animation Area**

Para evitar la penetración del suelo durante la animación, se ha agregado un plano al archivo como referencia del suelo. Junto con la referencia del área de animación, también ayuda a identificar el área que se puede usar para la animación. Para referencia, el círculo más pequeño en el plano tiene un radio de 2 metros y el más grande, 4 metros.

![Ground and animation area reference.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/animation_area_reference.png)

Referencia de suelo y área de animación.

El centro de gravedad del avatar es el CTRL_Avatar_UpperBody. El límite para moverlo es 1 metro (izquierda, derecha, frente, atrás), así que intenta mantenerlo dentro del círculo más pequeño durante la animación. Los brazos y piernas pueden exceder el círculo pequeño hasta el más grande. En cuanto a la altura, siempre que el cuerpo del avatar no esté fuera de la caja y la raíz esté dentro del área proporcionada en el archivo, debería estar bien.

![Avatar centered.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/animation_area_center.png)

Avatar centrado.

![Max distance right.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/animation_area_ok_right.png)

Distancia máxima derecha.

![Max distance left.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/animation_area_ok_left.png)

Distancia máxima izquierda.

![Max distance up.](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/animation_area_ok_up.png)

Distancia máxima arriba.

Aquí hay algunos ejemplos de emotes que están dentro de los límites.

![Spotlight](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/spotlight.gif)

Spotlight

![Thalia Dance](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/thalia_dance.gif)

Thalia Dance

{% hint style="info" %}
**💡 ¡Atención!**

Ten cuidado con estos límites porque cruzarlos podría causar problemas de gameplay.
{% endhint %}

## **Creando una Animación**

El archivo blend tiene un clip de animación listo para ser editado: _StartingPose_Avatar_. Puedes duplicar y renombrar ese clip de animación como mejor te parezca. ¡No hay necesidad de crear uno desde cero!

En la sección _Browse Action_, simplemente haz clic en el botón _**Create A New Action**_ para duplicar la animación actual. Para renombrar el clip, solo haz clic en el texto y escribe algo más.

Blender 4.4 introdujo _Slotted Actions_, el ícono a la derecha de la sección _Browse Action_ de versiones anteriores. No hay necesidad de jugar con eso si estás creando un emote sin prop, así que puedes dejarlo como está. Si estás animando el avatar, asegúrate de que la slotted action sea Avatar_Animation.

&#x20;Crea una nueva animación duplicando la existente o haciendo clic en \_\*\*Unlink Action\*\*\_ y luego \_\*\*New\*\*\_.

### **Browsing and Deleting Animations**

En Blender, puedes tener múltiples pistas de animación en el mismo archivo. Es posible navegar por ellas haciendo clic en el menú desplegable Browse Action. Toda animación con una F (Fake User) se guardará. Para eliminar una animación, presiona Shift en el teclado y haz clic en la X. Después de hacer eso, la animación mostrará un 0 junto a ella, lo que significa que se eliminará la próxima vez que cierres Blender o vuelvas a abrir el archivo.

&#x20;Navegando animaciones: Las que tienen una F se guardarán, y las que tienen 0 se eliminarán.

Otra forma de eliminar animaciones sin tener que recargar Blender es cambiando el Display Mode de View Layer a Blender File. Expande Actions y elimina cualquier animación no deseada haciendo clic derecho en ellas y seleccionando Delete.

Puedes eliminar animaciones directamente desde Blender File bajo Display Mode en el outliner.

{% hint style="info" %}
**💡 ¡Hint!**

No edites siempre la misma pista de animación. Antes de hacer cambios importantes, simplemente duplica la animación. De esa manera tienes una versión de respaldo en caso de que te arrepientas de eliminar o cambiar algo. ¡Esta también es una buena forma de hacer seguimiento del progreso realizado hasta ahora!
{% endhint %}

&#x20;Duplicando clips de animación.

### **Naming**

**El nombre de una animación debe comenzar con una letra mayúscula y si el nombre tiene más de una palabra, las palabras deben separarse con \_.** No uses espacios o caracteres especiales. Aquí hay algunos ejemplos de nomenclatura:

- Snowfall
- Rainbow_Dance
- Throw_Money
- Talk_To_Hand

### **Emote Overrides**

Los emote overrides ocurren cuando los huesos de deformación no tienen un keyframe establecido en uno de los parámetros. Sin un keyframe, ese hueso no tendrá la información de dónde debe estar, cuánto ha sido rotado y escalado, dejando ese canal abierto. La consecuencia es que si reproduces un emote en el mundo y luego activas el tuyo mientras el anterior aún se estaba reproduciendo, la información de ubicación, rotación y escala será sobrescrita por el emote anterior, lo que causará una combinación de ambos. A menos que esto se haga a propósito, afectará tu animación, a veces con un resultado divertido, pero otras con el emote completamente desordenado. A continuación hay un ejemplo de un emote override.

Para evitar eso, selecciona todas las capas con huesos en ellas (que se pueden encontrar en _**Object Data Properties**_ > _**Skeleton**_ > _**Layers**_). Luego, en _**Pose Mode**_, deja el cursor de la línea de tiempo en el primer frame de tu animación y, con tu mouse en _**Viewport Display**_, presiona _**A**_ para seleccionar todo. En el _**Graph Editor**_, haz clic dos veces en el ícono _**Eye**_ junto al canal de armature para hacer visibles todos los canales. Con todos los huesos seleccionados, presiona _**I**_ para establecer un keyframe. Haz lo mismo para el último frame.

**¡Asegúrate de seleccionar los huesos de deformación, esto es especialmente importante!** Los huesos de deformación se pueden encontrar en la última capa inferior y se muestran como huesos verdes en el _**Viewport**_.

&#x20;Establecer keyframes en todos los huesos en los primeros y últimos frames previene emote overrides.

## **Las Especificaciones de Animación**

### **La Longitud de la Animación**

La longitud máxima de una animación es **10 segundos** o **300 frames**. Recuerda hacer keyframe de las propiedades de cada control en el primer y último frames.

{% hint style="warning" %}
⚠️ Los canales con visibilidad desactivada en el Graph Editor no tendrán keyframe, serán eliminados, ni siquiera se mostrarán en el Action Editor. A menos que se haya hecho intencionalmente de esa manera, presta especial atención a la visibilidad.
{% endhint %}

¡Haz los canales visibles antes de hacer keyframe!

### **Número de Animaciones**

Si es un emote estándar (sin prop), el archivo exportado solo puede tener una animación. Para emotes 2.0 puedes tener un clip para el avatar y un clip para el prop. Si se duplicaron animaciones durante el proceso, asegúrate de eliminar todas antes de exportar. Mantén solo la versión final. Los emotes de secuencia que necesitan muchas animaciones para funcionar (action start, action loop y action end) no están soportados ahora mismo.

### **Format**

Las animaciones deben exportarse como .**GLB**. El archivo solo puede contener el esqueleto que deforma y la animación. **Mesh, controles y cualquier otro objeto no deben exportarse**. Más detalles sobre cómo exportar se pueden encontrar [**abajo**](creating-emotes.md#exporting).

### **Sampling**

Como las restricciones no pueden exportarse, la única forma de exportar el clip de animación es horneándolo, lo que significa que todas las posiciones, rotación y escala de los huesos que deforman tendrán keyframe en cada frame de la animación. Si el clip es demasiado largo, como hasta 300 frames, tendrá 300 keyframes después de exportar y cuantos más keyframes tenga, más pesado se vuelve el archivo.

El sampling es una buena forma de optimizar la animación. La tasa de sampling definirá qué tan seguido se horneará un keyframe en la animación. Por ejemplo, si la tasa de sampling está establecida en 2, eso significa que se creará un keyframe cada dos frames. Una tasa de sampling de 3 horneará un keyframe cada tres frames y así sucesivamente. Cuanto mayor sea la tasa de sampling, más ligero será el archivo.

El inconveniente, sin embargo, es que la animación comenzará a ser cada vez menos fluida ya que pierde algunos keyframes importantes (se distribuyen a través de la animación de manera desigual). También es importante notar que **el sampling NO es dividir el número de frames de la animación por la tasa de sampling**.

Usualmente, una **tasa de sampling de 2 o 3** hará el truco. Esos números pueden optimizar la animación sin comprometer la calidad.

{% hint style="info" %}
**💡 ¡Hint!**

Si el número de frames de la animación puede dividirse por la tasa de sampling, ¡eso es algo bueno! Significa que el frame final se horneará, preservando la transición del final al inicio de la animación.
{% endhint %}

### **File Size**

El tamaño máximo de archivo es **3 MB**. Si el archivo está por encima de eso después de exportar, intenta verificar si la malla no se exportó por accidente o si la animación no supera los 10 segundos. Si todavía está por encima de 3 MB, intenta experimentar con el Sampling Rate, ya que valores más altos mejorarán la optimización.

Si el emote contiene cualquier modelo 3D adicional, las texturas en estos modelos no pueden exceder un tamaño de 1024 pixels.

## **Exporting**

Como solo queremos que la armature y la animación se exporten, desactiva la visibilidad de la malla y cualquier objeto que no sea la armature antes de exportar, como se muestra a continuación:

¡Desactiva la visibilidad de la malla antes de exportar!

Para exportar, ve a _File_ > _Export_ > _glTF2.0 (.glb, .gltf)_

Para la configuración de exportación, expande Include y en Limit to activa Visible Objects. Luego, expande la pestaña Data, expande Armature y habilita Export Deformation Bones Only.

| Configuración de Exportación | Animación |
| ---------------------------- | --------- |
|                              |           |

Si necesitas samplear la animación, expande la pestaña Animation, expande Sampling Animations y elige el número de samples deseado.

| Sampling Rate | Animación |
| ------------- | --------- |
|               |           |

¡Eso es todo para exportar la animación!

## Referencias

Si todavía no estás seguro de por dónde empezar o necesitas alguna referencia o inspiración, aquí hay algunos clips de animación para ayudarte con eso. ¡Estos pueden ser un buen material de estudio!

[Idle.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/idle.glb)

[Jump.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/jump.glb)

[Walk.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/walk.glb)

[Run.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/run.glb)

[Pose_Jump.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/pose_jump.glb)

[Pose_Spin.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/pose_spin.glb)

[Spotlight.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/spotlight.glb)

[Fashionista.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/fashionista.glb)

[Chic.glb](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/chic.glb)

[Flag_Emote.glb](https://github.com/decentraland/docs/blob/main/creator/images/emotes/Flag_Emote.glb)

[Flag_Emote.blend](https://github.com/decentraland/docs/blob/main/creator/images/emotes/Flag_Emote_Final.blend)
