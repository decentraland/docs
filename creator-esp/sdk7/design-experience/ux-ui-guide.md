---
description: >-
  ¡Consejos y prácticas para construir escenas donde los jugadores querrán
  quedarse y regresar!
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/design-experience/ux-ui-guide
---

# Guía de UX & UI

Es de vital importancia para nosotros que los creadores de contenido de Decentraland sean libres de hacer uso de su creatividad en su máxima extensión. Esto es esencial para que Decentraland se convierta en un lugar gratificante para explorar. Sin embargo, también es importante tener en cuenta que las escenas en Decentraland serán visitadas por una amplia variedad de usuarios y queremos hacer que las escenas sean accesibles para todos ellos. Debido a esto, no podemos ignorar la necesidad de establecer criterios de diseño unificados, una guía que pueda garantizar que los jugadores se encontrarán con una experiencia homogéneamente intuitiva y agradable, sin importar en qué escena se encuentren.

En este documento compartimos los Valores de Diseño de Decentraland, con el objetivo de promover lo que consideramos son las mejores prácticas para diseñar la interfaz y experiencia para los jugadores. Esperamos que estos criterios puedan servir como punto de partida para construir y/o mejorar las escenas que conforman el Metaverso.

### Valores de diseño

Todas las escenas en Decentraland deben diseñarse teniendo en cuenta estos valores:

* **Acogedora**: El jugador se siente calurosamente bienvenido.
* **Amigable con el usuario**: La UI es fácil y divertida de usar – debes evitar reinventar la rueda
* **Fácil de aprender**: Los jugadores encuentran la UI familiar e intuitiva. Los patrones deben usarse consistentemente en toda la escena.
* **Proporciona orientación**: La escena proporciona una mano de ayuda. El texto, movimiento, sonido y gráficos guiarán e insinuarán a los jugadores en la dirección correcta.
* **Reactiva**: Clara acción-reacción a la entrada de los jugadores.
* **Minimalista**: Menos es más. Los jugadores pueden enfocar su atención en lo que importa.
* **Interesante**: La escena aprovecha las cosas que hacen a Decentraland único y digno de visitar.
* **Propositiva**: Los jugadores tienen una razón fuerte para volver.
* **Agradable**: Los jugadores disfrutan cómo se ven, suenan y sienten las cosas

### Experiencia de usuario

#### ¿Por dónde empezar?

¿Cuál es el objetivo de tu escena? ¿Es ofrecer un paisaje hermoso para contemplar y explorar? ¿Es un museo? ¿Es un juego de un solo jugador? ¿Uno competitivo? ¿O sigue un flujo narrativo lineal?

Es importante estar bien consciente de este objetivo en cada paso del proceso de diseño, debe guiar todas tus decisiones, todas las cuales pueden afectar profundamente la experiencia del visitante.

Para escenas que siguen un flujo lineal, donde cada paso depende del anterior, recomendamos cercar la escena y establecer uno o múltiples puntos de entrada fijos, para evitar que los jugadores tropiecen con cosas en el orden incorrecto. Por cierto, los puntos de entrada son un lugar excelente para mostrar un mensaje para dar la bienvenida al jugador y explicar cuál debe ser su objetivo en la escena.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-instructions.png" alt="Banner en el mundo" width="300"><figcaption><p>Instrucciones en el mundo</p></figcaption></figure>

Si la experiencia del jugador en tu escena no está destinada a ser lineal, pero aún necesitas proporcionar algunas instrucciones básicas para asegurar que la disfruten completamente, puedes mostrar instrucciones en un pop-up. Es posible mostrar un popup en la pantalla del jugador tan pronto como entren, independientemente de la dirección de la que vengan, y de esa manera asegurarte de que los jugadores siempre sepan lo esencial.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-banner.png" alt="Banner pop-up" width="300"><figcaption><p>Instrucciones pop-up</p></figcaption></figure>

{% hint style="warning" %}
**📔 Nota**: Asegúrate de que el popup no sea demasiado intrusivo y que sea fácil de cerrar haciendo clic en cualquier lugar.
{% endhint %}

Un mensaje de bienvenida debe comunicar lo siguiente al jugador:

* El título de la escena
* Dar la bienvenida al jugador
* Objetivo final y motivación para el jugador
* Instrucciones/Próximos pasos
* _(Opcional)_ Controles. Principalmente útil si tu escena usa eventos de botón globales. De lo contrario, los objetos mismos indican cómo usarlos al pasar el cursor sobre ellos.

#### Motivación

¡Probablemente querrás que tus visitantes sigan regresando a tu escena, piensa en formas en las que puedes motivarlos a hacerlo! Pregúntate "¿Qué haría que un jugador quiera regresar a mi escena, o quiera recomendarla a un amigo?"

Por ejemplo, puedes desafiarlos, dándoles algo que lograr que será lo suficientemente difícil como para tomar varios intentos. También puedes organizar eventos multijugador competitivos, que también son una oportunidad interesante para socializar. ¡Haz que tu escena sea un lugar dinámico donde los jugadores sientan que disfrutan pasar tiempo allí!

