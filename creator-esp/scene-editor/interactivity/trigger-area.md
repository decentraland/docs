---
description: Reacciona a la posición del jugador
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scene-editor/interactivity/trigger-area
---

# Trigger Area

Para activar una acción cuando el jugador camina dentro o fuera de un área, usa el Trigger Area [Smart Item](../scene-editor/interactivity/smart-items.md).

![](../images/editor/trigger.png)

El cubo naranja que ves mientras editas tu escena solo es visible en el Scene Editor, se vuelve invisible al ejecutar un preview de la escena. Puedes ajustar y escalar fácilmente el cubo naranja para cubrir exactamente el área que necesitas.

Si alguna parte del cuerpo de un avatar — el jugador local o cualquier otro jugador renderizado en la escena — se superpone con este cubo naranja, se llamará al evento asignado.

Usa los tipos de trigger **On Player Enters Area** y **On Player Leaves Area** en el componente **Triggers** del ítem. Las acciones en estos eventos de trigger se activan cada vez que el jugador entra o sale del área.

![](../images/editor/on_player_enters.png)

Puedes agregar tantas acciones diferentes en el mismo evento de trigger, esto las activará todas simultáneamente.

{% hint style="info" %}
**💡 Tip**: Si las trigger areas en tu escena comienzan a interponerse en la edición de otro contenido, recuerda que siempre puedes bloquearlas y/o ocultarlas desde el [Entity Tree](../scene-editor/get-started/scene-editor-essentials.md#the-entity-tree).

<img src="../images/editor/hide-trigger.png" alt="" data-size="original">
{% endhint %}

También puedes agregar **Trigger conditions**, para que las acciones solo se lleven a cabo si se cumplen ciertas condiciones en la escena. Por ejemplo, podrías tener un trigger area que abre una puerta deslizante cuando el jugador camina; podrías usar una condición allí para verificar el estado de una palanca que actúa como un interruptor de energía, y solo abrir la puerta si la energía está encendida. Consulta [States and conditions](../scene-editor/interactivity/states-and-conditions.md) para más detalles.

![](../images/editor/trigger-conditions-trigger-area.png)

Múltiples trigger areas pueden superponerse, y no se afectan entre sí.

{% hint style="info" %}
**📔 Nota**: También puedes usar eventos de trigger **On Player Enters Area** y **On Player Leaves Area** en cualquier otro smart item, pero ten en cuenta que puede ser difícil conocer el área cubierta por el trigger.

El tamaño del área activable no se relaciona con la forma visible del ítem o sus colliders, siempre es un cubo de 1m en cada lado, afectado por la escala del ítem.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: Los trigger areas en el Scene Editor se activan con cualquier avatar — el jugador local y cualquier otro jugador renderizado cerca. Si necesitas reaccionar solo al jugador local e ignorar a los demás avatares, pasa a código y usa el [componente TriggerArea de SDK7](../../sdk7/3d-essentials/trigger-areas.md) con la capa de colisión `CL_MAIN_PLAYER`.
{% endhint %}
