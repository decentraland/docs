# Styling & Theming

Esta página cubre estándares comprehensivos de styling para IU web de Decentraland usando styled-components con la solución de styling de Material UI.

{% hint style="info" %}
Todos los ejemplos de código en este documento son ilustrativos. No representan componentes de producción pero demuestran patrones y estándares.
{% endhint %}

## Principios Fundamentales

1. **Solo sintaxis de objetos** - Usa notación de objetos para soporte fuerte de TypeScript
2. **Theme primero** - Todos los valores vienen del theme UI2
3. **Sin estilos inline** - Usa styled components para todo el styling
4. **Todo tipado** - Aprovecha TypeScript para props y theme
5. **Responsive por defecto** - Usa breakpoints del theme

***

## Estándar de Sintaxis de Objetos

Los componentes UI2 **DEBEN** usar la sintaxis de objetos. Esto asegura soporte fuerte de TypeScript, validación csstype e integración directa con theme.

{% hint style="warning" %}
La sintaxis de template literals **no está permitida**. Siempre usa notación de objetos.
{% endhint %}

### Ejemplo Básico

```tsx
// ✅ Bien: Sintaxis de objetos
const Button = styled('button')({
  color: 'turquoise',
  padding: '8px 16px',
});

// ❌ Mal: Sintaxis de template literals
const Button = styled.button`
  color: turquoise;
  padding: 8px 16px;
`;
```

### Con Theme y Props

```tsx
interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
}

// ✅ Bien: Sintaxis de objetos con theme y props
const Button = styled('button')<ButtonProps>(({ theme, primary, size = 'medium' }) => ({
  color: primary ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: primary ? theme.palette.primary.main : 'transparent',
  borderRadius: theme.shape.borderRadius,
  padding: {
    small: theme.spacing(0.5, 1),
    medium: theme.spacing(1, 2),
    large: theme.spacing(1.5, 3),
  }[size],
}));
```

{% hint style="danger" %}
**Regla**: Los valores DEBEN siempre venir del theme UI2. No se permiten códigos hex arbitrarios o valores en píxeles.
{% endhint %}

***

## Sintaxis de Elementos

Al estilizar elementos HTML nativos, siempre usa la forma de llamada a función `styled('tag')`.

### Sintaxis Correcta

```tsx
// ✅ Bien: Forma de llamada a función
const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const Action = styled('button')(({ theme }) => ({
  color: theme.palette.primary.main,
  padding: theme.spacing(1, 2),
}));

const Label = styled('label')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
}));
```

### Sintaxis Incorrecta

```tsx
// ❌ Mal: Forma de propiedad (sintaxis legacy)
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Action = styled.button`
  color: ${props => props.theme.palette.primary.main};
`;
```

***

## Sin Estilos Inline

Los estilos inline (`style={...}`) **NO DEBEN** usarse en componentes UI2.

### ¿Por Qué No Estilos Inline?

* Evitan el tipado del theme
* Más difíciles de mantener
* Previenen reutilización
* No pueden optimizarse
* Sin validación de TypeScript

### La Forma Correcta

```tsx
// ❌ Mal: Estilos inline
<Card 
  key={id} 
  style={{ backgroundColor: color } as React.CSSProperties}
>
  <CardHeader>
    <Title style={{ fontSize: 20 }}>{title}</Title>
  </CardHeader>
</Card>

// ✅ Bien: Styled components con props
interface CardProps {
  backgroundColor: string;
}

interface TitleProps {
  size: number;
}

const StyledCard = styled('div')<CardProps>(({ backgroundColor, theme }) => ({
  backgroundColor,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));

const Title = styled('h2')<TitleProps>(({ size, theme }) => ({
  fontSize: theme.typography.pxToRem(size),
  color: theme.palette.text.primary,
}));

<StyledCard key={id} backgroundColor={color}>
  <CardHeader>
    <Title size={20}>{title}</Title>
  </CardHeader>
</StyledCard>
```

***

## Breakpoints

Usa helpers de `theme.breakpoints` en lugar de valores en píxeles hardcodeados.

### Helpers de Breakpoint

| Helper                | Uso                                     | Descripción            |
| --------------------- | --------------------------------------- | ---------------------- |
| `up(key)`             | `theme.breakpoints.up('md')`            | Min-width hacia arriba |
| `down(key)`           | `theme.breakpoints.down('md')`          | Max-width hacia abajo  |
| `between(start, end)` | `theme.breakpoints.between('sm', 'lg')` | Entre dos breakpoints  |
| `only(key)`           | `theme.breakpoints.only('md')`          | Solo en ese breakpoint |

