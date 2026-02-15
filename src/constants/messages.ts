// src/constants/messages.ts

// Cancel Message
export const CANCEL_PROCESS_MESSAGE = "Cancelar proceso"

// Confirmation messages
export const CONFIRMATION_MESSAGE = "Confirmar cita"
export const REAGENDATION_MESSAGE = "Reagendar cita"
export const CANCEL_MESSAGE = "Cancelar cita"
export const NO_REAGENDATION_MESSAGE = "No reagendar cita"

// Confirmation constants
export const CONFIRMATION_CONSTANTS = [
    CONFIRMATION_MESSAGE,
    REAGENDATION_MESSAGE,
    CANCEL_MESSAGE,
    NO_REAGENDATION_MESSAGE
]

// Response messages
export const WELCOME_MESSAGE = '¡Hola! Soy tu asistente de agendación. 👋';
export const INSTRUCTIONS_MESSAGE = "¡Excelente! Tu cita ha sido confirmada. Recuerda llegar 10 minutos antes. Te esperamos."
export const ASK_REAGENDATION_MESSAGE = "¿Deseas reagendar tu cita para otra fecha?"
export const CLOSING_MESSAGE = "Estaremos encantados de verte cuando gustes."

// Scheduling messages
export const CUTOFF_TIME = '13:00';
export const CUTOFF_TIME_NOCTURN = '18:00';

// IdleState messages
// Appointment branch
export const TITLE_SERVICES_MESSAGE = "Servicios Disponibles"
export const BUTTON_SERVICES_MESSAGE = "Ver Servicios"
export const ASK_SERVICE_MESSAGE = "¿Qué servicio deseas agendar?"

// SelectServiceState messages
export const NO_SERVICE_MESSAGE = "No se encontró el servicio"
export const ASK_DAY_MESSAGE = "¿Para qué día te gustaría agendar? (Ejemplo: Mañana, Lunes, o una fecha AAAA-MM-DD)"
export const TITLE_DAYS_MESSAGE = "Días disponibles"
export const BUTTON_DAYS_MESSAGE = "Ver días"
export const DESCRIPTION_DAYS_MESSAGE = "Haz clic para seleccionar"

// SelectTurnState messages
export const ASK_TURN_AGAIN_MESSAGE = "Por favor selecciona el turno deseado"
export const ASK_TURN_MESSAGE = "¿Para qué turno te gustaría agendar?"
export const TITLE_TURN_MESSAGE = "Turnos disponibles"
export const BUTTON_TURN_MESSAGE = "Ver turnos"
export const DESCRIPTION_TURN_MESSAGE = "Haz clic para seleccionar"

// SelectDayState messages
export const ASK_TIME_AGAIN_MESSAGE = "Por favor selecciona el horario deseado"
export const ASK_TIME_MESSAGE = "¿Para qué horario te gustaría agendar?"
export const TITLE_TIME_MESSAGE = "Horarios disponibles"
export const BUTTON_TIME_MESSAGE = "Ver horarios"
export const DESCRIPTION_TIME_MESSAGE = "Haz clic para seleccionar"

// SelectTimeState messages
export const ASK_NAME_MESSAGE = "Para finalizar, ¿podrías decirme tu nombre completo?"
export const ASK_NAME_AGAIN_MESSAGE = "Por favor ingresa un nombre válido para la cita."
export const BACK_TO_TIME_MESSAGE = "Volver al menú de horarios"

// CollectNameState messages
export const BACK_TO_NAME_MESSAGE = "Volver al menú de nombres"
export const APPOINTMENT_COMPLETE_MESSAGE = "Su cita con {{serviceName}} ha sido agendada con exito, datos de la cita: {{date}} a las {{time}}"
export const REQUEST_NAME_AGAIN_MESSAGE = "Ingresa tu nombre de nuevo:"

export const BACK_TO_SERVICE_MESSAGE = "Volver al menú de servicios"
export const ASK_DAY_AGAIN_MESSAGE = "Por favor selecciona la fecha deseada"
export const BACK_TO_DAY_MESSAGE = "Volver al menú de días"
export const BACK_TO_TURN_MESSAGE = "Volver al menú de turnos"
export const CONFIRMATION_APPOINTMENT_MESSAGE = "¡Casi terminamos!"
export const COMPLETED_APPOINTMENT_MESSAGE = "Cita agendada con éxito 🎉"
export const NO_APPOINTMENT_MESSAGE = "Agendación cancelada"
export const CONFIRMATION_APPOINTMENT_BY_USER = "Sí, agendar"
export const CANCEL_APPOINTMENT_BY_USER = "No, cancelar"
export const CANCEL_APPOINTMENT_BUTTON = "Cancelar cita"

// Code constants
export const CODE_PREFIX = "CODE:"

// ACTIONS
export const INITIAL_ACTION = "LIST_SERVICES";
