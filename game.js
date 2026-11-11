/* =====================================================================
   БУРМАЛДА: MELSTROY CLICKER — game.js (v2: система «ИМПЕРИЯ»)
   Модули:
   CONFIG, GAME_CONFIG, PHRASES — весь баланс в одном месте
   Utils, AssetManager, AudioManager
   GameState, SaveSystem
   Economy      — доход, уровни, выигрыши/проигрыши крутки
   Upgrades     — магазин кликера (4 улучшения)
   Achievements
   EmpireSystem — здания, внутренние улучшения, секреты
   RandomEvents, DailyReward
   YandexSDK, Ads
   UI, Game
   ===================================================================== */

/** Идентификатор сборки. Должен совпадать с <meta name="build"> и ?v= в index.html (проверяется при запуске). */
const BUILD_ID = '2026-10-14-a';

/* =====================================================================
   i18n — язык интерфейса: RU / EN (выбор в «ЕЩЁ → Настройки», хранится в localStorage)
   Русские строки в коде оборачиваются в __t('...') / __tt`...`; словарь — I18N_EN (ключ = русский текст).
   Новую строку добавляй в код как обычно и допиши перевод в I18N_EN. Без перевода показывается русский.
   ===================================================================== */
const LANG = (function () {
  try { const s = localStorage.getItem('burmalda_lang'); if (s === 'ru' || s === 'en') return s; } catch (e) { /* ignore */ }
  const nav = String((typeof navigator !== 'undefined' && navigator.language) || 'ru').toLowerCase();
  return /^(ru|uk|be|kk)/.test(nav) ? 'ru' : 'en';
})();
const DEC = LANG === 'en' ? '.' : ',';
const I18N_EN = {
"БУРМАЛДА: MELSTROY CLICKER": "BURMALDA: MELSTROY CLICKER",
"Мемный idle-кликер с казино-визуалом. Бурмалда пошла!": "A meme idle clicker with a casino look. Burmalda is rolling!",
"Для игры нужен включённый JavaScript.": "JavaScript must be enabled to play.",
"БУРМАЛДА": "BURMALDA",
"завоз грузится...": "the haul is loading...",
"ЗАГЛУШКА ФОНА": "BACKGROUND PLACEHOLDER",
"БАЛАНС": "BALANCE",
"ДОХОД": "INCOME",
"+0/сек": "+0/sec",
"МНОЖИТЕЛЬ": "MULTIPLIER",
"УРОВЕНЬ": "LEVEL",
"Громкость": "Volume",
"Включить / выключить звук": "Mute / unmute sound",
"Новичок · 0 / 100 XP": "Newbie · 0 / 100 XP",
"БУРМАЛДА СЛОТ": "BURMALDA SLOTS",
"ГОТОВ · ЖМИ КРУТИТЬ": "READY · HIT SPIN",
"КРУТИТЬ": "SPIN",
"📺 РЕКЛАМНАЯ ПАУЗА": "📺 AD BREAK",
"×2 доход на 60 сек": "×2 income for 60 sec",
"🛒 МАГАЗИН УЛУЧШЕНИЙ": "🛒 UPGRADE SHOP",
"👑 ИМПЕРИЯ": "👑 EMPIRE",
"⚡ Общий доход": "⚡ Total income",
"🏗️ Активных зданий": "🏗️ Active buildings",
"👑 Размер Империи": "👑 Empire size",
"🎲 Шанс события (каждые 20 с)": "🎲 Event chance (every 20 s)",
"🔊 Сила бума и рекламы": "🔊 Boom and ad power",
"ПРОГРЕСС ИМПЕРИИ ·": "EMPIRE PROGRESS ·",
"СЛЕДУЮЩАЯ ЦЕЛЬ": "NEXT GOAL",
"🕳 ПОДВАЛ": "🕳 BASEMENT",
"ПОКАЗАТЬ ПУТЬ": "SHOW PATH",
"🔐 СЕКРЕТЫ": "🔐 SECRETS",
"📋 ЕЩЁ": "📋 MORE",
"🏆 Достижения": "🏆 Achievements",
"📊 Статистика": "📊 Stats",
"⚙️ Настройки": "⚙️ Settings",
"🔊 Звук": "🔊 Sound",
"ВКЛ": "ON",
"🔉 Громкость": "🔉 Volume",
"🗑️ СБРОСИТЬ ПРОГРЕСС": "🗑️ RESET PROGRESS",
"Главная": "Home",
"Магазин": "Shop",
"Империя": "Empire",
"Ещё": "More",
"🎁 ЕЖЕДНЕВНЫЙ БОНУС": "🎁 DAILY BONUS",
"+100 БУРМАЛДЫ": "+100 BURMALDA",
"ЗАБРАТЬ": "CLAIM",
"📺 УДВОИТЬ НАГРАДУ": "📺 DOUBLE THE REWARD",
"ДОСТИЖЕНИЕ!": "ACHIEVEMENT!",
"Первый клик": "First click",
"НОВЫЙ УРОВЕНЬ": "NEW LEVEL",
"Игрок": "Player",
"🎰 ДОБРО ПОЖАЛОВАТЬ В БУРМАЛДУ": "🎰 WELCOME TO BURMALDA",
"⚠️ Крутка — это риск": "⚠️ Spinning is a risk",
"— здания приносят доход каждую секунду": "— buildings generate income every second",
"— улучшения круток и пассивного дохода": "— spin and passive income upgrades",
"— достижения, статистика, настройки": "— achievements, stats, settings",
"ПОНЯТНО, ПОЕХАЛИ": "GOT IT, LET'S GO",
"ПОКА ТЕБЯ НЕ БЫЛО": "WHILE YOU WERE AWAY",
"⏱ Засчитано: 0с": "⏱ Credited: 0s",
"Бурмалда продолжала зарабатывать, пока тебя не было.": "Burmalda kept earning while you were away.",
"Офлайн: 50% дохода, максимум 4 часа": "Offline: 50% of income, up to 4 hours",
"Мужик": "The Guy",
"МУЖИК": "THE GUY",
"«Слышь, дело есть. Давай удвоим всё, что у тебя в карманах. Или не удвоим.»": "“Hey, got a deal. Let's double everything in your pockets. Or not.”",
"ТВОЙ БАЛАНС": "YOUR BALANCE",
"при успехе → 0 💰": "on success → 0 💰",
"50% — БАЛАНС ×2 · 50% — БАЛАНС ОБНУЛИТСЯ": "50% — BALANCE ×2 · 50% — BALANCE WIPED",
"УДВОИТЬ": "DOUBLE IT",
"ПОСЛАТЬ": "GET LOST",
"ПРОДОЛЖИТЬ": "CONTINUE",
"Налоговый инспектор": "Tax inspector",
"💼 ГОСУДАРСТВЕННАЯ ДОЛЯ": "💼 STATE SHARE",
"«Добрый день. Я из налоговой.": "“Good afternoon. I'm from the tax office.",
"В соответствии со статьёй 99 Федерального кодекса казино и прочих сомнительных развлечений, ставка налогообложения составляет 99%.": "Pursuant to Article 99 of the Federal Code of Casinos and Other Questionable Entertainment, the tax rate is 99%.",
"Почему не 100%? Мы не звери. Вам ещё работать.»": "Why not 100%? We're not beasts. You still have to work.”",
"ОПЛАЧЕНО": "PAID",
"На выбор:": "Your choice:",
"ЗАПЛАТИТЬ 99% от баланса": "PAY 99% of balance",
"Автомат": "Machine",
"АВТОМАТ СЛОМАЛСЯ": "MACHINE BROKE DOWN",
"Автомат начинает искрить, барабаны крутятся сами.": "The machine starts sparking, the reels spin on their own.",
"🎰 ВЫБИТЬ ДЖЕКПОТ · шанс 50%": "🎰 HIT THE JACKPOT · 50% chance",
"🔧 ПОЗВАТЬ МАСТЕРА · −10%": "🔧 CALL THE REPAIRMAN · −10%",
"БУРМАЛДА БУМ": "BURMALDA BOOM",
"ДЖЕКПОТ БУРМАЛДЫ": "BURMALDA JACKPOT",
"УДАРИТЬ 🔨": "HIT IT 🔨",
"ПОДВАЛ": "BASEMENT",
"Старый подвал": "Old Basement",
"Уровень 0": "Level 0",
"УЛУЧШИТЬ ЗДАНИЕ": "UPGRADE BUILDING",
"ВНУТРЕННИЕ УЛУЧШЕНИЯ": "INTERNAL UPGRADES",
"ПУТЬ К: ГАРАЖ": "PATH TO: GARAGE",
"ЗАКРЫТЬ": "CLOSE",
"⚠️ СБРОСИТЬ ВЕСЬ ПРОГРЕСС?": "⚠️ RESET ALL PROGRESS?",
"Это действие нельзя отменить. Весь баланс, уровни и улучшения будут удалены навсегда.": "This action cannot be undone. All balance, levels and upgrades will be deleted forever.",
"ДА, СБРОСИТЬ": "YES, RESET",
"ОТМЕНА": "CANCEL",
"👑 ТЫ СТАЛ БУРМАЛДОЙ": "👑 YOU BECAME BURMALDA",
"Ты прошёл весь путь от маленького казино до самой БУРМАЛДЫ. Но остановка — не для тебя. Продолжай бить собственные рекорды!": "You've come all the way from a little casino to BURMALDA herself. But stopping is not for you. Keep breaking your own records!",
"ПРОДОЛЖИТЬ ПУТЬ": "CONTINUE THE JOURNEY",
"📺 РЕКЛАМА": "📺 AD",
"Загрузка рекламы...": "Loading ad...",
"ХАРИЗМА": "CHARISMA",
"Увеличивает размер крупных и безумных выигрышей (и суперклика), а также немного пассивный доход. Обычные выигрыши и проигрыши не меняются.": "Increases the size of big wins and crazy jackpots (and the super click), and slightly boosts passive income. Regular wins and losses are unchanged.",
"Крупные и безумные выигрыши: +{0}% → +{1}%; пассивный доход: +{2}% → +{3}%": "Big wins and crazy jackpots: +{0}% → +{1}%; passive income: +{2}% → +{3}%",
"АВТОКРУТКА": "AUTO-SPIN",
"Дешёвая автоматизация. Каждый уровень заметно усиливает доход.": "Cheap automation. Each level noticeably boosts income.",
"+{0}/сек пассивно": "+{0}/sec passive",
"КРИТИЧЕСКИЙ КЛИК": "CRITICAL CLICK",
"Небольшой шанс критического удара на выигрышных крутках.": "A small chance of a critical hit on winning spins.",
"Шанс крита {0}%": "Crit chance {0}%",
"СТРАХОВКА": "INSURANCE",
"Уменьшает размер проигрышей в крутках. Инвестиции «Мужика» не защищает.": "Reduces the size of losses on spins. Does not protect against the Guy's investments.",
"−{0}% к размеру проигрышей": "−{0}% to loss size",
"ДЖЕКПОТНЫЙ МАГНИТ": "JACKPOT MAGNET",
"Шанс безумного джекпота: 0,5% → 1% → 1,5% → 2%. Уровни открываются за клики: 500 / 1 000 / 2 500. Множитель джекпота (×10–×50), проигрыши и крупные выигрыши не меняются.": "Crazy jackpot chance: 0.5% → 1% → 1.5% → 2%. Levels unlock with clicks: 500 / 1,000 / 2,500. The jackpot multiplier (×10–×50), losses and big wins stay the same.",
"Шанс джекпота: {0} → {1}": "Jackpot chance: {0} → {1}",
"БУРМАЛДА-МАШИНА": "BURMALDA MACHINE",
"Тяжёлая автоматизация. Каждый уровень увеличивает мощность машины.": "Heavy automation. Each level increases the machine's power.",
"Новичок": "Newbie",
"Хайроллер": "High Roller",
"Мажор": "Big Shot",
"Мемщик": "Memer",
"Бурмалдач": "Burmalda Fan",
"Бурмалда-миллионер": "Burmalda Millionaire",
"Бурмалда-миллиардер": "Burmalda Billionaire",
"БУРМАЛДА БОГ": "BURMALDA GOD",
"×2 КЛИКИ НА 10 МИН": "×2 CLICKS FOR 10 MIN",
"×1.5 ПАССИВНЫЙ ДОХОД НА 15 МИН": "×1.5 PASSIVE INCOME FOR 15 MIN",
"×1.5 ВЫИГРЫШИ НА 15 МИН": "×1.5 WINS FOR 15 MIN",
"×2 ШАНС КРИТА НА 15 МИН": "×2 CRIT CHANCE FOR 15 MIN",
"×2 ПАССИВНЫЙ ДОХОД НА 20 МИН": "×2 PASSIVE INCOME FOR 20 MIN",
"×1.75 КРУПНЫЕ ВЫИГРЫШИ НА 20 МИН": "×1.75 BIG WINS FOR 20 MIN",
"×2 ОБЩИЙ ДОХОД НА 20 МИН": "×2 TOTAL INCOME FOR 20 MIN",
"СТАРТ": "START",
"всё только начинается": "it's only the beginning",
"сырость, ящики, свечи": "damp, crates, candles",
"ГАРАЖ": "GARAGE",
"машины и неон": "cars and neon",
"КВАРТИРА": "APARTMENT",
"диван, телик, холодильник": "couch, TV, fridge",
"КЛУБ": "CLUB",
"сцена, неон, музыка": "stage, neon, music",
"КАЗИНО": "CASINO",
"автоматы и фишки": "slots and chips",
"БАШНЯ": "TOWER",
"вид на ночной город": "night city view",
"ГОРОД": "CITY",
"огромный мегаполис": "a huge metropolis",
"ИМПЕРИЯ": "EMPIRE",
"система размером с мир": "a system the size of the world",
"Обустроенный подвал": "Furnished Basement",
"Укреплённый подвал": "Reinforced Basement",
"VIP-подвал": "VIP Basement",
"МЕГА-подвал": "MEGA Basement",
"Стеллажи": "Shelves",
"Лампа": "Lamp",
"Старый гараж": "Old Garage",
"Нормальный гараж": "Decent Garage",
"Навороченный гараж": "Pimped-Out Garage",
"VIP-гараж": "VIP Garage",
"МЕГА-ГАРАЖ": "MEGA GARAGE",
"Старый BMW": "Old BMW",
"Неоновая вывеска": "Neon Sign",
"Игровой автомат": "Slot Machine",
"Ремонтная яма": "Repair Pit",
"Съёмная квартира": "Rented Apartment",
"Своя квартира": "Own Apartment",
"После ремонта": "Renovated",
"Дизайнерская": "Designer",
"Пентхаус": "Penthouse",
"Диван": "Couch",
"Телевизор": "TV",
"Компьютер": "Computer",
"Холодильник": "Fridge",
"Сейф": "Safe",
"Подвальный клуб": "Basement Club",
"Городской клуб": "City Club",
"Модный клуб": "Trendy Club",
"VIP-клуб": "VIP Club",
"Легендарный клуб": "Legendary Club",
"Сцена": "Stage",
"Бар": "Bar",
"Танцпол": "Dance Floor",
"VIP-комната": "VIP Room",
"Звуковая система": "Sound System",
"Подпольное казино": "Underground Casino",
"Городское казино": "City Casino",
"Роскошное казино": "Luxury Casino",
"VIP-казино": "VIP Casino",
"Казино-легенда": "Legendary Casino",
"Игровые автоматы": "Slot Machines",
"Зал игр": "Gaming Hall",
"VIP-зал": "VIP Hall",
"Касса": "Cashier",
"Стройка": "Construction Site",
"Бизнес-центр": "Business Center",
"Элитная башня": "Elite Tower",
"Мега-башня": "Mega Tower",
"Империя-Тауэр": "Empire Tower",
"Этаж 1 — Офисы": "Floor 1 — Offices",
"Этаж 2 — Магазины": "Floor 2 — Shops",
"Этаж 3 — Ресторан": "Floor 3 — Restaurant",
"Этаж 4 — Игровая зона": "Floor 4 — Gaming Zone",
"Этаж 5 — VIP": "Floor 5 — VIP",
"Этаж 6 — Серверная": "Floor 6 — Server Room",
"Посёлок": "Village",
"Городок": "Small Town",
"Мегаполис": "Metropolis",
"Столица": "Capital",
"Мировая столица": "World Capital",
"Промзона": "Industrial Zone",
"Жилой район": "Residential District",
"Торговый центр": "Shopping Mall",
"Стадион": "Stadium",
"Центр": "Downtown",
"Аэропорт": "Airport",
"Молодая империя": "Young Empire",
"Растущая империя": "Growing Empire",
"Великая империя": "Great Empire",
"Мировая держава": "World Power",
"БУРМАЛДА БОГ ИМПЕРИИ": "BURMALDA GOD OF THE EMPIRE",
"Банк": "Bank",
"Небоскрёбы": "Skyscrapers",
"Предприятия": "Enterprises",
"Автопарк": "Motor Pool",
"Казино-сеть": "Casino Chain",
"Города": "Cities",
"Космическая программа": "Space Program",
"ЗОЛОТОЙ ЛИФТ": "GOLDEN ELEVATOR",
"Башня уровня 25": "Tower level 25",
"СЕКРЕТНЫЙ СЕЙФ": "SECRET SAFE",
"Заработать 1 миллиард": "Earn 1 billion",
"КОСМИЧЕСКИЙ АВТОМАТ": "SPACE SLOT MACHINE",
"Получить 10 джекпотов": "Hit 10 jackpots",
"Сделать 1732 клика": "Make 1,732 clicks",
"Маркетинг": "Marketing",
"Золотой автомат": "Golden Slot Machine",
"Этаж 7 — Биржа": "Floor 7 — Stock Exchange",
"Этаж 8 — Тренажёрка": "Floor 8 — Gym",
"Свободная экономзона": "Free Economic Zone",
"Городская лотерея": "City Lottery",
"Мировая торговля": "World Trade",
"Культ Бурмалды": "Cult of Burmalda",
"Империя удачи": "Empire of Luck",
"ЕСТЬ ТЕМА": "GOT A DEAL",
"БРАТ, ТОЛЬКО НИКОМУ НЕ ГОВОРИ": "BRO, JUST DON'T TELL ANYONE",
"СХЕМА ЖЕЛЕЗНАЯ": "IRONCLAD SCHEME",
"НУЖНЫ ДЕНЬГИ - ЕСТЬ ВАРИАНТ": "NEED MONEY - I'VE GOT AN OPTION",
"ВОТ ЭТО ЗАВОЗ": "NOW THAT'S A HAUL",
"БУРМАЛДА ПОШЛА": "BURMALDA IS ROLLING",
"ЕЩЁ КРУТКА": "ANOTHER SPIN",
"ПОШЛА РАСКРУТКА!": "THE SNOWBALL IS ROLLING!",
"БУРМАЛДА НЕ ОСТАНОВИТЬ": "BURMALDA CAN'T BE STOPPED",
"ЗАВОЗ ИДЁТ": "THE HAUL IS COMING",
"ЭТО УЖЕ СЛИШКОМ": "THIS IS TOO MUCH",
"ТЫ ЧТО НАТВОРИЛ": "WHAT HAVE YOU DONE",
"КАЗИНО УЖЕ ТВОЁ": "THE CASINO IS YOURS NOW",
"ЛАС-ВЕГАС ПОКУПАЕМ": "LET'S BUY LAS VEGAS",
"АМ АМ АМ": "AM AM AM",
"НЕСИТЕ ЧЕМОДАНЫ!": "BRING THE SUITCASES!",
"ЛУУУУУУУТ!!!": "LOOOOOOOOT!!!",
"НЕ ПОВЕЗЛО": "NO LUCK",
"МИМО": "MISSED",
"В СЛЕДУЮЩИЙ РАЗ": "NEXT TIME",
"БУРМАЛДА ОТДЫХАЕТ": "BURMALDA IS RESTING",
"ПЛАКИ-ПЛАКИ": "BOO-HOO",
"НЕ ЗАЛЕТЕЛО": "DIDN'T HIT",
"СЕЙЧАС ОТЫГРАЕМСЯ": "WE'LL WIN IT BACK",
"ИКСЫ СТАНОВЯТСЯ ЖИРНЕЕ!": "THE MULTIPLIERS GET FATTER!",
"БУРМАЛДУ НЕ ОСТАНОВИТЬ": "BURMALDA CAN'T BE STOPPED",
"ПОШЛА ДВИЖУХА!": "THE PARTY IS ON!",
"ТЫ КУПИЛ НОВУЮ СОБСТВЕННОСТЬ": "YOU BOUGHT NEW PROPERTY",
"ТЕПЕРЬ ЭТО ТВОЙ БИЗНЕС": "NOW IT'S YOUR BUSINESS",
"ИМПЕРИЯ РАСТЁТ": "THE EMPIRE IS GROWING",
"{0}ч {1}м": "{0}h {1}m",
"{0}м {1}с": "{0}m {1}s",
"{0}с": "{0}s",
"localStorage недоступен, прогресс не будет сохраняться в этой сессии.": "localStorage is unavailable, progress will not be saved in this session.",
"Не удалось сохранить прогресс:": "Failed to save progress:",
"Сохранение повреждено, начинаем заново:": "Save is corrupted, starting over:",
"БУРМАЛДА БОГ +{0}": "BURMALDA GOD +{0}",
"Сделай первую крутку": "Make your first spin",
"100 кликов": "100 clicks",
"Сделай 100 круток": "Make 100 spins",
"1 000 кликов": "1,000 clicks",
"Сделай 1 000 круток": "Make 1,000 spins",
"10 000 кликов": "10,000 clicks",
"Сделай 10 000 круток": "Make 10,000 spins",
"100 000 кликов": "100,000 clicks",
"Сделай 100 000 круток": "Make 100,000 spins",
"Первый автокликер": "First auto-clicker",
"Купи Автокрутку": "Buy Auto-Spin",
"Первый крит": "First crit",
"Получи первый критический удар": "Land your first critical hit",
"Первый безумный джекпот": "First crazy jackpot",
"Сорви джекпот (0.5% шанс)": "Hit a jackpot (0.5% chance)",
"100 000 бурмалды": "100,000 burmalda",
"Заработай суммарно 100 000 бурмалды": "Earn 100,000 burmalda in total",
"1 миллион бурмалды": "1 million burmalda",
"Заработай суммарно 1 000 000 бурмалды": "Earn 1,000,000 burmalda in total",
"1 миллиард бурмалды": "1 billion burmalda",
"Заработай суммарно 1 000 000 000 бурмалды": "Earn 1,000,000,000 burmalda in total",
"Первая собственность": "First property",
"Купи Подвал": "Buy the Basement",
"Купи Бурмалда-машину": "Buy the Burmalda Machine",
"БОГ БУРМАЛДЫ": "GOD OF BURMALDA",
"Достигни 10 уровня": "Reach level 10",
"Коллекционер апгрейдов": "Upgrade collector",
"Купи 10 улучшений": "Buy 10 upgrades",
"Друг рекламы": "Friend of ads",
"Посмотри 5 рекламных роликов": "Watch 5 ads",
"Начало Империи": "Start of the Empire",
"Открой Гараж": "Unlock the Garage",
"ИМПЕРИЯ БУРМАЛДЫ": "BURMALDA EMPIRE",
"Построй здание «Империя»": "Build the “Empire” building",
"{0} уровень {1}": "{0} level {1}",
"{0} кликов": "{0} clicks",
"Заработать {0}": "Earn {0}",
"{0} достижений": "{0} achievements",
"🏗️ НОВАЯ СОБСТВЕННОСТЬ:": "🏗️ NEW PROPERTY:",
"Доход здания: {0}/сек (макс.)": "Building income: {0}/sec (max)",
"Доход здания: {0} → {1}/сек (+{2})": "Building income: {0} → {1}/sec (+{2})",
"(макс.)": "(max)",
"Шанс события (каждые 20 с): {0}%{1}": "Event chance (every 20 s): {0}%{1}",
"Крупные и безумные выигрыши: +{0}%{1}": "Big wins and crazy jackpots: +{0}%{1}",
"Весь пассивный доход: +{0}%{1}": "All passive income: +{0}%{1}",
"Сила клика: +{0}%{1}": "Click power: +{0}%{1}",
"Награда безумного джекпота: +{0}%{1}": "Crazy jackpot reward: +{0}%{1}",
"Сила бума и рекламы: +{0}%{1}": "Boom and ad power: +{0}%{1}",
"клики {0}/{1}": "clicks {0}/{1}",
"заработано {0}/{1}": "earned {0}/{1}",
"достижения {0}/{1}": "achievements {0}/{1}",
"Ты построил всю Империю!": "You built the whole Empire!",
"{0}: улучшить до {1} ур.": "{0}: upgrade to lvl {1}",
"БУРМАЛДА БУМ! ×{0} ДОХОД НА {1}с": "BURMALDA BOOM! ×{0} INCOME FOR {1}s",
"СУПЕРКЛИК! Следующая крутка — гигантский приз": "SUPER CLICK! The next spin is a giant prize",
"[YandexSDK] SDK не найден — автономный режим.": "[YandexSDK] SDK not found — standalone mode.",
"[YandexSDK] ошибка инициализации:": "[YandexSDK] initialization error:",
"📺 РЕКЛАМА ЕЩЁ НЕДОСТУПНА": "📺 AD NOT AVAILABLE YET",
"БУРМАЛДА ЗАВОЗ! ДОХОД ×{0} НА 60 СЕК": "BURMALDA HAUL! INCOME ×{0} FOR 60 SEC",
"🛒 МАГАЗИН — улучшения круток и пассивного дохода": "🛒 SHOP — spin and passive income upgrades",
"👑 ИМПЕРИЯ — здания дают доход каждую секунду": "👑 EMPIRE — buildings generate income every second",
"📋 ЕЩЁ — достижения, статистика и настройки": "📋 MORE — achievements, stats and settings",
"ВЫКЛ": "OFF",
"/сек": "/sec",
"📺 БУРМАЛДА ЗАВОЗ АКТИВЕН": "📺 BURMALDA HAUL ACTIVE",
"Осталось {0} сек · ×{1} доход": "{0} sec left · ×{1} income",
"Посмотри рекламу — ×{0} доход на {1} сек": "Watch an ad — ×{0} income for {1} sec",
"МАКСИМАЛЬНЫЙ УРОВЕНЬ": "MAX LEVEL",
"МАКС": "MAX",
"кликов ·": "clicks ·",
"КУПИТЬ ·": "BUY ·",
"Уровень": "Level",
"👑 ВСЁ ПОСТРОЕНО": "👑 EVERYTHING BUILT",
"(+{0} п.п.)": "(+{0} pp)",
"% (бум ×": "% (boom ×",
"🏗️ НОВЫЙ ЭТАП: {0} — {1}": "🏗️ NEW STAGE: {0} — {1}",
"Заблокировано": "Locked",
"🔒 ЗАБЛОКИРОВАНО": "🔒 LOCKED",
"Нужно": "Need",
"\">ПОКАЗАТЬ ПУТЬ": "\">SHOW PATH",
"Готово к покупке": "Ready to buy",
">КУПИТЬ ЗДАНИЕ": ">BUY BUILDING",
"УЛУЧШИТЬ ·": "UPGRADE ·",
"Доход: +": "Income: +",
"сек": "sec",
"\">УЛУЧШЕНИЯ ▸": "\">UPGRADES ▸",
"Бонус получен: +0,25 к множителю навсегда": "Bonus received: +0.25 to the multiplier forever",
"УЛУЧШИТЬ ЗДАНИЕ · {0} 💰": "UPGRADE BUILDING · {0} 💰",
"<div class=\"sub-upgrade-card\">\n          <div class=\"sub-upgrade-icon\">{0}</div>\n          <div class=\"sub-upgrade-name\">{1}</div>\n          <div class=\"sub-upgrade-level\">Уровень {2} / {3}</div>\n          <div class=\"sub-upgrade-effect\">{4}</div>\n          <button class=\"sub-upgrade-buy\" data-sub=\"{5}\" {6}>{7}</button>\n        </div>": "<div class=\"sub-upgrade-card\">\n          <div class=\"sub-upgrade-icon\">{0}</div>\n          <div class=\"sub-upgrade-name\">{1}</div>\n          <div class=\"sub-upgrade-level\">Level {2} / {3}</div>\n          <div class=\"sub-upgrade-effect\">{4}</div>\n          <button class=\"sub-upgrade-buy\" data-sub=\"{5}\" {6}>{7}</button>\n        </div>",
"ПУТЬ К:": "PATH TO:",
"{0}: уровень {1} / {2}": "{0}: level {1} / {2}",
"Клики: {0} / {1}": "Clicks: {0} / {1}",
"Заработано: {0} / {1}": "Earned: {0} / {1}",
"Достижения: {0} / {1}": "Achievements: {0} / {1}",
"<div class=\"empire-path-row done\"><span>✅</span><span>Требований нет — можно покупать сразу!</span></div>": "<div class=\"empire-path-row done\"><span>✅</span><span>No requirements — you can buy it right away!</span></div>",
"Всего кликов": "Total clicks",
"Всего заработано": "Total earned",
"Доход в секунду": "Income per second",
"Бурмалды за клик": "Burmalda per click",
"Критических кликов": "Critical clicks",
"Крупных выигрышей": "Big wins",
"Безумных джекпотов": "Crazy jackpots",
"Проигрышей": "Losses",
"Потеряно на проигрышах": "Lost on losses",
"Купленных улучшений": "Upgrades bought",
"Просмотрено реклам": "Ads watched",
"Размер Империи": "Empire size",
"Время в игре": "Time played",
"Максимальный баланс": "Max balance",
"<div class=\"daily-day {0}\">Д{1}</div>": "<div class=\"daily-day {0}\">D{1}</div>",
"БОНУС НА {0} МИН": "BONUS FOR {0} MIN",
"БУРМАЛДА ЗАВОЗ ×2!": "BURMALDA HAUL ×2!",
"💎 БЕЗУМНЫЙ ДЖЕКПОТ!": "💎 CRAZY JACKPOT!",
"🎉 КРУПНЫЙ ВЫИГРЫШ!": "🎉 BIG WIN!",
"💎 ДЖЕКПОТ": "💎 JACKPOT",
"🎉 КРУПНЫЙ ВЫИГРЫШ": "🎉 BIG WIN",
"Показ видеорекламы через Яндекс SDK...": "Showing a video ad via Yandex SDK...",
"Показ тестовой заглушки рекламы (SDK не подключен)...": "Showing a test ad placeholder (SDK not connected)...",
"БЕЗУМНЫЙ ДЖЕКПОТ!": "CRAZY JACKPOT!",
"ДЖЕКПОТ!": "JACKPOT!",
"☁️ ПРОГРЕСС ЗАГРУЖЕН ИЗ ОБЛАКА": "☁️ PROGRESS LOADED FROM THE CLOUD",
"🎁 Ур. {0}: ранг «{1}» · клик +{2}%": "🎁 Lvl {0}: rank “{1}” · click +{2}%",
"· 🏆 достижение": "· 🏆 achievement",
"🎯 <b>Твоя цель:</b> купи <b>ПОДВАЛ</b> ({0} 💰) во вкладке «Империя» — он начнёт приносить деньги сам.": "🎯 <b>Your goal:</b> buy the <b>BASEMENT</b> ({0} 💰) in the “Empire” tab — it will start earning money on its own.",
"{0} круток — проигрыш: теряешь сумму одной крутки. Зато {1} дают выигрыш, {2} — крупный, {3} — джекпот ×{4}–×{5}. В среднем крутка приносит плюс, а Страховка в магазине уменьшает проигрыши.": "{0} of spins are losses: you lose the amount of one spin. But {1} are wins, {2} are big wins, {3} are jackpots ×{4}–×{5}. On average a spin pays off, and Insurance in the shop reduces losses.",
"🎯 Цель: купи ПОДВАЛ во вкладке «Империя» — {0} 💰": "🎯 Goal: buy the BASEMENT in the “Empire” tab — {0} 💰",
"🎯 Цель: накопи {0} 💰 — жми КРУТИТЬ (сейчас {1})": "🎯 Goal: save up {0} 💰 — hit SPIN (now {1})",
"🎯 Цель: прокачай ПОДВАЛ до {0} ур. (сейчас {1}) — откроется ГАРАЖ": "🎯 Goal: upgrade the BASEMENT to lvl {0} (now {1}) — the GARAGE will unlock",
"при успехе →": "on success →",
"{0}% — БАЛАНС ×{1} · {2}% — БАЛАНС ОБНУЛИТСЯ": "{0}% — BALANCE ×{1} · {2}% — BALANCE WIPED",
"🕴️ ТИП ОБИДЕЛСЯ И УШЁЛ": "🕴️ THE GUY GOT OFFENDED AND LEFT",
"МОНЕТКА В ВОЗДУХЕ…": "COIN IN THE AIR…",
"ТИШИНА…": "SILENCE…",
"ВСЁ РЕШАЕТСЯ…": "IT ALL COMES DOWN TO THIS…",
"Мужик уважительно кивает": "The Guy nods respectfully",
"🕴️ СХЕМА ЗАШЛА! БАЛАНС ×": "🕴️ THE SCHEME WORKED! BALANCE ×",
"💀 ВСЁ ПРОПАЛО 💀": "💀 EVERYTHING IS GONE 💀",
"Мужик растворился вместе с деньгами": "The Guy vanished along with the money",
"🕴️ ТЕБЯ КИНУЛИ. БАЛАНС ОБНУЛЁН": "🕴️ YOU GOT SCAMMED. BALANCE WIPED",
"Баланс: <b>{0} 💰</b><br>К оплате: <b class=\"neg\">−{1} 💰</b><br>Останется: <b>{2} 💰</b>": "Balance: <b>{0} 💰</b><br>To pay: <b class=\"neg\">−{1} 💰</b><br>Remaining: <b>{2} 💰</b>",
"ЗАПЛАТИТЬ {0}% от баланса": "PAY {0}% of balance",
"💼 НАЛОГОВАЯ ПРОВЕРКА!": "💼 TAX AUDIT!",
"Государство благодарит за вклад в казну": "The State thanks you for your contribution to the treasury",
"Осталось:": "Left:",
"🔧 ПОЗВАТЬ МАСТЕРА · −{0}% ({1} 💰)": "🔧 CALL THE REPAIRMAN · −{0}% ({1} 💰)",
"🎰 ВЫБИТЬ ДЖЕКПОТ · шанс {0}%": "🎰 HIT THE JACKPOT · {0}% chance",
"Не повезёт — автомат встанет на {0} с.": "If unlucky — the machine will be down for {0} s.",
"⚡ АВТОМАТ СЛОМАЛСЯ!": "⚡ MACHINE BROKE DOWN!",
"БАРАБАНЫ ЗАМЕДЛЯЮТСЯ…": "REELS ARE SLOWING DOWN…",
"🎰 ДЖЕКПОТ! 🎰": "🎰 JACKPOT! 🎰",
"Автомат выплюнул всё, что мог": "The machine spat out everything it had",
"🎰 ДЖЕКПОТ ИЗ СЛОМАННОГО АВТОМАТА! +": "🎰 JACKPOT FROM THE BROKEN MACHINE! +",
"💥 ЗАГЛОХ": "💥 STALLED",
"Ремонт: {0} с": "Repair: {0} s",
"Крутки недоступны, пока автомат чинится": "Spins are unavailable while the machine is being repaired",
"🔧 ПОЧИНИЛИ": "🔧 FIXED",
"Мастер сделал вид, что всё сложно": "The repairman pretended it was complicated",
"🔧 ЧИНИТСЯ": "🔧 REPAIRING",
"с": "s",
"⏱ Засчитано: {0}": "⏱ Credited: {0}",
"Офлайн: {0}% дохода, максимум {1} ч": "Offline: {0}% of income, up to {1} h",
"💰 БУРМАЛДА ДОЖДАЛАСЬ ТЕБЯ": "💰 BURMALDA WAITED FOR YOU",
"БУРМАЛДА, сборка": "BURMALDA, build",
"Версии файлов не совпадают: html=": "File versions do not match: html=",
"⚠️ ФАЙЛЫ РАЗНЫХ ВЕРСИЙ — ОБНОВИ СТРАНИЦУ (Ctrl+F5)": "⚠️ FILES OF DIFFERENT VERSIONS — REFRESH THE PAGE (Ctrl+F5)",
"этап:": "stage:",
"этап по умолчанию (по купленным зданиям)": "default stage (by owned buildings)",
"крутка:": "spin:",
"Ошибка запуска игры:": "Game startup error:",
"<p style=\"position:relative;z-index:5;margin:14px 20px 0;color:#ffd0d6;font-size:.9rem;text-align:center\">Не удалось запустить игру. Обновите страницу (Ctrl+F5). Если не помогает, очистите данные сайта.</p>": "<p style=\"position:relative;z-index:5;margin:14px 20px 0;color:#ffd0d6;font-size:.9rem;text-align:center\">Failed to start the game. Refresh the page (Ctrl+F5). If that doesn't help, clear the site data.</p>",
"🔐 СЕКРЕТ ОТКРЫТ:": "🔐 SECRET UNLOCKED:",
"🔧 АВТОМАТ ЧИНИТСЯ…": "🔧 MACHINE IS BEING REPAIRED…",
"КРУТИМ…": "SPINNING…",
"Вишня": "Cherry",
"Лимон": "Lemon",
"Виноград": "Grapes",
"Алмаз": "Diamond",
"Звезда": "Star",
"Колокольчик": "Bell",
"Корона": "Crown",
"Деньги": "Money",
"Семёрка": "Seven",
"Ракета": "Rocket",
"БЕЗУМНЫЙ ДЖЕКПОТ! +": "CRAZY JACKPOT! +",
"КРИТ!": "CRIT!",
"СУПЕРКЛИК!": "SUPER CLICK!"
};
function __t(s) {
  if (LANG === 'ru' || typeof s !== 'string') return s;
  const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
  const v = I18N_EN[m[2]];
  return v === undefined ? s : m[1] + v + m[3];
}
function __tt(strings, ...vals) {
  if (LANG === 'en') {
    const key = strings.reduce((a, str, i) => a + (i ? '{' + (i - 1) + '}' : '') + str, '');
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(key);
    const v = I18N_EN[m[2]];
    if (v !== undefined) return m[1] + v.replace(/\{(\d+)\}/g, (x, i) => vals[+i]) + m[3];
  }
  return strings.reduce((a, str, i) => a + (i ? vals[i - 1] : '') + str, '');
}
/** Перевод статичной разметки index.html (текстовые узлы и атрибуты) + селектор языка. */
(function applyStaticI18n() {
  try {
    document.documentElement.lang = LANG;
    const sel = document.getElementById('langSelect');
    if (sel) {
      sel.value = LANG;
      sel.addEventListener('change', () => {
        try { localStorage.setItem('burmalda_lang', sel.value); } catch (e) { /* ignore */ }
        location.reload();
      });
    }
    if (LANG !== 'en') return;
    const tr = (x) => __t(x);
    document.title = tr(document.title);
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', tr(meta.getAttribute('content')));
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => {
      const p = n.parentNode && n.parentNode.nodeName;
      if (p === 'SCRIPT' || p === 'STYLE' || p === 'OPTION') return;
      if (/[А-Яа-яЁё]/.test(n.nodeValue)) n.nodeValue = tr(n.nodeValue);
    });
    document.querySelectorAll('[title],[alt],[aria-label]').forEach((el) => {
      ['title', 'alt', 'aria-label'].forEach((a) => { if (el.hasAttribute(a)) el.setAttribute(a, tr(el.getAttribute(a))); });
    });
  } catch (e) { console.warn('i18n init failed', e); }
})();

