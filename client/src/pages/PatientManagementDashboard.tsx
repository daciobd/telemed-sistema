import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users, Calendar, Flask, FileText, X, Search, Plus } from "lucide-react";

const PatientManagementDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { icon: Users, value: 6, label: 'Pacientes', color: 'text-blue-600' },
    { icon: Calendar, value: 1, label: 'Consulta', color: 'text-green-600' },
    { icon: Flask, value: 4, label: 'Exames', color: 'text-yellow-600' },
    { icon: FileText, value: 54, label: 'Relatórios', color: 'text-red-600' }
  ];

  const patients = [
    {
      id: 1,
      name: 'Carlos Medeiros',
      cpf: '123.456.789-01',
      phone: '(11) 99999-1234',
      status: 'Ativo',
      lastConsultation: '15/08/2025'
    },
    {
      id: 2,
      name: 'João Silva',
      cpf: '987.654.321-09',
      phone: '(11) 98888-5678',
      status: 'Agendado',
      lastConsultation: '10/08/2025'
    },
    {
      id: 3,
      name: 'Maria Santos',
      cpf: '456.789.123-45',
      phone: '(11) 97777-9876',
      status: 'Pendente',
      lastConsultation: '08/08/2025'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600">
      {/* Statistics Cards */}
      <div className="px-4 pt-6 pb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Patient Management Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                  Gestão de Pacientes
                </DialogTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Gerencie seus pacientes e inicie consultas
            </p>
          </DialogHeader>

          {/* Search and Actions */}
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </div>

          {/* Patients Timeline */}
          <div className="space-y-4">
            {patients.map((patient, index) => (
              <div key={patient.id} className="relative">
                {/* Timeline Line */}
                {index < patients.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  {/* Timeline Dot */}
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-6 flex-shrink-0"></div>
                  
                  {/* Patient Card */}
                  <Card className="flex-1 border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                            <p className="text-sm text-gray-600">{patient.cpf}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>📞 {patient.phone}</p>
                          <p>📅 Última consulta: {patient.lastConsultation}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Iniciar Consulta
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Gerenciar Todos
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Timeline when modal is closed */}
      {!isModalOpen && (
        <div className="px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Timeline de Pacientes
              </h2>
              {patients.map((patient, index) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 mb-4 bg-white rounded-lg border">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Iniciar Consulta
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isModalOpen && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <Users className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default PatientManagementDashboard;