### Ejemplos

```tsx
// ❌ Mal: Breakpoints hardcodeados
const Panel = styled('div')`
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// ✅ Bien: Breakpoints del theme
interface PanelProps {
  expanded: boolean;
}

const Panel = styled('div')<PanelProps>(({ theme, expanded }) => ({
  width: expanded ? '400px' : '0',
  transition: theme.transitions.create('width'),
  
  [theme.breakpoints.down('sm')]: {
    width: expanded ? '100%' : '0',
  },
}));
```

### Múltiples Breakpoints

```tsx
const Layout = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 320px',
  gap: theme.spacing(2),
  
  // Mobile: columna única
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
  
  // Desktop grande: sidebar más ancho
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: '1fr 400px',
  },
  
  // Rango tablet: gap diferente
  [theme.breakpoints.between('sm', 'lg')]: {
    gap: theme.spacing(3),
  },
  
  // Solo tablet
  [theme.breakpoints.only('md')]: {
    padding: theme.spacing(2),
  },
}));
```

***

## Escala de Espaciado

Usa `theme.spacing` exclusivamente para margins, paddings y gaps.

### Convención de Espaciado

* `theme.spacing(n)` donde `n` es un número
* La unidad base típicamente es 8px
* `spacing(1)` = 8px, `spacing(2)` = 16px, etc.
* Se permiten decimales: `spacing(1.5)` = 12px

```tsx
// ✅ Bien: Espaciado del theme
const Box = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),           // 16px
  margin: theme.spacing(1, 0),         // 8px vertical, 0 horizontal
  gap: theme.spacing(1.5),             // 12px
  paddingInline: theme.spacing(3),     // 24px izquierda/derecha
}));

// ❌ Mal: Valores en píxeles raw
const Box = styled('div')({
  padding: '16px',
  margin: '8px 0',
  gap: '12px',
});
```

### Patrones Comunes de Espaciado

```tsx
const Card = styled('div')(({ theme }) => ({
  // Espaciado uniforme alrededor
  padding: theme.spacing(3),
  
  // Diferente vertical/horizontal
  padding: theme.spacing(2, 3),  // 16px vertical, 24px horizontal
  
  // Todos los lados diferentes
  padding: theme.spacing(1, 2, 3, 2),  // top, right, bottom, left
  
  // Propiedades lógicas (preferidas para soporte RTL)
  paddingBlock: theme.spacing(2),      // top y bottom
  paddingInline: theme.spacing(3),     // left y right
  marginBlockStart: theme.spacing(1),  // margin-top
}));
```

***

## Z-Index y Stacking

Sigue la escala z-index del theme. Nunca uses valores z-index arbitrarios.

### Valores Z-Index del Theme

```tsx
theme.zIndex.mobileStepper  // 1000
theme.zIndex.fab            // 1050
theme.zIndex.speedDial      // 1050
theme.zIndex.appBar         // 1100
theme.zIndex.drawer         // 1200
theme.zIndex.modal          // 1300
theme.zIndex.snackbar       // 1400
theme.zIndex.tooltip        // 1500
```

### Uso Correcto

```tsx
// ✅ Bien: Z-index del theme
const StickyBar = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  backgroundColor: theme.palette.background.paper,
}));

const Overlay = styled('div')(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
}));

// ❌ Mal: Z-index arbitrario
const StickyBar = styled('div')({
  position: 'sticky',
  top: 0,
  zIndex: 999,  // No hagas esto
});
```

### Mejores Prácticas de Stacking Context

* Sé consciente de crear nuevos stacking contexts
* Evita `position: relative` innecesario en padres
* Documenta por qué se necesita un z-index
* Si necesitas una nueva capa, agrégala primero al theme

***

## Tokens de Color

Siempre consume colores desde `theme.palette` y `dclColors`. No uses valores hex ad-hoc.

### Estructura de Palette

```tsx
// Colores de texto
theme.palette.text.primary
theme.palette.text.secondary
theme.palette.text.disabled

// Colores de fondo
theme.palette.background.default
theme.palette.background.paper

// Primary/Secondary/Error
theme.palette.primary.main
theme.palette.primary.light
theme.palette.primary.dark
theme.palette.primary.contrastText

// Colores de acción
theme.palette.action.active
theme.palette.action.hover
theme.palette.action.selected
theme.palette.action.disabled
theme.palette.action.disabledBackground

// Divisores
theme.palette.divider
```

### Colores de Decentraland

```tsx
import { dclColors } from 'decentraland-ui2';

