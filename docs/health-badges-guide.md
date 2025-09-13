# Sistema de Badges de Métricas de Saúde - HealthTrackPlus

Este documento descreve o sistema de badges específicos para métricas de saúde implementado no HealthTrackPlus, incluindo a estrutura dos componentes, exemplos de uso e melhores práticas.

## Índice

1. [Visão Geral](#visão-geral)
2. [Componentes Disponíveis](#componentes-disponíveis)
3. [Propriedades](#propriedades)
4. [Estilos e Variantes](#estilos-e-variantes)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Boas Práticas](#boas-práticas)
7. [Integração com o Sistema de Temas](#integração-com-o-sistema-de-temas)

## Visão Geral

O sistema de badges de métricas de saúde foi desenvolvido para exibir informações de saúde de forma intuitiva e visualmente clara. As principais características incluem:

- **Cores semânticas**: Cores que indicam o estado da métrica (normal, elevado, crítico, etc.)
- **Indicadores de tendência**: Setas para cima/baixo ou ícone estável para mostrar a direção da métrica
- **Detecção automática de estado**: Determinação automática da variante de cor com base em intervalos normais
- **Formatação de valores**: Opções para formatação personalizada de valores numéricos
- **Suporte a unidades de medida**: Exibição de unidades de medida junto aos valores

## Componentes Disponíveis

O sistema inclui três componentes principais:

1. **HealthBadge**: O badge básico para exibir uma métrica de saúde
2. **HealthBadgeWithLabel**: Badge com um rótulo descritivo à esquerda
3. **HealthMetricGroup**: Container para agrupar múltiplos badges relacionados

## Propriedades

### HealthBadge

```tsx
<HealthBadge
  value={120}              // Valor numérico da métrica
  unit="mg/dL"             // Unidade de medida (opcional)
  variant="elevated"       // Variante visual (opcional)
  trend="up"               // Tendência: "up", "down", "stable" (opcional)
  trendStyle="emphasized"  // Estilo da tendência: "default", "emphasized", "subtle" (opcional)
  normalRange={{ min: 70, max: 130 }} // Intervalo normal para determinar variante (opcional)
  customRanges={{          // Intervalos personalizados (opcional)
    low: 60,               // Valor abaixo do qual é considerado baixo
    high: 140,             // Valor acima do qual é considerado alto
    critical: 180          // Valor acima do qual é considerado crítico
  }}
  valueVisible={true}      // Se o valor deve ser exibido (opcional, padrão: true)
  valueFormatter={(v) => v.toFixed(1)} // Função para formatar o valor (opcional)
  size="default"           // Tamanho: "sm", "default", "lg", "xl" (opcional)
  className="my-custom-class" // Classes CSS adicionais (opcional)
/>
```

### HealthBadgeWithLabel

```tsx
<HealthBadgeWithLabel
  label="Glicemia"         // Rótulo descritivo da métrica
  value={120}              // Valor numérico da métrica
  // ... todas as outras propriedades de HealthBadge são suportadas
/>
```

### HealthMetricGroup

```tsx
<HealthMetricGroup 
  title="Sinais Vitais"    // Título opcional para o grupo
  className="mt-4"         // Classes CSS adicionais (opcional)
>
  {/* Badges de saúde relacionados */}
  <HealthBadge ... />
  <HealthBadgeWithLabel ... />
</HealthMetricGroup>
```

## Estilos e Variantes

O componente `HealthBadge` suporta as seguintes variantes semânticas:

- **default**: Estilo padrão (azul)
- **normal**: Verde, indica valores dentro do intervalo normal
- **elevated**: Âmbar, indica valores ligeiramente fora do intervalo normal
- **high**: Vermelho, indica valores elevados
- **low**: Azul, indica valores baixos
- **critical**: Vermelho enfatizado, indica valores críticos

As variantes podem ser definidas manualmente ou determinadas automaticamente com base nos intervalos normais e personalizados fornecidos.

## Exemplos de Uso

### Badge Básico

```tsx
<HealthBadge value={120} unit="mg/dL" />
```

### Badge com Tendência

```tsx
<HealthBadge 
  value={120} 
  unit="mg/dL" 
  trend="up" 
  trendStyle="emphasized" 
/>
```

### Badge com Detecção Automática de Estado

```tsx
<HealthBadge 
  value={180} 
  unit="mg/dL" 
  normalRange={{ min: 70, max: 130 }} 
/>
```

### Badge com Rótulo

```tsx
<HealthBadgeWithLabel 
  label="Glicemia" 
  value={120} 
  unit="mg/dL" 
  trend="up" 
/>
```

### Grupo de Métricas

```tsx
<HealthMetricGroup title="Sinais Vitais">
  <HealthBadgeWithLabel 
    label="Freq. Cardíaca" 
    value={72} 
    unit="bpm" 
    normalRange={{ min: 60, max: 100 }} 
    trend="stable" 
  />
  <HealthBadgeWithLabel 
    label="Pressão Sist." 
    value={135} 
    unit="mmHg" 
    normalRange={{ min: 90, max: 120 }} 
    trend="up" 
  />
  <HealthBadgeWithLabel 
    label="SpO2" 
    value={98} 
    unit="%" 
    normalRange={{ min: 95, max: 100 }} 
    trend="stable" 
  />
</HealthMetricGroup>
```

### Componente de Card de Métricas

Para casos mais complexos, um componente `HealthMetricsCard` está disponível, que usa internamente os badges de métricas:

```tsx
<HealthMetricsCard 
  metrics={{
    vitals: {
      heartRate: 72,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      // ...outras métricas
    },
    // ...outros grupos de métricas
  }}
/>
```

## Boas Práticas

1. **Use variantes semânticas corretamente**:
   - Siga convenções médicas para os intervalos normais
   - Não use cores críticas para métricas de baixa importância

2. **Indicadores de tendência**:
   - Use para mostrar mudanças relevantes em relação a medições anteriores
   - Considere omitir para métricas muito estáveis ou sem histórico

3. **Agrupamento lógico**:
   - Agrupe métricas relacionadas usando `HealthMetricGroup`
   - Mantenha grupos compactos (3-5 métricas por grupo)

4. **Formatação de valores**:
   - Use `valueFormatter` para formatar valores decimais consistentemente
   - Sempre inclua unidades de medida quando relevante

5. **Acessibilidade**:
   - Certifique-se que o contraste de cores é suficiente
   - Não dependa apenas da cor para transmitir informação importante

## Integração com o Sistema de Temas

Os badges de métricas de saúde são totalmente compatíveis com o sistema de temas light/dark do HealthTrackPlus. As cores são automaticamente ajustadas com base no tema atual.

Para garantir a consistência visual:

1. Os badges usam a classe `theme-transition` para transições suaves
2. As cores são definidas usando o sistema de variáveis CSS do tema
3. O contraste é otimizado para ambos os modos claro e escuro

Você pode visualizar todos os badges de métricas de saúde na página de previsão do tema:

```
/theme-preview
```

Esta página mostra todas as variantes e opções disponíveis para os badges de métricas de saúde em ambos os temas claro e escuro.