'use strict';

/* =====================================================================
   1. CONFIG — баланс кликера/магазина/событий/рекламы/уровней
   ===================================================================== */
const CONFIG = {
  saveKey: 'burmalda_save_v2',
  autosaveIntervalMs: 15000,
  tickIntervalMs: 1000,
  startingBalance: 1000,

  /* Клики: плавный рост по уровню + доля текущего пассивного дохода.
     Небольшая доля пассивного дохода помогает клику оставаться полезным на поздней стадии. */
  clickRewardBase: 10,
  clickRewardLevelGrowth: 1.30,
  clickRewardPassiveShare: 0.25,
  // +30% за каждый уровень игрока к части клика, зависящей от пассивного дохода (линейно: ур.10 → ×3,7; ур.20 → ×6,7)
  clickPassiveLevelBonus: 0.30,
  secretMultiplierBonus: 0.25, // каждый секрет Империи: +0,25 к постоянному множителю (4 секрета → ×2)

  /* ---------- система ВЫИГРЫШ / ПРОИГРЫШ (усложнено) ----------
     49% обычный исход, 5.5% крупный выигрыш, 45% проигрыш (деньги СПИСЫВАЮТСЯ),
     0.5% безумный джекпот */
  spinOutcomes: [
    { id: 'lose',   weight: 45,  minMult: 0.7,  maxMult: 1.3,   className: '' },
    { id: 'normal', weight: 49,  minMult: 0.6,  maxMult: 1.0,   className: '' },
    { id: 'big',    weight: 5.5, minMult: 2.5,  maxMult: 4.0,   className: 'rare' },
    { id: 'crazy',  weight: 0.5, minMult: 10,   maxMult: 50,   className: 'jackpot' }
  ],
  // харизма не трогает вероятности (они фиксированы по ТЗ), только размер big/crazy наград
  charismaRewardBonusPerLevel: 0.02, // +2% к размеру big/crazy за уровень
  // Джекпотный магнит: шанс crazy (%) по уровням 0..3. Итог на максимуме — ровно 2%.
  jackpotMagnetChances: [0.5, 1, 1.5, 2],
  insuranceReductionPerLevel: 0.03,  // Страховка: −3% к проигрышу за уровень
  charismaPassivePerLevel: 0.005,     // +0.5% к пассивному доходу за уровень

  bigWinThreshold: 45000,

  /* ---------- магазин кликера: экономический баланс ---------- */
  upgrades: [
    {
      id: 'charisma',
      name: __t('ХАРИЗМА'),
      desc: __t('Увеличивает размер крупных и безумных выигрышей (и суперклика), а также немного пассивный доход. Обычные выигрыши и проигрыши не меняются.'),
      icon: '😎',
      baseCost: 600,
      costMult: 1.3,
      effectPerLevel: 1,
      maxLevel: 50,
      effectLabel: (lvl, next) => __tt`Крупные и безумные выигрыши: +${(lvl * CONFIG.charismaRewardBonusPerLevel * 100).toFixed(0)}% → +${(next * CONFIG.charismaRewardBonusPerLevel * 100).toFixed(0)}%; пассивный доход: +${(lvl * CONFIG.charismaPassivePerLevel * 100).toFixed(1).replace('.', DEC)}% → +${(next * CONFIG.charismaPassivePerLevel * 100).toFixed(1).replace('.', DEC)}%`
    },
    {
      id: 'autoSpin',
      name: __t('АВТОКРУТКА'),
      desc: __t('Дешёвая автоматизация. Каждый уровень заметно усиливает доход.'),
      icon: '🤖',
      baseCost: 450,
      costMult: 1.33,
      effectPerLevel: 4,
      effectGrowth: 1.30,
      maxLevel: 15,
      effectLabel: (lvl, next) => __tt`+${Utils_formatPreview(Economy.upgradeIncomeAtLevel('autoSpin', next))}/сек пассивно`
    },
    {
      id: 'criticalClick',
      name: __t('КРИТИЧЕСКИЙ КЛИК'),
      desc: __t('Небольшой шанс критического удара на выигрышных крутках.'),
      icon: '💥',
      baseCost: 1200,
      costMult: 1.3,
      effectPerLevel: 0.5, // +0.5 п.п. шанса за уровень
      maxLevel: 29,
      effectLabel: (lvl, next) => __tt`Шанс крита ${Economy.criticalChanceForLevel(next).toFixed(1)}%`
    },
    {
      id: 'insurance',
      name: __t('СТРАХОВКА'),
      desc: __t('Уменьшает размер проигрышей в крутках. Инвестиции «Мужика» не защищает.'),
      icon: '🛡️',
      baseCost: 800,
      costMult: 1.4,
      effectPerLevel: 3,
      maxLevel: 10,
      effectLabel: (lvl, next) => __tt`−${(next * CONFIG.insuranceReductionPerLevel * 100).toFixed(0)}% к размеру проигрышей`
    },
    {
      id: 'jackpotMagnet',
      name: __t('ДЖЕКПОТНЫЙ МАГНИТ'),
      desc: __t('Шанс безумного джекпота: 0,5% → 1% → 1,5% → 2%. Уровни открываются за клики: 500 / 1 000 / 2 500. Множитель джекпота (×10–×50), проигрыши и крупные выигрыши не меняются.'),
      icon: '🧲',
      baseCost: 250000,
      costMult: 1,
      costs: [250000, 10000000, 100000000],
      unlockClicks: [500, 1000, 2500], // сколько кликов нужно, чтобы купить 1/2/3 уровень
      effectPerLevel: 0.5,
      maxLevel: 3,
      effectLabel: (lvl, next) => __tt`Шанс джекпота: ${Utils.formatPercentRu(CONFIG.jackpotMagnetChances[lvl])} → ${Utils.formatPercentRu(CONFIG.jackpotMagnetChances[next])}`
    },
    {
      id: 'burmaldaMachine',
      name: __t('БУРМАЛДА-МАШИНА'),
      desc: __t('Тяжёлая автоматизация. Каждый уровень увеличивает мощность машины.'),
      icon: '🏭',
      baseCost: 400000,
      costMult: 1.5,
      effectPerLevel: 500,
      effectGrowth: 1.45,
      maxLevel: 10,
      effectLabel: (lvl, next) => __tt`+${Utils_formatPreview(Economy.upgradeIncomeAtLevel('burmaldaMachine', next))}/сек пассивно`
    }
  ],

  levelNames: [
    __t('Новичок'), __t('Игрок'), __t('Хайроллер'), 'VIP', __t('Мажор'),
    __t('Мемщик'), __t('Бурмалдач'), __t('Бурмалда-миллионер'), __t('Бурмалда-миллиардер'), __t('БУРМАЛДА БОГ')
  ],
  xpBaseRequirement: 150,
  xpGrowthPerLevel: 1.35,
  xpPerSpinMin: 2,
  xpPerSpinMax: 4,

  dailyRewards: [
    { day: 1, type: 'clickBoost', boostMult: 2, boostDurationSec: 600, label: __t('×2 КЛИКИ НА 10 МИН') },
    { day: 2, type: 'passiveBoost', boostMult: 1.5, boostDurationSec: 900, label: __t('×1.5 ПАССИВНЫЙ ДОХОД НА 15 МИН') },
    { day: 3, type: 'winningsBoost', boostMult: 1.5, boostDurationSec: 900, label: __t('×1.5 ВЫИГРЫШИ НА 15 МИН') },
    { day: 4, type: 'critBoost', boostMult: 2, boostDurationSec: 900, label: __t('×2 ШАНС КРИТА НА 15 МИН') },
    { day: 5, type: 'passiveBoost', boostMult: 2, boostDurationSec: 1200, label: __t('×2 ПАССИВНЫЙ ДОХОД НА 20 МИН') },
    { day: 6, type: 'jackpotBoost', boostMult: 1.75, boostDurationSec: 1200, label: __t('×1.75 КРУПНЫЕ ВЫИГРЫШИ НА 20 МИН') },
    { day: 7, type: 'allBoost', boostMult: 2, boostDurationSec: 1200, label: __t('×2 ОБЩИЙ ДОХОД НА 20 МИН') }
  ],

  /* ---------- реклама: буст дохода снижен до ×2 ---------- */
  ads: {
    adBreakBoostMultiplier: 2,
    adBreakBoostDurationSec: 60,
    stubDelayMs: 1200,
    breakCooldownSec: 60,
    // заглушка рекламы разрешена только локально (file:// / localhost), в релизе выключена
    allowStub: ['', 'localhost', '127.0.0.1'].includes(location.hostname)
  },

  events: {
    checkIntervalMs: 20000,
    triggerChance: 0.22,
    boomMultiplier: 10,
    boomDurationSec: 10,
    // доля «крупных» событий (30 из 100) делится так, чтобы частота бума/суперклика/777 не изменилась
    investmentCheckWeight: 14,
    brokenCheckWeight: 10,
    taxCheckWeight: 6,
    superClickMultiplier: 40,
    jackpotEventDurationMs: 3200,
    // 777-событие: награда считается динамически от ближайшей крупной покупки.
    jackpotEventRewardMin: 250,
    jackpotEventRewardShare: 0.05,
    jackpotEventRewardMaxPassiveMinutes: 15
  },

  // Мужик-инвестор: удваивает ВЕСЬ баланс (50/50) или обнуляет его. Только деньги: улучшения/здания/уровни/достижения не трогаются.
  investment: {
    minBalance: 5000,     // пока денег меньше — не появляется
    winChance: 0.5,       // строго 50/50
    winMultiplier: 2,
    minIntervalSec: 90,
    suspenseMs: 2800      // длительность напряжённого розыгрыша
  },
  // Налоговая проверка: обычное случайное событие (вес taxCheckWeight), без отдельного кулдауна —
  // выпадает в среднем раз в ~25 мин наравне с остальными. Единственный вариант — заплатить rate от баланса.
  // Расчёт на то, что игрок тратит баланс на покупки, а не копит его.
  taxCheck: {
    rate: 0.99,
    minBalance: 10000,
    minIntervalSec: 0
  },
  // Сломанный автомат: шанс 50% выбить джекпот или заплатить мастеру 10% баланса.
  brokenMachine: {
    jackpotChance: 0.5,
    repairShare: 0.10,
    downtimeSec: 30,      // если джекпот не выбит — автомат «чинится» и крутки недоступны
    minBalance: 500,
    minIntervalSec: 300
  },
  iconAutoDetect: true,   // искать свои иконки в assets/icons/<id>.png|webp|jpg; false — не искать (без лишних запросов)

  // Визуальные этапы: меняют цвет, декор и подпись главного экрана по самому «старшему» зданию
  stageScenes: {
    start:          { icon: '🎰', title: __t('СТАРТ'),     tagline: __t('всё только начинается'), props: ['🎰', '💰', '🎲'] },
    basement:       { icon: '🕳️', title: __t('ПОДВАЛ'),    tagline: __t('сырость, ящики, свечи'), pic: 'pic1.png', props: ['🕳️', '🐀', '📦', '🕯️', '🧱'] },
    garage:         { icon: '🚗', title: __t('ГАРАЖ'),     tagline: __t('машины и неон'), pic: 'pic2.png', props: ['🚗', '🔧', '💡', '🍸', '⛽'] },
    apartment:      { icon: '🛋️', title: __t('КВАРТИРА'),  tagline: __t('диван, телик, холодильник'), pic: 'pic3.png', props: ['🛋️', '📺', '🧊', '🖥️', '🪴'] },
    club:           { icon: '🍸', title: __t('КЛУБ'),      tagline: __t('сцена, неон, музыка'), pic: 'pic4.png', props: ['🎤', '🍹', '🎶', '🍸', '🎧'] },
    casinoBuilding: { icon: '🎰', title: __t('КАЗИНО'),    tagline: __t('автоматы и фишки'), pic: 'pic5.png', props: ['🎰', '🃏', '💎', '🎲', '🍀'] },
    tower:          { icon: '🏢', title: __t('БАШНЯ'),     tagline: __t('вид на ночной город'), pic: 'pic6.png', props: ['🏢', '🌃', '🗼', '🌙', '✨'] },
    city:           { icon: '🌆', title: __t('ГОРОД'),     tagline: __t('огромный мегаполис'), pic: 'pic7.png', props: ['🌆', '🚁', '🏟️', '🚦', '🏙️'] },
    empireCore:     { icon: '👑', title: __t('ИМПЕРИЯ'),   tagline: __t('система размером с мир'), pic: 'pic8.png', props: ['👑', '🚀', '🛰️', '🌌', '💠'] }
  },
  offline: {
    maxHours: 4,      // максимум засчитываемого отсутствия
    efficiency: 0.5,  // 50% от текущего базового дохода
    minSeconds: 20
  },
  // главный персонаж убран: в центре главного экрана теперь терминал слотов
};

function Utils_formatPreview(n) { return Utils.formatRate(n); }

