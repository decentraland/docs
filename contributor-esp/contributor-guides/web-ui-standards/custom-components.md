# Componentes Personalizados

Distinguimos entre dos tipos de componentes personalizados, cada uno con procesos y expectativas diferentes.

## Tipos de Componentes

### A) Componentes Personalizados Específicos del Proyecto

Componentes construidos para un proyecto o pantalla específica, no destinados para reutilización en otros proyectos.

**Ejemplos:**

* Un `Box` con diseño especial usado dentro de un proyecto
* Una variante de `Card` con diseño personalizado para las pantallas de un proyecto
* Visualizaciones de datos específicas del proyecto
* Componentes de layout únicos

**Cuándo usar:**

* El componente resuelve un problema único de un proyecto
* Es poco probable que se necesite en otros proyectos
* Demasiado específico para generalizar

### B) Componentes Candidatos UI2

Componentes destinados para reutilización en múltiples proyectos y productos.

**Ejemplos:**

* `Navbar` - Navegación general del sitio
* `UserMenu` - Menú de cuenta de usuario
* Diálogos `Modal` estandarizados
* Componentes siendo migrados desde UI1

**Cuándo usar:**

* El componente se usará en múltiples proyectos
* Representa un patrón común de Decentraland
* Reemplaza o extiende un componente UI1

***

## Componentes Específicos del Proyecto

### Requisitos

#### Usa MUI como Base

**DEBE** extender componentes MUI existentes siempre que sea posible:

```tsx
// ✅ Bien: Extiende Card de MUI
import { Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProjectCard = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// ❌ Mal: Construye desde cero
const ProjectCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  // Duplicando funcionalidad de Card
}));
```

**No hagas fork o dupliques patrones que MUI ya cubre:**

* Usa `Card` en lugar de crear un box personalizado con sombras
* Usa `Button` en lugar de crear un anchor estilizado
* Usa `TextField` en lugar de crear un input personalizado
* Extiende `Dialog` en lugar de crear un modal personalizado

#### Solo Valores del Theme

**DEBE** usar valores del theme UI2:

```tsx
// ✅ Bien: Todos los valores del theme
const StyledBox = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

// ❌ Mal: Valores ad-hoc
const StyledBox = styled('div')({
  color: '#333333',
  backgroundColor: '#FFFFFF',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #E0E0E0',
});
```

**No se permiten valores arbitrarios:**

* Colores: Usa `theme.palette` o `dclColors`
* Espaciado: Usa `theme.spacing(n)`
* Border radius: Usa `theme.shape.borderRadius`
* Tipografía: Usa variantes de `theme.typography`
* Breakpoints: Usa helpers de `theme.breakpoints`

#### Estados y Accesibilidad

**DEBE** definir e implementar todos los estados interactivos:

```tsx
const ActionButton = styled('button')(({ theme }) => ({
  // Estado base/idle
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'transform']),
  
  // Estado hover
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  
  // Estado focus (navegación por teclado)
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  
  // Estado active/pressed
  '&:active': {
    transform: 'scale(0.98)',
  },
  
  // Estado disabled
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    cursor: 'not-allowed',
  },
}));
```

**DEBE** implementar accesibilidad básica:**

* **Navegación por teclado** - Enfocable y operable con teclado
* **Indicadores de foco** - Estados de foco visibles
* **Etiquetas ARIA** - Donde el texto no es visible
* **HTML semántico** - Usa elementos apropiados
* **Contraste de color** - Cumple estándares WCAG AA

### Ejemplo: Componente Específico del Proyecto

