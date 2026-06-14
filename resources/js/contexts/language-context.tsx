import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'en' | 'tl';

type Translations = Record<string, { en: string; tl: string }>;

// All translatable strings for patient pages
const translations: Translations = {
    // Dashboard
    'welcome_to': { en: 'Welcome to', tl: 'Maligayang pagdating sa' },
    'clinic_subtitle': { en: 'Ballogdajan Medical Clinic — Integrated Online Appointment, Patient Record & Inventory Management System', tl: 'Ballogdajan Medical Clinic — Pinagsama-samang Online Appointment, Patient Record at Inventory Management System' },
    'logged_in_as': { en: 'Logged in as', tl: 'Naka-log in bilang' },
    'appointments_today': { en: 'Appointments Today', tl: 'Mga Appointment Ngayon' },
    'patient_records': { en: 'Patient Records', tl: 'Mga Rekord ng Pasyente' },
    'inventory_items': { en: 'Inventory Items', tl: 'Mga Gamit sa Imbentaryo' },
    'notifications': { en: 'Notifications', tl: 'Mga Abiso' },
    'doctor': { en: 'Doctor', tl: 'Doktor' },
    'secretary': { en: 'Secretary', tl: 'Sekretarya' },
    'pharmacist': { en: 'Pharmacist', tl: 'Parmaseutiko' },
    'patient': { en: 'Patient', tl: 'Pasyente' },

    // Book Appointment page
    'book_appointment': { en: 'Book Appointment', tl: 'Mag-book ng Appointment' },
    'hi': { en: 'Hi', tl: 'Kumusta' },
    'choose_available_date': { en: 'Choose an available date and session below. First come, first served.', tl: 'Pumili ng available na petsa at session sa ibaba. Unang dating, unang serbisyo.' },
    'available_slots': { en: 'Available Slots', tl: 'Mga Available na Slot' },
    'dates_available': { en: 'dates available', tl: 'mga petsang available' },
    'no_available_schedules': { en: 'No available schedules', tl: 'Walang available na schedule' },
    'check_back_later': { en: 'Check back later for new openings.', tl: 'Bumalik mamaya para sa mga bagong bukas.' },
    'morning': { en: 'Morning', tl: 'Umaga' },
    'afternoon': { en: 'Afternoon', tl: 'Hapon' },
    'left': { en: 'left', tl: 'natitira' },
    'my_appointments': { en: 'My Appointments', tl: 'Mga Appointment Ko' },
    'session': { en: 'session', tl: 'sesyon' },
    'reason': { en: 'Reason', tl: 'Dahilan' },
    'queue': { en: 'Queue', tl: 'Pila' },

    // Booking Modal
    'confirm_booking': { en: 'Confirm Booking', tl: 'Kumpirmahin ang Booking' },
    'reason_for_visit': { en: 'Reason for Visit', tl: 'Dahilan ng Pagbisita' },
    'contact_number': { en: 'Contact Number', tl: 'Numero ng Telepono' },
    'symptoms': { en: 'Symptoms', tl: 'Mga Sintomas' },
    'allergies': { en: 'Allergies', tl: 'Mga Allergy' },
    'current_medication': { en: 'Current Medication', tl: 'Kasalukuyang Gamot' },
    'temperature': { en: 'Temperature', tl: 'Temperatura' },
    'blood_pressure': { en: 'Blood Pressure', tl: 'Presyon ng Dugo' },
    'weight_kg': { en: 'Weight (kg)', tl: 'Timbang (kg)' },
    'medical_history': { en: 'Medical History', tl: 'Kasaysayan ng Medikal' },
    'priority_type': { en: 'Priority Type', tl: 'Uri ng Priyoridad' },
    'regular': { en: 'Regular', tl: 'Regular' },
    'senior_citizen': { en: 'Senior Citizen (60+)', tl: 'Senior Citizen (60+)' },
    'pwd': { en: 'Person with Disability', tl: 'Taong may Kapansanan' },
    'pregnant': { en: 'Pregnant', tl: 'Buntis' },
    'priority_note': { en: 'Priority patients are served first.', tl: 'Ang mga priority na pasyente ay unang sineserbisyuhan.' },
    'additional_notes': { en: 'Additional Notes', tl: 'Karagdagang Tala' },
    'booking': { en: 'Booking...', tl: 'Binu-book...' },
    'confirm_booking_btn': { en: 'Confirm Booking', tl: 'Kumpirmahin ang Booking' },

    // Placeholders
    'placeholder_reason': { en: 'e.g., General checkup', tl: 'hal., Pangkalahatang checkup' },
    'placeholder_contact': { en: '09XX-XXX-XXXX', tl: '09XX-XXX-XXXX' },
    'placeholder_symptoms': { en: 'e.g., Headache, fever, cough', tl: 'hal., Sakit ng ulo, lagnat, ubo' },
    'placeholder_allergies': { en: 'e.g., Penicillin, seafood', tl: 'hal., Penicillin, pagkaing-dagat' },
    'placeholder_medication': { en: 'e.g., Metformin 500mg', tl: 'hal., Metformin 500mg' },
    'placeholder_history': { en: 'Previous surgeries, conditions...', tl: 'Mga nakaraang operasyon, kondisyon...' },
    'placeholder_notes': { en: 'Any special requests...', tl: 'Anumang espesyal na kahilingan...' },

    // Statuses
    'pending': { en: 'pending', tl: 'naghihintay' },
    'confirmed': { en: 'confirmed', tl: 'nakumpirma' },
    'completed': { en: 'completed', tl: 'tapos na' },
    'cancelled': { en: 'cancelled', tl: 'kinansela' },
    'no_show': { en: 'no show', tl: 'hindi dumating' },
    'not_arrived': { en: 'not arrived', tl: 'hindi pa dumating' },

    // Sidebar navigation
    'dashboard': { en: 'Dashboard', tl: 'Dashboard' },

    // Patient Dashboard
    'welcome_back': { en: 'Welcome back,', tl: 'Maligayang pagbabalik,' },
    'dashboard_subtitle': { en: 'Manage your appointments, check your queue status, and leave feedback — all in one place.', tl: 'Pamahalaan ang iyong mga appointment, tingnan ang iyong pila, at mag-iwan ng feedback — lahat sa isang lugar.' },
    'upcoming': { en: 'Upcoming', tl: 'Paparating' },
    'feedback_given': { en: 'Feedback Given', tl: 'Ibinigay na Feedback' },
    'next_appointment': { en: 'Next Appointment', tl: 'Susunod na Appointment' },
    'queue_status': { en: 'Queue Status', tl: 'Katayuan ng Pila' },
    'no_upcoming_appointments': { en: 'No upcoming appointments', tl: 'Walang paparating na appointment' },
    'book_one_now': { en: 'Book one now', tl: 'Mag-book na ngayon' },
    'recent_appointments': { en: 'Recent Appointments', tl: 'Mga Kamakailang Appointment' },
    'view_all': { en: 'View all →', tl: 'Tingnan lahat →' },
    'no_appointments_yet': { en: 'No appointments yet', tl: 'Wala pang mga appointment' },
    'schedule_new_visit': { en: 'Schedule a new visit', tl: 'Mag-schedule ng bagong bisita' },
    'check_your_position': { en: 'Check your position', tl: 'Tingnan ang iyong posisyon' },
    'rate_your_visits': { en: 'Rate your visits', tl: 'I-rate ang iyong mga bisita' },
    'feedback': { en: 'Feedback', tl: 'Feedback' },

    // Queue Status page
    'queue_status_title': { en: 'Queue Status', tl: 'Katayuan ng Pila' },
    'queue_subtitle': { en: 'Your position in the upcoming appointment queue', tl: 'Ang iyong posisyon sa paparating na pila ng appointment' },
    'refresh': { en: 'Refresh', tl: 'I-refresh' },
    'no_upcoming_appointment': { en: 'No upcoming appointment', tl: 'Walang paparating na appointment' },
    'no_pending_appointments': { en: "You don't have any pending or confirmed appointments.", tl: 'Wala kang pending o nakumpirmang appointment.' },
    'your_position': { en: 'Your Position', tl: 'Ang Iyong Posisyon' },
    'youre_next': { en: "You're next!", tl: 'Ikaw na ang susunod!' },
    'patients_ahead': { en: 'patient(s) ahead of you', tl: 'pasyente ang nasa unahan mo' },
    'am_session': { en: 'AM Session', tl: 'Sesyon ng Umaga' },
    'pm_session': { en: 'PM Session', tl: 'Sesyon ng Hapon' },
    'patients_in_queue': { en: 'patients in queue', tl: 'mga pasyente sa pila' },
    'you': { en: 'You', tl: 'Ikaw' },

    // Feedback page
    'feedback_title': { en: 'Feedback', tl: 'Feedback' },
    'feedback_subtitle': { en: 'Rate and comment on your completed appointments', tl: 'Mag-rate at mag-komento sa iyong mga natapos na appointment' },
    'no_completed_appointments': { en: 'No completed appointments yet', tl: 'Wala pang natapos na appointment' },
    'completed_feedback_note': { en: 'Once you complete an appointment, you can leave feedback here.', tl: 'Kapag nakumpleto mo na ang isang appointment, maaari kang mag-iwan ng feedback dito.' },
    'edit': { en: 'Edit', tl: 'I-edit' },
    'rate': { en: 'Rate', tl: 'I-rate' },
    'rate_your_visit': { en: 'Rate Your Visit', tl: 'I-rate ang Iyong Bisita' },
    'how_was_experience': { en: 'How was your experience?', tl: 'Kumusta ang iyong karanasan?' },
    'poor': { en: 'Poor', tl: 'Mahina' },
    'fair': { en: 'Fair', tl: 'Katamtaman' },
    'good': { en: 'Good', tl: 'Mabuti' },
    'very_good': { en: 'Very Good', tl: 'Napakabuti' },
    'excellent': { en: 'Excellent', tl: 'Mahusay' },
    'comment_optional': { en: 'Comment (optional)', tl: 'Komento (opsyonal)' },
    'share_experience': { en: 'Share your experience...', tl: 'Ibahagi ang iyong karanasan...' },
    'cancel': { en: 'Cancel', tl: 'Kanselahin' },
    'submit_feedback': { en: 'Submit Feedback', tl: 'Isumite ang Feedback' },
    'submitting': { en: 'Submitting...', tl: 'Isinusumite...' },
};

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('healthwise-language') as Language) || 'en';
        }
        return 'en';
    });

    const handleSetLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('healthwise-language', lang);
    }, []);

    const toggleLanguage = useCallback(() => {
        handleSetLanguage(language === 'en' ? 'tl' : 'en');
    }, [language, handleSetLanguage]);

    const t = useCallback((key: string): string => {
        const entry = translations[key];
        if (!entry) return key;
        return entry[language];
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
