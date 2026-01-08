---
description: Learn how to handle user clicks in your scene.
---

# Register Callback

The easiest way to handle button events is to register a callback function for a particular entity. Every time that entity is interacted with using a specific button, the callback function is called.

If you need to add the same behavior to multiple similar entities, consider using the [System-based](system-based-events.md) approach instead of adding callbacks to each entity. The system-based approach can result in more efficiency as you iterate over a list of similar entities.

The Register callback approach is especially useful if you want to describe a behavior that affects a single entity, as it's more straight forward.

{% hint style="warning" %}
**📔 Note**:\
For an entity to be interactive, it **must** have a [collider](../../3d-essentials/colliders.md). See [obstacles](click-events.md#obstacles) for more details.
{% endhint %}

### Pointer down

Use `pointerEventsSystem.onPointerDown()` to detect presses of a specific button.

This statement requires two parameters:

* `data`: An object that contains the following:
  * `entity`: The entity to handle
  * `opts`: An object with optional additional data:
    * `button`: Which button to listen for. See [Pointer buttons](click-events.md#pointer-buttons) for supported options. If no button is specified, then all buttons are listened to, including movement buttons like forward and jump.
    * `maxDistance`: How far away can the player be from the entity to be able to interact with this entity, in meters. If the player is too far, there will be no hover feedback and pointer events won't work.
    * `hoverText`: What string to display in the hover feedback hint. "Interact" by default.
    * `hideFeedback`: If true, it hides both the hover hint and the edge highlight for this entity. _false_ by default.
    * `showHighlight`: If true, players will see the edge highlight when hovering the cursor on the entity. _true_ by default. This value is only considered if `hideFeedback` is _false_.
* `cb`: A callback function to run each time a button down event occurs while pointing at the entity

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: myEntity,
		opts: { button: InputAction.IA_PRIMARY, hoverText: 'Click' },
	},
	function () {
		console.log('clicked entity')
	}
)
```

The above command leaves the callback function registered, and will be called as an [asynchronous functions](../../programming-patterns/async-functions.md) every time the related button event occurs.

{% hint style="warning" %}
**📔 Note**:\
Only one `pointerEventsSystem.onPointerDown` can be registered per entity. Once added, it will keep listening for events till the listener is removed. Do not run this recurrently within a system, as that would keep rewriting the pointer event behavior.
{% endhint %}

### Hover Feedback

It's very important to give players some kind of indication that an entity can be interacted with.

When registering an input action with the `EventsSystem`, by default players will see:

* An edge highlight on the entity
* A hover hint near the cursor with an icon for the button they need to press and a string that reads "Interact".

These elements can be toggled and customized.

The hover feedback on the UI displays a different icon depending on what input you select in the `button` field. On PC, it displays an icon with an `E` for `InputAction.IA_PRIMARY`, an `F` for `InputAction.IA_SECONDARY`, and a mouse for `InputAction.IA_POINTER`.

Change the string by changing the `hoverText` value. Keep this string short, so that it's quick to read and isn't too intrusive on the screen.

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: myEntity,
		opts: { button: InputAction.IA_PRIMARY, hoverText: 'Open door' },
	},
	function () {
		// open door
	}
)
```

To hide the hover hint, but leave the edge highlight, set the value of the `hoverText` to "".

```ts
pointerEventsSystem.onPointerDown(
  {entity: myEntity, opts: { button: InputAction.IA_PRIMARY, hoverText: ''}},,
  function () {
    console.log("clicked on surprise interactive item")
  }
)
```

To hide the edge highlight but leave the hover hint, set `showHighlight` to _false_.

```ts
pointerEventsSystem.onPointerDown(
	{
		entity: myEntity,
		opts: {
			button: InputAction.IA_PRIMARY,
			hoverText: 'Open door',
			showHighlight: false,
		},
	},
	function () {
		console.log('opened secret door')
	}
)
```

To hide both the hover hint and the edge highlight, set the `hideFeedback` to an true. When doing this, the cursor doesn't show any icons, text or any edge highlight.

