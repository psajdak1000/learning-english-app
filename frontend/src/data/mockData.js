import {
  BookOpen,
  Layers,
  Trophy,
  MessageSquare,
  BarChart2,
  Zap,
} from 'lucide-react';

export const navLinks = [
  { label: 'Quizy', path: '/quizzes' },
  { label: 'Fiszki', path: '/flashcards' },
  { label: 'Turnieje', path: '/tournaments' },
  { label: 'AI Chat', path: '/ai-chat' },
  { label: 'Postępy', path: '/progress' },
];

export const features = [
  {
    id: 'quizzes',
    icon: BookOpen,
    title: 'Adaptacyjne quizy',
    description:
      'Sprawdź swoją wiedzę ze słownictwa, gramatyki i rozumienia tekstu. Cztery poziomy trudności, które dostosowują się do Twoich postępów w czasie rzeczywistym.',
    tag: 'Najpopularniejsze',
    path: '/quizzes',
  },
  {
    id: 'flashcards',
    icon: Layers,
    title: 'Inteligentne fiszki',
    description:
      'Twórz własne zestawy kart lub korzystaj z gotowych. Nasz algorytm powtórek rozłożonych w czasie pokazuje Ci odpowiednią kartę dokładnie wtedy, gdy jej potrzebujesz.',
    tag: null,
    path: '/flashcards',
  },
  {
    id: 'tournaments',
    icon: Trophy,
    title: 'Turnieje na żywo',
    description:
      'Rywalizuj z uczącymi się z całego świata w bitwach słownikowych na czas. Wspinaj się w cotygodniowym rankingu i zdobywaj odznaki osiągnięć.',
    tag: 'Nowość',
    path: '/tournaments',
  },
  {
    id: 'ai-chat',
    icon: MessageSquare,
    title: 'Korepetytor AI',
    description:
      'Ćwicz prawdziwe rozmowy z AI, które poprawia Twoją gramatykę, wyjaśnia idiomy w kontekście i dostosowuje się do Twojego poziomu.',
    tag: null,
    path: '/ai-chat',
  },
  {
    id: 'progress',
    icon: BarChart2,
    title: 'Śledzenie postępów',
    description:
      'Wizualizuj swoją krzywą nauki dzięki szczegółowym statystykom — nauczone słowa, trafność odpowiedzi, dzienna seria i tygodniowa aktywność.',
    tag: null,
    path: '/progress',
  },
  {
    id: 'daily-challenge',
    icon: Zap,
    title: 'Wyzwanie dnia',
    description:
      'Nowe pięciominutowe wyzwanie każdego dnia podtrzymuje Twoją serię. Jeden opuszczony dzień i seria spada do zera — prosty mechanizm, który naprawdę działa.',
    tag: 'Codziennie',
    path: '/daily',
  },
];

export const stats = [
  { id: 'users', value: 24000, suffix: '+', label: 'Aktywnych użytkowników' },
  { id: 'quizzes', value: 850000, suffix: '+', label: 'Ukończonych quizów' },
  { id: 'words', value: 120000, suffix: '+', label: 'Słów w bazie danych' },
  { id: 'streak', value: 365, suffix: ' dni', label: 'Najdłuższa seria' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Marta Kowalska',
    role: 'Programistka',
    avatar: null,
    initials: 'MK',
    quote:
      'Próbowałam już chyba każdej aplikacji do angielskiego. Fluent to pierwsza, do której wracam codziennie z własnej woli. Turnieje sprawiają, że nauka wygląda jak gra, nie jak praca domowa.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Tomasz Wiśniewski',
    role: 'Marketing Manager',
    avatar: null,
    initials: 'TW',
    quote:
      'Funkcja AI Chat jest niesamowita. Poprawia moje błędy w taki sposób, że nie czuję się głupio, i zawsze tłumaczy dlaczego. W ciągu miesiąca mój angielski biznesowy wyraźnie się poprawił.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Alicja Nowak',
    role: 'Studentka medycyny',
    avatar: null,
    initials: 'AN',
    quote:
      'System powtórek w fiszkach to przełom. Zapamiętuję słownictwo medyczne, które wcześniej wyparowywało z głowy po tygodniu. Polecam z całego serca.',
    rating: 5,
  },
];

export const steps = [
  {
    id: 1,
    title: 'Załóż darmowe konto',
    description:
      'Rejestracja zajmuje mniej niż 30 sekund. Żadnej karty kredytowej. Wybierz swój aktualny poziom i ustal dzienny cel nauki.',
  },
  {
    id: 2,
    title: 'Wybierz swoją ścieżkę',
    description:
      'Zacznij od quizu, który oceni Twoje słownictwo, stwórz zestawy fiszek z tematów, które Cię interesują, albo od razu zacznij rozmawiać z korepetytorem AI.',
  },
  {
    id: 3,
    title: 'Ćwicz każdego dnia',
    description:
      'Wykonaj wyzwanie dnia, żeby utrzymać serię. Pięć minut dziennie w skali tygodni i miesięcy zamienia się w prawdziwą płynność.',
  },
  {
    id: 4,
    title: 'Śledź postępy i rywalizuj',
    description:
      'Obserwuj jak rosną Twoje statystyki. Dołącz do cotygodniowych turniejów, porównuj wyniki ze znajomymi i zdobywaj kolejne kamienie milowe.',
  },
];

