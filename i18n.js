/* ==========================================================
   i18n.js  —  English / Arabic for the wedding invitation
   - Loaded in <head> so lang + dir are set BEFORE first paint
   - Language priority:
       1) the guest's own choice (EN / عربي button, remembered)
       2) ?lang=ar or ?lang=en in the link
       3) the browser's language list (navigator.languages)
       4) English
   ========================================================== */
(function () {
  'use strict';

  var SUPPORTED = ['en', 'ar'];
  var STORE_KEY = 'wedding-lang';

  var DICT = {
    en: {
      title: 'Shaaban Ghassa & Zaynab Mazloum — Wedding Invitation',
      photoAlt: 'Shaaban Ghassa & Zaynab Mazloum',
      musicAria: 'Toggle background music',
      toggleLabel: 'عربي',
      toggleAria: 'Switch to Arabic',

      // names
      groom: 'Shaaban Ghassa',
      bride: 'Zaynab Mazloum',
      amp: '&',
      monoGroom: 'S',
      monoBride: 'Z',

      // hero
      theWeddingOf: 'the wedding of',
      heroCopy: 'Welcome to our E-Invitation Wedding',
      start: 'Start',

      // envelope
      envelopeAria: 'Open your invitation',
      insertEyebrow: 'Wedding Invitation',
      envelopeInstruction: 'Tap the envelope to open your invitation',

      // verse
      verse: "With grateful hearts and faith in God's plan,<br>we invite you to celebrate the union of",
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',

      // date
      saveDate: 'save the date',
      calMonth: 'December 2026',
      sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat',
      eightPm: "Eight o'clock in the evening",

      // details
      details: 'The Details',
      location: 'Location',
      venue: 'Roche Dorée',
      venueSub: 'Mejdlaya, North Lebanon',
      openMaps: 'Open in Google Maps',
      detailsP1: "Doors open at eight in the evening at Roche Dorée. Dinner is served after the couple's first dance, so a punctual arrival means you won't miss a moment of the celebration.",
      noteAlcohol: "This is an alcohol-free celebration — thank you for honoring the couple's wishes.",
      noteKids: 'We love your little ones, but this evening is adults-only.',

      // rsvp (static)
      kindlyRespond: 'kindly respond',
      beOurGuest: 'Be Our Guest',
      rsvpBefore: 'Please reply before December 1, 2026',
      reserveSeats: 'Reserve Your Seats',

      // map / contact / closing
      findWay: 'find your way',
      openDirections: 'Open directions',
      questionsHelp: 'questions & help',
      getInTouch: 'Get in Touch',
      contactText: 'If you need any help or want to ask anything regarding the celebration, please feel free to reach out.',
      whatsapp: 'WhatsApp',
      seeYou: 'See you there!',

      // rsvp (dynamic)
      welcome: 'Welcome',
      statusAttending: 'Attending',
      statusDeclined: 'Declined',
      loading: 'Loading invitees data...',
      invalidLink: 'Invalid Invitation Link. Please use your unique verification link.',
      readingLink: 'Reading your personal invitation link...',
      alreadyResponded: 'You already responded: {status}',
      confirmPrompt: 'Please confirm your attendance choices below:',
      lookupFailed: 'Invitation data lookup trace failed. Code missing or invalid.',
      networkFail: 'Network configuration pipeline failure. Verify server app deployment rules.',
      accepting: 'Accepting...',
      declining: 'Declining...',
      thanksAttending: 'Thank you! Your attendance has been confirmed.',
      thanksDeclined: 'Thank you for letting us know. You will be missed.',
      saveFailed: 'We could not save your response. Please check your connection and try again, or message us on WhatsApp.',
      btnAccept: 'Accept',
      btnDecline: 'Decline',
      btnUpdate: 'Update Attendance',
      btnUpdateDecline: 'Update to Decline',
      seatMax: "You've hit your maximum allowed limit of <strong>{count}</strong>.",
      seatAllowed: 'Allowed maximum: {count}.',
      waSummary: 'Wedding RSVP Summary:\nName: {name}\nStatus: {status}\nSeats: {seats}'
    },

    ar: {
      title: 'شعبان غصّه و زينب مظلوم — دعوة زفاف',
      photoAlt: 'شعبان غصّه و زينب مظلوم',
      musicAria: 'تشغيل أو إيقاف الموسيقى',
      toggleLabel: 'English',
      toggleAria: 'التبديل إلى الإنجليزية',

      // names
      groom: 'شعبان غصّه',
      bride: 'زينب مظلوم',
      amp: 'و',
      monoGroom: 'ش',
      monoBride: 'ز',

      // hero
      theWeddingOf: 'حفل زفاف',
      heroCopy: 'أهلاً بكم في دعوة زفافنا الإلكترونية',
      start: 'ابدأ',

      // envelope
      envelopeAria: 'افتح دعوتك',
      insertEyebrow: 'دعوة زفاف',
      envelopeInstruction: 'اضغط على المغلّف لفتح دعوتك',

      // verse
      verse: 'وَ مِنْ آياتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْواجاً لِتَسْكُنُوا إِلَيْها وَ جَعَلَ بَيْنَكُمْ مَوَدَّةً وَ رَحْمَةً إِنَّ فِي ذلِكَ لَآياتٍ لِقَوْمٍ يَتَفَكَّرُونَ <br>يسعدنا أن ندعوكم للاحتفال بزفاف',
      days: 'أيام',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثوانٍ',

      // date
      saveDate: '',
      calMonth: 'كانون الأول 2026',
      sun: 'أحد', mon: 'اثنين', tue: 'ثلاثاء', wed: 'أربعاء', thu: 'خميس', fri: 'جمعة', sat: 'سبت',
      eightPm: 'الساعة السابعة مساءً',

      // details
      details: 'التفاصيل',
      location: 'المكان',
      venue: 'روش دوريه',
      venueSub: 'مجدليا، شمال لبنان',
      openMaps: 'افتح في خرائط جوجل',
      detailsP1: 'تُفتح الأبواب عند الساعة السابعة مساءً في روش دوريه. يُقدَّم العشاء بعد الرقصة الأولى للعروسين، فالحضور في الموعد يضمن لكم ألّا تفوتكم أي لحظة من الاحتفال.',
      noteAlcohol: 'هذا الاحتفال خالٍ من المشروبات الكحولية — نشكركم على احترام رغبة العروسين.',
      noteKids: 'نحب أطفالكم كثيرًا، لكن هذه الأمسية للكبار فقط.',

      // rsvp (static)
      kindlyRespond: 'نرجو تأكيد حضوركم',
      beOurGuest: 'كونوا ضيوفنا',
      rsvpBefore: 'يرجى الرد قبل 1 كانون الأول 2026',
      reserveSeats: 'احجزوا مقاعدكم',

      // map / contact / closing
      findWay: 'كيف تصلون إلينا',
      openDirections: 'احصلوا على الاتجاهات',
      questionsHelp: 'أسئلة ومساعدة',
      getInTouch: 'تواصلوا معنا',
      contactText: 'إن احتجتم إلى أي مساعدة أو أردتم الاستفسار عن أي شيء يخص الحفل، فلا تترددوا في التواصل معنا.',
      whatsapp: 'واتساب',
      seeYou: 'بانتظاركم!',

      // rsvp (dynamic)
      welcome: 'أهلاً بكم',
      statusAttending: 'الحضور مؤكَّد',
      statusDeclined: 'تم الاعتذار',
      loading: 'جارٍ تحميل بيانات المدعوين...',
      invalidLink: 'رابط الدعوة غير صالح. يرجى استخدام رابط الدعوة الخاص بكم.',
      readingLink: 'جارٍ قراءة رابط دعوتكم...',
      alreadyResponded: 'تم تسجيل ردّكم مسبقًا: {status}',
      confirmPrompt: 'يرجى تأكيد حضوركم أدناه:',
      lookupFailed: 'تعذّر العثور على دعوتكم. الرمز مفقود أو غير صالح.',
      networkFail: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.',
      accepting: 'جارٍ تأكيد الحضور...',
      declining: 'جارٍ تسجيل الاعتذار...',
      thanksAttending: 'شكرًا لكم! تم تأكيد حضوركم.',
      thanksDeclined: 'شكرًا لإعلامنا. سنفتقدكم.',
      saveFailed: 'تعذّر حفظ ردّكم. يرجى التحقق من الاتصال والمحاولة مجددًا، أو مراسلتنا عبر واتساب.',
      btnAccept: 'تأكيد الحضور',
      btnDecline: 'اعتذار',
      btnUpdate: 'تحديث الحضور',
      btnUpdateDecline: 'تغيير إلى الاعتذار',
      seatMax: 'لقد بلغتم الحد الأقصى المسموح: <strong>{count}</strong>.',
      seatAllowed: 'الحد الأقصى المسموح: {count}.',
      waSummary: 'ملخص الرد على دعوة الزفاف:\nالاسم: {name}\nالحالة: {status}\nعدد المقاعد: {seats}'
    }
  };

  var lang = 'en';

  function detect() {
    var i, code;
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* storage blocked (private mode) — ignore */ }

    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q && SUPPORTED.indexOf(q.toLowerCase()) !== -1) return q.toLowerCase();
    } catch (e) { /* ignore */ }

    var prefs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];
    for (i = 0; i < prefs.length; i++) {
      code = String(prefs[i]).toLowerCase().split('-')[0];   // "ar-LB" -> "ar"
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return 'en';
  }

  function setDocumentDirection() {
    var root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  function t(key, vars) {
    var str = (DICT[lang] && DICT[lang][key] != null) ? DICT[lang][key]
            : (DICT.en[key] != null ? DICT.en[key] : key);
    if (vars) {
      str = str.replace(/\{(\w+)\}/g, function (m, name) {
        return vars[name] != null ? vars[name] : m;
      });
    }
    return lang === 'ar' ? digits(str) : str;   // Arabic page -> Arabic-Indic digits everywhere
  }

  // 0-9  ->  ٠-٩  (only when the page is in Arabic; otherwise returns the text untouched)
  function digits(value) {
    var str = String(value);
    if (lang !== 'ar') return str;
    return str.replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.charAt(d); });
  }

  // Converts the numbers that live in the HTML itself (calendar, dates, phone).
  // The original text of each text node is remembered, so switching back to English restores it.
  var numOriginals = new WeakMap();
  function localizeNumbers() {
    var holders = document.querySelectorAll('[data-num], .calendar-grid > span:not(.day-name)');
    var h, walker, node;
    for (h = 0; h < holders.length; h++) {
      walker = document.createTreeWalker(holders[h], NodeFilter.SHOW_TEXT, null, false);
      while ((node = walker.nextNode())) {
        if (!numOriginals.has(node)) numOriginals.set(node, node.nodeValue);
        node.nodeValue = digits(numOriginals.get(node));
      }
    }
  }

  // "3 seats" / "3 مقاعد"  (withNumber=false -> just the word, for the label under the big number)
  function seats(n, withNumber) {
    n = Number(n) || 0;
    if (lang === 'ar') {
      if (n === 1) return withNumber ? 'مقعد واحد' : 'مقعد';
      if (n === 2) return 'مقعدان';
      if (n >= 3 && n <= 10) return (withNumber ? n + ' ' : '') + 'مقاعد';
      if (n === 0) return 'مقاعد';
      return (withNumber ? n + ' ' : '') + 'مقعدًا';
    }
    if (withNumber) return n + (n === 1 ? ' seat' : ' seats');
    return n === 1 ? 'Seat' : 'Seats';
  }

  function apply() {
    var els, i, el;

    setDocumentDirection();
    document.title = t('title');

    els = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) els[i].textContent = t(els[i].getAttribute('data-i18n'));

    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) els[i].innerHTML = t(els[i].getAttribute('data-i18n-html'));

    els = document.querySelectorAll('[data-i18n-alt]');
    for (i = 0; i < els.length; i++) els[i].setAttribute('alt', t(els[i].getAttribute('data-i18n-alt')));

    els = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < els.length; i++) els[i].setAttribute('aria-label', t(els[i].getAttribute('data-i18n-aria')));

    // the toggle shows the OTHER language, so tag it with that language for screen readers/fonts
    el = document.getElementById('lang-toggle');
    if (el) el.setAttribute('lang', lang === 'ar' ? 'en' : 'ar');

    localizeNumbers();

    document.dispatchEvent(new CustomEvent('wedding:langchange', { detail: { lang: lang } }));
  }

  function set(newLang) {
    if (SUPPORTED.indexOf(newLang) === -1) return;
    lang = newLang;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* ignore */ }
    apply();
  }

  function toggle() { set(lang === 'ar' ? 'en' : 'ar'); }

  // Run immediately (we're in <head>): correct lang/dir before the page paints.
  lang = detect();
  setDocumentDirection();

  window.I18N = {
    t: t,
    digits: digits,
    seats: seats,
    apply: apply,
    set: set,
    toggle: toggle,
    get lang() { return lang; }
  };
})();
