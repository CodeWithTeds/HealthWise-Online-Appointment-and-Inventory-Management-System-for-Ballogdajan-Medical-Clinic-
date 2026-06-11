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

    // Sidebar navigation
    'dashboard': { en: 'Dashboard', tl: 'Dashboard' },
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
