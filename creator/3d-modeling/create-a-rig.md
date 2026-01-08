---
description: Learn How To Create a Rig for Characters in Decentraland.
---

# Create a Rig

This document shows how to set up a basic rig in Blender. If you want to get more familiar with some rigging concepts, check out [The Rig: Basic Concepts](https://docs.decentraland.org/creator/emotes/avatar-rig/).

#### Adding the Armature

First of all, you’ll need to import your 3D model into Blender or, if you did it in Blender already, just open your blend file. In object mode, press `Shift+A` and select _**Armature**_ on the menu, like show below. Then, in _**Object Data Properties**_, under _**Viewport Display**_, toggle _**In Front**_, so you can see the bone through the mesh. Mesh and armature should be aligned, so make sure the model is well positioned in the center of the world before adding the bones. The origin of the armature should be at 0,0,0 (X,Y,Z).

![](../../.gitbook/assets/01_add_armature.gif)

_Adding an armature and showing it through the mesh._

#### Editing the Armature

After adding the Armature object, select it and go to _**Edit Mode**_. Here is where you add the other bones by extruding the original one (press `E`), duplicating it (`Shift+D`) or simply adding a new one with `Shift+A`. The skeleton should follow the shape of the model, like a real skeleton. Bones can be scaled, grabbed and rotated and they have two parts: the head and the tail. The head is the pivot point, which means that rotations and scale will start from there. That also means that it’s where the mesh deformation will happen, so position the bones as centered in the mesh as possible.

![](../../.gitbook/assets/02_bone_head_tail.png)

_Bone structure._

![](../../.gitbook/assets/03_bone_pivot_rotation.gif)

_Bone rotating from its pivot point._

There’s no need to worry about creating bones for the right and left side for now. Focus on creating only one side first.

#### Renaming the Bones

Something really important to keep in mind is renaming all your bones properly, according to [Blender’s naming convention](https://docs.blender.org/manual/en/latest/animation/armatures/bones/editing/naming.html). This will not only keep everything organized, but also make it possible to mirror poses and weight paint. You could just rename it as the body part it represents, like Spine\_01 or your could be more specific and call it DEF\_spine.001 (DEF stands for deforming bone, so you kow that this bone is from the deforming hierarchy).

#### Bone Orientation

Before moving on, you should check your bone orientation. You can do that by going to _**Object Data Properties**_ and under _**Viewport Display**_, toggle _**Axes**_. This will make the bones’s axes visible, so you can check if they are going to rotate in the proper direction.

The axes should be aligned with the direction in which you want the bones to rotate. If it feels a little off, select the bone and, in the _**Item Transform**_ menu on the right of the viewport, adjust the _**Roll**_ until the orientation feels right.

![](../../.gitbook/assets/04_bone_roll.gif)

_Fixing the bone roll._

![](../../.gitbook/assets/05_toggle_axes.png)

_Toggle Axes on so you can see the direction in which the bone will rotate._

Fixing the bone roll is especially important for fingers, so all the joints bend in the same proper direction. You don’t have to do it for all the bones in a finger though, just get one of them right. Then, select the ones you want to fix first and the one with the proper roll last, go to _**Armature > Bone Roll > Recalculate Roll > Active Bone**_ and they will all have the same roll. Or you can just press `Shift+N` > _**Active Bone**_. This can be used in many situations where you have a long chain of bones, like a tentacle, a tail, a long pony tail or a mechanical arm.

![](../../.gitbook/assets/06_bone_roll_fingers.gif)

_Press `Shift+N` to recalculate the bone roll._

#### Mirroring the Rig

You don’t have to create bones for both sides. Just do one side first and when you’ve fixed all the naming and bone orientation, select all the bones you want to mirror, click with the right mouse button and select _**Symmetrize**_. That way all the bones will be mirrored properly, with the right orientations. Remember that in orderfor this tool to work, bones need to be named according to Blender’s naming convention. If there is a lower or upper case “L”, “R”, “left” or “right”, Blender handles the counterpart correctly.

Some examples of proper naming convention:

* Hand\_L –> Hand\_R
* Hand.L –>Hand.R
* HandLeft –> HandRight

**All the examples above are valid, but chose only one and keep it consistent through the rig.**

![](../../.gitbook/assets/07_symmetrize.gif)

_Use the Symmetrize option to mirror your bones._

{% hint style="info" %}
**⚠️ Attention!** Symmetrize will only work if the bones are renamed properly. If it doesn’t mirror properly you might want to double check the bones’s names.
{% endhint %}

#### Skinning

Skinning is the process of binding the mesh to the armature. To do so, in _**Object Mode**_, select the mesh, then the armature and press `CTRL+P` > _**Armature Deform > With Automatic Weights.**_ Then, go to _**Pose Mode**_ and test different poses to test the mesh deformation. Most of the time it will need some adjustments, as seen below.

![](../../.gitbook/assets/08_skinning.gif)

_For the Skinning, make the mesh child of the armature by pressing `CTRL+P` and test it in Pose Mode._

If you feel like a bone has been misplaced or that the pivot point is not accurate, you can always go back to the armature’s _**Edit Mode**_ and adjust it. This won’t affect the skinning at all and you can always use _**Symmetrize**_ to mirror the changes.

To fix weird deformations, go to _**Object Mode**_, select the mesh and go to _**Weight Paint**_. In _**Object Data Properties**_ you will find the _**Vertex Groups**_.

![](../../.gitbook/assets/09_weight_paint.gif)

_Edit a bone’s influence in Weight Paint._

Before you start editing, to have you weight paint automatically mirrored as you paint, toggle _**Mirror Vertex Groups**_ and select _**X**_ in _**Mirror**_ under _**Symmetry**_ (in Blender 3.4.0) To edit the influences, select the vertex group one you want and, in the _**Tool**_ menu, under _**Blend**_, switch between _**Add**_ and _**Subtract**_ according to your needs. You can also change the size, weight and strength of the brush.

![](../../.gitbook/assets/10_weight_paint_tools.png)

_Change the Blend to add or remove influence. Make sure Symmetry is right._

![](../../.gitbook/assets/11_weight_paint_tools_02.png)

Use the _**Blur**_ tool ont the left side of the screen to smooth the weight paint and make it more even.

![](../../.gitbook/assets/12_blur_tool.gif)

_Blur Tool._

#### Setting Up the IK

IK is essential when you want something to stay in place. The best example of its use is on legs, but it can be adopted in a variety of situations, like in the examples below:

![](../../.gitbook/assets/13_IK_example_mch_arm.gif)

_IK use in a mechanical arm._

![](../../.gitbook/assets/14_IK_example_buddha.gif)

_IK use in cables._

Since it’ll change the hierarchy of bones, it’s best to keep it as a separate setup. So the first thing you need to do is duplicate the bone chain that will be affected by the IK. Let’s use the leg as an example. Select the bones, press `Shift+D` to duplicate them and move them to a different layer by pressing `M` and selecting a different slot for it.

Remeber to rename the duplicated bones, adding IK to the name so you know they are part of the IK setup. And since they shouldn’t deform the mesh, select all them and in _**Bone Property**_, press and hold `Alt` and uncheck _**Deform**_.

![](../../.gitbook/assets/15_Duplicating_bones.gif)

_Duplicate the bones and move them to a different layer._

![](../../.gitbook/assets/16_uncheck_deform.png)

_Select all the IK bones and, while holding `Alt`, uncheck Deform._

Next, you’ll need to create a bone that’ll drive the IK chain. Select the head of the foot bone and extrude it on Y. Then, press `Alt+P` to unparent it because the IK bone can’t be part of the chain and can’t be connected to other bones. You’ll need to make the foot a child of the IK, so select the foot bone first and the IK bone last and press `CTRL+P` > _**Keep Offset**_.

![](../../.gitbook/assets/17_IK_bone.gif)

_Creating an IK bone._

In _**Pose Mode**_, click on the shin bone, press `CTRL+Shift+C` and select _**Inverse Kinematics**_. It will look all messed up, but don’t worry, it will be fixed once you change a few settings. With the shin selected, got to the _**Bone Constraint Properties**_ as shown below.

![](../../.gitbook/assets/18_constraint_tab.png)

_In Bone Constraint Properties you can edit the IK settings._

For the _**Target**_, select _**Armature**_. Once you do that, an option called _**Bone**_ will appear under Target. For that, select the IK bone you created. In _**Chain Length**_ you will set the number of bones that should be affected by the IK. Since we are doing a leg, we want it to affect the shin and the thigh, so set it to _**2**_.

#### Pole Target

The Pole Target lets you control the direction in which the bones will bend. These are the steps to properly add a pole target (or pole vector) to the IK chain:

* In _**Edit Mode**_, duplicate the thigh bone and place it anywhere.
* Select the knee joint (or the tail of the thigh bone), press `Shift+S` > _**Cursor to Selected.**_
* Selected the duplicated thigh bone, press `Shift+S` > _**Selection to Cursor**_.
* In _**Transform Orientation**_, change it to _**Normal**_ and in _**Tansform Pivot Point**_ change it to _**Active Element**_.
* Rotate the bone in X -90 (or 90, depending on the orientation you set) so it points forward and grab it in Y until it has a nice position in front of the leg. You can also scale it down a little bit.

![](../../.gitbook/assets/19_creating_pole_target.gif)

_Creating a Pole Target._

Back into _**Pose Mode**_, select the shin again and go to the _**Bone Constraint Properties**_. For _**Pole Target**_ select _**Armature**_ and for _**Bone**_, select the pole target one you just created. If you show the deform bones, you will see that the pole target rotated the IK a little.

![](../../.gitbook/assets/20_pole_target_rotation.png)

_IK chain and deform bones are not aligned anymore because of pole target._

![](../../.gitbook/assets/21_pole_target_rotation_fix.png)

_The rotation can be fixed by changing the Pole Angle._

That can be easily fixed by changing the _**Pole Angle**_. Usually -90° will do the trick, but you can always adjust it manually to make sure they are perfectly aligned.

Finally, make both the IK bone and the pole target chilld of the root bone by selecting them both, then the root, press `CTRL+P` > _**Keep Offset**_.

Move the thigh and shin to another layer since you won’t need them for animation, they are just part os the IK setup.

#### Binding Deform Bones to Non-Deforming Ones

The IK chain is all set up, but it should drive the deform bones and right now that’s not happening, but you can use constraints to fix that. In _**Pose Mode**_, select a bone from the IK chain first and the respective deforming bone last, press `CTRL+Shift+C` and select _**Copy Transforms**_. Do that for all the bones, which in the example are thigh, shin, foot and toes. The deform bones will have a green color to them, which means that they have a constraint. If you click on _**Bone Constraint Properties**_, you can see which constraint is being used and what bone is driving it.

![](../../.gitbook/assets/22_constraints.gif)

_Green bones have constraints. You can check them in Bone Constraints Properties._

{% hint style="info" %}
**💡 Tip**: You don’t have to set up the IK all over again for the other side. In _Edit Mode_, just delete all the bones from the side that doesn’t have the IK, then select all the deforming bones and IK chain that you want to mirror, right click with the mouse and select _Symmetrize_. It will not only mirror the bones, but also all the constraints!
{% endhint %}

![](../../.gitbook/assets/23_symmetrize_constraints.gif)

_Use the option Symmetrize to mirror constraints too!_

#### Non-deforming Skeleton and Controls\*\*

It’s good practice not to animate directly the deforming bones since you could end up breaking the rig and adding constraints to the deforming armature will affect the hierarchy and bone behaviour when exported.

The solution to this is to create a non-deforming skeleton that will drive the deforming one through constraints, and that can be animated safely, without risking breaking anything. You can also customize their shape to make it easier to identify a bone’s function. They will be the controls for your rig.

The process for this is pretty much the same done for the IK setup. Duplicate all the bones (except the IK setup) with `Shift+D` and move them to a different layer by pressing `M` and picking another slot. Rename them all by adding **Control\_** or **CTRL\_** as a suffix so you know these are part of the controls hierarchy. Press `A` to select all them and in _**Bone Property**_, press and hold `Alt` and uncheck _**Deform**_.

Now you’ll have to add constraints to bind the two skeletons together. To make this process easier, you can change the bone shape by clicking on _**Object Data Properties**_ and, under _**Viewport Display**_, change _**Display As**_ from _**Octahedral**_ to _**B-Bone**_. Then, press `CTRL+Alt+S` to scale the bones up a little bit so their are bigger than the original ones.

![](../../.gitbook/assets/24_b-bone_scale.gif)

_Change the bone shape and scale them up so it’s easier to differentiate between the two skeletons._

For the constraints, select a control bonefirst and the respective deforming bone last, press `CTRL+Shift+C` and select _**Copy Transforms**_. Do that for all the control bones.

You can separate the control bones into different groups and assign colors to them. Go to _**Pose Mode**_ > _**Object Data Properties**_ > _**Bone Groups**_. Click on the _**+**_ icon to add a new group, rename it as you see fit and select a color for it. Then, select the bones you want to be part of that group and click on _**Assign**_. You can create as many groups as you like to keep everything organized. You can also move different bone groups to different layers.

![](../../.gitbook/assets/25_bone_groups.png)

_Bone groups will help you keep your rig organized and more intuitive._

An extra way to improve your rig is to customize the shape of the bones. To do that, go to _**Object Mode**_, press `Shift+A` to ad a mesh, like a circle, for example. To keep everything organized, create a collection for your shapes and move there the circle you just created. Go back to Pose Mode and, in _**Object Data Properties**_ > _**Viewport Display**_ check _**Shapes**_. Select the bone you want and then, in _**Bone Properties**_, click on _**Viewport Display**_ > _**Custom Shape**_. In _**Custom object**_, select the circle in the outliner.

![](../../.gitbook/assets/26_bone_shape.gif)

_Customizing the bone shape._

If the shape feels off, you can always edit it in _**Edit Mode**_, as shown below. Make sure the shape has the same orientation os the bone.

![](../../.gitbook/assets/27_bone_shape_edit.gif)

_Edit the shape in Edit Mode._

Create different shapes for different controls according to their function to make your rig more intuitive.

And that’s it! With all this information you’re ready to do a basic rig!
