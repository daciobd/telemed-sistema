export default function PatientDashboardSimple() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard do Paciente
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Bem-vindo ao seu dashboard! Esta é uma versão simplificada para teste.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Agendar Consulta</h3>
              <p className="text-blue-700 text-sm">Marque uma nova consulta médica</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Meus Prontuários</h3>
              <p className="text-green-700 text-sm">Acesse seu histórico médico</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Contato Médico</h3>
              <p className="text-purple-700 text-sm">Envie dúvidas via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}