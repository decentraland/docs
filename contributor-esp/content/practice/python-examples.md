Esta práctica muestra cómo escribir un programa simple que descarga y analiza algún contenido usando las [instantáneas](../snapshots.md) proporcionadas por servidores de contenido.

{% hint style="info" %}
Puedes encontrar el [script completo](https://github.com/decentraland/documentation/blob/main/content/contributor/content/practice/snapshots_mini.py) en GitHub, junto con un [ejemplo más avanzado](https://github.com/decentraland/documentation/blob/main/content/contributor/content/practice/snapshots.py).
{% endhint %}

Usaremos el servidor de la Foundation de Decentraland en `peer.decentraland.org`, y Python 3 como nuestro lenguaje de elección.

Esto es lo que haremos:

1. Consultar el estado del servidor de contenido.
2. Seleccionar y descargar una [instantánea](../snapshots.md) con una lista de entidades.
3. Imprimir el tipo e ID de todas las entidades referenciadas.

Comencemos nuestro script con algunas preparaciones. Usaremos solo módulos de la biblioteca estándar, pero en código real probablemente querrás un cliente HTTP más cómodo (como la biblioteca [requests](https://github.com/psf/requests)).

```py
# Hacer una solicitud HTTP GET, devolver una respuesta HTTP tipo archivo.
def fetch(path):
    url = f"https://peer.decentraland.org/{path}"
    headers = { "User-Agent": "urllib" } # importante en algunos servidores (si está vacío, 403 Forbidden)

    request = urllib.request.Request(url, headers=headers)
    response = urllib.request.urlopen(request)

    return response
```

Nuestro ayudante simple hace una solicitud HTTP `GET`, y devuelve el objeto de respuesta tipo archivo. Nada elegante. Usémoslo para consultar el endpoint `/about` y verificar el estado del servidor:

```py
# Verificar el estado del servidor:
about = json.load(fetch('about'))

if not about['healthy']:
    print("Server not healthy!")
    sys.exit(1)
```

Si pasamos este punto, el servidor está funcionando (obtuvimos una respuesta `200`) y reporta estar operativo. Podemos solicitar el conjunto actual de instantáneas (que viene en formato de array JSON):

```py
# Obtener la lista de instantáneas:
all_snapshots = json.load(fetch('content/snapshots'))
```

Los archivos de instantánea (especialmente para los rangos de tiempo más largos) pueden ser muy grandes. Para un experimento rápido, tomemos la más pequeña en la lista por `numberOfEntities`:

```py
# Tomar la instantánea más pequeña, en términos de entidades incluidas:
snapshot = min(all_snapshots, key=lambda s: s['numberOfEntities'])
```

Para descargar el contenido, necesitamos el campo `hash` de `snapshot`. Obtenemos la URL del archivo agregándola a la raíz de contenido:

```py
# Solicitar el archivo de la API de contenido:
response = fetch('content/contents/' + snapshot['hash'])
```

El archivo que seleccionamos es lo suficientemente pequeño para almacenarlo en memoria, pero pretendamos que no sabemos eso y transmitámoslo en streaming. La primera línea es el encabezado de instantánea, y cada línea después de eso contiene un objeto JSON.

Verifiquemos el encabezado, siempre es una buena idea:

```py
# Verificar el encabezado de la instantánea:
header = response.readline().decode('utf-8').strip()

if header != '### Decentraland json snapshot':
    print("Invalid snapshot header: " + header)
    sys.exit(1)
```

Ahora podemos procesar todas las entidades en la instantánea, leyendo la respuesta línea por línea. Para nuestros humildes propósitos, _procesar_ significa imprimir el tipo de entidad e ID:

```py
# Leer y decodificar todos los elementos, un JSON por línea:
for line in response:
    item = json.loads(line)
    print(item['entityType'], item['entityId'])
```

Este ciclo comenzará a transmitir, analizar e imprimir líneas como estas hasta que termine con la instantánea:

```
profile bafkreic36qmzyprs6whkpuxbeiif4no6kvdrr2tfpichbx2fzfz5py6eyv
scene bafkreibr5xfujqrp5q3o4s73vm2yljlcp7cucqgugssnarsuclxv4emlmy
profile bafkreid7khr5wnkialba44rsslffi633rh3lvctad5oa5vjoe6wa7s4c5a
wearable bafkreihlqcb7jgubomyidikpwpqhgzbagltk5m4rgbjdvzydxmoka7bg4i
```

¡Salud! Hemos usado el sistema de instantáneas para explorar algo del contenido disponible en Decentraland.

Recuerda que puedes encontrar el [script completo](https://github.com/decentraland/documentation/blob/main/content/contributor/content/practice/snapshots_mini.py) en GitHub, junto con un [ejemplo más avanzado](https://github.com/decentraland/documentation/blob/main/content/contributor/content/practice/snapshots.py).
