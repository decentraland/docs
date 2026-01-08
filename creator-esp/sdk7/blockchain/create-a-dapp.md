---
description: Referencia para crear tu propia Aplicación Descentralizada
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/blockchain/create-a-dapp
---

# Crear una dApp

Puedes crear tus propias aplicaciones descentralizadas (dApps) para interactuar con los smart contracts de Decentraland y exponer su funcionalidad de formas más elaboradas y amigables.

### Qué es una dApp

Una aplicación descentralizada, o dApp, es una que se ejecuta en una red peer to peer distribuida en lugar de desde un servidor central.

En el contexto del blockchain, una dApp usa smart contracts y posiblemente una red P2P, en lugar de un servicio de API Web. Una dApp también puede exponer un front end y cachear información del blockchain temporalmente, pero su output se refleja en última instancia on-chain.

Consulta [este sitio](https://blockchainhub.net/decentralized-applications-dapps/) para obtener una descripción más completa sobre las dApps.

### Smart contracts de Decentraland

Decentraland ha escrito y mantiene una serie de smart contracts que interactúan con los tokens de LAND y MANA.

Los tokens de LAND y MANA en sí están definidos por los contratos _LANDregistry_ y _MANAtoken_ respectivamente. La lista también incluye contratos más específicos como crear un estate de varias parcelas o hipotecar parcelas.

* [Smart contracts de Decentraland](https://contracts.decentraland.org/addresses.json): Puedes encontrar una lista completa de cada uno de nuestros contratos y sus direcciones.

Ten en cuenta que cada contrato tiene una versión de producción en _mainnet_ y una versión de prueba en _sepolia_ y que cada una tiene una dirección diferente.

Puedes leer el código completo de cada contrato, ya que es información pública en el blockchain. Por ejemplo, puedes encontrar el contrato por nombre en [Etherscan](https://etherscan.io/contractsVerified) para leer su contenido.

### Código boilerplate para dApp

* [Código boilerplate](https://github.com/decentraland/dapp-boilerplate): Este código boilerplate puede ser un gran punto de partida para construir tu propia dApp.

### Librerías de ayuda

Mientras construíamos nuestras propias dApps internamente, reunimos algunas librerías de ayuda que también podrías encontrar útiles.

* [Decentraland-eth](https://github.com/decentraland/decentraland-eth): Esta es una librería de bajo nivel con funciones de utilidad para trabajar con el blockchain de Ethereum.
* [Decentraland-dapps](https://github.com/decentraland/decentraland-dapps): Esta es una librería de nivel superior con módulos comunes para dApps. Los módulos en esta librería están construidos usando `Decentraland-eth`.
* [Decentraland UI](https://ui.decentraland.org/): Esta librería contiene una selección de elementos de UI reutilizables que se incluyen en los proyectos de Decentraland.

### dApps de muestra

A continuación hay enlaces al código completo de varias dApps que construimos alrededor de Decentraland, estas podrían ayudarte a construir la tuya:

* [Gate](https://github.com/decentraland/gate): Esta dApp básica crea un NFT de invitación que se usó cuando Decentraland estaba en una etapa de beta cerrada. En los primeros días, los jugadores en whitelist que tenían este NFT eran los únicos capaces de entrar al metaverso.
* [Marketplace](https://github.com/decentraland/marketplace): Esta es la aplicación completa que ejecuta el [Marketplace](https://market.decentraland.org/) de Decentraland. Para que funcione rápido, requiere una base de datos y un servidor backend conectado a la red de Ethereum para crear índices con información sobre LAND.

### Framework de pruebas para dApp

Antes de lanzar tu dApp a producción, recomendamos probarla primero.

* [dAppeteer](https://github.com/decentraland/dappeteer): Reunimos este framework para ayudarte a ejecutar pruebas en tu dApp.

### Smart contracts de Decentraland

En el siguiente enlace puedes encontrar una lista de smart contracts de Ethereum relevantes para el ecosistema de Decentraland. La lista incluye los contratos en mainnet así como en otras redes de prueba de Ethereum.

[contracts.decentraland.org](https://contracts.decentraland.org/links)