// Colores de rarity
dclColors.rarity.unique
dclColors.rarity.mythic
dclColors.rarity.legendary
dclColors.rarity.epic
dclColors.rarity.rare
dclColors.rarity.uncommon
dclColors.rarity.common
```

### Ejemplos

```tsx
// ✅ Bien: Colores del theme
const Chip = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.divider,
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const RarityBadge = styled('span')<{ rarity: string }>(({ rarity }) => ({
  backgroundColor: dclColors.rarity[rarity],
  color: '#FFFFFF', // Color de contraste - aceptable si está documentado
  padding: '4px 8px',
  borderRadius: '4px',
}));

// ❌ Mal: Valores hex arbitrarios
const Chip = styled('span')({
  color: '#666666',
  backgroundColor: '#FFFFFF',
  borderColor: '#E0E0E0',
});
```

***

## Estados Interactivos

Todos los controles interactivos DEBEN mostrar estados visibles para hover, focus, active y disabled.

### Componente Interactivo Completo

```tsx
const InteractiveButton = styled('button')(({ theme }) => ({
  // Estado base
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  outline: 'none',
  transition: theme.transitions.create([
    'background-color',
    'transform',
    'box-shadow',
  ]),
  
  // Estado hover (mouse)
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  
  // Estado focus (navegación por teclado)
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
    boxShadow: theme.shadows[2],
  },
  
  // Estado active/pressed
  '&:active': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(0.98)',
  },
  
  // Estado disabled
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    cursor: 'not-allowed',
    transform: 'none',
  },
}));
```

### Patrón Focus-Visible

Siempre usa `:focus-visible` en lugar de `:focus` para evitar mostrar anillos de foco en clics de mouse:

```tsx
// ✅ Bien: Solo muestra anillo de foco para teclado
'&:focus-visible': {
  outline: `2px solid ${theme.palette.primary.main}`,
  outlineOffset: 2,
}

// ❌ Mal: Muestra anillo de foco en cada click
'&:focus': {
  outline: `2px solid ${theme.palette.primary.main}`,
}
```

***

## Tipografía

Usa variantes de tipografía del theme en lugar de propiedades de fuente personalizadas.

```tsx
// ✅ Bien: Variantes de tipografía
const Heading = styled('h1')(({ theme }) => ({
  ...theme.typography.h1,
  marginBottom: theme.spacing(2),
}));

const Body = styled('p')(({ theme}) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
}));

// Con componente Typography de MUI (preferido)
<Typography variant="h1">Heading</Typography>
<Typography variant="body1">Body text</Typography>

// ❌ Mal: Tipografía personalizada
const Heading = styled('h1')({
  fontSize: '32px',
  fontWeight: 700,
  lineHeight: 1.2,
});
```

***

## Optimización de Performance

### No Crees Styled Components en Render

```tsx
// ❌ Mal: Crea nuevo componente en cada render
function Component({ color }) {
  const Box = styled('div')({
    backgroundColor: color,
  });
  return <Box />;
}

// ✅ Bien: Crea una vez, pasa props
const Box = styled('div')<{ color: string }>(({ color }) => ({
  backgroundColor: color,
}));

function Component({ color }) {
  return <Box color={color} />;
}
```

### Memoiza Props Derivados

```tsx
// ❌ Mal: Crea nuevo objeto en cada render
<StyledComponent style={{ color: isDark ? 'white' : 'black' }} />

// ✅ Bien: Pasa props primitivos
const StyledComponent = styled('div')<{ isDark: boolean }>(({ isDark, theme }) => ({
  color: isDark ? theme.palette.common.white : theme.palette.common.black,
}));

<StyledComponent isDark={isDark} />
```

***

## Convenciones de Nombres

### Nombres de Componentes

* **PascalCase** para componentes
* Nombres descriptivos

```tsx
// ✅ Nombres buenos
const UserCard = styled('div')({...});
const PrimaryButton = styled('button')({...});
const NavigationList = styled('ul')({...});

// ❌ Nombres malos
const card = styled('div')({...});
const btn = styled('button')({...});
const list1 = styled('ul')({...});
```

### Estructura de Archivos

```
Component.tsx        # Componente principal
Component.styles.ts  # Styled components
Component.test.tsx   # Tests
Component.stories.tsx # Storybook
```

***

## Próximos Pasos

* Revisa [Custom Components](custom-components.md) para guías de creación de componentes
* Ve [Migration Guide](migration.md) para migraciones UI1 a UI2
* Verifica [Process Overview](process-overview.md) para el flujo de trabajo completo
