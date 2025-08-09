import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Baby, Calendar, Ruler, Weight } from 'lucide-react';

interface AddBabyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBabyDialog({ open, onOpenChange }: AddBabyDialogProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    babyName: '',
    birthDate: '',
    gender: '',
    birthWeight: '',
    birthHeight: '',
    birthHeadCircumference: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Implementar salvamento
      console.log('Salvando bebê:', formData);
      onOpenChange(false);
      setStep(1);
      setFormData({
        babyName: '',
        birthDate: '',
        gender: '',
        birthWeight: '',
        birthHeight: '',
        birthHeadCircumference: ''
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStep1Valid = formData.babyName && formData.birthDate && formData.gender;
  const isStep2Valid = true; // Medições são opcionais

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5" />
            Adicionar Bebê
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                <p className="text-sm text-gray-600">
                  Vamos começar com as informações essenciais do seu bebê
                </p>
              </div>

              <div>
                <Label htmlFor="babyName">Nome do Bebê</Label>
                <Input
                  id="babyName"
                  placeholder="Ex: Sofia"
                  value={formData.babyName}
                  onChange={(e) => updateFormData('babyName', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateFormData('birthDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Gênero</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">
                      <div className="flex items-center gap-2">
                        <span>👧</span>
                        Feminino
                      </div>
                    </SelectItem>
                    <SelectItem value="male">
                      <div className="flex items-center gap-2">
                        <span>👦</span>
                        Masculino
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center gap-2">
                        <span>👶</span>
                        Outro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview Card */}
              {formData.babyName && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Baby className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{formData.babyName}</h4>
                        <div className="text-sm text-gray-600">
                          {formData.birthDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(formData.birthDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium">Medições de Nascimento</h3>
                <p className="text-sm text-gray-600">
                  Essas informações são opcionais, mas ajudam a acompanhar o crescimento
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthWeight">Peso (gramas)</Label>
                  <div className="relative">
                    <Input
                      id="birthWeight"
                      type="number"
                      placeholder="3200"
                      value={formData.birthWeight}
                      onChange={(e) => updateFormData('birthWeight', e.target.value)}
                      className="pr-8"
                    />
                    <Weight className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthHeight">Altura (cm)</Label>
                  <div className="relative">
                    <Input
                      id="birthHeight"
                      type="number"
                      placeholder="50"
                      value={formData.birthHeight}
                      onChange={(e) => updateFormData('birthHeight', e.target.value)}
                      className="pr-8"
                    />
                    <Ruler className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="birthHeadCircumference">Perímetro Cefálico (cm)</Label>
                <div className="relative">
                  <Input
                    id="birthHeadCircumference"
                    type="number"
                    placeholder="35"
                    value={formData.birthHeadCircumference}
                    onChange={(e) => updateFormData('birthHeadCircumference', e.target.value)}
                    className="pr-8"
                  />
                  <Ruler className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Dica:</strong> Você pode adicionar essas medições depois se não tiver essa informação agora.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? () => onOpenChange(false) : handleBack}
            >
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button
              type="submit"
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
            >
              {step === 1 ? 'Próximo' : 'Adicionar Bebê'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}