---
description: >-
  Establece la posición, escala, padding y otras propiedades de las entidades
  UI.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/ui-positioning
---

# Posicionamiento UI

Para todo tipo de contenido UI, usa el componente `uiTransform` para establecer el tamaño, posición y otras propiedades relacionadas con la alineación de la entidad.

El componente `uiTransform` funciona en el espacio 2d de la pantalla de manera muy similar a como el componente `Transform` funciona en el espacio 3D de la escena.

_**Archivo ui.tsx:**_

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity
		uiTransform={{
			width: '200px',
			height: '100px',
			justifyContent: 'center',
			alignItems: 'center',
		}}
		uiBackground={{ color: Color4.Green() }}
	/>
)
```

_**Archivo index.ts:**_

```ts
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { uiMenu } from './ui'

export function main() {
    ReactEcsRenderer.setUiRenderer(uiMenu)
}
```

{% hint style="warning" %}
**📔 Nota**: Todos los siguientes fragmentos en esta página asumen que tienes un `.ts` similar al anterior, ejecutando la función `ReactEcsRenderer.setUiRenderer()`.
{% endhint %}

### Propiedades de posicionamiento

La alineación de las entidades UI se basa en el modelo de alineación Flexbox. Este es un modelo muy poderoso para organizar dinámicamente entidades anidadas dentro de modales que pueden variar en tamaño.

{% hint style="info" %}
**💡 Tip**: La implementación de UI de Decentraland está basada en la de [Yoga](https://yogalayout.com/docs/). Lee [este artículo](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/) para una cobertura muy accesible y profunda de las propiedades disponibles en Flexbox.
{% endhint %}

#### Tamaño de entidad

Usa `width` y `height` para establecer el tamaño de la entidad. Los siguientes tipos de valores son soportados:

* `auto`: El tamaño se adapta para ajustarse al contenido interior. Esto es muy conveniente para texto que puede variar en longitud. Escribe el valor como "auto".
* **Porcentaje**: Como un porcentaje de las medidas del padre. Escribe el valor como una cadena que termina en "%", por ejemplo `10 %`.
* **Píxeles**: Escribe el valor como un número.
* **Ancho o alto de pantalla**: Usa vw (view width) y vh (view height) para indicar una fracción del tamaño completo de la ventana ejecutando Decentraland. Por ejemplo `10vw` se refiere al 10% del ancho de la ventana, `25vh` al 25% del alto de la ventana.

Ten en cuenta que estas propiedades afectan el tamaño **predeterminado** de ese ítem, el tamaño del ítem antes de que se realicen cálculos de flex grow y flex shrink. El tamaño final puede interpretarse de manera diferente basándose en el tamaño de la entidad padre, y las propiedades de Flexbox que están establecidas.

{% hint style="warning" %}
**📔 Nota**: En propiedades que soportan tanto números como cadenas, para establecer el valor en píxeles, escribe un número. Para establecer estos campos como un porcentaje de las medidas del padre, escribe el valor como una cadena que termina en "%", por ejemplo `10 %`. También puedes establecer un valor de píxel como una cadena terminando la cadena en `px`, por ejemplo `200px`.

* Cuando los valores se expresan como porcentaje, siempre están en relación al contenedor del padre. Si la entidad no tiene padres, entonces el valor es un porcentaje de toda la pantalla.
* Si los valores se expresan en píxeles, son absolutos, y no afectados por la escala del padre.
* Si los valores se expresan en `vh` o `vw`, son un porcentaje de la ventana completa, no afectados por la escala del padre.

Para que el ancho/alto `auto` funcione, se aplican las siguientes reglas:

* El UiTransform que usa width/height como "auto" debe tener `alignSelf`: `"center"`/`"flex-start"`/`"flex-end"` O `positionType: "absolute"`
* Si el UiTransform de un hijo usa `positionType: "absolute"`, el padre no se adaptará a su tamaño/posición
* Si el UiTransform de un hijo usa cualquier sobrescritura de posición, el padre no se adaptará a su tamaño/posición
{% endhint %}

Estas otras propiedades también están disponibles para ajustar el tamaño de una manera más avanzada:

* `maxWidth` y `maxHeight`: _number_ o string (como height y width). El tamaño máximo que la entidad puede tener.
* `minWidth` y `minHeight`: _number_ o string (como height y width). El tamaño mínimo que la entidad puede tener. Si el padre es demasiado pequeño para ajustarse al tamaño mínimo de las entidades, se desbordarán de su padre.
* `flexBasis`: Esta es una forma independiente del eje de proporcionar el tamaño predeterminado de un ítem a lo largo del eje principal. Establecer la base flex de un hijo es similar a establecer el ancho de ese hijo si su padre es un contenedor con flex direction: row o establecer el alto de un hijo si su padre es un contenedor con flex direction: column.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity
		uiTransform={{
			alignSelf: 'center',
			alignContent: 'center',
			width: '80%',
			height: '30%',
			minWidth: 300,
			maxWidth: 2500,
			margin: { left: '10%', right: '10%' },
		}}
		uiBackground={{ color: Color4.Green() }}
	/>
)
```