/* ===================== LOCAL ASSETS =====================
   Все игровые фотографии/иконки лежат в assets/.
   Пользователь может заменять PNG 1254x1254, не меняя код.
*/
function assetIcon(id, alt='') {
  const icons = {
    clicks_10000:'🖱️', sofa:'🛋️', pc:'💻', vip:'💎', first_autoclicker:'🤖', first_click:'👆',
    secretSafe:'🧰', bar:'🍾', gamefloor:'🎮', vipcomnata:'👑', empire_full:'🏛️', finance:'💰',
    restaurant:'🍽️', earned_1b:'💵', kassa:'🏦', tv:'📺', bmw:'🚗', citiesE:'🌆', autoSpin:'🔄',
    earned_100000:'💰', criticalClick:'💥', tower:'🏙️', mall:'🏬', skyscrapers:'🏙️', factories:'🏭',
    first_crit:'💥', server:'🖥️', slots:'🎰', apartment:'🏠', vipzal:'💎', shelf:'📦', penthouse:'🏙️',
    empire_started:'🏗️', industrial:'🏭', fridge:'🧊', sound:'🔊', god_of_burmalda:'👑', pit:'🛠️',
    clicks_1000:'🖱️', earned_1m:'💰', dancefloor:'🕺', slotm:'🎰', downtown:'🌆', casinoNet:'🎰',
    vipfloor:'💎', offices:'🏢', first_jackpot:'🎰', ads_5:'📺', fleet:'🚘', city:'🌆', empireCore:'👑',
    stage:'🎵', bank:'🏦', clicks_100000:'🖱️', clicks_100:'🖱️', safe:'💰', seventeen32:'🔢',
    garage:'🚗', neon:'💡', stadium:'🏟️', stadiumE:'🏟️', casinoBuilding:'🎰', burmaldaMachine:'🏭',
    casinoIncome:'📈', casinoJackpot:'🎯', towerIncome:'📈', towerClick:'👆', cityIncome:'📈', cityJackpot:'🎯', coreIncome:'📈', coreClick:'👆', coreJackpot:'🎯',
    insurance:'🛡️', jackpotMagnet:'🧲', club:'🪩', lamp:'💡', charisma:'😎', spaceSlot:'🚀', basement:'🕳️', locked:'🔒', first_building:'🏚️', first_burmalda_machine:'🏭', upgrades_10:'🛒', goldenElevator:'🛗', space:'🚀', airport:'✈️', airportE:'✈️', residential:'🏘️', shops:'🏬', gamehall:'🎲'
  };
  const emoji = icons[id] || '⭐';
  const safeAlt = String(alt).replace(/"/g, '&quot;');
  // Своя картинка находится автоматически: положите assets/icons/<id>.png (или .webp / .jpg / .jpeg), списков не нужно.
  const found = AssetManager.iconPaths[id];
  if (typeof found === 'string') {
    const photo = /\.jpe?g$/i.test(found) ? ' photo' : '';
    return `<img class="game-asset-icon${photo}" src="${found}?v=${BUILD_ID}" alt="${safeAlt}" onerror="this.outerHTML='<span class=&quot;game-asset-icon emoji-asset&quot; role=&quot;img&quot;>${emoji}</span>'">`;
  }
  if (found === undefined && CONFIG.iconAutoDetect !== false) AssetManager.probeIcon(id);
  return `<span class="game-asset-icon emoji-asset" role="img" aria-label="${safeAlt}">${emoji}</span>`;
}


/* =====================================================================
   2. GAME_CONFIG.empire — вся экономика системы «ИМПЕРИЯ» в одном месте
   ===================================================================== */
const GAME_CONFIG = {
  empire: {
    buildingCostGrowth: 1.55,   // запасной коэффициент роста, если у здания нет своего
    upgradeCostGrowth: 1.45,    // запасной коэффициент роста внутренних улучшений
    lateGameCostGrowth: 1.55,    // применяется автоматически к последним 2 зданиям
    levelsPerVisualStage: 10,   // раз в сколько уровней меняется визуальная стадия здания

    buildings: [
      {
        id: 'basement', name: __t('ПОДВАЛ'), icon: '🕳',
        unlockCost: 500,
        unlockRequirements: [],
        baseIncome: 5,
        levelIncomeGrowth: 1.35,
        levelCostGrowth: 1.30,
        stageNames: [__t('Старый подвал'), __t('Обустроенный подвал'), __t('Укреплённый подвал'), __t('VIP-подвал'), __t('МЕГА-подвал')],
        stageIcons: ['🕳', '🕳', '🕳', '🕳', '🕳'],
        subUpgrades: [
          { id: 'shelf', name: __t('Стеллажи'), icon: '📦', baseCost: 150, costGrowth: 1.30, effect: 'addIncome', amount: 0.5 },
          { id: 'lamp', name: __t('Лампа'), icon: '💡', baseCost: 400, costGrowth: 1.32, effect: 'multiplyBuilding', amount: 0.04 }
        ]
      },
      {
        id: 'garage', name: __t('ГАРАЖ'), icon: '🚗',
        unlockCost: 25000,
        unlockRequirements: [{ type: 'buildingLevel', building: 'basement', value: 8 }],
        baseIncome: 120,
        levelIncomeGrowth: 1.36,
        levelCostGrowth: 1.31,
        stageNames: [__t('Старый гараж'), __t('Нормальный гараж'), __t('Навороченный гараж'), __t('VIP-гараж'), __t('МЕГА-ГАРАЖ')],
        stageIcons: ['🚗', '🚗', '🚗', '🚗', '🚗'],
        subUpgrades: [
          { id: 'bmw', name: __t('Старый BMW'), icon: '🚗', baseCost: 1200, costGrowth: 1.34, effect: 'addIncome', amount: 8 },
          { id: 'neon', name: __t('Неоновая вывеска'), icon: '💡', baseCost: 2500, costGrowth: 1.36, effect: 'multiplyBuilding', amount: 0.05 },
          { id: 'slotm', name: __t('Игровой автомат'), icon: '🎰', baseCost: 4000, costGrowth: 1.38, effect: 'addIncome', amount: 12 },
          { id: 'pit', name: __t('Ремонтная яма'), icon: '🛠', baseCost: 3200, costGrowth: 1.36, effect: 'addIncome', amount: 10 }
        ]
      },
      {
        id: 'apartment', name: __t('КВАРТИРА'), icon: '🏠',
        unlockCost: 750000,
        unlockRequirements: [{ type: 'buildingLevel', building: 'garage', value: 10 }],
        baseIncome: 750,
        levelIncomeGrowth: 1.38,
        levelCostGrowth: 1.33,
        stageNames: [__t('Съёмная квартира'), __t('Своя квартира'), __t('После ремонта'), __t('Дизайнерская'), __t('Пентхаус')],
        stageIcons: ['🏠', '🏠', '🏠', '🏠', '🏠'],
        subUpgrades: [
          { id: 'sofa', name: __t('Диван'), icon: '🛋', baseCost: 9000, costGrowth: 1.4, effect: 'addIncome', amount: 25 },
          { id: 'tv', name: __t('Телевизор'), icon: '📺', baseCost: 13000, costGrowth: 1.45, effect: 'addIncome', amount: 30 },
          { id: 'pc', name: __t('Компьютер'), icon: '💻', baseCost: 16000, costGrowth: 1.45, effect: 'addIncome', amount: 35 },
          { id: 'fridge', name: __t('Холодильник'), icon: '🧊', baseCost: 11000, costGrowth: 1.4, effect: 'addIncome', amount: 25 },
          { id: 'safe', name: __t('Сейф'), icon: '💰', baseCost: 22000, costGrowth: 1.5, effect: 'addIncome', amount: 45 }
        ]
      },
      {
        id: 'club', name: __t('КЛУБ'), icon: '💃🏻',
        unlockCost: 20000000,
        unlockRequirements: [
          { type: 'buildingLevel', building: 'apartment', value: 12 },
          { type: 'totalClicks', value: 500 }
        ],
        baseIncome: 10000,
        levelIncomeGrowth: 1.40,
        levelCostGrowth: 1.35,
        stageNames: [__t('Подвальный клуб'), __t('Городской клуб'), __t('Модный клуб'), __t('VIP-клуб'), __t('Легендарный клуб')],
        stageIcons: ['💃🏻', '💃🏻', '💃🏻', '💃🏻', '💃🏻'],
        subUpgrades: [
          { id: 'stage', name: __t('Сцена'), icon: '🎵', baseCost: 90000, costGrowth: 1.45, effect: 'addIncome', amount: 150 },
          { id: 'bar', name: __t('Бар'), icon: '🍾', baseCost: 110000, costGrowth: 1.45, effect: 'multiplyBuilding', amount: 0.05 },
          { id: 'dancefloor', name: __t('Танцпол'), icon: '🕺', baseCost: 130000, costGrowth: 1.5, effect: 'eventChance', amount: 0.2 },
          { id: 'vip', name: __t('VIP-комната'), icon: '💎', baseCost: 160000, costGrowth: 1.5, effect: 'rareRewardBonus', amount: 2 },
          { id: 'sound', name: __t('Звуковая система'), icon: '🔊', baseCost: 140000, costGrowth: 1.48, effect: 'boostEffectiveness', amount: 3 }
        ]
      },
      {
        id: 'casinoBuilding', name: __t('КАЗИНО'), icon: '🎰',
        unlockCost: 500000000,
        unlockRequirements: [{ type: 'buildingLevel', building: 'club', value: 15 }],
        baseIncome: 190000,
        levelIncomeGrowth: 1.42,
        levelCostGrowth: 1.37,
        stageNames: [__t('Подпольное казино'), __t('Городское казино'), __t('Роскошное казино'), __t('VIP-казино'), __t('Казино-легенда')],
        stageIcons: ['🎰', '🎰', '🎰', '🎰', '🎰'],
        subUpgrades: [
          { id: 'slots', name: __t('Игровые автоматы'), icon: '🎰', baseCost: 950000, costGrowth: 1.48, effect: 'addIncome', amount: 900 },
          { id: 'gamehall', name: __t('Зал игр'), icon: '🎲', baseCost: 1250000, costGrowth: 1.5, effect: 'multiplyBuilding', amount: 0.05 },
          { id: 'vipzal', name: __t('VIP-зал'), icon: '💎', baseCost: 1550000, costGrowth: 1.5, effect: 'rareRewardBonus', amount: 3 },
          { id: 'kassa', name: __t('Касса'), icon: '🏦', baseCost: 1350000, costGrowth: 1.48, effect: 'addIncome', amount: 1200 },
          { id: 'vipcomnata', name: __t('VIP-комната'), icon: '👑', baseCost: 2100000, costGrowth: 1.52, effect: 'eventChance', amount: 0.3 }
        ]
      },
      {
        id: 'tower', name: __t('БАШНЯ'), icon: '🏙',
        unlockCost: 20000000000,
        unlockRequirements: [{ type: 'buildingLevel', building: 'casinoBuilding', value: 18 }],
        baseIncome: 3500000,
        levelIncomeGrowth: 1.44,
        levelCostGrowth: 1.39,
        stageNames: [__t('Стройка'), __t('Бизнес-центр'), __t('Элитная башня'), __t('Мега-башня'), __t('Империя-Тауэр')],
        stageIcons: ['🏗', '🏗', '🏗', '🏗', '🏗'],
        subUpgrades: [
          { id: 'offices', name: __t('Этаж 1 — Офисы'), icon: '🏢', baseCost: 8500000, costGrowth: 1.5, effect: 'addIncome', amount: 5000 },
          { id: 'shops', name: __t('Этаж 2 — Магазины'), icon: '🏬', baseCost: 10500000, costGrowth: 1.5, effect: 'addIncome', amount: 6500 },
          { id: 'restaurant', name: __t('Этаж 3 — Ресторан'), icon: '🍽', baseCost: 14500000, costGrowth: 1.52, effect: 'addIncome', amount: 8500 },
          { id: 'gamefloor', name: __t('Этаж 4 — Игровая зона'), icon: '🎮', baseCost: 18500000, costGrowth: 1.52, effect: 'eventChance', amount: 0.3 },
          { id: 'vipfloor', name: __t('Этаж 5 — VIP'), icon: '💎', baseCost: 24500000, costGrowth: 1.55, effect: 'rareRewardBonus', amount: 4 },
          { id: 'server', name: __t('Этаж 6 — Серверная'), icon: '🖥', baseCost: 30500000, costGrowth: 1.55, effect: 'multiplyBuilding', amount: 0.04 },
          
        ]
      },
      {
        id: 'city', name: __t('ГОРОД'), icon: '🌆',
        unlockCost: 100000000000, // 1T
        unlockRequirements: [{ type: 'buildingLevel', building: 'tower', value: 1 }],
        baseIncome: 113000000,
        levelIncomeGrowth: 1.46,
        levelCostGrowth: 1.40,
        stageNames: [__t('Посёлок'), __t('Городок'), __t('Мегаполис'), __t('Столица'), __t('Мировая столица')],
        stageIcons: ['🌆', '🌆', '🌆', '🌆', '🌆'],
        subUpgrades: [
          { id: 'industrial', name: __t('Промзона'), icon: '🏭', baseCost: 5000000000, costGrowth: 1.55, effect: 'addIncome', amount: 30000 },
          { id: 'residential', name: __t('Жилой район'), icon: '🏘', baseCost: 7000000000, costGrowth: 1.55, effect: 'addIncome', amount: 40000 },
          { id: 'mall', name: __t('Торговый центр'), icon: '🏬', baseCost: 90000000, costGrowth: 1.56, effect: 'addIncome', amount: 50000 },
          { id: 'stadium', name: __t('Стадион'), icon: '🏟', baseCost: 120000000, costGrowth: 1.58, effect: 'eventChance', amount: 0.4 },
          { id: 'downtown', name: __t('Центр'), icon: '🌃', baseCost: 150000000, costGrowth: 1.6, effect: 'multiplyBuilding', amount: 0.05 },
          { id: 'airport', name: __t('Аэропорт'), icon: '✈️', baseCost: 200000000, costGrowth: 1.6, effect: 'addIncome', amount: 80000 },
        ]
      },
      {
        id: 'empireCore', name: __t('ИМПЕРИЯ'), icon: '👑',
        unlockCost: 75000000000000, // 75T
        unlockRequirements: [{ type: 'buildingLevel', building: 'city', value: 25 }],
        baseIncome: 3170000000,
        levelIncomeGrowth: 1.48,
        levelCostGrowth: 1.41,
        stageNames: [__t('Молодая империя'), __t('Растущая империя'), __t('Великая империя'), __t('Мировая держава'), __t('БУРМАЛДА БОГ ИМПЕРИИ')],
        stageIcons: ['👑', '👑', '👑', '👑', '👑'],
        subUpgrades: [
          { id: 'bank', name: __t('Банк'), icon: '🏦', baseCost: 5000000000, costGrowth: 1.6, effect: 'addIncome', amount: 200000 },
          { id: 'skyscrapers', name: __t('Небоскрёбы'), icon: '🏙', baseCost: 7000000000, costGrowth: 1.6, effect: 'addIncome', amount: 250000 },
          { id: 'factories', name: __t('Предприятия'), icon: '🏭', baseCost: 9000000000, costGrowth: 1.62, effect: 'addIncome', amount: 300000 },
          { id: 'fleet', name: __t('Автопарк'), icon: '🚗', baseCost: 11000000000, costGrowth: 1.62, effect: 'addIncome', amount: 350000 },
          { id: 'airportE', name: __t('Аэропорт'), icon: '✈️', baseCost: 14000000000, costGrowth: 1.64, effect: 'addIncome', amount: 400000 },
          { id: 'casinoNet', name: __t('Казино-сеть'), icon: '🎰', baseCost: 18000000000, costGrowth: 1.65, effect: 'eventChance', amount: 0.5 },
          { id: 'stadiumE', name: __t('Стадион'), icon: '🏟', baseCost: 22000000000, costGrowth: 1.65, effect: 'addIncome', amount: 500000 },
          { id: 'citiesE', name: __t('Города'), icon: '🌆', baseCost: 28000000000, costGrowth: 1.68, effect: 'multiplyBuilding', amount: 0.06 },
          { id: 'space', name: __t('Космическая программа'), icon: '🚀', baseCost: 50000000000, costGrowth: 1.7, effect: 'addIncome', amount: 700000 }
        ]
      }
    ],

    // потолки задаются в блоке caps ниже (по зданию и по типу эффекта)

    // секретные улучшения — открываются условиями, не покупаются напрямую
    secrets: [
      { id: 'goldenElevator', name: __t('ЗОЛОТОЙ ЛИФТ'), icon: '🛗', desc: __t('Башня уровня 25'), bonus: 50000, check: (s, EmpireSystem) => EmpireSystem.getLevel('tower') >= 25 },
      { id: 'secretSafe', name: __t('СЕКРЕТНЫЙ СЕЙФ'), icon: '🗝', desc: __t('Заработать 1 миллиард'), bonus: 100000, check: (s) => s.stats.totalEarned >= 1000000000 },
      { id: 'spaceSlot', name: __t('КОСМИЧЕСКИЙ АВТОМАТ'), icon: '🛸', desc: __t('Получить 10 джекпотов'), bonus: 250000, check: (s) => s.stats.jackpots >= 10 },
      { id: 'seventeen32', name: '17/32', icon: '🔢', desc: __t('Сделать 1732 клика'), bonus: 77777, check: (s) => s.stats.totalClicks >= 1732 }
    ]
  }
};

// Потолки уровней зданий: чуть выше требований для следующего здания,
// чтобы нельзя было бесконечно качать Подвал и обходить цепочку Империи.
(function () {
  // Потолки под-улучшений: окупаемость плоских бонусов падает, поэтому глубже они не нужны.
  const flatCap = { basement: 15, garage: 15, apartment: 15, club: 12, casinoBuilding: 12, tower: 10, city: 10, empireCore: 8 };
  const specialCap = { eventChance: 5, rareRewardBonus: 10, boostEffectiveness: 10 };
  GAME_CONFIG.empire.buildings.forEach((b) => b.subUpgrades.forEach((su) => {
    su.maxLevel = specialCap[su.effect] || flatCap[b.id] || 10;
  }));
})();
// ===== Экономика после казино: внутренние улучшения должны окупаться и давать множители =====
// Новые эффекты (глобальные, суммируются по зданиям): globalIncome (% ко всему пассивному доходу),
// clickPower (% к клику), jackpotPower (% к награде безумного джекпота).
// Цена = доход здания × доля эффекта × PAYBACK_SEC (≈ окупаемость первого уровня), далее рост ×1.35 за уровень.
(function () {
  const NEWG = 1.45; // рост цены внутренних улучшений после казино
  const B = (id) => GAME_CONFIG.empire.buildings.find((b) => b.id === id);
  const add = (id, list) => list.forEach((x) => B(id).subUpgrades.push(Object.assign({ costGrowth: NEWG, maxLevel: 10 }, x)));
  add('casinoBuilding', [
    { id: 'casinoIncome', name: __t('Маркетинг'), icon: '📈', effect: 'globalIncome', amount: 2 },
    { id: 'casinoJackpot', name: __t('Золотой автомат'), icon: '🎯', effect: 'jackpotPower', amount: 4 }
  ]);
  add('tower', [
    { id: 'towerIncome', name: __t('Этаж 7 — Биржа'), icon: '📈', effect: 'globalIncome', amount: 2 },
    { id: 'towerClick', name: __t('Этаж 8 — Тренажёрка'), icon: '👆', effect: 'clickPower', amount: 3 }
  ]);
  add('city', [
    { id: 'cityIncome', name: __t('Свободная экономзона'), icon: '📈', effect: 'globalIncome', amount: 2 },
    { id: 'cityJackpot', name: __t('Городская лотерея'), icon: '🎯', effect: 'jackpotPower', amount: 4 }
  ]);
  add('empireCore', [
    { id: 'coreIncome', name: __t('Мировая торговля'), icon: '📈', effect: 'globalIncome', amount: 3 },
    { id: 'coreClick', name: __t('Культ Бурмалды'), icon: '👆', effect: 'clickPower', amount: 4 },
    { id: 'coreJackpot', name: __t('Империя удачи'), icon: '🎯', effect: 'jackpotPower', amount: 5 }
  ]);
  const PAYBACK_SEC = 900, SHARE = 0.7;
  ['casinoBuilding', 'tower', 'city', 'empireCore'].forEach((id) => {
    const b = B(id);
    b.subUpgrades.forEach((su) => {
      su.costGrowth = Math.min(su.costGrowth, NEWG);
      if (su.effect === 'addIncome') {            // плоский бонус: ~1,2% базового дохода здания за уровень
        su.amount = Math.round(b.baseIncome * 0.012);
        su.baseCost = Math.round(su.amount * PAYBACK_SEC);
      } else if (su.effect === 'multiplyBuilding') {
        su.baseCost = Math.round(b.baseIncome * su.amount * PAYBACK_SEC);
      } else if (su.effect === 'globalIncome' || su.effect === 'clickPower' || su.effect === 'jackpotPower') {
        su.baseCost = Math.round(b.baseIncome * (su.amount / 100) * PAYBACK_SEC * SHARE);
      }
    });
  });
})();
// ===== Баланс поздней игры (проверено симуляцией) =====
// Начиная с казино цена уровня растёт так же быстро, как доход здания (окупаемость уровня не падает до нуля),
// а Башня/Город/Империя дороже в ×1.5 / ×1.5 / ×2 — чтобы после казино не пролетать здания за минуты.
(function () {
  const unlockMult = { tower: 1.5, city: 1.5, empireCore: 2 };
  GAME_CONFIG.empire.buildings.forEach((b) => {
    if (['casinoBuilding', 'tower', 'city', 'empireCore'].includes(b.id)) b.levelCostGrowth = b.levelIncomeGrowth;
    if (unlockMult[b.id]) b.unlockCost *= unlockMult[b.id];
  });
})();
(function () { const caps = { basement: 20, garage: 22, apartment: 24, club: 27, casinoBuilding: 30, tower: 34, city: 37, empireCore: 40 };
  GAME_CONFIG.empire.buildings.forEach((b) => { b.maxLevel = caps[b.id] || 40; }); })();

/* =====================================================================
   3. PHRASES
   ===================================================================== */
const PHRASES = {
  investment: [__t('ЕСТЬ ТЕМА'), __t('БРАТ, ТОЛЬКО НИКОМУ НЕ ГОВОРИ'), __t('СХЕМА ЖЕЛЕЗНАЯ'), __t('НУЖНЫ ДЕНЬГИ - ЕСТЬ ВАРИАНТ')],
  click: [__t('ВОТ ЭТО ЗАВОЗ'), __t('БУРМАЛДА ПОШЛА'), __t('ЕЩЁ КРУТКА'),  __t('ПОШЛА РАСКРУТКА!'), __t('БУРМАЛДА НЕ ОСТАНОВИТЬ'), __t('ЗАВОЗ ИДЁТ')],
  rare: [__t('ЭТО УЖЕ СЛИШКОМ'), __t('ТЫ ЧТО НАТВОРИЛ'), __t('КАЗИНО УЖЕ ТВОЁ'), __t('ЛАС-ВЕГАС ПОКУПАЕМ'), __t('АМ АМ АМ')],
  jackpot: [__t('ДЖЕКПОТ БУРМАЛДЫ'), __t('ТЫ ЧТО НАТВОРИЛ'), __t('БУРМАЛДА БУМ'), __t('НЕСИТЕ ЧЕМОДАНЫ!'), __t('ЛУУУУУУУТ!!!')],
  lose: [__t('НЕ ПОВЕЗЛО'), __t('МИМО'), __t('В СЛЕДУЮЩИЙ РАЗ'), __t('БУРМАЛДА ОТДЫХАЕТ'), __t('ПЛАКИ-ПЛАКИ'), __t('НЕ ЗАЛЕТЕЛО'), __t('СЕЙЧАС ОТЫГРАЕМСЯ')],
  levelUp: [__t('ИКСЫ СТАНОВЯТСЯ ЖИРНЕЕ!'), __t('БУРМАЛДУ НЕ ОСТАНОВИТЬ'), __t('КАЗИНО УЖЕ ТВОЁ')],
  event: [__t('БУРМАЛДА БУМ'), __t('ПОШЛА ДВИЖУХА!'), __t('ЗАВОЗ ИДЁТ')],
  buildingPurchased: [__t('ТЫ КУПИЛ НОВУЮ СОБСТВЕННОСТЬ'), __t('ТЕПЕРЬ ЭТО ТВОЙ БИЗНЕС'), __t('ИМПЕРИЯ РАСТЁТ')]
};
function randomPhrase(category) {
  const arr = PHRASES[category] || PHRASES.click;
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =====================================================================
   4. Utils
   ===================================================================== */
const Utils = {
  /** Для доходов в секунду: у малых чисел показываем дробную часть (8,5 вместо 8). */
  formatRate(num) {
    num = Utils.safeNumber(num);
    if (num >= 1000) return Utils.formatNumber(num);
    if (Number.isInteger(num)) return String(num);
    const k = num < 100 ? 100 : 10;
    return (Math.round(num * k) / k).toString().replace('.', DEC);
  },
  formatPercentRu(p) { return (Math.round(p * 100) / 100).toString().replace('.', DEC) + '%'; },
  // числа в игре Империи выходят далеко за Number.MAX_SAFE_INTEGER —
  // разрешаем это (double всё ещё даёт разумную точность для отображения),
  // но жёстко защищаемся от NaN/Infinity/отрицательных значений.
  SAFE_CAP: 1e30,

  safeNumber(n) {
    n = Number(n);
    if (isNaN(n)) return 0;
    if (n === Infinity) return Utils.SAFE_CAP; // переполнение — потолок, а не 0 (иначе апгрейды становятся "бесплатными")
    if (n < 0) return 0; // сюда же попадает -Infinity
    if (n > Utils.SAFE_CAP) return Utils.SAFE_CAP;
    return n;
  },
  safeNumberAllowNegative(n) {
    n = Number(n);
    if (isNaN(n)) return 0;
    if (n === Infinity) return Utils.SAFE_CAP;
    if (n === -Infinity) return -Utils.SAFE_CAP;
    if (n > Utils.SAFE_CAP) return Utils.SAFE_CAP;
    if (n < -Utils.SAFE_CAP) return -Utils.SAFE_CAP;
    return n;
  },
  clamp(n, min, max) { return Math.min(max, Math.max(min, n)); },
  randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  randomFloat(min, max) { return Math.random() * (max - min) + min; },
  chance(percent) { return Math.random() * 100 < percent; },
  now() { return Date.now(); },
  todayStr(date) {
    const d = date || new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  },
  daysBetween(strA, strB) {
    try {
      const a = new Date(strA);
      const b = new Date(strB);
      const diffMs = new Date(b.getFullYear(), b.getMonth(), b.getDate()) -
                     new Date(a.getFullYear(), a.getMonth(), a.getDate());
      return Math.round(diffMs / 86400000);
    } catch (e) { return 999; }
  },
  formatNumber(num) {
    num = Utils.safeNumber(num);
    if (num < 1000) return String(Math.floor(num));
    if (num < 1e6) {
      return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, LANG === 'en' ? ',' : ' ');
    }
    const units = [
      { v: 1e33, s: 'Dc' }, { v: 1e30, s: 'No' }, { v: 1e27, s: 'Oc' },
      { v: 1e24, s: 'Sp' }, { v: 1e21, s: 'Sx' }, { v: 1e18, s: 'Qi' },
      { v: 1e15, s: 'Qa' }, { v: 1e12, s: 'T' }, { v: 1e9, s: 'B' }, { v: 1e6, s: 'M' }
    ];
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (num >= u.v) {
        let val = num / u.v;
        let str = val >= 100 ? val.toFixed(0) : (val >= 10 ? val.toFixed(1) : val.toFixed(2));
        str = str.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
        return str + u.s;
      }
    }
    return num.toExponential(2);
  },
  formatTime(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(Utils.safeNumber(totalSeconds)));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return __tt`${h}ч ${m}м`;
    if (m > 0) return __tt`${m}м ${s}с`;
    return __tt`${s}с`;
  },
  weightedPick(items, weightKey) {
    const total = items.reduce((sum, it) => sum + Math.max(0, it[weightKey]), 0);
    if (total <= 0) return items[0];
    let roll = Math.random() * total;
    for (const it of items) {
      roll -= Math.max(0, it[weightKey]);
      if (roll <= 0) return it;
    }
    return items[items.length - 1];
  }
};

/* =====================================================================
   5. AssetManager
   ===================================================================== */
const AssetManager = {
  cache: {},
  /** Свои иконки: assets/icons/<id>.png (также .webp / .jpg / .jpeg). undefined — не проверялось, null — проверяется, false — нет файла, строка — путь. */
  iconPaths: {},
  iconExts: ['png', 'webp', 'jpg', 'jpeg'],
  probeIcon(id) {
    if (this.iconPaths[id] !== undefined) return;
    this.iconPaths[id] = null;
    let i = 0;
    const next = () => {
      if (i >= this.iconExts.length) { this.iconPaths[id] = false; return; }
      const path = 'assets/icons/' + id + '.' + this.iconExts[i++];
      const im = new Image();
      im.onload = () => { this.iconPaths[id] = path; if (typeof UI !== 'undefined' && UI.refreshActiveScreen) UI.refreshActiveScreen(); };
      im.onerror = next;
      im.src = path + '?v=' + BUILD_ID;
    };
    next();
  },
  checkImage(path) {
    if (this.cache[path] !== undefined) return Promise.resolve(this.cache[path]);
    return new Promise((resolve) => {
      const img = new Image();
      let settled = false;
      const finish = (ok, confirmed) => {
        if (settled) return;
        settled = true;
        // кэшируем только ПОДТВЕРЖДЁННЫЙ результат (onload/onerror). Если сработал
        // только страховочный таймаут, не отравляем кэш значением false навсегда —
        // иначе медленно (но успешно) загружающаяся реальная картинка пользователя
        // навечно застрянет как "отсутствующая" до перезагрузки страницы.
        if (confirmed) this.cache[path] = ok;
        resolve(ok);
      };
      img.onload = () => finish(true, true);
      img.onerror = () => finish(false, true);
      try { img.src = path; } catch (e) { finish(false, true); }
      setTimeout(() => finish(false, false), 6000);
    });
  },
  applyImage(path, imgEl, placeholderEl, placeholderNameEl) {
    if (placeholderNameEl) placeholderNameEl.textContent = path.split('/').pop();
    this.checkImage(path).then((exists) => {
      if (exists) {
        imgEl.src = path;
        imgEl.classList.remove('hidden');
        if (placeholderEl) placeholderEl.classList.add('hidden');
      } else {
        imgEl.classList.add('hidden');
        imgEl.removeAttribute('src');
        if (placeholderEl) placeholderEl.classList.remove('hidden');
      }
    }).catch(() => { imgEl.classList.add('hidden'); if (placeholderEl) placeholderEl.classList.remove('hidden'); });
  },
  applyBackground(path, imgEl, placeholderEl, placeholderNameEl) {
    this.applyImage(path, imgEl, placeholderEl, placeholderNameEl);
  },
  buildThumb(path, altText, container) {
    const img = document.createElement('img');
    img.alt = altText || '';
    img.classList.add('hidden');
    const label = document.createElement('span');
    label.textContent = (path.split('/').pop() || '').toUpperCase();
    container.appendChild(label);
    container.appendChild(img);
    this.checkImage(path).then((exists) => {
      if (exists) { img.src = path; img.classList.remove('hidden'); label.classList.add('hidden'); }
    });
  }
};

/* =====================================================================
   6. AudioManager
   ===================================================================== */
const AudioManager = {
  enabled: true,
  volume: 1,          // общий ползунок 0..1 (хранится отдельно от сохранения игры)
  baseVolume: 0.6,    // базовая громкость эффектов
  suspended: false,   // временно без звука (реклама)
  // Все пользовательские звуки лежат в assets/sounds.
  // Просто заменяй MP3-файл с тем же именем — код менять не нужно.
  sounds: {
    click: 'assets/sounds/click.mp3',
    buy: 'assets/sounds/buy.mp3',
    critical: 'assets/sounds/critical.mp3',
    levelup: 'assets/sounds/levelup.mp3',
    jackpot: 'assets/sounds/jackpot.mp3',
    event: 'assets/sounds/event.mp3',
    daily: 'assets/sounds/daily.mp3',
    lose: 'assets/sounds/lose.mp3'
  },
  elements: {}, availability: {}, audioCtx: null,

  init() {
    Object.keys(this.sounds).forEach((key) => {
      const el = new Audio();
      el.preload = 'auto';
      // Убираем кэш, чтобы после замены файла новый звук подхватывался сразу.
      el.src = this.sounds[key] + '?v=' + Date.now();
      el.volume = 0.6;
      let resolved = false;
      el.addEventListener('canplaythrough', () => { if (!resolved) { resolved = true; this.availability[key] = true; } });
      el.addEventListener('error', () => { if (!resolved) { resolved = true; this.availability[key] = false; } });
      this.elements[key] = el;
      setTimeout(() => { resolved = true; }, 3000);
    });
  },

  playFallbackBeep(kind) {
    try {
      if (!this.audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.audioCtx = new AC();
      }
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const freqMap = { click: 520, buy: 660, critical: 820, levelup: 900, jackpot: 1000, event: 760, daily: 700, lose: 220 };
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = kind === 'jackpot' ? 'sawtooth' : (kind === 'lose' ? 'triangle' : 'sine');
      osc.frequency.value = freqMap[kind] || 500;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.002, 0.15 * this.volume), ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },

  play(key) {
    if (!this.enabled || this.suspended || this.volume <= 0) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    const el = this.elements[key];
    if (el && this.availability[key] !== false) {
      try {
        const clone = el.cloneNode(true); clone.volume = Math.min(1, this.baseVolume * this.volume);
        const p = clone.play();
        if (p && typeof p.catch === 'function') p.catch(() => { this.availability[key] = false; this.playFallbackBeep(key); });
      } catch (e) { this.playFallbackBeep(key); }
    } else {
      this.playFallbackBeep(key);
    }
  },

  setEnabled(value) {
    this.enabled = !!value;
    try { localStorage.setItem('burmalda_sound_enabled', this.enabled ? '1' : '0'); } catch (e) {}
  },
  setVolume(v) {
    const n = Number(v);
    this.volume = Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 1;
    try { localStorage.setItem('burmalda_sound_volume', String(Math.round(this.volume * 100) / 100)); } catch (e) {}
  },
  loadSetting() {
    try { const v = localStorage.getItem('burmalda_sound_enabled'); this.enabled = v === null ? true : v === '1'; }
    catch (e) { this.enabled = true; }
    try {
      const raw = localStorage.getItem('burmalda_sound_volume'); const n = raw === null ? NaN : Number(raw);
      this.volume = Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 1;
    } catch (e) { this.volume = 1; }
    return this.enabled;
  }
};

/* =====================================================================
   7. GameState
   ===================================================================== */
