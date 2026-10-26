
Los punteros son cadenas únicas, insensibles a mayúsculas que referencian una [entidad](entities.md) activa. Los servidores de contenido pueden resolver estos punteros para obtener el identificador de la entidad.

Recuerda que tanto las [entidades](entities.md) como sus [archivos](file-system.md) son inmutables en el sistema de contenido de Decentraland, y sus identificadores cambian cuando se suben versiones de reemplazo. Los punteros, por otro lado, son referencias estables que persisten a través de reemplazos. Esto se logra redirigiendo automáticamente el puntero a una nueva entidad cuando el propietario sube un reemplazo.

Múltiples punteros pueden resolver a la misma [entidad](entities.md), como suele ser el caso con [escenas](entity-types/scenes.md).

Como puedes inferir, el uso más común de punteros es obtener el ID para la versión activa (es decir, último reemplazo) de una [entidad](entities.md), para descargarla.

## Tipos de Punteros

Hay 4 tipos de punteros que los servidores de contenido pueden resolver a entidades, cada uno con su propia sintaxis:

- [Punteros de escena](entity-types/scenes.md#pointers) son coordenadas de parcela, como `"0,0"`.
- [Punteros de perfil](entity-types/profiles.md#pointers) son la dirección de Ethereum del propietario.
- [Punteros de wearable](entity-types/wearables.md#pointers) y [punteros de emote](entity-types/emotes.md#pointers) son o URNs de artículo de [colección](collections.md) o URNs off-chain.
- [Punteros de tienda](entity-types/stores.md#pointers) son URNs off-chain con la dirección de Ethereum del propietario.
- [Punteros de outfits](entity-types/outfits.md#pointers) son la dirección de Ethereum del propietario con sufijo `:outfits`.

Puedes encontrar más detalles en sus secciones específicas.

## Resolviendo Punteros

Los servidores de contenido tienen un endpoint que puede resolver punteros en el manifest de su entidad activa, haciendo una solicitud `GET` a:

```
https://<content-base-url>/entities/<entity-type>?pointer=<pointer>
```

{% hint style="info" %}
Por razones históricas, la respuesta de este endpoint es un array conteniendo un elemento.
{% endhint %}

Algunos ejemplos útiles, usando el servidor de contenido de la Foundation:

```bash
# Un puntero de colección on-chain a un wearable:
curl "https://peer.decentraland.org/content/entities/wearables/?pointer=urn:decentraland:matic:collections-v2:0x30517529cb5c16f686c6d0b48faae5d250d43005:0"

# Un puntero de colección off-chain a un activo predeterminado:
curl https://peer.decentraland.org/content/entities/wearables/?pointer=urn:decentraland:off-chain:base-avatars:BaseFemale

# Un puntero de parcela:
curl https://peer.decentraland.org/content/entities/wearables/?pointer=0,0

# Un puntero de perfil:
curl https://peer.decentraland.org/content/entities/profiles/?pointer=0xe2c2b80ca5ad868f4b30fa83cca2bf12cc95b4fe
```

Nota que, si ya conoces el ID de la entidad, puedes [descargar el archivo manifest](file-system.md#downloading) directamente.
