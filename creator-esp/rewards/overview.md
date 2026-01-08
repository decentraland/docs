---
metaLinks:
  alternates:
    - https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/rewards/overview
---

# Resumen

La [dApp de Rewards](https://decentraland.org/rewards/) es una herramienta poderosa que permite a los creadores recompensar a los usuarios con Wearables o Emotes de Decentraland a través de solicitudes HTTP. Puede usarse para motivar usuarios, promover escenas o aumentar la retención. Las recompensas pueden otorgarse directamente desde una escena, un servidor, o en [quests](../../creator/deprecated/quests/overview.md).

El sistema de Rewards gestiona la mayoría de las complejidades involucradas en acuñar artículos en la blockchain, incluyendo:

* Agrupar múltiples artículos acuñados en una sola transacción para reducir el tiempo de espera y las tarifas
* Manejar el pago de tarifas de transacción
* Gestionar reintentos en caso de fallas de blockchain o reordenamientos
* Limitar el número de artículos acuñados por dirección de usuario
* Minimizar exploits de automatización a través de un sistema de captcha
* Verificar la presencia del usuario en la escena a través de nodos Catalyst
* Monitorear el estado de las transacciones
* Informar a los usuarios sobre el artículo que recibirán antes de que se confirme la transacción
* Emite Notificaciones cuando las recompensas son otorgadas y recibidas
* ![](../../.gitbook/assets/overview.png)

### Limitaciones

Aunque el servicio ofrece algunas protecciones de automatización para evitar que una persona acuñe wearables masivamente, es imposible estar 100% seguro contra exploits. **NO se recomienda usar Rewards para acuñar Wearables/Emotes con un nivel de rareza más escaso que \[EPIC]\(**[**Ver documentación**](../)**#rarity) (100 o menos copias)**.