const GameState = {
  data: null,

  defaults() {
    const upgrades = {};
    CONFIG.upgrades.forEach((u) => { upgrades[u.id] = 0; });

    const empireBuildings = {};
    GAME_CONFIG.empire.buildings.forEach((b) => {
      const sub = {};
      b.subUpgrades.forEach((su) => { sub[su.id] = 0; });
      empireBuildings[b.id] = { level: 0, sub };
    });

    return {
      balance: CONFIG.startingBalance,
      level: 1,
      xp: 0,
      upgrades,
      achievements: {},
      daily: { streak: 0, lastClaimDateStr: null, doubledToday: false },
      soundEnabled: true,
      lastSaveTimestamp: Utils.now(),
      firstSessionStart: Utils.now(),
      finalStageShown: false,
      // временные баффы — сохраняются, т.к. это метки реального времени
      // (Date.now()-based), и должны переживать перезагрузку страницы
      temp: { boomUntil: 0, adBoostUntil: 0, superClickReady: false, clickBoostUntil: 0, passiveBoostUntil: 0, winningsBoostUntil: 0, critBoostUntil: 0, jackpotBoostUntil: 0, allBoostUntil: 0, adCooldownUntil: 0, machineBrokenUntil: 0 },
      tutorial: { welcomeShown: false, done: false, seenTabs: {} },
      offline: { pending: 0, seconds: 0 },
      investment: { lastOfferAt: 0, pending: false },
      events: { taxPending: false, taxLastAt: 0, brokenPending: false, brokenLastAt: 0 },
      empire: {
        buildings: empireBuildings,
        secretsUnlocked: {}
      },
      stats: {
        totalClicks: 0, totalEarned: 0, totalLost: 0, criticalHits: 0, jackpots: 0, bigWins: 0, losses: 0,
        upgradesBought: 0, adsWatched: 0, playTimeSec: 0, maxBalance: 0
      }
    };
  },

  sanitize(raw) {
    const def = this.defaults();
    if (!raw || typeof raw !== 'object') return def;
    const s = def;
    s.balance = Utils.safeNumber(raw.balance);
    s.level = Utils.clamp(Math.floor(Utils.safeNumber(raw.level)) || 1, 1, 999999);
    s.xp = Utils.safeNumber(raw.xp);
    s.soundEnabled = raw.soundEnabled !== false;
    s.lastSaveTimestamp = Utils.safeNumber(raw.lastSaveTimestamp) || Utils.now();
    s.firstSessionStart = Utils.safeNumber(raw.firstSessionStart) || Utils.now();
    s.finalStageShown = !!raw.finalStageShown;
    if (raw.temp && typeof raw.temp === 'object') {
      s.temp.boomUntil = Utils.safeNumber(raw.temp.boomUntil);
      s.temp.adBoostUntil = Utils.safeNumber(raw.temp.adBoostUntil);
      s.temp.superClickReady = !!raw.temp.superClickReady;
      s.temp.clickBoostUntil = Utils.safeNumber(raw.temp.clickBoostUntil);
      s.temp.passiveBoostUntil = Utils.safeNumber(raw.temp.passiveBoostUntil);
      s.temp.winningsBoostUntil = Utils.safeNumber(raw.temp.winningsBoostUntil);
      s.temp.critBoostUntil = Utils.safeNumber(raw.temp.critBoostUntil);
      s.temp.jackpotBoostUntil = Utils.safeNumber(raw.temp.jackpotBoostUntil);
      s.temp.allBoostUntil = Utils.safeNumber(raw.temp.allBoostUntil);
      s.temp.adCooldownUntil = Utils.safeNumber(raw.temp.adCooldownUntil);
      s.temp.machineBrokenUntil = Utils.safeNumber(raw.temp.machineBrokenUntil);
    }
    if (raw.offline && typeof raw.offline === 'object') {
      s.offline.pending = Math.max(0, Utils.safeNumber(raw.offline.pending));
      s.offline.seconds = Math.max(0, Utils.safeNumber(raw.offline.seconds));
    }
    if (raw.investment && typeof raw.investment === 'object') {
      s.investment.lastOfferAt = Math.max(0, Utils.safeNumber(raw.investment.lastOfferAt));
      s.investment.pending = !!raw.investment.pending; // старый формат (объект ставки) тоже = «предложение висит»
    }
    if (raw.events && typeof raw.events === 'object') {
      s.events.taxPending = !!raw.events.taxPending;
      s.events.taxLastAt = Math.max(0, Utils.safeNumber(raw.events.taxLastAt));
      s.events.brokenPending = !!raw.events.brokenPending;
      s.events.brokenLastAt = Math.max(0, Utils.safeNumber(raw.events.brokenLastAt));
    }

    if (raw.upgrades && typeof raw.upgrades === 'object') {
      CONFIG.upgrades.forEach((u) => {
        const lvl = Math.floor(Utils.safeNumber(raw.upgrades[u.id]));
        s.upgrades[u.id] = Utils.clamp(lvl, 0, u.maxLevel || 100000);
      });
    }
    // обучение: старые сохранения (игрок уже играл) считаем пройденным, новичку покажем приветствие
    const rt = raw.tutorial;
    if (rt && typeof rt === 'object') {
      s.tutorial = { welcomeShown: !!rt.welcomeShown, done: !!rt.done, seenTabs: { shop: !!(rt.seenTabs && rt.seenTabs.shop), empire: !!(rt.seenTabs && rt.seenTabs.empire), more: !!(rt.seenTabs && rt.seenTabs.more) } };
    } else if ((raw.stats && Utils.safeNumber(raw.stats.totalClicks) > 0) || Utils.safeNumber(raw.level) > 1) {
      s.tutorial = { welcomeShown: true, done: true, seenTabs: { shop: true, empire: true, more: true } };
    }
    if (raw.achievements && typeof raw.achievements === 'object') {
      Object.keys(raw.achievements).forEach((k) => { if (Achievements.list.some((a) => a.id === k)) s.achievements[k] = !!raw.achievements[k]; });
    }
    if (raw.daily && typeof raw.daily === 'object') {
      s.daily.streak = Utils.clamp(Math.floor(Utils.safeNumber(raw.daily.streak)), 0, 7);
      s.daily.lastClaimDateStr = typeof raw.daily.lastClaimDateStr === 'string' ? raw.daily.lastClaimDateStr : null;
      s.daily.doubledToday = !!raw.daily.doubledToday;
    }
    if (raw.empire && typeof raw.empire === 'object' && raw.empire.buildings) {
      GAME_CONFIG.empire.buildings.forEach((b) => {
        const rb = raw.empire.buildings[b.id];
        if (rb) {
          s.empire.buildings[b.id].level = Utils.clamp(Math.floor(Utils.safeNumber(rb.level)), 0, b.maxLevel);
          if (rb.sub && typeof rb.sub === 'object') {
            b.subUpgrades.forEach((su) => {
              s.empire.buildings[b.id].sub[su.id] = Utils.clamp(Math.floor(Utils.safeNumber(rb.sub[su.id])), 0, su.maxLevel);
            });
          }
        }
      });
      if (raw.empire.secretsUnlocked && typeof raw.empire.secretsUnlocked === 'object') {
        Object.keys(raw.empire.secretsUnlocked).forEach((k) => { s.empire.secretsUnlocked[k] = !!raw.empire.secretsUnlocked[k]; });
      }
    }
    if (raw.stats && typeof raw.stats === 'object') {
      s.stats.totalClicks = Utils.safeNumber(raw.stats.totalClicks);
      s.stats.totalEarned = Utils.safeNumber(raw.stats.totalEarned);
      s.stats.totalLost = Utils.safeNumber(raw.stats.totalLost);
      s.stats.criticalHits = Utils.safeNumber(raw.stats.criticalHits);
      s.stats.jackpots = Utils.safeNumber(raw.stats.jackpots);
      s.stats.bigWins = Utils.safeNumber(raw.stats.bigWins);
      s.stats.losses = Utils.safeNumber(raw.stats.losses);
      s.stats.upgradesBought = Utils.safeNumber(raw.stats.upgradesBought);
      s.stats.adsWatched = Utils.safeNumber(raw.stats.adsWatched);
      s.stats.playTimeSec = Utils.safeNumber(raw.stats.playTimeSec);
      s.stats.maxBalance = Utils.safeNumber(raw.stats.maxBalance);
    }
    if (s.balance > s.stats.maxBalance) s.stats.maxBalance = s.balance;
    return s;
  },

  init() { this.data = this.defaults(); }
};

/* =====================================================================
   8. SaveSystem
   ===================================================================== */
const SaveSystem = {
  isAvailable: true,

  checkAvailability() {
    try {
      const testKey = '__burmalda_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      this.isAvailable = true;
    } catch (e) {
      this.isAvailable = false;
      console.warn(__t('localStorage недоступен, прогресс не будет сохраняться в этой сессии.'));
    }
    return this.isAvailable;
  },

  save(force) {
    if (!this.isAvailable) return false;
    try {
      // метка «последней активности» обновляется только пока вкладка видна (или при уходе),
      // иначе автосохранение в фоне обнуляло офлайн-прогресс
      const visible = typeof document === 'undefined' || document.visibilityState !== 'hidden';
      if (visible || force) GameState.data.lastSaveTimestamp = Utils.now();
      localStorage.setItem(CONFIG.saveKey, JSON.stringify(GameState.data));
      this.pushCloud(!!force);
      return true;
    } catch (e) { console.warn(__t('Не удалось сохранить прогресс:'), e); return false; }
  },

  load() {
    if (!this.checkAvailability()) { GameState.init(); return false; }
    try {
      const raw = localStorage.getItem(CONFIG.saveKey);
      if (!raw) { GameState.init(); return false; }
      GameState.data = GameState.sanitize(JSON.parse(raw));
      return true;
    } catch (e) { console.warn(__t('Сохранение повреждено, начинаем заново:'), e); GameState.init(); return false; }
  },

  reset() {
    try { localStorage.removeItem(CONFIG.saveKey); } catch (e) {}
    GameState.init();
    this._cloudSynced = true;   // игрок сам сбросил прогресс — облако должно получить пустое сохранение
  },

  /* ---------- облачное сохранение (Яндекс Игры) ---------- */
  _cloudSynced: false,   // true — мы уже сверились с облаком и имеем право его перезаписывать
  _cloudAt: 0,
  _cloudBusy: false,
  /** В облако не чаще раза в 30 с (лимит платформы); force — сразу (уход со страницы, сброс). */
  pushCloud(force) {
    if (!YandexSDK.ready || !this._cloudSynced) return Promise.resolve(false);
    const now = Utils.now();
    if (!force && (this._cloudBusy || now - this._cloudAt < 30000)) return Promise.resolve(false);
    this._cloudAt = now; this._cloudBusy = true;
    return YandexSDK.cloudSave(JSON.stringify(GameState.data)).then((r) => { this._cloudBusy = false; return r; }, () => { this._cloudBusy = false; return false; });
  },
  /** Из двух сохранений (локальное и облачное) побеждает то, где больше заработано; при равенстве — свежее. */
  chooseSave(cloudJson) {
    if (!cloudJson) return 'local';
    let cloud; try { cloud = GameState.sanitize(JSON.parse(cloudJson)); } catch (e) { return 'local'; }
    const local = GameState.data;
    const cs = Utils.safeNumber(cloud.stats.totalEarned), ls = Utils.safeNumber(local.stats.totalEarned);
    const useCloud = cs > ls || (cs === ls && Utils.safeNumber(cloud.lastSaveTimestamp) > Utils.safeNumber(local.lastSaveTimestamp));
    if (!useCloud) return 'local';
    GameState.data = cloud;
    return 'cloud';
  },
  /** Ответ облака при запуске. Не ответило — играем локально и в облако пока НЕ пишем (чтобы не затереть чужой прогресс). */
  applyCloudAnswer(res) {
    if (!res || !res.ok) return 'local';
    const src = this.chooseSave(res.json);
    this._cloudSynced = true;
    if (src === 'local') setTimeout(() => this.pushCloud(true), 0);
    return src;
  },
  /** Облако ответило уже после старта игры. */
  lateCloudSync(res) {
    if (this._cloudSynced || !res || !res.ok) return;
    const src = this.chooseSave(res.json);
    this._cloudSynced = true;
    if (src === 'cloud') { Economy.calculateOfflineProgress(); this.save(); UI.applyLoadedState(); }
    else this.pushCloud(true);
  },

  startAutosave() {
    setInterval(() => this.save(), CONFIG.autosaveIntervalMs);
  },

  /** Единая схема: ОДИН обработчик visibilitychange на document.
   *  hidden  → принудительное сохранение (метка времени = момент ухода, от неё считается офлайн);
   *  visible → onVisible() (расчёт офлайн-дохода и окно).
   *  pagehide/beforeunload (мобильные браузеры/закрытие) сохраняют без принуждения:
   *  если страница уже скрыта, метка времени не затирается. */
  bindLifecycle(onVisible) {
    if (this._lifecycleBound) return;
    this._lifecycleBound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { this.save(true); YandexSDK.gameplay(false); }
      else if (document.visibilityState === 'visible') { if (!Game.paused) YandexSDK.gameplay(true); if (onVisible) onVisible(); }
    });
    window.addEventListener('pagehide', () => this.save());
    window.addEventListener('beforeunload', () => this.save());
  }
};

/* =====================================================================
   9. Economy — доход, уровни, система выигрыш/проигрыш
   ===================================================================== */
const Economy = {
  calculateOfflineProgress() {
    const s = GameState.data;
    const now = Utils.now();
    const last = Utils.safeNumber(s.lastSaveTimestamp);
    if (!last || now <= last) return;
    const elapsed = Math.max(0, Math.floor((now - last) / 1000));
    const seconds = Math.min(elapsed, CONFIG.offline.maxHours * 3600);
    if (seconds < CONFIG.offline.minSeconds) {
      s.lastSaveTimestamp = now;
      return;
    }
    const income = this.baseIncomePerSecond(); // без временных бустов
    const amount = Math.floor(income * seconds * CONFIG.offline.efficiency);
    // повторные отлучки, пока награда не забрана, суммируются, но не больше лимита
    const maxSeconds = CONFIG.offline.maxHours * 3600;
    s.offline.seconds = Math.min(Utils.safeNumber(s.offline.seconds) + seconds, maxSeconds);
    s.offline.pending = Math.min(Utils.safeNumber(s.offline.pending) + amount, Math.floor(income * maxSeconds * CONFIG.offline.efficiency));
    s.lastSaveTimestamp = now;
  },

  xpRequiredForLevel(level) {
    return Math.floor(CONFIG.xpBaseRequirement * Math.pow(CONFIG.xpGrowthPerLevel, level - 1));
  },
  levelName(level) {
    if (level <= CONFIG.levelNames.length) return CONFIG.levelNames[level - 1];
    return __tt`БУРМАЛДА БОГ +${level - CONFIG.levelNames.length}`;
  },
  baseClickUnit(level) {
    return CONFIG.clickRewardBase * Math.pow(CONFIG.clickRewardLevelGrowth, Math.max(0, level - 1));
  },
  upgradeLevel(id) { return Utils.safeNumber(GameState.data.upgrades[id]); },
  upgradeDef(id) { return CONFIG.upgrades.find((u) => u.id === id); },
  upgradeIncomeAtLevel(id, level) {
    const def = this.upgradeDef(id);
    if (!def) return 0;
    return def.effectPerLevel * Math.pow(def.effectGrowth || 1, Math.max(0, level - 1));
  },
  upgradeTotalIncome(id) {
    const def = this.upgradeDef(id);
    const lvl = this.upgradeLevel(id);
    if (!def || lvl <= 0) return 0;
    /* Геометрическая прогрессия: каждый купленный уровень добавляет больше предыдущего. */
    return def.effectPerLevel * (Math.pow(def.effectGrowth || 1, lvl) - 1) / ((def.effectGrowth || 1) - 1);
  },
  upgradeCost(id) {
    const def = this.upgradeDef(id);
    if (def.costs) return def.costs[Math.min(this.upgradeLevel(id), def.costs.length - 1)];
    return Math.floor(Utils.safeNumber(def.baseCost * Math.pow(def.costMult, this.upgradeLevel(id))));
  },

  /** Джекпот по формуле безумного выигрыша крутки (×10–×50, те же бонусы), для события «Автомат сломался». */
  computeJackpotWin() {
    const o = CONFIG.spinOutcomes.find((x) => x.id === 'crazy');
    const unit = this.clickUnitBase() * this.clickBoostMultiplier();
    const roll = Utils.randomFloat(o.minMult, o.maxMult);
    return Math.max(1, Math.floor(Utils.safeNumber(unit * roll * this.temporaryMultiplier() * this.winningsBoostMultiplier() * this.rewardBonusFactor() * this.jackpotBoostMultiplier() * this.jackpotPowerFactor())));
  },
  /** Шанс джекпота (crazy) в %: 0.5 → 1 → 1.5 → 2 по уровням магнита. */
  crazyChancePct() { return CONFIG.jackpotMagnetChances[Math.min(3, this.upgradeLevel('jackpotMagnet'))]; },
  /** Сколько кликов нужно для покупки следующего уровня (0 — без условия). */
  upgradeClicksRequired(id) { const d = this.upgradeDef(id); return d && d.unlockClicks ? (d.unlockClicks[this.upgradeLevel(id)] || 0) : 0; },
  upgradeLocked(id) { return GameState.data.stats.totalClicks < this.upgradeClicksRequired(id); },
  /** Таблица исходов: прибавка к crazy вычитается ТОЛЬКО из обычных выигрышей (lose и big не меняются). */
  spinOutcomeTable() {
    const extra = this.crazyChancePct() - 0.5;
    if (extra <= 0) return CONFIG.spinOutcomes;
    return CONFIG.spinOutcomes.map((o) => (o.id === 'crazy' ? { ...o, weight: o.weight + extra } : o.id === 'normal' ? { ...o, weight: o.weight - extra } : o));
  },

  /** Клик растёт от уровня игрока и получает небольшую долю текущего пассивного дохода. */
  clickUnitBase() {
    const levelPart = this.baseClickUnit(GameState.data.level);
    const passivePart = this.baseIncomePerSecond() * CONFIG.clickRewardPassiveShare * (1 + CONFIG.clickPassiveLevelBonus * Math.max(0, GameState.data.level - 1));
    const clickPower = 1 + EmpireSystem.getGlobalBonus('clickPower') / 100;
    return Math.max(1, (levelPart + passivePart) * clickPower);
  },
  currentClickUnit() { return this.clickUnitBase() * this.clickBoostMultiplier(); },
  upgradeMaxed(id) { const d = this.upgradeDef(id); return !!(d && d.maxLevel && this.upgradeLevel(id) >= d.maxLevel); },

  /** Бонус к размеру крупных/безумных выигрышей: харизма + бонусы Империи (VIP-комнаты и т.п.) */
  /** Бонус только к безумному джекпоту (Империя: поздние здания). */
  jackpotPowerFactor() { return 1 + EmpireSystem.getGlobalBonus('jackpotPower') / 100; },

  rewardBonusFactor() {
    const charismaBonus = this.upgradeLevel('charisma') * CONFIG.charismaRewardBonusPerLevel;
    const empireBonus = EmpireSystem.getGlobalBonus('rareRewardBonus') / 100;
    return 1 + charismaBonus + empireBonus;
  },

  /** Временный множитель: события (×10) и рекламный буст (×2 по умолчанию), усиленный "Звуковой системой". */
  /** Постоянный множитель: каждый секрет Империи даёт +0,25 навсегда. */
  secretMultiplier() { return 1 + CONFIG.secretMultiplierBonus * Object.values(GameState.data.empire.secretsUnlocked || {}).filter(Boolean).length; },
  temporaryMultiplier() {
    let mult = this.secretMultiplier();
    const now = Utils.now();
    const boostEffBonus = 1 + EmpireSystem.getGlobalBonus('boostEffectiveness') / 100;
    if (GameState.data.temp.boomUntil > now) mult *= 1 + (CONFIG.events.boomMultiplier - 1) * boostEffBonus;
    if (GameState.data.temp.adBoostUntil > now) {
      const adMult = CONFIG.ads.adBreakBoostMultiplier + EmpireSystem.getGlobalBonus('adRewardBonus') / 100;
      mult *= 1 + (adMult - 1) * boostEffBonus;
    }
    return mult;
  },

  /** Чистая формула шанса крита по уровню апгрейда — используется и расчётом, и превью в магазине. */
  criticalChanceForLevel(level) {
    return Utils.clamp(0.5 + level * this.upgradeDef('criticalClick').effectPerLevel, 0, 15);
  },
  criticalChance() {
    const base = this.criticalChanceForLevel(this.upgradeLevel('criticalClick'));
    return Utils.now() < GameState.data.temp.critBoostUntil ? Utils.clamp(base * this.boostMult('critBoost'), 0, 15) : base;
  },
  boostMult(type) { const r = CONFIG.dailyRewards.find((x) => x.type === type); return r ? r.boostMult : 1; },
  clickBoostMultiplier() {
    const n = Utils.now(), t = GameState.data.temp; let m = 1;
    if (n < t.clickBoostUntil) m *= this.boostMult('clickBoost');
    if (n < t.allBoostUntil) m *= this.boostMult('allBoost');
    return m;
  },
  passiveBoostMultiplier() {
    const n = Utils.now(), t = GameState.data.temp; let m = 1;
    if (n < t.passiveBoostUntil) m *= this.boostMult('passiveBoost');
    if (n < t.allBoostUntil) m *= this.boostMult('allBoost');
    return m;
  },
  winningsBoostMultiplier() { return Utils.now() < GameState.data.temp.winningsBoostUntil ? this.boostMult('winningsBoost') : 1; },
  jackpotBoostMultiplier() { return Utils.now() < GameState.data.temp.jackpotBoostUntil ? this.boostMult('jackpotBoost') : 1; },

  criticalMultiplier() {
    const lvl = this.upgradeLevel('criticalClick');
    return 2.5 + lvl * 0.10;
  },

  /** Пассивный доход/сек: апгрейды кликера + все здания Империи, помноженные на временный буст. */
  baseIncomePerSecond() {
    const autoSpin = this.upgradeTotalIncome('autoSpin');
    const machine = this.upgradeTotalIncome('burmaldaMachine');
    const empireIncome = EmpireSystem.totalIncomePerSecond();
    const charisma = 1 + this.upgradeLevel('charisma') * CONFIG.charismaPassivePerLevel;
    const globalIncome = 1 + EmpireSystem.getGlobalBonus('globalIncome') / 100;
    return Utils.safeNumber((autoSpin + machine + empireIncome) * charisma * globalIncome);
  },
  incomePerSecond() {
    return Utils.safeNumber(this.baseIncomePerSecond() * this.temporaryMultiplier() * this.passiveBoostMultiplier());
  },

  eventChanceBonusPct() {
    return EmpireSystem.getGlobalBonus('eventChance');
  },
  adBreakMultiplierFinal() {
    return CONFIG.ads.adBreakBoostMultiplier + EmpireSystem.getGlobalBonus('adRewardBonus') / 100;
  },

  /**
   * Крутка автомата: 49% обычный выигрыш, 5.5% крупный, 45% проигрыш (списание),
   * 0.5% безумный джекпот. Вероятности зафиксированы по ТЗ и не меняются
   * апгрейдами — апгрейды влияют только на РАЗМЕР наград (rewardBonusFactor)
   * и на шанс крита поверх выигрышных исходов.
   */
  computeSpinResult() {
    // unit — единица клика (с бустом кликов). Временные множители применяются ОДИН раз.
    const base = this.clickUnitBase();
    const unit = base * this.clickBoostMultiplier();
    const tempMult = this.temporaryMultiplier();
    const winningsMult = this.winningsBoostMultiplier();

    if (GameState.data.temp.superClickReady) {
      GameState.data.temp.superClickReady = false;
      const amount = Math.floor(unit * CONFIG.events.superClickMultiplier * tempMult * winningsMult * this.rewardBonusFactor());
      return { amount, outcome: 'super', className: 'epic', isCrit: false, isJackpot: false, isSuper: true, isLose: false };
    }

    const outcome = Utils.weightedPick(this.spinOutcomeTable(), 'weight');
    const roll = Utils.randomFloat(outcome.minMult, outcome.maxMult);
    let amount = 0, isCrit = false;

    if (outcome.id === 'lose') {
      // проигрыш масштабируется теми же бустами, что и выигрыш, чтобы буст не менял соотношение риск/награда
      const insured = 1 - Math.min(0.9, this.upgradeLevel('insurance') * CONFIG.insuranceReductionPerLevel);
      amount = Math.max(1, Math.floor(Utils.safeNumber(unit * roll * tempMult * insured)));
    } else {
      const rare = outcome.id === 'big' || outcome.id === 'crazy';
      const bonus = rare ? this.rewardBonusFactor() * this.jackpotBoostMultiplier() * (outcome.id === 'crazy' ? this.jackpotPowerFactor() : 1) : 1;
      amount = unit * roll * tempMult * winningsMult * bonus;
      if (outcome.id !== 'crazy' && Utils.chance(this.criticalChance())) { isCrit = true; amount *= this.criticalMultiplier(); }
      amount = Math.max(1, Math.floor(Utils.safeNumber(amount)));
    }
    return { amount, outcome: outcome.id, className: outcome.className, isCrit,
      isJackpot: outcome.id === 'crazy', isSuper: false, isLose: outcome.id === 'lose' };
  },

  addBalance(amount) {
    amount = Utils.safeNumber(amount);
    if (amount <= 0) return 0;
    GameState.data.balance = Utils.safeNumber(GameState.data.balance + amount);
    GameState.data.stats.totalEarned = Utils.safeNumber(GameState.data.stats.totalEarned + amount);
    if (GameState.data.balance > GameState.data.stats.maxBalance) GameState.data.stats.maxBalance = GameState.data.balance;
    return amount;
  },

  spendBalance(amount) {
    amount = Utils.safeNumber(amount);
    if (amount <= 0) return true;
    if (GameState.data.balance < amount) return false;
    GameState.data.balance = Utils.safeNumber(GameState.data.balance - amount);
    return true;
  },

  /** Списывает валюту при проигрыше крутки. Никогда не уводит баланс в минус —
   *  если задолженной суммы не хватает, списывается всё, что есть. Возвращает
   *  фактически списанную сумму (для отображения игроку). */
  subtractBalance(amount) {
    amount = Utils.safeNumber(amount);
    if (amount <= 0) return 0;
    const actual = Math.min(GameState.data.balance, amount);
    GameState.data.balance = Utils.safeNumber(GameState.data.balance - actual);
    return actual;
  },

  addXp(amount) {
    amount = Utils.safeNumber(amount);
    GameState.data.xp = Utils.safeNumber(GameState.data.xp + amount);
    let leveledUp = false;
    let required = this.xpRequiredForLevel(GameState.data.level);
    while (GameState.data.xp >= required && GameState.data.level < 999999) {
      GameState.data.xp -= required;
      GameState.data.level += 1;
      leveledUp = true;
      required = this.xpRequiredForLevel(GameState.data.level);
    }
    return leveledUp;
  }
};

/* =====================================================================
   10. Upgrades — магазин кликера (4 улучшения)
   ===================================================================== */
const Upgrades = {
  buyLock: false,
  canAfford(id) { return GameState.data.balance >= Economy.upgradeCost(id); },
  buy(id) {
    if (this.buyLock || Economy.upgradeMaxed(id) || Economy.upgradeLocked(id)) return false;
    this.buyLock = true;
    setTimeout(() => { this.buyLock = false; }, 180);
    const cost = Economy.upgradeCost(id);
    if (!Economy.spendBalance(cost)) { this.buyLock = false; return false; }
    GameState.data.upgrades[id] = Utils.safeNumber(GameState.data.upgrades[id]) + 1;
    GameState.data.stats.upgradesBought = Utils.safeNumber(GameState.data.stats.upgradesBought) + 1;
    AudioManager.play('buy');
    SaveSystem.save();
    return true;
  }
};

/* =====================================================================
   11. Achievements
   ===================================================================== */
const Achievements = {
  list: [
    { id: 'first_click', icon: '🎯', name: __t('Первый клик'), desc: __t('Сделай первую крутку'), check: (s) => s.stats.totalClicks >= 1 },
    { id: 'clicks_100', icon: '🖱️', name: __t('100 кликов'), desc: __t('Сделай 100 круток'), check: (s) => s.stats.totalClicks >= 100 },
    { id: 'clicks_1000', icon: '🖱️', name: __t('1 000 кликов'), desc: __t('Сделай 1 000 круток'), check: (s) => s.stats.totalClicks >= 1000 },
    { id: 'clicks_10000', icon: '🖱️', name: __t('10 000 кликов'), desc: __t('Сделай 10 000 круток'), check: (s) => s.stats.totalClicks >= 10000 },
    { id: 'first_autoclicker', icon: '🤖', name: __t('Первый автокликер'), desc: __t('Купи Автокрутку'), check: (s) => s.upgrades.autoSpin >= 1 },
    { id: 'first_crit', icon: '💥', name: __t('Первый крит'), desc: __t('Получи первый критический удар'), check: (s) => s.stats.criticalHits >= 1 },
    { id: 'first_jackpot', icon: '🎰', name: __t('Первый безумный джекпот'), desc: __t('Сорви джекпот (0.5% шанс)'), check: (s) => s.stats.jackpots >= 1 },
    { id: 'earned_100000', icon: '💰', name: __t('100 000 бурмалды'), desc: __t('Заработай суммарно 100 000 бурмалды'), check: (s) => s.stats.totalEarned >= 100000 },
    { id: 'earned_1m', icon: '💰', name: __t('1 миллион бурмалды'), desc: __t('Заработай суммарно 1 000 000 бурмалды'), check: (s) => s.stats.totalEarned >= 1000000 },
    { id: 'earned_1b', icon: '💰', name: __t('1 миллиард бурмалды'), desc: __t('Заработай суммарно 1 000 000 000 бурмалды'), check: (s) => s.stats.totalEarned >= 1000000000 },
    { id: 'first_building', icon: '🏚', name: __t('Первая собственность'), desc: __t('Купи Подвал'), check: (s) => s.empire.buildings.basement.level >= 1 },
    { id: 'first_burmalda_machine', icon: '🏭', name: __t('БУРМАЛДА-МАШИНА'), desc: __t('Купи Бурмалда-машину'), check: (s) => s.upgrades.burmaldaMachine >= 1 },
    { id: 'god_of_burmalda', icon: '👑', name: __t('БОГ БУРМАЛДЫ'), desc: __t('Достигни 10 уровня'), check: (s) => s.level >= 10 },
    { id: 'upgrades_10', icon: '🛒', name: __t('Коллекционер апгрейдов'), desc: __t('Купи 10 улучшений'), check: (s) => s.stats.upgradesBought >= 10 },
    { id: 'ads_5', icon: '📺', name: __t('Друг рекламы'), desc: __t('Посмотри 5 рекламных роликов'), check: (s) => s.stats.adsWatched >= 5 },
    { id: 'empire_started', icon: '👑', name: __t('Начало Империи'), desc: __t('Открой Гараж'), check: (s) => s.empire.buildings.garage.level >= 1 },
    { id: 'empire_full', icon: '🌌', name: __t('ИМПЕРИЯ БУРМАЛДЫ'), desc: __t('Построй здание «Империя»'), check: (s) => s.empire.buildings.empireCore.level >= 1 }
  ],
  checkAll() {
    const newly = [];
    const s = GameState.data;
    this.list.forEach((a) => { if (!s.achievements[a.id] && a.check(s)) { s.achievements[a.id] = true; newly.push(a); } });
    return newly;
  }
};