```ts
pointerEventsSystem.onPointerDown(
  {entity: myEntity, opts: { button: InputAction.IA_PRIMARY, hideFeedback: true}},,
  function () {
    console.log("opened secret door")
  }
)
```

#### Change existing feedback

When registering an input action with the `EventsSystem`, this is creating a `PointerEvents` component and adding it to the interactive entity behind the scenes. This component handles the behavior of the UI hover hint. To change the behavior of the hover feedback, modify this component. See [Show feedback](system-based-events.md#show-feedback) for more about how to deal with this component.

```ts
const hoverFeedback = PointerEvents.getMutable(myEntity)

hoverFeedback.pointerEvents[0].eventInfo.hoverText = 'Close door'
```

### Pointer up

Use `pointerEventsSystem.onPointerUp` to register a callback function that gets called when the indicated player lets the button up while pointing at the entity.

```ts
pointerEventsSystem.onPointerUp(
	{
		entity: myEntity,
		opts: { button: InputAction.IA_PRIMARY, hoverText: 'Button up' },
	},
	function () {
		console.log('button up')
	}
)
```

This statement requires three parameters:

* `data`: An object that contains the following:
  * `entity`: The entity to handle
  * `opts`: An object with optional additional data:
    * `button`: Which button to listen for. See [Pointer buttons](click-events.md#pointer-buttons) for supported options. If no button is specified, then all buttons are listened to, including movement buttons like forward and jump.
    * `hoverText`: What string to display in the hover feedback hint. "Interact" by default.
    * `hideFeedback`: If true, it hides the hover hint for this entity.
    * `maxDistance`: How far away can the player be from the entity to be able to interact with this entity, in meters. If the player is too far, there will be no hover feedback and pointer events won't work.
* `cb`: A callback function to run each time a button up event occurs while pointing at the entity.

A same entity can have two different callbacks registered, one for `pointerEventsSystem.onPointerDown` and one for `pointerEventsSystem.onPointerUp`. The entity can only register one callback of each, [Handle multiple buttons](register-callback.md#handle-multiple-buttons) to detect different buttons on one same callback.

{% hint style="warning" %}
**📔 Note**: The hover feedback for a button up event is only displayed when the button is currently pushed down. If the player points at the entity without holding the button down, they will see no feedback, or the feedback for the button down event, if any.
{% endhint %}

### Remove callbacks

To remove a callback function, use `pointerEventsSystem.removeOnPointerDown` or `pointerEventsSystem.removeOnPointerUp`.

```ts
pointerEventsSystem.removeOnPointerDown(myEntity)

pointerEventsSystem.removeOnPointerUp(myEntity)
```

Once removed, the hover feedback on the entity should no longer be displayed, and the entity should no longer be interactive.

### Data from input action

Fetch data from an input action, such as the button that was pressed, the entity that was hit, the direction and length of the ray, etc. See ([See documentation](../../../../)) for a description of all of the data available.

To fetch this data, pass a parameter to the callback function. This parameter contains the full data structure with data about the input event.

```ts
pointerEventsSystem.onPointerDown(
	{ entity: myEntity, opts: { button: InputAction.IA_PRIMARY } },
	function (cmd) {
		console.log(cmd.hit.entityId)
	}
)
```

#### Handle multiple buttons

You can't register more than one `onPointerDown` on a single entity. Ideally you should use the [System-based](system-based-events.md) approach, as this allows you to handle as many different inputs as you wish, and display a UI hover feedback hint for each button.

As an alternative, you can use the Register callback approach and set the `button` field as `InputAction.IA_ANY`.

```ts
pointerEventsSystem.onPointerDown(
  {entity: myEntity, opts: { button: InputAction.IA_ANY}},,
  function (cmd) {
      if(cmd.button === InputAction.IA_POINTER){
        // do X
      } else if (cmd.button === InputAction.IA_PRIMARY){
        // do Y
      }
  }
)
```

This approach is not ideal, as the hover hint shows a single string and won't specify what action to activate. Note that this will make the callback function run for every input action including movement keys, so you must filter out only the actions you care about.
