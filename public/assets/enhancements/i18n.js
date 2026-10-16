const translations = Object.freeze({
  en: Object.freeze({
    whatsappLabel: "Message Econs on WhatsApp",
    whatsappTooltip: "Chat on WhatsApp",
    whatsappMessage: "Hello Econs, I would like to book a consultation.",
    backToTop: "Back to top",
    branchMap: "Open Econs location in Google Maps",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    unavailable: "This feature is currently unavailable.",
  }),
  ar: Object.freeze({
    whatsappLabel: "راسل إيكونز عبر واتساب",
    whatsappTooltip: "تحدث معنا عبر واتساب",
    whatsappMessage: "مرحبًا إيكونز، أرغب في حجز استشارة.",
    backToTop: "العودة إلى الأعلى",
    branchMap: "افتح موقع إيكونز في خرائط Google",
    emailRequired: "أدخل بريدك الإلكتروني.",
    emailInvalid: "أدخل بريدًا إلكترونيًا صالحًا.",
    unavailable: "هذه الميزة غير متاحة حاليًا.",
  }),
});

export function getLocale() {
  return document.documentElement.lang?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

export function getTranslations() {
  return translations[getLocale()];
}
