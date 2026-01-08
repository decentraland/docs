---
description: >-
  Tipos de entidad especiales para la UI, incluyendo dropdowns y cajas de
  entrada.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/2d-ui/ui_special_types
---

# Tipos Especiales UI

Hay ciertos tipos de entidad especiales que permiten algunos tipos especiales de interacciones.

### Dropdown

Crea una entidad `Dropdown` para permitir a los usuarios expandir y seleccionar un elemento de una lista.

Una entidad `Dropdown` debe tener al menos las siguientes propiedades:

* `options`: Qué valores mostrar cuando el dropdown está expandido. Proporciona un objeto conteniendo un arreglo con un valor de cadena para cada opción. El primer valor en el arreglo se muestra como la opción predeterminada.
* `onChange`: Una función que se ejecuta cada vez que se selecciona un valor en el dropdown.

También puedes configurar otros componentes de la entidad `Dropdown`, como un `uiTransform`, como en otras entidades UI.

_**Archivo ui.tsx:**_

```tsx
import { UiEntity, Label, Dropdown, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { Color4Type } from '@dcl/sdk/ecs'

function selectOption(index: number) {
  switch (index) {
    case 0:
      textColor = Color4.Red()
      break
    case 1:
      textColor = Color4.Blue()
      break
    case 2:
      textColor = Color4.Green()
      break
  }
}

let textColor: Color4Type = Color4.Red()

export const uiMenu = () => (
    <UiEntity
      uiTransform={{
        width: '200px',
        height: '100px',
        alignContent: 'auto',
        flexDirection: 'column',
        alignSelf: 'center',
      }}
    >
      <Label
        value="Select a color"
        fontSize={18}
        color={textColor}
        uiTransform={{
          width: '140px',
          height: '40px',
        }}
      />
      <Dropdown
        options={[`Red`, `Blue`, `Green`]}
        onChange={selectOption}
        uiTransform={{
          width: '100px',
          height: '40px',
        }}
      />
    </UiEntity>
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

### Texto de entrada

Crea una entidad `Input` para permitir a los usuarios escribir texto. Los jugadores primero deben hacer clic en esta caja antes de que puedan escribir en ella.

El comportamiento de la entidad `Input` se gestiona a través de las siguientes propiedades:

* `onSubmit`: Una función que se ejecuta cuando el jugador presiona Retorno/Enter, usando el texto proporcionado como entrada. El campo de texto se limpia cuando esto sucede.
* `onChange`: Una función que se ejecuta cada vez que se cambia un valor en el texto de entrada. A medida que el jugador escribe en la caja, esta función se ejecuta una vez por cada carácter que se agrega o elimina. También se llama cuando el jugador presiona Retorno/Enter y el texto se limpia.
* `disable`: Si es _true_, el jugador no podrá interactuar con la entidad de entrada.

El siguiente ejemplo usa `onSubmit` para registrar el texto proporcionado en la consola.

```tsx
import { UiEntity, Input, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'


export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 400,
      height: 300,
      positionType: 'absolute',
      position: {
        left: '35%',
        top: '40%',
      },
    }}
    uiBackground={{
      color: Color4.Gray(),
    }}
  >
    <Input
      onSubmit={(value) => {
        console.log('submitted value: ' + value)
      }}
      fontSize={35}
      placeholder={'type something'}
      placeholderColor={Color4.Black()}
      uiTransform={{
        width: '400px',
        height: '80px',
      }}
    ></Input>
  </UiEntity>
)
```

Es una buena práctica proporcionar tanto un botón para enviar como manejar el evento "onSubmit" cuando el jugador presiona la tecla Enter/Retorno. El siguiente ejemplo muestra cómo puedes hacer esto. Ten en cuenta que por consistencia, la función llevada a cabo por el botón está limpiando manualmente el texto en el campo de entrada.

```tsx
import { UiEntity, Input, Button, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'


let currentValue: string = ''

export const uiMenu = () => (
  <UiEntity
    uiTransform={{
      width: 400,
      height: 300,
      positionType: 'absolute',
      position: {
        left: '35%',
        top: '40%',
      },
      flexDirection: 'column',
    }}
    uiBackground={{
      color: Color4.Gray(),
    }}
  >
    <Input
      onSubmit={(value) => {
        handleSubmitText(value)
      }}
      fontSize={35}
      placeholder={'type something'}
      placeholderColor={Color4.Black()}
      value={currentValue}
      onChange={($) => (currentValue = $)}
      uiTransform={{
        height: '80px',
        margin: '15px',
      }}
    ></Input>
    <Button
      value="Submit text"
      variant="primary"
      uiTransform={{ alignSelf: 'center', padding: '25px' }}
      onMouseDown={() => {
        handleSubmitText(currentValue)
        currentValue = ''
      }}
    />
  </UiEntity>
)

function handleSubmitText(value: string) {
  console.log('submitted value: ' + value)
  // hacer algo con el texto
}
```

{% hint style="info" %}
**💡 Tip**: El ejemplo anterior establece la propiedad `value` del texto de entrada a una variable. Con esto, puedes cambiar el texto mostrado simplemente cambiando la variable. Esto te permite hacer cosas como limpiar el texto, cambiar valores de placeholder, o incluso implementar funcionalidades de autocorrección.
{% endhint %}

Las siguientes propiedades también están disponibles para personalizar el aspecto del campo de texto, la mayoría de ellas similares a las presentes en entidades `Label`:

* `placeHolder`: Cadena a mostrar antes de que el jugador comience a ingresar algo. Es útil hacer este texto una pista sobre qué deben escribir.
* `placeHolderColor`: El color a usar para el texto de placeholder, como un [Color4](../sdk7/3d-essentials/color-types.md).

{% hint style="info" %}
**💡 Tip**: Usa un tono más pálido del color del texto que el jugador escribe.
{% endhint %}

*   `fontSize`: El tamaño del texto, como un número.

    > NOTA: El `fontSize` no se ve afectado por el tamaño de su entidad o entidades padre.
* `color`: El color del texto que el jugador escribe, como un [Color4](../sdk7/3d-essentials/color-types.md).

{% hint style="warning" %}
**📔 Nota**: Asegúrate de usar un color diferente del `placeHolderColor`.
{% endhint %}

* `font`: La fuente a usar, tomando un valor del enum `Font`. Los valores soportados son:
  * `serif`
  * `sans-serif` _(predeterminado)_
  * `monospace`
* `textAlign`: Cómo se alineará el texto con su padre. Toma un valor del tipo `TextAlignType`. TextAlignType = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

También puedes configurar otros componentes de la entidad `Input`, como un `uiTransform`, `OnMouseDown` como en otras entidades UI.

```tsx
import { UiEntity, Input, Label, ReactEcs } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

var currentTextString = ''

export const uiMenu = () => (
    <UiEntity
      uiTransform={{
        width: '50%',
        height: 150,
        flexDirection: 'column',
        alignContent: 'flex-start',
        margin: { left: 20, top: 20 },
        padding: { left: 10, top: 10, right: 10 },
        alignSelf: 'center',
      }}
      uiBackground={{ color: Color4.Gray() }}
    >
      <Input
        onChange={(e) => {
          currentTextString = 'you wrote: ' + e
        }}
        fontSize={35}
        placeholder={'type something'}
        placeholderColor={Color4.Gray()}
      />
      <Label value={currentTextString} fontSize={40} />
    </UiEntity>
)

```
