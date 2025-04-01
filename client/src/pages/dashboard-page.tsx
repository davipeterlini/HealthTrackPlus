import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { Activity, Heart, Moon, Apple } from "lucide-react";

export default function DashboardPage() {
  return (
    <MainLayout title="Olá, Usuário!">
      <p className="text-gray-400 mb-8">Aqui está seu resumo de saúde de hoje</p>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-[#1a2127] border-0 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-2">Passos</p>
              <h2 className="text-4xl font-bold mb-2">7,842</h2>
              <p className="text-emerald-400 flex items-center">
                <span className="mr-1">↑</span>
                12% em relação a ontem
              </p>
            </div>
            <div className="bg-[#2a3137] p-2 rounded-full">
              <Activity className="text-[#ff9f7d] h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a2127] border-0 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-2">Calorias</p>
              <h2 className="text-4xl font-bold mb-2">1,450</h2>
              <p className="text-red-400">
                <span className="mr-1">↓</span>
                320 kcal a consumir
              </p>
            </div>
            <div className="bg-[#2a3137] p-2 rounded-full">
              <Apple className="text-emerald-400 h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a2127] border-0 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-2">Sono</p>
              <h2 className="text-4xl font-bold mb-2">7h 30m</h2>
              <p className="text-gray-400">
                <span className="mr-1">→</span>
                30m a menos que ontem
              </p>
            </div>
            <div className="bg-[#2a3137] p-2 rounded-full">
              <Moon className="text-blue-400 h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a2127] border-0 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-2">BPM Médio</p>
              <h2 className="text-4xl font-bold mb-2">68</h2>
              <p className="text-gray-400">
                <span className="mr-1">→</span>
                Normal
              </p>
            </div>
            <div className="bg-[#2a3137] p-2 rounded-full">
              <Heart className="text-pink-400 h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}