#### Organizar entidades hijas

Por defecto, las entidades hijas se posicionan en relación a la esquina superior izquierda de su padre. Puedes usar propiedades como `justifyContent` y `alignItems` para cambiar este comportamiento.

{% hint style="info" %}
**💡 Tip**: Cualquier propiedad que se refiera a _content_ se refiere a entidades a lo largo del eje principal (determinado por `flexDirection`). Cualquier propiedad que se refiera a _items_ se refiere al eje cruzado.
{% endhint %}

* `flexDirection`: Flex direction controla la dirección en la que se disponen los hijos de un nodo. Esto también se conoce como el eje principal. El eje principal es la dirección en la que se disponen los hijos. El eje cruzado es el eje perpendicular al eje principal, o el eje en el que se disponen las líneas de envoltura. Toma su valor del tipo `FlexDirectionType`. Las siguientes opciones están disponibles:
  * `row` (PREDETERMINADO)
  * `row-reverse`
  * `column`
  * `column-reverse`
* `justifyContent`: Esta propiedad describe cómo alinear a los hijos dentro del eje principal de su contenedor. Por ejemplo, puedes usar esta propiedad para centrar un hijo horizontalmente dentro de un contenedor con `flexDirection` establecido en row o verticalmente dentro de un contenedor con `flexDirection` establecido en column. El valor de esta propiedad debe ser del tipo `AlignType`. Los valores posibles son:
  * `flex-start` (PREDETERMINADO): Alinea a los hijos de un contenedor al inicio del eje principal del contenedor.
  * `flex-end`: Alinea a los hijos de un contenedor al final del eje principal del contenedor.
  * `center`: Alinea a los hijos de un contenedor en el centro del eje principal del contenedor.
  * `space-between`: Espacia uniformemente a los hijos a través del eje principal del contenedor, distribuyendo el espacio restante entre los hijos.
  * `space-around`: Espacia uniformemente a los hijos a través del eje principal del contenedor, distribuyendo el espacio restante alrededor de los hijos. Comparado con space between, usar space around resultará en espacio distribuido al principio del primer hijo y al final del último hijo.
* `alignItems`: Describe cómo alinear a los hijos a lo largo del eje cruzado de su contenedor. Align items es muy similar a justify content pero en lugar de aplicarse al eje principal, align items se aplica al eje cruzado. Esta propiedad requiere un valor del tipo `AlignType`. Las siguientes opciones están disponibles:
  * `stretch`: (PREDETERMINADO) Estira a los hijos de un contenedor para que coincidan con el alto del eje cruzado del contenedor.
  * `flex-start`: Alinea a los hijos de un contenedor al inicio del eje cruzado del contenedor.
  * `flex-end`: Alinea a los hijos de un contenedor al final del eje cruzado del contenedor.
  * `center`: Alinea a los hijos de un contenedor en el centro del eje cruzado del contenedor.
  * `baseline`: Alinea a los hijos de un contenedor a lo largo de una línea base común. Los hijos individuales pueden establecerse para ser la línea base de referencia para sus padres.
