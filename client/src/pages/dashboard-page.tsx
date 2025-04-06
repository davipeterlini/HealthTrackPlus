
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { Activity, Heart, Moon, Apple, Droplet, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { MedicalExam } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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
        <h3 className="text-xl font-semibold mb-4">Atividades da Semana</h3>
        <div className="grid grid-cols-7 gap-2 h-40">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex-grow w-full bg-emerald-500/20 dark:bg-emerald-500/20 rounded-md" style={{height: `${Math.random() * 100}%`}} />
              <span className="text-sm text-slate-600 dark:text-gray-400 mt-2">{day}</span>
            </div>
          ))}
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
    </MainLayout>
  );
}
