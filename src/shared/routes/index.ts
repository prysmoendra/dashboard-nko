/**
 * Application route constants
 * Centralized route management for the dashboard-nko application
 */

const PATHS = {
  HOME: "/",
  PLANS: "/plans",
  COURSES: "/courses",

  PROTECTED: {
    DASHBOARD: "/dashboard",
    USER: "/dashboard/user",
    LOGOUT: "/auth/logout",

    // // Partner
    // PARTNER: "/dashboard/partners",
    // PARTNER_CREATE: "/dashboard/partners/create",
    // PARTNER_EDIT: (id: string) => `/dashboard/partners/${id}/edit`,
    // PARTNER_VIEW: (id: string) => `/dashboard/partners/${id}`,

    // // Assessment
    // ASSESSMENT: "/dashboard/assessments",
    // ASSESSMENT_CREATE: "/dashboard/assessments/create",
    // ASSESSMENT_EDIT: (id: string) => `/dashboard/assessments/${id}/edit`,
    // ASSESSMENT_VIEW: (id: string) => `/dashboard/assessments/${id}`,

    // // Event
    // EVENT: "/dashboard/events",
    // EVENT_CREATE: "/dashboard/events/create",
    // EVENT_EDIT: (id: string) => `/dashboard/events/${id}/edit`,
    // EVENT_VIEW: (id: string) => `/dashboard/events/${id}`,

    // // Assessment Questions
    // ASSESSMENT_QUESTIONS: "/dashboard/assessments/questions",
    // ASSESSMENT_QUESTION_CREATE: "/dashboard/assessments/questions/create",
    // ASSESSMENT_QUESTION_EDIT: (id: string) => `/dashboard/assessments/questions/${id}/edit`,
    // ASSESSMENT_QUESTION_VIEW: (id: string) => `/dashboard/assessments/questions/${id}`,

    // // Event Categories
    // EVENT_CATEGORIES: "/dashboard/event-categories",
    // EVENT_CATEGORY_CREATE: "/dashboard/event-categories/create",
    // EVENT_CATEGORY_EDIT: (id: string) => `/dashboard/event-categories/${id}/edit`,
    // EVENT_CATEGORY_VIEW: (id: string) => `/dashboard/event-categories/${id}`,
  },

  PUBLIC: {
    AUTH: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
};

/**
 * Auth route constants
 * Used for authentication-related navigation
 */
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
} as const;

/**
 * Dashboard route constants
 */
export const DASHBOARD_ROUTES = {
  ROOT: "/dashboard",
  PEGAWAI: "/dashboard/pegawai",
  ASKBID: "/dashboard/askbid",
  ASKBID_INSTRUKSI: "/dashboard/askbid/instruksi",
  KEPALA_BIDANG: "/dashboard/kabid",
  INPUT_KINERJA: "/dashboard/pegawai/input-kinerja",
} as const;

export default PATHS;

