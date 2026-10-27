# Probar IUs

Esta sección describe cómo los desarrolladores probarán código relacionado con la IU.

## Stack de pruebas

Todas nuestras pruebas de IU DEBEN hacerse usando [Jest](https://jestjs.io/) como el framework principal de pruebas con [redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan) como la herramienta de pruebas de sagas y [react testing library](https://testing-library.com/docs/react-testing-library/intro/) como herramienta de pruebas de componentes ui. El código de prueba DEBE escribirse usando [Typescript](https://www.typescriptlang.org/) y ejecutarse usando [ts-jest](https://github.com/kulshekhar/ts-jest) para tener soporte de verificación de tipos.

## Qué probar

* Componentes UI
* Sagas
* Reducers
* Selectores
* Creadores de acciones
* Funciones de utilidad

## Probar sagas

Las sagas nos permiten manejar efectos secundarios dejándonos crear generadores que manejan acciones de redux. Una de las principales ventajas de las sagas es su probabilidad, ya que los efectos que son ampliamente usados en sagas son altamente probables.

Estos handlers DEBEN probarse usando [redux-saga-test-plan](https://github.com/jfairbank/redux-saga-test-plan), y la prueba DEBE ejercitar la ejecución completa, desde el handler principal del módulo completo (su handler principal o sagas) a través de toda la ejecución de los handlers que reaccionarán a la acción que vamos a despachar. Este enfoque hace que las pruebas de sagas sean fáciles de construir y mantener, y trae valor a las pruebas ya que están recorriendo tanto del flujo completo como sea posible.

Las pruebas de handlers DEBEN probarse a través de su interacción con los efectos, principalmente con el `put`, ya que su propósito es manejar acciones y producir nuevas. La mayoría de las pruebas seguramente contendrán una llamada `provide`, usada para mockear efectos, una o múltiples llamadas `put`, para verificar que los handlers despachan las acciones como se espera y un solo `dispatch` seguido de una llamada `run` para ejecutar todas las sagas hasta completarse.

El mockeo de recursos externos al módulo que está siendo probado DEBERÍA hacerse usando los providers de redux-saga-test-plan aprovechando los diferentes efectos proporcionados por redux-sagas. Efectos como call, apply u otros DEBERÍAN usarse siempre que sea posible cuando se llama a una función en una prueba para permitir mockearlos fácilmente. Jest NO DEBERÍA usarse para mockear módulos o funciones.

El texto en el describe e its DEBE seguir estas guías:

* El describe principal de una saga o handler principal DEBE empezar con *when handling*, indicando que lo que se va a probar es un handler. Siguiendo la frase *when handling*, una descripción de la acción (o la intención que la acción) a ser manejada DEBE escribirse. Ej. *when handling the action that signals a successful fetch.*
* Los describes internos diferenciarán contextos de ejecución, siguen las mismas reglas descritas en la sección [Describir y construir contexto](writing-tests.md#describir-y-construir-contexto).
* Los **it**s DEBERÍAN describir lo que se espera de la prueba, comenzando con un *should put* y la descripción de las acciones que deberían ponerse al ejecutar el handler.

### Ejemplo de saga

```tsx
...
export function* tiersSaga(builder: BuilderAPI) {
	function* handleBuyThirdPartyItemTierRequest(action: BuyThirdPartyItemTiersRequestAction) {
    const { thirdParty, tier } = action.payload
    try {
			// Obtener el chain id puede fallar, una prueba debe hacerse para asegurar que este escenario se ejercita
      const maticChainId: ChainId = yield call(getChainIdByNetwork, Network.MATIC)
      const thirdPartyContract = yield call(getContract, ContractName.ThirdPartyRegistry, maticChainId)
			// Enviar la transacción puede tener éxito o fallar, ambos casos deben ejercitarse en una prueba
      const txHash: string = yield call(sendTransaction, thirdPartyContract, instantiatedThirdPartyContractContract =>
        instantiatedThirdPartyContractContract.buyItemSlots(thirdParty.id, tier.id, tier.price)
      )
      yield put(buyThirdPartyItemTiersSuccess(txHash, maticChainId, thirdParty, tier))
    } catch (error) {
      yield put(buyThirdPartyItemTiersFailure(error.message, thirdParty.id, tier))
    }
  }
}
```

### Ejemplo de prueba de saga

```tsx
// El describe principal comienza con 'when handling...'
describe('when handling the request to buy a third party item tier', () => {
	// Todos los casos, negativos y positivos se ejercitan
  describe('and the chain id couldn\'t be retrieved', () => {
    it('should put the action signaling the failure of the purchase of an item slots tier with the tier and the third party id', () => {
      return expectSaga(tiersSaga, mockedBuilderApi)
				// Las llamadas Provide mockean los diferentes efectos, construyendo diferentes escenarios
        .provide([[call(getChainIdByNetwork, Network.MATIC), Promise.reject(new Error(defaultError))]])
				// Las llamadas Put verifican que lo que se esperaba como resultado final ocurrió
        .put(buyThirdPartyItemTiersFailure(defaultError, thirdParty.id, thirdPartyItemTier))
				// Un solo dispatch por prueba se hace para ejercitar el manejo de la acción que estamos probando
        .dispatch(buyThirdPartyItemTiersRequest(thirdParty, thirdPartyItemTier))
        .run({ silenceTimeout: true })
    })
  })

  describe('and sending the transaction fails', () => {
    it('should put the action signaling the failure of the purchase of an item slots tier with the tier and the third party id', () => {
      return expectSaga(tiersSaga, mockedBuilderApi)
        .provide([
					// Call coincide con el efecto call exacto, tomando en consideración los parámetros
					// Esto hace que nuestra prueba asegure que el código ejecutado antes de un put hizo lo que esperábamos
          [call(getChainIdByNetwork, Network.MATIC), ChainId.MATIC_MUMBAI],
          [call(getContract, ContractName.ThirdPartyRegistry, ChainId.MATIC_MUMBAI), contract],
					// Los matchers se usan para solo coincidir con la función y no los parámetros
          [matchers.call.fn(sendTransaction), Promise.reject(new Error(defaultError))]
        ])
        .put(buyThirdPartyItemTiersFailure(defaultError, thirdParty.id, thirdPartyItemTier))
        .dispatch(buyThirdPartyItemTiersRequest(thirdParty, thirdPartyItemTier))
        .run({ silenceTimeout: true })
    })
  })

  describe('and sending the transaction succeeds', () => {
    let contract: any
    beforeEach(() => {
      contract = { buyItemSlots: jest.fn() }
    })

    it('should put the action signaling the successful purchase of an item slots tier with the tier, the third party and the transaction details', () => {
      return expectSaga(tiersSaga, mockedBuilderApi)
        .provide([
          [call(getChainIdByNetwork, Network.MATIC), ChainId.MATIC_MUMBAI],
          [call(getContract, ContractName.ThirdPartyRegistry, ChainId.MATIC_MUMBAI), contract],
          [matchers.call.fn(sendTransaction), Promise.resolve(txHash)]
        ])
        .put(buyThirdPartyItemTiersSuccess(txHash, ChainId.MATIC_MUMBAI, thirdParty, thirdPartyItemTier))
        .dispatch(buyThirdPartyItemTiersRequest(thirdParty, thirdPartyItemTier))
        .run({ silenceTimeout: true })
    })
  })
})
```

## Probar reducers

Los reducers son funciones que toman un estado y una acción y retornan un nuevo estado. Este nuevo estado PUEDE contener cambios programados para ocurrir para la acción dada.

Las pruebas DEBERÍAN variar los estados iniciales y los diferentes parámetros de la acción a probar si es requerido. Las afirmaciones DEBEN hacerse sobre todo el estado retornado ya que una acción podría modificar cualquier parte del estado inicial dado.

Al reducir una acción, DEBERÍAMOS usar el creador de acción, haciendo las pruebas más fáciles de mantener.

Para estandarizar la forma en que escribimos **describe**s e **it**s:

* Los describes principales DEBERÍAN comenzar describiendo qué acciones se van a reducir usando la frase *when reducing the action* seguida de una descripción de la acción. NO DEBERÍAMOS usar el tipo de acción para describir la acción a probar, ya que el tipo podría cambiar.
* Los **it**s DEBERÍAN describir la forma en que el estado retornado cambió de manera clara. Ej: *it should return a state with the error nulled and the fruits set*.

### Ejemplo de reducer

```tsx
const INITIAL_STATE: FruitsState = {
  data: {
    fruits: []
  },
  loading: []
}

export function fruitsReducer(state = INITIAL_STATE, action: any): FruitsState {
  switch (action.type) {
    case FETCH_FRUIT_REQUEST: {
      return {
        ...state,
        loading: loadingReducer(state.loading, action),
				error: null
      }
    }
		case FETCH_FUIT_ERROR: {
			const { error } = action
      return {
        ...state,
				error,
        loading: loadingReducer(state.loading, action)
      }
		}
		case FETCH_FRUIT_SUCCESS: {
			const { fruits } = action
      return {
        ...state,
				fruits,
        loading: loadingReducer(state.loading, action)
      }
		}
}
```

### Ejemplo de prueba de reducer

```tsx
let state: FruitsState

beforeEach(() => {
	state = {
	  data: {
	    fruits: []
	  },
	  loading: [],
		error: null
	}
})

describe('when reducing the action that signals the fetching of fruits', () => {
	beforeEach(() => {
		// Se establece un error para asegurar que se borra al reducir la acción.
		state.error = 'anError'
	})

	it('should return a state where the error is cleared and the loading state is set to loading', () => {
		// Los creadores de acciones se usan para probar el reducer para que pueda mantenerse con facilidad.
		const action = fetchFruitsRequest()

		expect(fruitsReducer(state, action)).toEqual({
			...state,
			error: null,
			/* Como el reducer de loading es parte de otro reducer (y no necesita ser probado),
				 PODEMOS elegir usarlo tal cual o PODEMOS usar un helper que lo emule.
			*/
			loading: loadingReducer(state.loading, action),
		})
	})
})

describe('when reducing the action that signals the failure of fetching fruits', () => {
	const error = 'anError'

	it('should return a state where the error is set and the loading state is cleared from the fruits fetch action', () => {
		const action = fetchFruitsFailure(error)

		expect(fruitsReducer(state, action)).toEqual({
			...state,
			error,
			loading: loadingReducer(state.loading, action),
		})
	})
})

describe('when reducing the action that signals the success of fetching fruits', () => {
	let fruits: string[]
	beforeEach(() => {
		fruits = ['apples', 'pears']
	})

	it('should return a state where the fruits are set and the loading reducer is cleared from the fruits fetch action', () => {
		const action = fetchFruitsSuccess(fruits)

		expect(fruitsReducer(state, action)).toEqual({
			...state,
			fruits,
			loading: loadingReducer(state.loading, action),
		})
	})
})
```

## Probar selectores

Los selectores son métodos que toman un estado y retornan una sección de ese estado o una sección transformada del estado.

Hay dos tipos de selectores, selectores memoizados y selectores normales o comunes. Los selectores normales o comunes DEBEN probarse como cualquier otra función probada unitariamente y los selectores memoizados DEBERÍAN probarse usando el `resultFunc` o la función que recibe las partes memoizadas del estado y retorna el valor deseado.

Los **Describe**s e **it**s DEBEN escribirse como se describe en la sección [Describir y construir contexto](writing-tests.md#describir-y-construir-contexto).

### Ejemplo de selectores

```tsx
// Selector común
export const collectionExists = (state: RootState, id: string): boolean => {
	return state.collections.data.some((collection) => collection.id === id)
}

// Selector memoizado usando reselect que retorna una lista de colecciones mejoradas
export const getEnhancedCollections = createSelector(
	getCollections,
	getExtraData,
	(collections, extraData) => {
		return collections.map((collection) =>
			({ ...collection, ...extraData[collection[id]] }))
	}
)
```

### Ejemplo de prueba de selectores

```tsx
let state: RootState
let collection: { id: string }
beforeEach(() => {
	collection = {
		id: 'anId'
	}
	state = {
		collections: {
			data: []
		}
	}
})

beforeEach(() => {
	state.collections.data = [collection]
})

// Los selectores comunes se prueban unitariamente como funciones normales
describe('when checking if a collection exists', () => {
	describe('and there\'s no collection with the given id', () => {
		it('should return false', () => {
			expect(collectionExists(state, "anotherId")).toBe(false)
		})
	})

	describe('and there\'s a collection with the given id', () => {
		it('should return true', () => {
			expect(collectionExists(state, collection.id)).toBe(true)
		})
	})
})

describe('when getting the enhanced collections', () => {
	let enhacements: Record<string, Enhacement>

	describe('and there\'s no data to enhance them', () => {
		beforeEach(() => {
			enhacements = {}
		})

		// Los selectores memoizados deberían probarse unitariamente usando resultFunc
		it('should retrieve all the collections without enhancing them', () => {
			expect(getEnhancedCollections.resultFunc(collections, enhacements)).toEqual([
				collection
			])
		})
	})

	describe('and there\'s data to enhance them', () => {
		beforeEach(() => {
			enhacements = { [collection.id]: { aNewProperty: true } }
		})

		it('should retrieve all the enhanced collections', () => {
			expect(getEnhancedCollections.resultFunc(collections, enhacements)).toEqual([
				{ ...collection, ...enhacements[collection.id] }
			])
		})
	})
})
```

## Probar creadores de acciones

Los creadores de acciones están a cargo de crear las acciones que más tarde serán procesadas en los reducers. Aunque los creadores de acciones suelen ser simples, DEBEN probarse para asegurar que hacen lo que esperamos.

Los **Describe**s e **it**s DEBEN escribirse como se describe en la sección [Describir y construir contexto](writing-tests.md#describir-y-construir-contexto).

### Ejemplo de creadores de acciones

```tsx
export const BUY_THIRD_PARTY_ITEM_TIERS_REQUEST = '[Request] Buy a third party item tier'
export const BUY_THIRD_PARTY_ITEM_TIERS_SUCCESS = '[Success] Buy a third party item tier'
export const BUY_THIRD_PARTY_ITEM_TIERS_FAILURE = '[Failure] Buy a third party item tier'

export const buyThirdPartyItemTiersRequest = (thirdParty: ThirdParty, tier: ThirdPartyItemTier) =>
  action(BUY_THIRD_PARTY_ITEM_TIERS_REQUEST, { thirdParty, tier })
export const buyThirdPartyItemTiersSuccess = (txHash: string, chainId: ChainId, thirdParty: ThirdParty, tier: ThirdPartyItemTier) =>
  action(BUY_THIRD_PARTY_ITEM_TIERS_SUCCESS, { thirdParty, tier, ...buildTransactionPayload(chainId, txHash, { tier, thirdParty }) })
export const buyThirdPartyItemTiersFailure = (error: string, thirdPartyId: string, tier: ThirdPartyItemTier) =>
  action(BUY_THIRD_PARTY_ITEM_TIERS_FAILURE, { error, thirdPartyId, tier })
```

### Ejemplo de prueba de creador de acción

```tsx
describe('when creating the action that signals the start of a tiers fetch request', () => {
  it('should return an action signaling the start of the tiers fetch', () => {
    expect(fetchThirdPartyItemTiersRequest()).toEqual({ type: FETCH_THIRD_PARTY_ITEM_TIERS_REQUEST })
  })
})

describe('when creating the action that signals the successful fetch of tiers', () => {
  it('should return an action signaling the success of the tiers fetch', () => {
    expect(fetchThirdPartyItemTiersSuccess([thirdPartyItemTier])).toEqual({
      type: FETCH_THIRD_PARTY_ITEM_TIERS_SUCCESS,
      payload: { tiers: [thirdPartyItemTier], error: undefined, meta: undefined }
    })
  })
})

describe('when creating the action that signals the unsuccessful fetch of tiers', () => {
  it('should return an action signaling the failure of the tiers fetch', () => {
    expect(fetchThirdPartyItemTiersFailure(defaultError)).toEqual({
      type: FETCH_THIRD_PARTY_ITEM_TIERS_FAILURE,
      payload: { error: defaultError }
    })
  })
})
```

## Probar componentes ui

Para probar componentes UI estamos usando [React Testing Library](https://testing-library.com/docs). Estamos usando esta biblioteca en lugar de otras opciones como enzyme ya que nos permite probar componentes tomando en consideración cómo el usuario interactuará con él en lugar de la implementación misma. No estaremos interactuando con instancias de componentes react, en su lugar estamos interactuando con elementos dom de la forma en que son renderizados.

### Qué probar

El propósito de estas pruebas de componentes ui es probar el comportamiento del componente y cómo el usuario interactúa con él. En muchos casos podría haber componentes que están conectados al store de redux para obtener algunas propiedades y llamar algunas acciones. Usualmente manejamos esto haciendo un archivo `container` separado que interactuará con el store. Estos archivos están fuera del alcance de este tipo de pruebas. Estamos probando cómo el componente se comporta con diferentes valores de props, no deberíamos preocuparnos por la fuente de esos valores (store de redux, contexto, componente padre), sino cómo impactan el render final.

### Renderizado

Cada prueba debería comenzar llamando a la función render. Esto renderizará no solo el componente que estamos enviando como parámetro, sino también todos los hijos. Deberíamos evitar hacer esto en la configuración de prueba (`beforeEach`) ya que puede causar problemas haciendo que el árbol dom tenga más componentes de los que queremos. Deberíamos guardar el resultado en un nombre de propiedad **screen**. Hacer esto nos permitirá obtener todas las propiedades que necesitamos en la prueba sin la necesidad de cambiar constantemente la desestructuración.

```jsx
it('should render hello world component', () => {
	const screen = render(<HelloWorld />)
})
```

Si el documento tendrá múltiples pruebas y el componente tiene múltiples props podemos crear una función en la parte superior del archivo que se encargará de establecer props por defecto y renderizar el componente.

```jsx
function renderSelectedFilters(props: Partial<Props> = {}) {
  return render(
    <SelectedFilters
      isLandSection={false}
      category={undefined}
      browseOptions={{}}
      onBrowse={jest.fn()}
      {...props}
    />
  )
}
```

### Consultas

Las consultas son los métodos que Testing Library te da para encontrar elementos en la página. Hay diferentes [tipos de consultas](https://testing-library.com/docs/queries/about/#priority) que podemos usar para acceder a los elementos. Deberíamos intentar siempre usar las consultas que son `Accesibles para todos` ya que son las que reflejan la experiencia para todos los usuarios (visual/mouse y usando tecnología asistiva).

Esas consultas son `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`. Si podemos acceder al elemento usando estas consultas probablemente significa que el componente no es accesible.

### Probar eventos de usuario

No podremos acceder a funciones dentro del componente así que deberíamos imitar el comportamiento del usuario que lleva a que esas funciones sean llamadas. Para hacer esto estamos usando la biblioteca `userEvent`.

```jsx
const screen = renderSelectedFilters({
      browseOptions: raritiesOptions,
      onBrowse: onBrowseMock
    })
const commonPill = screen.getByTestId('pill-common')
await userEvent.click(within(commonPill).getByRole('button'))
```

### Depuración

Para depurar la prueba y cuál es el estado actual del dom en un momento específico podemos usar la función `debug` que es una de las propiedades retornadas al llamar a render

```jsx
const { debug } = render(<HelloWorld />)

debug()
```

### Ejemplo completo de prueba de componente ui

```jsx
function renderSelectedFilters(props: Partial<Props> = {}) {
  return render(
    <SelectedFilters
      isLandSection={false}
      category={undefined}
      browseOptions={{}}
      onBrowse={jest.fn()}
      {...props}
    />
  )
}

describe('rarities filter', () => {
  it('should render rarities', () => {
    const raritiesOptions = { rarities: [Rarity.COMMON, Rarity.EPIC] }
    const screen = renderSelectedFilters({
      browseOptions: raritiesOptions
    })
    expect(screen.getByText(Rarity.COMMON)).toBeInTheDocument()
    expect(screen.getByText(Rarity.EPIC)).toBeInTheDocument()
  })

  it('should call onBrowse without deleted rarity', async () => {
    const raritiesOptions = { rarities: [Rarity.COMMON, Rarity.EPIC] }
    const onBrowseMock = jest.fn()

    const screen = renderSelectedFilters({
      browseOptions: raritiesOptions,
      onBrowse: onBrowseMock
    })
    const commonPill = screen.getByTestId('pill-common')
    await userEvent.click(within(commonPill).getByRole('button'))
    expect(onBrowseMock).toHaveBeenCalledWith({ rarities: [Rarity.EPIC] })
  })
})
```

## Estructura de directorios

Las pruebas DEBEN colocarse junto a los archivos o módulos que ejercitarán, con el mismo nombre, pero con la extensión `spec.ts` en lugar de `ts`.
