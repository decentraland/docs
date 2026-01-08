---
description: >-
  Usa el patrón de game object para hacer tu código más legible y más fácil de
  escalar.
metaLinks:
  alternates:
    - >-
      https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/scenes-sdk7/programming-patterns/game-objects
---

# Game Objects

A medida que tu escena se vuelve más complicada, es útil poner parte de la lógica en archivos de game object separados. Al hacer esto, puedes mantener el código principal de la escena limpio y simple de leer, mientras encapsulas partes reutilizables que controlan varias entidades en la escena.

Un Game Object contiene todas las propiedades y métodos para un tipo de entidad que podrías encontrar en tu escena, por ejemplo una puerta o un botón o un monstruo. Gracias a esta abstracción, los archivos con la lógica principal de tu escena pueden instanciar game objects completos a través de solo una línea de código. También puedes llamar a los métodos en estos objetos con la misma facilidad.

Recomendamos mantener las definiciones de game object cada una en un archivo separado.

### El Patrón Type Object

Si tu escena usa varios tipos de game objects que tienen mucho en común, puede que quieras llevar este refactor incluso más lejos, y definir un game object _base_ con todas las cosas que estos tienen en común. Luego puedes crear subclases que hereden de esta clase base.

Puedes leer más sobre este patrón en [Game Programming Patterns](http://www.gameprogrammingpatterns.com/type-object.html).