/* =====================================================================
   12. EmpireSystem — здания, внутренние улучшения, секреты
   ===================================================================== */
const EmpireSystem = {
  buyLock: false,

  def(buildingId) { return GAME_CONFIG.empire.buildings.find((b) => b.id === buildingId); },
  state(buildingId) { return GameState.data.empire.buildings[buildingId]; },
  getLevel(buildingId) { const s = this.state(buildingId); return s ? s.level : 0; },
  isOwned(buildingId) { return this.getLevel(buildingId) >= 1; },

  /** Все требования разблокировки должны выполняться одновременно (логика И). */
  isUnlockable(building) {
    return building.unlockRequirements.every((req) => {
      if (req.type === 'buildingLevel') return this.getLevel(req.building) >= req.value;
      if (req.type === 'totalClicks') return GameState.data.stats.totalClicks >= req.value;
      if (req.type === 'earned') return GameState.data.stats.totalEarned >= req.value;
      if (req.type === 'achievementsCount') {
        return Object.keys(GameState.data.achievements).length >= req.value;
      }
      return true;
    });
  },

  unlockRequirementText(building) {
    return building.unlockRequirements.map((req) => {
      if (req.type === 'buildingLevel') {
        const b = this.def(req.building);
        return __tt`${b ? b.name : req.building} уровень ${req.value}`;
      }
      if (req.type === 'totalClicks') return __tt`${Utils.formatNumber(req.value)} кликов`;
      if (req.type === 'earned') return __tt`Заработать ${Utils.formatNumber(req.value)}`;
      if (req.type === 'achievementsCount') return __tt`${req.value} достижений`;
      return '';
    }).join(' + ');
  },

  visualStage(building) {
    const level = this.getLevel(building.id);
    const perStage = GAME_CONFIG.empire.levelsPerVisualStage;
    const idx = Utils.clamp(Math.floor(Math.max(0, level - 1) / perStage), 0, building.stageNames.length - 1);
    return { name: building.stageNames[idx], icon: building.stageIcons[idx], index: idx };
  },

  /** Стоимость покупки здания (первый уровень) либо следующего уровня существующего. */
  nextLevelCost(building) {
    const level = this.getLevel(building.id);
    if (level === 0) return building.unlockCost;
    return Math.floor(Utils.safeNumber(building.unlockCost * Math.pow(building.levelCostGrowth, level)));
  },

  /** Покупка здания (если ещё не куплено) или следующего уровня (если уже куплено). */
  buyOrLevelUp(buildingId) {
    if (this.buyLock) return false;
    this.buyLock = true;
    setTimeout(() => { this.buyLock = false; }, 180);

    const building = this.def(buildingId);
    if (!building) { this.buyLock = false; return false; }
    if (this.getLevel(buildingId) === 0 && !this.isUnlockable(building)) { this.buyLock = false; return false; }
    if (this.getLevel(buildingId) >= building.maxLevel) { this.buyLock = false; return false; }

    const cost = this.nextLevelCost(building);
    if (!Economy.spendBalance(cost)) { this.buyLock = false; return false; }

    const wasOwned = this.isOwned(buildingId);
    this.state(buildingId).level += 1;
    AudioManager.play('buy');
    SaveSystem.save();

    if (!wasOwned) {
      UI.showEventBanner(__t('🏗️ НОВАЯ СОБСТВЕННОСТЬ: ') + building.name);
      UI.showPhrase(randomPhrase('buildingPurchased'));
      AudioManager.play('levelup');
    }
    return true;
  },

  /** Стоимость и покупка внутреннего улучшения здания. */
  subUpgradeCost(building, sub) {
    const lvl = this.state(building.id).sub[sub.id];
    // Прирост плоского бонуса растёт как levelIncomeGrowth^(уровень−1), поэтому цена привязана к тому же
    // коэффициенту: окупаемость под-улучшения не зависит от уровня здания, а только от его собственного уровня.
    const bLvl = Math.max(1, this.getLevel(building.id));
    return Math.floor(Utils.safeNumber(sub.baseCost * Math.pow(sub.costGrowth, lvl) * Math.pow(building.levelIncomeGrowth, bLvl - 1)));
  },
  buySubUpgrade(buildingId, subId) {
    if (this.buyLock) return false;
    this.buyLock = true;
    setTimeout(() => { this.buyLock = false; }, 180);

    const building = this.def(buildingId);
    if (!building || !this.isOwned(buildingId)) { this.buyLock = false; return false; }
    const sub = building.subUpgrades.find((s) => s.id === subId);
    if (!sub) { this.buyLock = false; return false; }

    if (this.state(buildingId).sub[subId] >= sub.maxLevel) { this.buyLock = false; return false; }
    const cost = this.subUpgradeCost(building, sub);
    if (!Economy.spendBalance(cost)) { this.buyLock = false; return false; }

    this.state(buildingId).sub[subId] += 1;
    AudioManager.play('buy');
    SaveSystem.save();
    return true;
  },

  /** Доход конкретного здания в секунду (с учётом его собственных внутренних улучшений). */
  buildingIncome(building) {
    const level = this.getLevel(building.id);
    if (level < 1) return 0;
    const st = this.state(building.id);
    let flatBonus = 0;
    let mult = 1;
    building.subUpgrades.forEach((su) => {
      const lvl = st.sub[su.id] || 0;
      if (lvl <= 0) return;
      if (su.effect === 'addIncome') flatBonus += su.amount * lvl;
      if (su.effect === 'multiplyBuilding') mult += su.amount * lvl;
    });
    const base = (building.baseIncome + flatBonus) * Math.pow(building.levelIncomeGrowth, level - 1);
    return Utils.safeNumber(base * mult);
  },

  totalIncomePerSecond() {
    return GAME_CONFIG.empire.buildings.reduce((sum, b) => sum + this.buildingIncome(b), 0);
  },

  /** Суммарный "глобальный" бонус определённого типа со всех зданий (eventChance, rareRewardBonus и т.д.) */
  getGlobalBonus(effectType) {
    let total = 0;
    GAME_CONFIG.empire.buildings.forEach((b) => {
      if (this.getLevel(b.id) < 1) return;
      const st = this.state(b.id);
      b.subUpgrades.forEach((su) => {
        if (su.effect !== effectType) return;
        const lvl = st.sub[su.id] || 0;
        total += su.amount * lvl;
      });
    });
    return total;
  },

  /** Условный "размер Империи" — суммарный показатель прогресса для флэйвора/UI. */
  empireSize() {
    let size = 0;
    GAME_CONFIG.empire.buildings.forEach((b) => {
      const st = this.state(b.id);
      size += st.level;
      Object.values(st.sub).forEach((lvl) => { size += lvl; });
    });
    size += Object.keys(GameState.data.empire.secretsUnlocked).length * 5;
    return size;
  },

  ownedCount() {
    return GAME_CONFIG.empire.buildings.filter((b) => this.isOwned(b.id)).length;
  },

  /** Следующая цель — первое ещё не купленное здание по порядку списка. */
  nextGoal() {
    return GAME_CONFIG.empire.buildings.find((b) => !this.isOwned(b.id)) || null;
  },

  /** Человекочитаемый эффект под-улучшения: «сейчас → после покупки следующего уровня». */
  subEffectText(b, su) {
    const st = this.state(b.id), lvl = st.sub[su.id] || 0, maxed = lvl >= su.maxLevel;
    const f = (n) => (Math.round(n * 10) / 10).toString().replace('.', DEC);
    if (su.effect === 'addIncome' || su.effect === 'multiplyBuilding') {
      const i0 = this.buildingIncome(b);
      if (maxed) return __tt`Доход здания: ${Utils.formatRate(i0)}/сек (макс.)`;
      st.sub[su.id] = lvl + 1; const i1 = this.buildingIncome(b); st.sub[su.id] = lvl;
      return __tt`Доход здания: ${Utils.formatRate(i0)} → ${Utils.formatRate(i1)}/сек (+${Utils.formatRate(i1 - i0)})`;
    }
    const gb = this.getGlobalBonus(su.effect), nb = maxed ? gb : gb + su.amount;
    if (su.effect === 'eventChance') {
      const base = CONFIG.events.triggerChance * 100;
      return __tt`Шанс события (каждые 20 с): ${f(base + gb)}%${maxed ? __t(' (макс.)') : ' → ' + f(base + nb) + '%'}`;
    }
    if (su.effect === 'rareRewardBonus') return __tt`Крупные и безумные выигрыши: +${f(gb)}%${maxed ? __t(' (макс.)') : ' → +' + f(nb) + '%'}`;
    if (su.effect === 'globalIncome') return __tt`Весь пассивный доход: +${f(gb)}%${maxed ? __t(' (макс.)') : ' → +' + f(nb) + '%'}`;
    if (su.effect === 'clickPower') return __tt`Сила клика: +${f(gb)}%${maxed ? __t(' (макс.)') : ' → +' + f(nb) + '%'}`;
    if (su.effect === 'jackpotPower') return __tt`Награда безумного джекпота: +${f(gb)}%${maxed ? __t(' (макс.)') : ' → +' + f(nb) + '%'}`;
    if (su.effect === 'boostEffectiveness') return __tt`Сила бума и рекламы: +${f(gb)}%${maxed ? __t(' (макс.)') : ' → +' + f(nb) + '%'}`;
    return '';
  },

  /** Общий прогресс Империи, 0..100: уровни зданий + под-улучшения относительно потолков. */
  completionPct() {
    let cur = 0, max = 0;
    GAME_CONFIG.empire.buildings.forEach((b) => {
      const st = this.state(b.id);
      cur += Math.min(st.level, b.maxLevel); max += b.maxLevel;
      b.subUpgrades.forEach((su) => { cur += Math.min(st.sub[su.id] || 0, su.maxLevel); max += su.maxLevel; });
    });
    return max > 0 ? Utils.clamp((cur / max) * 100, 0, 100) : 0;
  },

  /** Прогресс по каждому условию открытия здания. */
  requirementProgress(building) {
    const s = GameState.data;
    return building.unlockRequirements.map((req) => {
      let cur = 0, text = '';
      if (req.type === 'buildingLevel') { cur = this.getLevel(req.building); const b = this.def(req.building); text = `${b ? b.name : req.building} ${Math.min(cur, req.value)}/${req.value}`; }
      else if (req.type === 'totalClicks') { cur = s.stats.totalClicks; text = __tt`клики ${Utils.formatNumber(Math.min(cur, req.value))}/${Utils.formatNumber(req.value)}`; }
      else if (req.type === 'earned') { cur = s.stats.totalEarned; text = __tt`заработано ${Utils.formatNumber(Math.min(cur, req.value))}/${Utils.formatNumber(req.value)}`; }
      else if (req.type === 'achievementsCount') { cur = Object.keys(s.achievements).length; text = __tt`достижения ${Math.min(cur, req.value)}/${req.value}`; }
      return { req, frac: Utils.clamp(cur / req.value, 0, 1), text, done: cur >= req.value };
    });
  },

  /** Всё, что нужно UI для полос цели: основная полоса, «текущий шаг» и мини-полоса на главном экране. */
  goalProgress() {
    const goal = this.nextGoal();
    const bal = GameState.data.balance;
    if (!goal) return { goal: null, pct: 100, label: __t('Ты построил всю Империю!'), step: null };
    const cost = this.nextLevelCost(goal);
    if (this.isUnlockable(goal)) {
      const pct = Utils.clamp((bal / cost) * 100, 0, 100);
      return { goal, pct, label: `${Utils.formatNumber(Math.floor(bal))} / ${Utils.formatNumber(cost)}`, step: null };
    }
    const reqs = this.requirementProgress(goal);
    const pct = (reqs.reduce((a, r) => a + r.frac, 0) / Math.max(1, reqs.length)) * 100;
    const label = '🔒 ' + reqs.map((r) => r.text).join(' · ');
    // текущий шаг: прокачка здания-требования (с ценой и своей полосой)
    let step = null;
    const unmet = reqs.find((r) => !r.done && r.req.type === 'buildingLevel');
    if (unmet) {
      const rb = this.def(unmet.req.building);
      const sc = this.nextLevelCost(rb);
      step = { name: __tt`${rb.name}: улучшить до ${this.getLevel(rb.id) + 1} ур.`, pct: Utils.clamp((bal / sc) * 100, 0, 100),
        label: `${Utils.formatNumber(Math.floor(bal))} / ${Utils.formatNumber(sc)}` };
    }
    return { goal, pct, label, step };
  },

  /** Текущий этап (самое «старшее» купленное здание цепочки) — задаёт вид главного экрана. */
  currentStageId() {
    let id = 'start';
    GAME_CONFIG.empire.buildings.forEach((b) => { if (this.isOwned(b.id)) id = b.id; });
    return id;
  },

  checkSecrets() {
    const newly = [];
    const s = GameState.data;
    GAME_CONFIG.empire.secrets.forEach((secret) => {
      if (!s.empire.secretsUnlocked[secret.id] && secret.check(s, this)) {
        s.empire.secretsUnlocked[secret.id] = true;
        Economy.addBalance(Math.max(secret.bonus, Economy.incomePerSecond() * 600));
        newly.push(secret);
      }
    });
    return newly;
  }
};

/* =====================================================================
   13. RandomEvents
   ===================================================================== */
const RandomEvents = {
  types: [
    { id: 'boom', weight: 35 },
    { id: 'investment', weight: CONFIG.events.investmentCheckWeight },
    { id: 'broken', weight: CONFIG.events.brokenCheckWeight },
    { id: 'tax', weight: CONFIG.events.taxCheckWeight },
    { id: 'superClick', weight: 20 },
    { id: 'jackpotEvent', weight: 15 }
  ],
  activeEventLock: false,

  start() { setInterval(() => this.tick(), CONFIG.events.checkIntervalMs); },

  tick() {
    if (Game.paused || !Game.isPageVisible()) return;
    if (this.activeEventLock) return;
    if (UI.isAnyModalOpen()) return;
    const chance = CONFIG.events.triggerChance + Economy.eventChanceBonusPct() / 100;
    if (Math.random() > chance) return;
    const type = Utils.weightedPick(this.types, 'weight');
    this.trigger(type.id);
  },

  trigger(id) {
    switch (id) {
      case 'boom': this.triggerBoom(); break;
      case 'investment': this.triggerInvestment(); break;
      case 'broken': this.triggerBroken(); break;
      case 'tax': this.triggerTax(); break;
      case 'superClick': this.triggerSuperClick(); break;
      case 'jackpotEvent': this.triggerJackpotEvent(); break;
    }
  },

  triggerBoom() {
    GameState.data.temp.boomUntil = Utils.now() + CONFIG.events.boomDurationSec * 1000;
    UI.showEventBanner(__tt`БУРМАЛДА БУМ! ×${CONFIG.events.boomMultiplier} ДОХОД НА ${CONFIG.events.boomDurationSec}с`);
    AudioManager.play('event');
    UI.refreshHeader();
    setTimeout(() => UI.refreshHeader(), CONFIG.events.boomDurationSec * 1000 + 100);
  },

  /** Мужик-инвестор: один раз за предложение, только когда есть что удваивать и обучение пройдено. */
  triggerInvestment() {
    const now = Utils.now(), s = GameState.data;
    if (s.investment.pending || !s.tutorial.done) return;
    if (now - s.investment.lastOfferAt < CONFIG.investment.minIntervalSec * 1000) return;
    if (s.balance < CONFIG.investment.minBalance) return;
    s.investment.lastOfferAt = now;
    s.investment.pending = true;
    SaveSystem.save();
    UI.showInvestmentModal();
  },

  triggerTax() {
    const now = Utils.now(), s = GameState.data;
    if (s.events.taxPending || !s.tutorial.done) return;
    if (s.balance < CONFIG.taxCheck.minBalance) return;
    s.events.taxLastAt = now;
    s.events.taxPending = true;
    SaveSystem.save();
    UI.showTaxModal();
  },

  triggerBroken() {
    const now = Utils.now(), s = GameState.data;
    if (s.events.brokenPending || !s.tutorial.welcomeShown || now < s.temp.machineBrokenUntil) return;
    if (now - s.events.brokenLastAt < CONFIG.brokenMachine.minIntervalSec * 1000) return;
    if (s.balance < CONFIG.brokenMachine.minBalance) return;
    s.events.brokenLastAt = now;
    s.events.brokenPending = true;
    SaveSystem.save();
    UI.showBrokenModal();
  },

  triggerSuperClick() {
    GameState.data.temp.superClickReady = true;
    UI.showEventBanner(__t('СУПЕРКЛИК! Следующая крутка — гигантский приз'));
    AudioManager.play('event');
  },

  triggerJackpotEvent() {
    this.activeEventLock = true;
    UI.showJackpotEventModal(CONFIG.events.jackpotEventDurationMs, (success) => {
      this.activeEventLock = false;
      if (success) {
        // 777 — отдельный бонус: 5% ближайшей крупной покупки.
        // Верхний предел равен 15 минутам текущего пассивного дохода,
        // поэтому бонус масштабируется, но не ломает позднюю экономику.
        const nextGoal = EmpireSystem.nextGoal();
        let targetCost = 0;
        if (nextGoal) {
          targetCost = EmpireSystem.nextLevelCost(nextGoal);
        } else {
          const finalBuilding = GAME_CONFIG.empire.buildings[GAME_CONFIG.empire.buildings.length - 1];
          targetCost = EmpireSystem.nextLevelCost(finalBuilding);
        }
        const passiveCap = Math.max(10000, Math.floor(Economy.incomePerSecond() * CONFIG.events.jackpotEventRewardMaxPassiveMinutes * 60));
        const baseReward = Utils.clamp(
          Math.floor(targetCost * CONFIG.events.jackpotEventRewardShare),
          CONFIG.events.jackpotEventRewardMin,
          passiveCap
        );
        const reward = Math.floor(baseReward * Economy.winningsBoostMultiplier() * Economy.temporaryMultiplier());
        GameState.data.stats.jackpots += 1;
        AudioManager.play('jackpot');
        UI.showPhrase(randomPhrase('jackpot'));
        UI.flashScreen();
        UI.grantBigWin(reward, true);
        UI.refreshAll();
      } else {
        UI.showPhrase(__t('ЭТО УЖЕ СЛИШКОМ'));
      }
    });
  }
};

/* =====================================================================
   14. DailyReward
   ===================================================================== */
const DailyReward = {
  isAvailableToday() { return GameState.data.daily.lastClaimDateStr !== Utils.todayStr(); },

  currentDayNumber() {
    const d = GameState.data.daily;
    const today = Utils.todayStr();
    if (!d.lastClaimDateStr) return 1;
    const diff = Utils.daysBetween(d.lastClaimDateStr, today);
    if (diff === 1) return (d.streak % 7) + 1;
    if (diff <= 0) return d.streak || 1;
    return 1;
  },

  rewardForDay(dayNumber) { return CONFIG.dailyRewards.find((r) => r.day === dayNumber) || CONFIG.dailyRewards[0]; },

  addDuration(key, durationSec) {
    const now = Utils.now();
    const cur = Utils.safeNumber(GameState.data.temp[key]);
    GameState.data.temp[key] = Math.max(cur, now) + durationSec * 1000;
  },

  applyReward(reward, extend = false) {
    if (!reward || !reward.type) return;
    const duration = reward.boostDurationSec || 0;
    const keyMap = {
      clickBoost: 'clickBoostUntil',
      passiveBoost: 'passiveBoostUntil',
      winningsBoost: 'winningsBoostUntil',
      critBoost: 'critBoostUntil',
      jackpotBoost: 'jackpotBoostUntil',
      allBoost: 'allBoostUntil'
    };
    const key = keyMap[reward.type];
    if (!key) return;
    if (extend) this.addDuration(key, duration);
    else GameState.data.temp[key] = Math.max(Utils.safeNumber(GameState.data.temp[key]), Utils.now() + duration * 1000);
  },

  claim() {
    if (!this.isAvailableToday()) return null;
    const dayNumber = this.currentDayNumber();
    const reward = this.rewardForDay(dayNumber);
    this.applyReward(reward, false);
    GameState.data.daily.streak = dayNumber;
    GameState.data.daily.lastClaimDateStr = Utils.todayStr();
    GameState.data.daily.doubledToday = false;
    AudioManager.play('daily');
    SaveSystem.save();
    return reward;
  },

  doubleViaAd(onDone) {
    if (GameState.data.daily.doubledToday) { onDone(false); return; }
    const reward = this.rewardForDay(GameState.data.daily.streak || 1);
    Ads.showRewardedAd('dailyDouble', () => {
      this.applyReward(reward, true);
      GameState.data.daily.doubledToday = true;
      SaveSystem.save();
      onDone(true);
    }, () => onDone(false));
  }
};

/* =====================================================================
   16. YandexSDK
   ===================================================================== */
const YandexSDK = {
  ready: false, sdk: null, player: null, sdkPaused: false, _gp: false, _initPromise: null,
  init() {
    if (this._initPromise) return this._initPromise;
    if (typeof window.YaGames === 'undefined') {
      console.info(__t('[YandexSDK] SDK не найден — автономный режим.'));
      return (this._initPromise = Promise.resolve(false));
    }
    this._initPromise = window.YaGames.init().then((sdk) => {
      this.sdk = sdk; this.ready = true;
      // платформа сама просит паузу (реклама, свёрнутое окно) — слушаем
      try {
        if (typeof sdk.on === 'function') {
          sdk.on('game_api_pause', () => { this.sdkPaused = true; Game.updatePause(); });
          sdk.on('game_api_resume', () => { this.sdkPaused = false; Game.updatePause(); });
        }
      } catch (e) {}
      return true;
    }).catch((e) => { console.warn(__t('[YandexSDK] ошибка инициализации:'), e); this.ready = false; return false; });
    return this._initPromise;
  },
  /** Игра полностью загружена и готова — это требование платформы. */
  markReady() {
    try { this.sdk && this.sdk.features && this.sdk.features.LoadingAPI && this.sdk.features.LoadingAPI.ready(); } catch (e) {}
    this.gameplay(true);
  },
  /** Метрика «идёт игровой процесс» (start/stop при паузах, рекламе, сворачивании). */
  gameplay(on) {
    try {
      const g = this.sdk && this.sdk.features && this.sdk.features.GameplayAPI; if (!g) return;
      if (on && !this._gp) { g.start(); this._gp = true; } else if (!on && this._gp) { g.stop(); this._gp = false; }
    } catch (e) {}
  },
  tryShowRewardedVideo(onRewarded, onClose, onError) {
    if (!this.ready || !this.sdk || !this.sdk.adv || typeof this.sdk.adv.showRewardedVideo !== 'function') return false;
    try {
      this.sdk.adv.showRewardedVideo({
        callbacks: { onOpen: () => {}, onRewarded: () => onRewarded(), onClose: () => onClose(), onError: (e) => onError(e) }
      });
      return true;
    } catch (e) { onError(e); return false; }
  },
  /* ---------- облачное сохранение (данные игрока на сервере Яндекса) ---------- */
  getPlayer() {
    if (!this.ready || !this.sdk || typeof this.sdk.getPlayer !== 'function') return Promise.resolve(null);
    if (this.player) return Promise.resolve(this.player);
    return this.sdk.getPlayer({ scopes: false }).then((p) => (this.player = p), () => null);
  },
  /** { ok:true, json:'…'|null } — ответ получен (json=null: в облаке пусто); { ok:false } — облако недоступно. */
  cloudLoad() {
    return this.getPlayer().then((p) => {
      if (!p || typeof p.getData !== 'function') return { ok: false };
      return p.getData(['save']).then((d) => ({ ok: true, json: d && typeof d.save === 'string' ? d.save : null }), () => ({ ok: false }));
    }).catch(() => ({ ok: false }));
  },
  cloudSave(json) {
    return this.getPlayer().then((p) => {
      if (!p || typeof p.setData !== 'function') return false;
      return p.setData({ save: json }, false).then(() => true, () => false);
    }).catch(() => false);
  }
};

/* =====================================================================
   17. Ads
   ===================================================================== */
const Ads = {
  active: false,
  showRewardedAd(placementId, onSuccess, onFail) {
    UI.showAdLoadingOverlay(true);
    // на время рекламы игра и звук на паузе (требование платформы)
    this.active = true; Game.updatePause(); YandexSDK.gameplay(false);
    const endAd = () => { this.active = false; Game.updatePause(); YandexSDK.gameplay(true); };
    const finishSuccess = () => {
      endAd();
      UI.showAdLoadingOverlay(false);
      GameState.data.stats.adsWatched = Utils.safeNumber(GameState.data.stats.adsWatched) + 1;
      SaveSystem.save();
      Achievements.checkAll();
      UI.refreshAchievements();
      onSuccess && onSuccess();
    };
    const finishFail = (e) => { endAd(); UI.showAdLoadingOverlay(false); onFail && onFail(e); };
    let rewarded = false;
    const usedRealSdk = YandexSDK.tryShowRewardedVideo(() => { rewarded = true; }, () => { if (rewarded) finishSuccess(); else finishFail(); }, (e) => finishFail(e));
    if (!usedRealSdk) { if (CONFIG.ads.allowStub) setTimeout(() => finishSuccess(), CONFIG.ads.stubDelayMs); else finishFail(); }
  },

  showAdBreakBoost() {
    const t = GameState.data.temp, n = Utils.now();
    if (t.adBoostUntil > n || t.adCooldownUntil > n) { UI.showEventBanner(__t('📺 РЕКЛАМА ЕЩЁ НЕДОСТУПНА')); return; }
    this.showRewardedAd('ad_break_boost', () => {
      GameState.data.temp.adBoostUntil = Utils.now() + CONFIG.ads.adBreakBoostDurationSec * 1000;
      GameState.data.temp.adCooldownUntil = GameState.data.temp.adBoostUntil + CONFIG.ads.breakCooldownSec * 1000;
      UI.showEventBanner(__tt`БУРМАЛДА ЗАВОЗ! ДОХОД ×${Math.round(Economy.adBreakMultiplierFinal())} НА 60 СЕК`);
      UI.refreshHeader();
      UI.updateAdBreakButtonState();
      setTimeout(() => UI.refreshHeader(), CONFIG.ads.adBreakBoostDurationSec * 1000 + 100);
    });
  }
};

/* =====================================================================
   18. UI
   ===================================================================== */
