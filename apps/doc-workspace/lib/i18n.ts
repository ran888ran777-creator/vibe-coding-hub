export type Locale = "en" | "ru";

export function normalizeLocale(value?: string | null): Locale {
  return value === "ru" ? "ru" : "en";
}

export const messages = {
  en: {
    appName: "Doc Workspace",
    appTagline: "Parse, inspect, summarize, and export documents.",
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      newDocument: "New document",
      settings: "Settings",
      signIn: "Sign in",
      register: "Register"
    },
    auth: {
      welcomeBack: "Welcome back",
      createAccount: "Create account",
      signIn: "Sign in",
      register: "Register",
      useCredentials: "Use your workspace credentials to continue.",
      createLocalAccount: "Create a local account for this Doc Workspace instance.",
      name: "Name",
      email: "Email",
      password: "Password",
      namePlaceholder: "Founding operator",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Minimum 8 characters",
      working: "Working...",
      needAccount: "Need an account?",
      haveAccount: "Already have an account?"
    },
    dashboard: {
      title: "Dashboard",
      yourDocuments: "Your documents",
      empty: "No documents yet. Start with a public PDF URL or upload a file into storage-backed parsing.",
      untitled: "Untitled source"
    },
    newDocument: {
      eyebrow: "New document",
      title: "Create a parsing workspace",
      body: "Start narrow: upload a file to storage or paste a URL to a supported document. Firecrawl parses it, then the workspace layers summary, facts, and export on top."
    },
    document: {
      workspace: "Document workspace",
      cleaned: "Cleaned text",
      raw: "Raw parse",
      noParse: "No parsed markdown yet. Run parse first.",
      cleanedNote: "OCR normalization is applied automatically after parse.",
      overview: "Overview",
      noSummary: "No summary yet.",
      metadata: "Metadata",
      tables: "Tables",
      noTables: "No extracted tables available.",
      jobs: "Recent jobs",
      noJobs: "No jobs queued yet.",
      parseMode: "PDF mode"
    },
    actions: {
      pasteUrl: "Paste URL",
      uploadFile: "Upload file",
      title: "Document title",
      titlePlaceholder: "Procurement brief / Board pack / Policy update",
      url: "Public or signed URL",
      urlPlaceholder: "https://example.com/report.pdf",
      file: "File",
      pdfMode: "PDF parse mode",
      pdfModeHint: "Used for PDFs only. OCR is better for scanned documents.",
      auto: "Auto",
      ocr: "OCR",
      fast: "Fast",
      createWorkspace: "Create document workspace",
      creatingWorkspace: "Creating workspace...",
      runParse: "Run parse",
      generateSummary: "Generate summary",
      exportMd: "Export .md",
      exportJson: "Export .json",
      queueing: "Queueing...",
      askDocument: "Ask the document",
      askPlaceholder: "What are the deadlines, obligations, owners, or key decisions?",
      ask: "Ask",
      thinking: "Thinking...",
      waitUntilReady: "Wait until parsing and summary complete before asking questions."
    },
    settings: {
      environment: "Environment",
      configuredProviders: "Configured providers",
      database: "Database",
      firecrawl: "Firecrawl",
      openai: "OpenAI",
      storage: "Storage",
      connected: "Connected",
      configured: "Configured",
      missingDatabase: "Missing DATABASE_URL",
      missingFirecrawl: "Missing FIRECRAWL_API_KEY",
      missingOpenai: "Missing OPENAI_API_KEY",
      missingStorage: "Missing R2_* env vars",
      account: "Account",
      signedInAs: "Signed in as",
      accountBody: "Local auth is now cookie-backed with password hashing. For production, replace it only if you need SSO, password reset, or organization-level controls.",
      nextStep: "Next step",
      jobsTitle: "Background processing is DB-backed",
      jobsBody: "Parse and summary now enqueue jobs and return immediately. The current runner is in-process for local MVP usage; replace it with Inngest or Trigger.dev if you need multi-instance reliability and retries."
    },
    status: {
      UPLOADED: "Queued",
      PARSING: "Parsing",
      PARSED: "Parsed",
      SUMMARIZING: "Summarizing",
      READY: "Ready",
      FAILED: "Failed"
    },
    jobs: {
      PARSE: "Parse",
      SUMMARY: "Summary",
      PENDING: "Pending",
      RUNNING: "Running",
      SUCCEEDED: "Succeeded",
      FAILED: "Failed"
    },
    logout: {
      signOut: "Sign out",
      signingOut: "Signing out..."
    }
  },
  ru: {
    appName: "Doc Workspace",
    appTagline: "Парсинг, просмотр, саммари и экспорт документов.",
    nav: {
      home: "Главная",
      dashboard: "Документы",
      newDocument: "Новый документ",
      settings: "Настройки",
      signIn: "Войти",
      register: "Регистрация"
    },
    auth: {
      welcomeBack: "С возвращением",
      createAccount: "Создать аккаунт",
      signIn: "Войти",
      register: "Регистрация",
      useCredentials: "Войдите с помощью учётных данных вашего workspace.",
      createLocalAccount: "Создайте локальный аккаунт для этого экземпляра Doc Workspace.",
      name: "Имя",
      email: "Email",
      password: "Пароль",
      namePlaceholder: "Оператор",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Минимум 8 символов",
      working: "Обработка...",
      needAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?"
    },
    dashboard: {
      title: "Панель",
      yourDocuments: "Ваши документы",
      empty: "Документов пока нет. Начните с публичного PDF URL или загрузите файл в storage-backed parsing.",
      untitled: "Источник без названия"
    },
    newDocument: {
      eyebrow: "Новый документ",
      title: "Создать workspace для парсинга",
      body: "Начните узко: загрузите файл в storage или вставьте URL поддерживаемого документа. Firecrawl разберёт его, после чего workspace добавит саммари, факты и экспорт."
    },
    document: {
      workspace: "Рабочая область документа",
      cleaned: "Очищенный текст",
      raw: "Сырой parse",
      noParse: "Парсинг ещё не выполнен. Сначала запустите parse.",
      cleanedNote: "OCR-нормализация применяется автоматически после parse.",
      overview: "Обзор",
      noSummary: "Саммари пока нет.",
      metadata: "Метаданные",
      tables: "Таблицы",
      noTables: "Извлечённых таблиц пока нет.",
      jobs: "Последние jobs",
      noJobs: "Очередь пока пуста.",
      parseMode: "Режим PDF"
    },
    actions: {
      pasteUrl: "Вставить URL",
      uploadFile: "Загрузить файл",
      title: "Название документа",
      titlePlaceholder: "Тендер / Board pack / Policy update",
      url: "Публичный или signed URL",
      urlPlaceholder: "https://example.com/report.pdf",
      file: "Файл",
      pdfMode: "Режим парсинга PDF",
      pdfModeHint: "Используется только для PDF. OCR лучше подходит для сканов.",
      auto: "Авто",
      ocr: "OCR",
      fast: "Быстрый",
      createWorkspace: "Создать workspace документа",
      creatingWorkspace: "Создание workspace...",
      runParse: "Запустить parse",
      generateSummary: "Сгенерировать саммари",
      exportMd: "Экспорт .md",
      exportJson: "Экспорт .json",
      queueing: "Постановка в очередь...",
      askDocument: "Спросить документ",
      askPlaceholder: "Какие здесь дедлайны, обязательства, владельцы или ключевые решения?",
      ask: "Спросить",
      thinking: "Думаю...",
      waitUntilReady: "Дождитесь завершения parse и summary, прежде чем задавать вопросы."
    },
    settings: {
      environment: "Окружение",
      configuredProviders: "Подключённые провайдеры",
      database: "База данных",
      firecrawl: "Firecrawl",
      openai: "OpenAI",
      storage: "Storage",
      connected: "Подключено",
      configured: "Настроено",
      missingDatabase: "Нет DATABASE_URL",
      missingFirecrawl: "Нет FIRECRAWL_API_KEY",
      missingOpenai: "Нет OPENAI_API_KEY",
      missingStorage: "Нет R2_* переменных",
      account: "Аккаунт",
      signedInAs: "Вы вошли как",
      accountBody: "Локальная аутентификация теперь работает через хеширование пароля и signed cookie. Для продакшена заменяйте её только если нужны SSO, сброс пароля или организация команд.",
      nextStep: "Следующий шаг",
      jobsTitle: "Фоновая обработка хранится в БД",
      jobsBody: "Parse и summary теперь ставятся в очередь и сразу возвращают ответ. Текущий runner работает in-process для локального MVP; замените его на Inngest или Trigger.dev, если нужна надёжность между несколькими инстансами и ретраи."
    },
    status: {
      UPLOADED: "В очереди",
      PARSING: "Парсинг",
      PARSED: "Разобран",
      SUMMARIZING: "Саммари",
      READY: "Готово",
      FAILED: "Ошибка"
    },
    jobs: {
      PARSE: "Parse",
      SUMMARY: "Summary",
      PENDING: "Ожидает",
      RUNNING: "В работе",
      SUCCEEDED: "Успешно",
      FAILED: "Ошибка"
    },
    logout: {
      signOut: "Выйти",
      signingOut: "Выход..."
    }
  }
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}
