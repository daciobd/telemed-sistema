export default function DoctorDashboardInline() {
  const openTelemonitoramento = () => {
    window.location.href = '/telemonitoramento-enfermagem';
  };

  const openCentroAvaliacao = () => {
    window.location.href = '/centro-avaliacao';
  };

  const openDrAI = () => {
    window.location.href = '/dr-ai';
  };

  const generatePDFReport = () => {
    alert('🎯 Função de PDF em desenvolvimento!');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                🏥 TeleMed Sistema
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Painel Médico
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem 1rem'
      }}>
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          color: 'white',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            Bom dia, Dr. Carlos Mendes! 👨‍⚕️
          </h2>
          <p style={{
            color: '#bfdbfe',
            margin: '0.5rem 0 0 0'
          }}>
            Você tem 3 consultas pendentes hoje e 5 já concluídas.
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '1rem', fontSize: '2rem' }}>📊</div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Avaliação: 4.8/5.0
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827'
                }}>
                  Receita: R$ 1250
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '1rem', fontSize: '2rem' }}>📅</div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Consultas Hoje
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827'
                }}>
                  8
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '1rem', fontSize: '2rem' }}>✅</div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Concluídas
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827'
                }}>
                  5
                </div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '1rem', fontSize: '2rem' }}>⏳</div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Pendentes
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827'
                }}>
                  3
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#111827',
              margin: 0
            }}>
              🚀 Ações Rápidas
            </h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <button
                onClick={openTelemonitoramento}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏥</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Telemonitoramento
                </div>
                <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Acompanhamento de enfermagem
                </div>
              </button>

              <button
                onClick={openCentroAvaliacao}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Centro de Avaliação
                </div>
                <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Testes psiquiátricos e triagem
                </div>
              </button>

              <button
                onClick={openDrAI}
                style={{
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4f46e5'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Dr. AI
                </div>
                <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Assistente inteligente médico
                </div>
              </button>

              <button
                onClick={generatePDFReport}
                style={{
                  backgroundColor: '#ea580c',
                  color: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c2410c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Relatórios PDF
                </div>
                <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>
                  Gerar relatórios médicos
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Centro de Avaliação Psiquiátrica */}
        <div style={{
          background: 'linear-gradient(to right, #eef2ff, #f3e8ff)',
          border: '1px solid #c7d2fe',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #c7d2fe'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#312e81',
              margin: 0
            }}>
              🧠 Centro de Avaliação Psiquiátrica
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#4338ca',
              margin: '0.25rem 0 0 0'
            }}>
              Ferramentas especializadas para triagem e diagnóstico
            </p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <a
                href="/gad7-ansiedade"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #c7d2fe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#312e81',
                  marginBottom: '0.5rem'
                }}>
                  😰 GAD-7
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#4338ca'
                }}>
                  Transtorno de Ansiedade Generalizada
                </div>
              </a>

              <a
                href="/phq9-depressao"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #c7d2fe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#312e81',
                  marginBottom: '0.5rem'
                }}>
                  😔 PHQ-9
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#4338ca'
                }}>
                  Escala de Depressão
                </div>
              </a>

              <a
                href="/mdq-bipolar"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #c7d2fe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#312e81',
                  marginBottom: '0.5rem'
                }}>
                  🔄 MDQ
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#4338ca'
                }}>
                  Transtorno Bipolar
                </div>
              </a>

              <a
                href="/tdah-asrs18"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #c7d2fe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#312e81',
                  marginBottom: '0.5rem'
                }}>
                  🎯 TDAH-ASRS18
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#4338ca'
                }}>
                  Déficit de Atenção e Hiperatividade
                </div>
              </a>

              <a
                href="/pss10-stress"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #c7d2fe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#312e81',
                  marginBottom: '0.5rem'
                }}>
                  😤 PSS-10
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#4338ca'
                }}>
                  Escala de Estresse Percebido
                </div>
              </a>

              <a
                href="/triagem-psiquiatrica"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #c7d2fe',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#312e81',
                  marginBottom: '0.5rem'
                }}>
                  🔍 Triagem
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#4338ca'
                }}>
                  Triagem Psiquiátrica Completa
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Telemonitoramento Section */}
        <div style={{
          background: 'linear-gradient(to right, #eff6ff, #eef2ff)',
          border: '1px solid #93c5fd',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #93c5fd'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#1e3a8a',
              margin: 0
            }}>
              🏥 Sistema de Telemonitoramento
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#1d4ed8',
              margin: '0.25rem 0 0 0'
            }}>
              Acompanhamento remoto de pacientes 24/7
            </p>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <a
                href="/telemonitoramento-enfermagem"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #93c5fd',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                onMouseOut={(e) => e.target.style.boxShadow = 'none'}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e3a8a',
                  marginBottom: '0.5rem'
                }}>
                  👩‍⚕️ Enfermagem
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1d4ed8'
                }}>
                  Acompanhamento de enfermagem especializado
                </div>
              </a>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #93c5fd',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e3a8a',
                  marginBottom: '0.5rem'
                }}>
                  📊 Métricas
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1d4ed8'
                }}>
                  Pacientes Ativos: 12 | Alertas: 2 | Status: Operacional
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}