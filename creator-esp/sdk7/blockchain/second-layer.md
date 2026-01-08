---
description: >-
  Usa la sidechain de Polygon en tu escena para habilitar transacciones
  blockchain mucho más rápidas y baratas.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/blockchain/second-layer
---

# Second Layer

### Acerca de las soluciones de second layer

Cualquier transacción que afecte al blockchain toma tiempo en completarse, y cuesta gas. Ambas cosas son obstáculos para hacer que los juegos blockchain sean populares, porque los jugadores usualmente no tienen la paciencia para esperar tanto tiempo para que sus acciones tengan efecto, y no están dispuestos a gastar dinero en muchas transacciones mientras juegan.

Una solución común es mantener la mayor parte del gameplay off-chain, y solo llevar a cabo transacciones blockchain para eventos clave, como ganar un objeto del juego o registrar un puntaje alto.

Sin embargo, otra forma de superar estas limitaciones, así como otros problemas de escalabilidad que son inherentes a los blockchains, es confiar en un blockchain de _second layer_, también llamado _side-chain_.

Un second layer es otro blockchain que se sitúa como intermediario entre una aplicación descentralizada y la cadena principal. Esta capa es más ligera y por lo tanto puede proporcionar respuestas más rápidas y a un costo de gas mucho menor.

En lugar de hacer transacciones directamente en la cadena principal, las transacciones se hacen en la side chain, y luego es el deber de la side-chain eventualmente sincronizar estos cambios con la cadena principal.

La side-chain es capaz de proporcionar respuestas más rápidas porque es una red más pequeña con menos nodos. Las transacciones que se llevan a cabo en el second layer son inicialmente menos seguras, pero eventualmente se comprometen a la cadena principal en bloques, y todas las verificaciones de seguridad de la cadena principal se pueden hacer cumplir allí.

La side-chain también es capaz de reducir significativamente los costos de transacción individuales porque agrupa muchas transacciones en una sola al sincronizar con la cadena principal. Por lo que el gas que se necesitaría pagar por una transacción en la cadena principal se puede dividir entre varios miles de transacciones.

Además, al sincronizar con la cadena principal, varias transacciones redundantes se pueden evitar por completo, reduciendo aún más los costos de transacción. Por ejemplo, si Alice transfiere 1 ETH a Bob, y luego Bob transfiere 1 ETH a Carol, entonces esas dos transacciones se pueden simplificar en una, registrando que Alice transfiere directamente a Carol.

Decentraland tiene una asociación con [Polygon](https://polygon.technology/), quienes proporcionan su propia side-chain en Ethereum. Su side-chain puede ser usada por escenas para soportar transacciones rápidas y muy baratas.

### Prueba el Testnet de Polygon

Para usar el Matic Testnet de Polygon, primero debes tener:

* Ether en la red Sepolia. Puedes obtenerlo gratis de varios faucets externos como [este](https://www.alchemy.com/faucets/ethereum-sepolia).

Luego debes configurar tu cuenta de Metamask para incluir el Matic Testnet.

Para hacer esto:

1. Cambia de redes en Metamask haciendo clic en el nombre de la red actual y seleccionando _Custom RPC_ en la parte inferior del dropdown.
2. Completa 'Matic Testnet' como _Network name_ y [**https://rpc-amoy.polygon.technology**](https://rpc-amoy.polygon.technology) como _New RPC URL_ y el mismo valor como _Block Explorer URL_. Para _Symbol_ establece **MATIC**
3. Haz clic en 'Save' para agregar esta nueva red a Metamask.

{% hint style="warning" %}
**📔 Nota**: Aprende más sobre cómo configurar Matic en su [página de Documentación](https://docs.matic.network/docs/develop/getting-started)
{% endhint %}
