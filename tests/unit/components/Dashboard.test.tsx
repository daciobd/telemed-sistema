import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardMedicalPro from '@/pages/DashboardMedicalPro';
import { mockApiSuccess, mockApiError } from '../../setup';

// Mock dos hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('DashboardMedicalPro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o dashboard médico corretamente', () => {
    renderWithProviders(<DashboardMedicalPro />);
    
    expect(screen.getByText('TeleMed Pro')).toBeInTheDocument();
    expect(screen.getByText('Sistema Médico Avançado')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('deve exibir estatísticas rápidas', () => {
    renderWithProviders(<DashboardMedicalPro />);
    
    expect(screen.getByText('Consultas Hoje')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Pacientes Ativos')).toBeInTheDocument();
    expect(screen.getByText('245')).toBeInTheDocument();
  });

  it('deve navegar entre seções do menu', async () => {
    renderWithProviders(<DashboardMedicalPro />);
    
    const consultasButton = screen.getByText('Consultas');
    fireEvent.click(consultasButton);
    
    await waitFor(() => {
      expect(screen.getByText('Agenda de Consultas')).toBeInTheDocument();
    });
  });

  it('deve exibir lista de pacientes recentes', () => {
    renderWithProviders(<DashboardMedicalPro />);
    
    expect(screen.getByText('Atividade Recente')).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('João Santos')).toBeInTheDocument();
  });

  it('deve ter ações rápidas funcionais', () => {
    renderWithProviders(<DashboardMedicalPro />);
    
    expect(screen.getByText('Nova Consulta')).toBeInTheDocument();
    expect(screen.getByText('Teleconsulta')).toBeInTheDocument();
    expect(screen.getByText('Prescrição')).toBeInTheDocument();
    expect(screen.getByText('Agendar')).toBeInTheDocument();
  });

  it('deve exibir agenda de consultas na seção apropriada', async () => {
    renderWithProviders(<DashboardMedicalPro />);
    
    const consultasButton = screen.getByText('Consultas');
    fireEvent.click(consultasButton);
    
    await waitFor(() => {
      expect(screen.getByText('Carlos Mendes')).toBeInTheDocument();
      expect(screen.getByText('08:00')).toBeInTheDocument();
      expect(screen.getByText('Consulta Inicial')).toBeInTheDocument();
    });
  });
});