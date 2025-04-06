
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { Activity, Heart, Moon, Apple, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
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
    </MainLayout>
  );
}
