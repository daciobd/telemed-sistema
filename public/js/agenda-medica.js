// Agenda Médica TeleMed Pro - Sistema Avançado de Consultas
// Data atual: 18 de Agosto de 2025

class AgendaMedica {
    constructor() {
        this.currentDate = new Date(2025, 7, 18); // Agosto 2025
        this.selectedDate = null;
        this.appointments = this.generateMockAppointments();
        this.initializeElements();
        this.setupEventListeners();
        this.renderCalendar();
        this.selectToday();
    }

    initializeElements() {
        this.calendarBody = document.getElementById('calendarBody');
        this.currentMonthEl = document.getElementById('currentMonth');
        this.scheduleDateEl = document.getElementById('scheduleDate');
        this.appointmentsListEl = document.getElementById('appointmentsList');
        this.modal = document.getElementById('notificationsModal');
        this.toggle = document.getElementById('notificationsToggle');
        this.modalClose = document.getElementById('modalClose');
        this.saveBtn = document.getElementById('saveNotifications');
    }

    generateMockAppointments() {
        // Dados realistas para demonstração
        const appointments = [
            // 18/08/2025 (hoje) - mais consultas
            { 
                date: '2025-08-18', 
                time: '08:20', 
                patient: 'Dr. Silva, Bruno Peixoto', 
                specialty: 'Cardiologia',
                status: 'Confirmado', 
                ready: false, 
                id: 1,
                type: 'Consulta'
            },
            { 
                date: '2025-08-18', 
                time: '08:40', 
                patient: 'Matsushita, Juliana Santos', 
                specialty: 'Dermatologia',
                status: 'Aguardando', 
                ready: true, 
                id: 2,
                type: 'Retorno'
            },
            { 
                date: '2025-08-18', 
                time: '09:00', 
                patient: 'Helena Vicentini, Solange', 
                specialty: 'Psiquiatria',
                status: 'Confirmado', 
                ready: false, 
                id: 3,
                type: 'Primeira Consulta'
            },
            { 
                date: '2025-08-18', 
                time: '09:20', 
                patient: 'Costa, Roberto Silva', 
                specialty: 'Ortopedia',
                status: 'Reagendado', 
                ready: false, 
                id: 4,
                type: 'Consulta'
            },
            { 
                date: '2025-08-18', 
                time: '10:00', 
                patient: 'Fernandes, Maria Oliveira', 
                specialty: 'Ginecologia',
                status: 'Confirmado', 
                ready: true, 
                id: 5,
                type: 'Exame'
            },
            // 19/08/2025 (amanhã)
            { 
                date: '2025-08-19', 
                time: '08:00', 
                patient: 'Santos, Pedro Henrique', 
                specialty: 'Neurologia',
                status: 'Confirmado', 
                ready: false, 
                id: 6,
                type: 'Consulta'
            },
            { 
                date: '2025-08-19', 
                time: '09:30', 
                patient: 'Lima, Ana Carolina', 
                specialty: 'Endocrinologia',
                status: 'Pendente', 
                ready: false, 
                id: 7,
                type: 'Primeira Consulta'
            },
            // 20/08/2025
            { 
                date: '2025-08-20', 
                time: '08:30', 
                patient: 'Rodrigues, João Carlos', 
                specialty: 'Urologia',
                status: 'Confirmado', 
                ready: false, 
                id: 8,
                type: 'Retorno'
            },
            // 22/08/2025
            { 
                date: '2025-08-22', 
                time: '14:00', 
                patient: 'Almeida, Beatriz Santos', 
                specialty: 'Pediatria',
                status: 'Confirmado', 
                ready: false, 
                id: 9,
                type: 'Consulta'
            },
            { 
                date: '2025-08-22', 
                time: '15:30', 
                patient: 'Torres, Gabriel Costa', 
                specialty: 'Oftalmologia',
                status: 'Aguardando', 
                ready: true, 
                id: 10,
                type: 'Exame'
            }
        ];
        return appointments;
    }

    setupEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.navigateMonth(1));
        
        this.toggle.addEventListener('change', () => {
            if (this.toggle.checked) {
                this.modal.style.display = 'block';
            }
        });
        
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        this.saveBtn.addEventListener('click', () => this.saveNotificationSettings());
        
        // New appointment button
        document.getElementById('newAppointmentBtn')?.addEventListener('click', () => {
            this.openNewAppointmentForm();
        });
    }

    renderCalendar() {
        this.calendarBody.innerHTML = '';
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        
        this.currentMonthEl.textContent = this.currentDate.toLocaleString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        });

        let row = document.createElement('tr');
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement('td'));
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('td');
            cell.textContent = day;
            
            const dateStr = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Mark today
            if (this.isToday(day)) {
                cell.classList.add('today');
            }
            
            // Mark if has appointments
            if (this.hasAppointments(dateStr)) {
                cell.classList.add('has-appointments');
            }
            
            cell.addEventListener('click', () => this.selectDate(day));
            row.appendChild(cell);
            
            if ((day + firstDay) % 7 === 0) {
                this.calendarBody.appendChild(row);
                row = document.createElement('tr');
            }
        }
        
        if (row.children.length) {
            this.calendarBody.appendChild(row);
        }
    }

    isToday(day) {
        const today = new Date();
        return day === today.getDate() && 
               this.currentDate.getMonth() === today.getMonth() && 
               this.currentDate.getFullYear() === today.getFullYear();
    }

    hasAppointments(dateStr) {
        return this.appointments.some(apt => apt.date === dateStr);
    }

    selectDate(day) {
        // Remove previous selection
        document.querySelectorAll('.calendar-grid td.selected').forEach(td => {
            td.classList.remove('selected');
        });
        
        // Add selection to clicked day
        event.target.classList.add('selected');
        
        this.selectedDate = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        this.renderSchedule();
    }

    selectToday() {
        const today = new Date();
        if (this.currentDate.getMonth() === today.getMonth() && 
            this.currentDate.getFullYear() === today.getFullYear()) {
            this.selectDate(today.getDate());
        }
    }

    renderSchedule() {
        if (!this.selectedDate) return;
        
        const formattedDate = this.selectedDate.split('-').reverse().join('/');
        this.scheduleDateEl.textContent = `Horários para ${formattedDate}`;
        
        const dayAppointments = this.appointments.filter(apt => apt.date === this.selectedDate);
        
        if (dayAppointments.length === 0) {
            this.appointmentsListEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <p>Nenhuma consulta agendada para este dia</p>
                    <button class="btn primary" style="margin-top: 1rem;" onclick="agenda.openNewAppointmentForm()">
                        Agendar Nova Consulta
                    </button>
                </div>
            `;
            return;
        }
        
        this.appointmentsListEl.innerHTML = dayAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(apt => this.renderAppointmentItem(apt))
            .join('');
    }

    renderAppointmentItem(apt) {
        const statusColors = {
            'Confirmado': 'var(--success)',
            'Aguardando': 'var(--warning)',
            'Reagendado': 'var(--accent)',
            'Pendente': 'var(--danger)'
        };
        
        return `
            <div class="appointment-item" data-appointment-id="${apt.id}">
                <div class="appointment-time">${apt.time}</div>
                <div class="appointment-details">
                    <div class="appointment-patient">${apt.patient}</div>
                    <div class="appointment-status" style="color: ${statusColors[apt.status] || 'var(--text-muted)'}">
                        ${apt.specialty} • ${apt.type} • ${apt.status}
                    </div>
                </div>
                <div class="appointment-actions">
                    ${apt.ready ? '<div class="camera-ready" title="Paciente conectado e pronto"></div>' : ''}
                    <button class="action-btn video" onclick="agenda.startVideoCall(${apt.id})" title="Iniciar Videochamada">
                        🎥
                    </button>
                    <button class="action-btn" onclick="agenda.rescheduleAppointment(${apt.id})" title="Reagendar">
                        📅
                    </button>
                    <button class="action-btn" onclick="agenda.viewDetails(${apt.id})" title="Ver Detalhes">
                        👁️
                    </button>
                </div>
            </div>
        `;
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
        this.selectedDate = null;
        this.appointmentsListEl.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <p>Selecione um dia para ver as consultas</p>
            </div>
        `;
        this.scheduleDateEl.textContent = `Agenda de ${this.currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;
    }

    startVideoCall(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;
        
        console.log(`Iniciando videochamada com ${appointment.patient}`);
        
        // Navigate to enhanced consultation
        window.location.href = `/enhanced?patient=${appointmentId}&name=${encodeURIComponent(appointment.patient)}`;
    }

    rescheduleAppointment(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;
        
        const newDate = prompt(`Reagendar consulta de ${appointment.patient}\nNova data (DD/MM/AAAA):`);
        const newTime = prompt('Novo horário (HH:MM):');
        
        if (newDate && newTime) {
            // Convert date format
            const [day, month, year] = newDate.split('/');
            const newDateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            appointment.date = newDateFormatted;
            appointment.time = newTime;
            appointment.status = 'Reagendado';
            
            this.renderCalendar();
            this.renderSchedule();
            
            this.showToast(`Consulta reagendada para ${newDate} às ${newTime}`, 'success');
        }
    }

    viewDetails(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;
        
        alert(`Detalhes da Consulta:
        
Paciente: ${appointment.patient}
Especialidade: ${appointment.specialty}
Tipo: ${appointment.type}
Data: ${appointment.date.split('-').reverse().join('/')}
Horário: ${appointment.time}
Status: ${appointment.status}
${appointment.ready ? '\n✅ Paciente conectado e pronto' : '\n⏳ Paciente ainda não conectado'}`);
    }

    openNewAppointmentForm() {
        const patientName = prompt('Nome do paciente:');
        const specialty = prompt('Especialidade:');
        const date = prompt('Data (DD/MM/AAAA):');
        const time = prompt('Horário (HH:MM):');
        
        if (patientName && specialty && date && time) {
            const [day, month, year] = date.split('/');
            const dateFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            const newAppointment = {
                id: Math.max(...this.appointments.map(a => a.id)) + 1,
                date: dateFormatted,
                time: time,
                patient: patientName,
                specialty: specialty,
                status: 'Confirmado',
                ready: false,
                type: 'Consulta'
            };
            
            this.appointments.push(newAppointment);
            this.renderCalendar();
            
            if (this.selectedDate === dateFormatted) {
                this.renderSchedule();
            }
            
            this.showToast('Nova consulta agendada com sucesso!', 'success');
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.toggle.checked = false;
    }

    saveNotificationSettings() {
        const selectedMethods = Array.from(
            document.querySelectorAll('input[name="notificationMethod"]:checked')
        ).map(input => input.value);
        
        // Save to localStorage or send to server
        localStorage.setItem('notificationMethods', JSON.stringify(selectedMethods));
        
        this.closeModal();
        this.showToast(`Notificações configuradas: ${selectedMethods.join(', ')}`, 'success');
    }

    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agenda = new AgendaMedica();
});

console.log('📅 Agenda Médica TeleMed Pro carregada - Sistema Avançado de Consultas');