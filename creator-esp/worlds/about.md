---
metaLinks:
  alternates:
    - https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/worlds/about
---

# Resumen

Los Worlds de Decentraland son tu propio espacio 3D personal en el ecosistema de Decentraland, separado del mapa de parcelas LAND de Genesis City. Un World puede mantenerse privado o compartirse con cualquiera con solo un enlace. Capaz de alojar hasta 100 usuarios concurrentes, puedes usar tu World para organizar eventos, mostrar tu trabajo, o como un lienzo en blanco donde puedes liberar tu creatividad y experimentar. Un World está disponible para cualquiera que posea un NAME de Decentraland o un dominio ENS.

## ¿Qué son los Worlds?

Los Worlds son espacios 3D personales ubicados más allá de los límites de Genesis City. Los Worlds pueden servir para varios propósitos, tales como:

* Organizar eventos
* Liberar tu creatividad
* Construir nuevas experiencias
* Alojar un portafolio de escenas
* Probar escenas antes de desplegarlas en Genesis City

Puedes obtener tu propio World de Decentraland consiguiendo un [NAME de Decentraland](https://builder.decentraland.org/names), que son NFTs de NAME dentro del ecosistema DCL, o puedes obtener un World teniendo un [dominio ENS](https://ens.domains), un nombre descentralizado que puede usarse tanto en Web2 como en Web3.

Adquirir un NAME de Decentraland requiere 100 MANA y puede asignarse a tu avatar, LAND o Estate. Alternativamente, puedes comprar un NAME ya acuñado de un propietario anterior en el Marketplace. Estos NAMEs luego son usados por el Explorer de Decentraland para cargar el World asociado.

Los Worlds sirven como puerta de entrada para aspirantes a creadores de contenido, proporcionando un punto de entrada accesible para crear en Decentraland y la libertad de experimentar con la creación de escenas.

### Límite de Tamaño de Worlds

El tamaño máximo de archivo que puedes subir a tu World es una consideración esencial al desplegar tus escenas. Es importante notar que el tamaño máximo de archivo de escena que puedes subir a tu World difiere entre Worlds otorgados por NAMEs de Decentraland y aquellos de dominios ENS.

#### Worlds de NAMEs de Decentraland

Los poseedores de NAME de Decentraland disfrutan de capacidad de almacenamiento dinámica dentro del Servidor de Contenido de Worlds de la Foundation, que depende de las tenencias de su billetera. Las siguientes reglas gobiernan esta asignación:

* Cada NAME de Decentraland que poseas otorga 100 Mb de capacidad de almacenamiento (así como un World).
* Cada parcela LAND de Decentraland que poseas otorga 100 Mb adicionales de capacidad de almacenamiento.
* Por cada 2,000 MANA mantenidos en tu billetera, se otorgan 100 Mb adicionales de capacidad de almacenamiento.

El espacio en el Servidor de Contenido de Worlds de la Foundation puede usarse para alojar escenas tan grandes como los usuarios deseen, utilizando los NAMEs de Decentraland que poseen y el espacio combinado otorgado por sus activos colectivos de Decentraland. Por ejemplo, un usuario con múltiples Worlds (otorgados por poseer múltiples NAMES) y una capacidad de almacenamiento combinada de 500 Mb puede elegir desplegar un World con un archivo de escena de 200 MB, otro con un archivo de escena de 200 MB, y un tercero con un archivo de escena de 100 MB. Alternativamente, podrían optar por desplegar un World con un archivo de escena de 300 MB y otro con un archivo de escena de 200 MB. Esta flexibilidad permite a los usuarios crear y gestionar sus experiencias virtuales eficientemente dentro del espacio de almacenamiento del servidor asignado.

La capacidad máxima de almacenamiento del servidor para tus Worlds de Decentraland se calcula dinámicamente, adhiriéndose a las reglas descritas anteriormente. Si, por cualquier motivo, un usuario excede su espacio de almacenamiento asignado—por ejemplo, a través de ventas de activos o transferencias a otra billetera—se le proporcionará una ventana de 24 horas para abordar la situación. El no hacerlo resultará en que sus Worlds se vuelvan inaccesibles después de este período de gracia.

Para recuperar el acceso a un World bloqueado, los usuarios pueden adquirir más MANA, NAMEs de Decentraland o LANDS, aumentando su capacidad de almacenamiento o des-desplegar escenas existentes del Servidor de Contenido de World para liberar su espacio de almacenamiento.

#### Worlds de Dominios ENS

En contraste, los Worlds otorgados por dominios ENS tienen un tamaño máximo fijo de archivo de escena de 36 Mb por World, independientemente de las otras tenencias de Decentraland del usuario. Los usuarios con Worlds de dominios ENS no pueden aumentar el límite de tamaño de escena de su World ENS comprando MANA o LAND adicional.

Sin embargo, los Worlds otorgados por propiedad de dominio ENS sirven como el primer paso perfecto para realizar la libertad creativa ofrecida por Decentraland. Al mismo tiempo, obtén tu propio pequeño rincón del metaverso donde eres libre de comenzar a transformar tus ideas en realidad.

### Publicar un World

Los usuarios tienen varias opciones para publicar contenido en su World. Como prerequisito para cualquiera de las opciones a continuación, debes tener un NAME de Decentraland o Dominio ENS en tu billetera, o tener permisos otorgados por un propietario.

#### 1. Usar el Creator Hub (sin código / con código)

El Creator Hub es la opción preferida para crear Escenas de Decentraland. Puede usarse para crear escenas sin código a través de una interfaz fácil de arrastrar y soltar, o también puedes combinarlo con Visual Studio Code para escribir código libremente.

Consulta [Publicar Escena](../../creator/scene-editor/publish/publish-scene.md) para más detalles.

#### 2. Usar el Editor Web (sin código)

El Builder es la elección ideal para no desarrolladores. Las escenas pueden crearse desde cero usando el Scene Builder simplemente arrastrando y soltando artículos en la escena. Los [Smart items](../../creator/scene-editor/interactivity/smart-items.md) también pueden usarse para la interacción del jugador una vez que la escena está desplegada.

El [Builder](https://builder.decentraland.org/worlds) también sirve como el lugar preferido para visualizar tu espacio asignado y monitorear cuánto es consumido por cada NAME de Decentraland o Dominio ENS. Además, los usuarios pueden fácilmente des-desplegar escenas para liberar espacio de almacenamiento, ver cuándo su capacidad de almacenamiento es excedida, y acceder a información completa sobre sus Worlds, ya sean alojados en NAMES de Decentraland o Dominios ENS.

#### 3. Usar el SDK y el Editor

Si deseas saber más sobre cómo crear una escena, consulta la documentación del [SDK de Decentraland](../../creator/sdk7/getting-started/sdk-101.md).

Si eres un Creador de Contenido, es posible que ya estés familiarizado con cómo funciona la [publicación de una escena](../../creator/sdk7/publishing/publishing.md), la experiencia es bastante similar, pero con una pequeña salvedad:

Necesitas especificar bajo qué **nombre** se va a realizar tu despliegue. Agrega la siguiente sección en tu `scene.json`:

```json
{
	"worldConfiguration": {
		"name": "my-name.dcl.eth"
	}
}
```

El **nombre** especificado en el `scene.json` puede ser un NAME de Decentraland o un Dominio ENS y debe ser propiedad de la billetera que firma el despliegue (o por cualquier billetera que haya recibido permiso explícitamente a través de Listas de Control de Acceso (ACL), como se explica más adelante).

Ten en cuenta lo siguiente:

* La billetera que firma el despliegue debe poseer el NAME especificado en el archivo `scene.json`
* La escena no tiene limitaciones de parcela (desde enero de 2023)
* Todos los Worlds se listan automáticamente en la página de Places a menos que optes por no participar como se detalla a continuación

Algunos de los Worlds desplegados en el Servidor de Contenido de Worlds de la Foundation pueden ser elegibles para ser listados en Decentraland Places.

Si deseas optar por no participar en que tus Worlds sean indexados en Places, puedes agregar la siguiente sección en tu `scene.json`:

```json
{
	"worldConfiguration": {
		"name": "my-name.dcl.eth",
		"placesConfig": {
			"optOut": true
		}
	}
}
```

#### 5. Publicar a través del CLI

Para desplegar una escena a un world a través del CLI, necesitas especificar el servidor objetivo en la línea de comandos de despliegue y usar la URL del Servidor de Contenido de Worlds.

Para escenas SDK6, usa el siguiente comando:

```bash
dcl deploy --target-content https://worlds-content-server.decentraland.org
```

Para escenas SDK7, usa el siguiente comando:

```bash
npm run deploy -- --target-content https://worlds-content-server.decentraland.org
```

Una vez que ejecutes el comando, se te pedirá que firmes el despliegue con tu billetera y se ejecutará un conjunto de validaciones para permitir o rechazar la escena.

### Unirse a un World

Una vez que una escena se sube al servidor de Worlds puedes acceder a ella usando el Explorer de Decentraland con la siguiente URL amigable `https://decentraland.org/jump/?realm=NAME.dcl.eth`, donde `NAME` debe reemplazarse por el NAME de Decentraland o Dominio ENS al que se hizo el despliegue.

Por otro lado, los NAMEs también funcionan como realms, por lo que puedes aprovechar los mecanismos existentes de cambio de realm para acceder a un world. Una forma sería escribiendo el comando `/goto NAME.dcl.eth` en el cuadro de chat y otra posibilidad es cambiando el parámetro de consulta en la URL del Explorer: si tu NAME es `my-name.dcl.eth` puedes usar la siguiente URL para acceder al world: `decentraland://?realm=my-name.dcl.eth`

### Migrar un World a Genesis City

Si eres propietario de LAND y deseas desplegar una escena de World en Genesis City, es completamente posible. Solo necesitas re-desplegar tu escena en la red descentralizada de Catalyst, el servidor de contenido objetivo para Genesis City

Cosas para recordar:

* elimina la sección `worldConfiguration` de `scene.json`
* la limitación de tamaño para Worlds (100 Mb de tamaño total) es diferente a la de parcelas LAND (15MB por parcela), ¡así que asegúrate de que tu escena tenga el tamaño correcto para despliegues en Genesis City!

### Configuraciones predeterminadas de World

Un par de configuraciones personalizadas opcionales pueden especificarse en el `scene.json` al desplegar una escena de world:

**skybox**: Esta propiedad indica cuántos segundos han pasado (en tiempo de Decentraland) desde el inicio del día, asumiendo que el ciclo completo dura 24 horas. Divide el valor de segundos por 60 para obtener minutos, y por 60 nuevamente para obtener las horas desde el inicio del día. Por ejemplo, si el valor de segundos es 36000, corresponde a 10:00 am. Si no se establece ningún valor para este campo, el world seguirá el mismo ciclo día/noche que Genesis City.

**fixedAdapter**: indica qué Servicio de Comunicación debe ser usado por la escena. Por el momento solo se permite el valor `offline:offline` y cuando se establece, la escena no tendrá Servicio de Comunicación en absoluto y cada usuario que se una a ese world siempre estará solo. Si no se establece, el servidor de contenido de Worlds generará un valor apropiado basado en cómo está configurado.

**Ejemplo:**

```json
{
	"worldConfiguration": {
		"name": "my-name.dcl.eth",
		"skyboxConfig": {
			"fixedTime": 36000
		},
		"fixedAdapter": "offline:offline"
	}
}
```

### Listas de Control de Acceso (ACL)

Cuando un equipo (más de una persona) está contribuyendo al desarrollo de una escena, puede ser beneficioso que cada colaborador tenga la capacidad de publicar la escena bajo un solo NAME. Como se indicó anteriormente, el propietario del NAME es el único permitido para ejecutar tal despliegue.

Entonces se introdujo el concepto de Lista de Control de Acceso (o ACL para abreviar). La idea es que el propietario del NAME puede otorgar a otras billeteras permiso para publicar una escena bajo su NAME. De esta manera todo el equipo (o un grupo de miembros seleccionados) puede agregarse al ACL del world y esos podrán publicar la escena.

Esta ACL se almacena en el Servidor de Contenido de World donde se despliega el world. No se almacena en la blockchain. Esto lo hace mucho más flexible, dando un control más granular. Por ejemplo, si deseas desplegar una escena bajo el mismo NAME en dos proveedores de alojamiento de Servidor de Contenido de World diferentes, entonces puedes tener diferentes conjuntos de permisos en cada servidor. Y también, no hay tarifas de transacción involucradas en mantener el ACL (otorgar o revocar permisos).

Se ha agregado un nuevo comando al CLI de Decentraland que permite mostrar el ACL actual almacenado en el Servidor de Contenido de Worlds para un NAME dado, y también permite otorgar acceso a más billeteras o revocar acceso a billeteras que ya están en el ACL.

![](../../.gitbook/assets/world-acl-help.png)

Para otorgar permiso para publicar una escena a otra billetera debes:

* Asegurarte de tener la última versión del CLI de Decentraland (v3.20.0 o posterior).
* Asegurarte de poseer el NAME para el cual deseas gestionar el ACL.
* Usar el comando `dcl world-acl NAME.dcl.eth grant 0x1..` donde `0x1...` es la dirección del usuario que recibe el permiso.

Por defecto, `world-acl` actuará en `worlds-content-server.decentraland.org`. Si estás usando un proveedor de alojamiento diferente, asegúrate de agregar `--target-content https://your-hosting.com` a cada uno de los subcomandos (`show`, `grant` y `revoke`).
