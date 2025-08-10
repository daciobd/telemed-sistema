import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  Video, 
  MapPin, 
  Stethoscope,
  Clock,
  AlertCircle,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Pill
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  patientName: string;
}

const specialties = [
  { value: 'Cardiologia', label: 'Cardiologia', icon: <Heart className="h-4 w-4 text-red-500" /> },
  { value: 'Dermatologia', label: 'Dermatologia', icon: <Pill className="h-4 w-4 text-orange-500" /> },
  { value: 'Endocrinologia', label: 'Endocrinologia', icon: <Pill className="h-4 w-4 text-green-500" /> },
  { value: 'Gastroenterologia', label: 'Gastroenterologia', icon: <Pill className="h-4 w-4 text-yellow-500" /> },
  { value: 'Neurologia', label: 'Neurologia', icon: <Brain className="h-4 w-4 text-purple-500" /> },
  { value: 'Ortopedia', label: 'Ortopedia', icon: <Bone className="h-4 w-4 text-gray-500" /> },
  { value: 'Pediatria', label: 'Pediatria', icon: <Baby className="h-4 w-4 text-pink-500" /> },
  { value: 'Psiquiatria', label: 'Psiquiatria', icon: <Brain className="h-4 w-4 text-indigo-500" /> },
  { value: 'Ginecologia', label: 'Ginecologia', icon: <Pill className="h-4 w-4 text-pink-400" /> },
  { value: 'Urologia', label: 'Urologia', icon: <Pill className="h-4 w-4 text-blue-500" /> },
  { value: 'Oftalmologia', label: 'Oftalmologia', icon: <Eye className="h-4 w-4 text-teal-500" /> },
  { value: 'Otorrinolaringologia', label: 'Otorrinolaringologia', icon: <Pill className="h-4 w-4 text-cyan-500" /> }
];

export default function ReferralModal({ isOpen, onClose, appointmentId, patientName }: ReferralModalProps) {
  const [targetSpecialty, setTargetSpecialty] = useState('');
  const [targetDoctorId, setTargetDoctorId] = useState('');
  const [consultationType, setConsultationType] = useState<'presential' | 'teleconsult'>('presential');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [reason, setReason] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [requestedExams, setRequestedExams] = useState('');
  const [notes, setNotes] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availableDoctors } = useQuery({
    queryKey: ['/api/doctors', targetSpecialty],
    enabled: !!targetSpecialty,
  });

  const createReferralMutation = useMutation({
    mutationFn: async () => {
      // Get patient ID from appointment
      const appointmentResponse = await apiRequest(`/api/appointments/${appointmentId}`);
      const patientId = appointmentResponse.patientId;

      await apiRequest('/api/medical-referrals', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId,
          patientId,
          targetSpecialty,
          targetDoctorId: targetDoctorId || null,
          consultationType,
          priority,
          reason,
          clinicalSummary,
          requestedExams,
          notes
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Encaminhamento criado",
        description: `Paciente ${patientName} encaminhado para ${targetSpecialty}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/medical-referrals'] });
      onClose();
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o encaminhamento.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTargetSpecialty('');
    setTargetDoctorId('');
    setConsultationType('presential');
    setPriority('routine');
    setReason('');
    setClinicalSummary('');
    setRequestedExams('');
    setNotes('');
  };

  const specialtyDoctors = availableDoctors?.filter((doctor: any) => 
    doctor.specialty === targetSpecialty
  ) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 bg-red-50';
      case 'urgent': return 'text-orange-600 bg-orange-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'Emergência';
      case 'urgent': return 'Urgente';
      default: return 'Rotina';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Encaminhar Paciente - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Specialty Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Especialidade de Destino</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specialties.map((specialty) => (
                <Card
                  key={specialty.value}
                  className={`cursor-pointer transition-all ${
                    targetSpecialty === specialty.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setTargetSpecialty(specialty.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      {specialty.icon}
                      <span className="text-sm font-medium">{specialty.label}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Doctor Selection */}
          {targetSpecialty && (
            <div className="space-y-2">
              <Label>Médico Específico (Opcional)</Label>
              <Select value={targetDoctorId} onValueChange={setTargetDoctorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar médico específico ou deixar em branco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer médico da especialidade</SelectItem>
                  {specialtyDoctors.map((doctor: any) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.user?.firstName} {doctor.user?.lastName} - CRM {doctor.licenseNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Consultation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de Consulta</Label>
            <RadioGroup
              value={consultationType}
              onValueChange={(value: 'presential' | 'teleconsult') => setConsultationType(value)}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <Card className={consultationType === 'presential' ? 'ring-2 ring-blue-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="presential" id="presential" />
                      <Label htmlFor="presential" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Consulta Presencial</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Atendimento no consultório do especialista
                        </p>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className={consultationType === 'teleconsult' ? 'ring-2 ring-blue-500' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="teleconsult" id="teleconsult" />
                      <Label htmlFor="teleconsult" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Teleconsulta</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Atendimento por videochamada
                        </p>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    Rotina
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Urgente
                  </div>
                </SelectItem>
                <SelectItem value="emergency">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    Emergência
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Motivo do Encaminhamento *</Label>
            <Textarea
              placeholder="Descreva o motivo do encaminhamento..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* Clinical Summary */}
          <div className="space-y-2">
            <Label>Resumo Clínico</Label>
            <Textarea
              placeholder="Histórico clínico relevante, sintomas, evolução..."
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              rows={4}
            />
          </div>

          {/* Requested Exams */}
          <div className="space-y-2">
            <Label>Exames Solicitados/Realizados</Label>
            <Textarea
              placeholder="Liste exames já realizados ou que devem ser solicitados..."
              value={requestedExams}
              onChange={(e) => setRequestedExams(e.target.value)}
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Observações Adicionais</Label>
            <Textarea
              placeholder="Informações complementares, medicações em uso, alergias..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Summary Card */}
          {targetSpecialty && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Resumo do Encaminhamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Especialidade:</span>
                  <Badge variant="outline">{targetSpecialty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tipo de Consulta:</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {consultationType === 'presential' ? (
                      <>
                        <MapPin className="h-3 w-3" />
                        Presencial
                      </>
                    ) : (
                      <>
                        <Video className="h-3 w-3" />
                        Teleconsulta
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Prioridade:</span>
                  <Badge className={getPriorityColor(priority)}>
                    {getPriorityLabel(priority)}
                  </Badge>
                </div>
                {targetDoctorId && (
                  <div className="flex items-center justify-between">
                    <span>Médico:</span>
                    <Badge variant="outline">
                      {specialtyDoctors.find((d: any) => d.id.toString() === targetDoctorId)?.user?.firstName} {' '}
                      {specialtyDoctors.find((d: any) => d.id.toString() === targetDoctorId)?.user?.lastName}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={() => createReferralMutation.mutate()}
              disabled={!targetSpecialty || !reason || createReferralMutation.isPending}
            >
              {createReferralMutation.isPending ? 'Criando...' : 'Criar Encaminhamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}