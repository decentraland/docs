---
description: Cómo usar el DAO de Decentraland
metaLinks:
  alternates:
    - https://app.gitbook.com/s/UWbeOuof0RchgfvQfPTf/dao/dao-userguide
---

# Guía de Usuario del DAO

## Tabla de Contenidos

* [Iniciar sesión](dao-userguide.md#iniciar-sesion)
* [Poder de voto](dao-userguide.md#poder-de-voto)
* [Condiciones de Aprobación/Rechazo](dao-userguide.md#condiciones-de-aprobacionrechazo)
* [Explorar propuestas](dao-userguide.md#explorar-todas-las-propuestas)
* [Ver una propuesta](dao-userguide.md#ver-una-propuesta)
* [Agregar propuestas a tu lista de seguimiento](dao-userguide.md#agregar-propuestas-a-tu-lista-de-seguimiento)
* [Votar](dao-userguide.md#votar)
* [Participar en el Foro](dao-userguide.md#participar-en-las-discusiones-del-foro)
* [Crear una propuesta](dao-userguide.md#crear-una-propuesta)
* [Categorías de propuestas](dao-userguide.md#categorias-de-propuestas)
* [Eliminar una propuesta](dao-userguide.md#eliminar-una-propuesta)

## Iniciar sesión

Para comenzar con el DAO, visita [governance.decentraland.org](https://governance.decentraland.org). Se te presentará una pantalla de bienvenida y un tutorial de inicio rápido.

Después de leer el tutorial de inicio rápido, haz clic en **Iniciar Sesión**. Debes conectar una billetera para usar el DAO. Actualmente, puedes usar **Metamask** o **Fortmatic**. Asegúrate de que la billetera que estás usando contenga los tokens relevantes para participar en el DAO (MANA, NAMEs o LAND)

Después de conectar tu billetera serás llevado a la página de inicio del DAO que presenta una lista de todas las propuestas actualmente activas.

## Poder de voto

El poder de voto se calcula a partir del saldo total de MANA, NAMEs y LAND asociados con la billetera conectada con el DAO. **El DAO mira tanto tus saldos envueltos como sin envolver, por lo que no necesitas desenvolver ningún MANA para lograr tu poder de voto completo.** Sin embargo, puedes desenvolver cualquier MANA previamente envuelto en cualquier momento desde la pestaña "Poder de Voto". Todavía hay una tarifa de gas asociada con desenvolver MANA ya que es una transacción en la red principal de Eth.

Tu voto en el DAO de Decentraland se pondera de acuerdo al saldo de MANA, NAMEs y LAND asociado con la cuenta con la que inicias sesión.

Para ver tu poder de voto actual, navega a la pestaña **Poder de Voto**.

#### ¿Cómo se calcula el poder de voto?

El poder de voto se representa como **"VP"**. MANA, NAME, LAND y Wearables Legacy contribuyen a tu poder de voto total de la siguiente manera:

* 1 MANA contribuye 1 VP
* 1 NAME contribuye 100 VP
* 1 parcela LAND contribuye 2000 VP
* Las siguientes Colecciones de Wearables Legacy contribuyen 1 VP por cada **no común**, 5 VP por cada **raro**, 10 VP por cada **épico**, 100 VP por cada **legendario**, y 1000 VP por cada **mítico**:
  * [Community Contest Collection](https://etherscan.io/address/0x32b7495895264ac9d0b12d32afd435453458b1c6)
  * [DCL Public Explorer Launch Collection](https://etherscan.io/address/0xd35147be6401dcb20811f2104c33de8e97ed6818)
  * [Exclusive Masks Collection](https://etherscan.io/address/0xc04528c14c8ffd84c7c1fb6719b4a89853035cdd)
  * [Halloween 2019 Collection](https://etherscan.io/address/0xc1f4b0eea2bd6690930e6c66efd3e197d620b9c2)
  * [My Crypto Heroes Collection](https://etherscan.io/address/0xf64dc33a192e056bb5f0e5049356a0498b502d50)
  * [Xmass 2019 Collection](https://etherscan.io/address/0xc3af02c0fd486c8e9da5788b915d6fff3f049866)
* Cada Estate vale 2000 multiplicado por el número de parcelas LAND individuales en ese Estate. Por ejemplo, un Estate con 2 parcelas contribuirá 4000 VP a tu poder de voto total.

#### ¿Qué sucede si tu poder de voto cambia antes de que una propuesta se cierre?

Si tu saldo de MANA o LAND cambia, afectará tu poder de voto, pero solo en propuestas que se creen después de que tu saldo cambie.

En el momento en que se crea una nueva propuesta, el DAO mira los saldos de MANA y LAND de todos los votantes para calcular su poder de voto. En otras palabras, cuando votas en una propuesta, el poder de voto de tu voto será igual al saldo que tenías en el instante en que la propuesta fue creada inicialmente. Puedes votar con ese VP, luego cambiar tu saldo de MANA/LAND sin afectar el peso de tu voto.

#### ¿Por qué el DAO de Decentraland usa votos ponderados?

Si el DAO de Decentraland diera a cada dirección de Ethereum un voto, y cada voto se ponderara por igual, entonces los usuarios podrían crear tantas direcciones separadas como quisieran para obtener más poder de voto.

Determinar el poder de voto considerando los saldos de MANA, NAME y LAND es actualmente la forma más segura de limitar la cantidad de influencia que cada votante puede tener. Además, cuanto más MANA, NAME o LAND poseas en Decentraland, mayor se considera que es tu participación personal, ganando así más influencia para tu voto dentro del DAO.

## Condiciones de Aprobación/Rechazo

Dependiendo del tipo de propuesta, se necesita una cierta cantidad de VP participante para considerar la votación válida. Verás esto referenciado en la dApp de Gobernanza como el **Umbral de Aceptación** para la propuesta. Una vez que se ha cumplido el umbral de aceptación, una propuesta se aprueba si el poder de voto total a favor de la propuesta es mayor que el poder de voto total en contra de la propuesta. Este es el modelo de mayoría 50/50 típico que esperamos ver en la mayoría de las votaciones democráticas.

El único tipo de propuesta que no sigue esta regla son las **encuestas de pre-propuesta**. Como estas propuestas se consideran un mecanismo no vinculante para recopilar comentarios de la comunidad sobre una idea, no tienen opciones predefinidas de Sí/No para votar. Los usuarios pueden agregar más de dos opciones convirtiéndolas en una encuesta de opción múltiple. Es importante mencionar que si las encuestas de Pre-propuesta alcanzan el Umbral de Aceptación definido de 500k VP, pueden ser promovidas a una **Propuesta Borrador** y terminar siendo una **Propuesta de Gobernanza** vinculante.

## Explorar todas las propuestas

Para ver todas las propuestas en el DAO, visita [governance.decentraland.org](https://governance.decentraland.org). La página de inicio del DAO enumera todas las propuestas agregadas recientemente ordenadas de más reciente a más antigua, por defecto.

Puedes filtrar propuestas por **Resultados**:

* **Activas** – propuestas que se están votando actualmente
* **Aprobadas** – propuestas que han sido aprobadas por la comunidad
* **Rechazadas** – propuestas que ya han sido votadas y fueron rechazadas por la comunidad o no cumplieron con el umbral de aceptación
* **Promulgadas** – propuestas que han sido promulgadas en la cadena por el Comité del DAO
* **Finalizadas** – propuestas que están cerradas, pero no tienen resultados de sí/no, como encuestas de opción múltiple

También puedes filtrar propuestas por **Categoría** usando la columna de categoría en el lado izquierdo de la interfaz:

* **Todas las propuestas** – muestra todas las propuestas independientemente de la categoría o resultado
* **Nodo Catalyst** – solo muestra propuestas para agregar nuevos nodos Catalyst
* **Punto de Interés** – solo muestra propuestas para agregar nuevos POIs
* **Prohibición de Nombre** – solo muestra propuestas para prohibir un nombre
* **Solicitud de Subvención** – solo muestra solicitudes de subvención
* **Encuesta de Pre-propuesta** – solo muestra encuestas no vinculantes
* **Propuesta borrador** – solo muestra propuestas borrador
* **Propuesta de gobernanza** – solo muestra propuestas finales vinculantes de gobernanza

Para ver solo las propuestas que han sido aprobadas, haz clic en la pestaña **Promulgadas**. Las propuestas promulgadas en esta pestaña están ordenadas de más reciente a más antigua por defecto.

## Ver una propuesta

Para leer una propuesta, simplemente haz clic en el título de la propuesta para ver la página de detalles.

Cada página de detalles de propuesta incluye toda la información descriptiva proporcionada por la persona que envió la propuesta.

También encontrarás enlaces al hilo de discusión de la propuesta en el Foro, botones para agregar una propuesta a tu lista de seguimiento, los resultados de votación actuales, botones para votar, el umbral de aceptación, tu Poder de Voto actual y quién votó en la propuesta.

Las páginas de detalles de propuesta también enumeran el nombre de avatar único asociado con la dirección de Ethereum que abrió la propuesta, si existe uno, y las fechas de inicio y fin de la propuesta.

Finalmente, verás un enlace a la entrada de las propuestas en Snapshot – la plataforma de votación utilizada por el DAO de Decentraland.

## Agregar propuestas a tu lista de seguimiento

Para agregar una propuesta a tu lista de seguimiento, ve la página de detalles de la propuesta y haz clic en **Agregar a mi Lista de Seguimiento**.

Para eliminar una propuesta de tu lista de seguimiento, haz clic en **Eliminar de mi Lista de Seguimiento** desde la página de detalles de la propuesta. También puedes hacer clic en el ícono de bandera roja en cualquier propuesta actualmente en tu lista de seguimiento para eliminarla.

## Participar en las discusiones del Foro

Como plataforma de gobernanza, el DAO de Decentraland es más efectivo cuando se combina con discusiones frecuentes dentro de la comunidad. Cada vez que se abre una nueva propuesta en **governance.decentraland.org**, se abre automáticamente un tema acompañante en [**forum.decentraland.org**](https://forum.decentraland.org).

Antes de emitir tu voto, por favor tómate el tiempo para ver y unirte a estas discusiones del foro. Haz clic en el botón **Discutir en el foro** desde la página de detalles de cualquier propuesta del DAO que desees discutir. También puedes explorar temas abiertos navegando a [forum.decentraland.org](https://forum.decentraland.org), dirigiéndote a la categoría **Gobernanza**, y explorando los temas abiertos.

¡No necesitas poseer tokens para participar en estas discusiones! Todos son bienvenidos a contribuir a la conversación.

## Votar

Para votar en una propuesta, inicia sesión en el DAO en [governance.decentraland.org](https://governance.decentraland.org) con una billetera que contenga MANA, NAME o LAND.

{% hint style="info" %}
**Saldo mínimo necesario para votar:** Solo los poseedores de MANA, NAME o LAND pueden votar en propuestas en el DAO de Decentraland. **El saldo mínimo actual necesario para tener un voto ponderado en propuestas en el DAO es 1VP** Votar con un saldo de cero resultará en un voto con un peso de 0, que no impacta los resultados finales.
{% endhint %}

Para votar en una propuesta una vez que hayas conectado tu billetera, simplemente ve la página de detalles de la propuesta y haz clic en el botón **VOTAR SÍ** o **VOTAR NO**, o selecciona una de las opciones de opción múltiple si es una encuesta, de acuerdo a cómo te gustaría votar.

Asegúrate de leer la propuesta completa para que entiendas el problema que se está discutiendo y qué sucederá si la propuesta es aprobada o rechazada.

Después de hacer clic en el botón Votar, tu billetera de Ethereum conectada te pedirá que firmes la transacción. Recuerda, esto es solo una transacción firmada, y no requiere tarifa de gas.

Se te dará la opción de agregar la propuesta a tu lista de seguimiento, esta es una buena manera de rastrear las propuestas que te interesan. Si no quieres agregar la propuesta a tu Lista de Seguimiento, simplemente haz clic en **No, gracias**.

Después de enviar tu voto, puedes cambiarlo en cualquier momento antes del final del período de votación - como se muestra en la página de detalles de la propuesta.

#### ¿Qué sucede si tu VP cambia antes de que una propuesta esté completa?

El DAO calcula tu poder de voto para cada propuesta individual en el momento en que se crea cada propuesta. Si tu VP cambia después de este momento, no afectará tu voto en esa propuesta.

Para una discusión completa del poder de voto, y cómo y cuándo se calcula, por favor consulta la sección de [Poder de Voto](dao-userguide.md#poder-de-voto) de la Guía de Usuario.

## Crear una propuesta

Para crear una nueva propuesta en el DAO de Decentraland, comienza iniciando sesión en [governance.decentraland.org](https://governance.decentraland.org) y conectando una billetera que contenga MANA, NAME o LAND.

Después de iniciar sesión y conectar tu billetera, haz clic en **Enviar una propuesta** y selecciona la categoría de propuesta que deseas usar. Cada categoría proporcionará un formulario que te permitirá proporcionar la información relevante para tu propuesta.

El formulario para cada categoría es diferente, así que asegúrate de seleccionar la categoría correcta para tu propuesta. Los formularios de propuesta en el DAO admiten Markdown, por lo que puedes formatear el contenido de tu propuesta para hacerlo más legible. Esto es especialmente útil para propuestas más largas.

Para previsualizar tu texto Markdown renderizado, activa el interruptor **Vista Previa**. Si no estás familiarizado con Markdown, puedes usar texto plano simple.

Algunas categorías de propuestas tienen umbrales mínimos de envío de VP, lo que significa que debes tener al menos cierta cantidad de VP para enviar las propuestas. Esto se te informará en la dApp de Gobernanza.

Después de completar el formulario de propuesta para la categoría que has seleccionado, haz clic en **Enviar propuesta**. Después de enviar exitosamente tu propuesta, serás llevado a la página de detalles de tu nueva propuesta donde puedes agregarla a tu lista de seguimiento y emitir tu voto.

## Categorías de Propuestas

### Propuestas Vinculantes

#### 📍 Punto de interés

Los puntos de interés son ubicaciones notables en Decentraland. Estos "POIs" se promueven en varias áreas de la interfaz del mundo virtual y se promueven como buenos lugares para que los usuarios exploren, especialmente personas nuevas en Decentraland.

Si has creado una ubicación, o has encontrado una ubicación que crees que debería estar en esta lista, o si crees que un POI actual debería ser eliminado ya que ya no es interesante, puedes usar esta categoría de propuesta para presentar tu sugerencia al DAO.

#### 🚫 Prohibición de nombre

La lista de "nombres prohibidos" incluye nombres de avatar y ubicación ofensivos o dañinos que no están permitidos en Decentraland. Cualquier nombre en esta lista no puede ser reclamado, usado o transferido entre usuarios. Para sugerir la prohibición de un nombre, puedes usar la categoría de propuesta de Prohibición de nombre en el DAO.

#### 🌐 Nodos Catalyst

Los nodos Catalyst son los servidores administrados por la comunidad que proporcionan el contenido y establecen las conexiones peer-to-peer necesarias para mantener funcionando el mundo virtual de Decentraland. Cada vez que un usuario abre Decentraland, se conecta a uno de estos nodos. Sin embargo, solo los nodos que han sido aprobados por el DAO se usan en la red de Decentraland.

Para sugerir la adición de un nuevo nodo a la red, puedes usar la categoría de Nodo Catalyst.

### Propuestas del Proceso de Gobernanza

Algunas propuestas no son tan simples como agregar o eliminar un artículo de una lista, requieren señalización comunitaria, discusiones y caminos de implementación. Estas propuestas deben ser enviadas a través de un proceso de gobernanza de tres etapas que comienza con una encuesta y termina con una propuesta vinculante.

El proceso de votación incluye tres pasos: una Encuesta de Pre-Propuesta, una Propuesta Borrador y una Propuesta de Gobernanza. Cada nivel tendrá umbrales de envío y aprobación progresivamente crecientes para asegurar que las decisiones importantes de gobernanza sean tomadas por una mayoría representativa (basada en Poder de Voto). Cada paso debe alcanzar el umbral de VP definido para ser promovido al siguiente.

#### 📊 Encuesta de Pre-propuesta

Este es el primer paso para llegar a la propuesta de Gobernanza vinculante final. Las encuestas en el DAO de Decentraland son cuestionarios de opción múltiple no vinculantes que pueden usarse para medir la opinión general de la comunidad o el sentimiento con respecto a diferentes problemas. Son no vinculantes en el sentido de que el DAO no actúa automáticamente sobre los resultados de ninguna de estas encuestas. Si una encuesta de pre-propuesta reúne suficiente VP participante (500k VP es el umbral de aceptación) puede ser promovida a Propuesta Borrador.

#### 📊 Propuesta Borrador

Una Propuesta Borrador presenta una política potencial a la comunidad en un formato estructurado y formaliza la discusión sobre los impactos potenciales de la propuesta y caminos de implementación. Una Propuesta Borrador que falla o no alcanza este umbral puede ser enmendada y reenviada una vez. Si una Propuesta Borrador reúne suficiente VP participante (1M VP es el umbral de aceptación) puede ser promovida a una propuesta de Gobernanza vinculante.

#### 📊 Propuesta de Gobernanza

Este es el último paso del proceso de Gobernanza y es el único que es vinculante. Esta propuesta debe detallar todos los detalles, datos, métodos, evaluaciones o cualquier otra información relevante para implementar esta propuesta. Una propuesta de Gobernanza se acepta si cumple con el umbral de aceptación de 6M VP y la opción Sí obtiene una mayoría simple.

## Eliminar una propuesta

Las propuestas solo pueden ser eliminadas por la persona que las creó.

Para eliminar una de tus propuestas, navega a la página de detalles de la propuesta que deseas eliminar. Haz clic en **Eliminar Propuesta** en la parte inferior de la columna derecha. Tendrás que confirmar tu eliminación.

¡Ten cuidado! ¡Las propuestas eliminadas no se pueden restaurar!

Si eliminas una propuesta después de que las personas hayan votado en ella, no pasará nada. Las propuestas eliminadas con acciones vinculantes no serán promulgadas por el Comité del DAO.