* `alignSelf`: Align self tiene las mismas opciones y efecto que `alignItems` pero en lugar de afectar a los hijos dentro de un contenedor, puedes aplicar esta propiedad a un solo hijo para cambiar su alineación dentro de su padre. align self sobrescribe cualquier opción establecida por el padre con align items. Toma su valor de `AlignType`, consulta `alignItems` arriba para detalles sobre estas opciones.
* `alignContent`: Align content define la distribución de líneas a lo largo del eje cruzado. Esto solo tiene efecto cuando los ítems están envueltos en múltiples líneas usando `flexWrap`. Toma su valor del tipo `AlignType`. Las siguientes opciones están disponibles:
  * `flex-start`: (PREDETERMINADO) Alinea las líneas envueltas al inicio del eje cruzado del contenedor.
  * `flex-end`: Alinea las líneas envueltas al final del eje cruzado del contenedor.
  * `stretch`: Estira las líneas envueltas para que coincidan con el alto del eje cruzado del contenedor.
  * `center`: Alinea las líneas envueltas en el centro del eje cruzado del contenedor.
  * `space-between`: Espacia uniformemente las líneas envueltas a través del eje principal del contenedor, distribuyendo el espacio restante entre las líneas.
  * `space-around`: Espacia uniformemente las líneas envueltas a través del eje principal del contenedor, distribuyendo el espacio restante alrededor de las líneas. Comparado con space between, usar space around resultará en espacio distribuido al principio de las primeras líneas y al final de la última línea.
* `flexGrow`: Esto describe cómo cualquier espacio dentro de un contenedor debe distribuirse entre sus hijos a lo largo del eje principal. Después de disponer a sus hijos, un contenedor distribuirá cualquier espacio restante según los valores de flex grow especificados por sus hijos. Flex grow acepta cualquier valor de punto flotante >= 0, siendo 0 el valor predeterminado. Un contenedor distribuirá cualquier espacio restante entre sus hijos ponderado por el valor de flex grow del hijo.
* `flexShrink`: Describe cómo encoger a los hijos a lo largo del eje principal en el caso de que el tamaño total de los hijos desborde el tamaño del contenedor en el eje principal. flex shrink es muy similar a flex grow y puede pensarse de la misma manera si cualquier tamaño desbordante se considera espacio restante negativo. Estas dos propiedades también funcionan bien juntas permitiendo que los hijos crezcan y encojan según sea necesario. Flex shrink acepta cualquier valor de punto flotante >= 0, siendo 1 el valor predeterminado. Un contenedor encogerá sus hijos ponderado por el valor de flex shrink del hijo.
* `overflow`: Determina qué sucede si el tamaño de los hijos de una entidad desborda su padre. Usa valores del tipo `OverflowType`.
  * `hidden`: Las entidades desbordantes se hacen invisibles.
  * `visible`: Las entidades desbordantes rompen los márgenes del padre.
* `flexWrap`: La propiedad flex wrap se establece en contenedores y controla qué sucede cuando los hijos desbordan el tamaño del contenedor a lo largo del eje principal. Por defecto, los hijos se fuerzan en una sola línea (lo que puede encoger entidades). Si se permite el envolvimiento, los ítems se envuelven en múltiples líneas a lo largo del eje principal si es necesario. wrap reverse se comporta igual, pero el orden de las líneas se invierte. Esta propiedad toma su valor del tipo `FlexWrapType`.
  * `wrap`
  * `no-wrap`
  * `wrap-reverse`

#### Márgenes y padding