#### Retroalimentación y Sonido

¡El sonido juega un doble papel clave, no te pierdas de usarlo! Por un lado, es vital para generar inmersión, muchas cosas no se sentirán reales si no están acompañadas de sonido. La otra cosa crucial para la que sirve el sonido es proporcionar retroalimentación a las acciones de un jugador. Si confías solo en señales visuales, no puedes estar seguro de que un jugador estará mirando en la dirección correcta para ver los efectos de sus acciones. A través del uso de sonido, puedes asegurar que estén conscientes de que algo sucedió. Si usas señales visuales y de sonido en combinación, escuchar el sonido invita al jugador a buscar la señal visual, en caso de que no la hayan visto.

Ten en cuenta que algunos jugadores podrían estar jugando con su sonido apagado. Si estás usando el sonido como una forma de proporcionar instrucciones de la escena o una pieza clave en las mecánicas del juego, intenta también proporcionar algo visual que indique en la misma dirección. Por ejemplo, podrías mostrar texto en la parte inferior de la UI para acompañar estos sonidos, como subtítulos en una película.

### Interfaz de Usuario

Esta sección está destinada a ayudarte a construir una narrativa a través del diseño de tu escena que dirija el enfoque del jugador a los elementos que más importan. Hacer un buen uso de las herramientas descritas aquí puede hacer que su experiencia sea mucho más inmersiva y exitosa.

No podemos subestimar lo valiosos que son el color, los íconos, el movimiento y la escala para enviar el mensaje correcto: todo en la escena transmite un significado, recuerda eso.

#### Layout

Ten cuidado al colocar tu UI en regiones de la pantalla que se superponen con los elementos predeterminados de la UI de Decentraland. La UI predeterminada de Decentraland, incluyendo minimapa, chat, etc., está diseñada para cubrir solo el 25% izquierdo de la pantalla. El resto del espacio de la pantalla es una zona segura, libre para usar por los creadores de contenido.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/UI-Zones.png" alt="Regiones de pantalla usadas por la UI" width="300"><figcaption></figcaption></figure>

No hay restricciones para colocar elementos de UI en el 25% izquierdo de la pantalla, pero ten en cuenta que el explorador está continuamente haciendo cambios y mejoras a su diseño. Cualquier espacio que no esté ocluido en esa región hoy podría estar cubierto en futuras versiones.

{% hint style="warning" %}
**📔 Nota**: Los elementos de UI de escenas y smart wearables siempre aparecen en una capa detrás de la UI predeterminada de Decentraland.
{% endhint %}

Siempre ten una cuadrícula en mente y úsala como tu criterio principal al organizar espacialmente tu UI. Si estás trabajando en una escena donde se necesita un HUD, puedes comenzar poniendo todos los consumibles juntos (por ejemplo, moneda, comida, vida), y en el otro lado los almacenables como herramientas o armas. Intenta ser consistente sobre las métricas de la cuadrícula y el padding. Haz que la retroalimentación para cada acción del jugador sea clara.

#### Color

Es importante elegir una paleta de colores, ya que esto le da a tu escena una identidad y también señala relaciones y jerarquía entre elementos.

Al crear una paleta de colores, comienza seleccionando un color principal, y opcionalmente uno secundario. Luego debes decidir si quieres que la paleta sea análoga, complementaria o triádica, etc., en relación con ese color principal.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-color-wheel2.png" alt="Paleta de colores cromática" width="300"><figcaption><p>Paleta de colores cromática</p></figcaption></figure>

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-color-wheel.png" alt="Estrategias para combinar colores adecuadamente" width="300"><figcaption><p>Estrategias para combinar colores adecuadamente</p></figcaption></figure>

