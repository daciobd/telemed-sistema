import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle, XCircle, Bell, BellOff, ArrowLeft, ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';

const AgendaDia = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 25)); // July 25, 2025
  const [selectedTime, setSelectedTime] = useState({ hour: '08', minute: '00' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const consultas = [
    {
      id: 1,
      horario: '07:00',
      status: 'indisponivel',
      paciente: '',
      tipo: '',
      obs: 'Não disponível'
    },
    {
      id: 2,
      horario: '07:20',
      status: 'finalizado',
      paciente: 'Moreira, Carlos Otávio',
      tipo: 'Médico',
      obs: 'Finalizado'
    },
    {
      id: 3,
      horario: '07:40',
      status: 'confirmado',
      paciente: 'Ferreira, Carla Patrícia',
      tipo: 'Médico',
      obs: 'Confirmado'
    },
    {
      id: 4,
      horario: '08:00',
      status: 'confirmado',
      paciente: 'Cavalcante, Juliana',
      tipo: 'Psicólogo',
      obs: 'Confirmado'
    },
    {
      id: 5,
      horario: '08:20',
      status: 'confirmado',
      paciente: 'Diniz Ferreira, Fernando',
      tipo: 'Doutor Azul',
      obs: 'Confirmado'
    },
    {
      id: 6,
      horario: '08:40',
      status: 'confirmado',
      paciente: 'Rufino, Aline Amanda De Salles',
      tipo: 'Médico',
      obs: 'Confirmado'
    },
    {
      id: 7,
      horario: '09:00',
      status: 'confirmado',
      paciente: 'De Oliveira Canno, Kethelyn',
      tipo: 'Médico',
      obs: 'Confirmado'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <CheckCircle className="w-4 h-4" style={{ color: '#A7C7E7' }} />;
      case 'finalizado':
        return <CheckCircle className="w-4 h-4" style={{ color: '#F4D9B4' }} />;
      case 'indisponivel':
        return <XCircle className="w-4 h-4" style={{ color: '#E9967A' }} />;
      default:
        return <Clock className="w-4 h-4" style={{ color: '#A7C7E7' }} />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Médico':
        return { backgroundColor: '#A7C7E7', color: 'white' };
      case 'Psicólogo':
        return { backgroundColor: '#F4D9B4', color: '#8B4513' };
      case 'Doutor Azul':
        return { backgroundColor: '#E9967A', color: 'white' };
      default:
        return { backgroundColor: '#D1D5DB', color: '#6B7280' };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const generateTimeOptions = () => {
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];
    return { hours, minutes };
  };

  const { hours, minutes } = generateTimeOptions();

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen" style={{ 
      fontFamily: "'Poppins', 'Inter', sans-serif", 
      backgroundColor: '#FAFBFC' 
    }}>
      {/* Header */}
      <div className="text-white p-8 mb-8" style={{ 
        background: 'linear-gradient(135deg, #A7C7E7 0%, #92B4D7 100%)', 
        borderRadius: '20px' 
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <ArrowLeft className="w-6 h-6 cursor-pointer hover:opacity-80 rounded-full p-1 transition-opacity" />
            <h1 className="text-2xl font-semibold">Agenda de Videoconsultas</h1>
          </div>
          <div className="text-right">
            <p className="opacity-90 font-light">Bem-vindo, Dr. Dácio Bonoldi Dutra</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8" style={{ borderRadius: '20px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Calendário e Adicionar Horário */}
          <div className="space-y-8">
            
            {/* Mini Calendário */}
            <div className="p-6" style={{ backgroundColor: '#F8F9FA', borderRadius: '20px' }}>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => changeDate(-1)} className="p-2 hover:opacity-70 transition-opacity" style={{ borderRadius: '12px' }}>
                  <ChevronLeft className="w-5 h-5" style={{ color: '#A7C7E7' }} />
                </button>
                <h3 className="font-medium text-gray-700">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => changeDate(1)} className="p-2 hover:opacity-70 transition-opacity" style={{ borderRadius: '12px' }}>
                  <ChevronRight className="w-5 h-5" style={{ color: '#A7C7E7' }} />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-3">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="p-3 font-medium text-gray-500">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 10);
                  const isToday = date.toDateString() === currentDate.toDateString();
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentDate(date)}
                      className={`p-3 transition-all font-medium ${
                        isToday 
                          ? 'text-white' 
                          : isCurrentMonth 
                            ? 'hover:opacity-70 text-gray-600' 
                            : 'text-gray-300'
                      }`}
                      style={{
                        borderRadius: '12px',
                        backgroundColor: isToday ? '#A7C7E7' : 'transparent'
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Adicionar Horário */}
            <div className="p-6" style={{ backgroundColor: '#F8F9FA', borderRadius: '20px' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-gray-700">Adicionar horário</h3>
                <button
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="p-2 hover:opacity-70 transition-opacity"
                  style={{ borderRadius: '12px', backgroundColor: '#F4D9B4' }}
                >
                  <Settings className="w-4 h-4 text-amber-800" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <select 
                  value={selectedTime.hour}
                  onChange={(e) => setSelectedTime({...selectedTime, hour: e.target.value})}
                  className="px-4 py-3 font-medium text-gray-700 bg-white border-0 focus:outline-none"
                  style={{ borderRadius: '12px' }}
                >
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
                <span className="text-gray-500 font-medium">:</span>
                <select 
                  value={selectedTime.minute}
                  onChange={(e) => setSelectedTime({...selectedTime, minute: e.target.value})}
                  className="px-4 py-3 font-medium text-gray-700 bg-white border-0 focus:outline-none"
                  style={{ borderRadius: '12px' }}
                >
                  {minutes.map(minute => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
                <button 
                  className="text-white px-5 py-3 font-medium transition-opacity hover:opacity-80 flex items-center gap-2"
                  style={{ backgroundColor: '#A7C7E7', borderRadius: '12px' }}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              {/* Campos Avançados */}
              {showAdvancedFields && (
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Tipo de Consulta</label>
                    <select className="w-full px-4 py-3 bg-white border-0 font-medium text-gray-700 focus:outline-none" style={{ borderRadius: '12px' }}>
                      <option>Médico</option>
                      <option>Psicólogo</option>
                      <option>Doutor Azul</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Duração (minutos)</label>
                    <select className="w-full px-4 py-3 bg-white border-0 font-medium text-gray-700 focus:outline-none" style={{ borderRadius: '12px' }}>
                      <option>15</option>
                      <option>30</option>
                      <option>45</option>
                      <option>60</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de Consultas */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Calendar className="w-6 h-6" style={{ color: '#A7C7E7' }} />
                <h2 className="text-xl font-medium text-gray-700">
                  Horários para {formatDate(currentDate)}
                </h2>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`flex items-center gap-3 px-5 py-3 font-medium transition-opacity hover:opacity-80`}
                style={{
                  backgroundColor: notificationsEnabled ? '#A7C7E71A' : '#F8F9FA',
                  color: notificationsEnabled ? '#5A7A9A' : '#6B7280',
                  borderRadius: '12px'
                }}
              >
                {notificationsEnabled ? 
                  <Bell className="w-4 h-4" style={{ color: '#A7C7E7' }} /> : 
                  <BellOff className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                }
                {notificationsEnabled ? 'Notificações Ativas' : 'Ativar notificações'}
              </button>
            </div>

            <div className="space-y-4">
              {consultas.map((consulta) => (
                <div 
                  key={consulta.id} 
                  className="p-6 transition-all hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#FAFBFC', 
                    borderRadius: '20px',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-center min-w-[80px]">
                        <div className="text-xl font-bold text-gray-700">{consulta.horario}</div>
                        <div className="text-xs text-gray-500">20 min</div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getStatusIcon(consulta.status)}
                        <div>
                          <div className="font-medium text-gray-700">{consulta.paciente || 'Horário disponível'}</div>
                          {consulta.tipo && (
                            <span 
                              className="inline-block px-3 py-1 text-xs font-medium mt-1"
                              style={{
                                ...getTipoColor(consulta.tipo),
                                borderRadius: '12px'
                              }}
                            >
                              {consulta.tipo}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {consulta.status === 'confirmado' && (
                        <button 
                          className="flex items-center gap-2 px-4 py-2 text-white font-medium transition-opacity hover:opacity-80"
                          style={{ backgroundColor: '#A7C7E7', borderRadius: '12px' }}
                        >
                          <Video className="w-4 h-4" />
                          Iniciar
                        </button>
                      )}
                      <button 
                        className="px-4 py-2 font-medium transition-opacity hover:opacity-80"
                        style={{ 
                          backgroundColor: '#F8F9FA', 
                          color: '#6B7280', 
                          borderRadius: '12px',
                          border: '1px solid #E5E7EB'
                        }}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center p-6" style={{ backgroundColor: '#F0F9FF', borderRadius: '20px' }}>
                <div className="text-2xl font-bold" style={{ color: '#A7C7E7' }}>6</div>
                <div className="text-sm text-gray-600">Confirmadas</div>
              </div>
              <div className="text-center p-6" style={{ backgroundColor: '#FEF3C7', borderRadius: '20px' }}>
                <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>1</div>
                <div className="text-sm text-gray-600">Finalizadas</div>
              </div>
              <div className="text-center p-6" style={{ backgroundColor: '#FEE2E2', borderRadius: '20px' }}>
                <div className="text-2xl font-bold" style={{ color: '#E9967A' }}>1</div>
                <div className="text-sm text-gray-600">Indisponíveis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaDia;