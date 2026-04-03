import { TranslateLoader, TranslationObject, provideTranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

const ES: Record<string, unknown> = {
  COMMON: {
    SAVE: 'Guardar', CANCEL: 'Cancelar', EDIT: 'EDITAR', APPROVE: 'Aprobar', REJECT: 'Rechazar',
    PREVIOUS: 'Anterior', NEXT: 'Siguiente', FINISH: 'Finalizar',
    STEP: 'Paso {{ current }} de {{ total }}',
    SELECTED: 'Seleccionado', SELECT: 'Elegir',
    STORE: 'Tienda', CLUB: 'Club', FREE: 'Gratuita',
    PLAYERS_COUNT: '{{ current }} / {{ max }} jugadores',
    SLOTS_COUNT: '{{ current }} / {{ max }} plazas',
    BACK_TO_LOGIN: 'Volver al inicio de sesión',
  },
  LANGUAGE: { LABEL: 'IDIOMA', ES: 'Español', EN: 'English' },
  NAV: { HOME: 'Inicio', EXPLORE: 'Explorar', CHAT: 'Chat', PROFILE: 'Perfil' },
  LOGIN: {
    SIGN_IN: 'Iniciar sesión', REGISTER: 'Registrarse',
    EMAIL: 'Correo electrónico', EMAIL_PLACEHOLDER: 'tu@email.com', EMAIL_INVALID: 'Introduce un correo válido.',
    PASSWORD: 'Contraseña', PASSWORD_PLACEHOLDER: 'Mínimo 6 caracteres', PASSWORD_MIN: 'Mínimo 6 caracteres.',
    CONFIRM_PASSWORD: 'Repetir contraseña', CONFIRM_PLACEHOLDER: 'Repite la contraseña',
    PASSWORDS_MATCH: 'Las contraseñas deben coincidir.',
    CREATE_ACCOUNT: 'Crear cuenta', ENTER: 'Entrar', FORGOT_PASSWORD: '¿Olvidaste tu contraseña?', OR: 'o',
    CONTINUE_GOOGLE: 'Continuar con Google',
    ERROR_PASSWORDS_MISMATCH: 'Las contraseñas no coinciden.',
    ERROR_GOOGLE: 'No se pudo iniciar sesión con Google.', ERROR_AUTH: 'Error de autenticación.',
  },
  HOME: {
    TITLE: 'Inicio', GREETING: 'Hola, {{ nick }} 👋', READY: '¿Listo para jugar?',
    MY_EVENTS: 'Mis próximas partidas', NO_EVENTS: 'No tienes partidas próximas.', CREATE_GAME: 'Crear partida',
    MY_TOURNAMENTS: 'Mis torneos', NO_TOURNAMENTS: 'No estás inscrito en ningún torneo.',
    EXPLORE_TOURNAMENTS: 'Explorar torneos', DISCOVER: 'Descubrir cerca de ti',
    DISCOVER_SUBTITLE: 'Partidas y torneos próximos en tu zona', SEE_ALL: 'Ver todo',
    NEARBY_PLACES: 'Tiendas y clubs cercanos', NO_PLACES: 'No hay tiendas ni clubs en tu zona todavía.',
    ENTRY_FEE: 'Inscripción: {{ fee }}',
  },
  EXPLORE: {
    TITLE: 'Explorar', SEARCH_PLACEHOLDER: 'Buscar partidas, torneos, juegos...',
    NO_RESULTS: 'No se encontraron resultados para "{{ query }}"',
    GAME_BADGE: 'Partida', TOURNAMENT_BADGE: 'Torneo', VIEW_MAP: 'Ver mapa', VIEW_LIST: 'Ver listado',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Recuperar contraseña',
    SUBTITLE: 'Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.',
    SEND: 'Enviar enlace', SENT_TITLE: 'Revisa tu correo',
    SENT_TEXT: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.',
  },
  RESET_PASSWORD: {
    TITLE: 'Nueva contraseña', SUBTITLE: 'Introduce tu nueva contraseña. Debe tener al menos 8 caracteres.',
    PASSWORD: 'Nueva contraseña', PASSWORD_PLACEHOLDER: 'Mínimo 8 caracteres', PASSWORD_MIN: 'Mínimo 8 caracteres.',
    CONFIRM_PASSWORD: 'Repetir contraseña', CONFIRM_PLACEHOLDER: 'Repite la contraseña',
    CONFIRM_REQUIRED: 'Este campo es obligatorio.', SAVE: 'Guardar contraseña',
    INVALID_TITLE: 'Enlace inválido',
    INVALID_TEXT: 'Este enlace de recuperación no es válido.',
    GO_LOGIN: 'Ir al inicio de sesión', DONE_TITLE: '¡Contraseña actualizada!',
    DONE_TEXT: 'Tu contraseña se ha restablecido correctamente.',
    SIGN_IN: 'Iniciar sesión', ERROR_EXPIRED: 'El enlace es inválido o ha expirado.',
  },
  ONBOARDING: {
    TITLE: 'Bienvenido', STEP_PROFILE: 'Perfil', STEP_GAMES: 'Juegos favoritos', STEP_LOCATION: 'Ubicación',
    ABOUT: 'Sobre ti', NICK: 'Nick de jugador', NICK_PLACEHOLDER: 'Cómo quieres que te vean otros jugadores',
    NAME: 'Nombre', NAME_PLACEHOLDER: 'Tu nombre real', EXPERIENCE: 'Experiencia',
    BEGINNER: 'Principiante', CASUAL: 'Casual', COMPETITIVE: 'Competitivo',
    FAVORITE_GAMES: 'Juegos favoritos', GAMES_HINT: 'Elige al menos un wargame para recomendarte partidas.',
    LOCATION_TITLE: 'Ubicación', LOCATION_HINT: 'Opcional, pero nos ayuda a mostrarte partidas y eventos cerca de ti.',
    USE_LOCATION: 'Usar mi ubicación actual',
    LOCATION_SAVED: 'Ubicación guardada (lat: {{ lat }}, lng: {{ lng }}).',
    ERROR_GEOLOCATION: 'La geolocalización no está disponible en este navegador.',
    ERROR_LOCATION: 'No se pudo obtener tu ubicación.',
    ERROR_ONBOARDING: 'No se pudo completar el onboarding.',
  },
  NEW: {
    TITLE_GAME: 'Nueva Partida', TITLE_EVENT: 'Nuevo Evento',
    TYPE_GAME: '🎲 Partida', TYPE_EVENT: '🎯 Evento', EVENT_KIND_LABEL: 'Tipo de evento *',
    TYPE_TOURNAMENT: '🏆 Torneo', TYPE_CAMPAIGN: '📖 Campaña', TYPE_LEAGUE: '🏅 Liga',
    BADGE_TOURNAMENT: 'Torneo', BADGE_CAMPAIGN: 'Campaña', BADGE_LEAGUE: 'Liga',
    STEP_GAME: 'Juego', STEP_DATE: 'Fecha', STEP_LOCATION: 'Ubicación', STEP_DETAILS: 'Detalles',
    GAME_LABEL_GAME: 'Juego / Sistema *', GAME_LABEL_EVENT: 'Nombre del juego *',
    GAME_PLACEHOLDER: 'Selecciona un wargame',
    EDITION: 'Edición / Sistema (opcional)', EDITION_PLACEHOLDER: 'Ej. 10ª edición, Pathfinder 2e...',
    START_DATE: 'Fecha inicio *', END_DATE: 'Fecha fin (opcional)', TIME: 'Hora (opcional)',
    PLACE: 'Tienda / Club (opcional)', NO_PLACE: 'Sin tienda registrada',
    REGISTER_PLACE: 'Registrar nueva tienda / club',
    PLACE_NAME: 'Nombre del lugar (opcional)', PLACE_NAME_PLACEHOLDER: 'Ej. Club Dragón Rojo, sótano de casa...',
    CITY: 'Ciudad *', CITY_PLACEHOLDER: 'Ej. Madrid, Barcelona...',
    ADDRESS: 'Dirección / Local (opcional)', ADDRESS_PLACEHOLDER: 'Ej. Calle Mayor 12, Club Dragón',
    TITLE_GAME_LABEL: 'Título de la partida *', TITLE_EVENT_LABEL: 'Título del evento *',
    TITLE_PLACEHOLDER: 'Dale un nombre atractivo',
    DESCRIPTION: 'Descripción (opcional)', DESCRIPTION_PLACEHOLDER: 'Cuéntanos más sobre la partida o evento...',
    MAX_PLAYERS: 'Máx. jugadores (opcional)', MAX_PLAYERS_PLACEHOLDER: 'Ej. 6',
    CONTACT: 'Enlace de contacto (opcional)', CONTACT_PLACEHOLDER: 'https:// o https://wa.me/...',
    CREATE_GAME: 'Crear Partida', CREATE_EVENT: 'Crear Evento', ERROR: 'No se pudo crear. Inténtalo de nuevo.',
  },
  MAP: { TITLE: 'Mapa' },
  CHAT: { TITLE: 'Chat', MESSAGES: 'Mensajes y conversaciones' },
  PROFILE: {
    TITLE: 'Perfil', EDIT_HEADER: 'Editar perfil', ACCOUNT_HEADER: 'Cuenta', SETTINGS_HEADER: 'Configuración',
    SETTINGS_TITLE: 'CUENTA', EDIT_PROFILE: 'Perfil', ACCOUNT: 'Cuenta', SUPPORT_TITLE: 'SOPORTE',
    PRIVACY: 'Política de privacidad', TERMS: 'Términos de uso',
    NICK_LABEL: 'Nick de jugador', EXPERIENCE: 'Experiencia',
    BEGINNER: 'Principiante', CASUAL: 'Casual', COMPETITIVE: 'Competitivo', INFO_TITLE: 'INFORMACIÓN',
    LOGOUT: 'Cerrar sesión', DELETE_ACCOUNT: 'Eliminar cuenta',
    DELETE_CONFIRM_HEADER: 'Eliminar cuenta',
    DELETE_CONFIRM_MSG: '¿Estás seguro? Esta acción es irreversible y perderás todos tus datos.',
    DELETE_CONFIRM_BTN: 'Eliminar',
    MY_GAMES: 'Mis partidas', NO_GAMES: 'Aún no has creado ninguna partida.', CREATE_GAME: 'Crear partida',
    EDIT_OVERLAY: 'EDITAR',
  },
  IMAGE_UPLOAD: { UPLOADING: 'Subiendo...', ADD: 'Añadir imagen', CHANGE: 'Cambiar imagen', ERROR: 'Error al subir la imagen' },
  PLACES: {
    NEW_TITLE: 'Nueva tienda / club', NAME_LABEL: 'Nombre *', ADDRESS_LABEL: 'Dirección *',
    CITY_LABEL: 'Ciudad *', SUBMIT: 'Enviar solicitud',
  },
  ADMIN: { PLACES_TITLE: 'Localizaciones pendientes', NO_PENDING: 'No hay localizaciones pendientes de revisión.' },
};

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of(ES as TranslationObject);
  }
}

export function provideTestTranslations() {
  return provideTranslateService({
    lang: 'es',
    loader: { provide: TranslateLoader, useClass: FakeTranslateLoader },
  });
}
