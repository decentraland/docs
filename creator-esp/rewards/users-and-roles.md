---
metaLinks:
  alternates:
    - https://app.gitbook.com/s/oPnXBby9S6MrsW83Y9qZ/rewards/users-and-roles
---

# Usuarios y Roles

Para realizar cualquier acción en una campaña dentro del servicio de Rewards, debes iniciar sesión con una billetera que tenga los permisos necesarios.

Cuando creas una campaña, automáticamente se te asigna como su propietario y se te otorgan todos los permisos. Como propietario, puedes agregar otros usuarios a la campaña y asignarles roles con permisos específicos. Sin embargo, cada campaña puede tener solo un propietario—el creador—quien es el único usuario con la autoridad para gestionar los fondos.

Para agregar un usuario a la campaña:

1. Haz clic en la pestaña **User Roles** para ver la lista de usuarios que tienen acceso a la campaña.
2. Al final de esta lista, encontrarás un formulario para agregar un nuevo usuario. Nota: Este formulario solo será visible si tienes los permisos necesarios para agregar usuarios.
3. Completa el formulario ingresando la dirección de billetera del usuario (o nombre ENS) y seleccionando su rol.
4. Haz clic en el botón **Add User** para finalizar la adición.

![](../../.gitbook/assets/users.png)

### Permisos para roles

Estas son las acciones permitidas para cada rol:

| Permiso                                 | viewer | developer | collaborator | owner |
| --------------------------------------- | :----: | :-------: | :----------: | :---: |
| Ver nombre de campaña, red y gas máximo |    ✅   |     ✅     |       ✅      |   ✅   |
| Editar nombre de campaña y gas máximo   |    ❌   |     ❌     |       ✅      |   ✅   |
| Activar y desactivar campaña            |    ❌   |     ❌     |       ✅      |   ✅   |
| Ver suministro                          |    ✅   |     ✅     |       ✅      |   ✅   |
| Agregar/eliminar Suministro             |    ❌   |     ✅     |       ✅      |   ✅   |
| Ver dispensadores                       |    ✅   |     ✅     |       ✅      |   ✅   |
| Ver clave de dispensador                |    ❌   |     ✅     |       ✅      |   ✅   |
| Agregar/eliminar dispensador            |    ❌   |     ✅     |       ✅      |   ✅   |
| Ver transacciones de campaña            |    ✅   |     ✅     |       ✅      |   ✅   |
| Ver usuarios                            |    ✅   |     ✅     |       ✅      |   ✅   |
| Agregar/Eliminar usuarios               |    ❌   |     ❌     |       ✅      |   ✅   |
| Eliminar usuarios propietarios          |    ❌   |     ❌     |       ❌      |   ✅   |
| Gestionar fondos                        |    ❌   |     ❌     |       ❌      |   ✅   |
