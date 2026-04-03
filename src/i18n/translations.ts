export type Lang = "en" | "ar";

export const translations = {
  // Navbar
  services: { en: "Services", ar: "الخدمات" },
  about: { en: "About", ar: "من نحن" },
  myBookings: { en: "My Bookings", ar: "حجوزاتي" },
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة التحكم" },
  bookNow: { en: "Book Now", ar: "احجز الآن" },
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج" },

  // Hero
  heroSubtitle: { en: "Alexandria, Egypt", ar: "الإسكندرية، مصر" },
  heroDescription: {
    en: "Premium grooming experience in Alexandria. Classic cuts, modern style.",
    ar: "تجربة حلاقة فاخرة في الإسكندرية. قصات كلاسيكية، أسلوب عصري.",
  },
  bookAppointment: { en: "Book Your Appointment", ar: "احجز موعدك" },

  // Services
  whatWeOffer: { en: "What We Offer", ar: "ما نقدمه" },
  ourServices: { en: "Our Services", ar: "خدماتنا" },
  min: { en: "min", ar: "دقيقة" },

  // About
  aboutUs: { en: "About Us", ar: "من نحن" },
  aboutDescription: {
    en: "Located in Alexandria, we bring together traditional barbering craftsmanship with modern grooming techniques. Every visit is an experience — from the hot towel to the final touch.",
    ar: "يقع في الإسكندرية، نجمع بين حرفية الحلاقة التقليدية وتقنيات العناية الحديثة. كل زيارة هي تجربة — من المنشفة الساخنة إلى اللمسة الأخيرة.",
  },
  location: { en: "Location", ar: "الموقع" },
  hours: { en: "Hours", ar: "ساعات العمل" },
  hoursDetail: {
    en: "Sat – Thu: 10AM – 10PM\nFriday: 2PM – 10PM",
    ar: "السبت – الخميس: 10ص – 10م\nالجمعة: 2م – 10م",
  },
  contact: { en: "Contact", ar: "اتصل بنا" },
  followUs: { en: "Follow Us", ar: "تابعنا" },

  // Auth
  createAccount: { en: "Create Account", ar: "إنشاء حساب" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  password: { en: "Password", ar: "كلمة المرور" },
  signUp: { en: "Sign Up", ar: "إنشاء حساب" },
  alreadyHaveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  dontHaveAccount: { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
  pleaseWait: { en: "Please wait...", ar: "يرجى الانتظار..." },
  accountCreated: { en: "Account created!", ar: "تم إنشاء الحساب!" },
  checkEmail: { en: "Please check your email to verify.", ar: "يرجى التحقق من بريدك الإلكتروني." },
  welcomeBack: { en: "Welcome back!", ar: "مرحباً بعودتك!" },
  error: { en: "Error", ar: "خطأ" },

  // Booking
  bookAppointmentTitle: { en: "Book Appointment", ar: "حجز موعد" },
  service: { en: "Service", ar: "الخدمة" },
  selectService: { en: "Select a service", ar: "اختر خدمة" },
  date: { en: "Date", ar: "التاريخ" },
  time: { en: "Time", ar: "الوقت" },
  selectTime: { en: "Select a time", ar: "اختر وقتاً" },
  notesOptional: { en: "Notes (optional)", ar: "ملاحظات (اختياري)" },
  notesPlaceholder: { en: "Any special requests...", ar: "أي طلبات خاصة..." },
  booking: { en: "Booking...", ar: "جاري الحجز..." },
  confirmBooking: { en: "Confirm Booking", ar: "تأكيد الحجز" },
  booked: { en: "Booked!", ar: "تم الحجز!" },
  appointmentConfirmed: { en: "Your appointment has been confirmed.", ar: "تم تأكيد موعدك." },
  bookingFailed: { en: "Booking failed", ar: "فشل الحجز" },

  // My Bookings
  noBookings: { en: "No bookings yet.", ar: "لا توجد حجوزات بعد." },
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  cancel: { en: "Cancel", ar: "إلغاء" },
  bookingCancelled: { en: "Booking cancelled", ar: "تم إلغاء الحجز" },

  // Footer
  footerText: {
    en: "Kral Salon — Alexandria, Egypt.",
    ar: "كرال صالون — الإسكندرية، مصر.",
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
