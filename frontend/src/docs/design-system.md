# HealthTrackPlus Design System

Este documento descreve o sistema de design unificado implementado no HealthTrackPlus. O sistema fornece uma abordagem consistente para cores, tipografia, espaçamentos, componentes e acessibilidade através de toda a aplicação.

## Índice

- [Visão Geral](#visão-geral)
- [Design Tokens](#design-tokens)
  - [Cores](#cores)
  - [Tipografia](#tipografia)
  - [Espaçamento](#espaçamento)
  - [Bordas e Sombras](#bordas-e-sombras)
- [Componentes](#componentes)
  - [Button](#button)
  - [Card](#card)
  - [Badge](#badge)
  - [Typography](#typography)
  - [Spacing](#spacing)
- [Acessibilidade](#acessibilidade)
- [Responsividade](#responsividade)
- [Temas (Light/Dark)](#temas-lightdark)
- [Boas Práticas](#boas-práticas)

## Visão Geral

O design system do HealthTrackPlus foi criado para:

1. Fornecer uma experiência consistente em todos os dispositivos e temas
2. Melhorar a acessibilidade da aplicação
3. Simplificar o desenvolvimento através de componentes reutilizáveis
4. Facilitar a manutenção através de tokens de design centralizados

O sistema é baseado em tokens de design definidos em CSS e implementado usando TailwindCSS e componentes React com TypeScript.

## Design Tokens

### Cores

As cores são definidas como variáveis CSS usando o formato HSL para melhor suporte a manipulação e transparência:

```css
:root {
  /* Cores base para light mode */
  --light-bg-primary: 245 247 251;       /* #f5f7fb */
  --light-bg-secondary: 255 255 255;     /* #ffffff */

  /* Cores semânticas */
  --light-primary-main: 59 130 246;      /* #3b82f6 - Azul */
  --light-success-main: 16 185 129;      /* #10b981 - Verde */
  --light-error-main: 239 68 68;         /* #ef4444 - Vermelho */
  --light-warning-main: 245 158 11;      /* #f59e0b - Âmbar */
  --light-info-main: 14 165 233;         /* #0ea5e9 - Azul claro */
}
```

As cores são mapeadas para tokens semânticos que são usados através da aplicação:

```css
:root {
  --primary: var(--light-primary-main);
  --primary-hover: var(--light-primary-hover);
  --primary-muted: var(--light-primary-muted);
  --primary-foreground: 255 255 255;
}

.dark {
  --primary: var(--dark-primary-main);
  --primary-hover: var(--dark-primary-hover);
  --primary-muted: var(--dark-primary-muted);
  --primary-foreground: 255 255 255;
}
```

#### Uso das Cores

Use as variáveis semânticas em vez de cores diretas para garantir compatibilidade com temas:

```jsx
// ✅ Bom - Usa variáveis semânticas
<button className="bg-primary text-primary-foreground">Botão</button>

// ❌ Ruim - Usa valores diretamente
<button className="bg-blue-600 text-white">Botão</button>
```

### Tipografia

A tipografia é baseada em uma escala consistente de tamanhos:

```css
:root {
  --font-size-2xs: 0.625rem;    /* 10px */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */
}
```

Para uso consistente, use as classes de utilitário para tipografia:

- `text-h1` a `text-h6` para títulos
- `text-body-lg`, `text-body`, `text-body-sm` para texto de corpo
- `text-caption` para texto auxiliar menor

Exemplo:

```jsx
<h1 className="text-h1">Título Principal</h1>
<p className="text-body">Texto normal para corpo do documento.</p>
<span className="text-caption">Texto menor para legendas e notas.</span>
```

Ou use o componente Typography para uma API mais rica:

```jsx
<Typography variant="h1">Título Principal</Typography>
<Typography variant="body">Texto normal para corpo do documento.</Typography>
<Typography variant="caption" color="muted">Texto em cinza para legendas.</Typography>
```

### Espaçamento

O sistema de espaçamento segue uma escala consistente:

```css
:root {
  --space-0: 0px;
  --space-0-5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1-5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  /* ... */
  --space-24: 6rem;        /* 96px */
}
```

Use os componentes de espaçamento para aplicar margens e paddings consistentes:

```jsx
<Spacer size="md" />  {/* Adiciona espaçamento vertical */}
<Spacer direction="horizontal" size="sm" /> {/* Espaço horizontal */}

<Box p="md" m="lg">  {/* Padding médio, margin grande */}
  <div>Conteúdo com espaçamento consistente</div>
</Box>

<Flex gap="md" align="center"> {/* Flex container com gap médio */}
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

### Bordas e Sombras

Bordas e cantos arredondados seguem uma escala consistente:

```css
:root {
  --radius-sm: 0.125rem;      /* 2px */
  --radius-md: 0.25rem;       /* 4px */
  --radius-lg: 0.5rem;        /* 8px */
  --radius-xl: 0.75rem;       /* 12px */
  --radius-2xl: 1rem;         /* 16px */
  --radius-full: 9999px;      /* Circular */
}
```

## Componentes

### Button

O componente Button oferece diferentes variantes, tamanhos e estilos:

```jsx
// Variantes básicas
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Variantes semânticas
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Error</Button>

// Tamanhos
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Arredondamento
<Button rounded="none">Square</Button>
<Button rounded="full">Pill</Button>

// Botões de ícone
<Button variant="ghost" size="icon">
  <IconComponent />
</Button>
```

### Card

O componente Card é usado para agrupar conteúdo relacionado:

```jsx
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo principal do card.
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>

// Variantes
<Card variant="outline">Card com bordas</Card>
<Card variant="elevated">Card com sombra</Card>
<Card variant="primary">Card colorido semântico</Card>

// Título com nível de heading correto
<CardTitle level={2}>Título como h2</CardTitle>
<CardTitle level={3}>Título como h3</CardTitle>
```

### Badge

Os Badges são usados para destacar status e labels:

```jsx
// Variantes básicas
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>

// Variantes semânticas
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// Variantes suaves
<Badge variant="soft-primary">Primary</Badge>
<Badge variant="soft-success">Success</Badge>

// Tamanhos
<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>

// Status badges
<Badge status="active">Active</Badge>
<Badge status="processing">Processing</Badge>
<Badge status="completed">Completed</Badge>
```

### Typography

O componente Typography facilita o uso consistente de estilos de texto:

```jsx
// Variantes
<Typography variant="display">Display</Typography>
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="body-lg">Large body text</Typography>
<Typography variant="body">Normal body text</Typography>
<Typography variant="body-sm">Small body text</Typography>
<Typography variant="caption">Caption text</Typography>

// Cores
<Typography color="primary">Texto primário</Typography>
<Typography color="muted">Texto com menos destaque</Typography>
<Typography color="success">Texto de sucesso</Typography>

// Pesos de fonte
<Typography weight="normal">Peso normal</Typography>
<Typography weight="medium">Peso médio</Typography>
<Typography weight="bold">Peso bold</Typography>

// Alinhamento
<Typography align="left">Alinhado à esquerda</Typography>
<Typography align="center">Centralizado</Typography>
<Typography align="right">Alinhado à direita</Typography>

// Truncamento
<Typography truncate>Texto muito longo que será truncado com reticências...</Typography>
```

Também existem componentes pré-configurados para cada variante:

```jsx
<Display>Display text</Display>
<Heading level={1}>H1 Heading</Heading>
<Body>Normal text</Body>
<BodySmall>Smaller text</BodySmall>
<Caption>Caption text</Caption>
```

### Spacing

O sistema de espaçamento inclui componentes para aplicar espaçamento consistente:

```jsx
// Spacer - espaço vertical ou horizontal
<Spacer size="md" />
<Spacer direction="horizontal" size="lg" />

// Box - container com espaçamento
<Box p="md" m="lg" radius="lg">
  Conteúdo com padding médio e margem grande
</Box>

// Flex - flexbox com espaçamento
<Flex gap="md" direction="column" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Grid - grid responsivo
<Grid columns={2} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>
```

## Acessibilidade

O design system inclui várias melhorias de acessibilidade:

1. **Contraste de Cores**: Todas as combinações de cores seguem as diretrizes WCAG 2.1 AA para contraste.

2. **Suporte a Teclado**: Todos os componentes interativos são acessíveis via teclado.

3. **Atributos ARIA**: Os componentes incluem atributos ARIA apropriados:
   - Buttons têm `aria-disabled` quando desativados
   - Badges de erro têm `aria-live="assertive"` para anunciadores de tela
   - Cards têm estrutura semântica com cabeçalhos apropriados

4. **Níveis de Cabeçalho**: O componente CardTitle permite especificar o nível de cabeçalho correto (`h2`, `h3`, etc.) para manter a estrutura do documento.

5. **Tamanhos de Toque**: Os elementos interativos têm tamanhos mínimos para melhor usabilidade em dispositivos touch.

## Responsividade

O sistema de design é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- **Breakpoints**: Definidos de forma consistente (`xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`)
- **Classes Responsivas**: As classes de tipografia e espaçamento se ajustam automaticamente para diferentes tamanhos de tela
- **Componentes Adaptáveis**: Os componentes como Card e Button se adaptam para melhor experiência em mobile

## Temas (Light/Dark)

O sistema suporta temas claro e escuro através de variáveis CSS:

- As cores são definidas separadamente para temas claro e escuro
- A classe `.dark` no elemento `html` ativa o tema escuro
- Todos os componentes respondem automaticamente ao tema atual

## Boas Práticas

1. **Use tokens semânticos**: Use `bg-primary` em vez de `bg-blue-600`
2. **Use componentes**: Prefira os componentes do design system em vez de criar elementos personalizados
3. **Siga a escala**: Use os tamanhos pré-definidos para espaçamento, tipografia e raios
4. **Mantenha a acessibilidade**: Use níveis de cabeçalho corretos e atributos ARIA apropriados
5. **Respeite a responsividade**: Teste em diferentes tamanhos de tela e use as classes responsivas

---

Este design system está em constante evolução. Para sugestões ou dúvidas, entre em contato com a equipe de UI/UX.