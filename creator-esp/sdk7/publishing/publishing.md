---
description: ¿Cómo publicar mi proyecto?
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/publishing/publishing
---

# Publicación

### Antes de comenzar

Asegúrate de lo siguiente:

* Tu escena cumple con todas las [limitaciones de escena](../optimizing/scene-limitations.md). La mayoría de estas se validan cada vez que ejecutas una vista previa de tu escena.
* Tienes una cuenta de [Metamask](https://metamask.io/), con tus parcelas de LAND asignadas a ella.
*   Posees la cantidad necesaria de parcelas de LAND adyacentes o un NAME de Decentraland. De lo contrario, puedes comprar LAND en el [Market](https://market.decentraland.org) o un NAME en el [Builder](https://decentraland.org/builder/names).

    \{% hint style="warning" %\} **📔 Nota**: Las escenas multi-parcela solo pueden desplegarse en parcelas adyacentes. \{% endhint %\}

{% hint style="danger" %}
**❗Advertencia**: Al planear eventos en vivo, asegúrate de no hacer cambios de último minuto a la escena justo antes del evento.

Después de cada publicación, un proceso interno optimiza todos los modelos 3D antes de que puedan renderizarse. Esto toma alrededor de 15 minutos. Si visitas la escena antes de que esto esté hecho, la escena puede aparecer rota. Este proceso se ejecuta incluso si los modelos 3D ya fueron publicados previamente.
{% endhint %}

### Verificar datos de la escena

Al desplegar, el CLI lee información del _scene.json_ para saber dónde desplegar tu escena.

Abre el archivo _scene.json_ de tu escena y completa los siguientes datos:

* **title**: El título se muestra en la UI debajo del mini-mapa, cuando los jugadores entran a tu escena. También se muestra en el popup de teletransporte.
* **description**: Una descripción de lo que los jugadores encontrarán en tu escena. Esto se muestra en el popup de teletransporte.
* **navmapThumbnail**: Una imagen que representa tu escena. Esto se muestra en el popup de teletransporte. La imagen debe ser una imagen _.png_ o _.jpg_ de un tamaño recomendado de _228x160_ píxeles.
* **Parcels**: Las coordenadas de las parcelas que serán ocupadas por tu escena
* **Base**: Las coordenadas de la parcela que se considerará la coordenada \[0,0] de la escena. Si tu escena tiene múltiples parcelas, debe ser la parcela inferior izquierda (Sur-Oeste).
* **spawnPoints**: Un conjunto de coordenadas dentro de la escena (relativas a la parcela base de la escena) donde los jugadores aparecen. Por defecto, los jugadores aparecen en la ubicación _0,0,0_ de la escena (esquina inferior izquierda). Usa esto para comenzar en una ubicación específica, establece una región para evitar que los jugadores se superpongan cuando aparecen por primera vez.
* **tags**: Un conjunto de etiquetas que describen tu escena. Estas se usan para ayudar a los jugadores y usuarios a explorar Decentraland de una mejor manera, ya que pueden encontrar el contenido que les interesa. [Consulta la lista de etiquetas disponibles](../projects/scene-metadata.md#categories).
* **rating**: Esto se usa para clasificar el contenido de tu escena según su idoneidad para diferentes grupos de edad (`T` para Teens o `A` para Adults). Ayuda a filtrar contenido para los jugadores.

{% hint style="warning" %}
**📔 Nota**: Consulta [metadatos de escena](../projects/scene-metadata.md) para más detalles sobre cómo establecer estos parámetros.
{% endhint %}

### Para publicar la escena

#### Usando el Scene Editor

Asegúrate de haber [instalado el Creator Hub](../../scene-editor/get-started/editor-installation.md).

1. Abre tu proyecto de escena.
2. Haz clic en el botón **Publish** en la esquina superior derecha.
3. Un mensaje te preguntará si quieres publicar en un **WORLD** o en **LAND**.
   * Selecciona **PUBLISH TO WORLD** para hacer que tu escena esté disponible en uno de tus [WORLDs](../../worlds/about.md). Luego selecciona cuál de tus NAMEs o Dominios ENS publicar.
   * Selecciona **PUBLISH TO LAND** si posees land, o te han dado permisos de despliegue por un propietario. Luego selecciona las parcelas donde quieres que se despliegue en el mapa. Las parcelas donde se te permite desplegar se muestran en rosa.
   * Selecciona **Alternative servers** para publicar en el [servidor de prueba](publishing.md#the-test-server) o un [servidor personalizado](publishing.md#custom-servers).
4. Esto abre una nueva pestaña en tu navegador, mostrando detalles sobre la carga. Aprueba la transacción.
   * Para LAND en una cuenta de navegador Metamask, confirma el despliegue. Luego aprueba la transacción en la extensión del navegador Metamask.
   * Para LAND vinculado a un wallet que puedes usar vía Wallet Connect, haz clic en **Connect wallet**, luego escanea el código QR con tu dispositivo móvil y sigue los pasos en Wallet Connect.

#### Vía el CLI

1. Inicia sesión en tu cuenta de Metamask con la misma dirección pública asociada con tus parcelas en Decentraland.
2. Ejecuta `npm run deploy` desde la carpeta de la escena.

{% hint style="info" %}
\*\*💡 Tip\*\*: Si hay archivos en tu carpeta de proyecto que no quieres desplegar, lístalos en el archivo \_.dclignore\_ antes de desplegar.
{% endhint %}

3. Se abrirá una pestaña del navegador, mostrando a qué parcelas estás desplegando. Haz clic en **Sign and Deploy**.
4. Metamask se abre, notificándote que tu firma es solicitada. Haz clic en **Sign** para confirmar esta acción.

{% hint style="info" %}
**💡 Tip**: Si estás implementando un flujo de integración continua, donde los cambios a tu escena se despliegan automáticamente, entonces puedes establecer la variable de entorno `export DCL_PRIVATE_KEY` a la clave privada de una cuenta que tiene permisos de despliegue.
{% endhint %}

{% hint style="info" %}
**💡 Tip**: `npm run deploy` ejecuta un `npm run build`, que verifica la escena en busca de errores de tipo más estrictamente que ejecutar `npm run start`. Si estos errores no pueden evitarse (ej: ocurren en una librería externa) y no impactan la escena, puedes usar `npm run deploy --skip-build` para omitir el paso `npm run build` y desplegar la escena tal como está.
{% endhint %}

Al publicar a un [World de Decentraland](../../worlds/about.md), usa el siguiente comando en su lugar:

`npm run deploy -- --target-content https://worlds-content-server.decentraland.org`

### Publicar desde un hardware wallet

En lugar de almacenar tus tokens de LAND en una cuenta de Metamask, puede que encuentres más seguro almacenarlos en un dispositivo de hardware wallet, como un [Ledger](https://www.ledger.com/) o un [Trezor](https://trezor.io/), que está físicamente conectado a tu computadora.

Si estás usando uno de estos dispositivos, puedes vincular el hardware wallet a Metamask para habilitar la firma de mensajes, mientras mantienes los tokens más seguros. Consulta [este artículo de Metamask](https://metamask.zendesk.com/hc/en-us/articles/360020394612-How-to-connect-a-Trezor-or-Ledger-Hardware-Wallet) para obtener instrucciones para conectar tu cuenta.

Una vez que tu hardware wallet pueda usarse vía Metamask, puedes desplegar siguiendo los mismos pasos como si tus tokens estuvieran en una cuenta de Metamask.

### Sobrescritura de escena

Cuando se despliega una nueva escena, sobrescribe el contenido anterior que existía en las parcelas que ocupa.

Si una escena que ocupa múltiples parcelas es solo parcialmente sobrescrita por otra, todas sus parcelas son sobrescritas o borradas.

Supón que desplegaste tu escena _A_ sobre dos parcelas _\[100, 100]_ y _\[100, 101]_. Luego vendes la parcela _\[100, 101]_ a un usuario que posee land adyacente y que despliega una escena grande (_B_) a varias parcelas, incluyendo _\[100, 101]_.

Tu escena _A_ no puede renderizarse parcialmente en solo una parcela, por lo que _\[100, 100]_ no mostrará ningún contenido. Debes construir una nueva versión de la escena _A_ que solo ocupe una parcela y desplegarla solo en la parcela _\[100, 100]_.

### Qué son los servidores de contenido

Los servidores de contenido son una red de servidores propiedad de la comunidad con un sistema de archivos que es content-addressed, lo que significa que cada archivo se identifica por su contenido, no por un nombre de archivo arbitrario.

Usamos los servidores de contenido para alojar y distribuir todo el contenido de la escena de manera similar a BitTorrent, manteniendo la red de Decentraland distribuida.

1. Los servidores de contenido almacenan y distribuyen todos los assets requeridos para renderizar tus escenas.
2. El comando `npm run deploy` vincula estos assets a la parcela de LAND especificada en tu archivo **scene.json**. Cada vez que redespliegues tu escena, el CLI actualizará tu smart contract de LAND, si es necesario, para apuntar al contenido más reciente disponible en los servidores de contenido.

La información en cada copia del servidor es verificable, ya que cada escena está firmada por el hash del propietario de LAND. Esto significa que alguien que aloje una copia del servidor no podrá alterar el contenido para mostrar algo ilegítimo. La comunidad también puede votar para aprobar o eliminar cualquiera de estos servidores usando el DAO.

### El servidor de prueba {#the-test-server}

Puedes desplegar contenido al servidor catalyst de prueba para ejecutar pruebas completas con múltiples usuarios, las escenas circundantes y un entorno que es idéntico a producción. El servidor de prueba es idéntico a todos los demás servidores catalyst, la diferencia es que el contenido que se despliega a este servidor no se propaga a los demás. El contenido desplegado a otros servidores, por otro lado, sí se propaga a este servidor, por lo que las escenas circundantes deberían verse como se verán en producción.

{% hint style="warning" %}
**📔 Nota**: Para desplegar a parcelas en el servidor de prueba, debes tener los mismos permisos requeridos para desplegar a esas parcelas en la red principal.
{% endhint %}

Los jugadores nunca son dirigidos a este servidor, la única forma de acceder a él es proporcionar explícitamente un parámetro URL para conectarse a él.

Si estás trabajando en un proyecto confidencial que no quieres revelar hasta el lanzamiento, ten en cuenta que el servidor de prueba está relativamente oculto de los jugadores, pero cualquiera que use explícitamente la URL del servidor de prueba podría potencialmente encontrarlo.

#### Vía el CLI

Para desplegar al servidor de prueba, ejecuta:

`npm run deploy -- --target peer-testing.decentraland.org`

Para entrar al servidor de contenido, agrega `&CATALYST=peer-testing.decentraland.org` a la URL de Decentraland

_https://play.decentraland.org/?CATALYST=peer-testing.decentraland.org_

### Servidores personalizados

Puedes desplegar contenido a un servidor personalizado que no pertenece a la red oficial de servidores catalyst mantenida por el DAO. Para hacer esto, no necesitas poseer ningún token LAND o NAME, ya que puedes configurar el servidor para usar cualquier lógica de validación que prefieras para controlar quién puede desplegar dónde. Los servidores personalizados pueden elegir tener contenido de los servidores oficiales, que puedes sobrescribir, o comenzar desde cero y publicar contenido completamente nuevo.

Consulta [Cómo ejecutar tu propio Nodo Catalyst](../../../contributor-esp/tutorials/how-to-run-a-catalyst.md) para más información sobre qué puedes hacer con tu propio servidor y cómo configurarlo.

{% hint style="warning" %}
**📔 Nota**: Los jugadores necesitarán escribir manualmente una URL para acceder a tu servidor personalizado. Ciertas validaciones de servicios como el [servidor de recompensas](../../rewards/gatting-started.md) o el [servidor de quests (documentación archivada)](https://github.com/decentraland/documentation/blob/5f8c7f73c67a9a36e85095cb02e72dc6355fa590/content/creator/deprecated/quests/overview.md) podrían fallar en estos contextos, ya que a menudo estos servicios requieren que la solicitud provenga de un servidor oficial.
{% endhint %}

Los jugadores nunca son dirigidos a este servidor, la única forma de acceder a él es escribir explícitamente la URL para conectarse a él.

#### Vía el CLI

Para desplegar a un servidor personalizado, ejecuta:

`npm run deploy -- --target <CUSTOM SERVER DOMAIN>`

La URL para entrar a tu escena desplegada en tu servidor personalizado dependerá del dominio donde esté alojado.

### Verificar éxito del despliegue {#verify-deployment-success}

Una vez que hayas desplegado tu escena, estos cambios tomarán unos minutos en propagarse a través de los diversos servidores de contenido en la red. Si entras a Decentraland justo después de desplegar, podrías aún ver la versión anterior de tu contenido, dependiendo de a qué realm entres.

Después de firmar para autorizar el despliegue de tu escena, la dapp de firma comenzará a mostrar confirmaciones de que la nueva versión de tu contenido se ha propagado a través de todos los servidores en la red.

Verás una lista de cada uno de los servidores que componen la red de contenido de Decentraland. Para cada servidor, especifica el timestamp del último cambio cargado en esa parcela. Cada uno de estos servidores se refiere a un realm diferente, puedes referenciar cómo estos nombres de servidor mapean a nombres de realm en la [pantalla del monitor de catalyst](https://decentraland.github.io/catalyst-monitor/).

También puedes obtener esta información en cualquier momento ejecutando el siguiente comando en la consola de línea de comandos:

`npx @dcl/opscli pointer-consistency --pointer 0,0`

{% hint style="warning" %}
**📔 Nota**: Usa las coordenadas de tu escena en lugar de `0,0`. Si tu escena tiene múltiples parcelas, cualquiera de sus parcelas producirá el mismo output. Si las coordenadas comienzan con un número negativo, agrega un `\` al inicio de las coordenadas para evitar que el carácter `-` sea malinterpretado por la línea de comandos.
{% endhint %}

### Despliegues automáticos

Si regularmente haces cambios al contenido de tu escena y quieres implementar un pipeline de publicación optimizado, puedes automatizar el despliegue de tu escena vía una acción de GitHub.

Para esto, primero debes almacenar tu escena en un proyecto de GitHub. Luego puedes establecer una [acción de GitHub](https://docs.github.com/en/actions) con el siguiente script, que se ejecuta cada vez que hay un merge a la rama `main`. El script instala cualquier dependencia, construye el proyecto y luego lo despliega a Decentraland.

```yaml
name: Deploy to DCL PROD

on:
  push:
    branches:
      - main

env:
  DCL_PRIVATE_KEY: ${{ secrets.DCL_PRIVATE_KEY }}

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install npm packages
        run: |
          npm install
      - name: Build scene
        run: |
          npm run build:ci
      - name: Deploy scene
        run: |
          npm run deploy:prod
```

> Importante: Para que este proceso funcione, debes establecer la clave privada de un wallet como una variable de entorno en GitHub, esto se usa para firmar el despliegue. Como siempre, ten mucho cuidado al mantener las claves públicas seguras. NO uses la clave pública de la cuenta que realmente posee los tokens de land, ya que eso tendría riesgos muy grandes. En su lugar, delega derechos de operador a un wallet desechable que no posea tokens valiosos. Si esta clave privada se filtra de alguna manera, puedes revocar fácilmente esos derechos de operador de la cuenta y configurar un nuevo wallet.
