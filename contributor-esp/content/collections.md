
Las colecciones son grupos de [wearables](entity-types/wearables.md) y [emotes](entity-types/emotes.md) definidos en el mismo namespace off-chain o contrato on-chain.

No son [entidades](entities.md) en sí mismas, pero sus artículos individuales pueden obtenerse de servidores de contenido normalmente usando [punteros](pointers.md).

## URNs y Punteros {#pointers}

Las colecciones se identifican usando URNs, que son prefijos para sus URNs de artículo. Hay 4 tipos generales de URNs:

* Colecciones `v1` con contenido aprobado por la Foundation (obsoleto).
* Colecciones `v2` con contenido aprobado por la comunidad.
* Colecciones `thirdparty` con artículos asociados a NFTs fuera de Decentraland.
* Colecciones `off-chain`, conteniendo principalmente artículos predeterminados para nuevos avatares.

{% hint style="info" %}
A pesar del hecho de que las colecciones `v1` están obsoletas y no se crearán ni actualizarán más, siguen siendo válidas y sus artículos pueden usarse.
{% endhint %}

### Colecciones Versión 1 y 2

Tanto el antiguo namespace de colección `v1` como el actual `v2` tienen URNs de la misma forma:

```
urn:decentraland:<blockchain>:<collections-version>:<contract-address>
```

Por ejemplo:

```
# Una colección en el espacio v1 obsoleto:
urn:decentraland:mainnet:collections-v1:DCL Test Masks

# Una colección en el espacio v2 aprobado por la comunidad:
urn:decentraland:matic:collections-v2:0x25a1d66891d44cdf7b8c45802489c1dea7aadf8b
```

Si el segmento `:<id>` se agrega al final, el URN se convierte en un [puntero](pointers.md) a un artículo dentro de la colección. Ver [punteros de wearable](entity-types/wearables.md#pointers) y [punteros de emote](entity-types/emotes.md#pointers) para información sobre estos.

### Colecciones de Terceros

Las colecciones de terceros, también conocidas como [linked wearables](../../creator-esp/wearables-and-emotes/wearables/linked-wearables.md), son diferentes de los wearables regulares en que están vinculados a NFTs existentes fuera de Decentraland. Permiten a jugadores mostrar NFTs de su conjunto personal en sus avatares en el mundo.

Sus URNs se ven así:

```
urn:decentraland:<blockchain>:collections-thirdparty:<third-party-id>:<collection-id>
```

Puedes encontrar amplia información sobre estos en la documentación de [linked wearables](../../creator-esp/wearables-and-emotes/wearables/linked-wearables.md) para creadores.

## Descubriendo Colecciones

Los servidores de contenido pueden darte una lista de todas las colecciones conocidas, usando el endpoint [`/lambdas/collections`](https://decentraland.github.io/catalyst-api-specs/#tag/Lambdas/operation/getCollections).

La respuesta será un objeto con una propiedad `collections`, conteniendo un array de URNs y nombres. Por ejemplo:

```json
{
  "collections": [
    {
      "id": "urn:decentraland:amoy:collections-v2:0xff5d4ebc6bc1ff7262cab42d3c693d953f4614d2",
      "name": "Winter clothes collection"
    },
    // ... muchos más
  ]
}
```
