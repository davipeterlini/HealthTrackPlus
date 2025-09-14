import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { 
  Baby, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Activity,
  Brain,
  Eye
} from 'lucide-react';

interface PregnancyEvolutionProps {
  currentWeek: number;
  currentDay: number;
}

export const PregnancyEvolution = React.memo(({ currentWeek, currentDay }: PregnancyEvolutionProps) => {
  const { t } = useTranslation();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [selectedDay, setSelectedDay] = useState(currentDay);

  // Mock data para evolução gestacional - será substituído por dados reais
  const evolutionData = {
    1: {
      1: {
        babySize: 'Tamanho de uma semente de papoula',
        babyWeight: '< 1g',
        babyDescription: 'O óvulo foi fertilizado e está se dividindo rapidamente.',
        maternalChanges: 'Você pode não saber que está grávida ainda.',
        tips: ['Comece a tomar ácido fólico', 'Evite álcool e cigarro'],
        imageUrl: '/pregnancy-images/week1.svg',
        developmentMilestones: ['Fertilização', 'Implantação inicial']
      },
      7: {
        babySize: 'Tamanho de uma semente de papoula',
        babyWeight: '< 1g',
        babyDescription: 'O embrião está se implantando na parede uterina.',
        maternalChanges: 'Possível sangramento de implantação.',
        tips: ['Faça um teste de gravidez', 'Continue com ácido fólico'],
        imageUrl: '/pregnancy-images/week1.svg',
        developmentMilestones: ['Implantação completa', 'Formação do saco gestacional']
      }
    },
    8: {
      1: {
        babySize: 'Tamanho de uma semente de gergelim',
        babyWeight: '1g',
        babyDescription: 'O sistema nervoso central está se formando.',
        maternalChanges: 'Primeiros sintomas de gravidez podem aparecer.',
        tips: ['Agende consulta médica', 'Mantenha alimentação saudável'],
        imageUrl: '/pregnancy-images/week8.svg',
        developmentMilestones: ['Tubo neural se forma', 'Coração começa a bater']
      }
    },
    12: {
      1: {
        babySize: 'Tamanho de uma ameixa',
        babyWeight: '14g',
        babyDescription: 'Órgãos principais estão se formando.',
        maternalChanges: 'Náuseas matinais podem estar no auge.',
        tips: ['Primeiro ultrassom', 'Evite exercícios intensos'],
        imageUrl: '/pregnancy-images/week12.svg',
        developmentMilestones: ['Formação dos dedos', 'Desenvolvimento do cérebro']
      }
    },
    16: {
      1: {
        babySize: 'Tamanho de um abacate',
        babyWeight: '100g',
        babyDescription: 'O bebê pode fazer expressões faciais.',
        maternalChanges: 'Energia pode estar voltando.',
        tips: ['Exames de sangue', 'Aumente ingestão de cálcio'],
        imageUrl: '/pregnancy-images/week16.svg',
        developmentMilestones: ['Músculos se fortalecem', 'Sistema digestivo funciona']
      }
    },
    20: {
      1: {
        babySize: 'Tamanho de uma banana',
        babyWeight: '300g',
        babyDescription: 'O bebê está crescendo rapidamente.',
        maternalChanges: 'Barriga está mais evidente.',
        tips: ['Ultrassom morfológico', 'Comece exercícios leves'],
        imageUrl: '/pregnancy-images/week20.svg',
        developmentMilestones: ['Cabelo e unhas crescem', 'Audição se desenvolve']
      }
    },
    24: {
      1: {
        babySize: 'Tamanho de uma espiga de milho',
        babyWeight: '600g',
        babyDescription: 'O bebê está desenvolvendo os pulmões.',
        maternalChanges: 'Movimentos do bebê ficam mais fortes.',
        tips: ['Teste de diabetes gestacional', 'Durma de lado'],
        imageUrl: '/pregnancy-images/week24.svg',
        developmentMilestones: ['Pulmões se desenvolvem', 'Reflexos se aprimoram']
      },
      3: {
        babySize: 'Tamanho de uma espiga de milho',
        babyWeight: '650g',
        babyDescription: 'Os olhos do bebê estão se abrindo.',
        maternalChanges: 'Pode sentir contrações de Braxton Hicks.',
        tips: ['Monitore movimentos fetais', 'Hidrate-se bem'],
        imageUrl: '/pregnancy-images/week24.svg',
        developmentMilestones: ['Olhos se abrem', 'Ciclos de sono se estabelecem']
      }
    },
    28: {
      1: {
        babySize: 'Tamanho de uma berinjela',
        babyWeight: '1kg',
        babyDescription: 'O bebê está ganhando peso rapidamente.',
        maternalChanges: 'Pode começar a sentir falta de ar.',
        tips: ['Inicie contagem de movimentos', 'Prepare o quarto do bebê'],
        imageUrl: '/pregnancy-images/week28.svg',
        developmentMilestones: ['Gordura corporal aumenta', 'Cérebro se desenvolve']
      }
    },
    32: {
      1: {
        babySize: 'Tamanho de um coco',
        babyWeight: '1.7kg',
        babyDescription: 'O bebê está praticando respiração.',
        maternalChanges: 'Barriga está bem grande.',
        tips: ['Prepare plano de parto', 'Faça curso de preparação'],
        imageUrl: '/pregnancy-images/week32.svg',
        developmentMilestones: ['Ossos se fortalecem', 'Unhas crescem']
      }
    },
    36: {
      1: {
        babySize: 'Tamanho de uma couve-flor',
        babyWeight: '2.6kg',
        babyDescription: 'O bebê está quase pronto para nascer.',
        maternalChanges: 'Pode sentir pressão pélvica.',
        tips: ['Prepare mala da maternidade', 'Descanse bastante'],
        imageUrl: '/pregnancy-images/week36.svg',
        developmentMilestones: ['Pulmões maduros', 'Posição para o parto']
      }
    },
    40: {
      1: {
        babySize: 'Tamanho de uma melancia pequena',
        babyWeight: '3.4kg',
        babyDescription: 'O bebê está pronto para nascer!',
        maternalChanges: 'Sinais de trabalho de parto podem começar.',
        tips: ['Fique alerta aos sinais', 'Vá ao hospital quando necessário'],
        imageUrl: '/pregnancy-images/week40.svg',
        developmentMilestones: ['Desenvolvimento completo', 'Pronto para nascer']
      }
    }
  };

  const getCurrentData = () => {
    const weekData = evolutionData[selectedWeek as keyof typeof evolutionData];
    if (!weekData) return null;
    
    const dayData = weekData[selectedDay as keyof typeof weekData];
    if (!dayData) {
      // Se não há dados para o dia específico, pegar o primeiro dia da semana
      const firstDay = Object.keys(weekData)[0];
      return weekData[firstDay as keyof typeof weekData];
    }
    
    return dayData;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
      setSelectedDay(1);
    } else if (direction === 'next' && selectedWeek < 40) {
      setSelectedWeek(selectedWeek + 1);
      setSelectedDay(1);
    }
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    } else if (direction === 'next' && selectedDay < 7) {
      setSelectedDay(selectedDay + 1);
    }
  };

  const data = getCurrentData();

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Dados de evolução não disponíveis para a semana {selectedWeek}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('pregnancy.evolution.title')}</h2>
        <p className="text-muted-foreground">{t('pregnancy.evolution.description')}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigateWeek('prev')}
          disabled={selectedWeek <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Semana Anterior
        </Button>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {selectedWeek}ª {t('pregnancy.weeks')}
            </Badge>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDay('prev')}
                disabled={selectedDay <= 1}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium">
                {selectedDay}º dia
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateDay('next')}
                disabled={selectedDay >= 7}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => navigateWeek('next')}
          disabled={selectedWeek >= 40}
        >
          Próxima Semana
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Current Week Indicator */}
      {selectedWeek === currentWeek && selectedDay === currentDay && (
        <div className="text-center">
          <Badge variant="default" className="bg-green-500">
            Você está aqui
          </Badge>
        </div>
      )}

      {/* Evolution Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baby Evolution Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              {t('pregnancy.baby_evolution')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-8 mb-4">
                {data.imageUrl ? (
                  <OptimizedImage
                    src={data.imageUrl}
                    alt={`Baby development at week ${selectedWeek}`}
                    width={160}
                    height={160}
                    className="w-32 h-32 mx-auto rounded-full"
                    loading="lazy"
                    objectFit="cover"
                    fallbackSrc="/assets/images/pregnancy-placeholder.svg"
                    placeholderColor="#f9d4fa"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center">
                    <Baby className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{data.babySize}</p>
                <p className="text-primary font-medium">{data.babyWeight}</p>
                <p className="text-sm text-muted-foreground">{data.babyDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {t('pregnancy.evolution.development_milestones')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.developmentMilestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maternal Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              {t('pregnancy.maternal_changes')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{data.maternalChanges}</p>
          </CardContent>
        </Card>

        {/* Weekly Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Dicas da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Navegação Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((week) => (
              <Button
                key={week}
                variant={selectedWeek === week ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedWeek(week);
                  setSelectedDay(1);
                }}
                className="text-xs"
              >
                {week}ª
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PregnancyEvolution.displayName = "PregnancyEvolution";