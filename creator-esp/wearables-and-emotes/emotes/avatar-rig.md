---
description: Conceptos básicos sobre el rig del avatar.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/emotes/avatar-rig
---

# Avatar Rig

Un rig es un esqueleto virtual que permite que un modelo se mueva. Consiste en una jerarquía de huesos individuales, muy parecido a un esqueleto de la vida real, y funciona bajo una relación padre/hijo. Este documento cubrirá algunos conceptos básicos de rigging, como posición de huesos, orientación de huesos, huesos que deforman y no deforman, la diferencia entre IK y FK y sus propósitos. La estructura del rig de un avatar, atributos personalizados y configuración para animar se pueden encontrar en [rig features](../wearables-and-emotes/emotes/rig-features.md).

## **Los Conceptos Básicos**

#### Posición de Huesos o Puntos de Pivote

Aunque un rig no es una réplica exacta del esqueleto humano, es una buena práctica seguir la posición de los huesos de la vida real al colocar los digitales. Esto se hace para garantizar una deformación creíble y fluida. La posición del hueso es importante porque establece el punto de pivote (desde donde comenzará el movimiento). Un hueso mal colocado causará una mala deformación de la malla. Las imágenes a continuación muestran la diferencia en la posición del hueso.

![head\_pivot\_rig\_1.0.gif](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/head_pivot_rig_1.0.gif)

![head\_pivot\_rig\_2.0.gif](https://raw.githubusercontent.com/decentraland/documentation-creators/main/images/emotes/head_pivot_rig_2.0.gif)

#### Orientación de Huesos

La orientación de los huesos definirá en qué dirección rotarán, como X positivo, Z negativo, etc. Pueden configurarse de muchas maneras diferentes siempre que sea consistente a través de todo el rig. Por ejemplo, si el eje X se elige para el movimiento de inclinación hacia adelante de la columna, tiene sentido que la misma configuración se use para las piernas. La orientación también es importante porque afectará el comportamiento de espejo. Eso significa que, usualmente, la orientación del lado derecho es la versión espejada del lado izquierdo y viceversa.

![](../images/emotes/boneAxis.gif)

_Activa los ejes para mostrar la orientación de los huesos._

![](../images/emotes/boneorientation.gif)

_Los ejes son las direcciones en las que el hueso rotará._

#### Huesos que Deforman y No Deforman

Los huesos que deforman son los que deformarán la malla, son responsables de la forma en que el modelo se mueve. Ese es el esqueleto base y **no debe ser editado en absoluto**. Cambiarlo de cualquier manera puede romper el rig y la animación no funcionará cuando se exporte. Por esta razón, este rig base se movió a su propia capa (la última en la parte inferior). Estos huesos son la armature que se exporta con la malla.

Los huesos que no deforman son los que no deformarán la malla, pero aún son necesarios en un rig robusto y se usan para la configuración de [IKs, FKs](avatar-rig.md#what's-FK-and-IK-in-a-rig) y otras propiedades personalizadas. Ejemplos de huesos que no deforman son controles, huesos IK y FK, huesos de configuración de pies. Estos no deberían exportarse, solo se usan para propósitos de animación.

![](../images/emotes/DeformationBones.png)

_Huesos que deforman._

![](../images/emotes/NonDeformationBones.png)

_Huesos que no deforman._

> **¡Atención!**: **¡No edites el esqueleto base en absoluto!**

![](../images/emotes/BaseSkeleton.png)

_El esqueleto base._

#### Controles

Como buena práctica, un rig no debería ser animado manipulando los huesos que deforman porque podría causar que el rig se rompa. En su lugar, **las animaciones deberían hacerse manipulando controles.**

Los controles son básicamente huesos que no deforman, lo que significa que no afectarán la malla, haciéndolos completamente seguros para ser manipulados y animados. Su función es controlar el esqueleto base a través de restricciones y drivers, sin tocarlo directamente. Usualmente tienen diferentes formas y colores como una señal visual para sus funciones y propósitos, haciendo más fácil para el animador distinguir los huesos. Algunos de ellos también tendrán más que solo transformaciones de ubicación, rotación y escala porque es posible agregar propiedades personalizadas a ellos, como un switch IK/FK.

También es importante notar que no es posible usar la configuración de controles en un software diferente del que se hizo originalmente. Cada software tiene su propia lógica y no es posible exportar restricciones.

![](../images/emotes/RigControls.png) \_Controles y sus diferentes formas y colores.\_

> **Advertencia**: **El rig tiene que ser animado en el mismo software en el que fue creado. No es posible usar una configuración de Blender en, por ejemplo, Maya y viceversa.**

#### ¿Qué son FK e IK en un rig?

Un rig puede usar dos configuraciones diferentes que influenciarán cómo se mueve: FK e IK.

#### FK - Forward Kinematics

En la cinemática directa, o FK, el padre en la jerarquía mueve todos los huesos hijos debajo de él. Tomemos el brazo como ejemplo: cuando el hombro rota, el resto del brazo rotará también; cuando el brazo rota, el antebrazo seguirá su comportamiento. Al animar en FK, cada hueso tiene que ser rotado individualmente. Esta configuración da mucho control sobre el movimiento y es genial para movimientos de arco, que son esenciales para una animación fluida.

![](../images/emotes/FK.png)

_Dirección del movimiento en la jerarquía._

![](../images/emotes/FK_GIF.gif)

_En FK, cada hueso tiene que ser rotado individualmente._

#### IK - Inverse Kinematics

En cinemática inversa, o IK, el hijo en la jerarquía puede influenciar el movimiento de sus padres. En este caso, tomando el brazo como ejemplo nuevamente, cuando la mano se mueve alrededor, el resto del brazo seguirá el movimiento. También significa que no importa cómo se mueva el hombro, la mano mantendrá su posición. En esta configuración, un pole vector/pole target controlará en qué dirección los huesos se doblarán. Las piernas usualmente están en IK y eso es esencial para que los pies se adhieran al nivel del suelo mientras se anima.

![](../images/emotes/IK.png)

_Dirección del movimiento en jerarquía._

![](../images/emotes/IK_last.gif)

_En IK, la mano moverá todo el brazo y también mantendrá su posición. El pole target dirige la dirección en la que el codo se dobla._
