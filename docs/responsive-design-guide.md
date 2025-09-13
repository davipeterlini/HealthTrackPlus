# Guia de Design Responsivo - HealthTrackPlus

Este guia fornece instruções práticas para implementar e trabalhar com o sistema de design responsivo do HealthTrackPlus. Aqui você encontrará exemplos de código, padrões recomendados e explicações para cada componente e ferramenta disponível.

## Sumário

1. [Breakpoints](#breakpoints)
2. [Componentes Responsivos](#componentes-responsivos)
3. [Hooks e Utilitários](#hooks-e-utilitários)
4. [Otimizações para Dispositivos Móveis](#otimizações-para-dispositivos-móveis)
5. [Testes e Depuração](#testes-e-depuração)
6. [Melhores Práticas](#melhores-práticas)

## Breakpoints

O sistema usa os seguintes breakpoints definidos em `tailwind.config.ts` e `device-context.tsx`:

```
xxs: 360px - Dispositivos móveis pequenos
xs: 480px - Dispositivos móveis padrão
sm: 640px - Dispositivos móveis grandes
md: 768px - Tablets pequenos
lg: 1024px - Tablets grandes e desktops pequenos
xl: 1280px - Desktops médios
2xl: 1536px - Desktops grandes
```

### Como usar os breakpoints:

**CSS (Tailwind):**

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Texto que muda de tamanho em diferentes breakpoints
</div>
```

**Com o hook `useResponsive`:**

```tsx
import { useResponsive } from '@/hooks/use-responsive';

function ResponsiveComponent() {
  const { matches } = useResponsive();
  
  const showFeature = matches('lg', '>=');
  
  return (
    <div>
      {showFeature && <AdvancedFeature />}
    </div>
  );
}
```

## Componentes Responsivos

O sistema fornece componentes responsivos que automaticamente se adaptam a diferentes tamanhos de tela.

### ResponsiveContainer

```tsx
import { ResponsiveContainer } from '@/components/ui/responsive-container';

<ResponsiveContainer width="content" padding="md">
  Conteúdo com largura e preenchimento responsivos
</ResponsiveContainer>
```

Opções:
- `width`: 'full' | 'content' | 'narrow' | 'wide'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### ResponsiveGrid

```tsx
import { ResponsiveGrid } from '@/components/ui/responsive-container';

<ResponsiveGrid columns={2} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</ResponsiveGrid>
```

Opções:
- `columns`: 1 | 2 | 3 | 4
- `gap`: 'sm' | 'md' | 'lg'

### ResponsiveCard

```tsx
import { ResponsiveCard } from '@/components/ui/responsive-container';

<ResponsiveCard size="md" elevation="low">
  Conteúdo do card
</ResponsiveCard>
```

Opções:
- `size`: 'sm' | 'md' | 'lg'
- `elevation`: 'flat' | 'low' | 'medium' | 'high'

### ResponsiveText

```tsx
import { ResponsiveText } from '@/components/ui/responsive-container';

<ResponsiveText variant="title-lg">
  Título com tamanho responsivo
</ResponsiveText>
```

Opções:
- `variant`: 'title-lg' | 'title-md' | 'title-sm' | 'text-lg' | 'text-md' | 'text-sm'
- `as`: Elemento HTML (p, h1, span, etc.)

### OptimizedImage

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage 
  src="/images/example.jpg"
  alt="Descrição da imagem"
  aspectRatio="16:9"
  objectFit="cover"
/>
```

Opções:
- `aspectRatio`: '1:1' | '4:3' | '16:9' | '21:9' | 'auto'
- `objectFit`: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
- `priority`: boolean (carrega imagem com prioridade)

### AdaptiveLayout

```tsx
import { AdaptiveLayout } from '@/components/layout/adaptive-layout';

<AdaptiveLayout 
  title="Dashboard"
  sidebar={<SidebarContent />}
  sidebarPosition="right"
>
  Conteúdo principal
</AdaptiveLayout>
```

Opções:
- `title`: string (título da página)
- `hideTitle`: boolean
- `fullWidth`: boolean (expandir para largura total)
- `sidebar`: ReactNode (conteúdo da barra lateral)
- `sidebarPosition`: 'left' | 'right'

## Hooks e Utilitários

### useResponsive

Este hook fornece informações sobre o dispositivo atual e funções úteis para layouts responsivos.

```tsx
import { useResponsive } from '@/hooks/use-responsive';

function MyComponent() {
  const { 
    isMobile, 
    isTablet, 
    isDesktop,
    deviceType,
    isPortrait,
    isLandscape,
    matches,
    getFontSize,
    getIconSize,
    getGrid,
    getContainer,
    getSpacingClass
  } = useResponsive();
  
  // Verificar breakpoint específico
  const showFeature = matches('lg', '>=');
  
  // Obter classe de fonte responsiva
  const titleClass = getFontSize('title-lg');
  
  return (
    <div className={titleClass}>
      {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
    </div>
  );
}
```

### useScreenAdaptation

Hook avançado que estende `useResponsive` com funcionalidades adicionais.

```tsx
import { useScreenAdaptation } from '@/hooks/use-screen-adaptation';

function MyComponent() {
  const {
    isCompactView,
    isAboveFold,
    contentHeight,
    calcResponsiveSize,
    shouldRender,
    getAdaptiveStyle,
    getItemsToShow
  } = useScreenAdaptation();
  
  // Calcular tamanho responsivo (em px)
  const iconSize = calcResponsiveSize(24);
  
  // Verificar se deve renderizar com base no breakpoint
  const showAdvancedUI = shouldRender('md');
  
  // Limitar número de itens com base no dispositivo
  const itemsToShow = getItemsToShow(totalItems, 2);
  
  return (
    <div style={{ height: contentHeight }}>
      {showAdvancedUI && <AdvancedUI />}
    </div>
  );
}
```

### useGestureSupport

Hook para detectar gestos de toque e interações adaptativas.

```tsx
import { useGestureSupport } from '@/hooks/use-gesture-support';
import { useRef } from 'react';

function TouchComponent() {
  const elementRef = useRef(null);
  const {
    currentGesture,
    registerGestureHandler,
    touchSafeSize
  } = useGestureSupport(elementRef);
  
  useEffect(() => {
    // Registrar handler de gestos
    const unregister = registerGestureHandler((e) => {
      if (e.type === 'swipeleft') {
        console.log('Swipe esquerdo detectado!');
      }
    });
    
    return () => unregister();
  }, [registerGestureHandler]);
  
  return (
    <div 
      ref={elementRef} 
      className="touch-area"
      style={{ minHeight: touchSafeSize }}
    >
      Área com suporte a gestos
    </div>
  );
}
```

## Otimizações para Dispositivos Móveis

### useImageOptimization

Hook para otimizar imagens com base no dispositivo.

```tsx
import { useImageOptimization } from '@/utils/mobile-optimizations';

function MyImage({ src, alt }) {
  const { getImageAttributes } = useImageOptimization({
    quality: 80,
    lazyLoad: true
  });
  
  const imageAttrs = getImageAttributes(src);
  
  return <img {...imageAttrs} alt={alt} />;
}
```

### useMobileOptimizations

Hook para otimizações gerais em dispositivos móveis.

```tsx
import { useMobileOptimizations } from '@/utils/mobile-optimizations';

function OptimizedComponent() {
  const {
    networkCondition,
    shouldReduceAnimations,
    shouldPrefetch,
    getScriptOptimization
  } = useMobileOptimizations();
  
  // Desabilitar animações em conexões lentas
  const animationClass = shouldReduceAnimations 
    ? 'no-animation' 
    : 'animate-fade';
  
  // Carregar recursos adicionais com base na conexão
  const loadHighResImages = networkCondition !== 'slow';
  
  return (
    <div className={animationClass}>
      {loadHighResImages ? <HighResImage /> : <LowResImage />}
    </div>
  );
}
```

### DynamicImport

Componente para importação dinâmica de outros componentes.

```tsx
import { DynamicImport } from '@/components/ui/dynamic-import';

function LazyLoadedSection() {
  return (
    <DynamicImport
      importFunc={() => import('@/components/heavy-component')}
      options={{
        priority: 'low',
        fallback: <LoadingPlaceholder />
      }}
    />
  );
}
```

## Testes e Depuração

### ResponsiveTester

Componente para testar layouts responsivos durante o desenvolvimento.

```tsx
import { ResponsiveTester } from '@/components/dev/responsive-tester';

function DevMode() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <ResponsiveTester />}
    </>
  );
}
```

## Melhores Práticas

### 1. Abordagem Mobile-First

Sempre comece o desenvolvimento para telas menores e depois adicione comportamentos para telas maiores.

```tsx
// Bom - Mobile-first
<div className="text-sm md:text-base lg:text-lg">
  Conteúdo
</div>

// Evitar - Desktop-first
<div className="text-lg md:text-base sm:text-sm">
  Conteúdo
</div>
```

### 2. Divisão de Componentes por Complexidade

Para componentes complexos, considere criar versões específicas para cada tipo de dispositivo:

```tsx
import { useResponsive } from '@/hooks/use-responsive';

function ComplexComponent() {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return <MobileVersion />;
  }
  
  return <DesktopVersion />;
}
```

### 3. Carregamento Otimizado de Recursos

Carregue recursos pesados apenas quando necessário:

```tsx
import { useMobileOptimizations } from '@/utils/mobile-optimizations';

function OptimizedImages({ images }) {
  const { networkCondition } = useMobileOptimizations();
  
  // Determinar qualidade com base na conexão
  const quality = networkCondition === 'slow' ? 50 : 
                  networkCondition === 'medium' ? 75 : 90;
  
  return (
    <div>
      {images.map(image => (
        <OptimizedImage 
          key={image.id}
          src={image.src}
          alt={image.alt}
          quality={quality}
        />
      ))}
    </div>
  );
}
```

### 4. Testes em Múltiplos Dispositivos

Teste regularmente em diferentes dispositivos reais e utilize o `ResponsiveTester` para simular vários tamanhos de tela durante o desenvolvimento.

### 5. Evitar Layouts com Largura Fixa

Evite usar valores fixos em pixels para larguras de contêiner. Prefira:

```tsx
// Bom - Responsivo
<ResponsiveContainer width="content">
  Conteúdo
</ResponsiveContainer>

// Evitar - Largura fixa
<div style={{ width: '500px' }}>
  Conteúdo
</div>
```

### 6. Textos Responsivos

Use o sistema de tipografia responsiva para garantir legibilidade em todos os dispositivos:

```tsx
<ResponsiveText variant="title-md">
  Título que se adapta a diferentes tamanhos de tela
</ResponsiveText>
```

### 7. Uso Consistente de Espaçamento

Mantenha espaçamento consistente usando as funções do `useResponsive`:

```tsx
const { getSpacingClass } = useResponsive();
const marginClass = getSpacingClass('m', 'y', 'md');

<div className={marginClass}>
  Conteúdo com margem vertical responsiva
</div>
```

---

Este guia serve como referência para o sistema de design responsivo do HealthTrackPlus. Para mais informações, consulte os arquivos de código fonte e documentação adicional.