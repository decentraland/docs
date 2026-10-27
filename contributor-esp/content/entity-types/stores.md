Las tiendas (stores) son [entidades](../entities.md) off-chain que representan sitios de marketplace gestionados por usuarios. Contienen una descripción y una imagen para mostrar a compradores, además de información sobre el propietario de la tienda.

## Punteros {#pointers}

Los punteros de tienda son URNs en el namespace `off-chain`, con la siguiente forma:

```
urn:decentraland:off-chain:marketplace-stores:<owner-address>
```

El segmento de dirección es la dirección de Ethereum del propietario de la tienda. Por ejemplo:

```
urn:decentraland:off-chain:marketplace-stores:0xa2a1dc503be6fdb7878f58f053ded40564e3b9b2
```

## Campos de Metadata

| Campo | Valor |
| ----- | --- |
| `id` | El [puntero](../pointers.md) que resuelve (o solía resolver) a esta tienda.
| `description` | El título de visualización para esta tienda.
| `owner` | La dirección de Ethereum del propietario.
| `images` | Un array de objetos `{ file, name }` referenciando imágenes (ver abajo).
| `links` | Un array de objetos `{ name, url }` con enlaces de redes sociales o sitio web (ver abajo).


### Images

Las tiendas tienen una imagen para mostrar a compradores en el marketplace, cada una con un nombre identificando el rol. El array `images` típico tiene un solo elemento con el nombre `cover`, así:

```json
[
  {
    "name": "cover",
    "file": "imgs/store-logo.png"
  }
]
```

### Links

Los propietarios pueden agregar enlaces externos a las tiendas, como perfiles de redes sociales y sitios web externos. URLs de Facebook y Discord se incluyen comúnmente. Un ejemplo:

```json
[
  {
    "name": "facebook",
    "url": "https://www.facebook.com/mydclstore"
  },
  {
    "name": "website",
    "url": "https://mydclstore.com"
  }
]
```
