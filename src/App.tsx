/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Activity, 
  User, 
  Play, 
  Flame, 
  Timer, 
  TrendingUp,
  ChevronRight,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Zap,
  Heart,
  Video
} from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';
import { cn } from './lib/utils';

type Screen = 'home' | 'explore' | 'activity' | 'profile' | 'devices' | 'health_data';

// Brand Logos
const LOGO_PINK = "https://storage.googleapis.com/m-infra.appspot.com/v0/b/m-infra.appspot.com/o/4mgzex7g2wl3htmfcdivvn%2Finput_file_3.png?alt=media";
const LOGO_WHITE = "https://storage.googleapis.com/m-infra.appspot.com/v0/b/m-infra.appspot.com/o/4mgzex7g2wl3htmfcdivvn%2Finput_file_0.png?alt=media";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [connectedDevice, setConnectedDevice] = useState<{ name: string, type: 'bluetooth' | 'google_fit' } | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [healthData, setHealthData] = useState({
    weight: 75,
    height: 182,
    age: 28,
    bodyFat: 18,
    bloodPressure: '12/8'
  });

  // Simular progresso do treino
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkingOut && workoutProgress < 100) {
      interval = setInterval(() => {
        setWorkoutProgress(prev => Math.min(prev + 1, 100));
        // Se houver dispositivo, simular variação real
        if (connectedDevice) {
           setHeartRate(prev => {
             const base = prev || 120;
             return Math.floor(base + (Math.random() * 10 - 5));
           });
        }
      }, 500);
    }
    return () => {
      clearInterval(interval);
      if (!isWorkingOut) setHeartRate(null);
    };
  }, [isWorkingOut, workoutProgress, connectedDevice]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onStartWorkout={() => setIsWorkingOut(true)} />;
      case 'explore':
        return <ExploreScreen />;
      case 'activity':
        return <ActivityScreen />;
      case 'profile':
        return <ProfileScreen 
          onNavigateDevices={() => setActiveScreen('devices')} 
          onNavigateHealthData={() => setActiveScreen('health_data')}
          healthData={healthData}
        />;
      case 'devices':
        return <DevicesScreen 
          onBack={() => setActiveScreen('profile')} 
          connectedDevice={connectedDevice}
          onConnect={(device) => setConnectedDevice(device)}
          onDisconnect={() => setConnectedDevice(null)}
        />;
      case 'health_data':
        return <HealthDataScreen 
          onBack={() => setActiveScreen('profile')}
          healthData={healthData}
          onSave={(data) => {
            setHealthData(data);
            setActiveScreen('profile');
          }}
        />;
      default:
        return <HomeScreen onStartWorkout={() => setIsWorkingOut(true)} />;
    }
  };

  return (
    <div className="mobile-container">
      {/* Área de Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegação Inferior */}
      <nav className="bottom-nav">
        <NavItem 
          icon={<Home size={24} />} 
          label="Início" 
          active={activeScreen === 'home'} 
          onClick={() => setActiveScreen('home')} 
        />
        <NavItem 
          icon={<Search size={24} />} 
          label="Explorar" 
          active={activeScreen === 'explore'} 
          onClick={() => setActiveScreen('explore')} 
        />
        <div className="relative -top-6">
          <button 
            onClick={() => setIsWorkingOut(true)}
            className="w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-xl shadow-brand/40 active:scale-90 transition-transform"
          >
            <Plus size={32} className="text-white" />
          </button>
        </div>
        <NavItem 
          icon={<Activity size={24} />} 
          label="Atividade" 
          active={activeScreen === 'activity'} 
          onClick={() => setActiveScreen('activity')} 
        />
        <NavItem 
          icon={<User size={24} />} 
          label="Perfil" 
          active={activeScreen === 'profile'} 
          onClick={() => setActiveScreen('profile')} 
        />
      </nav>

      {/* Overlay de Treino */}
      <AnimatePresence>
        {isWorkingOut && (
          <WorkoutOverlay 
            progress={workoutProgress} 
            heartRate={heartRate}
            onClose={() => {
              setIsWorkingOut(false);
              setWorkoutProgress(0);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("nav-item", active && "active")}>
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}

function HomeScreen({ onStartWorkout }: { onStartWorkout: () => void }) {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">Bom dia,</p>
          <h1 className="text-2xl">Nilton Furtado</h1>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-brand">
          <img 
            src="https://picsum.photos/seed/user/100/100" 
            alt="Usuário" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      {/* Card de Progresso Diário */}
      <section className="bg-ink text-white p-6 rounded-[32px] relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={20} className="text-brand" />
            <span className="text-brand font-display font-bold uppercase text-xs tracking-widest">Meta Diária</span>
          </div>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-display font-bold">85</span>
            <span className="text-gray-400 mb-2">%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              className="bg-brand h-full"
            />
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>1.240 kcal queimadas</span>
            <span>Meta: 1.500</span>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <img src={LOGO_WHITE} alt="Logo" className="w-48" referrerPolicy="no-referrer" />
        </div>
      </section>

      {/* Grade de Estatísticas */}
      <section className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <Timer size={20} className="text-blue-500 mb-2" />
          <span className="text-2xl font-display font-bold">45</span>
          <span className="text-xs text-gray-500 uppercase font-medium">Minutos</span>
        </div>
        <div className="stat-card">
          <Zap size={20} className="text-yellow-500 mb-2" />
          <span className="text-2xl font-display font-bold">3.2k</span>
          <span className="text-xs text-gray-500 uppercase font-medium">Passos</span>
        </div>
      </section>

      {/* Início Rápido */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Início Rápido</h2>
          <button className="text-brand text-sm font-bold">Ver Tudo</button>
        </div>
        <div className="space-y-4">
          <WorkoutCard 
            title="HIIT Matinal" 
            duration="20 min" 
            intensity="Alta" 
            image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            onClick={onStartWorkout}
          />
          <WorkoutCard 
            title="Yoga Flow" 
            duration="35 min" 
            intensity="Baixa" 
            image="https://picsum.photos/seed/yoga/400/200"
            onClick={onStartWorkout}
          />
        </div>
      </section>
    </div>
  );
}

function WorkoutCard({ title, duration, intensity, image, onClick }: { title: string, duration: string, intensity: string, image: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full group relative h-48 rounded-3xl overflow-hidden text-left active:scale-[0.98] transition-transform"
    >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
        <div>
          <span className="bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Intensidade {intensity}
          </span>
          <h3 className="text-white text-xl">{title}</h3>
          <p className="text-gray-300 text-sm">{duration}</p>
        </div>
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <Play size={20} fill="currentColor" />
        </div>
      </div>
    </button>
  );
}

function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Força', icon: <Dumbbell />, color: 'bg-red-100 text-red-600' },
    { name: 'Cardio', icon: <Zap />, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Yoga', icon: <Heart />, color: 'bg-green-100 text-green-600' },
    { name: 'HIIT', icon: <Flame />, color: 'bg-orange-100 text-orange-600' },
  ];

  const allVideos = [
    { title: 'Levantamento Terra', category: 'Força', thumbnail: 'https://picsum.photos/seed/strength1/400/225' },
    { title: 'Agachamento Sumô', category: 'Força', thumbnail: 'https://picsum.photos/seed/strength2/400/225' },
    { title: 'Corrida Intervalada', category: 'Cardio', thumbnail: 'https://picsum.photos/seed/cardio1/400/225' },
    { title: 'Ciclismo Indoor', category: 'Cardio', thumbnail: 'https://picsum.photos/seed/cardio2/400/225' },
    { title: 'Saudação ao Sol', category: 'Yoga', thumbnail: 'https://picsum.photos/seed/yoga1/400/225' },
    { title: 'Vinyasa Flow', category: 'Yoga', thumbnail: 'https://picsum.photos/seed/yoga2/400/225' },
    { title: 'Circuito HIIT 15min', category: 'HIIT', thumbnail: 'https://picsum.photos/seed/hiit1/400/225' },
    { title: 'Tabata Full Body', category: 'HIIT', thumbnail: 'https://picsum.photos/seed/hiit2/400/225' },
  ];

  const filteredVideos = selectedCategory 
    ? allVideos.filter(v => v.category === selectedCategory)
    : allVideos;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">Explorar</h1>
        <img src={LOGO_PINK} alt="Logo" className="h-8" referrerPolicy="no-referrer" />
      </div>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar treinos..." 
          className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button 
            key={cat.name} 
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={cn(
              "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 active:scale-95",
              selectedCategory === cat.name 
                ? "bg-brand text-white border-brand shadow-lg shadow-brand/20" 
                : "bg-gray-50 border-gray-100 text-ink hover:bg-gray-100"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", 
              selectedCategory === cat.name ? "bg-white/20 text-white" : cat.color
            )}>
              {cat.icon}
            </div>
            <span className="font-display font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">
            {selectedCategory ? `Vídeos de ${selectedCategory}` : 'Todos os Vídeos'}
          </h2>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-brand text-sm font-bold"
            >
              Ver Tudo
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6">
          {filteredVideos.map((video, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={video.title} 
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-3">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-brand/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                    {video.category}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-lg group-hover:text-brand transition-colors">{video.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-4">Recomendados para você</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] h-40 bg-gray-100 rounded-3xl overflow-hidden relative">
              <img 
                src={`https://picsum.photos/seed/rec${i}/400/200`} 
                alt="Treino" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-lg font-display">Sessão Power {i}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ActivityScreen() {
  const activities = [
    { title: 'Corrida Matinal', date: 'Hoje, 08:30', kcal: '320 kcal', icon: <Zap className="text-yellow-500" /> },
    { title: 'HIIT Corpo Todo', date: 'Ontem, 18:15', kcal: '450 kcal', icon: <Flame className="text-orange-500" /> },
    { title: 'Yoga Noturno', date: '28 Mar, 21:00', kcal: '120 kcal', icon: <Heart className="text-red-500" /> },
    { title: 'Treino de Força', date: '27 Mar, 11:00', kcal: '380 kcal', icon: <Dumbbell className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">Atividade</h1>
      
      <div className="bg-brand/10 p-6 rounded-3xl border border-brand/20 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">Média Semanal</p>
          <h2 className="text-2xl text-ink">1.420 kcal</h2>
        </div>
        <TrendingUp size={32} className="text-brand" />
      </div>

      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {act.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{act.title}</h3>
              <p className="text-xs text-gray-500">{act.date}</p>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-ink">{act.kcal}</span>
              <ChevronRight size={16} className="text-gray-300 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ 
  onNavigateDevices, 
  onNavigateHealthData,
  healthData
}: { 
  onNavigateDevices: () => void, 
  onNavigateHealthData: () => void,
  healthData: any
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-brand p-1">
          <img 
            src="https://picsum.photos/seed/user/200/200" 
            alt="Usuário" 
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-2xl">Nilton Furtado</h1>
          <p className="text-gray-500">Membro Premium</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Peso</p>
          <p className="font-display font-bold">{healthData.weight} kg</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Altura</p>
          <p className="font-display font-bold">{healthData.height} cm</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Idade</p>
          <p className="font-display font-bold">{healthData.age} a</p>
        </div>
      </div>

      <div className="space-y-2">
        <ProfileLink icon={<TrendingUp size={20} />} label="Recordes Pessoais" />
        <ProfileLink 
          icon={<Heart size={20} />} 
          label="Dados de Saúde" 
          onClick={onNavigateHealthData}
        />
        <ProfileLink icon={<Activity size={20} />} label="Histórico de Treinos" />
        <ProfileLink 
          icon={<Zap size={20} />} 
          label="Dispositivos Conectados" 
          onClick={onNavigateDevices}
        />
        <ProfileLink icon={<User size={20} />} label="Configurações da Conta" />
      </div>

      <button className="w-full py-4 text-red-500 font-bold border border-red-100 rounded-2xl active:bg-red-50">
        Sair
      </button>
    </div>
  );
}

function HealthDataScreen({ 
  onBack, 
  healthData, 
  onSave 
}: { 
  onBack: () => void, 
  healthData: any, 
  onSave: (data: any) => void 
}) {
  const [formData, setFormData] = useState(healthData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl">Dados de Saúde</h1>
      </header>

      <div className="bg-brand/5 p-6 rounded-3xl border border-brand/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white">
          <Heart size={24} />
        </div>
        <div>
          <h3 className="font-bold">Mantenha-se Atualizado</h3>
          <p className="text-xs text-gray-500">Dados precisos ajudam a calcular melhor suas calorias e metas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Peso (kg)</label>
            <input 
              type="number" 
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Altura (cm)</label>
            <input 
              type="number" 
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Idade</label>
            <input 
              type="number" 
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Gordura (%)</label>
            <input 
              type="number" 
              value={formData.bodyFat}
              onChange={(e) => setFormData({...formData, bodyFat: Number(e.target.value)})}
              className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500 ml-1">Pressão Arterial</label>
          <input 
            type="text" 
            placeholder="Ex: 12/8"
            value={formData.bloodPressure}
            onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
            className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <button type="submit" className="action-button w-full mt-8">
          Salvar Dados
        </button>
      </form>
    </div>
  );
}

function DevicesScreen({ 
  onBack, 
  connectedDevice, 
  onConnect, 
  onDisconnect 
}: { 
  onBack: () => void, 
  connectedDevice: { name: string, type: string } | null,
  onConnect: (device: { name: string, type: 'bluetooth' | 'google_fit' }) => void,
  onDisconnect: () => void
}) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectBluetooth = async () => {
    setIsConnecting(true);
    try {
      // Web Bluetooth API
      const nav = navigator as any;
      if (!nav.bluetooth) {
        alert("Seu navegador não suporta Bluetooth Web. Tente usar o Chrome.");
        return;
      }

      const device = await nav.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }]
      });

      if (device) {
        onConnect({ name: device.name || 'Monitor Cardíaco', type: 'bluetooth' });
      }
    } catch (error) {
      console.error("Erro ao conectar Bluetooth:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectGoogleFit = () => {
    // Simulação de fluxo OAuth conforme diretrizes
    // Em um app real, abriríamos o popup de autorização do Google
    setIsConnecting(true);
    setTimeout(() => {
      onConnect({ name: 'Google Fit', type: 'google_fit' });
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl">Dispositivos</h1>
      </header>

      {connectedDevice ? (
        <div className="bg-brand/10 p-6 rounded-3xl border border-brand/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white">
                {connectedDevice.type === 'bluetooth' ? <Heart size={24} /> : <Activity size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-ink">{connectedDevice.name}</h3>
                <p className="text-xs text-brand-dark font-medium uppercase tracking-wider">Conectado</p>
              </div>
            </div>
            <button 
              onClick={onDisconnect}
              className="text-red-500 text-sm font-bold"
            >
              Desconectar
            </button>
          </div>
          <div className="flex gap-4 pt-4 border-t border-brand/10">
            <div className="flex-1 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Sincronização</p>
              <p className="text-sm font-display font-bold">Automática</p>
            </div>
            <div className="flex-1 text-center border-x border-brand/10">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Bateria</p>
              <p className="text-sm font-display font-bold">85%</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Sinal</p>
              <p className="text-sm font-display font-bold">Excelente</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-200 text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Zap size={32} className="text-gray-300" />
          </div>
          <div>
            <h3 className="font-bold">Nenhum dispositivo</h3>
            <p className="text-sm text-gray-500">Conecte seu smartwatch ou monitor para sincronizar dados automaticamente.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-display">Opções de Conexão</h2>
        
        <button 
          disabled={isConnecting || !!connectedDevice}
          onClick={handleConnectBluetooth}
          className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm active:bg-gray-50 disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <Heart size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold">Monitor Cardíaco</p>
              <p className="text-xs text-gray-500">Conectar via Bluetooth</p>
            </div>
          </div>
          <Plus size={20} className="text-gray-300" />
        </button>

        <button 
          disabled={isConnecting || !!connectedDevice}
          onClick={handleConnectGoogleFit}
          className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm active:bg-gray-50 disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold">Google Fit</p>
              <p className="text-xs text-gray-500">Sincronizar passos e treinos</p>
            </div>
          </div>
          <Plus size={20} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
}

function ProfileLink({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors"
    >
      <div className="flex items-center gap-3 text-gray-700">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  );
}

function WorkoutOverlay({ progress, onClose, heartRate }: { progress: number, onClose: () => void, heartRate: number | null }) {
  const isFinished = progress === 100;
  const displayHeartRate = heartRate || 145;
  const [showVideo, setShowVideo] = useState(true);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-ink text-white flex flex-col"
    >
      <header className="flex justify-between items-center p-8 pb-4">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-display">HIIT Matinal</h2>
        <button 
          onClick={() => setShowVideo(!showVideo)}
          className={cn("p-2 rounded-full transition-colors", showVideo ? "bg-brand text-white" : "bg-white/10 text-gray-400")}
        >
          <Video size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        {showVideo && !isFinished ? (
          <div className="w-full aspect-video bg-black relative">
            <MuxPlayer
              playbackId="q6m00O02602W02602602602602602602602602"
              metadata={{
                video_id: "workout-hiit-001",
                video_title: "HIIT Matinal",
                viewer_user_id: "user-123",
              }}
              streamType="on-demand"
              accentColor="#F27D26"
              className="w-full h-full"
              autoPlay
              muted
            />
            <div className="absolute top-4 left-4 bg-brand/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Ao Vivo
            </div>
          </div>
        ) : null}

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle 
                cx="96" cy="96" r="88" 
                className="stroke-white/10 fill-none" 
                strokeWidth="6" 
              />
              <motion.circle 
                cx="96" cy="96" r="88" 
                className="stroke-brand fill-none" 
                strokeWidth="6" 
                strokeDasharray="553"
                animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-display font-bold">{isFinished ? 'Fim' : `${progress}%`}</span>
              {!isFinished && <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Progresso</span>}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl">{isFinished ? 'Treino Concluído!' : 'Continue assim!'}</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              {isFinished 
                ? 'Você arrasou na sessão matinal. Hora de recuperar.' 
                : 'Foque na sua respiração e mantenha a postura.'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 pt-0">
        {isFinished ? (
          <button 
            onClick={onClose}
            className="action-button w-full mb-4"
          >
            <CheckCircle2 size={24} />
            Finalizar Sessão
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Tempo</p>
              <p className="text-lg font-display">12:45</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl text-center">
              <p className="text-[10px] text-gray-500 uppercase mb-1">Freq. Cardíaca</p>
              <p className={cn("text-lg font-display", heartRate ? "text-brand" : "text-red-400")}>
                {displayHeartRate} bpm
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
