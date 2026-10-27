
Cada pieza individual de contenido en el mundo (como una escena o un artículo wearable) se llama una _entidad_.

Las entidades son paquetes inmutables de [archivos](file-system.md) con un identificador de cadena único, derivado determinísticamente de los datos contenidos, que puede usarse para descubrir y descargar los archivos relacionados del servidor de contenido.

El archivo principal de una entidad es el _manifest_, un documento JSON describiendo las propiedades generales de la entidad, así como atributos especiales para cada [tipo](#types). El identificador para una entidad es en realidad el [identificador de archivo](file-system.md#identifiers) de este manifest.

Como son inmutables, las entidades no pueden actualizarse en el sentido tradicional. En su lugar, son reemplazadas por nuevas entidades descubribles usando el mismo [puntero](pointers.md) estable. La versión más nueva de una entidad se dice que está _activa_.

Cada entidad está firmada por un propietario (quien está asociado a una cuenta de Ethereum). El propietario puede más tarde usar las mismas claves de firma para subir una nueva versión de la entidad e indicar que reemplaza a la antigua. Los servidores de contenido validan estas firmas antes de aceptar nuevas entidades, ya sea que vengan directamente de un cliente o fueron retransmitidas por otro servidor.

Puedes mirar entidades realmente desplegadas en la sección [práctica](practice/README.md).

## Tipos de Entidad {#types}

Hay siete tipos de entidades:

- [**Escenas**](entity-types/scenes.md): espacios virtuales en el mundo con sus propios objetos y comportamiento.
- [**Perfiles**](entity-types/profiles.md): información sobre un jugador específico, como su nombre y avatar.
- [**Wearables**](entity-types/wearables.md): ropa y artículos que los jugadores pueden agregar a sus avatares.
- [**Emotes**](entity-types/emotes.md): animaciones que el avatar de un jugador puede realizar.
- [**Tiendas**](entity-types/stores.md): sitios de marketplace para wearables y emotes que los jugadores pueden comprar.
- [**Outfits**](entity-types/outfits.md): outfits guardados para un jugador específico.

Todos los tipos siguen los mismos procedimientos para creación, identificación, propiedad y alojamiento.

## Propiedades Comunes {#properties}

Cada entidad tiene ciertas propiedades comunes en su manifest, aplicables a todos los tipos. Estos campos de nivel superior siempre estarán presentes:

| Campo | Valor |
| ----- | --- |
| `type` | Uno de `scene`, `profile`, `wearable`, `emote`, `store` o `outfits`.
| `pointers` | Un array de [punteros](pointers.md) asociados a esta entidad.
| `timestamp` | La marca de tiempo Unix UTC cuando esta entidad fue subida.
| `content` | Un array de referencias a [archivos](file-system.md) adicionales en el paquete de la entidad.
| `metadata` | Un objeto con información específica a este tipo de entidad.

La estructura y valores del campo `metadata` para cada tipo se detallan en sus páginas específicas. El array `pointers` también tiene contenidos diferentes dependiendo del tipo.

{% hint style="info" %}
Los manifests de entidad antiguos pueden contener el campo `version`, obsoleto en [ADR-45](https://adr.decentraland.org/adr/ADR-45). Puedes ignorarlo de manera segura, ya que el campo `timestamp` ahora se usa para versionado.
{% endhint %}

Este es un manifest JSON típico describiendo una entidad:

```json
{
  "type": "wearable",
  "pointers": ["urn:decentraland:matic:collections-v2:0xbdf21eaf54ebf4a6cadc2dcb371df7afce98bc1d:0"],
  "timestamp": 1628181913506,
  "content": [
    // ...referencias de archivo, ver abajo
  ],
  "metadata": {
    // ...campos específicos para este tipo de entidad, ver la página relevante
  }
}
```

Puedes encontrar los schemas para estas estructuras JSON, junto con otros objetos en el protocolo de Decentraland, en el repositorio [Common Schemas](https://github.com/decentraland/common-schemas).


{% hint style="info" %}
Al mirar manifests de entidad, puedes encontrar campos no documentados. Esto es porque el schema de entidad permite propiedades personalizadas adicionales, establecidas libremente por el propietario.
{% endhint %}

## Archivos {#files}

Como se mencionó anteriormente, todas las entidades tienen al menos un archivo asociado: el manifest JSON describiendo la entidad misma. El identificador de entidad es en realidad el [identificador de archivo](file-system.md#identifiers) de este archivo especial.

El campo `content` dentro de cada manifest es un array de referencias a archivos adicionales. Estos son típicamente activos, como modelos 3D y animaciones, o scripts para escenas.

Todos los archivos se almacenan en el [sistema de archivos distribuido](file-system.md) de Decentraland, y cada elemento en el array tiene dos propiedades:

| Campo | Valor |
| --- | --- |
| `file` | El nombre interno usado por archivos en esta entidad para referenciarse entre sí.
| `hash` | El [identificador global para este archivo](file-system.md#identifiers), único en todo el contenido.

Así es como típicamente se ve dentro del campo `content`:

```json
[
  {
    "file": "thumbnail.png",
    "hash": "bafkreiglecvpnqibvf6pltcnid5nhbx3caj77lu4ia4xitpmp3lrcouuhm",
  },
  {
    "file": "model.glb",
    "hash": "bafkreic2i3awiu7srhatf3k47l3c5lmadisznjigppor2a35saosjfbo25",
  },
  // ...más archivos
]
```

{% hint style="info" %}
El valor del campo `file` siempre está en minúsculas, para prevenir problemas al construir entidades en diferentes sistemas operativos, donde el uso de mayúsculas en nombres de archivo puede ser importante.
{% endhint %}

El tiempo de vida de un archivo está vinculado a la entidad que lo contiene. Para entidades activas (es decir, aún no reemplazadas por su propietario), los servidores de contenido están obligados por protocolo a preservar todos los archivos asociados. Si la entidad es eliminada, los archivos pueden mantenerse o descartarse a discreción del servidor.

## Propiedad y Autenticación {#ownership}

Para probar propiedad y autorizar acciones en torno a entidades, se usa el mecanismo [cadena de autenticación](../authentication/authchain.md).

El repositorio [`decentraland-crypto`](https://github.com/decentraland/decentraland-crypto) contiene la implementación de todos los procedimientos criptográficos.


## Descubriendo y Descargando Entidades

Los servidores de contenido pueden usarse para localizar entidades usando [punteros](pointers.md), y para descargar sus manifests y cualquier archivo adicional.

- Para resolver un puntero en un ID de entidad, puedes usar el endpoint [`/entities/active`](https://decentraland.github.io/catalyst-api-specs/#tag/Content-Server/operation/getListOfEntities).

- Usando el ID de entidad, puedes descargar el manifest con el endpoint [`/contents/<id>`](https://decentraland.github.io/catalyst-api-specs/#tag/Content-Server/operation/getContentFile).

- Para obtener todas las entidades activas de un cierto tipo, comienza descargando una [instantánea](snapshots.md).

Consulta la sección [práctica](practice/README.md) para ejemplos y guías.
