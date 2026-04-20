export type Lang = "en" | "ar";

export const translations = {
  // Navbar
  services: { en: "Our Services", ar: "خدمتنا" },
  barbers: { en: "The Barbers", ar: "الحلاقون" },
  masterpiece: { en: "Masterpiece", ar: "النموذج" },
  about: { en: "About", ar: "من نحن" },
  myBookings: { en: "My Bookings", ar: "حجوزاتي" },
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة التحكم" },
  bookNow: { en: "Book Now", ar: "احجز الآن" },
  bookWithMe: { en: "Book with me", ar: "احجز معي" },
  meetTheTeam: { en: "Meet the Team", ar: "تعرف على الفريق" },
  recentWork: { en: "Recent Work", ar: "أعمالنا الأخيرة" },
  viewMoreOnInstagram: { en: "View more on Instagram", ar: "المزيد على إنستغرام" },
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  signOut: { en: "Sign Out", ar: "تسجيل الخروج" },

  // Hero
  heroSubtitle: { en: "Alexandria, Egypt", ar: "الإسكندرية، مصر" },
  heroDescription: {
    en: "Premium grooming experience in Alexandria. Classic cuts, modern style.",
    ar: "تجربة حلاقة فاخرة في الإسكندرية. قصات كلاسيكية، أسلوب عصري.",
  },
  bookAppointment: { en: "Book Your Appointment", ar: "احجز موعدك" },

  // Barbers
  chooseBarber: { en: "Choose a Barber (optional)", ar: "اختر حلاق (اختياري)" },
  anyBarber: { en: "Any available barber", ar: "أي حلاق متاح" },

  // Services
  whatWeOffer: { en: "What We Offer", ar: "ما نقدمه" },
  ourServices: { en: "Our Services", ar: "خدمتنا" },
  min: { en: "min", ar: "دقيقة" },

  // About
  aboutUs: { en: "About Us", ar: "من نحن" },
  waitingForYou: { en: "We are waiting for you", ar: "نحن في انتظارك" },
  exclusiveExperience: { en: "An Exclusive Experience", ar: "تجربة حصرية" },
  exclusive: { en: "Exclusive", ar: "حصرية" },
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
  openInGoogleMaps: { en: "Open in Google Maps", ar: "الفتح في خرائط جوجل" },

  // Auth
  createAccount: { en: "Create Account", ar: "إنشاء حساب" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  age: { en: "Age", ar: "العمر" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
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
  rateLimitTitle: { en: "Too many attempts", ar: "محاولات كثيرة جداً" },
  rateLimitDesc: { en: "Please wait a minute before trying again.", ar: "يرجى الانتظار دقيقة قبل المحاولة مرة أخرى." },
  emailNotConfirmedTitle: { en: "Email not confirmed", ar: "لم يتم تأكيد البريد الإلكتروني" },
  emailNotConfirmedDesc: {
    en: "Your email has not been confirmed. Ask the site admin to disable 'Confirm Email' in the Supabase Dashboard (Authentication → Providers → Email), or check your inbox for a verification link.",
    ar: "لم يتم تأكيد بريدك الإلكتروني. اطلب من مسؤول الموقع تعطيل 'تأكيد البريد الإلكتروني' في لوحة تحكم Supabase (المصادقة ← الموفرين ← البريد الإلكتروني)، أو تحقق من بريدك الوارد للحصول على رابط التحقق.",
  },

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
  appointmentConfirmed: { en: "Your appointment request has been submitted. We'll review it shortly.", ar: "تم إرسال طلب موعدك. سنراجعه قريباً." },
  bookingFailed: { en: "Booking failed", ar: "فشل الحجز" },
  exploreServices: { en: "Explore Our Services", ar: "استكشف خدماتنا" },

  // Statuses
  statusPending: { en: "Pending Review", ar: "قيد المراجعة" },
  statusAccepted: { en: "Accepted", ar: "مقبول" },
  statusConfirmed: { en: "Confirmed", ar: "مؤكد" },
  statusCompleted: { en: "Completed", ar: "مكتمل" },
  statusCancelled: { en: "Cancelled", ar: "ملغي" },
  statusRejected: { en: "Rejected", ar: "مرفوض" },
  rejectionReason: { en: "Rejection Reason", ar: "سبب الرفض" },
  rejectionReasonPlaceholder: { en: "e.g. Fully booked at this time...", ar: "مثال: محجوز بالكامل في هذا الوقت..." },
  reject: { en: "Reject", ar: "رفض" },
  accept: { en: "Accept", ar: "قبول" },
  complete: { en: "Complete", ar: "إكمال" },
  walkIn: { en: "Walk-in", ar: "حضور مباشر" },
  walkInAr: { en: "Walk-in", ar: "حضور مباشر" },
  addWalkin: { en: "+ Add Walk-in", ar: "+ إضافة حضور مباشر" },
  addWalkinTitle: { en: "Add Walk-in Appointment", ar: "إضافة موعد حضور مباشر" },
  trackMyBooking: { en: "Track My Booking", ar: "تتبع حجزي" },
  enterPhone: { en: "Enter your phone number", ar: "أدخل رقم هاتفك" },
  search: { en: "Search", ar: "بحث" },
  yourAppointments: { en: "Your Appointments", ar: "مواعيدك" },
  noAppointmentsFound: { en: "No appointments found for this number.", ar: "لم يتم العثور على مواعيد لهذا الرقم." },

  // My Bookings
  noBookings: { en: "No bookings yet.", ar: "لا توجد حجوزات بعد." },
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  cancel: { en: "Cancel", ar: "إلغاء" },
  bookingCancelled: { en: "Booking cancelled", ar: "تم إلغاء الحجز" },

  // Experience
  expBio1: { en: "\"A glimpse into the premium industrial grooming experience we deliver every day. ", ar: "\"لمحة عن تجربة العناية الفاخرة التي نقدمها كل يوم. " },
  expBio2: { en: "Precision", ar: "دقة" },
  expBio3: { en: " in motion.\"", ar: " في الحركة.\"" },
  expFeature1Title: { en: "Ultimate Convenience", ar: "الراحة التامة" },
  expFeature1Desc: { en: "Book your perfect look anytime, anywhere — no calls, no waiting.", ar: "احجز مظهرك المثالي في أي وقت وفي أي مكان — بدون مكالمات، بدون انتظار." },
  expFeature2Title: { en: "Absolute Hygiene", ar: "نظافة مطلقة" },
  expFeature2Desc: { en: "Hospital-grade sanitation with single-use tools on every visit.", ar: "تعقيم على مستوى المستشفيات مع أدوات ذات استخدام واحد في كل زيارة." },
  expFeature3Title: { en: "Flexible Scheduling", ar: "مواعيد مرنة" },
  expFeature3Desc: { en: "Morning, noon, or night — we work around your schedule.", ar: "صباحاً، ظهراً، أو ليلاً — نحن نعمل وفقاً لجدولك." },
  expFeature4Title: { en: "Trusted Experts", ar: "خبراء موثوقون" },
  expFeature4Desc: { en: "Hand-picked master barbers with years of premium experience.", ar: "حلاقون خبراء مختارون بعناية مع سنوات من الخبرة الفاخرة." },
  howItWorks: { en: "How It Works", ar: "كيف تعمل" },
  effortless: { en: "Effortless", ar: "بسهولة" },
  bookingWord: { en: "Booking", ar: "الحجز" },
  expStep1Title: { en: "Explore Experts", ar: "استكشف الخبراء" },
  expStep1Desc: { en: "Browse profiles and pick a master barber that matches your style.", ar: "تصفح الملفات الشخصية واختر الحلاق الخبير الذي يتناسب مع أسلوبك." },
  expStep2Title: { en: "Choose Time", ar: "اختر الوقت" },
  expStep2Desc: { en: "Select your desired service and slot.", ar: "حدد الخدمة والوقت الذي تريده." },
  expStep3Title: { en: "Instant Confirmation", ar: "تأكيد فوري" },
  expStep3Desc: { en: "Sit back and relax. Your experience is secured.", ar: "استرخِ وارتاح. تجربتك مضمونة." },

  // Footer
  footerText: {
    en: "Kral Salon — Alexandria, Egypt.",
    ar: "كرال صالون — الإسكندرية، مصر.",
  },

  // Premium Service
  premiumService: { en: "Premium Service", ar: "خدمة مميزة" },
  groomingAtHome: { en: "Grooming at Home", ar: "حلاقة في المنزل" },
  mobileSanctuary: { en: "The Mobile Sanctuary", ar: "الملاذ المتنقل" },
  mobileSanctuaryDesc: {
    en: "Experience the pinnacle of grooming without leaving your domain. Kral Salon brings the exclusive barbering experience directly to your door.",
    ar: "استمتع بقمة العناية دون مغادرة مكانك. يقدم صالون كرال تجربة الحلاقة الحصرية مباشرة إلى باب منزلك.",
  },
  step1Title: { en: "I. Secure the Slot", ar: "أولاً: احجز موعدك" },
  step1Desc: {
    en: "Select your preferred time and barber. Let us know your location in Alexandria.",
    ar: "اختر الوقت المفضل لديك والحلاق. أخبرنا بموقعك في الإسكندرية.",
  },
  step2Title: { en: "II. The Arrival", ar: "ثانياً: الوصول" },
  step2Desc: {
    en: "Our master barber arrives with our premium mobile setup, respecting your privacy.",
    ar: "يصل حلاقنا الماهر مع تجهيزاتنا المتنقلة الفاخرة، مع احترام خصوصيتك.",
  },
  step3Title: { en: "III. The Transformation", ar: "ثالثاً: التحول" },
  step3Desc: {
    en: "Enjoy a flawless cut, hot towel shave, and grooming in your own sanctuary.",
    ar: "استمتع بقصة شعر مثالية، وحلاقة بالمنشفة الساخنة، والعناية في ملاذك الخاص.",
  },
  bookHomeService: { en: "Book Home Service", ar: "احجز خدمة منزلية" },
  premiumServiceTitle: { en: "The Sovereign Mobile Experience", ar: "تجربة السيادة المتنقلة" },
  premiumServiceBio: {
    en: "Exclusivity delivered to your doorstep. We bring the full industrial sanctuary setup to your home or office. Experience the pinnacle of grooming without the commute.",
    ar: "التميز يصل إلى باب منزلك. نحضر التجهيزات الصناعية الكاملة إلى منزلك أو مكتبك. استمتع بقمة الحلاقة دون الحاجة للتنقل.",
  },
  requestHomeService: { en: "Request Home Service", ar: "طلب خدمة منزلية" },
  premiumGroomingAtHome: { en: "Premium Grooming at Home", ar: "حلاقة مميزة في المنزل" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
