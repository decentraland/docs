---
description: ¿Cuántas cosas puedo poner en mi escena?
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/optimizing/scene-limitations
---

# Limitaciones de Escena

Para mejorar el rendimiento en el metaverso, hemos establecido un conjunto de límites que cada escena debe seguir. Estos límites son por parcela. Entonces, cuanto más grande es la escena, más altos se establecen estos límites.

Al trabajar con el [Creator Hub](../scene-editor/get-started/editor-installation.md), puedes ver estadísticas sobre los recursos usados por modelos 3D en tu escena, junto con los límites para tu escena.

Puedes expandir este menú para ver detalles.

{% hint style="info" %}
**💡 Tip**: Para una tabla de referencia de todos los números específicos por conteo de parcelas, consulta:

[Tabla de referencia](https://docs.google.com/spreadsheets/d/1BTm0C20PqdQDAN7vOQ6FpnkVncPecJt-EwTSNHzrsmg/edit#gid=0)
{% endhint %}

### Reglas de limitación de escena

A continuación están el número máximo de elementos que una escena puede renderizar al mismo tiempo:

> _n_ representa el número de parcelas que una escena ocupa.

* **Triangles:** `n x 10000` Cantidad total de triángulos para todos los modelos en la escena.
* **Entities:** `n x 200` Cantidad de entidades en la escena.
* **Bodies:** `n x 300` Cantidad de meshes en la escena.
* **Materials:** `log2(n+1) x 20` Cantidad de materiales en la escena. Incluye materiales importados como parte de modelos.
* **Textures:** `log2(n+1) x 10` Cantidad de texturas en la escena. Incluye texturas importadas como parte de modelos.
*   **Height:** `log2(n+1) x 20` Altura en metros.

    > Importante: Solo las entidades que se están renderizando actualmente en la escena se cuentan para estos límites. Si tu escena cambia entre modelos 3D, lo que importa son los modelos renderizados en cualquier momento, no la suma total. Los avatares de los jugadores y cualquier ítem traído por un jugador desde fuera de la escena no cuentan para calcular estos límites.
* **Total file size:** En Genesis City -`15 MB por parcela - 300 MB max`. Para Worlds, consulta [World size](scene-limitations.md#world-size). Tamaño total de los archivos subidos al servidor de contenido. Incluye modelos 3D y audio. No incluye archivos que no se suben, como paquetes de node.js. Puedes ver la lista completa de archivos siendo publicados y sus tamaños antes de confirmar un despliegue.
* **File count:** `200 archivos por parcela` Conteo total de los archivos subidos. Incluye modelos 3D y audio. No incluye archivos que no se suben, como paquetes de node.js.
* **Max file size** `50 MB por archivo` Ningún archivo individual de cualquier tipo en la escena puede exceder 50 MB. Las escenas pequeñas están restringidas aún más porque el archivo no debe exceder su límite de Tamaño Total de Archivo (Por ejemplo, una escena de una sola parcela está limitada a 15 MB total).

{% hint style="info" %}
**💡 Tip**: No todos los archivos en la carpeta de tu proyecto de escena cuentan para el límite de tamaño de archivo, solo aquellos que se suben a servidores. Todo el contenido de la carpeta _node\_modules_, que es muy grande, son dependencias que no se suben y por lo tanto no cuentan. Lo mismo aplica a cualquier archivo en la carpeta `/src`, ya que el código fuente no se sube.

Puedes listar cualquier otro archivo o carpeta que quieras excluir de ser subidos en el archivo `.dclignore` en tu proyecto.
{% endhint %}

### Optimización

Consulta [Optimización de Rendimiento](../sdk7/optimizing/performance-optimization.md) para consejos sobre cómo puedes mantener tu escena por debajo de estos límites y hacer que funcione más suavemente para los jugadores.

### Límites de escena

Al ejecutar una vista previa, cualquier contenido que esté ubicado fuera de los límites de la parcela se resalta en rojo cuando se renderiza. Si algún contenido está fuera de estos límites, esa parte de tu contenido no se renderizará cuando los jugadores visiten tu escena.

Si la punta de un objeto grande sale de los límites, esta punta será cortada del objeto.

Una escena de una sola parcela mide 16 metros x 16 metros. Si la escena tiene múltiples parcelas, las dimensiones varían dependiendo del arreglo de las parcelas.

Es posible posicionar entidades bajo tierra, para ocultarlas o para tener solo una porción de ellas emergiendo. Una escena no puede tener túneles que vayan por debajo de la altura del suelo predeterminado, los jugadores no pueden viajar por debajo de la altura `y = 0`.

### Limitaciones de shader

Los modelos 3D usados en decentraland deben usar shaders y materiales soportados. Consulta [materiales de modelos 3D](../3d-modeling/materials.md) para una lista de shaders soportados.

### Iluminación

Las condiciones de iluminación de la escena no pueden cambiarse para todos los jugadores desde la configuración predeterminada, aunque cada jugador individual es libre de cambiar su propia configuración de skybox desde la UI del Explorer.

### Restricciones de tamaño de textura

Los tamaños de textura deben usar números de ancho y alto (en píxeles) que coincidan con los siguientes números:

```
1, 2, 4, 8, 16, 32, 64, 128, 256, 512 1024
```

> Esta secuencia está compuesta de potencias de dos: `f(x) = 2 ^ x` . 512 es el número máximo que permitimos para un tamaño de textura. Este es un requisito bastante común entre otros motores de renderizado, está ahí debido a optimizaciones internas de los procesadores gráficos.

El ancho y el alto no necesitan tener el mismo número, pero ambos deben pertenecer a esta secuencia.

**El tamaño recomendado para texturas es 1024x1024**, hemos encontrado que este es el tamaño óptimo para ser transportado a través de redes domésticas y para proporcionar experiencias de carga/calidad razonables.

Ejemplos de otros tamaños válidos:

```
32x32
64x32
512x256
512x512
1024x1024
```

{% hint style="warning" %}
**📔 Nota**: Aunque las texturas de tamaños arbitrarios a veces funcionan, también a menudo se renderizan con bugs y son más inestables. Aconsejamos fuertemente que todas tus texturas coincidan con estos tamaños.
{% endhint %}

### Tamaño de World

Los [Worlds](../worlds/about.md) de Decentraland tienen limitaciones diferentes, ya que se cargan como escenas individuales.

* Los Worlds publicados a Decentraland NAMEs tienen al menos `100 MB`. Ese número puede aumentarse poseyendo NAMEs adicionales, LAND, y MANA en esa misma cuenta.
* Los Worlds publicados a dominios ENS tienen un límite de `25MB` que no puede expandirse.

Consulta [Límite de Tamaño de Worlds](../worlds/about.md#worlds-size-limit) para más detalles.

Tamaño total de los archivos subidos al servidor de contenido. Incluye modelos 3D y audio. No incluye archivos que no se suben, como paquetes de node.js. Puedes ver la lista completa de archivos siendo publicados y sus tamaños antes de confirmar un despliegue.

Todos los demás límites en worlds son por parcela, incluyendo triángulos, materiales, etc. Ya que agregar más parcelas a un world es gratuito, puedes agregar hasta 300x300 parcelas (90,000 en total) a tu escena, y tener los límites correspondientes a ese conteo de parcelas.