```tsx
// src/components/LandCard/LandCard.tsx
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Parcel } from '@/types';

interface LandCardProps {
  parcel: Parcel;
  onTransfer: (id: string) => void;
  onView: (id: string) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: theme.transitions.create('transform'),
  
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const CoordinatesText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamilyMono,
}));

export function LandCard({ parcel, onTransfer, onView }: LandCardProps) {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {parcel.name || `Parcel ${parcel.x},${parcel.y}`}
        </Typography>
        <CoordinatesText variant="body2">
          ({parcel.x}, {parcel.y})
        </CoordinatesText>
        <Typography variant="body2" color="text.secondary">
          Owner: {parcel.owner}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onView(parcel.id)}>
          View
        </Button>
        <Button size="small" onClick={() => onTransfer(parcel.id)}>
          Transfer
        </Button>
      </CardActions>
    </StyledCard>
  );
}
```

***

## Componentes Candidatos UI2

Los componentes que se compartirán entre proyectos requieren estándares más altos y documentación más completa.

### Requisitos

#### Alineación con el Theme

**DEBE** depender exclusivamente de valores del theme UI2:

```tsx
// ✅ Bien: Integración completa con theme
const NavbarContainer = styled('nav')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 2),
  height: 64,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 1),
  },
}));
```

#### Cobertura de Storybook

**DEBE** agregar stories comprehensivos de Storybook:

**Cobertura requerida:**

1. **Todos los props y variantes**
   * Cada combinación de props
   * Todas las variantes de tamaño
   * Todas las variantes de color
2. **Todos los estados**
   * Idle/default
   * Loading
   * Error
   * Disabled
   * Hover (via pseudo states addon)
   * Focus (via pseudo states addon)
3. **Interacciones**
   * Click handlers
   * Envíos de formularios
   * Navegación por teclado
4. **Esquemas de color**
   * Light mode
   * Dark mode
5. **Comportamiento responsive**
   * Breakpoints clave (xs, md, lg)
   * Documentar comportamiento en cada breakpoint

**Ejemplo de archivo Storybook:**

```tsx
// Navbar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact'],
    },
    showUserMenu: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    variant: 'default',
    showUserMenu: true,
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    showUserMenu: true,
  },
};

export const WithoutUserMenu: Story = {
  args: {
    variant: 'default',
    showUserMenu: false,
  },
};

export const Loading: Story = {
  args: {
    variant: 'default',
    showUserMenu: true,
    isLoading: true,
  },
};

// Prueba diferentes viewports
export const Mobile: Story = {
  args: {
    variant: 'compact',
    showUserMenu: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {
    variant: 'default',
    showUserMenu: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Prueba esquemas de color
export const DarkMode: Story = {
  args: {
    variant: 'default',
    showUserMenu: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
```

### Estructura del Componente

Los componentes candidatos UI2 DEBEN seguir esta estructura:

```
src/components/Navbar/
├── Navbar.tsx           # Componente principal
├── Navbar.styles.ts     # Componentes estilizados
├── Navbar.stories.tsx   # Stories de Storybook
├── Navbar.test.tsx      # Tests unitarios
├── types.ts             # Tipos TypeScript
├── index.ts             # Exports públicos
└── README.md            # Documentación del componente
```

### Requisitos de Documentación

**DEBE** incluir en el README del componente:

1. **Propósito** - ¿Qué problema resuelve esto?
2. **Uso** - Cómo usar el componente
3. **Props** - Todos los props con tipos y descripciones
4. **Ejemplos** - Casos de uso comunes
5. **Accesibilidad** - Soporte de teclado, etiquetas ARIA
6. **Theming** - Qué valores del theme usa
7. **Notas de migración** - Si reemplaza un componente UI1

**Ejemplo de README:**