const UI = {
  el: {},
  lastDisplayedBalance: 0,
  modalQueue: [], modalBusy: false,
  achievementQueue: [], achievementBusy: false,
  currentDetailBuildingId: null,

  cacheDom() {
    const $ = (id) => document.getElementById(id);
    this.el = {
      loadingScreen: $('loadingScreen'), loadingBarFill: $('loadingBarFill'),
      bgPlaceholder: $('bgPlaceholder'), bgImage: $('bgImage'), bgPlaceholderName: $('bgPlaceholderName'),
      statBalance: $('statBalance'), statIncome: $('statIncome'), statMultiplier: $('statMultiplier'), statLevel: $('statLevel'),
      soundToggleBtn: $('soundToggleBtn'), soundToggleBtn2: $('soundToggleBtn2'),
      volumePop: $('volumePop'), volumeMuteBtn: $('volumeMuteBtn'), volumeSlider: $('volumeSlider'), volumeSlider2: $('volumeSlider2'), volumeValue: $('volumeValue'),
      xpBarFill: $('xpBarFill'), xpBarLabel: $('xpBarLabel'),
      floatingLayer: $('floatingLayer'),
      reel1: $('reel1'), reel2: $('reel2'), reel3: $('reel3'),
      terminal: $('slotMachine'), bulbsTop: $('bulbsTop'), bulbsBottom: $('bulbsBottom'), terminalLcdText: $('terminalLcdText'),
      spinButton: $('spinButton'), adPauseButton: $('adPauseButton'),
      shopList: $('shopList'),
      achievementsList: $('achievementsList'), statsList: $('statsList'),
      resetProgressBtn: $('resetProgressBtn'),
      navBtns: Array.from(document.querySelectorAll('.nav-btn')),
      screens: { main: $('screen-main'), shop: $('screen-shop'), empire: $('screen-empire'), more: $('screen-more') },
      moreTabBtns: Array.from(document.querySelectorAll('.more-tab-btn')),
      moreTabContents: { achievements: $('moreTab-achievements'), stats: $('moreTab-stats'), settings: $('moreTab-settings') },

      empireIncomeLabel: $('empireIncomeLabel'), empireOwnedLabel: $('empireOwnedLabel'), empireSizeLabel: $('empireSizeLabel'),
      empireGoalName: $('empireGoalName'), empireGoalProgressFill: $('empireGoalProgressFill'), empireGoalProgressLabel: $('empireGoalProgressLabel'),
      empireGoalPathBtn: $('empireGoalPathBtn'),
      empireBuildingList: $('empireBuildingList'), empireSecretsList: $('empireSecretsList'),

      modalBuildingDetail: $('modalBuildingDetail'), buildingDetailCloseBtn: $('buildingDetailCloseBtn'),
      buildingDetailIcon: $('buildingDetailIcon'), buildingDetailName: $('buildingDetailName'),
      buildingDetailStage: $('buildingDetailStage'), buildingDetailLevel: $('buildingDetailLevel'),
      buildingDetailIncome: $('buildingDetailIncome'), buildingDetailBuyBtn: $('buildingDetailBuyBtn'),
      buildingDetailSubgrid: $('buildingDetailSubgrid'),

      modalEmpirePath: $('modalEmpirePath'), empirePathTitle: $('empirePathTitle'),
      empirePathList: $('empirePathList'), empirePathCloseBtn: $('empirePathCloseBtn'),

      modalDaily: $('modalDaily'), dailyDaysRow: $('dailyDaysRow'), dailyRewardAmount: $('dailyRewardAmount'),
      modalInvestment: $('modalInvestment'), investmentBox: $('investmentBox'), investmentAmount: $('investmentAmount'), investmentWin: $('investmentWin'),
      investmentInvestBtn: $('investmentInvestBtn'), investmentRejectBtn: $('investmentRejectBtn'), investmentCharacter: $('investmentCharacter'),
      investorImage: $('investorImage'), investorPlaceholder: $('investorPlaceholder'), investorPlaceholderName: $('investorPlaceholderName'),
      investmentQuote: $('investmentQuote'), investmentWarning: $('investmentWarning'), investmentButtons: $('investmentButtons'),
      investmentRoll: $('investmentRoll'), rollText: $('rollText'), investmentResult: $('investmentResult'),
      resultTitle: $('resultTitle'), resultNum: $('resultNum'), resultSub: $('resultSub'), investmentCloseBtn: $('investmentCloseBtn'),
      taxImage: $('taxImage'), taxEmoji: $('taxEmoji'), machineImage: $('machineImage'), machineEmoji: $('machineEmoji'),
      modalTax: $('modalTax'), taxBox: $('taxBox'), taxNumbers: $('taxNumbers'), taxPayBtn: $('taxPayBtn'), taxResult: $('taxResult'),
      taxResultTitle: $('taxResultTitle'), taxResultNum: $('taxResultNum'), taxResultSub: $('taxResultSub'), taxCloseBtn: $('taxCloseBtn'),
      modalBroken: $('modalBroken'), brokenBox: $('brokenBox'), brokenReels: [$('brokenReel1'), $('brokenReel2'), $('brokenReel3')],
      brokenGambleBtn: $('brokenGambleBtn'), brokenRepairBtn: $('brokenRepairBtn'), brokenButtons: $('brokenButtons'), brokenStatus: $('brokenStatus'),
      brokenResult: $('brokenResult'), brokenResultTitle: $('brokenResultTitle'), brokenResultNum: $('brokenResultNum'), brokenResultSub: $('brokenResultSub'), brokenCloseBtn: $('brokenCloseBtn'),
      dailyClaimBtn: $('dailyClaimBtn'), dailyDoubleBtn: $('dailyDoubleBtn'),
      casinoBackground: $('casinoBackground'), stageProps: $('stageProps'), stagePicA: $('stagePicA'), stagePicB: $('stagePicB'),
      xpTip: $('xpTip'), xpWrap: document.querySelector('.xp-bar-wrap'), onboardGoal: $('onboardGoal'),
      modalWelcome: $('modalWelcome'), welcomeOkBtn: $('welcomeOkBtn'), welcomeGoal: $('welcomeGoal'), welcomeRisk: $('welcomeRisk'),
      empireTotalFill: $('empireTotalFill'), empireTotalLabel: $('empireTotalLabel'),
      empireStepBox: $('empireStepBox'), empireStepName: $('empireStepName'), empireStepFill: $('empireStepFill'), empireStepLabel: $('empireStepLabel'),
      empireBonusEvents: $('empireBonusEvents'), empireBonusRewards: $('empireBonusRewards'), empireBonusBoost: $('empireBonusBoost'),
      modalOffline: $('modalOffline'), offlineAmount: $('offlineAmount'), offlineTime: $('offlineTime'), offlineClaimBtn: $('offlineClaimBtn'),
      achievementToast: $('achievementToast'), achievementToastName: $('achievementToastName'),
      levelUpPopup: $('levelUpPopup'), levelUpNumber: $('levelUpNumber'), levelUpName: $('levelUpName'),
      eventBanner: $('eventBanner'), eventBannerText: $('eventBannerText'),
      modalJackpotEvent: $('modalJackpotEvent'), jackpotThird: $('jackpotThird'),
      jackpotHitBtn: $('jackpotHitBtn'), jackpotTimerFill: $('jackpotTimerFill'),
      coinRainLayer: $('coinRainLayer'),
      modalResetConfirm: $('modalResetConfirm'), resetConfirmYesBtn: $('resetConfirmYesBtn'), resetConfirmNoBtn: $('resetConfirmNoBtn'),
      modalFinalStage: $('modalFinalStage'), finalStageCloseBtn: $('finalStageCloseBtn'),
      phraseBubble: $('phraseBubble'),
      adLoadingOverlay: $('adLoadingOverlay'), adLoadingText: $('adLoadingText'),
      app: $('app')
    };
  },

  init() {
    this.cacheDom();
    this.buildTerminal();
    this.bindEvents();
    // фон статичен в этой версии игры — применяем один раз,
    // а не на каждый refreshHeader() (который вызывается каждую секунду)
    AssetManager.applyBackground('assets/backgrounds/casino_1.png', this.el.bgImage, this.el.bgPlaceholder, this.el.bgPlaceholderName);
    this.refreshAll();
  },

  bindEvents() {
    const el = this.el;
    // не перерисовываем списки, пока палец/мышь прижаты — иначе клик по кнопке терялся
    document.addEventListener('pointerdown', () => { this._pointerDown = true; }, true);
    ['pointerup', 'pointercancel'].forEach((ev) => document.addEventListener(ev, () => { this._pointerDown = false; }, true));
    el.navBtns.forEach((btn) => btn.addEventListener('click', () => this.switchScreen(btn.dataset.screen)));
    el.moreTabBtns.forEach((btn) => btn.addEventListener('click', () => this.switchMoreTab(btn.dataset.moreTab)));

    el.spinButton.addEventListener('click', (e) => { e.preventDefault(); Game.handleSpin(); });
    el.adPauseButton.addEventListener('click', (e) => { e.preventDefault(); Ads.showAdBreakBoost(); });
    el.soundToggleBtn.addEventListener('click', () => this.toggleVolumePop());
    el.volumeMuteBtn.addEventListener('click', () => { this.toggleSound(); this.keepVolumePopOpen(); });
    el.volumeSlider.addEventListener('input', () => this.onVolumeInput(el.volumeSlider.value));
    el.volumeSlider2.addEventListener('input', () => this.onVolumeInput(el.volumeSlider2.value));
    // «щелчок» при отпускании ползунка — чтобы услышать новую громкость
    [el.volumeSlider, el.volumeSlider2].forEach((sl) => sl.addEventListener('change', () => AudioManager.play('click')));
    document.addEventListener('pointerdown', (e) => { if (e.target && e.target.closest && !e.target.closest('.sound-wrap')) this.toggleVolumePop(false); });
    el.soundToggleBtn2.addEventListener('click', () => this.toggleSound());

    el.shopList.addEventListener('click', (e) => {
      const btn = e.target.closest('.shop-item-buy');
      if (!btn) return;
      const id = btn.dataset.id;
      const item = btn.closest('.shop-item');
      if (Upgrades.buy(id)) {
        item.classList.remove('just-bought'); void item.offsetWidth; item.classList.add('just-bought');
        this.refreshShop(); this.refreshHeader();
      }
    });

    /* ---------- Империя ---------- */
    el.empireBuildingList.addEventListener('click', (e) => {
      const upBtn = e.target.closest('.building-upgrade-btn');
      const detailBtn = e.target.closest('.building-detail-btn');
      const pathBtn = e.target.closest('.building-path-btn');
      if (upBtn) {
        const id = upBtn.dataset.id;
        if (EmpireSystem.buyOrLevelUp(id)) { this.refreshEmpireScreen(); this.refreshHeader(); this.refreshAchievementsSilently(); }
        return;
      }
      if (detailBtn) { this.openBuildingDetail(detailBtn.dataset.id); return; }
      if (pathBtn) { this.openEmpirePathModal(pathBtn.dataset.id); return; }
    });
    el.empireGoalPathBtn.addEventListener('click', () => {
      const goal = EmpireSystem.nextGoal();
      if (goal) this.openEmpirePathModal(goal.id);
    });
    el.buildingDetailCloseBtn.addEventListener('click', () => el.modalBuildingDetail.classList.add('hidden'));
    el.buildingDetailBuyBtn.addEventListener('click', () => {
      if (!this.currentDetailBuildingId) return;
      if (EmpireSystem.buyOrLevelUp(this.currentDetailBuildingId)) {
        this.refreshBuildingDetail(this.currentDetailBuildingId);
        this.refreshEmpireScreen(); this.refreshHeader();
        this.refreshAchievementsSilently();
      }
    });
    el.buildingDetailSubgrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.sub-upgrade-buy');
      if (!btn || !this.currentDetailBuildingId) return;
      if (EmpireSystem.buySubUpgrade(this.currentDetailBuildingId, btn.dataset.sub)) {
        this.refreshBuildingDetail(this.currentDetailBuildingId);
        this.refreshHeader();
        this.refreshAchievementsSilently();
      }
    });
    el.empirePathCloseBtn.addEventListener('click', () => el.modalEmpirePath.classList.add('hidden'));

    el.resetProgressBtn.addEventListener('click', () => el.modalResetConfirm.classList.remove('hidden'));
    el.resetConfirmNoBtn.addEventListener('click', () => el.modalResetConfirm.classList.add('hidden'));
    el.resetConfirmYesBtn.addEventListener('click', () => {
      SaveSystem.reset();
      // даём облаку получить пустое сохранение до перезагрузки (но не зависаем, если оно не отвечает)
      let gone = false; const go = () => { if (!gone) { gone = true; location.reload(); } };
      SaveSystem.pushCloud(true).then(go, go); setTimeout(go, 2500);
    });

    el.jackpotHitBtn.addEventListener('click', () => { if (this._jackpotResolve) this._jackpotResolve(true); });
    el.investmentInvestBtn.addEventListener('click', () => this.resolveInvestment(true));
    el.investmentRejectBtn.addEventListener('click', () => this.resolveInvestment(false));
    el.investmentCloseBtn.addEventListener('click', () => this.closeInvestment());
    el.taxPayBtn.addEventListener('click', () => this.payTax());
    el.taxCloseBtn.addEventListener('click', () => this.closeTax());
    el.brokenGambleBtn.addEventListener('click', () => this.brokenGamble());
    el.brokenRepairBtn.addEventListener('click', () => this.brokenRepair());
    el.brokenCloseBtn.addEventListener('click', () => this.closeBroken());
    el.offlineClaimBtn.addEventListener('click', () => this.claimOffline());
    el.onboardGoal.addEventListener('click', () => this.switchScreen('empire'));
    // подсказка у XP: на ПК — по наведению (CSS), на телефоне — по тапу
    el.xpWrap.addEventListener('click', () => {
      el.xpWrap.classList.add('tip-open');
      clearTimeout(this._xpTipTimer);
      this._xpTipTimer = setTimeout(() => el.xpWrap.classList.remove('tip-open'), 3200);
    });
    el.finalStageCloseBtn.addEventListener('click', () => el.modalFinalStage.classList.add('hidden'));
  },

  switchScreen(name) {
    Object.keys(this.el.screens).forEach((key) => this.el.screens[key].classList.toggle('active', key === name));
    this.el.navBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.screen === name));
    // на списочных экранах картинка этапа приглушается, чтобы заголовки и подписи читались на любом фоне
    this.el.casinoBackground.classList.toggle('dim', name !== 'main');
    // первое открытие вкладки — коротко объясняем, зачем она нужна
    const hints = { shop: __t('🛒 МАГАЗИН — улучшения круток и пассивного дохода'), empire: __t('👑 ИМПЕРИЯ — здания дают доход каждую секунду'), more: __t('📋 ЕЩЁ — достижения, статистика и настройки') };
    const tut = GameState.data.tutorial;
    if (hints[name] && tut.welcomeShown && !tut.seenTabs[name]) { tut.seenTabs[name] = true; this.showEventBanner(hints[name]); SaveSystem.save(); }
    this.refreshOnboarding();
    this.refreshActiveScreen();
  },
  switchMoreTab(name) {
    Object.keys(this.el.moreTabContents).forEach((key) => this.el.moreTabContents[key].classList.toggle('active', key === name));
    this.el.moreTabBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.moreTab === name));
    if (name === 'stats') this.refreshStats();
    if (name === 'achievements') this.refreshAchievements();
  },
  refreshActiveScreen() {
    if (this._pointerDown) return;
    if (this.currentDetailBuildingId && this.el.modalBuildingDetail && !this.el.modalBuildingDetail.classList.contains('hidden')) this.refreshBuildingDetail(this.currentDetailBuildingId);
    if (this.el.screens.shop.classList.contains('active')) this.refreshShop();
    if (this.el.screens.empire.classList.contains('active')) this.refreshEmpireScreen();
    if (this.el.screens.more.classList.contains('active')) {
      if (this.el.moreTabContents.stats.classList.contains('active')) this.refreshStats();
      if (this.el.moreTabContents.achievements.classList.contains('active')) this.refreshAchievements();
    }
  },
  refreshAll() { this.refreshHeader(); this.refreshActiveScreen(); },
  refreshAchievementsSilently() { Achievements.checkAll().forEach((a) => this.showAchievementToast(a)); },

  toggleSound() {
    AudioManager.setEnabled(!AudioManager.enabled);
    GameState.data.soundEnabled = AudioManager.enabled;
    this.updateSoundButtons();
    SaveSystem.save();
  },
  /** Иконка показывает состояние: 🔇 выключен или громкость 0, 🔉 тихо, 🔊 громко. */
  volumeIcon() {
    const v = AudioManager.volume;
    return (!AudioManager.enabled || v <= 0) ? '🔇' : (v < 0.5 ? '🔉' : '🔊');
  },
  updateSoundButtons() {
    const on = AudioManager.enabled, pct = Math.round(AudioManager.volume * 100), icon = this.volumeIcon();
    this.el.soundToggleBtn.textContent = icon;
    this.el.volumeMuteBtn.textContent = icon;
    this.el.soundToggleBtn2.textContent = on ? __t('ВКЛ') : __t('ВЫКЛ');
    this.el.soundToggleBtn2.classList.toggle('off', !on);
    [this.el.volumeSlider, this.el.volumeSlider2].forEach((sl) => { sl.value = String(pct); sl.style.setProperty('--v', pct + '%'); });
    this.el.volumeValue.textContent = on ? pct + '%' : __t('ВЫКЛ');
  },
  toggleVolumePop(force) {
    const pop = this.el.volumePop;
    const open = typeof force === 'boolean' ? force : pop.classList.contains('hidden');
    pop.classList.toggle('hidden', !open);
    this.el.soundToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    clearTimeout(this._volTimer);
    if (open) this._volTimer = setTimeout(() => this.toggleVolumePop(false), 5000);
  },
  keepVolumePopOpen() { clearTimeout(this._volTimer); this._volTimer = setTimeout(() => this.toggleVolumePop(false), 5000); },
  /** Ползунок: двигаем громкость; если звук был выключен — включаем (двигал ползунок = хочет слышать). */
  onVolumeInput(value) {
    const v = Math.min(100, Math.max(0, Number(value) || 0)) / 100;
    AudioManager.setVolume(v);
    if (v > 0 && !AudioManager.enabled) { AudioManager.setEnabled(true); GameState.data.soundEnabled = true; }
    this.updateSoundButtons();
    this.keepVolumePopOpen();
  },

  /* ---------- шапка ---------- */
  refreshHeader() {
    const s = GameState.data;
    // во время розыгрыша события баланс на экране «заморожен», чтобы не выдать результат раньше времени
    const balance = Math.floor(this._hold ? this._holdValue : s.balance);
    if (balance !== this.lastDisplayedBalance) {
      this.el.statBalance.classList.remove('flash-up'); void this.el.statBalance.offsetWidth; this.el.statBalance.classList.add('flash-up');
      this.lastDisplayedBalance = balance;
    }
    this.el.statBalance.textContent = Utils.formatNumber(balance);
    this.el.statIncome.textContent = '+' + Utils.formatRate(Economy.incomePerSecond()) + __t('/сек');
    const mult = Economy.temporaryMultiplier();
    this.el.statMultiplier.textContent = '×' + (Math.abs(mult - Math.round(mult)) < 0.05 ? Math.round(mult) : mult.toFixed(1));
    this.el.statLevel.textContent = s.level;

    const required = Economy.xpRequiredForLevel(s.level);
    const pct = Utils.clamp((s.xp / required) * 100, 0, 100);
    this.el.xpBarFill.style.width = pct + '%';
    this.el.xpBarLabel.textContent = `${Economy.levelName(s.level)} · ${Utils.formatNumber(Math.floor(s.xp))} / ${Utils.formatNumber(required)} XP`;
    const tip = this.xpTipText(s.level);
    if (this._xpTipCache !== tip) { this._xpTipCache = tip; this.el.xpTip.textContent = tip; }

    this.updateSoundButtons();
    this.updateAdBreakButtonState();
  },

  updateAdBreakButtonState() {
    const now = Utils.now();
    const active = GameState.data.temp.adBoostUntil > now;
    this.el.adPauseButton.classList.toggle('active-boost', active);
    const sub = this.el.adPauseButton.querySelector('.ad-pause-sub');
    const mult = Math.round(Economy.adBreakMultiplierFinal());
    if (active) {
      const left = Math.ceil((GameState.data.temp.adBoostUntil - now) / 1000);
      this.el.adPauseButton.childNodes[0].textContent = __t('📺 БУРМАЛДА ЗАВОЗ АКТИВЕН ');
      sub.textContent = __tt`Осталось ${left} сек · ×${mult} доход`;
    } else {
      this.el.adPauseButton.childNodes[0].textContent = __t('📺 РЕКЛАМНАЯ ПАУЗА ');
      sub.textContent = __tt`Посмотри рекламу — ×${mult} доход на ${CONFIG.ads.adBreakBoostDurationSec} сек`;
    }
  },

  /* ---------- магазин ---------- */
  refreshShop() {
    this.el.shopList.innerHTML = CONFIG.upgrades.map((def) => {
      const lvl = Economy.upgradeLevel(def.id);
      const cost = Economy.upgradeCost(def.id);
      const maxed = Economy.upgradeMaxed(def.id);
      const locked = !maxed && Economy.upgradeLocked(def.id);
      const need = Economy.upgradeClicksRequired(def.id);
      const afford = GameState.data.balance >= cost && !locked;
      return `
        <div class="shop-item" data-id="${def.id}">
          <div class="shop-item-top">
            <div class="shop-item-icon">${assetIcon(def.id, def.name)}</div>
            <div class="shop-item-info">
              <div class="shop-item-name">${def.name}</div>
              <div class="shop-item-level">${__t('Уровень')} ${lvl}${def.maxLevel ? ' / ' + def.maxLevel : ''}</div>
            </div>
          </div>
          <div class="shop-item-desc">${def.desc}</div>
          <div class="shop-item-effect">${Economy.upgradeMaxed(def.id) ? __t('МАКСИМАЛЬНЫЙ УРОВЕНЬ') : def.effectLabel(lvl, lvl + 1)}</div>
          <button class="shop-item-buy" data-id="${def.id}" ${afford && !maxed ? '' : 'disabled'}>${maxed ? __t('МАКС') : locked ? '🔒 ' + Utils.formatNumber(GameState.data.stats.totalClicks) + ' / ' + Utils.formatNumber(need) + __t(' кликов · ') + Utils.formatNumber(cost) + ' 💰' : __t('КУПИТЬ · ') + Utils.formatNumber(cost) + ' 💰'}</button>
        </div>`;
    }).join('');
  },

  /* ---------- Полосы цели/Империи (лёгкое обновление раз в секунду) ---------- */
  refreshGoalProgress() {
    const el = this.el;
    if (!el.empireGoalProgressFill) return;
    const gp = EmpireSystem.goalProgress();
    const total = EmpireSystem.completionPct();
    el.empireTotalFill.style.width = total + '%';
    el.empireTotalLabel.textContent = total.toFixed(1).replace('.', DEC) + '%';
    if (gp.goal) el.empireGoalName.innerHTML = `${assetIcon(gp.goal.id, gp.goal.name)} <span>${gp.goal.name}</span>`;
    else el.empireGoalName.textContent = __t('👑 ВСЁ ПОСТРОЕНО');
    el.empireGoalProgressFill.style.width = gp.pct + '%';
    el.empireGoalProgressLabel.textContent = gp.label;
    if (gp.step) {
      el.empireStepBox.classList.remove('hidden');
      el.empireStepName.textContent = '➡️ ' + gp.step.name;
      el.empireStepFill.style.width = gp.step.pct + '%';
      el.empireStepLabel.textContent = gp.step.label;
    } else el.empireStepBox.classList.add('hidden');
    const f1 = (n) => (Math.round(n * 10) / 10).toString().replace('.', DEC);
    const evb = EmpireSystem.getGlobalBonus('eventChance');
    if (el.empireBonusEvents) {
      el.empireBonusEvents.textContent = `${f1(CONFIG.events.triggerChance * 100 + evb)}%` + (evb > 0 ? __tt` (+${f1(evb)} п.п.)` : '');
      const be = EmpireSystem.getGlobalBonus('boostEffectiveness');
      el.empireBonusBoost.textContent = '+' + f1(be) + __t('% (бум ×') + f1(1 + (CONFIG.events.boomMultiplier - 1) * (1 + be / 100)) + ')';
    }
  },

  /* ---------- Визуальные этапы Империи ---------- */
  applyStage() {
    const id = this._forceStage || EmpireSystem.currentStageId();
    if (this._stageId === id) return;
    const first = this._stageId === undefined;
    this._stageId = id;
    const sc = CONFIG.stageScenes[id] || CONFIG.stageScenes.start;
    this.el.casinoBackground.dataset.stage = id;
    this.el.casinoBackground.setAttribute('data-stage', id);
    this.el.stageProps.innerHTML = sc.props.map((p, i) => `<span class="stage-prop sp${i}">${p}</span>`).join('');
    this.setStagePicture(sc.pic);
    if (!first) {
      this.showEventBanner(__tt`🏗️ НОВЫЙ ЭТАП: ${sc.title} — ${sc.tagline}`);
      this.flashScreen();
      AudioManager.play('levelup');
    }
  },

  /* ---------- Империя: главный экран ---------- */
  refreshEmpireScreen() {
    const totalIncome = EmpireSystem.totalIncomePerSecond();
    this.el.empireIncomeLabel.textContent = '+' + Utils.formatRate(totalIncome) + __t('/сек');
    this.el.empireOwnedLabel.textContent = `${EmpireSystem.ownedCount()} / ${GAME_CONFIG.empire.buildings.length}`;
    this.el.empireSizeLabel.textContent = Utils.formatNumber(EmpireSystem.empireSize());

    this.refreshGoalProgress();

    this.el.empireBuildingList.innerHTML = GAME_CONFIG.empire.buildings.map((b) => {
      const level = EmpireSystem.getLevel(b.id);
      const owned = level >= 1;
      const unlockable = EmpireSystem.isUnlockable(b);
      const stage = EmpireSystem.visualStage(b);
      const cost = EmpireSystem.nextLevelCost(b);
      const afford = GameState.data.balance >= cost;

      if (!owned && !unlockable) {
        return `
          <div class="building-card locked">
            <div class="building-card-top">
              <div class="building-card-icon">${assetIcon('locked', __t('Заблокировано'))}</div>
              <div class="building-card-info">
                <div class="building-card-name">${__t('🔒 ЗАБЛОКИРОВАНО')}</div>
                <div class="building-card-stage">${b.name}</div>
              </div>
            </div>
            <div class="building-card-req">${__t('Нужно')}: ${EmpireSystem.unlockRequirementText(b)}</div>
            <button class="building-path-btn" data-id="${b.id}${__t('">ПОКАЗАТЬ ПУТЬ')}</button>
          </div>`;
      }

      if (!owned && unlockable) {
        return `
          <div class="building-card unlockable">
            <div class="building-card-top">
              <div class="building-card-icon">${assetIcon(b.id, b.name)}</div>
              <div class="building-card-info">
                <div class="building-card-name">${b.name}</div>
                <div class="building-card-stage">${__t('Готово к покупке')}</div>
              </div>
            </div>
            <div class="building-progress-track"><div class="building-progress-fill" style="width:${Utils.clamp(GameState.data.balance / cost * 100, 0, 100)}%"></div></div>
            <div class="building-progress-label">${Utils.formatNumber(Math.floor(GameState.data.balance))} / ${Utils.formatNumber(cost)}</div>
            <button class="building-upgrade-btn" data-id="${b.id}" ${afford ? '' : 'disabled'}${__t('>КУПИТЬ ЗДАНИЕ')} · ${Utils.formatNumber(cost)} 💰</button>
          </div>`;
      }

      const income = EmpireSystem.buildingIncome(b);
      return `
        <div class="building-card owned">
          <div class="building-card-top">
            <div class="building-card-icon">${assetIcon(b.id, stage.name)}</div>
            <div class="building-card-info">
              <div class="building-card-name">${b.name}</div>
              <div class="building-card-stage">${stage.name} · ${__t('Уровень')} ${level}/${b.maxLevel}</div>
            </div>
          </div>
          <div class="building-card-income">${__t('Доход: +')}${Utils.formatRate(income)}/${__t('сек')}</div>
          <div class="building-progress-track"><div class="building-progress-fill" style="width:${Utils.clamp(GameState.data.balance / cost * 100, 0, 100)}%"></div></div>
          <div class="building-progress-label">${Utils.formatNumber(Math.floor(GameState.data.balance))} / ${Utils.formatNumber(cost)}</div>
          <div class="building-card-actions">
            <button class="building-upgrade-btn" data-id="${b.id}" ${afford && level < b.maxLevel ? '' : 'disabled'}>${level >= b.maxLevel ? __t('МАКС') : __t('УЛУЧШИТЬ · ') + Utils.formatNumber(cost) + ' 💰'}</button>
            <button class="building-detail-btn" data-id="${b.id}${__t('">УЛУЧШЕНИЯ ▸')}</button>
          </div>
        </div>`;
    }).join('');

    this.el.empireSecretsList.innerHTML = GAME_CONFIG.empire.secrets.map((secret) => {
      const unlocked = !!GameState.data.empire.secretsUnlocked[secret.id];
      return `
        <div class="secret-item ${unlocked ? 'unlocked' : ''}">
          <div class="secret-icon">${unlocked ? secret.icon : '🔒'}</div>
          <div>
            <div class="secret-name">${unlocked ? secret.name : '???'}</div>
            <div class="secret-desc">${unlocked ? __t('Бонус получен: +0,25 к множителю навсегда') : secret.desc}</div>
          </div>
        </div>`;
    }).join('');
  },

  /* ---------- Империя: детальная панель здания ---------- */
  openBuildingDetail(buildingId) {
    this.currentDetailBuildingId = buildingId;
    this.refreshBuildingDetail(buildingId);
    this.el.modalBuildingDetail.classList.remove('hidden');
  },
  refreshBuildingDetail(buildingId) {
    const b = EmpireSystem.def(buildingId);
    if (!b) return;
    const level = EmpireSystem.getLevel(buildingId);
    const stage = EmpireSystem.visualStage(b);
    const cost = EmpireSystem.nextLevelCost(b);
    const afford = GameState.data.balance >= cost;

    this.el.buildingDetailIcon.innerHTML = assetIcon(b.id, stage.name);
    this.el.buildingDetailName.textContent = b.name;
    this.el.buildingDetailStage.textContent = stage.name;
    this.el.buildingDetailLevel.textContent = __t('Уровень ') + level + ' / ' + b.maxLevel;
    this.el.buildingDetailIncome.textContent = '+' + Utils.formatRate(EmpireSystem.buildingIncome(b)) + __t('/сек');
    const bMax = level >= b.maxLevel;
    this.el.buildingDetailBuyBtn.textContent = bMax ? __t('МАКС') : __tt`УЛУЧШИТЬ ЗДАНИЕ · ${Utils.formatNumber(cost)} 💰`;
    this.el.buildingDetailBuyBtn.disabled = !afford || bMax;

    const st = EmpireSystem.state(buildingId);
    this.el.buildingDetailSubgrid.innerHTML = b.subUpgrades.map((su) => {
      const suLevel = st.sub[su.id] || 0;
      const suCost = EmpireSystem.subUpgradeCost(b, su);
      const suMax = suLevel >= su.maxLevel;
      const suAfford = GameState.data.balance >= suCost && !suMax;
      return __tt`
        <div class="sub-upgrade-card">
          <div class="sub-upgrade-icon">${assetIcon(su.id, su.name)}</div>
          <div class="sub-upgrade-name">${su.name}</div>
          <div class="sub-upgrade-level">Уровень ${suLevel} / ${su.maxLevel}</div>
          <div class="sub-upgrade-effect">${EmpireSystem.subEffectText(b, su)}</div>
          <button class="sub-upgrade-buy" data-sub="${su.id}" ${suAfford ? '' : 'disabled'}>${suMax ? __t('МАКС') : Utils.formatNumber(suCost) + ' 💰'}</button>
        </div>`;
    }).join('');
  },

  /* ---------- Империя: путь к разблокировке ---------- */
  openEmpirePathModal(buildingId) {
    const b = EmpireSystem.def(buildingId);
    if (!b) return;
    this.el.empirePathTitle.textContent = __t('ПУТЬ К: ') + b.icon + ' ' + b.name;
    this.el.empirePathList.innerHTML = b.unlockRequirements.length
      ? b.unlockRequirements.map((req) => {
          let done = false, label = '';
          if (req.type === 'buildingLevel') {
            const cur = EmpireSystem.getLevel(req.building);
            done = cur >= req.value;
            const rb = EmpireSystem.def(req.building);
            label = __tt`${rb ? rb.name : req.building}: уровень ${cur} / ${req.value}`;
          } else if (req.type === 'totalClicks') {
            done = GameState.data.stats.totalClicks >= req.value;
            label = __tt`Клики: ${Utils.formatNumber(GameState.data.stats.totalClicks)} / ${Utils.formatNumber(req.value)}`;
          } else if (req.type === 'earned') {
            done = GameState.data.stats.totalEarned >= req.value;
            label = __tt`Заработано: ${Utils.formatNumber(GameState.data.stats.totalEarned)} / ${Utils.formatNumber(req.value)}`;
          } else if (req.type === 'achievementsCount') {
            const cur = Object.keys(GameState.data.achievements).length;
            done = cur >= req.value;
            label = __tt`Достижения: ${cur} / ${req.value}`;
          }
          return `<div class="empire-path-row ${done ? 'done' : ''}"><span>${done ? '✅' : '⬜'}</span><span>${label}</span></div>`;
        }).join('')
      : __t('<div class="empire-path-row done"><span>✅</span><span>Требований нет — можно покупать сразу!</span></div>');
    this.el.modalEmpirePath.classList.remove('hidden');
  },

  /* ---------- достижения ---------- */
  refreshAchievements() {
    const s = GameState.data;
    this.el.achievementsList.innerHTML = Achievements.list.map((a) => {
      const unlocked = !!s.achievements[a.id];
      return `
        <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
          <div class="achievement-icon">${assetIcon(a.id, a.name)}</div>
          <div><div class="achievement-name">${a.name}</div><div class="achievement-desc">${a.desc}</div></div>
        </div>`;
    }).join('');
  },

  /* ---------- статистика ---------- */
  refreshStats() {
    const s = GameState.data;
    const rows = [
      [__t('Всего кликов'), Utils.formatNumber(s.stats.totalClicks)],
      [__t('Всего заработано'), Utils.formatNumber(s.stats.totalEarned)],
      [__t('Доход в секунду'), Utils.formatNumber(Economy.incomePerSecond())],
      [__t('Бурмалды за клик'), Utils.formatNumber(Economy.currentClickUnit())],
      [__t('Критических кликов'), Utils.formatNumber(s.stats.criticalHits)],
      [__t('Крупных выигрышей'), Utils.formatNumber(s.stats.bigWins)],
      [__t('Безумных джекпотов'), Utils.formatNumber(s.stats.jackpots)],
      [__t('Проигрышей'), Utils.formatNumber(s.stats.losses)],
      [__t('Потеряно на проигрышах'), Utils.formatNumber(s.stats.totalLost)],
      [__t('Купленных улучшений'), Utils.formatNumber(s.stats.upgradesBought)],
      [__t('Просмотрено реклам'), Utils.formatNumber(s.stats.adsWatched)],
      [__t('Размер Империи'), Utils.formatNumber(EmpireSystem.empireSize())],
      [__t('Время в игре'), Utils.formatTime(s.stats.playTimeSec)],
      [__t('Максимальный баланс'), Utils.formatNumber(s.stats.maxBalance)]
    ];
    this.el.statsList.innerHTML = rows.map(([label, value]) => `<div class="stats-row"><span>${label}</span><span>${value}</span></div>`).join('');
  },

  /* ---------- очередь модальных окон ---------- */
  enqueueModal(jobFn) { this.modalQueue.push(jobFn); this.processModalQueue(); },
  processModalQueue() {
    if (this.modalBusy || !this.modalQueue.length) return;
    this.modalBusy = true;
    const job = this.modalQueue.shift();
    job(() => { this.modalBusy = false; setTimeout(() => this.processModalQueue(), 250); });
  },
  isAnyModalOpen() { return !!document.querySelector('.modal-overlay:not(.hidden)'); },

  showDailyModal() {
    this.enqueueModal((done) => {
      const el = this.el;
      const dayNumber = DailyReward.currentDayNumber();
      const reward = DailyReward.rewardForDay(dayNumber);
      el.dailyDaysRow.innerHTML = CONFIG.dailyRewards.map((r) => {
        const cls = r.day === dayNumber ? 'today' : (r.day < dayNumber ? 'done' : '');
        return __tt`<div class="daily-day ${cls}">Д${r.day}</div>`;
      }).join('');
      el.dailyRewardAmount.textContent = reward.label || __tt`БОНУС НА ${Math.round((reward.boostDurationSec || 0) / 60)} МИН`;
      el.dailyDoubleBtn.disabled = false;
      el.modalDaily.classList.remove('hidden');
      const cleanup = () => { el.modalDaily.classList.add('hidden'); el.dailyClaimBtn.onclick = null; el.dailyDoubleBtn.onclick = null; done(); };
      el.dailyClaimBtn.onclick = () => { DailyReward.claim(); UI.refreshAll(); UI.showPhrase(randomPhrase('levelUp')); cleanup(); };
      el.dailyDoubleBtn.onclick = () => {
        el.dailyDoubleBtn.disabled = true;
        if (DailyReward.isAvailableToday()) DailyReward.claim();
        DailyReward.doubleViaAd((ok) => { if (ok) UI.showEventBanner(__t('БУРМАЛДА ЗАВОЗ ×2!')); UI.refreshAll(); cleanup(); });
      };
    });
  },

  grantBigWin(amount, isJackpot) {
    // Крупные выигрыши больше НЕ блокируют игру модальным окном.
    // Деньги начисляются сразу, а игрок получает короткую красочную анимацию.
    Economy.addBalance(amount);
    this.showBigWinCelebration(amount, isJackpot);
    this.refreshAll();
    AudioManager.play('jackpot');
  },

  showBigWinCelebration(amount, isJackpot) {
    const el = this.el;
    const text = document.createElement('div');
    text.className = 'big-win-celebration' + (isJackpot ? ' jackpot' : '');
    text.innerHTML = `<div class="big-win-celebration-title">${isJackpot ? __t('💎 БЕЗУМНЫЙ ДЖЕКПОТ!') : __t('🎉 КРУПНЫЙ ВЫИГРЫШ!')}</div><div class="big-win-celebration-amount">+${Utils.formatNumber(amount)}</div>`;
    el.floatingLayer.appendChild(text);
    const quiet = Utils.now() - (this._lastCel || 0) < 4000; this._lastCel = Utils.now();
    if (!quiet) { this.flashScreen(); this.shakeScreen(); }
    this.spawnParticles(50, 46, quiet ? 6 : (isJackpot ? 70 : 35), isJackpot ? 'var(--gold)' : 'var(--pink)');
    this.showEventBanner(`${isJackpot ? __t('💎 ДЖЕКПОТ') : __t('🎉 КРУПНЫЙ ВЫИГРЫШ')} +${Utils.formatNumber(amount)}`);
    setTimeout(() => text.remove(), 1800);
  },

  showAdLoadingOverlay(show) {
    if (show) {
      this.el.adLoadingText.textContent = YandexSDK.ready ? __t('Показ видеорекламы через Яндекс SDK...') : __t('Показ тестовой заглушки рекламы (SDK не подключен)...');
      this.el.adLoadingOverlay.classList.remove('hidden');
    } else { this.el.adLoadingOverlay.classList.add('hidden'); }
  },

  showAchievementToast(a) { this.achievementQueue.push(a); this.processAchievementQueue(); },
  processAchievementQueue() {
    if (this.achievementBusy || !this.achievementQueue.length) return;
    this.achievementBusy = true;
    const a = this.achievementQueue.shift();
    this.el.achievementToastName.textContent = `${a.icon} ${a.name}`;
    this.el.achievementToast.classList.remove('hidden');
    AudioManager.play('levelup');
    setTimeout(() => { this.el.achievementToast.classList.add('hidden'); this.achievementBusy = false; setTimeout(() => this.processAchievementQueue(), 200); }, 3300);
  },

  showLevelUpPopup(level) {
    this.el.levelUpNumber.textContent = level;
    this.el.levelUpName.textContent = Economy.levelName(level);
    this.el.levelUpPopup.classList.remove('hidden');
    AudioManager.play('levelup');
    setTimeout(() => this.el.levelUpPopup.classList.add('hidden'), 2100);
  },

  /* =================== Терминал слотов =================== */
  buildTerminal() {
    ['bulbsTop', 'bulbsBottom'].forEach((k) => {
      const box = this.el[k]; if (!box) return;
      let html = ''; for (let i = 0; i < 13; i++) html += `<i class="bulb" style="--i:${i}"></i>`;
      box.innerHTML = html;
    });
    Game.initReels();
    this.setTerminalStatus(null, 'idle');
  },
  /** ЖК-строка терминала: текст + вид (idle|spin|win|big|crit|super|jackpot|lose). */
  setTerminalStatus(text, kind) {
    const el = this.el.terminalLcdText; if (!el) return;
    const k = kind || 'idle';
    const msg = text || __t('ГОТОВ · ЖМИ КРУТИТЬ');
    el.className = 'lcd-text lcd-' + k + (msg.length > 21 ? ' lcd-small' : '');   // длинная сумма — мельче, чтобы не обрезалась
    el.textContent = msg;
  },
  /** Точка в процентах слоя эффектов — центр барабанов терминала. */
  terminalPoint() {
    const t = this.el.terminal, L = this.el.floatingLayer;
    if (t && L && t.offsetWidth && L.offsetWidth && L.offsetHeight) return [Math.round((t.offsetLeft + t.offsetWidth / 2) / L.offsetWidth * 100), Math.round((t.offsetTop + t.offsetHeight * 0.45) / L.offsetHeight * 100)];
    return [50, 48];
  },
  /** Реакция терминала на результат: ЖК-экран, линия выплат, лампы, вспышки барабанов, монеты. */
  terminalFx(result, text) {
    const t = this.el.terminal; if (!t) return;
    const kind = result.isLose ? 'lose' : result.isJackpot ? 'jackpot' : result.isSuper ? 'super' : result.isCrit ? 'crit' : result.outcome === 'big' ? 'big' : 'win';
    const cls = { lose: 't-lose', jackpot: 't-jackpot', super: 't-big', crit: 't-big', big: 't-big', win: 't-win' }[kind];
    const hold = { lose: 800, jackpot: 2400, super: 1600, crit: 1500, big: 1500, win: 1000 }[kind];
    const all = ['t-win', 't-big', 't-jackpot', 't-lose'];
    all.forEach((c) => t.classList.remove(c)); void t.offsetWidth; t.classList.add(cls);
    clearTimeout(this._tFxTimer);
    this._tFxTimer = setTimeout(() => { all.forEach((c) => t.classList.remove(c)); this.setTerminalStatus(null, 'idle'); }, hold);
    this.setTerminalStatus(text.replace(__t('БЕЗУМНЫЙ ДЖЕКПОТ!'), __t('ДЖЕКПОТ!')), kind);   // только текст и цифры, без смайликов
    if (kind === 'jackpot') this.burst(t, ['💰', '🤑', '⭐', '💎', '7️⃣'], 26);
    else if (kind === 'big' || kind === 'crit' || kind === 'super') this.burst(t, ['💰', '✨', '🤑'], 10);
    else if (kind === 'win') this.burst(t, ['💸'], 3);
    if (kind === 'lose') { t.classList.add('shake-mini'); setTimeout(() => t.classList.remove('shake-mini'), 350); }
  },

  /** Состояние заменено облачным уже после старта: закрыть приветствие (если игрок уже проходил) и перерисовать всё. */
  applyLoadedState() {
    const w = this.el.modalWelcome;
    if (GameState.data.tutorial.welcomeShown && w && !w.classList.contains('hidden')) { w.classList.add('hidden'); this._modalQueue = []; this._modalActive = false; }
    this._stageId = undefined; this.applyStage(); this.refreshOnboarding(); this.refreshAll();
    this.showEventBanner(__t('☁️ ПРОГРЕСС ЗАГРУЖЕН ИЗ ОБЛАКА'));
  },

  /** Кратко: ближайшая награда за уровень (показывается по наведению на полосу XP). */
  xpTipText(level) {
    const n = level + 1, g = Math.round((CONFIG.clickRewardLevelGrowth - 1) * 100);
    return __tt`🎁 Ур. ${n}: ранг «${Economy.levelName(n)}» · клик +${g}%` + (n === 10 ? __t(' · 🏆 достижение') : '');
  },

  /** Фон-картинка этапа: assets/backgrounds/pic1.png … pic8.png. Нет файла — остаётся градиент/эмодзи. */
  setStagePicture(file) {
    const bg = this.el.casinoBackground, A = this.el.stagePicA, B = this.el.stagePicB;
    const clear = () => { A.classList.remove('show'); B.classList.remove('show'); bg.classList.remove('has-pic'); };
    if (!file) { clear(); return; }
    const token = (this._picToken = (this._picToken || 0) + 1);
    this._picStamp = this._picStamp || Date.now();
    const probe = new Image();
    probe.onload = () => {
      if (token !== this._picToken) return;
      const frontIsA = this._picFront === 'A';
      const next = frontIsA ? B : A, prev = frontIsA ? A : B;
      next.src = probe.src;
      next.classList.add('show'); prev.classList.remove('show');
      this._picFront = frontIsA ? 'B' : 'A';
      bg.classList.add('has-pic');
    };
    probe.onerror = () => { if (token === this._picToken) clear(); };
    probe.src = 'assets/backgrounds/' + file + '?v=' + this._picStamp;
  },

  /* ---------- Первый запуск ---------- */
  showWelcome(replay) {
    this.enqueueModal((done) => {
      const el = this.el, o = CONFIG.spinOutcomes;
      const w = (id) => o.find((x) => x.id === id);
      const pct = (id) => Utils.formatPercentRu(w(id).weight);
      const basement = EmpireSystem.def('basement');
      el.welcomeGoal.innerHTML = __tt`🎯 <b>Твоя цель:</b> купи <b>ПОДВАЛ</b> (${Utils.formatNumber(EmpireSystem.nextLevelCost(basement))} 💰) во вкладке «Империя» — он начнёт приносить деньги сам.`;
      el.welcomeRisk.textContent = __tt`${pct('lose')} круток — проигрыш: теряешь сумму одной крутки. Зато ${pct('normal')} дают выигрыш, ${pct('big')} — крупный, ${pct('crazy')} — джекпот ×${w('crazy').minMult}–×${w('crazy').maxMult}. В среднем крутка приносит плюс, а Страховка в магазине уменьшает проигрыши.`;
      el.modalWelcome.classList.remove('hidden');
      el.welcomeOkBtn.onclick = () => {
        el.modalWelcome.classList.add('hidden'); el.welcomeOkBtn.onclick = null;
        if (!replay) { GameState.data.tutorial.welcomeShown = true; SaveSystem.save(); }
        this.refreshOnboarding();
        done();
      };
    });
  },

  /** Одна понятная цель на главном экране — только пока новичок не открыл Гараж. */
  refreshOnboarding() {
    const el = this.el, t = GameState.data.tutorial;
    if (!el.onboardGoal) return;
    const empireBtn = el.navBtns.find((b) => b.dataset.screen === 'empire');
    const hide = () => { el.onboardGoal.classList.add('hidden'); if (empireBtn) empireBtn.classList.remove('nav-hint'); };
    if (t.done || !t.welcomeShown) { hide(); return; }
    if (EmpireSystem.isOwned('garage')) { t.done = true; SaveSystem.save(); hide(); return; }
    const bal = Math.floor(GameState.data.balance);
    let text;
    if (!EmpireSystem.isOwned('basement')) {
      const cost = EmpireSystem.nextLevelCost(EmpireSystem.def('basement'));
      text = bal >= cost ? __tt`🎯 Цель: купи ПОДВАЛ во вкладке «Империя» — ${Utils.formatNumber(cost)} 💰`
                         : __tt`🎯 Цель: накопи ${Utils.formatNumber(cost)} 💰 — жми КРУТИТЬ (сейчас ${Utils.formatNumber(bal)})`;
    } else {
      const req = EmpireSystem.def('garage').unlockRequirements.find((r) => r.type === 'buildingLevel');
      text = __tt`🎯 Цель: прокачай ПОДВАЛ до ${req.value} ур. (сейчас ${EmpireSystem.getLevel('basement')}) — откроется ГАРАЖ`;
    }
    el.onboardGoal.textContent = text;
    el.onboardGoal.classList.remove('hidden');
    const empireActive = el.screens.empire.classList.contains('active');
    if (empireBtn) empireBtn.classList.toggle('nav-hint', !empireActive && (EmpireSystem.isOwned('basement') || bal >= EmpireSystem.nextLevelCost(EmpireSystem.def('basement'))));
  },

  showEventBanner(text) {
    this.el.eventBannerText.textContent = text;
    this.el.eventBanner.classList.remove('hidden');
    setTimeout(() => this.el.eventBanner.classList.add('hidden'), 3100);
  },

  showPhrase(text) {
    this.el.phraseBubble.textContent = text;
    this.el.phraseBubble.classList.remove('hidden');
    setTimeout(() => this.el.phraseBubble.classList.add('hidden'), 1850);
  },

  flashScreen(kind) {
    const flash = document.createElement('div');
    flash.className = 'screen-flash' + (kind ? ' ' + kind : '');
    this.el.app.appendChild(flash);
    setTimeout(() => flash.remove(), 550);
  },
  shakeScreen() { this.el.app.classList.remove('shake'); void this.el.app.offsetWidth; this.el.app.classList.add('shake'); },

  spawnParticles(xPercent, yPercent, count, color) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Utils.randomInt(4, 9);
      p.style.width = size + 'px'; p.style.height = size + 'px';
      p.style.left = xPercent + '%'; p.style.top = yPercent + '%';
      p.style.background = color || 'var(--gold)';
      const angle = Math.random() * Math.PI * 2;
      const dist = Utils.randomInt(30, 70);
      p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
      this.el.floatingLayer.appendChild(p);
      setTimeout(() => p.remove(), 750);
    }
  },

  spawnFloatingNumber(text, className) {
    const span = document.createElement('span');
    span.className = 'floating-number' + (className ? ' ' + className : '');
    span.textContent = text;
    const t = this.el.terminal;
    if (t && t.offsetWidth) { // над барабанами терминала
      span.style.left = Math.round(t.offsetLeft + t.offsetWidth * Utils.randomInt(30, 70) / 100) + 'px';
      span.style.top = Math.round(t.offsetTop + t.offsetHeight * 0.42) + 'px';
    } else { span.style.left = Utils.randomInt(30, 70) + '%'; span.style.top = '48%'; }
    this.el.floatingLayer.appendChild(span);
    setTimeout(() => span.remove(), 1200);
  },

  showJackpotEventModal(durationMs, callback) {
    const el = this.el;
    el.jackpotThird.textContent = '?';
    el.modalJackpotEvent.classList.remove('hidden');
    el.jackpotTimerFill.style.animation = 'none'; void el.jackpotTimerFill.offsetWidth;
    el.jackpotTimerFill.style.animation = `jackpotTimer ${durationMs}ms linear forwards`;
    AudioManager.play('event');
    let resolved = false;
    const timeoutId = setTimeout(() => finish(false), durationMs);
    const finish = (success) => {
      if (resolved) return;
      resolved = true; clearTimeout(timeoutId);
      if (success) el.jackpotThird.textContent = '7';
      el.modalJackpotEvent.classList.add('hidden');
      this._jackpotResolve = null;
      callback(success);
    };
    this._jackpotResolve = finish;
  },

  /* =================== Общие помощники для событий-окон =================== */
  holdBalance() { this._holdValue = GameState.data.balance; this._hold = true; },
  releaseBalance() { this._hold = false; this.refreshAll(); },
  animateNumber(el, from, to, ms, prefix) {
    const t0 = Date.now(), p = prefix || '';
    const step = () => {
      const k = Math.min(1, (Date.now() - t0) / ms);
      const v = k >= 1 ? to : from + (to - from) * (1 - Math.pow(1 - k, 3));
      el.textContent = p + Utils.formatNumber(Math.floor(v)) + ' 💰';
      if (k < 1) setTimeout(step, 40);
    };
    step();
  },
  burst(box, emojis, n) {
    for (let i = 0; i < n; i++) {
      const sp = document.createElement('span');
      sp.className = 'fx-burst';
      sp.textContent = emojis[i % emojis.length];
      const a = Math.random() * Math.PI * 2, d = Utils.randomInt(70, 190);
      sp.style.setProperty('--dx', Math.cos(a) * d + 'px');
      sp.style.setProperty('--dy', Math.sin(a) * d + 'px');
      sp.style.setProperty('--rot', Utils.randomInt(-240, 240) + 'deg');
      sp.style.left = '50%'; sp.style.top = '45%';
      sp.style.animationDelay = (i % 6) * 40 + 'ms';
      box.appendChild(sp);
      setTimeout(() => sp.remove(), 1700);
    }
  },
  addFxOverlay(cls) { const d = document.createElement('div'); d.className = cls; this.el.app.appendChild(d); return d; },
  restartAnim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); },

  /* =================== Мужик-инвестор: удвоить ВЕСЬ баланс, 50/50 =================== */
  updateInvestmentAmount() {
    const b = Math.floor(GameState.data.balance);
    this.el.investmentAmount.textContent = Utils.formatNumber(b) + ' 💰';
    this.el.investmentWin.textContent = __t('при успехе → ') + Utils.formatNumber(b * 2) + ' 💰';
  },
  showInvestmentModal() {
    const el = this.el;
    this._investBusy = false; this._hold = false;
    el.investmentBox.className = 'modal-box modal-investment';
    el.investmentCharacter.classList.remove('gone');
    ['investmentRoll', 'investmentResult', 'investmentCloseBtn'].forEach((k) => el[k].classList.add('hidden'));
    ['investmentButtons', 'investmentWarning', 'investmentQuote'].forEach((k) => el[k].classList.remove('hidden'));
    const pct = Math.round(CONFIG.investment.winChance * 100);
    el.investmentWarning.textContent = __tt`${pct}% — БАЛАНС ×${CONFIG.investment.winMultiplier} · ${100 - pct}% — БАЛАНС ОБНУЛИТСЯ`;
    this.updateInvestmentAmount();
    AssetManager.applyImage('assets/characters/chel.png', el.investorImage, el.investorPlaceholder, el.investorPlaceholderName);
    el.modalInvestment.classList.remove('hidden');
    this.restartAnim(el.investmentBox, 'enter');
    this.shakeScreen();
    AudioManager.play('event');
    this.showPhrase(randomPhrase('investment'));
  },

  resolveInvestment(invest) {
    const s = GameState.data;
    if (!s.investment.pending || this._investBusy) return;
    s.investment.pending = false;
    if (!invest) { // отказ ничего не меняет
      this.el.modalInvestment.classList.add('hidden');
      this.showEventBanner(__t('🕴️ ТИП ОБИДЕЛСЯ И УШЁЛ'));
      SaveSystem.save();
      return;
    }
    this._investBusy = true;
    const before = s.balance;
    const win = Math.random() < CONFIG.investment.winChance;
    this.holdBalance(); // экран показывает старый баланс до развязки
    if (win) {
      s.balance = Utils.safeNumber(before * CONFIG.investment.winMultiplier);
      if (s.balance > s.stats.maxBalance) s.stats.maxBalance = s.balance;
    } else {
      s.stats.totalLost = Utils.safeNumber(s.stats.totalLost) + before;
      s.stats.losses = Utils.safeNumber(s.stats.losses) + 1;
      s.balance = 0; // обнуляются ТОЛЬКО деньги
    }
    SaveSystem.save(); // результат зафиксирован сразу: перезагрузка не даёт перебросить
    this.playInvestorRoll(win, before, s.balance);
  },

  playInvestorRoll(win, before, after) {
    const el = this.el, box = el.investmentBox;
    ['investmentButtons', 'investmentWarning', 'investmentQuote'].forEach((k) => el[k].classList.add('hidden'));
    el.investmentRoll.classList.remove('hidden');
    box.classList.add('tense');
    const veil = this.addFxOverlay('fx-suspense');
    const lines = [__t('МОНЕТКА В ВОЗДУХЕ…'), __t('ТИШИНА…'), __t('ВСЁ РЕШАЕТСЯ…')];
    el.rollText.textContent = lines[0]; AudioManager.play('click');
    setTimeout(() => { el.rollText.textContent = lines[1]; AudioManager.play('click'); }, 900);
    setTimeout(() => { el.rollText.textContent = lines[2]; AudioManager.play('click'); this.shakeScreen(); }, 1800);
    [2250, 2500].forEach((t) => setTimeout(() => AudioManager.play('click'), t));
    setTimeout(() => {
      veil.remove(); box.classList.remove('tense'); el.investmentRoll.classList.add('hidden');
      this.revealInvestor(win, before, after);
    }, CONFIG.investment.suspenseMs);
  },

  revealInvestor(win, before, after) {
    const el = this.el, box = el.investmentBox;
    el.investmentResult.classList.remove('hidden');
    if (win) {
      box.classList.add('win');
      el.resultTitle.textContent = `💰 ×${CONFIG.investment.winMultiplier}! 💰`;
      el.resultSub.textContent = __t('Мужик уважительно кивает');
      this.animateNumber(el.resultNum, before, after, 1200);
      this.flashScreen('gold'); AudioManager.play('jackpot');
      this.burst(box, ['💰', '💸', '✨', '💎'], 30);
      this.spawnParticles(50, 46, 50, 'var(--gold)');
      this.showEventBanner(__t('🕴️ СХЕМА ЗАШЛА! БАЛАНС ×') + CONFIG.investment.winMultiplier);
    } else {
      box.classList.add('lose');
      el.investmentCharacter.classList.add('gone');
      el.resultTitle.textContent = __t('💀 ВСЁ ПРОПАЛО 💀');
      el.resultSub.textContent = __t('Мужик растворился вместе с деньгами');
      this.animateNumber(el.resultNum, before, 0, 1000);
      this.flashScreen('lose'); this.shakeScreen(); setTimeout(() => this.shakeScreen(), 380);
      AudioManager.play('lose');
      this.burst(box, ['💸', '💨', '🥀', '💔'], 24);
      this.showEventBanner(__t('🕴️ ТЕБЯ КИНУЛИ. БАЛАНС ОБНУЛЁН'));
    }
    el.investmentCloseBtn.classList.remove('hidden');
    clearTimeout(this._investCloseTimer);
    this._investCloseTimer = setTimeout(() => this.closeInvestment(), 9000);
  },
  closeInvestment() {
    clearTimeout(this._investCloseTimer);
    this.el.modalInvestment.classList.add('hidden');
    this._investBusy = false;
    this.releaseBalance();
  },

  /* =================== Налоговая проверка =================== */
  updateTaxAmounts() {
    const b = GameState.data.balance, tax = Math.floor(b * CONFIG.taxCheck.rate);
    this.el.taxNumbers.innerHTML = __tt`Баланс: <b>${Utils.formatNumber(Math.floor(b))} 💰</b><br>К оплате: <b class="neg">−${Utils.formatNumber(tax)} 💰</b><br>Останется: <b>${Utils.formatNumber(Math.floor(b - tax))} 💰</b>`;
    this.el.taxPayBtn.textContent = __tt`ЗАПЛАТИТЬ ${Math.round(CONFIG.taxCheck.rate * 100)}% от баланса`;
  },
  showTaxModal() {
    const el = this.el;
    this._taxBusy = false; this._hold = false;
    el.taxBox.className = 'modal-box modal-tax';
    el.taxResult.classList.add('hidden'); el.taxCloseBtn.classList.add('hidden');
    el.taxPayBtn.classList.remove('hidden'); el.taxNumbers.classList.remove('hidden');
    this.updateTaxAmounts();
    AssetManager.applyImage('assets/characters/inspector.png', el.taxImage, el.taxEmoji);
    el.modalTax.classList.remove('hidden');
    this.restartAnim(el.taxBox, 'enter');
    this.shakeScreen(); AudioManager.play('event');
    this.showEventBanner(__t('💼 НАЛОГОВАЯ ПРОВЕРКА!'));
  },
  payTax() {
    const s = GameState.data, el = this.el;
    if (!s.events.taxPending || this._taxBusy) return;
    this._taxBusy = true; s.events.taxPending = false;
    const before = s.balance, tax = Math.floor(before * CONFIG.taxCheck.rate);
    this.holdBalance();
    s.balance = Utils.safeNumber(before - tax);
    s.stats.totalLost = Utils.safeNumber(s.stats.totalLost) + tax;
    SaveSystem.save();
    el.taxPayBtn.classList.add('hidden'); el.taxNumbers.classList.add('hidden');
    el.taxBox.classList.add('paid');
    el.taxResult.classList.remove('hidden');
    el.taxResultTitle.textContent = `−${Utils.formatNumber(tax)} 💰`;
    el.taxResultSub.textContent = __t('Государство благодарит за вклад в казну');
    this.animateNumber(el.taxResultNum, before, s.balance, 1100, __t('Осталось: '));
    setTimeout(() => { this.flashScreen('lose'); this.shakeScreen(); AudioManager.play('lose'); this.burst(el.taxBox, ['💸', '📄', '🏛️', '💼'], 22); }, 450);
    el.taxCloseBtn.classList.remove('hidden');
    clearTimeout(this._taxCloseTimer);
    this._taxCloseTimer = setTimeout(() => this.closeTax(), 9000);
  },
  closeTax() {
    clearTimeout(this._taxCloseTimer);
    this.el.modalTax.classList.add('hidden');
    this._taxBusy = false;
    this.releaseBalance();
  },

  /* =================== Автомат сломался =================== */
  updateBrokenCost() {
    const cost = Math.floor(GameState.data.balance * CONFIG.brokenMachine.repairShare);
    this.el.brokenRepairBtn.textContent = __tt`🔧 ПОЗВАТЬ МАСТЕРА · −${Math.round(CONFIG.brokenMachine.repairShare * 100)}% (${Utils.formatNumber(cost)} 💰)`;
  },
  startBrokenReels(speed) {
    clearInterval(this._brokenTimer);
    const sym = ['🍒', '🍋', '🔔', '💎', '7️⃣', '⭐'];
    this._brokenTimer = setInterval(() => this.el.brokenReels.forEach((r) => { r.textContent = sym[Utils.randomInt(0, sym.length - 1)]; }), speed);
  },
  showBrokenModal() {
    const el = this.el;
    this._brokenBusy = false; this._hold = false;
    el.brokenBox.className = 'modal-box modal-broken';
    el.brokenResult.classList.add('hidden'); el.brokenCloseBtn.classList.add('hidden');
    el.brokenButtons.classList.remove('hidden'); el.brokenStatus.classList.remove('hidden');
    el.brokenGambleBtn.textContent = __tt`🎰 ВЫБИТЬ ДЖЕКПОТ · шанс ${Math.round(CONFIG.brokenMachine.jackpotChance * 100)}%`;
    el.brokenStatus.textContent = __tt`Не повезёт — автомат встанет на ${CONFIG.brokenMachine.downtimeSec} с.`;
    this.updateBrokenCost(); this.startBrokenReels(90);
    AssetManager.applyImage('assets/characters/machine.png', el.machineImage, el.machineEmoji);
    el.modalBroken.classList.remove('hidden');
    this.restartAnim(el.brokenBox, 'enter');
    this.shakeScreen(); AudioManager.play('event');
    this.showEventBanner(__t('⚡ АВТОМАТ СЛОМАЛСЯ!'));
  },
  brokenGamble() {
    const s = GameState.data, el = this.el;
    if (!s.events.brokenPending || this._brokenBusy) return;
    this._brokenBusy = true; s.events.brokenPending = false;
    const win = Math.random() < CONFIG.brokenMachine.jackpotChance;
    this.holdBalance();
    let amount = 0;
    if (win) {
      amount = Economy.computeJackpotWin();
      Economy.addBalance(amount);
      s.stats.jackpots = Utils.safeNumber(s.stats.jackpots) + 1;
      s.stats.bigWins = Utils.safeNumber(s.stats.bigWins) + 1;
    } else {
      s.temp.machineBrokenUntil = Utils.now() + CONFIG.brokenMachine.downtimeSec * 1000;
    }
    SaveSystem.save(); // итог зафиксирован сразу
    el.brokenButtons.classList.add('hidden'); el.brokenStatus.textContent = __t('БАРАБАНЫ ЗАМЕДЛЯЮТСЯ…');
    el.brokenBox.classList.add('tense'); this.startBrokenReels(45);
    AudioManager.play('click'); setTimeout(() => { this.startBrokenReels(160); AudioManager.play('click'); this.shakeScreen(); }, 1100);
    setTimeout(() => {
      clearInterval(this._brokenTimer); el.brokenBox.classList.remove('tense'); el.brokenStatus.classList.add('hidden');
      el.brokenResult.classList.remove('hidden');
      if (win) {
        el.brokenReels.forEach((r) => { r.textContent = '7️⃣'; });
        el.brokenBox.classList.add('win');
        el.brokenResultTitle.textContent = __t('🎰 ДЖЕКПОТ! 🎰');
        el.brokenResultSub.textContent = __t('Автомат выплюнул всё, что мог');
        this.animateNumber(el.brokenResultNum, 0, amount, 1100, '+');
        this.flashScreen('gold'); AudioManager.play('jackpot');
        this.burst(el.brokenBox, ['💰', '💸', '⭐', '💎'], 30); this.spawnParticles(50, 46, 50, 'var(--gold)');
        this.showEventBanner(__t('🎰 ДЖЕКПОТ ИЗ СЛОМАННОГО АВТОМАТА! +') + Utils.formatNumber(amount));
      } else {
        const bad = ['💥', '💨', '⚡']; el.brokenReels.forEach((r, i) => { r.textContent = bad[i]; });
        el.brokenBox.classList.add('lose');
        el.brokenResultTitle.textContent = __t('💥 ЗАГЛОХ');
        el.brokenResultNum.textContent = __tt`Ремонт: ${CONFIG.brokenMachine.downtimeSec} с`;
        el.brokenResultSub.textContent = __t('Крутки недоступны, пока автомат чинится');
        this.flashScreen('lose'); this.shakeScreen(); AudioManager.play('lose');
        this.burst(el.brokenBox, ['💨', '⚡', '🔧'], 16);
      }
      el.brokenCloseBtn.classList.remove('hidden');
      clearTimeout(this._brokenCloseTimer); this._brokenCloseTimer = setTimeout(() => this.closeBroken(), 9000);
    }, 2400);
  },
  brokenRepair() {
    const s = GameState.data, el = this.el;
    if (!s.events.brokenPending || this._brokenBusy) return;
    this._brokenBusy = true; s.events.brokenPending = false;
    const cost = Math.floor(s.balance * CONFIG.brokenMachine.repairShare);
    Economy.spendBalance(cost);
    SaveSystem.save();
    clearInterval(this._brokenTimer);
    el.brokenReels.forEach((r) => { r.textContent = '7️⃣'; });
    el.brokenButtons.classList.add('hidden'); el.brokenStatus.classList.add('hidden');
    el.brokenResult.classList.remove('hidden'); el.brokenBox.classList.add('fixed');
    el.brokenResultTitle.textContent = __t('🔧 ПОЧИНИЛИ');
    el.brokenResultNum.textContent = '−' + Utils.formatNumber(cost) + ' 💰';
    el.brokenResultSub.textContent = __t('Мастер сделал вид, что всё сложно');
    this.spawnFloatingNumber('−' + Utils.formatNumber(cost), 'lose'); AudioManager.play('buy');
    this.burst(el.brokenBox, ['🔧', '✨', '🛠️'], 14);
    el.brokenCloseBtn.classList.remove('hidden');
    clearTimeout(this._brokenCloseTimer); this._brokenCloseTimer = setTimeout(() => this.closeBroken(), 9000);
    this.refreshAll();
  },
  closeBroken() {
    clearTimeout(this._brokenCloseTimer); clearInterval(this._brokenTimer);
    this.el.modalBroken.classList.add('hidden');
    this._brokenBusy = false;
    this.releaseBalance();
  },
  /** Кнопка «КРУТИТЬ» блокируется, пока автомат чинится. */
  refreshSpinState() {
    const btn = this.el.spinButton, txt = btn.querySelector('.spin-button-text');
    const left = Math.ceil((GameState.data.temp.machineBrokenUntil - Utils.now()) / 1000);
    if (left > 0) { btn.classList.add('broken'); if (txt) txt.textContent = __t('🔧 ЧИНИТСЯ ') + left + __t('с'); }
    else if (btn.classList.contains('broken')) { btn.classList.remove('broken'); if (txt) txt.textContent = __t('КРУТИТЬ'); }
  },

  showOfflineModal() {
    const s = GameState.data;
    if (s.offline.pending <= 0) return;
    this.el.offlineAmount.textContent = '+' + Utils.formatNumber(s.offline.pending) + ' 💰';
    this.el.offlineTime.textContent = __tt`⏱ Засчитано: ${Utils.formatTime(s.offline.seconds)}`;
    const lim = this.el.modalOffline.querySelector('.offline-limit');
    if (lim) lim.textContent = __tt`Офлайн: ${Math.round(CONFIG.offline.efficiency * 100)}% дохода, максимум ${CONFIG.offline.maxHours} ч`;
    this.el.modalOffline.classList.remove('hidden');
  },

  claimOffline() {
    const s = GameState.data;
    const amount = s.offline.pending;
    if (amount <= 0) {
      this.el.modalOffline.classList.add('hidden');
      return;
    }
    s.offline.pending = 0;
    s.offline.seconds = 0;
    Economy.addBalance(amount);
    this.el.modalOffline.classList.add('hidden');
    UI.showEventBanner(__t('💰 БУРМАЛДА ДОЖДАЛАСЬ ТЕБЯ'));
    SaveSystem.save();
    UI.refreshAll();
  },

  showFinalStageModal() { this.el.modalFinalStage.classList.remove('hidden'); },

};

