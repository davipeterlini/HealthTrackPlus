import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Camera, Video, BookOpen, Calendar, Heart, Baby, Laugh, Frown } from 'lucide-react';

interface BabyNotesProps {
  babyId: number;
}

export function BabyNotes({ babyId }: BabyNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas', icon: BookOpen },
    { id: 'behavior', name: 'Comportamento', icon: Baby },
    { id: 'health', name: 'Saúde', icon: Heart },
    { id: 'development', name: 'Desenvolvimento', icon: BookOpen },
    { id: 'funny_moment', name: 'Momento Engraçado', icon: Laugh }
  ];

  const moods = [
    { value: 'happy', label: 'Feliz', icon: '😊' },
    { value: 'fussy', label: 'Irritado', icon: '😤' },
    { value: 'sleepy', label: 'Sonolento', icon: '😴' },
    { value: 'alert', label: 'Alerta', icon: '😮' },
    { value: 'calm', label: 'Calmo', icon: '😌' }
  ];

  // Mock data
  const notes = [
    {
      id: 1,
      date: '2024-06-15',
      category: 'development',
      title: 'Tentou se sentar sozinho',
      description: 'Hoje pela manhã, Sofia tentou se sentar sozinha pela primeira vez! Ela conseguiu ficar sentada por uns 10 segundos antes de perder o equilíbrio. Ficou muito orgulhosa de si mesma.',
      mood: 'happy',
      tags: ['motor', 'milestone'],
      photoUrl: null,
      videoUrl: null
    },
    {
      id: 2,
      date: '2024-06-14',
      category: 'funny_moment',
      title: 'Primeira vez comendo banana',
      description: 'A expressão do rosto da Sofia quando provou banana pela primeira vez foi impagável! Ela fez uma cara muito engraçada, mas depois pediu mais. Conseguimos filmar o momento.',
      mood: 'happy',
      tags: ['alimentação', 'primeira_vez'],
      photoUrl: null,
      videoUrl: 'video_url_example'
    },
    {
      id: 3,
      date: '2024-06-13',
      category: 'health',
      title: 'Consulta de rotina',
      description: 'Levamos a Sofia para consulta de rotina hoje. O pediatra disse que ela está se desenvolvendo muito bem. Peso e altura estão dentro da normalidade para a idade.',
      mood: 'calm',
      tags: ['consulta', 'pediatra'],
      photoUrl: null,
      videoUrl: null
    },
    {
      id: 4,
      date: '2024-06-12',
      category: 'behavior',
      title: 'Noite agitada',
      description: 'Sofia teve uma noite bem agitada ontem. Acordou várias vezes e demorou para voltar a dormir. Pode ser porque está nascendo um dentinho.',
      mood: 'fussy',
      tags: ['sono', 'dentição'],
      photoUrl: null,
      videoUrl: null
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    setEditingNote(null);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  const getCategoryName = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.name : category;
  };

  const getMoodIcon = (mood: string) => {
    const moodData = moods.find(m => m.value === mood);
    return moodData ? moodData.icon : '😊';
  };

  const getMoodLabel = (mood: string) => {
    const moodData = moods.find(m => m.value === mood);
    return moodData ? moodData.label : mood;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      behavior: 'bg-blue-50 text-blue-700',
      health: 'bg-green-50 text-green-700',
      development: 'bg-purple-50 text-purple-700',
      funny_moment: 'bg-yellow-50 text-yellow-700'
    };
    return colors[category] || 'bg-gray-50 text-gray-700';
  };

  const filteredNotes = selectedCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Anotações e Memórias</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Anotação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Editar Anotação' : 'Nova Anotação'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c.id !== 'all').map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Primeiro sorriso"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  placeholder="Descreva o que aconteceu..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mood">Humor do Bebê</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o humor" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((mood) => (
                        <SelectItem key={mood.value} value={mood.value}>
                          <div className="flex items-center gap-2">
                            <span>{mood.icon}</span>
                            {mood.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    placeholder="Ex: milestone, primeira_vez"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Adicionar Foto
                </Button>
                <Button type="button" variant="outline" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Adicionar Vídeo
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingNote ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => {
          const CategoryIcon = getCategoryIcon(note.category);
          return (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CategoryIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{note.title}</h4>
                        <Badge variant="outline" className={getCategoryColor(note.category)}>
                          {getCategoryName(note.category)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(note.date).toLocaleDateString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingNote(note);
                            setIsOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{note.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span>{getMoodIcon(note.mood)}</span>
                        <span className="text-gray-600">{getMoodLabel(note.mood)}</span>
                      </div>
                      
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 ml-auto">
                        {note.photoUrl && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            Foto
                          </Badge>
                        )}
                        {note.videoUrl && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Vídeo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              Nenhuma anotação encontrada
            </h4>
            <p className="text-gray-500 mb-4">
              {selectedCategory === 'all' 
                ? 'Começe criando sua primeira anotação sobre o desenvolvimento do seu bebê.'
                : `Não há anotações na categoria "${getCategoryName(selectedCategory)}".`
              }
            </p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Anotação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}