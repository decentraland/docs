
# Cadena de Autenticación

Muchas acciones en el protocolo de Decentraland requieren o se benefician de la autorización con una firma de la cuenta de Ethereum del usuario. Por ejemplo:

1. Subir una nueva versión de cualquier [Entidad](../content/entities.md) que posean (como su perfil).
2. Autenticarse ante servicios de terceros.
3. Autorizar delegados para actuar en su nombre.

Para realizar estas acciones, los usuarios y delegados deben firmar payloads describiendo su intención y producir una _cadena de autenticación_.

## Introducción

Las cadenas de autenticación encapsulan una serie de pasos de verificación, donde cada paso depende de la verificación exitosa del anterior. Todos los pasos deben ser considerados válidos por el verificador para que cualquier acción restringida pueda tener lugar.

Cada cadena comienza identificando al usuario, y termina con un payload firmado representando la acción solicitada. La cadena más pequeña contiene así dos elementos, que indican:

```md
1. La autoridad es la cuenta de Ethereum <user-address>
2. El payload es <payload>, autorizado por <user-signature>
```

Esta cadena básica puede evaluarse verificando que la clave pública de la firma corresponde a la dirección. En este caso, es equivalente a una firma simple.

Cuando los usuarios autorizan delegados para actuar en su nombre, aparecen pasos intermedios en la cadena. Por ejemplo, una cadena con una sola delegación indicaría:

```md
1. La autoridad es la cuenta de Ethereum <user-address>
2. El delegado es <delegate-address>, autorizado por <user-signature> hasta <date>
3. El payload es <payload>, autorizado por <delegate-signature>
```

Las cadenas son más largas cuando los delegados autorizan sus propios delegados. En otras palabras, la autorización es transitiva.

{% hint style="info" %}
Puedes pensar en las cadenas de autenticación como análogas a las cadenas de certificados TLS usadas en HTTPS, con el usuario como equivalente de la autoridad raíz.
{% endhint %}

Esta cadena de un solo delegado es la forma más común de autorización usada en Decentraland, ya que los usuarios autorizan una clave para su World Explorer para evitar tener que firmar cada acción individual con su cuenta de Ethereum.

### Construir una Cadena <a href="#constructing" id="constructing"></a>

Cada paso en la cadena de autenticación contiene tres piezas de información: un `type`, un `payload` y una `signature` correspondiente.