{% hint style="info" %}
**💡 Tip**: Generadores de paletas de colores gratuitos que recomendamos: [Coolors](https://coolors.co), [Adobe Color CC](https://color.adobe.com/), [Colour Lovers](http://www.colourlovers.com), [Color Hunt](http://www.colorhunt.co), [Color by Hailpixel](http://color.hailpixel.com), [Colour Code](http://colourco.de), [Sip](https://sipapp.io/), [Color Scheme Designer by Paletton](http://paletton.com), [Cohesive Colors](http://javierbyte.github.io/cohesive-colors), [Colr](http://www.colr.org)
{% endhint %}

El color principal debe ser el más frecuentemente usado en tus componentes de UI. Si tu paleta no tiene un color secundario, puedes acentuar elementos combinando el color principal con negro o blanco. Tener un color secundario no es obligatorio, pero ayuda a enfatizar y distinguir tus elementos de UI de la escena. Los colores secundarios funcionan mejor para resaltados, controles de selección (sliders y switches), enlaces y titulares.

Recuerda que cada color tiene sus propias cualidades expresivas únicas, aprovecha eso para comunicar mensajes a través de ellos. Por ejemplo, el rojo a menudo se asocia con connotaciones negativas mientras que el verde se asocia con connotaciones positivas.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-switches.png" alt="Switches coloreados" width="300"><figcaption><p>Usar el color de manera incorrecta puede ser confuso</p></figcaption></figure>

También puedes usar colores estratégicamente para indicar cambios de estado, por ejemplo cambiando el color de un elemento para indicar si está activo o inactivo.

{% hint style="warning" %}
**📔 Nota**: Los estados comunican el estatus de los elementos de UI. Los estados de un elemento deben mantener una cierta continuidad, pero deben tener affordances claras y ser fácilmente distinguibles de otros estados y del layout circundante.
{% endhint %}

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-active-button.png" alt="Botón activo inactivo" width="300"><figcaption><p>Usar color para estados de botones</p></figcaption></figure>

¡Advertencia! Al seleccionar colores que se mostrarán en superposición, ten especial cuidado de asegurarte de que sean legibles cuando se usan juntos. Aquí hay una regla fundamental: los colores de los elementos que se muestran juntos siempre deben tener mucho contraste entre ellos. Ten en cuenta que algunos jugadores podrían estar mirando sus pantallas bajo condiciones de iluminación subóptimas, lo que hace que la lectura sea más difícil.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-icons.png" alt="Contraste de íconos" width="300"><figcaption><p>Ambos íconos se pueden distinguir, pero el primero tiene mejor contraste. Se vuelve más fácil de leer y requiere menos esfuerzo para entender.</p></figcaption></figure>

#### Jerarquía tipográfica

Intenta definir al menos una escala de 3 tipos para Títulos, Subtítulos y Cuerpo. Ten cuidado con el uso del color y el tamaño de fuente. Todos los tamaños de fuente deben ser de 12 px o más grandes.

Si vas a colocar texto que se muestra sobre imágenes (o sobre el mundo), seguramente necesitarás experimentar con su legibilidad. En esos casos, sugerimos que agregues una región sólida coloreada, en una capa entre el texto y las imágenes, de esa manera puedes asegurar que el texto permanezca legible.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-text-over-images.png" alt="Texto sobre imágenes" width="300"><figcaption><p>Prioriza la legibilidad</p></figcaption></figure>

#### Íconos

Los íconos sintetizan información, ayudándote a identificar acciones a través de imágenes. Son una herramienta increíblemente poderosa para proporcionar entrada que puede interpretarse rápidamente, en oposición a usar texto para etiquetar cosas, lo que demanda más atención y tiempo del jugador. También es útil mostrar íconos en combinación con texto, ya que esto ayuda a desambiguar sus significados.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-icons2.png" alt="Ejemplos de íconos" width="300"><figcaption><p>Usa íconos como un lenguaje universal</p></figcaption></figure>

#### Movimiento

Usa el movimiento para proporcionar retroalimentación y liderar el camino cuando sea necesario. El movimiento ayuda a los jugadores a enfocar su atención y ayuda a mantener la continuidad a medida que la UI cambia.

<figure><img src="https://github.com/decentraland/docs-creator/blob/main/images/media/ux-glow.png" alt="Agregar brillo" width="300"><figcaption><p>Usa partículas, escala o márgenes que se desvanecen para hacer que las cosas destaquen</p></figcaption></figure>

#### Escritura y estructura de contenido

El texto de la UI puede hacer que las interfaces sean más utilizables y da a los jugadores más confianza en sus acciones. Siempre haz que el texto de la UI sea lo más conciso posible. Los jugadores están allí para jugar, no para leer. Cualquier texto que parezca demasiado largo no será leído por la mayoría de los jugadores.

Recibe a tus jugadores con un Mensaje de Bienvenida y cuéntales el objetivo de la escena. Comienza aclarando su objetivo en la escena, luego las acciones necesarias para lograrlo. Luego puedes revelar información progresivamente a medida que se necesite, de esta manera los jugadores no se sentirán abrumados al principio de la experiencia. Al igual que con los recursos gráficos, intenta usar palabras consistentes en tus características de UI y narrativa.

SDK Nuevas Funciones - ¡Próximamente!

Interacciones con objetos Ahora no es posible que los jugadores sepan qué objetos son interactivos y cuáles no, hasta que realmente hacen clic o presionan botones en ellos. Hemos estado trabajando en una nueva función para que los creadores puedan mostrar mensajes toast personalizados al apuntar a un objeto interactivo. Este mensaje transmite qué entrada usar y puede tener texto personalizado para describir los efectos de interactuar con él. Recomendamos encarecidamente que lo uses cuando se lance, tu escena se sentirá más natural y fácil de usar.

Cámara en tercera persona Actualmente estamos experimentando con agregar soporte para una cámara en tercera persona. Puedes probarlo en el explorador presionando la tecla 'V'. (Nota, aún no es compatible en una vista previa de escena). ¡Puedes comenzar a pensar en desarrollar nuevas experiencias o juegos increíbles que podrían ser mucho más atractivos gracias a una cámara en tercera persona!
