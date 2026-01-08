---
description: Cómo obtener LAND o permisos para publicar tu escena
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/publishing/publishing-options
---

# Opciones de Publicación

Para invitar a otros a visitar una escena que construiste, necesitarás publicarla en Decentraland. Para hacer esto, necesitarás tener permisos de despliegue a parcelas de Decentraland o poseer un nombre de Decentraland para desplegar en un World de Decentraland.

Decentraland está compuesto por _parcelas_ de LAND, cada una de 16 metros por 16 metros. Una _escena_ es una experiencia que está construida en una o varias parcelas.

Este documento da una descripción general sobre las diferentes formas de obtener permisos. Consulta [publicación](../sdk7/publishing/publishing.md) para obtener instrucciones sobre cómo publicar una vez que hayas obtenido estos.

### Opciones de permiso de LAND

Para publicar en LAND en Genesis City, puedes hacer lo siguiente:

* **Rentar LAND**: Compra el derecho a desplegar y mantener tu contenido en ciertas parcelas por un período de tiempo fijo. Consulta [Rentals](../marketplace/rentals.md).
* **Comprar land**: Compra parcelas de land, y publica tu contenido durante el tiempo que desees. Consulta [marketplace](../marketplace/marketplace.md).
* **Obtener permisos de un propietario**: Varios propietarios de land y distritos gestionan grandes extensiones de land y están dispuestos a alojar gratuitamente contenido de otros si se ajusta a su tema y al tipo de entorno que quieren crear. Conéctate con ellos en el [servidor de Discord de Decentraland](https://dcl.gg/discord).
* **Worlds**: También puedes desplegar una escena independiente como un World de Decentraland. Los Worlds existen fuera de la cuadrícula de Genesis City, y pueden accederse por nombre. Consulta [worlds](../worlds/about.md)

{% hint style="warning" %}
**📔 Nota**: También puedes desplegar escenas en un servidor de prueba donde no hay jugadores alrededor. Los mismos permisos por parcela aplican al desplegar en el servidor de prueba, consulta [publicación](../sdk7/publishing/publishing.md#the-test-server) para más detalles.
{% endhint %}

### Worlds de Decentraland

Si posees un NAME de Decentraland también puedes publicar tu escena en un World de Decentraland. Esta opción cuesta considerablemente menos que comprar land, un NAME cuesta 100 MANA.

Dentro de un World, se te permite usar tantas parcelas como desees. El límite de tamaño de tu escena en MegaBytes depende de cuántos NAMES, MANA, L1 Wearables y otros tokens poseas.

Consulta [Worlds](../worlds/about.md) para más información.

### Obtener fondeo del DAO

Si tienes una gran idea y los medios para lograrla, pero necesitas financiamiento, puedes solicitar una grant en el DAO. Si la propuesta convence a suficientes personas de la comunidad para votar por ella, puedes obtener una suma de dinero para lograr tu visión, incluyendo fondos para comprar o rentar LAND.

Consulta [Community grants](../archive/grants/community-grants.md).

### Cómo funcionan los permisos de land

Los tokens LAND pueden gestionar permisos que permiten los siguientes tipos diferentes de roles para desplegar en una parcela o estate en particular.

* **Propietario de LAND**: La persona que posee el token en su wallet de Ethereum. Este usuario siempre puede desplegar, asignar otros roles, o transferir el token (a menos que el land esté actualmente rentado por otra persona).
* **Operador de LAND**: El operador solo puede desplegar, mientras mantenga este rol. La dirección del operador es referenciada por el token, sin necesidad de poseer nada. El propietario puede asignar y revocar permisos de operador a cualquier número de direcciones. Consulta [Dar permisos](../marketplace/land-manager.md#give-permissions).

Al rentar un land, el inquilino que paga la renta puede elegir una sola dirección que tendrá un rol de **Operador de LAND** durante la duración de la renta (puede ser su propia dirección, o la de otra persona). Mientras la renta está activa, ninguno de los poseedores originales de roles puede interferir con el contenido en ese LAND o transferir el token.