```markdown
# Navbar

Componente de navegación general del sitio con menú de usuario y comportamiento responsive.

## Uso

\```tsx
import { Navbar } from 'decentraland-ui2';

function App() {
  return (
    <Navbar
      variant="default"
      showUserMenu={true}
      onLogoClick={() => navigate('/')}
      onLoginClick={handleLogin}
    />
  );
}
\```

## Props

| Prop         | Type                   | Default   | Description                   |
| ------------ | ---------------------- | --------- | ----------------------------- |
| variant      | 'default' \| 'compact' | 'default' | Variante de navegación        |
| showUserMenu | boolean                | true      | Mostrar menú de usuario       |
| onLogoClick  | () => void             | -         | Handler de click en logo      |
| onLoginClick | () => void             | -         | Handler de click en login     |

## Accesibilidad

* Navegación por teclado: Tab a través de items del menú
* ARIA: Landmarks y labels apropiados
* Screen reader: Anuncia estado del menú

## Theming

Usa estos valores del theme:

* `theme.palette.background.paper`
* `theme.palette.divider`
* `theme.spacing`
* `theme.breakpoints`

```

### Requisitos de Testing

**DEBE** incluir tests para:

* Renderizado de props
* Interacciones de usuario
* Funcionalidades de accesibilidad
* Comportamiento responsive
* Estados de error

```tsx
// Navbar.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('should render logo', () => {
    render(<Navbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should call onLogoClick when logo is clicked', async () => {
    const onLogoClick = jest.fn();
    render(<Navbar onLogoClick={onLogoClick} />);
    
    await userEvent.click(screen.getByRole('link', { name: /decentraland/i }));
    expect(onLogoClick).toHaveBeenCalled();
  });

  it('should be keyboard navigable', async () => {
    render(<Navbar />);
    const firstLink = screen.getAllByRole('link')[0];
    
    firstLink.focus();
    expect(firstLink).toHaveFocus();
  });
});
```

***

## Matriz de Decisión

Usa esto para decidir qué tipo de componente crear:

| Pregunta                              | Específico del Proyecto | Candidato UI2 |
| ------------------------------------- | ----------------------- | ------------- |
| ¿Otros proyectos usarán esto?         | No                      | Sí            |
| ¿UI1 tiene un equivalente?            | N/A                     | Probablemente |
| ¿Necesita documentación de Storybook? | No                      | **Sí**        |
| ¿Necesita tests comprehensivos?       | Básico                  | **Extensivo** |
| ¿Se requiere revisión de diseño?      | Nivel proyecto          | **Nivel UI2** |
| ¿Puede usar patrones del proyecto?    | Sí                      | **No**        |
| ¿Debe funcionar en todos los themes?  | No                      | **Sí**        |

***

## Proceso de Aprobación

### Componentes Específicos del Proyecto

1. Code review del maintainer del proyecto
2. Verificar cumplimiento del theme
3. Probar en contexto del proyecto
4. Merge cuando sea aprobado

### Componentes Candidatos UI2

1. Revisión y aprobación de diseño
2. Revisión de diseño técnico
3. Implementación
4. Stories de Storybook
5. Tests comprehensivos
6. Revisión de accesibilidad
7. Code review
8. PR al repositorio UI2
9. Versionado y publicación
10. Actualizar proyectos dependientes

***

## Mejores Prácticas

### Composición Sobre Personalización

```tsx
// ✅ Bien: Compone componentes MUI
function FeatureCard({ title, children }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

// ❌ Mal: Re-implementa funcionalidad de Card
function FeatureCard({ title, children }) {
  return (
    <div className="custom-card">
      <div className="custom-card-content">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
```

### Mejora Progresiva

Empieza simple y agrega funcionalidades según sea necesario:

1. Versión básica con funcionalidad core
2. Agregar comportamiento responsive
3. Agregar funcionalidades de accesibilidad
4. Agregar interacciones avanzadas
5. Optimizar performance

### Documentación Primero

Antes de escribir código:

1. Escribe el README del componente
2. Define interface de props
3. Lista estados requeridos
4. Planea stories de Storybook
5. Luego implementa

***

## Próximos Pasos

* Revisa [Styling & Theming](styling-and-theming.md) para detalles de implementación
* Ve [Migration Guide](migration.md) para migraciones UI1 a UI2
* Verifica [Process Overview](process-overview.md) para el flujo de trabajo completo