export const flashcardDecks = [
  {
    id: 'basics',
    title: 'Codzienne słownictwo',
    description: 'Najważniejsze słowa potrzebne w codziennych rozmowach i tekstach.',
    cardCount: 8,
    category: 'Podstawy',
    color: 'indigo',
    studied: 5,
  },
  {
    id: 'business',
    title: 'Angielski biznesowy',
    description: 'Wyrażenia i słownictwo z korporacyjnego środowiska pracy.',
    cardCount: 6,
    category: 'Biznes',
    color: 'teal',
    studied: 2,
  },
  {
    id: 'travel',
    title: 'Podróże i turystyka',
    description: 'Frazy przydatne na lotnisku, w hotelu i podczas zwiedzania.',
    cardCount: 6,
    category: 'Podróże',
    color: 'amber',
    studied: 6,
  },
  {
    id: 'technology',
    title: 'Technologia i IT',
    description: 'Terminologia techniczna i żargon branżowy dla programistów.',
    cardCount: 6,
    category: 'IT',
    color: 'purple',
    studied: 0,
  },
];

export const flashcardsByDeck = {
  basics: [
    { id: 1, front: 'accomplish', back: 'osiągać, dokonywać', example: 'She managed to accomplish all her goals this year.' },
    { id: 2, front: 'acknowledge', back: 'uznawać, przyznawać', example: 'He acknowledged his mistake and apologized immediately.' },
    { id: 3, front: 'acquire', back: 'nabywać, zdobywać', example: 'It takes time and practice to acquire a new skill.' },
    { id: 4, front: 'adequate', back: 'odpowiedni, wystarczający', example: 'Make sure you get adequate sleep every night.' },
    { id: 5, front: 'anticipate', back: 'przewidywać, spodziewać się', example: 'We anticipate strong demand for the new product.' },
    { id: 6, front: 'appreciate', back: 'doceniać, być wdzięcznym', example: 'I really appreciate your help with this project.' },
    { id: 7, front: 'approach', back: 'podejście; zbliżać się', example: 'We need a different approach to solve this problem.' },
    { id: 8, front: 'assume', back: 'zakładać, przyjmować', example: "Don't assume you know the answer without checking." },
  ],
  business: [
    { id: 1, front: 'agenda', back: 'porządek obrad, plan spotkania', example: "Let's go through today's meeting agenda first." },
    { id: 2, front: 'benchmark', back: 'punkt odniesienia, wzorzec', example: 'Our sales figures set the industry benchmark.' },
    { id: 3, front: 'bottom line', back: 'wynik finansowy; sedno sprawy', example: 'The bottom line is that we need to cut costs now.' },
    { id: 4, front: 'deadline', back: 'termin ostateczny', example: 'The report deadline is end of business on Friday.' },
    { id: 5, front: 'deliverable', back: 'rezultat do oddania, produkt pracy', example: 'List all project deliverables in the contract.' },
    { id: 6, front: 'leverage', back: 'dźwignia; wykorzystywać', example: 'We should leverage our existing customer base.' },
  ],
  travel: [
    { id: 1, front: 'boarding pass', back: 'karta pokładowa', example: 'Please have your boarding pass ready at the gate.' },
    { id: 2, front: 'customs', back: 'odprawa celna', example: 'You must declare all goods at customs on arrival.' },
    { id: 3, front: 'itinerary', back: 'plan podróży, trasa', example: "I'll email you the full itinerary for the trip." },
    { id: 4, front: 'layover', back: 'przesiadka, postój', example: 'We have a two-hour layover in Frankfurt.' },
    { id: 5, front: 'round trip', back: 'podróż w obie strony', example: 'A round trip ticket is usually cheaper than two one-ways.' },
    { id: 6, front: 'check in', back: 'zameldować się; odprawić bagaż', example: 'Online check-in opens 24 hours before departure.' },
  ],
  technology: [
    { id: 1, front: 'algorithm', back: 'algorytm', example: 'The search algorithm ranks results by relevance.' },
    { id: 2, front: 'bandwidth', back: 'przepustowość łącza', example: 'Video streaming requires a lot of bandwidth.' },
    { id: 3, front: 'debug', back: 'debugować, szukać błędów', example: 'I spent two hours trying to debug that function.' },
    { id: 4, front: 'deploy', back: 'wdrożyć, uruchomić produkcyjnie', example: 'We deploy new features every two weeks.' },
    { id: 5, front: 'framework', back: 'szkielet aplikacji, framework', example: 'React is a popular JavaScript UI framework.' },
    { id: 6, front: 'repository', back: 'repozytorium kodu', example: 'Clone the repository before making any changes.' },
  ],
};

export const footerLinks = {
  product: [
    { label: 'Quizy', path: '/quizzes' },
    { label: 'Fiszki', path: '/flashcards' },
    { label: 'Turnieje', path: '/tournaments' },
    { label: 'AI Chat', path: '/ai-chat' },
    { label: 'Wyzwanie dnia', path: '/daily' },
  ],
  company: [
    { label: 'O nas', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Kariera', path: '/careers' },
    { label: 'Dla prasy', path: '/press' },
  ],
  legal: [
    { label: 'Polityka prywatności', path: '/privacy' },
    { label: 'Regulamin', path: '/terms' },
    { label: 'Ustawienia cookies', path: '/cookies' },
  ],
};
