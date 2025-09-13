# Sistema de Temas - HealthTrackPlus

Este documento descreve o sistema de temas implementado no HealthTrackPlus, incluindo a estrutura da paleta de cores, como usar os componentes com os novos variantes de cores e boas práticas para manter a consistência visual.

## Índice

1. [Visão Geral](#visão-geral)
2. [Paleta de Cores](#paleta-de-cores)
3. [Componentes Atualizados](#componentes-atualizados)
4. [Uso do Hook `useTheme`](#uso-do-hook-usetheme)
5. [Adicionando Tema ao Componente](#adicionando-tema-ao-componente)
6. [Boas Práticas](#boas-práticas)
7. [Página de Previsão](#página-de-previsão)

## Visão Geral

O sistema de temas do HealthTrackPlus foi implementado para oferecer uma experiência visual agradável e consistente em modos claro e escuro. As principais características incluem:

- **Paleta de cores semântica**: Cores definidas por função (primária, sucesso, erro, etc.)
- **Suporte a temas claro e escuro**: Transições suaves entre modos
- **Suporte a preferência do sistema**: Detecção automática do tema do sistema
- **Variáveis CSS globais**: Fácil atualização e manutenção
- **Componentes com variantes temáticas**: Botões, cards e badges com múltiplas opções de estilo

## Paleta de Cores

As cores do sistema são definidas como variáveis CSS em `theme-palette.css`. A paleta segue um padrão semântico:

### Cores Base (Modo Claro)

```css
--light-bg-primary: 245 247 251;     /* #f5f7fb - Fundo principal */
--light-bg-secondary: 255 255 255;   /* #ffffff - Fundo secundário/cards */
--light-bg-tertiary: 241 245 249;    /* #f1f5f9 - Fundo terciário/inset */

--light-text-primary: 15 23 42;      /* #0f172a - Texto principal */
--light-text-secondary: 51 65 85;    /* #334155 - Texto secundário */
--light-text-muted: 100 116 139;     /* #64748b - Texto discreto */

--light-primary-main: 59 130 246;    /* #3b82f6 - Cor principal (azul) */
--light-success-main: 16 185 129;    /* #10b981 - Sucesso/Positivo */
--light-warning-main: 245 158 11;    /* #f59e0b - Alerta */
--light-error-main: 239 68 68;       /* #ef4444 - Erro/Perigo */
--light-accent-main: 168 85 247;     /* #a855f7 - Destaque */
```

### Cores Base (Modo Escuro)

```css
--dark-bg-primary: 10 16 21;         /* #0a1015 - Fundo principal */
--dark-bg-secondary: 26 33 39;       /* #1a2127 - Fundo secundário/cards */
--dark-bg-tertiary: 31 41 55;        /* #1f2937 - Fundo terciário/inset */

--dark-text-primary: 243 244 246;    /* #f3f4f6 - Texto principal */
--dark-text-secondary: 209 213 219;  /* #d1d5db - Texto secundário */
--dark-text-muted: 156 163 175;      /* #9ca3af - Texto discreto */

--dark-primary-main: 96 165 250;     /* #60a5fa - Cor principal (azul) */
--dark-success-main: 52 211 153;     /* #34d399 - Sucesso/Positivo */
--dark-warning-main: 251 191 36;     /* #fbbf24 - Alerta */
--dark-error-main: 248 113 113;      /* #f87171 - Erro/Perigo */
--dark-accent-main: 192 132 252;     /* #c084fc - Destaque */
```

### Variáveis de Mapeamento Tailwind

Estas variáveis são usadas pelo Tailwind e pelos componentes da aplicação:

```css
--background: var(--light-bg-primary);
--foreground: var(--light-text-primary);
--card: var(--light-bg-secondary);
--primary: var(--light-primary-main);
--secondary: var(--light-accent-main);
--muted: var(--light-bg-tertiary);
--accent: var(--light-accent-main);
--destructive: var(--light-error-main);
```

No modo escuro, esses valores são alterados para apontar para as variáveis do tema escuro:

```css
.dark {
  --background: var(--dark-bg-primary);
  --foreground: var(--dark-text-primary);
  --card: var(--dark-bg-secondary);
  /* etc. */
}
```

## Componentes Atualizados

Os seguintes componentes foram atualizados para utilizar o novo sistema de temas:

### Botões (`Button`)

Novos variantes:
- `success`, `info`, `warning`: Variantes semânticas
- `soft-*`: Versões com cores mais suaves
- `outline-*`: Versões com contorno

```jsx
// Exemplos de uso
<Button variant="default">Botão padrão</Button>
<Button variant="success">Sucesso</Button>
<Button variant="soft-primary">Primário suave</Button>
<Button variant="outline-warning">Alerta contorno</Button>
```

Novas propriedades:
- `size`: `sm`, `default`, `lg`, `xl`, `icon`, `icon-sm`, `icon-lg`
- `rounded`: `default`, `none`, `sm`, `lg`, `xl`, `full`
- `width`: `auto`, `full`

### Cards (`Card`)

Novos variantes:
- `default`, `elevated`, `flat`, `outline`: Estilos estruturais
- `primary`, `success`, `warning`, `destructive`, `info`: Estilos semânticos
- `dark-elevated-1`, `dark-elevated-2`: Níveis de elevação para modo escuro

```jsx
<Card>Conteúdo do card padrão</Card>
<Card variant="success">Card de sucesso</Card>
<Card variant="elevated">Card elevado</Card>
```

Novas propriedades:
- `size`: `default`, `sm`, `lg`, `xl`, `none`
- `rounded`: `default`, `sm`, `lg`, `full`, `none`
- `border`: `default`, `none`, `thick`

### Badges (`Badge`)

Novos variantes:
- `success`, `warning`, `error`, `info`: Variantes semânticas
- `soft-*`: Versões com cores mais suaves
- `outline-*`: Versões com contorno

```jsx
<Badge>Badge padrão</Badge>
<Badge variant="success">Sucesso</Badge>
<Badge variant="soft-error">Erro suave</Badge>
<Badge status="active">Status ativo</Badge>
```

Novas propriedades:
- `size`: `default`, `sm`, `lg`, `xl`
- `rounded`: `default`, `sm`, `lg`, `none`
- `pulse`: Animação de pulso para notificações
- `status`: `active`, `inactive`, `processing`, `completed`

## Uso do Hook `useTheme`

O hook `useTheme` foi aprimorado com novas funcionalidades:

```jsx
import { useTheme } from "@/hooks/use-theme";

function MyComponent() {
  const { 
    theme,                // "light" | "dark" | "system"
    resolvedTheme,        // "light" | "dark" (tema efetivamente aplicado)
    toggleTheme,          // Função para alternar tema
    setTheme,             // Função para definir tema específico
    isSystemTheme         // Se está usando tema do sistema
  } = useTheme();
  
  return (
    <div>
      <p>Tema atual: {theme}</p>
      <p>Tema aplicado: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Alternar tema</button>
      <button onClick={() => setTheme("light")}>Tema claro</button>
      <button onClick={() => setTheme("dark")}>Tema escuro</button>
      <button onClick={() => setTheme("system")}>Tema do sistema</button>
    </div>
  );
}
```

## Adicionando Tema ao Componente

Para criar um componente compatível com o sistema de temas:

1. Use variáveis CSS do tema em vez de cores diretas:

```jsx
// Bom - usa variáveis do tema
<div className="bg-background text-foreground">
  Conteúdo com tema
</div>

// Evitar - usa cores fixas
<div className="bg-white text-black dark:bg-gray-900 dark:text-white">
  Conteúdo sem tema
</div>
```

2. Adicione a classe `theme-transition` para transições suaves:

```jsx
<div className="theme-transition">
  Conteúdo com transição suave entre temas
</div>
```

3. Use variantes semânticas dos componentes:

```jsx
// Use variantes semânticas em vez de cores diretas
<Button variant="success">Sucesso</Button>

// Em vez de
<Button className="bg-green-500 hover:bg-green-600">Sucesso</Button>
```

## Boas Práticas

1. **Use classes utilitárias semânticas**:
   - `bg-background`, `text-foreground` em vez de `bg-white`, `text-black`
   - `text-primary`, `text-muted-foreground` para texto com significado

2. **Evite sobrescrever cores de tema**:
   - Não use cores fixas que possam conflitar com os temas

3. **Teste em ambos os temas**:
   - Verifique se seu componente fica bom tanto em modo claro quanto escuro

4. **Use as variantes de componente**:
   - Aproveite as variantes semânticas já definidas nos componentes

5. **Mantenha a consistência**:
   - Use as mesmas cores para as mesmas funções em toda a aplicação

## Página de Previsão

Uma página de previsão do tema foi criada para visualizar os componentes com o novo sistema de cores. Acesse em:

```
/theme-preview
```

Esta página permite:
- Ver todos os componentes com os estilos atualizados
- Alternar entre temas claro, escuro e sistema
- Verificar como ficam as diferentes variantes de componentes