| Campo       | Valor                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| `type`      | El nombre de un tipo ([ver abajo](authchain.md#types)).               |
| `payload`   | Una cadena dependiente del tipo.                                       |
| `signature` | La firma de Ethereum codificada en hex de `payload`, comenzando con `0x`. |

{% hint style="info" %}
Como la serialización más común de una cadena de autenticación es un array JSON, los ejemplos a continuación se presentan en esa forma. Ver [Transmitir una Cadena](authchain.md#transmitting) para más detalles.
{% endhint %}

### Primer Paso: Identificación

El primer paso, que identifica la autoridad original (es decir, el usuario), debe cumplir estas condiciones:

1. El `type` es [`SIGNER`](authchain.md#signer)
2. El `payload` es la cuenta de Ethereum codificada.
3. La `signature` está vacía.

Por ejemplo:

```json
// Primer paso en cualquier cadena de autenticación:
{
  "type": "SIGNER",
  "payload": "0xdB055877e6c13b6A6B25aBcAA29B393777dD0a73",
  "signature": ""
}
```

El segundo paso debe llevar una `signature` de esta cuenta para su `payload`.

### Pasos Intermedios: Delegación

Cuando los delegados actúan en nombre del usuario, se agrega un elemento en el medio de la cadena para cada uno de ellos. Las condiciones para estos pasos son:

1. El type es [`ECDSA_EPHEMERAL`](authchain.md#ecdsa_ephemeral)
2. El `payload` es un texto especialmente elaborado (ver abajo).

El `payload` está diseñado para ser fácil de leer y fácil de analizar, ya que tanto humanos (cuando usan su IU de wallet) como programas (cuando elaboran y validan) deben trabajar con él. Contiene exactamente 3 líneas de texto plano sensible a mayúsculas:

```md
<purpose>
Ephemeral address: <delegate-address>
Expiration: <date>
```

Por ejemplo, este es un payload típico usado por World Explorers durante el login, cuando generan su clave de delegado temporal para que el usuario apruebe:

```
Decentraland Login
Ephemeral address: 0xBB9aDF0183b1742196A4Aa55622D5838f4f483a7
Expiration: 2023-02-25T13:00:19.730Z
```

Nota que:

1. La `Ephemeral address` no necesita ser una cuenta de Ethereum real con fondos en la blockchain. El campo solo puede representar una clave pública temporal.
2. La `Expiration` es una fecha y hora serializada en forma [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601). No necesita ser UTC.
3. La clave delegada debe renovarse periódicamente con una firma fresca del usuario, debido a esta fecha de expiración.

{% hint style="info" %}
Es práctica estándar (y altamente recomendada) generar una nueva clave para cada renovación (de ahí el nombre `ECDSA_EPHEMERAL`).
{% endhint %}

Un ejemplo de paso de delegación (valores abreviados para claridad):

```json
{
  "type": "ECDSA_EPHEMERAL",
  "payload": "Decentraland Login\nEphemeral address: 0xBBa7...\nExpiration: 2021-01-25T...",
  "signature": "0x1370a4120a7cb0d2f6e4a5..."
}
```

El siguiente paso, ya sea otra delegación o la autorización final, lleva una firma de la clave de este delegado.

### Último Paso: Autorización

Después de que el `SIGNER` ha sido especificado y todas las claves delegadas `ECDSA_EPHEMERAL` fueron validadas verificando la cadena de firmas intermedias, el paso final es la acción real que necesita ser autorizada.

El `payload` depende del `type` del paso. Por ejemplo, si un usuario está subiendo un nuevo perfil (o cualquier entidad que posea) a un servidor de contenido, el último elemento tendrá esta forma:

```json
{
  // El type indica que `payload` es un ID de entidad (detalles en la sección Content):
  "type": "ECDSA_SIGNED_ENTITY",

  // El payload es la cadena ID cruda:
  "payload": "bafkreicfbg7ybpuoslkcf6x2vfnvzl5vwgqtb2pnheqiut2i4sgpblicqi",

  // La signature es producida por la cuenta en el paso anterior (usuario o delegado):
  "signature": "0x7e71dbbab..."
}
```

Si esta última firma también es válida, la acción puede proceder.

### Transmitir una Cadena <a href="#transmitting" id="transmitting"></a>

Como se mencionó anteriormente, la serialización más común de una cadena de autenticación es un array JSON. Este es el enfoque recomendado.

Sin embargo, el protocolo no impone esto. Los desarrolladores pueden usar una estrategia de serialización alternativa si es más conveniente para un caso de uso particular, como YAML, archivos CSV, formatos binarios optimizados o cadenas simples con campos delimitados.

Un ejemplo de serialización alternativa del propio protocolo se puede encontrar en el módulo [`SignedFetch`](../runtime/modules/signed-fetch.md), que usa una secuencia de headers HTTP en lugar de un array JSON.

### Elegir una Fecha de Expiración

Al seleccionar la duración válida para una clave delegada, hay un compromiso: expiraciones más cortas aumentan la seguridad, pero expiraciones más largas mejoran la experiencia del usuario (ya que los delegados deben renovarse con interacción humana con menor frecuencia).

No hay una estrategia universal para decidir cuál debe ser la ventana de tiempo válida. El World Explorer de la Foundation, como referencia, solicita autorización para su clave delegada por un mes.

{% hint style="info" %}
Las claves efímeras nunca deben tener fondos ni poseer la capacidad de transferir activos digitales. Es mucho más seguro para los usuarios finales si la fuga de una clave efímera no puede resultar en pérdidas financieras.
{% endhint %}

## Formalización

Lo que sigue es una definición más formal y precisa de los procesos involucrados. Sigue estas instrucciones para manejar con éxito las cadenas de autenticación.

### Creación

Los clientes que elaboran una cadena de autenticación para el usuario siguen estos pasos:

1. Agregar el paso de identificación:
   1. Establecer el `type` a `SIGNER`.
   2. Establecer el `payload` a la dirección de Ethereum del usuario.
   3. Establecer la `signature` a una cadena vacía.
2. Agregar pasos de delegación:
   1. Generar o usar una clave privada de delegado existente (puede requerir interacción).
   2. Calcular la dirección de Ethereum del delegado derivada de la clave pública correspondiente.
   3. Establecer el `type` a `ECDSA_EPHEMERAL`.
   4. Establecer la `expiration` a una fecha en el futuro.
   5. Elegir un `purpose` para esta clave.
   6.  Establecer el `payload` a esta forma exacta:

       ```md
       <purpose>
       Ephemeral address: <delegate-address>
       Expiration: <date>
       ```
   7. Establecer el campo `signature` a la firma del `payload` de la clave anterior (usuario o delegado).
   8. Repetir para todos los delegados sucesivos.
3. Agregar el paso de autorización de acción:
   1. Establecer el `type` a un valor válido ([ver abajo](authchain.md#types))
   2. Establecer el `payload` al valor específico del tipo (como el ID de entidad).
   3. Establecer el campo `signature` a la firma del `payload` de la clave anterior (usuario o delegado).
4. Enviar la cadena de autenticación al verificador.

### Verificación

Los servidores de contenido y servicios de terceros que implementan verificación siguen estos pasos:

1. Verificar identificación:
   1. Verificar que el `type` es `SIGNER`.
   2. Verificar que el `payload` es la dirección de Ethereum del usuario.
   3. Verificar que la `signature` es una cadena vacía.
2. Verificar delegados:
   1. Verificar que el `type` es `ECDSA_EPHEMERAL`.
   2.  Verificar que el `payload` está en esta forma y extraer los campos:

       ```md
       <purpose>
       Ephemeral address: <delegate-address>
       Expiration: <date>
       ```
   3. Verificar que la `date` aún está en el futuro.
   4. Verificar que el `purpose` es compatible con tu servicio.
   5. Verificar que la `signature` es válida para el `payload` dado y la clave pública anterior.
   6. Repetir para todos los delegados sucesivos.
3. Verificar autorización de acción:
   1. Verificar que el `type` es un valor válido ([ver abajo](authchain.md#types)).
   2. Verificar que el `payload` es válido para este `type`.
   3. Verificar que la `signature` es válida para el `payload` dado y la clave pública anterior.
4. Aceptar la cadena de autenticación.

### Tipos de Acción y Propósitos Estándar <a href="#types" id="types"></a>

Los valores `type` y `payload` para identificación y delegación son estándar y deben verificarse como se estableció anteriormente, pero los clientes y servicios pueden acordar cualquier `type` de acción, y su estructura de `payload`, así como establecer un `purpose` para sus claves delegadas que consideren válido.

El protocolo define tres tipos estándar y un propósito estándar:

### Type `SIGNER` {#signer}

**Debe** ser el `type` inicial en la cadena, donde `payload` es la dirección de Ethereum del usuario y `signature` es una cadena vacía.

### Type `ECDSA_EPHEMERAL` {#ecdsa_ephemeral}

**Debe** ser el `type` para pasos intermedios en la cadena, donde `payload` está en la forma descrita anteriormente.

**Type `ECDSA_SIGNED_ENTITY`**

El `type` final en la cadena para autorizar despliegues de entidades, donde `payload` es el ID de una entidad propiedad del usuario.

**Purpose `Decentraland Login`**

El `purpose` usual para World Explorers, firmado tanto al iniciar sesión en el mundo como al renovar su clave delegada.
