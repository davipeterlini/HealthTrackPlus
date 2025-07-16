import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Apple, 
  Dumbbell, 
  Shield, 
  Baby,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface PregnancyTipsProps {
  currentWeek: number;
}

export function PregnancyTips({ currentWeek }: PregnancyTipsProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para dicas - será substituído por dados reais da API
  const tipsData = [
    {
      id: 1,
      week: 1,
      category: 'nutrition',
      title: 'Comece a tomar ácido fólico',
      description: 'O ácido fólico é essencial para prevenir defeitos do tubo neural. Comece a tomar 400mcg diariamente.',
      importance: 'high',
      iconName: 'pill',
      completed: false
    },
    {
      id: 2,
      week: 4,
      category: 'health',
      title: 'Evite álcool e cigarro',
      description: 'O consumo de álcool e tabaco pode causar sérios problemas ao desenvolvimento do bebê.',
      importance: 'high',
      iconName: 'shield',
      completed: true
    },
    {
      id: 3,
      week: 8,
      category: 'nutrition',
      title: 'Mantenha uma dieta balanceada',
      description: 'Inclua frutas, vegetais, proteínas magras e grãos integrais em sua alimentação diária.',
      importance: 'high',
      iconName: 'apple',
      completed: false
    },
    {
      id: 4,
      week: 12,
      category: 'exercise',
      title: 'Inicie exercícios leves',
      description: 'Caminhadas, yoga e natação são excelentes opções para manter-se ativa durante a gravidez.',
      importance: 'medium',
      iconName: 'dumbbell',
      completed: false
    },
    {
      id: 5,
      week: 16,
      category: 'health',
      title: 'Durma de lado',
      description: 'Dormir do lado esquerdo melhora a circulação e reduz a pressão sobre órgãos vitais.',
      importance: 'medium',
      iconName: 'heart',
      completed: false
    },
    {
      id: 6,
      week: 20,
      category: 'preparation',
      title: 'Comece a preparar o quarto do bebê',
      description: 'É um bom momento para começar a planejar e preparar o ambiente para o seu bebê.',
      importance: 'low',
      iconName: 'baby',
      completed: false
    },
    {
      id: 7,
      week: 24,
      category: 'health',
      title: 'Monitore os movimentos do bebê',
      description: 'Comece a observar os padrões de movimento do seu bebê. Conte os movimentos regularmente.',
      importance: 'high',
      iconName: 'activity',
      completed: false
    },
    {
      id: 8,
      week: 28,
      category: 'preparation',
      title: 'Faça curso de preparação para o parto',
      description: 'Conhecimento sobre o parto e cuidados com o bebê ajudará você a se sentir mais preparada.',
      importance: 'medium',
      iconName: 'book',
      completed: false
    },
    {
      id: 9,
      week: 32,
      category: 'preparation',
      title: 'Prepare a mala da maternidade',
      description: 'Tenha tudo pronto para quando chegue o momento do parto.',
      importance: 'high',
      iconName: 'bag',
      completed: false
    },
    {
      id: 10,
      week: 36,
      category: 'health',
      title: 'Descanse bastante',
      description: 'Nas últimas semanas, priorize o descanso e prepare-se para a chegada do bebê.',
      importance: 'medium',
      iconName: 'clock',
      completed: false
    }
  ];

  const categories = [
    { id: 'all', label: 'Todas', icon: Star },
    { id: 'nutrition', label: t('pregnancy.tips.nutrition'), icon: Apple },
    { id: 'exercise', label: t('pregnancy.tips.exercise'), icon: Dumbbell },
    { id: 'health', label: t('pregnancy.tips.health'), icon: Heart },
    { id: 'preparation', label: t('pregnancy.tips.preparation'), icon: Baby }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high': return t('pregnancy.tips.importance.high');
      case 'medium': return t('pregnancy.tips.importance.medium');
      case 'low': return t('pregnancy.tips.importance.low');
      default: return importance;
    }
  };

  const filteredTips = tipsData.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentWeekTips = filteredTips.filter(tip => tip.week <= currentWeek);
  const upcomingTips = filteredTips.filter(tip => tip.week > currentWeek);

  const toggleTipCompletion = (tipId: number) => {
    // Aqui seria chamada a API para atualizar o status da dica
    console.log(`Toggle tip ${tipId} completion`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{t('pregnancy.tips.title')}</h2>
        <p className="text-muted-foreground">
          Dicas essenciais para uma gravidez saudável e segura
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar dicas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Current Week Tips */}
      {currentWeekTips.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Dicas Relevantes (até semana {currentWeek})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWeekTips.map((tip) => (
              <Card key={tip.id} className={`transition-all duration-200 ${tip.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {tip.week}ª semana
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getImportanceColor(tip.importance)}`}
                        >
                          {getImportanceLabel(tip.importance)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTipCompletion(tip.id)}
                      className={`p-1 ${tip.completed ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      <CheckCircle className={`h-5 w-5 ${tip.completed ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tips */}
      {upcomingTips.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Dicas Futuras (após semana {currentWeek})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTips.map((tip) => (
              <Card key={tip.id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {tip.week}ª semana
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getImportanceColor(tip.importance)}`}
                    >
                      {getImportanceLabel(tip.importance)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredTips.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma dica encontrada para os filtros selecionados.
          </p>
        </div>
      )}

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Progresso das Dicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {currentWeekTips.filter(tip => tip.completed).length}
              </p>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {currentWeekTips.filter(tip => !tip.completed).length}
              </p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {upcomingTips.length}
              </p>
              <p className="text-sm text-muted-foreground">Futuras</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {filteredTips.length}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}