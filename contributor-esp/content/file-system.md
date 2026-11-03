Subyacente a las diferentes APIs de contenido en el protocolo de Decentraland hay una implementación de un sistema de archivos distribuido. Cada servidor de contenido mantiene una copia de todo el almacenamiento, y sincroniza las actualizaciones que recibe con otras instancias.

Los archivos subidos al sistema son **inmutables**. Una vez desplegados, ni su identificador
ni su contenido cambian. Solo pueden actualizarse en el sentido de que se sube una nueva versión y
las aplicaciones eligen usarla, mientras que la antigua puede descartarse.

Puedes experimentar con archivos en la sección [práctica](practice).

## Identificadores de archivo {#identifiers}

El sistema de archivos de Decentraland está organizado en un índice plano (es decir, no hay jerarquía
natural de directorios), donde cada archivo se identifica por una cadena única.

Las cadenas de identificador son codificaciones [base32](https://en.wikipedia.org/wiki/Base32) prefijadas del hash SHA-256 del contenido del archivo, usando el algoritmo [IPFS CID v1](https://docs.ipfs.tech/concepts/content-addressing/). Se ven así:

```
bafybeicgclohdfaccu2sqqkzrzuenjxzcry3m5vcb4mpxgucjl3oheq5tq
```

El prefijo en los primeros bytes indica la codificación, versión y tipo de hash del identificador mismo.

{% hint style="info" %}
Por razones históricas, algunas APIs llaman al identificador de archivo _hash_ en lugar de _id_, pero se refieren a lo mismo. También puedes encontrar identificadores legacy en contenido antiguo que se ven un poco diferentes.
{% endhint %}

En la práctica, estos detalles no son necesarios para descubrir y descargar contenido. La mayoría de los clientes del protocolo pueden tratar los identificadores como cadenas opacas sin perder capacidades.

Nota que los identificadores CIDv1 modernos son compatibles con IPFS, produciendo el mismo CID para el mismo archivo, por lo que IPFS puede usarse como proveedor de archivos.

## Propiedad y Persistencia

Excepto por [instantáneas](snapshots.md), los archivos almacenados en la red están asociados a una [entidad](entities.md) propiedad de una cuenta de Ethereum. El propietario es el único autorizado para actualizar la entidad y archivos relacionados.

Los servidores de contenido están obligados por protocolo a siempre almacenar la última versión de una entidad y sus archivos, pero pueden elegir si retener versiones antiguas según su configuración individual.

## Descargando Archivos {#downloading}

El endpoint [`/contents/<fileId>`](https://decentraland.github.io/catalyst-api-specs/#tag/Content-Server/operation/getContentFile) del servidor de contenido puede usarse para descargar cualquier archivo. Sus identificadores se encuentran en el manifest de la [entidad](entities.md) padre.

## Subiendo Archivos

Los archivos no se suben independientemente. En su lugar, se empaquetan dentro de entidades, y se suben durante el despliegue de la entidad al servidor de contenido.

Ver la [documentación del creador de contenido](/creator) para más detalles.
