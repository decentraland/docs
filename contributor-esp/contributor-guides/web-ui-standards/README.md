# Estándares de IU Web

Esta sección explica cómo Decentraland construye IU web para dApps usando nuestra biblioteca de componentes y sistema de diseño. Estos estándares aseguran consistencia, accesibilidad y mantenibilidad a través de todas las aplicaciones web.

## Resumen

Nuestra arquitectura de IU web está construida sobre tres pilares fundamentales:

* **UI2 (`decentraland-ui2`)** - Nuestra biblioteca de componentes principal y sistema de diseño
* **Material UI (MUI)** - La base envuelta por UI2 con la tematización de Decentraland
* **Sistema de Diseño** - Colores, tipografía, espaciado y componentes unificados

### UI2: La Única Fuente de Verdad

**UI2** es nuestra biblioteca de componentes actual que envuelve componentes de Material UI con el tema de Decentraland y proporciona componentes personalizados como `Navbar` que no existen en MUI.

* **Demo en Vivo**: [ui2.decentraland.org](http://ui2.decentraland.org)
* **GitHub**: [github.com/decentraland/ui2](https://github.com/decentraland/ui2)
* **Biblioteca Figma**: [Decentraland UI2 en Figma](https://www.figma.com/design/tsyaDSedcsVZ8iM9N0McT2/DCL-UI2)

### UI1: Biblioteca Legada

**UI1** (`decentraland-ui`) es nuestra biblioteca de componentes anterior, todavía mantenida pero siendo gradualmente migrada a UI2. Ver la [Guía de Migración](../../../contributor/contributor-guides/web-ui-standards/migration.md) para detalles sobre la transición de componentes.

## Secciones de Documentación

* [**Resumen del Proceso**](process-overview.md) - Descubrimiento UX, diseño Figma y flujo de trabajo de implementación
* [**Componentes Personalizados**](../../../contributor/contributor-guides/web-ui-standards/custom-components.md) - Guías para componentes específicos del proyecto y reutilizables
* [**Estilos y Tematización**](../../../contributor/contributor-guides/web-ui-standards/styling-and-theming.md) - Estándares completos de estilo usando styled-components
* [**Guía de Migración**](../../../contributor/contributor-guides/web-ui-standards/migration.md) - Migrando componentes de UI1 a UI2

## Principios Clave

### 1. Alineación Diseño-Implementación

Lo que se diseña en Figma es lo que se construye en código. Nuestro proceso asegura:

* UX define objetivos, flujos y estados
* Los diseñadores trabajan desde nuestra biblioteca Figma (refleja MUI + tema Decentraland)
* Los desarrolladores implementan usando componentes UI2

### 2. Enfoque Tema-Primero

Todas las propiedades visuales DEBEN venir del tema UI2:

* **Colores**: `theme.palette` y `dclColors`
* **Tipografía**: Escala de tipo Material Design
* **Espaciado**: `theme.spacing(n)`
* **Breakpoints**: Breakpoints responsivos predefinidos
* **Sin valores arbitrarios**: Sin códigos hex o valores de píxeles ad-hoc

### 3. Accesibilidad por Defecto

Cada componente DEBE:

* Soportar navegación por teclado
* Proporcionar estados de foco visibles
* Incluir etiquetas ARIA donde sea apropiado
* Cumplir requisitos de contraste de color
* Manejar todos los estados (carga, error, deshabilitado)

### 4. Tipado Fuerte

Usar TypeScript en todo:

* Tema tipado con autocompletado
* Props de componentes tipados
* Styled-components tipados
* Sin tipos `any`

## Jerarquía de Componentes

```
UI2 (decentraland-ui2)
├── Componentes MUI (tematizados)
│   ├── Button, Card, TextField, etc.
│   └── Tema Decentraland aplicado
├── Componentes Personalizados
│   ├── Navbar
│   ├── UserMenu
│   └── Otros componentes específicos de Decentraland
└── Sistema de Tema
    ├── Colores (dclColors)
    ├── Tipografía
    ├── Espaciado
    └── Breakpoints
```

## Ejemplo de Inicio Rápido

```tsx
import { ThemeProvider } from '@mui/material/styles';
import { Button, Card } from '@mui/material';
import { theme, dclColors } from 'decentraland-ui2';
import { styled } from '@mui/material/styles';

// Usar proveedor de tema UI2
function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  );
}

// Usar componentes MUI directamente
function MyComponent() {
  return (
    <Card>
      <Button variant="contained" color="primary">
        Haz Click
      </Button>
    </Card>
  );
}

// Crear componentes estilizados usando tema
const CustomCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));
```

## Referencia de Tema

### Colores

```tsx
import { dclColors } from 'decentraland-ui2';

// Uso
dclColors.rarity.unique
dclColors.rarity.mythic
theme.palette.primary.main
theme.palette.text.primary
```

**Fuente**: [colors.ts](https://github.com/decentraland/ui2/blob/master/src/theme/colors.ts)

### Tipografía

```tsx
// Variantes disponibles
<Typography variant="h1">Encabezado 1</Typography>
<Typography variant="body1">Texto de cuerpo</Typography>
<Typography variant="caption">Subtítulo</Typography>
```

**Fuente**: [typography.ts](https://github.com/decentraland/ui2/blob/master/src/theme/typography.ts)

### Breakpoints

```tsx
xs: 768px   // Extra pequeño (móvil)
sm: 991px   // Pequeño (tablet)
md: 1024px  // Mediano (escritorio pequeño)
lg: 1280px  // Grande (escritorio)
xl: 1500px  // Extra grande (escritorio grande)
```

**Fuente**: [index.ts](https://github.com/decentraland/ui2/blob/master/src/theme/index.ts)

## Cumplimiento de Estándares

Las palabras clave "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY" y "OPTIONAL" en esta documentación deben interpretarse como se describe en [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

## Comenzando

1. Revisar el [Resumen del Proceso](process-overview.md) para entender el flujo de trabajo
2. Aprender sobre [Componentes Personalizados](../../../contributor/contributor-guides/web-ui-standards/custom-components.md) para cuándo crear nuevos componentes
3. Estudiar [Estilos y Tematización](../../../contributor/contributor-guides/web-ui-standards/styling-and-theming.md) para detalles de implementación
4. Si estás migrando desde UI1, ver la [Guía de Migración](../../../contributor/contributor-guides/web-ui-standards/migration.md)

## Recursos

* **Storybook**: [ui2.decentraland.org](http://ui2.decentraland.org)
* **Biblioteca Figma**: [Sistema de Diseño DCL UI2](https://www.figma.com/design/tsyaDSedcsVZ8iM9N0McT2/DCL-UI2)
* **Documentación Material UI**: [mui.com](https://mui.com/material-ui/)
* **Material Design**: [material.io](https://m2.material.io/)
* **Repositorio GitHub**: [decentraland/ui2](https://github.com/decentraland/ui2)
