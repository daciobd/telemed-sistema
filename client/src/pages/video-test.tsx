import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import VideoRoom from '@/components/video/video-room';
import { Video, Users, Stethoscope, User } from 'lucide-react';

interface TestUser {
  id: string;
  name: string;
  role: 'doctor' | 'patient';
}

export default function VideoTestPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [testUser, setTestUser] = useState<TestUser | null>(null);
  const [appointmentId, setAppointmentId] = useState<number>(999); // ID de teste
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient'>('doctor');

  const handleJoinCall = () => {
    if (!userName.trim()) return;
    
    const user: TestUser = {
      id: `test_${selectedRole}_${Date.now()}`,
      name: userName.trim(),
      role: selectedRole
    };
    
    // Armazenar dados do usuário para uso no VideoRoom
    localStorage.setItem('testUser', JSON.stringify(user));
    
    setTestUser(user);
    setIsInCall(true);
  };

  const handleLeaveCall = () => {
    setIsInCall(false);
    setTestUser(null);
  };

  if (isInCall && testUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VideoRoom
          appointmentId={appointmentId}
          patientName={testUser.role === 'patient' ? testUser.name : 'Paciente Teste'}
          doctorName={testUser.role === 'doctor' ? testUser.name : 'Dr. Teste'}
          onEndCall={handleLeaveCall}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Video className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Teste de Videoconsulta</CardTitle>
          <p className="text-gray-600">
            Configure sua entrada para testar a videoconsulta entre duas pessoas
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userName">Seu nome</Label>
            <Input
              id="userName"
              placeholder="Digite seu nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de usuário</Label>
            <Select value={selectedRole} onValueChange={(value: 'doctor' | 'patient') => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Médico
                  </div>
                </SelectItem>
                <SelectItem value="patient">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Paciente
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Como testar com duas pessoas
              </h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra esta página em dois dispositivos/navegadores</li>
                <li>2. Uma pessoa escolhe "Médico" e entra na chamada</li>
                <li>3. Outra pessoa escolhe "Paciente" e entra na chamada</li>
                <li>4. Ambas verão o vídeo da outra pessoa em tempo real</li>
              </ol>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">ID da Consulta de Teste</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-green-700">
                  Use o mesmo ID em ambos os dispositivos
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleJoinCall}
            disabled={!userName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Video className="h-4 w-4 mr-2" />
            Entrar na Videoconsulta
          </Button>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard'}
              className="text-sm"
            >
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}