* `margin`: Esta propiedad afecta el espaciado alrededor del exterior de un nodo. Un nodo con margen se compensará de los límites de su padre pero también compensará la ubicación de cualquier hermano. El margen de un nodo contribuye al tamaño total de su padre si el padre está dimensionado automáticamente. Establece espacio entre la entidad y los márgenes de su padre. El valor esperado es un objeto que contiene las propiedades `top`, `left`, `bottom`, y `right`.
* `padding`: Esta propiedad afecta el tamaño del nodo al que se aplica. El padding en Yoga actúa como si box-sizing: border-box; estuviera establecido. Es decir, el padding no agregará al tamaño total de una entidad si tiene un tamaño explícito establecido. Para nodos dimensionados automáticamente, el padding aumentará el tamaño del nodo así como compensará la ubicación de cualquier hijo. El valor esperado es un objeto que contiene las propiedades `top`, `left`, `bottom`, y `right`.

#### Ajuste fino de posición

En Flexbox, las posiciones de entidad están mayormente determinadas por cómo están parentadas, y qué propiedades de disposición están establecidas en el padre e hijo. A menudo no tienes que establecer la propiedad `position` en absoluto. Pero si quieres ajustarla, o sobrescribir completamente el flujo normal de Flexbox y establecer una posición absoluta, aquí están las propiedades relevantes:

* `positionType`: Define cómo se posicionan las entidades. Usa un valor del enum `PositionType`.
  * `relative`: (PREDETERMINADO) Por defecto, una entidad se posiciona relativamente. Esto significa que una entidad se posiciona según el flujo normal del diseño, y luego se compensa en relación a esa posición basándose en los valores de `top`, `right`, `bottom`, y `left`. La compensación no afecta la posición de ningún hermano o entidad padre.
  * `absolute`: Cuando se posiciona absolutamente, una entidad no participa en el flujo de diseño normal. En su lugar, se dispone independientemente de sus hermanos. La posición se determina basándose en los valores de `top`, `right`, `bottom`, y `left`.
* `position`: Los valores de posición `top`, `right`, `bottom`, y `left` se comportan de manera diferente dependiendo del `positionType`. Para una entidad relativa, compensan la posición de la entidad en la dirección especificada. Para una entidad absoluta, estas propiedades especifican la compensación del lado de la entidad desde el mismo lado en el padre. El valor esperado es un objeto que contiene las propiedades `top`, `left`, `bottom`, y `right`.

{% hint style="warning" %}
**📔 Nota**: Al medir desde arriba, los números para `position` deben ser negativos. Ejemplo: para posicionar un componente dejando un margen de 20 píxeles con respecto al padre en los lados superior e izquierdo, establece `position` en 20, -20.
{% endhint %}

#### Visibilidad

* `display`: Determina si una entidad es visible o no. Para hacer una entidad invisible, establece `display` en `none`.

#### Z Index

La propiedad `zIndex` de una `UiEntity` determina el orden en que se renderizan las entidades. Las entidades con un `zIndex` más alto se renderizan encima de entidades con un `zIndex` más bajo. El `zIndex` predeterminado es 0.

```ts
import { UiEntity, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

export const uiMenu = () => (
	<UiEntity
		uiTransform={{
			zIndex: 4
		}}
		uiBackground={{ color: Color4.Green() }}
	/>
)
```

{% hint style="warning" %}
**📔 Nota**: La propiedad `zIndex` solo ordenará elementos en relación a hermanos directos, no puede usarse para renderizar una entidad encima de otras partes del árbol de diseño. En términos de html/CSS, cada elemento UI de DCL crea un nuevo [contexto de apilamiento](https://web.dev/learn/css/z-index#stacking_context).

La UI predeterminada de Decentraland, incluyendo el mapa, chat, etc, siempre se renderiza encima de todos los demás elementos UI.
{% endhint %}

### Tamaño UI responsivo

Los jugadores con diferentes tamaños de pantalla pueden ver tu diseño UI de manera diferente. Los valores en píxeles se escalan contra la pantalla virtual, así que tu UI mantiene sus proporciones en cualquier resolución: **no necesitas calcular un factor de escala por tu cuenta**, y hacerlo aplicaría el escalado dos veces.

{% hint style="warning" %}
**📔 Nota**: `devicePixelRatio` no participa del layout de la UI. Es una pista sobre la densidad de la pantalla — útil para elegir entre una textura 1x, 2x o 3x — y nada más. Si tu escena fue dimensionada en una versión anterior del SDK, esperá que la UI medida en píxeles se vea hasta 2–3 veces más grande en pantallas de alta densidad (retina y móvil), y revisá lo que hayas ajustado a mano.
{% endhint %}

{% hint style="danger" %}
**📔 Sacá tu propio factor de escala.** Si tu escena multiplica sus tamaños por un factor que calcula a partir de `UiCanvasInformation` — típicamente `Math.min(width / 1920, height / 1080)` — sacá ese multiplicador. Es el mismo factor que el SDK ahora aplica por defecto, así que mantener los dos hace que tu UI crezca de forma cuadrática con el tamaño de pantalla. Si preferís quedarte con el tuyo como único factor, desactivá la pantalla virtual con `setUiRenderer(ui, { virtualWidth: 0, virtualHeight: 0 })`.
{% endhint %}

En lugar de posicionar y escalar elementos UI en términos de porcentajes de pantalla, también puedes obtener las dimensiones del canvas y luego calcular las posiciones absolutas y tamaños siguiendo tu propia lógica personalizada. Por ejemplo, podrías elegir diferentes arreglos de diálogo dependiendo del tamaño de pantalla.

Para obtener información sobre las dimensiones de la pantalla, puedes verificar el `UiCanvasInformation`, que se agrega por defecto a la entidad raíz de la escena.

El componente `UiCanvasInformation` contiene la siguiente información:

* `height`: Alto del canvas en píxeles
* `width`: Ancho del canvas en píxeles
* `devicePixelRatio`: La relación de la resolución en píxeles físicos en el dispositivo a los píxeles en el canvas. Útil como pista sobre la densidad de la pantalla, por ejemplo para elegir entre una textura 1x, 2x o 3x.
* `interactableArea`: Un objeto `BorderRect`, detallando el área designada para elementos UI de escena. Este objeto contiene valores para `top`, `bottom`, `left` y `right`, cada uno de estos es el número de píxeles en ese margen de la pantalla que están ocupados por la UI del explorador.
* `screenInsetArea`: Un objeto `BorderRect`, detallando los márgenes seguros que reserva el dispositivo o la UI de la plataforma, por ejemplo el notch, la barra de estado, el indicador de inicio o las esquinas redondeadas en móvil. Contiene valores para `top`, `bottom`, `left` y `right`, cada uno es el número de píxeles reservados en ese borde de la pantalla. En escritorio suele ser `0` en los cuatro lados.

{% hint style="warning" %}
**📔 Nota**: Diferentes exploradores de Decentraland tendrán diferentes valores para estos, ya que las UIs globales de la plataforma pueden diferir, y los valores podrían cambiar dinámicamente a medida que el usuario expande u oculta diferentes menús de UI globales.
{% endhint %}

```ts
export function Main(){
  let canvas = UiCanvasInformation.get(engine.RootEntity)
	console.log("DIMENSIONES DEL CANVAS: ", canvas.width, canvas.height)
})
```

Algunas otras mejores prácticas respecto a tamaños UI:

* Si el ancho o alto de cualquier elemento UI es dinámico, es bueno también usar los parámetros `maxWidth`, `minWidth`, `maxHeight`, y `minHeight` para asegurarse de que permanezcan dentro de valores razonables.
* Un tamaño de fuente numérico es un valor en píxeles virtuales, y se escala como cualquier otro. Si querés un tamaño medido contra el canvas, que no dependa de la pantalla virtual, pasá un string en `vw`/`vh`. Consulta [Tamaño de texto responsivo](../sdk7/2d-ui/ui_text.md#responsive-text-size)
