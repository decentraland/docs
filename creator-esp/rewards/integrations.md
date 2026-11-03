---
metaLinks:
  alternates:
    - https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/rewards/integrations
---

# Integraciones

Después de crear y configurar una campaña y asegurarte de que tenga suficiente inventario para proporcionar recompensas, el siguiente paso es conectar la campaña a un activador de recompensas. Este activador puede ser una Escena, un Quest o un servidor externo. Esta sección explica cómo se pueden realizar diferentes integraciones con Rewards.

### Otorgar recompensas desde una escena

Las recompensas pueden integrarse directamente en escenas de Decentraland, pero este enfoque conlleva algunos riesgos. Como la lógica está incrustada en el código de escena al que los usuarios pueden acceder, no se recomienda para acuñar artículos con una rareza inferior a \[EPIC]\([Ver documentación](../)#rarity).

Ten en cuenta que usuarios determinados con suficiente conocimiento técnico podrían potencialmente eludir medidas de seguridad como captchas, cambiar sus direcciones IP y acuñar todos los artículos disponibles, que luego podrían vender en el marketplace. La salvaguarda principal contra esto es asegurar un suministro suficiente de artículos, para que todos tengan una oportunidad justa de recibir una recompensa.

#### Flags de dispensador recomendados

Las siguientes configuraciones de dispensador se recomiendan para reducir el riesgo de exploits en este escenario:

* \[Límite de Asignaciones]\([Ver documentación](../)#limit-assignments)
* \[Firma del Beneficiario]\([Ver documentación](../)#beneficiary-signature)
* \[Protección de Captcha]\([Ver documentación](../)#captcha-protection)
* \[Conectado a Decentraland]\([Ver documentación](../)#connected-to-decentraland)
* \[Posición dentro de Decentraland]\([Ver documentación](../)#position-inside-decentraland) (si aplica a tu caso de uso)

#### Ejemplo

```tsx
import { getPlayer } from '@dcl/sdk/src/players'
import { signedFetch } from '@decentraland/SignedFetch'
import { getRealm } from '~system/Runtime'

export function main() {
  // 1. Obtener desafío de captcha para mostrar al usuario
  const request = await fetch(`https://rewards.decentraland.org/api/captcha`, {
    method: 'POST',
  })
  const captcha = await request.json()

  // 2. Mostrar captcha para que el jugador complete - Ver ejemplo en studios.decentraland.org/resources

  // 3. Obtener datos del usuario
  const user = getPlayer()

  // 4. Obtener realm actual
  const realmInfo = await getRealm({})

  // 5. Enviar solicitud para asignar un wearable/emote
  const assignRequest = await signedFetch('https://rewards.decentraland.org/api/rewards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      campaign_key: '[DISPENSER_KEY]', // clave del dispensador
      beneficiary: user.userId, // dirección ethereum
      catalyst: realmInfo.baseUrl, // dominio catalyst
      captcha_id: captcha.data.id, // "9e6b2d07-b47b-4204-ae87-9c4dea48f9b7"
      captcha_value: '[CAPTCHA_VALUE]', // "123456"
    }),
  })

  const reward = await assignRequest.json()
```

### Otorgar recompensas desde Decentraland Quests

Puedes integrar fácilmente Rewards con las [Decentraland Quests (documentación archivada)](https://github.com/decentraland/documentation/blob/5f8c7f73c67a9a36e85095cb02e72dc6355fa590/content/creator/deprecated/quests/overview.md), esto es ideal si deseas recompensar a los usuarios por completar un quest.

#### Flags de dispensador recomendados

Las siguientes configuraciones de dispensador se recomiendan para reducir el riesgo de exploits en este escenario:

* \[Límite de Asignaciones]\([Ver documentación](../)#limit-assignments) (si aplica a tu caso de uso)

Cualquier otro de los otros flags hará que tu integración falle, evita usarlos.

{% hint style="warning" %}
⚠️ La clave del dispensador debe mantenerse en secreto, por lo que nunca debes exponerla al usuario en ningún momento.
{% endhint %}

#### Ejemplo

Para integrar tu Quest con el servicio de Rewards, solo necesitas una clave de dispensador y [configurar un webhook (documentación archivada)](https://github.com/decentraland/documentation/blob/5f8c7f73c67a9a36e85095cb02e72dc6355fa590/content/creator/deprecated/quests/rewards.md) para otorgar recompensas.

```js
{
    // ...
    "reward": {
        "hook": {
            "webhookUrl": "https://rewars.decentraland.org/api/rewards",
            "requestBody": {
                "campaign_key": "[DISPENSER_KEY]",
                "beneficiary": "{user_address}"
            }
        },
        // ...
    }
}
```

### Otorgar recompensas desde un servidor personalizado

Puedes integrar Rewards directamente desde tu servidor, lo cual es ideal para realizar verificaciones adicionales antes de acuñar artículos. Una ventaja adicional es que, a diferencia del código de escena, el código de tu servidor podría no ser público, lo que hace más desafiante para los usuarios descubrir y explotar vulnerabilidades.

#### Flags de dispensador recomendados

Las siguientes configuraciones de dispensador se recomiendan para reducir el riesgo de exploits en este escenario:

* \[Límite de Asignaciones]\([Ver documentación](../)#limit-assignments) (si aplica a tu caso de uso)

Habilitar cualquiera de los otros flags podría complicar tu integración o, dependiendo de tu caso de uso, potencialmente causar que falle. Por lo tanto, no se recomienda usarlos a menos que haya una necesidad específica. Sin embargo, es posible que desees explorar sus beneficios potenciales.

{% hint style="warning" %}
⚠️ La clave del dispensador debe mantenerse en secreto, por lo que nunca debes exponerla al usuario en ningún momento.
{% endhint %}

#### Ejemplo

```tsx
const request = await fetch('https://rewards.decentraland.org/api/rewards', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		campaign_key: '[DISPENSER_KEY]',
		beneficiary: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942', // dirección ethereum
	}),
})

const response = await request.json()
```
