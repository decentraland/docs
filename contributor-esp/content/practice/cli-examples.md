Esta práctica demuestra cómo jugar con la API de contenido en una terminal. Usaremos la instancia de la Foundation de Decentraland en `peer.decentraland.org`, y todo lo que necesitas es la herramienta de línea de comandos `curl`.

{% hint style="info" %}
Puedes usar [`httpie`](https://github.com/httpie/httpie) o formatear respuestas con [`jq`](https://github.com/stedolan/jq) para obtener JSONs más legibles con cada solicitud. En esta guía, mostraremos documentos formateados para mayor claridad.
{% endhint %}

Esto es lo que haremos:

1. Consultar el estado del servidor de contenido.
2. Localizar y descargar una [instantánea](../snapshots.md) diaria con una lista de entidades.
3. Obtener el manifest para una entidad.
4. Descargar uno de los archivos de la entidad.

Comencemos consultando el estado del servidor usando `/about`:

```bash
curl "https://peer.decentraland.org/about"
```

```js
{
  "healthy": true,
  "content": {
    "healthy": true,
    "version": "6.5.0",
  },
  // ... más información del servidor (banderas de características, versiones, rutas, etc.)
}
```

Parece que el servidor está funcionando normalmente (`"healthy": true`), y nos está dando información sobre la versión que implementa para cada conjunto de características, además de algunas opciones de configuración de la instancia.

Estamos interesados en descargar algún contenido, así que exploremos las [instantáneas](../snapshots.md) disponibles para obtener algunos identificadores a través de `/content/snapshots`.

```bash
curl "https://peer.decentraland.org/content/snapshots"
```
```js
[
  {
    "hash": "bafybeia6qoum64psaooiqo3f45i6hykfwx723uc236waub3gng2naof224",
    "timeRange": {
      "initTimestamp": 1689120000000,
      "endTimestamp": 1689206400000
    },
    "replacedSnapshotHashes": [],
    "numberOfEntities": 981,
    "generationTimestamp": 1689219353866
  },
  // ...más archivos de instantánea
]
```

Cada elemento en el array describe una [instantánea](../snapshots.md). Tomemos un `hash` y descarguemos el archivo del endpoint `/content/contents`.

```bash
curl "https://peer.decentraland.org/content/contents/bafybeia6qoum64psaooiqo3f45i6hykfwx723uc236waub3gng2naof224" > snapshot
```

{% hint style="info" %}
Puedes experimentar con instantáneas más grandes, como en el [ejemplo avanzado de python](https://github.com/decentraland/documentation/blob/main/content/contributor/content/practice/snapshots.py). Para probar esto interactivamente, probablemente quieras una de las más pequeñas.
{% endhint %}

Podemos verificar que descargamos el archivo correcto en un formato que conocemos, mirando la primera línea:

```bash
head -n1 snapshot
```
```
### Decentraland json snapshot
```

¡Genial! Ahora tenemos un resumen local de todas las entidades que fueron capturadas en esa instantánea. Tomemos la primera listada (la segunda línea en el archivo), un `profile`:

```bash
tail -n+2 snapshot | head -n1 
```
```js
{
  "entityId": "bafkreif7hjremkxlvixyxoxnoo7bdcnf7qqp245sjb2pag2nk3n6o6yc4c",
  "entityType": "profile",
  "pointers": [
    "0x271cdb3b1c792c336c4b2bdc52c4f415d0046b92"
  ],
  "authChain": [
    // Ver https://docs.decentraland.org/contributor/auth/authchain/
  ],
  "entityTimestamp": 1689120135624
}
```

{% hint style="info" %}
Como las instantáneas expiran y las entidades son reemplazadas, los identificadores en este artículo no funcionarán. Sigue en tu línea de comandos para obtener IDs de archivo reales y activos.
{% endhint %}

Esta es información que podríamos guardar. Usaremos el `entityId` para descargar el manifest JSON de la entidad, pero persistir el [puntero](../pointers.md) listado es una buena idea si queremos localizar esta entidad y cualquier versión actualizada en el futuro.

También tenemos la [cadena de autenticación](../entities.md#ownership) usada para firmar esta entidad, y podríamos validar las firmas listadas para verificar la autenticidad de cualquier archivo relacionado que descarguemos.

Pongamos nuestras manos en el manifest de entidad. Recuerda, el `entityId` es el [identificador de archivo](../file-system.md#identifiers) que necesitamos, y podemos usar el endpoint `/content/contents` nuevamente:

```bash
curl "https://peer.decentraland.org/content/contents/bafkreigcreq7rv6b2wf4zc4fsnif43ziwb4q46v4qhsewpf7gbsyxew3om"
```
```js
{
  "version": "v3",
  "type": "profile",
  "pointers": [
    "0x273cdb3b1c791c336c4b2bcc52c4f415d0046b91"
  ],
  "timestamp": 1689120135624,
  "content": [
    {
      "file": "body.png",
      "hash": "bafybeibzaqkirz7fk474xvyhurho5xviphs7anawaceb6gscuigia4x33u"
    },
    // ...más archivos
  ],
  "metadata": {
    // ...avatares y otra información
  }
}
```

Esta entidad `profile` tiene toda la información que los World Explorers usan para renderizar y animar un jugador. Si estamos interesados en obtener uno de los archivos empaquetados, podemos continuar usando el endpoint `/content/contents`.

Si miramos el campo `content`, podemos ver el `hash` del archivo llamado internamente `body.png`. Obtengámoslo:

```bash
curl "https://peer.decentraland.org/content/contents/bafybeibzaqkirz7fk474xvyhurho5xviphs7anawaceb6gscuigia4x33u" > body.png
```

Podemos abrir este archivo `png` en un visor de imágenes o navegador web, y revisar el trabajo del autor. ¡Excelente!