/* =====================================================================
   19. Game — точка входа и главный игровой цикл
   ===================================================================== */
const Game = {
  spinLock: false,
  reelSpinInterval: null,
  reelAnimationMs: 480, // должно совпадать с длительностью в animateReels()
  slotAssets: {
    cherry: 'assets/slot_symbols/cherry.png',
    lemon: 'assets/slot_symbols/lemon.png',
    grape: 'assets/slot_symbols/grape.png',
    diamond: 'assets/slot_symbols/diamond.png',
    star: 'assets/slot_symbols/star.png',
    bell: 'assets/slot_symbols/bell.png',
    crown: 'assets/slot_symbols/crown.png',
    money: 'assets/slot_symbols/money.png',
    seven: 'assets/slot_symbols/seven.png',
    rocket: 'assets/slot_symbols/rocket.png'
  },
  tierSymbols: {
    normal: ['cherry', 'cherry', 'lemon'], big: ['diamond', 'diamond', 'star'], crazy: ['seven', 'seven', 'seven'], super: ['rocket', 'rocket', 'rocket']
  },
  reelPool: ['cherry', 'lemon', 'grape', 'diamond', 'star', 'bell', 'crown', 'money', 'seven'],

  init() {
    // SDK начинает загружаться сразу, параллельно с экраном загрузки
    const sdkReady = YandexSDK.init();
    this.runLoadingAnimation(() => {
      const cloud = sdkReady.then((ok) => (ok ? YandexSDK.cloudLoad() : { ok: false })).catch(() => ({ ok: false }));
      // сеть не должна блокировать игру: облако ждём не дольше 2 секунд
      const timeout = new Promise((res) => setTimeout(() => res(null), 2000));
      Promise.race([cloud, timeout]).then((res) => this.boot(res), () => this.boot(null));
      // облако ответило позже — подхватываем, если оно новее
      cloud.then((late) => { if (this._booted && late && late.ok) SaveSystem.lateCloudSync(late); });
    });
  },

  /** Сборка игры после загрузки. cloudRes — ответ облака ({ok,json}) или null. Любая ошибка запуска показывается игроку, а не «вечная загрузка». */
  boot(cloudRes) {
    try {
      SaveSystem.load();
      const source = SaveSystem.applyCloudAnswer(cloudRes);   // 'cloud' | 'local' — откуда взято сохранение
      Economy.calculateOfflineProgress();
      SaveSystem.save();
      AudioManager.init();
      AudioManager.setEnabled(AudioManager.loadSetting());
      GameState.data.soundEnabled = AudioManager.enabled;

      UI.init();

      // офлайн-доход считается по метке последней активности (см. SaveSystem.save)
      UI.applyStage(); UI.refreshGoalProgress();
      // версия сборки пишется в консоль (F12); предупреждение, если HTML и JS из разных сборок (обычно — кеш браузера)
      console.info(__t('БУРМАЛДА, сборка ') + BUILD_ID);
      const metaBuild = document.querySelector('meta[name="build"]');
      if (metaBuild && metaBuild.content !== BUILD_ID) {
        console.warn(__t('Версии файлов не совпадают: html=') + metaBuild.content + ', js=' + BUILD_ID);
        UI.showEventBanner(__t('⚠️ ФАЙЛЫ РАЗНЫХ ВЕРСИЙ — ОБНОВИ СТРАНИЦУ (Ctrl+F5)'));
      }
      // ?debug=1 — консольная команда debugEvent('investment' | 'tax' | 'broken') показывает событие сразу, в обход условий
      if (typeof URLSearchParams !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1') {
        window.debugEvent = (id) => {
          const g = GameState.data;
          if (id === 'investment') { g.investment.pending = true; UI.showInvestmentModal(); }
          else if (id === 'tax') { g.events.taxPending = true; UI.showTaxModal(); }
          else if (id === 'broken') { g.events.brokenPending = true; UI.showBrokenModal(); }
          else return "debugEvent('investment' | 'tax' | 'broken')";
          return 'ok';
        };
        // debugStage(0..8) или debugStage('garage') — показать фон этапа без покупок; debugStage() — вернуть как есть
        window.debugStage = (x) => {
          const order = ['start'].concat(GAME_CONFIG.empire.buildings.map((b) => b.id));
          const id = typeof x === 'number' ? order[x] : (order.includes(x) ? x : null);
          UI._forceStage = id || null; UI._stageId = undefined; UI.applyStage();
          return id ? __t('этап: ') + id : __t('этап по умолчанию (по купленным зданиям)');
        };
        // debugSpin('normal' | 'big' | 'crit' | 'crazy' | 'super' | 'lose') — крутка с заданным исходом (меняет баланс!)
        window.debugSpin = (kind) => { Game.spinLock = false; Game.handleSpin(kind || 'normal'); return __t('крутка: ') + (kind || 'normal'); };
        console.info("debug: debugEvent('investment' | 'tax' | 'broken'), debugStage(0..8), debugSpin('normal'|'big'|'crit'|'crazy'|'super'|'lose')");
      }
      if (!GameState.data.tutorial.welcomeShown) UI.showWelcome();
      UI.refreshOnboarding();
      // восстановить неразрешённое предложение «Мужика» после перезагрузки
      { const g = GameState.data; if (g.investment.pending) UI.showInvestmentModal(); else if (g.events.taxPending) UI.showTaxModal(); else if (g.events.brokenPending) UI.showBrokenModal(); }

      RandomEvents.start();
      SaveSystem.startAutosave();
      SaveSystem.bindLifecycle(() => {
        Economy.calculateOfflineProgress();
        if (GameState.data.offline.pending > 0) UI.showOfflineModal();
        UI.refreshAll();
      });
      setInterval(() => this.tick(), CONFIG.tickIntervalMs);

      if (GameState.data.offline.pending > 0) UI.showOfflineModal();
      document.getElementById('loadingScreen').classList.add('hidden');
      YandexSDK.markReady();
      this._booted = true;
      if (source === 'cloud') UI.showEventBanner(__t('☁️ ПРОГРЕСС ЗАГРУЖЕН ИЗ ОБЛАКА'));
    } catch (e) {
      console.error(__t('Ошибка запуска игры:'), e);
      const ls = document.getElementById('loadingScreen');
      if (ls && ls.insertAdjacentHTML) ls.insertAdjacentHTML('beforeend', __t('<p style="position:relative;z-index:5;margin:14px 20px 0;color:#ffd0d6;font-size:.9rem;text-align:center">Не удалось запустить игру. Обновите страницу (Ctrl+F5). Если не помогает, очистите данные сайта.</p>'));
    }
  },

  runLoadingAnimation(onDone) {
    const fill = document.getElementById('loadingBarFill');
    let progress = 0;
    const step = () => {
      progress += Utils.randomInt(18, 34);
      fill.style.width = Math.min(100, progress) + '%';
      if (progress < 100) setTimeout(step, 90); else setTimeout(onDone, 200);
    };
    step();
  },

  /** Пассивный доход и весь игровой прогресс идут ТОЛЬКО пока страница видна
   *  на экране. Если вкладка свёрнута/скрыта — тик просто ничего не делает,
   *  и когда пользователь вернётся, доход не "накопится за это время". */
  isPageVisible() {
    if (typeof document === 'undefined' || typeof document.visibilityState === 'undefined') return true;
    return document.visibilityState === 'visible';
  },

  paused: false,
  /** Пауза игры и звука: идёт реклама или платформа попросила паузу. */
  updatePause() {
    this.paused = !!(Ads.active || YandexSDK.sdkPaused);
    AudioManager.suspended = this.paused;
  },

  tick() {
    if (this.paused || !this.isPageVisible()) return;

    const s = GameState.data;
    s.stats.playTimeSec = Utils.safeNumber(s.stats.playTimeSec) + 1;

    const income = Economy.incomePerSecond();
    if (income > 0) Economy.addBalance(income);

    const newAchievements = Achievements.checkAll();
    newAchievements.forEach((a) => UI.showAchievementToast(a));

    const newSecrets = EmpireSystem.checkSecrets();
    newSecrets.forEach((secret) => {
      UI.showEventBanner(__t('🔐 СЕКРЕТ ОТКРЫТ: ') + secret.name);
      UI.showPhrase(randomPhrase('rare'));
      AudioManager.play('levelup');
    });

    if (!s.finalStageShown && EmpireSystem.isOwned('empireCore')) {
      s.finalStageShown = true;
      UI.showFinalStageModal();
    }

    if (UI._dailyDay !== Utils.todayStr() && DailyReward.isAvailableToday() && s.offline.pending <= 0 && !UI.isAnyModalOpen()) {
      UI._dailyDay = Utils.todayStr(); UI.showDailyModal();
    }

    UI.refreshSpinState();
    if (!UI._investBusy && !UI.el.modalInvestment.classList.contains('hidden')) UI.updateInvestmentAmount();
    if (!UI._taxBusy && !UI.el.modalTax.classList.contains('hidden')) UI.updateTaxAmounts();
    if (!UI._brokenBusy && !UI.el.modalBroken.classList.contains('hidden')) UI.updateBrokenCost();
    UI.applyStage();
    UI.refreshOnboarding();
    UI.refreshGoalProgress();
    UI.refreshHeader();
    UI.refreshActiveScreen();
  },

  handleSpin(forcedKind) {
    if (Utils.now() < GameState.data.temp.machineBrokenUntil) { UI.showEventBanner(__t('🔧 АВТОМАТ ЧИНИТСЯ…')); return; }
    if (this.spinLock) return;
    this.spinLock = true;
    // защита от повторного срабатывания: снимаем блокировку ТОЛЬКО когда
    // анимация барабанов реально закончилась (было 260мс < 480мс анимации —
    // из-за этого можно было запустить вторую крутку поверх первой)
    setTimeout(() => { this.spinLock = false; }, this.reelAnimationMs + 40);

    const s = GameState.data;
    s.stats.totalClicks = Utils.safeNumber(s.stats.totalClicks) + 1;

    AudioManager.play('click');
    UI.restartAnim(UI.el.terminal, 'clicked');
    clearTimeout(UI._tFxTimer); ['t-win', 't-big', 't-jackpot', 't-lose'].forEach((c) => UI.el.terminal.classList.remove(c));
    UI.setTerminalStatus(__t('КРУТИМ…'), 'spin');
    UI.el.spinButton.classList.add('pressed'); setTimeout(() => UI.el.spinButton.classList.remove('pressed'), 140);

    // порядок как и раньше: сначала опыт/уровень, затем результат. Результат нужен заранее,
    // чтобы барабаны остановились на нужных символах; деньги начисляются в конце анимации.
    const leveledUp = Economy.addXp(Utils.randomInt(CONFIG.xpPerSpinMin, CONFIG.xpPerSpinMax));
    const result = forcedKind ? this.debugResult(forcedKind) : Economy.computeSpinResult();
    const symbols = this.reelSymbolsFor(result);
    this.animateReels(symbols, () => this.applySpinResult(result, symbols));
    if (leveledUp) setTimeout(() => UI.showLevelUpPopup(GameState.data.level), 520);

    if (s.stats.totalClicks % 15 === 0) SaveSystem.save();
    UI.refreshHeader();
  },

  /* ---------- Барабаны: вертикальная прокрутка полос с символами ---------- */
  reelState: [],
  reels() { return [UI.el.reel1, UI.el.reel2, UI.el.reel3]; },
  randomSymbol() { return this.reelPool[Utils.randomInt(0, this.reelPool.length - 1)]; },
  symbolName(sym) {
    const names = { cherry:__t('Вишня'), lemon:__t('Лимон'), grape:__t('Виноград'), diamond:__t('Алмаз'), star:__t('Звезда'), bell:__t('Колокольчик'), crown:__t('Корона'), money:__t('Деньги'), seven:__t('Семёрка'), rocket:__t('Ракета') };
    return names[sym] || sym;
  },
  cellHtml(sym) {
    const src = this.slotAssets[sym] || this.slotAssets.cherry;
    return `<div class="reel-cell"><img src="${src}" alt="${this.symbolName(sym)}" draggable="false"></div>`;
  },
  /** Статичная полоса из трёх ячеек [верх, ЦЕНТР, низ]: центральная стоит на линии выплат. */
  renderReel(i, triple) {
    const reel = this.reels()[i], strip = reel.querySelector('.reel-strip');
    strip.style.transition = 'none';
    strip.innerHTML = triple.map((sym) => this.cellHtml(sym)).join('');
    strip.style.transform = 'translateY(' + (-(0.6 / 3) * 100) + '%)';
    reel.dataset.symbol = triple[1];
    this.reelState[i] = triple.slice();
  },
  initReels() {
    this.reelState = [];
    ['cherry', 'diamond', 'seven'].forEach((mid, i) => this.renderReel(i, [this.randomSymbol(), mid, this.randomSymbol()]));
  },
  /** Три барабана останавливаются по очереди (≈326 / 403 / 480 мс) с «отскоком» в конце.
   *  Последний совпадает с reelAnimationMs — тайминг крутки и блокировка кнопки не изменились. */
  animateReels(symbols, onDone) {
    const reels = this.reels(), total = this.reelAnimationMs;
    const dur = [0.68, 0.84, 1].map((k) => Math.round(total * k));
    UI.el.terminal.classList.add('is-spinning');
    reels.forEach((reel, i) => {
      const strip = reel.querySelector('.reel-strip');
      const prev = this.reelState[i] || [this.randomSymbol(), this.randomSymbol(), this.randomSymbol()];
      const next = [this.randomSymbol(), symbols[i], this.randomSymbol()];
      const cells = next.concat(Array.from({ length: 9 + i * 4 }, () => this.randomSymbol()), prev);
      const n = cells.length;
      strip.style.transition = 'none';
      strip.innerHTML = cells.map((sym) => this.cellHtml(sym)).join('');
      strip.style.transform = 'translateY(' + (-((n - 2 - 0.4) / n) * 100) + '%)';   // видна прежняя комбинация
      void strip.offsetHeight;
      // перелёт-«отскок» в конце — постоянный (~0,4 ячейки), а не доля пути: иначе длинный барабан проскакивал бы целый символ
      const over = (1 + 0.4 / (n - 3)).toFixed(3);
      strip.style.transition = 'transform ' + dur[i] + 'ms cubic-bezier(.2,.7,.25,' + over + ')';
      strip.style.transform = 'translateY(' + (-((1 - 0.4) / n) * 100) + '%)';        // новая — на линии выплат
      reel.classList.remove('hit', 'dim'); reel.classList.add('spinning');
      setTimeout(() => {
        reel.classList.remove('spinning');
        this.renderReel(i, next);                                                    // та же картинка, но без лишних ячеек
        reel.classList.add('landed'); setTimeout(() => reel.classList.remove('landed'), 240);
      }, dur[i]);
    });
    setTimeout(() => { UI.el.terminal.classList.remove('is-spinning'); onDone(); }, total);
  },

  /** Только для ?debug=1: готовый результат нужного вида (normal|big|crit|crazy|super|lose). */
  debugResult(kind) {
    const unit = Economy.clickUnitBase();
    const id = (kind === 'crit') ? 'normal' : (kind === 'super' ? 'big' : kind);
    const o = CONFIG.spinOutcomes.find((x) => x.id === id) || CONFIG.spinOutcomes.find((x) => x.id === 'normal');
    const mult = { crazy: 30, big: 3.25, lose: 1, normal: 0.8 }[o.id] || 1;
    return { amount: Math.max(1, Math.floor(unit * mult)), outcome: kind === 'super' ? 'super' : o.id, className: o.className, isCrit: kind === 'crit',
      isJackpot: o.id === 'crazy', isSuper: kind === 'super', isLose: o.id === 'lose' };
  },
  reelSymbolsFor(result) {
    if (result.isLose) {
      // три РАЗНЫХ символа: проигрыш не похож ни на пару, ни на выигрышные комбинации
      return this.reelPool.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    }
    return this.tierSymbols[result.outcome] || this.tierSymbols.normal;
  },

  applySpinResult(result, shown) {
    const symbols = shown || this.reelSymbolsFor(result);
    const reels = this.reels();
    reels.forEach((r, i) => {
      // барабаны уже остановились на нужных символах; если результат применён без анимации — выставим их
      if (!this.reelState[i] || this.reelState[i][1] !== symbols[i]) this.renderReel(i, [this.randomSymbol(), symbols[i], this.randomSymbol()]);
      r.classList.remove('hit', 'dim'); void r.offsetWidth; r.classList.add(result.isLose ? 'dim' : 'hit');
    });

    const s = GameState.data;
    if (result.isCrit) s.stats.criticalHits = Utils.safeNumber(s.stats.criticalHits) + 1;
    if (result.isJackpot) s.stats.jackpots = Utils.safeNumber(s.stats.jackpots) + 1;
    if (result.outcome === 'big') s.stats.bigWins = Utils.safeNumber(s.stats.bigWins) + 1;
    if (result.isLose) s.stats.losses = Utils.safeNumber(s.stats.losses) + 1;

    let displayClass = result.className;
    let displayText = '+' + Utils.formatNumber(result.amount);

    if (result.isLose) {
      const taken = Economy.subtractBalance(result.amount);
      s.stats.totalLost = Utils.safeNumber(s.stats.totalLost) + taken;
      displayText = '−' + Utils.formatNumber(taken);
      displayClass = 'lose';
      AudioManager.play('lose');
      if (Utils.chance(35)) UI.showPhrase(randomPhrase('lose'));
    } else if (result.isJackpot) {
      displayText = __t('БЕЗУМНЫЙ ДЖЕКПОТ! +') + Utils.formatNumber(result.amount);
      displayClass = 'jackpot';
      AudioManager.play('jackpot');
      UI.flashScreen(); UI.shakeScreen();
      UI.spawnParticles(...UI.terminalPoint(), 20, 'var(--gold)');
      UI.showPhrase(randomPhrase('jackpot'));
    } else if (result.isCrit) {
      displayText = __t('КРИТ! ') + displayText;
      AudioManager.play('critical');
      UI.spawnParticles(...UI.terminalPoint(), 8, 'var(--pink)');
      UI.showPhrase(randomPhrase('rare'));
    } else if (result.isSuper) {
      displayText = __t('СУПЕРКЛИК! ') + displayText;
      AudioManager.play('critical');
      UI.spawnParticles(...UI.terminalPoint(), 12, 'var(--cyan)');
      UI.showPhrase(randomPhrase('rare'));
    } else if (result.outcome === 'big') {
      AudioManager.play('critical');
      UI.spawnParticles(...UI.terminalPoint(), 6, 'var(--pink)');
      UI.showPhrase(randomPhrase('rare'));
    } else if (Utils.chance(18)) {
      UI.showPhrase(randomPhrase('click'));
    }

    UI.terminalFx(result, displayText);
    UI.spawnFloatingNumber(displayText, displayClass);

    if (!result.isLose) {
      if (result.isJackpot || result.isSuper || result.amount >= Math.max(CONFIG.bigWinThreshold, Economy.incomePerSecond() * 60)) UI.grantBigWin(result.amount, result.isJackpot);
      else Economy.addBalance(result.amount);
    }

    UI.refreshHeader();
  }
};

/* =====================================================================
   20. ЗАПУСК
   ===================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Game.init());
} else {
  Game.init();
}
