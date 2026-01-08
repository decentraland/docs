---
description: Representaciones Wearables De Tokens De Terceros
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/wearables-and-emotes/wearables/linked-wearables
---

# Linked Wearables

### Acerca de

De acuerdo con la [propuesta inicial del DAO para Linked Wearables](https://governance.decentraland.org/proposal/?id=14e76cc0-2bc7-11ec-ac84-77607720a240) (anteriormente llamados: Third Party Wearables), la [Propuesta Borrador con definiciones finales](https://governance.decentraland.org/proposal/?id=f69c4d40-aaaf-11ec-87a7-6d2a41508231) y la [propuesta de Rediseño de Linked Wearables](https://decentraland.org/governance/proposal/?id=65caf8d1-8601-49a5-ae11-b0b99d7fdd3c), este documento servirá como documentación para cubrir todos los detalles relevantes sobre la función de Linked Wearables.

Este documento está principalmente orientado para representantes de comunidades NFT que quieran dar a sus usuarios la capacidad de representar sus NFTs como wearables cuando paseen por Decentraland.

### ¿Qué son los Linked Wearables?

Los Linked Wearables son representaciones 3D de NFTs que se originan fuera de Decentraland que pueden usarse como wearables en el mundo, pueden equiparse en el avatar y se encuentran en el backpack. No son [wearables regulares](../wearables-and-emotes/wearables/wearables-overview.md). Se ven igual, y siguen las [directrices](../wearables-and-emotes/wearables/creating-wearables.md) de wearables regulares pero llevan un significado completamente diferente.

Los Linked Wearables no existen dentro de colecciones de wearables tradicionales (pertenecen a un tipo especial de colección), no tienen rarity, y no pueden venderse en mercados [primarios](https://market.decentraland.org/browse?assetType=item\&section=wearables) o [secundarios](https://market.decentraland.org/browse?assetType=nft\&section=wearables\&vendor=decentraland\&page=1\&sortBy=recently_listed\&onlyOnSale=true\&viewAsGuest=false\&onlySmart=false). Son solo **representaciones en el mundo vinculadas a NFTs externos.**

> Imagina que tienes un proyecto NFT llamado 'Cryptojackets' donde cada NFT es un tipo diferente de chaqueta 2D y quieres que tus usuarios tengan una representación 3D de su chaqueta en su backpack de Decentraland. Los Linked Wearables te permiten enviar representaciones 3D de tus NFTs como wearables en Decentraland. No hay necesidad de acuñar un nuevo token, ¡y tu proyecto NFT actual tendrá una nueva función lista para usar!

Todos los Linked Wearables están definidos dentro de una **Linked Wearable Collection**. Veremos cómo crear una más adelante en el artículo.

### ¿Cómo representan los Linked Wearables a los NFTs?

Los wearables están vinculados a tus NFTs creando una Linked Wearable Collection en el sitio [Builder](https://decentraland.org/builder) y estableciendo cómo se representarán tus NFTs en el momento de crear los wearables.

Soportamos 4 mecanismos para vincular tus wearables a NFTs. Todos estos mecanismos usan el token id de los NFTs para emparejarlos.

La siguiente tabla muestra los mecanismos mencionados:

| Match         | Descripción                                                                                                                                                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All NFTs      | Un usuario que posea cualquiera de los NFTs de la colección poseerá el wearable                                                                                                                                                                |
| Single NFT    | Un usuario que posea un NFT especificado por TOKEN ID poseerá el wearable. _ej. 123456. El usuario poseerá el wearable si posee el NFT con TOKEN ID: 123456_                                                                                   |
| Multiple NFTs | Un usuario que posea uno de muchos NFTs especificados por TOKEN IDs, descritos separados por una coma poseerá el wearable. _ej. 123456, 123457, 123458. El usuario poseerá el wearable si posee el NFT con TOKEN ID: 123456 o 123457 o 123458_ |
| Range of NFTs | Un usuario que posea uno de muchos NFTs especificados en el rango de TOKEN IDs poseerá el wearable. _ej. \[1, 1000]. El usuario poseerá el wearable si posee el NFT con TOKEN ID 1 o 2 o 3 o 4 o 5 ... o 100_                                  |

### Tipos de Linked Wearables Collections

Usualmente hay dos tipos de colecciones NFT:

* **Hand crafted:** donde cada asset de token está hecho a medida, o hecho a mano, sin ningún proceso de automatización.
* **Programmatic:** donde cada asset de token no fue creado individualmente a mano, sino generado automáticamente con código, muchas veces a partir de traits que fueron previamente diseñados y modelados. Por ejemplo: [CryptoPunks](https://opensea.io/collection/cryptopunks) y [BAYC](https://opensea.io/collection/boredapeyachtclub) son ejemplos de colecciones NFT pfp 2D que fueron creadas programáticamente.

Seguimos el mismo principio en Decentraland con las Linked Wearables Collections también, puede haber Standard Linked Wearable Collections para las colecciones hechas a mano y Programmatic Linked Wearable Collections para las generadas automáticamente. Ambas colecciones difieren en los costos de publicación de las tarifas de publicación que tienen los wearables. Consulta la [sección Costs](linked-wearables.md#costs) para más información sobre las tarifas de publicación.

## Creando Linked Wearables

### Creando una Linked Wearable Collection

Crear una Linked Wearable collection es el primer paso para crear nuestros Linked Wearables.

Los Linked Wearables están agrupados en colecciones que pueden ser creadas, editadas y eliminadas por sus propietarios. Cada colección puede contener un número arbitrario de Linked Wearables. Cada colección estará vinculada a una colección NFT, por esa razón, **se requiere un contrato NFT (compatible con ERC721 o ERC1155) para crear una Linked Wearable Collection.**

Para crear un nuevo Linked Wearable sigue estos pasos:

1. En la sección de Colecciones, haz clic en el botón **Create Collection**.
2. Selecciona la opción Linked Wearable Collection haciendo clic en el botón **Create Collection** bajo la sección Linked Collections.
3. Elige un nombre para la colección y vincula la colección a tu colección NFT estableciendo su dirección de contrato y la red en la que está. **El contrato será validado para asegurarse de que cumple con los estándares de contratos NFT.**
4. Haz clic en el botón **Create** para crear la colección.

### Agregando Wearables a la Linked Wearables Collection - Uno por Uno

Es posible, como ya sucede con los wearables estándar, subir tus modelos 3D de wearables uno por uno.

Para hacer eso, sigue estos pasos:

1. Haz clic en el botón **New items**.
2. Selecciona la opción **Singe items**.
3. Sigue los pasos para subir y configurar tu wearable como se describe en las [directrices para crear wearables](../wearables-and-emotes/wearables/creating-wearables.md) y configura cómo se vinculará a tus NFTs. Consulta la sección "[How do Linked Wearables represent NFTs?](linked-wearables.md#how-do-linked-wearables-represent-nfts)" para más información sobre cómo configurarlo.

### Agregando Wearables a la Linked Wearables Collection - En Lote

Como las Linked Wearable collections pueden contener un gran número de ítems, es posible subir los modelos 3D y la información de los wearables en lote. Este proceso implica crear un archivo zip con todos los assets que un ítem necesita para cada uno de los ítems. **Subir wearables en lote solo se recomienda para colecciones programáticas**.

#### Construyendo el ZIP de Wearable

Cada ítem requerirá que se construya un archivo ZIP que incluya los siguientes assets:

* Los archivos de modelo 3D **requeridos** del wearable (GLB, GLTFs, archivos de textura, etc).
* Un archivo `wearable.json` **requerido** que contenga la información del wearable.
* Un archivo `thumbnail.png` **opcional** que contenga la miniatura del wearable que se verá en el Builder y el mundo. Si no se proporciona, se generará una usando el modelo 3D.

Los modelos 3D y el `thumbnail.png` opcional siguen la [sección Custom Thumbnails](../wearables-and-emotes/manage-collections/uploading-wearables.md#custom-thumbnails) en el artículo Uploading Wearables sobre cómo crear una miniatura personalizada.

El `wearable.json` que acompaña el contenido de los wearables tiene el siguiente formato (escrito como TypeScript):

```typescript
type WearableConfiguration = {
  /** The URN of the wearable */
  id?: string
  /** Name of the wearable */
  name: string
  /** Description of the wearable */
  description?: string
  data: {
    /** Wearables to replace when equipping the wearable */
    replaces: WearableCategory[]
    /** Wearables to hide when equipping the wearable */
    hides: WearableCategory[]
    /** Tags to identify the wearable */
    tags: string[]
    /** Representations of the wearable */
    representations: WearableRepresentation[]
    /** Category of the wearable */
    category: WearableCategory
  },
  /** The mapping definition of the wearable with NFTs */
  mapping: Mapping
}

type WearableRepresentation = {
  /** Body shape of the representation */
  bodyShapes: BodyShape[];
  /** File path to the main file of the representation (GLB, GLTF, etc) */
  mainFile: string;
  /** A list of the file paths of the files that belong to the representation */
  contents: string[];
  /** Wearables to hide when equipping this representation */
  overrideHides: WearableCategory[];
  /** Wearables to replace when equipping this representation */
  overrideReplaces: WearableCategory[];
}

enum WearableCategory = {
  EYEBROWS = 'eyebrows',
  EYES = 'eyes',
  FACIAL_HAIR = 'facial_hair',
  HAIR = 'hair',
  HEAD = 'head',
  BODY_SHAPE = 'body_shape',
  MOUTH = 'mouth',
  UPPER_BODY = 'upper_body',
  LOWER_BODY = 'lower_body',
  FEET = 'feet',
  EARRING = 'earring',
  EYEWEAR = 'eyewear',
  HAT = 'hat',
  HELMET = 'helmet',
  MASK = 'mask',
  TIARA = 'tiara',
  TOP_HEAD = 'top_head',
  SKIN = 'skin'
}

enum WearableBodyShape {
  MALE = 'urn:decentraland:off-chain:base-avatars:BaseMale',
  FEMALE = 'urn:decentraland:off-chain:base-avatars:BaseFemale'
}

type Mapping = SingleMapping | AnyMapping | RangeMapping | MultipleMapping

enum MappingType {
  SINGLE = 'single',
  ANY = 'any',
  MULTIPLE = 'multiple',
  RANGE = 'range'
}

type SingleMapping = {
  type: MappingType.SINGLE
  id: string
}

type AnyMapping = {
  type: MappingType.ANY
}

type RangeMapping = {
  type: MappingType.RANGE
  from: string
  to: string
}

type MultipleMapping = {
  type: MappingType.MULTIPLE
  ids: string[]
}
```

El siguiente es un ejemplo de un archivo `wearable.json` que contiene un modelo para cada forma de cuerpo:

```json
{
  "id": "urn:decentraland:matic:collections-thirdparty:my-third-party:my-collection:1",
  "name": "Special hat",
  "description": "A description of the wearable",
  "data": {
    "replaces": [],
    "hides": ["hair"],
    "tags": ["special", "new", "hat"],
    "representations": [
      {
        "bodyShapes": ["urn:decentraland:off-chain:base-avatars:BaseMale"],
        "mainFile": "aMaleModelFile.glb",
        "contents": ["aMaleModelFile.glb", "aTextureFile.png"],
        "overrideHides": [],
        "overrideReplaces": []
      },
      {
        "bodyShapes": ["urn:decentraland:off-chain:base-avatars:BaseFemale"],
        "mainFile": "aFemaleModelFile.glb",
        "contents": ["aFemaleModelFile.glb", "anotherTextureFile.png"],
        "overrideHides": [],
        "overrideReplaces": []
      }
    ],
    "category": "hat",
    "mapping": {
      "type": "single",
      "id": "123"
    }
  }
}
```

Este archivo se comprimirá junto con `aMaleModelFile.glb`, `aTextureFile.png`, `aFemaleModelFile.glb` y `anotherTextureFile.png`.

Para agregar una miniatura personalizada al wearable, puedes agregar un archivo `thumbnail.png`.

Algunas cosas a considerar sobre el archivo `wearable.json`:

* Toda la información sobre las categorías de wearables y cuál elegir se puede encontrar en las [directrices para crear wearables](../wearables-and-emotes/wearables/creating-wearables.md).
* El array de representations contendrá la información sobre cómo se verá cada forma de cuerpo. Cada wearable DEBE contener al menos una representation (puede tener una o las dos), es decir, tomando en consideración las formas de cuerpo que actualmente tenemos, ya sea `urn:decentraland:off-chain:base-avatars:BaseMale` o `urn:decentraland:off-chain:base-avatars:BaseFemale`. Cada representation describirá qué modelos se usarán para cada forma de cuerpo.
* El objeto mapping debe configurarse como uno de los mecanismos disponibles para vincular tu NFT a tu wearable, siguiendo la sección "[How do Linked Wearables represent NFTs?](linked-wearables.md#how-do-linked-wearables-represent-nfts)".

**Estableciendo un ID o URN personalizado para los ítems**

El campo `id` es opcional y puede usarse para crear un wearable con un ID específico para ser actualizado en el futuro en Lote (lo cual se explica más adelante en la sección [Editing wearables in bulk](linked-wearables.md#editing-wearables-in-bulk)).

En caso de que se use el campo `id`, debe contener el ID completo del wearable. El ID (o URN) del wearable se escribe como `urn:decentraland:matic:collections-thirdparty:third-party-id:collection-id:item-id`. Donde, `urn:decentraland:matic:collections-thirdparty:third-party-id:collection-id` puede recuperarse de la página de la colección y el `item-id` es el identificador personalizado del ítem que te gustaría usar.

Los IDs o URNs siguen un formato específico, aceptan:

* Caracteres en minúsculas, de la `a` a la `z`.
* Todos los números.
* No pueden contener otro tipo de caracteres o espacios en blanco. Sugerimos reemplazar espacios en blanco con `-`

Puedes recuperar el ID (o URN) desde la página de la colección siguiendo los siguientes pasos:

1. Ir a la vista de la colección de la que quieres copiar el URN y hacer clic en la opción Edit URN en el menú de opciones:
2. Copiar el identificador que está debajo del campo de texto:

Por ejemplo, si el URN o ID recuperado de la UI para la colección es `urn:decentraland:matic:collections-thirdparty:my-third-party:my-collection` y estás identificando tus wearables numéricamente, el URN para el ejemplo sería `urn:decentraland:matic:collections-thirdparty:my-third-party:my-collection:1`, siendo `1` el número del wearable.

#### El proceso de carga

Una vez que todos los archivos estén listos, para subir los wearables en lote, sigue estos pasos:

1. Haz clic en el botón **New items**.
2. Selecciona la opción **Multiple items**.
3. Haz clic en el enlace **Browse yor computer** para abrir tu administrador de archivos y seleccionar todos los zips que contienen tus wearables.
4. Revisa si todos los archivos son correctos o si necesitan ser corregidos. En este caso, el modelo del wearable no está configurado o el archivo `wearable.json` tiene una representation configurada incorrectamente.
5. Corrige cualquier error haciendo clic en el botón **Add more** y volviendo a subir los archivos fallidos con el mismo nombre o descartando los errores usando el ícono de papelera en la sección superior derecha del modal.
6. Sube todos los wearables haciendo clic en **Upload items**.
7. ¡Ten paciencia, esto podría tomar un tiempo!
8. ¡Éxito! Tus ítems ahora están disponibles en tu colección.
9. Selecciona si tu colección es programática o estándar. Consulta la sección [NFT Collections & Linked Wearables Collections](linked-wearables.md#nft-collections--linked-wearables-collections) para establecer correctamente qué tipo de colección estás construyendo.

#### Errores comunes al subir ítems por lotes

* El campo `id` está establecido a un valor que ya está siendo usado por otro wearable.
* El campo `id` está establecido a un valor que no es un ID válido. Por ejemplo, el third party id o collection id pertenecen a otro third party o collection.
* No hay archivo `wearable.json` en el zip.
* El archivo ZIP no tiene en su directorio raíz el archivo `wearable.json`.
* El `wearable.json` tiene un formato o valores incorrectos.
* El archivo es mayor de 3MBs. Los Linked Wearables tienen la misma limitación que los wearables regulares en términos de tamaño como los estándar.
* La imagen miniatura personalizada opcional no es un archivo png.

### Viendo los wearables en Decentraland

Los Linked Wearables pueden verse en el mundo para revisar cómo funcionará el modelo una vez publicado y aprobado.

Para poder ver un wearable en el mundo, sigue estos pasos:

1. Haz clic en el menú de tres puntos (tres puntos horizontales) a la derecha del ítem que quieres ver en el mundo. Aparecerá un desplegable. Selecciona **See in Decentraland**.
2. El Mundo de Decentraland se abrirá. Navega a tu backpack para ver el wearable.

{% hint style="warning" %}
**⚠️ Aviso**: La vista previa en el mundo funciona con la Versión Web Desactualizada del Cliente de Decentraland. No es posible probarlos aún en el Decentraland Desktop Client 2.0.
{% endhint %}

## Editando Linked Wearables

### Editando el nombre de la colección

Una colección puede ser renombrada por su creador **solo si la colección no tiene wearables publicados**.

Para editar el nombre de una Linked Wearable Collection sigue estos pasos:

1. Haz clic en el nombre de la colección.
2. Elige un nuevo nombre para la colección y haz clic en el botón guardar.

### Eliminando la colección

Una colección puede ser eliminada por su propietario **solo si la colección no tiene wearables publicados**.

Para eliminar una Linked Wearable Collection sigue estos pasos:

1. Haz clic en el menú de tres puntos (tres puntos horizontales) en el extremo derecho del conjunto de botones. Aparecerá un desplegable. Selecciona **Delete**.
2. Aparecerá un modal de Confirmación, si deseas continuar, haz clic en **Ok**, de lo contrario haz clic en **Cancel**.

### Editando un solo wearable

#### Editando propiedades del wearable

Para editar un solo wearable, sigue estos pasos:

1. Haz clic en el menú de tres puntos (tres puntos horizontales) a la derecha del ítem que quieres ver en el mundo. Aparecerá un desplegable. Selecciona **Open in editor**.
2. Edita el wearable como se editan los wearables estándar. Sigue la sección **Editing items** en las [directrices para crear wearables](../wearables-and-emotes/wearables/creating-wearables.md) sobre cómo crear una miniatura personalizada.

#### Editando el enlace del wearable

El enlace de los wearables con la colección NFT es una de las propiedades más importantes de un Linked Wearable. Para editar cómo están vinculados a los NFTs, puedes cambiar rápidamente el valor del enlace desde la vista de la colección, sin necesidad de navegar a otra página.

Consulta la sección "[How do Linked Wearables represent NFTs?](linked-wearables.md#how-do-linked-wearables-represent-nfts)" para más información sobre cómo vincular tus wearables.

### Editando wearables en lote

Siguiendo la misma idea vista previamente en la sección [Creating wearables in bulk](linked-wearables.md#creating-linked-wearables-in-bulk), los third party managers pueden hacer cambios a los wearables en lote.

Para hacer cambios en lote a wearables, es necesario crear un archivo ZIP para cada uno de los wearables que serán cambiados.

Estos archivos ZIP deben crearse siguiendo el formato descrito en [Creating wearables in bulk](linked-wearables.md#creating-linked-wearables-in-bulk) con una excepción, en el archivo `wearable.json`, la propiedad `id` **DEBE** establecerse al `id` o URN del wearable que será cambiado. Esto es obligatorio ya que es la única forma de identificar el wearable a cambiar. Si creaste tus wearables en lote proporcionando un id en el archivo `wearable.json`, puedes reutilizar sus archivos `wearable.json` para actualizarlos.

Tomando en consideración el ejemplo en la sección [Creating wearables in bulk](linked-wearables.md#creating-linked-wearables-in-bulk), si quisiéramos cambiar algunas de las propiedades de un wearable, por ejemplo, el nombre donde olvidamos agregar un número, deberíamos incluir un archivo `wearable.json` en el zip como el siguiente ejemplo:

```json
{
  "id": "urn:decentraland:matic:collections-thirdparty:my-third-party:my-collection:1",
  "name": "A hat 1",
  "description": "A description of the wearable",
  "data": {
    "replaces": [],
    "hides": ["hair"],
    "tags": ["special", "new", "hat"],
    "representations": [
      {
        "bodyShapes": ["urn:decentraland:off-chain:base-avatars:BaseMale"],
        "mainFile": "aMaleModelFile.glb",
        "contents": ["aMaleModelFile.glb", "aTextureFile.png"],
        "overrideHides": [],
        "overrideReplaces": []
      },
      {
        "bodyShapes": ["urn:decentraland:off-chain:base-avatars:BaseFemale"],
        "mainFile": "aFemaleModelFile.glb",
        "contents": ["aFemaleModelFile.glb", "anotherTextureFile.png"],
        "overrideHides": [],
        "overrideReplaces": []
      }
    ],
    "category": "hat"
  },
  "mapping": {
    "type": "single",
    "id": "123"
  }
}
```

Donde el campo `id` está establecido al `id` o URN del wearable que será cambiado y el campo `name` está establecido al nuevo nombre del wearable.

Una vez que los archivos ZIP estén listos, sigue estos pasos para editar los ítems en lote:

1. Haz clic en el menú de tres puntos (tres puntos horizontales) en el extremo derecho del conjunto de botones. Aparecerá un desplegable. Selecciona **Edit in bulk**.
2. Aparecerá un modal similar al de **Uploading models in bulk**. Haz clic en el enlace **Browse your computer** para abrir tu administrador de archivos.
3. Selecciona todos los archivos ZIP de los ítems que serán editados.
4. Revisa si todos los archivos son correctos o si necesitan ser corregidos. En este caso, el modelo del wearable no está configurado o el archivo `wearable.json` tiene una representation configurada incorrectamente.
5. Corrige cualquier error haciendo clic en el botón **Add more** y volviendo a subir los archivos fallidos con el mismo nombre o descartando los errores usando el ícono de papelera en la sección superior derecha del modal.
6. Sube todos los wearables haciendo clic en **Upload items**.
7. ¡Ten paciencia, esto podría tomar un tiempo!
8. ¡Éxito! Tus ítems ahora están disponibles en tu colección. Consulta el post del foro para cualquier actualización del curador.

## Publicando tus Linked Wearables

Tus Linked Wearables necesitan pasar por un proceso de publicación y curación como lo hacen los wearables regulares. Aunque el proceso de publicación y curación no es el mismo que el de los wearables regulares, mantiene los mismos pasos, todos los ítems deben primero ser publicados para luego ser curados por un curador asignado.

Las siguientes secciones te mostrarán cómo publicar tus Linked Wearables para ser curados.

### Costos

Crear Linked Wearables tiene un costo dependiendo del tipo de Linked Wearable Collection que elegiste construir:

1. **Standard**: cada wearable publicado cuesta lo mismo que un wearable regular: USD 100 pagadero en MANA.
2. **Programmatic**: una tarifa fija, pagada una vez por todos los wearables que publicarás. Esta tarifa equivale a publicar 20 wearables regulares: 2000 USD pagaderos en MANA.

Para más información sobre el tipo de colección que estás creando, consulta la sección [NFT Collections & Linked Wearables Collections](linked-wearables.md#nft-collections--linked-wearables-collections).

### Publicando wearables para revisión

Una vez que tus wearables estén listos, deben publicarse para curación. Tus wearables se publican en grupos de ítems, puedes elegir qué ítems están listos para ser curados seleccionándolos y haciendo clic en el botón `Publish`. Después de publicar ítems, la publicación se bloqueará hasta que los que ya están publicados sean curados.

Para publicar tus wearables, necesitas:

1. Selecciona los ítems a publicar haciendo clic en la casilla junto a ellos. Haz clic en el botón **Publish** cuando estés listo con tu selección.
2. Confirma el nombre de tu colección. Una vez que publiques tus ítems, cambiar el nombre de la colección no es posible, así que asegúrate de verificarlo minuciosamente.
3. Dale un vistazo a los ítems que estás publicando. Haz clic en el botón **Confirm items** cuando estés listo.
4. Firma la confirmación de publicación de tus ítems en tu wallet.
5. Lee y verifica los Términos y Condiciones.
6. Verifica tus tarifas de publicación. Las tarifas requeridas para publicar los wearables se describen en la [sección Costs](linked-wearables.md#costs).
7. Si es tu primera vez publicando Linked Wearables, necesitarás autorizar al smart contract de Linked Wearables para operar MANA en tu nombre. Este paso es necesario para deducir el MANA usado para pagar las tarifas de publicación de tu wallet.
8. Paga la tarifa de publicación y completa la publicación realizando la transacción. Dependiendo de la congestión de la red, esto podría tomar un tiempo.
9. ¡Éxito! Has publicado tus ítems. Tus ítems pasarán por el proceso de curación como lo hacen las colecciones regulares. Puedes comunicarte con el curador a través del post del foro.

### Enviando cambios para revisión

Los wearables publicados y aprobados que son editados necesitan pasar por el proceso de curación nuevamente. No te preocupes, no se aplicarán tarifas a wearables ya publicados.

Para enviar cambios para que sean curados, necesitas:

1. Selecciona los ítems con cambios haciendo clic en la casilla junto a ellos. Haz clic en el botón **Push changes** cuando estés listo con tu selección.
2. Procede con el proceso de envío de cambios. Como dice el modal, estos cambios necesitarán pasar por la fase de curación una vez más.
3. Lee y verifica los Términos y Condiciones. Al aceptarlos, los ítems estarán listos para ser curados nuevamente.

### Curación

Como con los wearables regulares, tus modelos 3D necesitarán obtener la aprobación del Comité de Curadores. No estás excluido de esta regla ya que la estética y gameplay de Decentraland aún necesitan ser salvaguardados.

El proceso de curación diferirá según el proceso usado para generar los wearables. Las Linked Wearables collections admiten wearables hechos a mano y generados programáticamente.

#### Wearables hechos a mano

Para modelos 3D que fueron hechos individualmente sin ningún proceso automatizado (el método usual para la mayoría de los wearables regulares) el Curador necesitará revisar todos los ítems en la colección individualmente para asegurarse de que todos cumplan con las [Wearable Guidelines](../wearables-and-emotes/wearables/creating-wearables.md).

#### Colecciones programáticas

Para colecciones programáticas, no todos los ítems tienen que ser curados individualmente. El número de ítems a curar en cada colección depende del tamaño de la colección, esto fue definido por el DAO en [esta propuesta](https://governance.decentraland.org/proposal/?id=f69c4d40-aaaf-11ec-87a7-6d2a41508231).
