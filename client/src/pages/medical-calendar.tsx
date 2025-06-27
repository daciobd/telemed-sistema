import Layout from '@/components/layout/layout';
import MedicalCalendar from '@/components/calendar/medical-calendar';

export default function MedicalCalendarPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Agenda Médica Avançada</h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie seus agendamentos com navegação por calendário e status em tempo real
          </p>
        </div>
        <MedicalCalendar />
      </div>
    </Layout>
  );
}