
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { 
  Activity, Heart, Moon, Apple, Droplet, AlertCircle, 
  FileText, Brain, Pill, Calculator 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { MedicalExam } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export default function DashboardPage() {
  const { data: exams = [] } = useQuery<MedicalExam[]>({
    queryKey: ["/api/exams"],
  });
  
  // Filtrar exames que precisam de atenção (status não é "Normal")
  const alertExams = exams
    .filter(exam => exam.status === "Attention" || exam.status === "Critical" || exam.status === "High" || exam.status === "Low")
    .slice(0, 3); // Limitar a 3 exames
    
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-emerald-50 text-emerald-500 border-emerald-200";
      case "Attention":
      case "High":
        return "bg-amber-50 text-amber-500 border-amber-200";
      case "Critical":
      case "Low":
        return "bg-red-50 text-red-500 border-red-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };
  return (
    <MainLayout title="Olá, Usuário!">
      <p className="text-gray-600 dark:text-gray-400 mb-8">Aqui está seu resumo de saúde de hoje</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-2">Passos</p>
              <h2 className="text-4xl font-bold mb-2">7,842</h2>
              <p className="text-emerald-500 dark:text-emerald-400 flex items-center">
                <span className="mr-1">↑</span>
                12% em relação a ontem
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-2 rounded-full shadow-sm">
              <Activity className="text-emerald-500 dark:text-[#ff9f7d] h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-2">Calorias</p>
              <h2 className="text-4xl font-bold mb-2">1,450</h2>
              <p className="text-red-500 dark:text-red-400">
                <span className="mr-1">↓</span>
                320 kcal a consumir
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-2 rounded-full shadow-sm">
              <Apple className="text-emerald-500 dark:text-emerald-400 h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-2">Sono</p>
              <h2 className="text-4xl font-bold mb-2">7.5h</h2>
              <p className="text-emerald-500 dark:text-emerald-400 flex items-center">
                <span className="mr-1">↑</span>
                30min a mais que ontem
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-2 rounded-full shadow-sm">
              <Moon className="text-emerald-500 dark:text-emerald-400 h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-2">BPM Médio</p>
              <h2 className="text-4xl font-bold mb-2">72</h2>
              <p className="text-emerald-500 dark:text-emerald-400 flex items-center">
                <span className="mr-1">↓</span>
                Ritmo saudável
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-2 rounded-full shadow-sm">
              <Heart className="text-emerald-500 dark:text-emerald-400 h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 mb-8 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Atividades da Semana</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></div>
              <span className="text-xs text-slate-600 dark:text-gray-400">Passos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
              <span className="text-xs text-slate-600 dark:text-gray-400">Calorias</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-52">
          {/* Linhas de grade horizontais */}
          <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <div 
                key={i} 
                className="border-t border-gray-100 dark:border-gray-800 w-full h-0"
                style={{ top: `${i * 25}%` }}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 h-full relative z-10">
            {[
              { day: 'Dom', steps: 5240, cals: 1250, active: 25 },
              { day: 'Seg', steps: 7890, cals: 1540, active: 48 },
              { day: 'Ter', steps: 9450, cals: 1780, active: 62 },
              { day: 'Qua', steps: 10200, cals: 1820, active: 75 },
              { day: 'Qui', steps: 8750, cals: 1650, active: 53 },
              { day: 'Sex', steps: 12100, cals: 2100, active: 85 },
              { day: 'Sáb', steps: 6800, cals: 1420, active: 40 }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center h-full justify-end">
                <div className="w-full relative flex items-end justify-center h-[85%]">
                  {/* Barra de passos */}
                  <div 
                    className="w-full bg-emerald-500/80 dark:bg-emerald-500/70 rounded-t-md z-20 relative group cursor-pointer"
                    style={{ height: `${item.active}%` }}
                  >
                    {/* Tooltip ao passar o mouse */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-md p-2 text-xs min-w-[120px]">
                        <div className="font-semibold text-slate-800 dark:text-white mb-1">{item.day}</div>
                        <div className="flex justify-between text-slate-600 dark:text-gray-300">
                          <span>Passos:</span>
                          <span>{item.steps.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-gray-300">
                          <span>Calorias:</span>
                          <span>{item.cals}</span>
                        </div>
                      </div>
                      <div className="border-t-8 border-t-white dark:border-t-slate-800 border-l-8 border-l-transparent border-r-8 border-r-transparent h-0 w-0 absolute left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Linha de calorias */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10"
                    style={{ bottom: `${(item.cals / 2500) * 100}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mt-2">
                  <span className="text-sm text-slate-600 dark:text-gray-400">{item.day}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-500 mt-0.5">{item.steps.toLocaleString().substring(0, 2)}k</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Escala vertical */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between">
            {[10000, 7500, 5000, 2500, 0].map((value, i) => (
              <div key={i} className="text-xs text-slate-400 dark:text-gray-500 -translate-x-6">
                {value.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Hidratação</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-800">1200 ml</span>
              <span className="text-slate-600 dark:text-gray-400">Meta: 2500 ml</span>
            </div>
            <Progress value={48} className="h-2 bg-emerald-100 dark:bg-gray-700" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-emerald-200 dark:border-gray-700 text-slate-700 dark:text-gray-100">
                <Droplet className="h-4 w-4 mr-1 text-emerald-500 dark:text-blue-400" /> 150ml
              </Button>
              <Button variant="outline" size="sm" className="border-emerald-200 dark:border-gray-700 text-slate-700 dark:text-gray-100">
                <Droplet className="h-4 w-4 mr-1 text-emerald-500 dark:text-blue-400" /> 250ml
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Qualidade do Sono</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-gray-400">23:30</span>
              <span className="text-slate-600 dark:text-gray-400">07:00</span>
            </div>
            <h2 className="text-3xl font-bold">7.5h</h2>
            <p className="text-emerald-500 dark:text-emerald-400">Bom</p>
            <p className="text-slate-600 dark:text-gray-400">Total de sono</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Próximos Lembretes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Tomar Vitamina D</p>
                <p className="text-sm text-slate-600 dark:text-gray-400">1 cápsula com café da manhã</p>
              </div>
              <span className="text-emerald-500 dark:text-emerald-400">08:00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Exercícios</p>
                <p className="text-sm text-slate-600 dark:text-gray-400">30 minutos de caminhada</p>
              </div>
              <span className="text-emerald-500 dark:text-emerald-400">18:30</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Meditação Noturna</p>
                <p className="text-sm text-slate-600 dark:text-gray-400">Rotina de relaxamento</p>
              </div>
              <span className="text-emerald-500 dark:text-emerald-400">22:00</span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Alertas de Exames</h3>
            <Button variant="ghost" className="text-emerald-500 dark:text-emerald-400 p-1 h-auto text-sm">
              Ver todos
            </Button>
          </div>
          
          {alertExams.length > 0 ? (
            <div className="space-y-3">
              {alertExams.map((exam) => (
                <div key={exam.id} className={`flex justify-between items-center p-3 rounded-lg border shadow-sm dark:border-0 ${getStatusColor(exam.status)} dark:bg-[#2a3137]`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm`}>
                      <FileText className={`h-4 w-4 ${exam.status === "Critical" || exam.status === "Low" ? "text-red-500" : exam.status === "High" || exam.status === "Attention" ? "text-amber-500" : "text-emerald-500"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">{exam.name}</p>
                      <p className="text-sm text-slate-600 dark:text-gray-400">{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${exam.status === "Critical" || exam.status === "Low" ? "border-red-200 text-red-500" : exam.status === "High" || exam.status === "Attention" ? "border-amber-200 text-amber-500" : "border-emerald-200 text-emerald-500"}`}>
                    {exam.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="bg-emerald-50 dark:bg-[#2a3137] p-3 rounded-full mb-3">
                <AlertCircle className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-slate-700 dark:text-gray-300 mb-1">Sem alertas de exames</p>
              <p className="text-sm text-slate-500 dark:text-gray-400">Todos os seus exames estão normais</p>
            </div>
          )}
          
          {/* Dados mockados para demonstração - se não houver alertExams */}
          {alertExams.length === 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-[#2a3137] rounded-lg border border-amber-200 dark:border-0 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm">
                    <FileText className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">Hemograma</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">15 de março, 2023</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-amber-200 text-amber-500">
                  Attention
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-[#2a3137] rounded-lg border border-red-200 dark:border-0 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm">
                    <FileText className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">Glicemia</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">02 de abril, 2023</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-red-200 text-red-500">
                  Critical
                </Badge>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Atalhos para Módulos */}
      <h3 className="text-xl font-semibold mb-4">Acesso Rápido</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link href="/activity">
          <Card className="p-5 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-3 rounded-full bg-rose-500/10 dark:bg-rose-500/20">
                <Activity className="h-8 w-8 text-rose-500 dark:text-rose-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Atividades</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Rastreie seus exercícios</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/nutrition">
          <Card className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <Apple className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Nutrição</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Registre refeições</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/sleep">
          <Card className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-3 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                <Moon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Sono</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Analise seu descanso</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/mental">
          <Card className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-3 rounded-full bg-purple-500/10 dark:bg-purple-500/20">
                <Brain className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Mental</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Meditação e bem-estar</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/hydration">
          <Card className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-3 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                <Droplet className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Hidratação</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Controle de água</p>
            </div>
          </Card>
        </Link>
        
        <Link href="/medication">
          <Card className="p-5 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 mb-3 rounded-full bg-pink-500/10 dark:bg-pink-500/20">
                <Pill className="h-8 w-8 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Medicação</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">Gerenciamento de remédios</p>
            </div>
          </Card>
        </Link>
      </div>
    </MainLayout>
  );
}
