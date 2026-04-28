// Content data drawn from /reference-material/. Edit here, not in the
// component, to keep DreamYogaApp.jsx focused on layout.

export const historyUnits = [
  {
    num: 'I',
    title: 'Ancient Origins',
    date: 'c. 1500 BCE — c. 200 CE',
    blurb:
      'Two parallel inheritances form here: the Indian phenomenology of the four states of consciousness, drawn from the Vedas, the Upaniṣads, and the early Yogācāra analyses of mind; and the Greco-Roman naturalistic and interpretive traditions, from the Hippocratic physicians to Artemidorus. Each tradition asks a different question of the dream, and the answers shape everything that follows.',
    figures: ['Yājñavalkya', 'Vasubandhu', 'Aristotle', 'Artemidorus'],
  },
  {
    num: 'II',
    title: 'Tibetan Dream Yoga',
    date: 'c. 8th — 21st c.',
    blurb:
      'Dream practice becomes a developed contemplative discipline. From the Indian yoginī tantras through Padmasambhava and the Six Yogas of Nāropa, the four Tibetan Buddhist schools and the parallel Bön Mother Tantra lineage, dream and sleep yoga are transmitted through monastic institutions and finally carried west by twentieth-century teachers.',
    figures: ['Padmasambhava', 'Nāropa', 'Milarepa', 'Tsongkhapa', 'Tenzin Wangyal'],
  },
  {
    num: 'III',
    title: 'Other Asian Traditions',
    date: 'c. 4th c. BCE — present',
    blurb:
      "Two further streams develop in parallel: the Daoist tradition of transformation and inner alchemy, from Zhuangzi's butterfly to the Quanzhen sleep cultivations; and the Sufi-Islamic tradition's metaphysics of imagination, centered on Ibn al-ʿArabī's khayāl and the imaginal world (ʿālam al-mithāl). Two parallel contemplative answers to the same question the Indian and Greek traditions also asked.",
    figures: ['Zhuangzi', 'Chen Tuan', 'Ibn al-ʿArabī', 'William Chittick'],
  },
  {
    num: 'IV',
    title: 'Western Rediscovery',
    date: '1860 — 1970',
    blurb:
      "Europe arrives at deliberate dream cultivation through individual experimenters rather than lineages. Saint-Denys's 1867 journal of nearly two thousand dreams, van Eeden's coining of 'lucid dream' in 1913, and Arnold-Forster's 1921 instructional manual establish the empirical line. Alongside it, the depth-psychological treatment of the dream takes shape in Jung and is critiqued from within in Hillman's archetypal pushback.",
    figures: ['Hervey de Saint-Denys', 'Frederik van Eeden', 'Mary Arnold-Forster', 'C. G. Jung', 'James Hillman'],
  },
  {
    num: 'V',
    title: 'The Modern Scientific Era',
    date: '1953 — present',
    blurb:
      "After Aserinsky and Kleitman's 1953 discovery of REM sleep, Hearne in 1975 and LaBerge at Stanford in 1980 demonstrated that a lucid dreamer can communicate from inside REM through pre-arranged eye signals. The induction techniques (MILD, WILD, WBTB), the 2018 galantamine trial, the neuroscience of the 2010s, and the clinical work on nightmare disorder follow.",
    figures: ['Stephen LaBerge', 'Paul Tholey', 'Ursula Voss', 'Martin Dresler'],
  },
  {
    num: 'VI',
    title: 'Convergence',
    date: '1987 — present',
    blurb:
      "Through the Mind and Life Institute and bridge figures including Varela, Wallace, Thompson, and Holecek, the contemplative and scientific traditions begin to inform each other. The science vindicates the trainability of dream awareness; the contemplative tradition, in turn, refines the framing — lucid dreaming as foundation rather than goal, situated within ethical and soteriological practice.",
    figures: ['Francisco Varela', 'the 14th Dalai Lama', 'B. Alan Wallace', 'Andrew Holecek', 'Evan Thompson'],
  },
];

// Curriculum: six modules, forty-seven lessons. Self-paced; no schedule.
// Each module mirrors a history unit. Each lesson is a 600–1,500-word read
// drawn from /reference-material/11_online/. The lesson bodies themselves
// are loaded by src/lessons.js; this object holds module-level metadata.
export const curriculumModules = [
  {
    num: '01',
    roman: 'I',
    title: 'Ancient Origins',
    lessonCount: 8,
    blurb:
      'Vedic, Upaniṣadic, Indian Buddhist, Greco-Roman. Four bodies of source material, none of them yet dream yoga, each containing something the later tradition could not have done without.',
    overview:
      "The earliest contemplative engagements with the dream do not ask what the dream means but what the dream reveals about the structure of consciousness itself. The Vedic seers had already noted that the same person who walks abroad by day wanders elsewhere by night; the Bṛhadāraṇyaka's Yājñavalkya, in dialogue with King Janaka, made the more radical claim that the dreamer fashions the dream from impressions of the waking day. By the time of the Māṇḍūkya Upaniṣad, twelve compressed verses laid out a four-state schema — waking, dreaming, deep sleep, and the witnessing turīya — that would become the philosophical bedrock for almost every later Asian tradition of dream practice. The Buddhist tradition that emerged from the same intellectual environment developed its own analysis: the Milindapañha's Nāgasena distinguishes four causes of dream-experience without granting them epistemic authority; the Mahāyāna's Śāntideva, in the Bodhicaryāvatāra, deploys dream as the working figure for the philosophical claim that all phenomena are appearance-only. Across the Mediterranean, Plato treats dream as the soul revealing itself in undefended form, Aristotle gives it a careful naturalistic account in the Parva Naturalia, and Cicero produces the most rigorous classical critique of dream-prophecy that survives. Four parallel inheritances; together, the ground the rest of the course is built on.",
    primary_sources: [
      "Olivelle's Early Upaniṣads",
      "Padmakara's Way of the Bodhisattva",
      "Mendis's Questions of King Milinda",
      "Beare's translation of Aristotle's Parva Naturalia",
      "Doniger's Dreams, Illusion, and Other Realities",
    ],
  },
  {
    num: '02',
    roman: 'II',
    title: 'Tibetan Dream Yoga',
    lessonCount: 10,
    blurb:
      'A practice tradition with a thousand-year continuous transmission, sitting at the intersection of tantric yoga, the bardo teachings, Mahāmudrā, and Dzogchen. The discipline whose stated point is the recognition of the illusory nature of all experience and the stabilization of awareness through the transitions between states.',
    overview:
      "Dream yoga reaches Tibet in the eighth century with the Indian tantric master Padmasambhava and arrives within a framework that subordinates the dream-state to a much larger map of consciousness — the six bardos, the intermediate states through which awareness passes between waking, sleeping, meditative absorption, and the moment of death. The Six Yogas of Naropa, synthesized in the eleventh century from Tilopa's teachings and transmitted through Marpa, Milarepa, and Tsongkhapa, place dream yoga (milam) at the center of an integrated arc of six dharmas: inner heat, illusory body, dream, clear light, bardo, and transference. The classical four-stage practice — comprehension, transformation, illusion, suchness — recurs across Geluk, Kagyu, Nyingma, and Bön sources. The Dzogchen alternative transmitted in the Nyingma school and in Bön reframes the practice as the recognition of natural light: not lucidity to be produced but the awareness that has always been present, awaiting the practitioner's stopping-of-obscuring. The Bön Mother Tantra lineage — institutionally distinct, in conversation with Buddhism for over a millennium — supplies a parallel and now dominant Western entry point through Tenzin Wangyal Rinpoche. The lineage is real, the transmission continuous, and what the West has begun receiving in the last forty years is not the practice's contemporary peripheral but its technical core.",
    primary_sources: [
      "Mullin's Six Yogas of Naropa",
      "Namkhai Norbu's Dream Yoga and the Practice of Natural Light",
      "Tenzin Wangyal's Tibetan Yogas of Dream and Sleep",
      "Fremantle and Trungpa's Tibetan Book of the Dead",
      "Thrangu's Journey of the Mind",
    ],
  },
  {
    num: '03',
    roman: 'III',
    title: 'Other Asian Traditions',
    lessonCount: 6,
    blurb:
      "The Daoist Chinese tradition's treatment of dream as a wedge against fixed identity, and the Sufi-Islamic tradition's metaphysics of imagination — two parallel contemplative answers to the same question the Indian and Greek traditions also asked.",
    overview:
      "Two further contemplative traditions outside the Indian–Tibetan synthesis took dream seriously enough to build whole metaphysics around it. The Daoist Chinese tradition, beginning with Zhuangzi's butterfly passage in the fourth century BCE, locates the interesting question in the transformation between states rather than in the truth-status of either; the inner-alchemy lineages that crystallize in the Tang and Song dynasties develop a precise framework for the cultivation of the three treasures — jing, qi, shen — across the cycle of waking and sleep. The Sufi-Islamic tradition centered on Ibn al-ʿArabī produces what is, on the textual record, the most philosophically developed pre-modern treatment of dream in any tradition: an ontology of imagination — khayāl — in which the dream is not a deficient mode of waking but a window onto a real intermediate domain (barzakh, ʿālam al-mithāl) that mediates between the spiritual and the material. Both traditions arrived at compatible-but-not-identical accounts of the night, by different routes, with different vocabularies. Neither directly fed into the Tibetan synthesis. Both belong on the practitioner's map for what they leave on the table that the Indian–Tibetan axis does not.",
    primary_sources: [
      "Ziporyn's Zhuangzi: The Complete Writings",
      "Wong's Cultivating Stillness",
      "Chittick's Sufi Path of Knowledge",
    ],
  },
  {
    num: '04',
    roman: 'IV',
    title: 'Western Rediscovery (1860–1970)',
    lessonCount: 7,
    blurb:
      'A century of European dream science worth taking seriously on its own terms. The empirical-introspective tradition that began with Saint-Denys in 1867, was named "lucid dreaming" by van Eeden in 1913, and was given its first instructional treatment by Arnold-Forster in 1921 — and, alongside it, the depth-psychological treatment of the dream in Jung and the archetypal pushback in Hillman.',
    overview:
      "Europe arrives at deliberate dream cultivation through individual experimenters rather than lineages. Hervey de Saint-Denys, a young marquis, spent more than twenty years from 1856 onward keeping a journal of nearly two thousand dreams and developing by patient self-observation a faculty he called 'having awareness, while asleep, of my true situation' — the foundation stone of the modern empirical study of dreaming. Frederik van Eeden's 1913 paper to the Society for Psychical Research coined the term 'lucid dream' in its present meaning. Mary Arnold-Forster's 1921 Studies in Dreams produced the tradition's first practical instructional manual, including the kernel of what LaBerge would, sixty years later, codify as MILD. The contemporary historian Jacqueline Carroy's reframing places this empirical-introspective tradition back at the center of the nineteenth-century dream-science story, displacing the assumption that Freud invented the field. Alongside the empirical line, the depth-psychological treatment of the dream takes shape in Jung's mature theoretical work and is critiqued from within in Hillman's archetypal pushback. A century of European dream science worth taking seriously on its own terms — independent of, and in many places anticipating, the Asian sources the same period was beginning to translate.",
    primary_sources: [
      "Saint-Denys's Les Rêves et les moyens de les diriger (1867)",
      "van Eeden's \"A Study of Dreams\" (1913)",
      "Arnold-Forster's Studies in Dreams (1921)",
      "Jung's Memories, Dreams, Reflections and \"On the Nature of Dreams\"",
      "Hillman's The Dream and the Underworld",
    ],
  },
  {
    num: '05',
    roman: 'V',
    title: 'The Modern Scientific Era',
    lessonCount: 8,
    blurb:
      'The discovery of REM sleep and its dream correlate; the laboratory verification of lucid dreaming through eye-movement signaling; the practical synthesis that put induction techniques in the hands of ordinary readers; and the pharmacological and neuroscientific extensions of the last two decades.',
    overview:
      "The modern scientific era arrives late to a tradition the contemplatives have been working in for two and a half millennia. Aserinsky and Kleitman's 1953 two-page paper in Science made the dreaming brain visible in the laboratory by identifying the rapid eye movements that signal an active dream period. Hearne's 1975 demonstration at Hull, and LaBerge's independent 1980 verification at Stanford, established that the lucid dreamer can communicate volitionally from inside a confirmed REM episode through pre-arranged eye signals — the contemplative tradition's central empirical claim, finally registered on an instrument outside the practitioner's body. The induction techniques that grew out of the laboratory work — MILD, WILD, WBTB — put reliable methods in the hands of motivated readers. The 2018 PLOS ONE study established a substantial dose-response effect for galantamine on lucid-dream frequency. The neuroscience of the 2010s, the clinical literature on lucid-dreaming therapy for nightmare disorder — these have filled in the picture without exhausting it. The science has confirmed the trainability the contemplative tradition always assumed. What it has not done is supply the framing within which the practice is finally meant to land.",
    primary_sources: [
      'Aserinsky and Kleitman 1953 (Science)',
      "LaBerge and Rheingold's Exploring the World of Lucid Dreaming",
      'LaBerge, LaMarca, and Baird 2018 (PLOS ONE)',
    ],
  },
  {
    num: '06',
    roman: 'VI',
    title: 'Convergence',
    lessonCount: 8,
    blurb:
      'Where the contemplative and scientific traditions meet, and where they refuse to. The Wallace bridge; what dream yoga adds to the lucid-dreaming program; what the science adds to the tradition; the contemporary teaching landscape; and the parts of the dialogue that hold and the parts that fray.',
    overview:
      "The contemplative and scientific traditions have, in the last forty years, finally come into sustained contact. B. Alan Wallace's Dreaming Yourself Awake (2012) is the central book that builds the bridge — a Tibetan-trained scholar-practitioner who, having practiced dream yoga in long retreat, takes the Western lucid-dreaming literature on its own terms and re-frames it with what the Tibetan tradition contributes: an aim beyond lucidity, the daytime practice of illusory body, the cultivation of awareness in dreamless sleep, and the bardo as the structural framework that gives the whole practice its weight. Andrew Holecek's Dream Yoga (2016) and Tenzin Wangyal's The Tibetan Yogas of Dream and Sleep (1998) work the same convergence in different registers, for different audiences. The Mind and Life Institute's dialogues, beginning in 1987, supply the institutional venue. Evan Thompson's Waking, Dreaming, Being (2015) supplies the philosophical infrastructure. What the next generation inherits is an integration that is real and unfinished — the contemplative and scientific frames neither collapsed into each other nor allowed to drift apart, with the practice itself as the place where the two have to keep meeting. The course ends; the practice does not.",
    primary_sources: [
      "Wallace's Dreaming Yourself Awake",
      "Holecek's Dream Yoga",
      "Wangyal's Tibetan Yogas of Dream and Sleep",
    ],
  },
];

// The Library is a citation index. For each text we hold a short editorial
// summary plus a "reference" pointer noting where the source is held in the
// project's reference-material folder, so a careful reader can trace the
// citation back to its file. Full primary text is no longer hosted in-page;
// the long-form treatment of each text now lives in the Articles below.
export const library = [
  // Primary sources — chronological
  {
    type: 'Primary',
    title: 'Bṛhadāraṇyaka Upaniṣad',
    author: 'Anonymous',
    year: 'c. 700 BCE',
    summary:
      "The longest and oldest of the principal Upaniṣads. Yājñavalkya's dialogue with King Janaka in Book IV is the foundational Indian text on dream-construction: the dreamer fashions the dream from impressions of the waking day, and the same self witnesses both states.",
    reference: 'Olivelle, The Early Upaniṣads (Oxford, 1998).',
  },
  {
    type: 'Primary',
    title: 'Chāndogya Upaniṣad',
    author: 'Anonymous',
    year: 'c. 700 BCE',
    summary:
      "An early prose Upaniṣad whose treatment of speech, breath, and the syllable Om frames the contemplative grammar the Māṇḍūkya will compress to twelve verses. Its instruction on the deep self (ātman) anchors the four-state schema in lived practice.",
    reference: 'Olivelle, The Early Upaniṣads (Oxford, 1998).',
  },
  {
    type: 'Primary',
    title: 'Māṇḍūkya Upaniṣad',
    author: 'Anonymous',
    year: 'c. 500 BCE',
    summary:
      'Twelve verses; the philosophical bedrock for almost every later Asian discussion of consciousness across states. Lays out waking, dreaming, deep sleep, and the witnessing turīya, and maps them onto the four moments of Om.',
    reference: 'Krishnananda, The Māṇḍūkya Upaniṣad (Divine Life Society, 1968).',
  },
  {
    type: 'Primary',
    title: 'Zhuangzi (Inner Chapters)',
    author: 'Zhuang Zhou',
    year: 'c. 4th c. BCE',
    summary:
      "The butterfly passage and the surrounding Inner Chapters give Daoism its central image for the porousness of waking and dream — and shift the question from which state is real to what changes when one passes between them.",
    reference: 'Ziporyn, Zhuangzi: The Complete Writings (Hackett, 2020).',
  },
  {
    type: 'Primary',
    title: 'Milindapañha',
    author: 'attrib. Nāgasena',
    year: 'c. 1st c. BCE',
    summary:
      "Nāgasena's analysis for King Milinda distinguishes four causes of dream-experience without granting them epistemic authority — the early Indian Buddhist taxonomy that the later Mahāyāna and tantric traditions will quietly inherit.",
    reference: 'Mendis, The Questions of King Milinda (Buddhist Publication Society).',
  },
  {
    type: 'Primary',
    title: 'Oneirocritica',
    author: 'Artemidorus of Daldis',
    year: 'c. 2nd c. CE',
    summary:
      'The most complete classical handbook of dream interpretation; five books cataloguing dream-images and the principles for reading them. The reference text for the Greco-Roman interpretive tradition the medieval Latin world will inherit.',
    reference: 'Discussed in Beare, Aristotle: Parva Naturalia (Oxford, 1908).',
  },
  {
    type: 'Primary',
    title: 'Viṃśatikā',
    author: 'Vasubandhu',
    year: 'c. 4th c. CE',
    summary:
      'Twenty verses defending the Yogācāra claim that experience is appearance-only. Vasubandhu deploys dream as the central illustration: if the dream-world is vivid without an external object, the waking world need not be otherwise.',
    reference: 'Anacker, Seven Works of Vasubandhu (Motilal Banarsidass, 1984).',
  },
  {
    type: 'Primary',
    title: 'Māṇḍūkya-Kārikā',
    author: 'Gauḍapāda',
    year: 'c. 7th c. CE',
    summary:
      "Gauḍapāda's commentary on the Māṇḍūkya. The first systematic Advaita Vedānta — and the bridge between the Upaniṣadic four-state schema and the Buddhist analyses of mind that surround it.",
    reference: 'Reference: Krishnananda, The Māṇḍūkya Upaniṣad (Divine Life Society, 1968).',
  },
  {
    type: 'Primary',
    title: 'Bodhicaryāvatāra',
    author: 'Śāntideva',
    year: 'c. 8th c. CE',
    summary:
      "The Mahāyāna's central practice manual. Śāntideva uses dream as the working figure for the philosophical claim that all phenomena are appearance-only — the source the Tibetan tradition will most absorb.",
    reference: 'Padmakara Translation Group, The Way of the Bodhisattva (Shambhala, 2006).',
  },
  {
    type: 'Primary',
    title: 'Fuṣūṣ al-Ḥikam',
    author: 'Ibn al-ʿArabī',
    year: 'c. 1229',
    summary:
      "The 'Bezels of Wisdom'. Ibn al-ʿArabī's mature presentation of the imaginal world (ʿālam al-mithāl) and the ontology of khayāl — the most philosophically developed pre-modern treatment of dream in any tradition.",
    reference: 'Chittick, The Sufi Path of Knowledge (SUNY, 1989).',
  },
  {
    type: 'Primary',
    title: 'Bardo Thödol cycle',
    author: 'rev. Karma Lingpa',
    year: '14th c.',
    summary:
      "The 'Tibetan Book of the Dead' and its companion bardo texts. Frames dream practice as preparation for the intermediate states between death and rebirth — the larger architecture in which milam (dream yoga) takes its sense.",
    reference: 'Fremantle & Trungpa, The Tibetan Book of the Dead (Shambhala, 1975).',
  },
  {
    type: 'Primary',
    title: 'Les rêves et les moyens de les diriger',
    author: 'Hervey de Saint-Denys',
    year: '1867',
    summary:
      'Twenty years and nearly two thousand dreams, journaled by patient self-observation. Saint-Denys describes the methods that anticipate nearly every modern lucid-dreaming induction technique — the foundation stone of the modern empirical study of dreaming.',
    reference: 'Hervey de Saint-Denys, Les rêves et les moyens de les diriger (Paris: Amyot, 1867).',
  },
  {
    type: 'Primary',
    title: 'A Study of Dreams',
    author: 'Frederik van Eeden',
    year: '1913',
    summary:
      "The 1913 Society for Psychical Research paper that coins 'lucid dream' in its present meaning. Short, clear, available in full in the Society's archive.",
    reference: 'Frederik van Eeden, "A Study of Dreams," Proceedings of the Society for Psychical Research 26 (1913): 431–461.',
  },
  {
    type: 'Primary',
    title: 'Studies in Dreams',
    author: 'Mary Arnold-Forster',
    year: '1921',
    summary:
      "The first practical instructional manual in the empirical tradition. Arnold-Forster's protocols anticipate MILD by sixty years.",
    reference: 'Mary Arnold-Forster, Studies in Dreams (London: Allen & Unwin, 1921).',
  },
  // Modern texts — chronological
  {
    type: 'Text',
    title: 'Exploring the World of Lucid Dreaming',
    author: 'LaBerge & Rheingold',
    year: '1990',
    summary:
      'The foundational accessible synthesis of the LaBerge research program; the entry point to the modern scientific era and the source of the MILD protocol as practitioners now know it.',
    reference: 'Stephen LaBerge & Howard Rheingold, Exploring the World of Lucid Dreaming (Ballantine, 1990).',
  },
  {
    type: 'Text',
    title: 'Dream Yoga and the Practice of Natural Light',
    author: 'Namkhai Norbu',
    year: '1992',
    summary:
      "The foundational modern Dzogchen text in English on dream and natural-light practice. Pairs naturally with Tenzin Wangyal as a second lineage view.",
    reference: 'Chögyal Namkhai Norbu, Dream Yoga and the Practice of Natural Light (Snow Lion, 1992).',
  },
  {
    type: 'Text',
    title: 'Sleeping, Dreaming, and Dying',
    author: 'Francisco Varela (ed.)',
    year: '1997',
    summary:
      "Records the 1992 Mind and Life dialogue. The Dalai Lama's discussion of sleep yoga and clear light is the most accessible primary-source statement of the tradition's most advanced claim.",
    reference: 'Wisdom Publications, 1997. Discussed at length in unit 06.',
  },
  {
    type: 'Text',
    title: 'The Tibetan Yogas of Dream and Sleep',
    author: 'Tenzin Wangyal Rinpoche',
    year: '1998',
    summary:
      'The course primary text on the Bön Dzogchen presentation of dream and sleep yoga; the most accessible technically complete treatment in English.',
    reference: 'Snow Lion, 1998.',
  },
  {
    type: 'Text',
    title: 'Dreaming Yourself Awake',
    author: 'B. Alan Wallace',
    year: '2012',
    summary:
      'The single most-developed contemplative-scientific bridge text. The right book to build the convergence around.',
    reference: 'Shambhala, 2012.',
  },
  {
    type: 'Text',
    title: 'Waking, Dreaming, Being',
    author: 'Evan Thompson',
    year: '2015',
    summary:
      'The most rigorous contemporary philosophical treatment; the book that most successfully holds the contemplative and scientific framings together without collapsing one into the other.',
    reference: 'Columbia, 2015. Discussed at length in unit 06.',
  },
  {
    type: 'Text',
    title: 'Dream Yoga',
    author: 'Andrew Holecek',
    year: '2016',
    summary:
      'The most accessible contemporary integration of the Six Yogas tradition with the Western lucid-dreaming literature.',
    reference: 'Sounds True, 2016.',
  },
  {
    type: 'Text',
    title: 'When Brains Dream',
    author: 'Stickgold & Zadra',
    year: '2021',
    summary:
      'The most recent accessible scientific synthesis. Substantial coverage of lucid dreaming and contemporary therapeutic applications.',
    reference: 'Norton, 2021. Discussed in unit 05.',
  },
  // Papers — chronological
  {
    type: 'Paper',
    title: 'Regularly occurring periods of eye motility, and concomitant phenomena, during sleep',
    author: 'Aserinsky & Kleitman',
    year: '1953',
    summary:
      'The two-page paper that founded the modern science of dreaming. Made the dreaming brain visible in the laboratory.',
    reference: 'Science 118:3062 (1953): 273–274.',
  },
  {
    type: 'Paper',
    title: 'Lucid dreaming verified by volitional communication during REM sleep',
    author: 'LaBerge et al.',
    year: '1981',
    summary:
      "The eye-signal demonstration. The contemplative tradition's central empirical claim, finally registered on an instrument outside the practitioner's body.",
    reference: 'Perceptual and Motor Skills 52 (1981): 727–732.',
  },
  {
    type: 'Paper',
    title: 'Lucid dreaming: a state of consciousness with features of both waking and non-lucid dreaming',
    author: 'Voss et al.',
    year: '2009',
    summary:
      'EEG study showing the lucid-dream state has signatures of both waking and REM sleep — the first neurophysiological correlates of lucidity.',
    reference: 'Sleep 32:9 (2009): 1191–1200.',
  },
  {
    type: 'Paper',
    title: 'Neural correlates of dream lucidity obtained from contrasting lucid versus non-lucid REM sleep',
    author: 'Dresler et al.',
    year: '2012',
    summary:
      'Combined EEG and fMRI evidence locating prefrontal activity that distinguishes lucid from non-lucid REM. The neuroimaging follow-up to the Voss work.',
    reference: 'Sleep 35:7 (2012): 1017–1020.',
  },
  {
    type: 'Paper',
    title: 'Reality testing and the mnemonic induction of lucid dreams',
    author: 'Aspy et al.',
    year: '2017',
    summary:
      'The largest controlled trial of the MILD protocol; provides quantitative evidence for an effect contemplatives had taken on faith for centuries.',
    reference: 'Dreaming 27:3 (2017): 206–231.',
  },
  {
    type: 'Paper',
    title: 'Pre-sleep treatment with galantamine stimulates lucid dreaming',
    author: 'LaBerge, LaMarca & Baird',
    year: '2018',
    summary:
      'The substantial dose-response effect for galantamine. A result the field is still working out the practical and ethical implications of.',
    reference: 'PLOS ONE 13:8 (2018).',
  },
];

// Articles — substantial long-form treatments of each tradition, drawn from
// reference-material/09_research/. Loaded on demand from data/articles.json.
// Each entry is the metadata used to render the Library cards; the body is
// fetched lazily when a user opens a particular article.
export const articles = [
  {
    id: 'ancient_origins',
    num: '01',
    label: 'Ancient Origins',
    title: 'Roots of the practice as a problem worth thinking about.',
    blurb:
      'Vedic and Upaniṣadic Hinduism, Indian Buddhism, the Mahāyāna, and Greco-Roman dream science. Four bodies of source material, none of them yet dream yoga, each contributing something the later tradition could not have done without.',
    word_count: 8400,
    source: 'reference-material/09_research/unit_01_ancient_origins.md',
  },
  {
    id: 'tibetan_dream_yoga',
    num: '02',
    label: 'Tibetan Dream Yoga',
    title: 'A thousand-year continuous transmission.',
    blurb:
      'Sitting at the intersection of tantric yoga, the bardo teachings, Mahāmudrā, and Dzogchen. The discipline whose stated point is the recognition of the illusory nature of all experience and the stabilization of awareness through every transition.',
    word_count: 7100,
    source: 'reference-material/09_research/unit_02_tibetan_dream_yoga.md',
  },
  {
    id: 'other_asian_traditions',
    num: '03',
    label: 'Other Asian Traditions',
    title: 'Daoist sleep cultivation and Sufi imagination.',
    blurb:
      "The Zhuangzi's butterfly, Quanzhen sleep cultivation, Ibn al-ʿArabī's khayāl. Two parallel contemplative answers to the same question the Indian and Greek traditions also asked, with vocabularies the Tibetan synthesis quietly converses with.",
    word_count: 6500,
    source: 'reference-material/09_research/unit_03_other_asian_traditions.md',
  },
  {
    id: 'western_rediscovery',
    num: '04',
    label: 'Western Rediscovery',
    title: 'The empirical-introspective programme that recovered dream cultivation.',
    blurb:
      'Saint-Denys, van Eeden, Arnold-Forster — and the depth-psychological treatment of the dream in Jung, with Hillman\'s archetypal pushback. A century of European dream science worth taking seriously on its own terms.',
    word_count: 6700,
    source: 'reference-material/09_research/unit_04_western_rediscovery.md',
  },
  {
    id: 'modern_scientific_era',
    num: '05',
    label: 'Modern Scientific Era',
    title: 'From REM sleep to the eye-signal verification of lucid dreaming.',
    blurb:
      "Aserinsky and Kleitman in 1953; LaBerge at Stanford in 1980; the induction-technique literature; the 2018 galantamine trial; the neuroscience of the 2010s. The science finally catches up to a tradition the contemplatives have been working in for two and a half millennia.",
    word_count: 6500,
    source: 'reference-material/09_research/unit_05_modern_scientific_era.md',
  },
  {
    id: 'contemporary_convergence',
    num: '06',
    label: 'Contemporary Convergence',
    title: 'Where the contemplative and scientific traditions meet.',
    blurb:
      "Wallace's bridge, Holecek and Wangyal's contemporary teaching, the Mind & Life dialogue, Thompson's philosophical infrastructure. An integration that is real and unfinished, with the practice itself as the place the two have to keep meeting.",
    word_count: 7900,
    source: 'reference-material/09_research/unit_06_convergence.md',
  },
];

// A single curated quote for the home page. Drawn from quote_bank.json.
export const homeQuote = {
  text:
    'The dreamer who recognizes the dream within the dream is preparing to recognize the larger dream we usually take for waking.',
  attribution: 'Tenzin Wangyal Rinpoche',
  citation: 'The Tibetan Yogas of Dream and Sleep, 1998',
};

// Cross-cutting thematic index — drawn from /reference-material/themes/themed_index.json.
// Fourteen themes that appear across the primary texts. Use as a "browse by theme"
// pivot complementing the citation-based Library list.
export const themes = [
  { id: 'four_states_of_consciousness', label: 'Four States of Consciousness', desc: 'Waking (jāgrat), dream (svapna), deep sleep (suṣupti), and the fourth (turīya). Central to the Māṇḍūkya Upaniṣad and resonant with Tibetan presentations of mind’s nature.', sources: 25 },
  { id: 'om_pranava', label: 'Om / Praṇava', desc: 'The mystical syllable Om as both symbol and sound, and as the Ātman. The most-densely-attested theme across the corpus.', sources: 66 },
  { id: 'witness_consciousness_atman', label: 'Witness Consciousness', desc: 'The witnessing awareness that knows the three states; Ātman as turīya. The contemplative bedrock of the Indian tradition.', sources: 62 },
  { id: 'dream_yoga_practice', label: 'Dream Yoga Practice', desc: 'Formal practices of milam: visualization, induction, stabilization. The technical core of the Tibetan tradition.', sources: 40 },
  { id: 'illusory_body_emptiness', label: 'Illusory Body & Emptiness', desc: 'All phenomena, waking and dreaming, as appearances of mind; śūnyatā as a foundation for dream practice.', sources: 39 },
  { id: 'sleep_yoga_clear_light', label: 'Sleep Yoga / Clear Light', desc: 'Practice of awareness in dreamless sleep; recognition of the clear light (‘od gsal).', sources: 38 },
  { id: 'obstacles', label: 'Obstacles to Practice', desc: 'Common obstacles: forgetting, drowsiness, agitation, attachment.', sources: 36 },
  { id: 'rigpa_kunzhi', label: 'Rigpa, Kunzhi, Mind’s Nature', desc: 'Dzogchen presentations: rigpa (innate awareness), kunzhi (base), and the recognition of mind’s nature.', sources: 35 },
  { id: 'energy_body_chakras', label: 'Energy Body & Channels', desc: 'Subtle anatomy: tsa / lung / tiglé, chakras, prāṇa, channels.', sources: 32 },
  { id: 'karma_traces', label: 'Karma & Karmic Traces', desc: 'Karmic imprints (vāsanās / bag chags) shaping experience in waking and dream.', sources: 29 },
  { id: 'lucidity_in_dream', label: 'Lucidity in Dream', desc: 'Recognition that one is dreaming while in the dream state.', sources: 28 },
  { id: 'bardo_death', label: 'Bardo & Death', desc: 'Dream practice as preparation for the bardo and the moment of death.', sources: 28 },
  { id: 'compassion_bodhicitta', label: 'Compassion / Bodhicitta', desc: 'The ethical and motivational ground of Buddhist dream practice.', sources: 22 },
  { id: 'dream_recall_journaling', label: 'Dream Recall & Journaling', desc: 'Practical foundations: remembering dreams, keeping a dream journal.', sources: 8 },
];

// Per-module deepening: a cross-link to the corresponding long-form article in
// the Library, annotated further reading, and theme links. Keyed by
// curriculumModules[].num. The background essay lives on
// curriculumModules[].overview; this object holds only the cross-links and
// bibliographic apparatus.
export const moduleDeepening = {
  '01': {
    article_link: { id: 'ancient_origins', label: 'Read the long-form article: Ancient Origins' },
    further_reading: [
      { author: 'Olivelle, Patrick', title: 'The Early Upaniṣads: Annotated Text and Translation (Oxford, 1998)', note: "The standard scholarly translation, indispensable for the Bṛhadāraṇyaka's Book IV — the Yājñavalkya–Janaka dialogue that is the foundational Indian text on dream-construction." },
      { author: "Doniger O'Flaherty, Wendy", title: 'Dreams, Illusion, and Other Realities (Chicago, 1984)', note: 'The canonical comparative study; chapters 1–3 establish the broader Indian background within which the Māṇḍūkya sits.' },
      { author: 'Anacker, Stefan, trans.', title: 'Seven Works of Vasubandhu (Motilal Banarsidass, 1984)', note: "Includes the Viṃśatikā, in which Vasubandhu deploys dream as the central illustration of the Yogācāra claim that experience is appearance-only." },
      { author: 'Padmakara Translation Group, trans.', title: 'The Way of the Bodhisattva (Bodhicaryāvatāra) (Shambhala, 2006)', note: 'The standard contemporary English translation of Śāntideva, the Mahāyāna source the Tibetan tradition will most absorb.' },
      { author: 'Beare, J. I., trans.', title: "Aristotle, Parva Naturalia (Oxford, 1908; Internet Classics Archive)", note: 'The Greek naturalistic treatment of dream — On Sleep, On Dreams, On Divination in Sleep — that the medieval and early-modern Latin tradition would build on.' },
    ],
    theme_links: ['four_states_of_consciousness', 'witness_consciousness_atman', 'illusory_body_emptiness'],
  },
  '02': {
    article_link: { id: 'tibetan_dream_yoga', label: 'Read the long-form article: Tibetan Dream Yoga' },
    further_reading: [
      { author: 'Mullin, Glenn, trans.', title: "Tsongkhapa's Six Yogas of Naropa (Snow Lion, 2005)", note: 'The standard accessible scholarly treatment of the Geluk recension; rigorous on the technical vocabulary the popular literature often elides.' },
      { author: 'Namkhai Norbu', title: 'Dream Yoga and the Practice of Natural Light (Snow Lion, revised 2002)', note: 'The foundational modern Dzogchen text in English on dream and natural-light practice; pairs naturally with Tenzin Wangyal as a second lineage view.' },
      { author: 'Tenzin Wangyal Rinpoche', title: 'The Tibetan Yogas of Dream and Sleep (Snow Lion, 1998)', note: 'The course primary text on the Bön Dzogchen presentation; the most accessible technically complete treatment in English.' },
      { author: 'Padmasambhava (Karma Lingpa terma)', title: 'The Tibetan Book of the Dead, trans. Gyurme Dorje (Penguin, 2005)', note: 'The most complete contemporary English translation of the Bardo Thödol cycle; the framing within which the Tibetan tradition takes dream practice with the seriousness it does.' },
      { author: 'Khenchen Thrangu Rinpoche', title: 'Journey of the Mind: Putting the Teachings on the Bardo into Effective Practice (Namo Buddha, 2002)', note: 'Clear contemporary teaching on dream and sleep yoga from a senior Kagyu lineage holder; less technical than Mullin, more practical.' },
    ],
    theme_links: ['dream_yoga_practice', 'rigpa_kunzhi', 'sleep_yoga_clear_light', 'bardo_death', 'energy_body_chakras'],
  },
  '03': {
    article_link: { id: 'other_asian_traditions', label: 'Read the long-form article: Other Asian Traditions' },
    further_reading: [
      { author: 'Ziporyn, Brook, trans.', title: 'Zhuangzi: The Complete Writings (Hackett, 2020)', note: 'The best contemporary rendering of the Zhuangzi, with notes that illuminate the butterfly passage and its central position in world dream-philosophy.' },
      { author: 'Wong, Eva', title: 'Cultivating Stillness: A Taoist Manual for Transforming Body and Mind (Shambhala, 1992)', note: 'Foundational Quanzhen Daoist meditation text translated with extensive introductions; the right entry point for the framework within which Daoist sleep cultivation operates.' },
      { author: 'Chittick, William', title: "The Sufi Path of Knowledge: Ibn al-'Arabi's Metaphysics of Imagination (SUNY, 1989)", note: "The most accessible scholarly engagement with Ibn al-ʿArabī in English; the standard reference for the ʿālam al-mithāl and the ontology of khayāl." },
      { author: 'Corbin, Henry', title: "Creative Imagination in the Sufism of Ibn 'Arabi (Princeton, 1969)", note: "The foundational Western treatment of the imaginal world; pairs with Chittick to open the comparative question with the Tibetan bardo." },
      { author: 'Kohn, Livia', title: 'Sitting in Oblivion: The Heart of Daoist Meditation (Three Pines, 2010)', note: "The senior Daoist studies scholar's synthesis of meditation traditions, with substantial treatment of the Zhuangzi-Liezi background and later neidan developments." },
    ],
    theme_links: ['illusory_body_emptiness', 'witness_consciousness_atman', 'energy_body_chakras'],
  },
  '04': {
    article_link: { id: 'western_rediscovery', label: 'Read the long-form article: Western Rediscovery' },
    further_reading: [
      { author: 'Saint-Denys, Hervey de', title: 'Dreams and How to Guide Them, trans. Nicholas Fry (Duckworth, 1982; orig. French 1867)', note: 'The foundational text of the modern Western dream-cultivation tradition; the methods Saint-Denys describes anticipate nearly every modern lucid-dreaming induction technique and remain worth reading first-hand.' },
      { author: 'van Eeden, Frederik', title: '"A Study of Dreams," Proceedings of the Society for Psychical Research 26 (1913): 431–461', note: 'The 1913 paper that coins "lucid dream" in its present meaning; short, clear, available in full in the Society\'s archive.' },
      { author: 'Arnold-Forster, Mary', title: 'Studies in Dreams (Macmillan, 1921)', note: "The first practical instructional manual in the empirical tradition. Arnold-Forster's protocols anticipate MILD by sixty years." },
      { author: 'Carroy, Jacqueline', title: 'Nuits savantes: Une histoire des rêves (1800–1945) (Éditions de l\'EHESS, 2012)', note: 'The contemporary historiographic correction; reframes the nineteenth-century empirical-introspective tradition as a coherent scientific program in its own right, displacing the Freud-as-origin assumption.' },
      { author: 'Jung, C. G.', title: 'Memories, Dreams, Reflections (Pantheon, 1963)', note: "Jung's autobiographical account, where the dreams that shaped his thought are presented in their own voice." },
      { author: 'Hillman, James', title: 'The Dream and the Underworld (Harper & Row, 1979)', note: 'The principal post-Jungian re-framing of dream as a domain in its own right rather than a code; an essential corrective to the use to which depth psychology had put the dream by the late twentieth century.' },
    ],
    theme_links: ['lucidity_in_dream', 'dream_recall_journaling'],
  },
  '05': {
    article_link: { id: 'modern_scientific_era', label: 'Read the long-form article: Modern Scientific Era' },
    further_reading: [
      { author: 'Aserinsky, Eugene & Kleitman, Nathaniel', title: '"Regularly occurring periods of eye motility, and concomitant phenomena, during sleep," Science 118:3062 (1953): 273–274', note: 'The two-page paper that founded the modern science of dreaming.' },
      { author: 'LaBerge, Stephen, et al.', title: '"Lucid dreaming verified by volitional communication during REM sleep," Perceptual and Motor Skills 52 (1981): 727–732', note: 'The eye-signal demonstration; the contemplative tradition\'s central empirical claim, registered on an instrument outside the practitioner\'s body.' },
      { author: 'LaBerge, Stephen, & Rheingold, Howard', title: 'Exploring the World of Lucid Dreaming (Ballantine, 1990)', note: 'The foundational accessible synthesis of the LaBerge research program; the entry point to the modern scientific era and the source of the MILD protocol as practitioners now know it.' },
      { author: 'LaBerge, Stephen, LaMarca, Kristen, & Baird, Benjamin', title: '"Pre-sleep treatment with galantamine stimulates lucid dreaming: A double-blind, placebo-controlled, crossover study," PLOS ONE 13:8 (2018)', note: 'The substantial dose-response effect for galantamine; a result the field is still working out the practical and ethical implications of.' },
      { author: 'Stickgold, Robert, & Zadra, Antonio', title: 'When Brains Dream: Exploring the Science and Mystery of Sleep (Norton, 2021)', note: 'The most recent accessible scientific synthesis; substantial coverage of lucid dreaming and contemporary therapeutic applications.' },
    ],
    theme_links: ['lucidity_in_dream', 'dream_recall_journaling'],
  },
  '06': {
    article_link: { id: 'contemporary_convergence', label: 'Read the long-form article: Contemporary Convergence' },
    further_reading: [
      { author: 'Wallace, B. Alan', title: 'Dreaming Yourself Awake: Lucid Dreaming and Tibetan Dream Yoga for Insight and Transformation (Shambhala, 2012)', note: 'The single most-developed contemplative-scientific bridge text. The right book to build the convergence around.' },
      { author: 'Holecek, Andrew', title: 'Dream Yoga: Illuminating Your Life Through Lucid Dreaming and the Tibetan Yogas of Sleep (Sounds True, 2016)', note: 'The most accessible contemporary integration of the Six Yogas tradition with the Western lucid-dreaming literature.' },
      { author: 'Thompson, Evan', title: 'Waking, Dreaming, Being: Self and Consciousness in Neuroscience, Meditation, and Philosophy (Columbia, 2015)', note: 'The most rigorous contemporary philosophical treatment; the book that most successfully holds the contemplative and scientific framings together without collapsing one into the other.' },
      { author: 'Varela, Francisco, ed.', title: 'Sleeping, Dreaming, and Dying: An Exploration of Consciousness with the Dalai Lama (Wisdom, 1997)', note: "Records the 1992 Mind and Life dialogue; the Dalai Lama's discussion of sleep yoga and clear light is the most accessible primary-source statement of the tradition's most advanced claim." },
      { author: 'Solms, Mark', title: 'The Hidden Spring: A Journey to the Source of Consciousness (Norton, 2021)', note: 'The most recent major synthesis from a clinical-neurological perspective; engages dreams centrally as part of a broader theory of consciousness the contemplative tradition is well-positioned to converse with.' },
    ],
    theme_links: ['compassion_bodhicitta', 'sleep_yoga_clear_light', 'rigpa_kunzhi', 'lucidity_in_dream'],
  },
};

// About-page sub-sections — wired to footer "Index" links.
// Each is its own simple content page, reachable from the footer.
export const aboutPages = {
  conduct: {
    title: 'Code of Conduct',
    kicker: 'How We Hold the Practice Together',
    paragraphs: [
      'This community is rooted in respect for personal experience, cultural traditions, and the vulnerability of sharing dream content. Three commitments hold throughout.',
      'First — witness without interpretation, unless interpretation is invited. The dream is the dreamer’s. Even a kindly-meant analysis can colonize the experience before the dreamer has had time with it.',
      'Second — treat the contemplative traditions on their own terms. The Indian, Tibetan, Bön, Sufi, Daoist, Japanese, and Western lineages here did not exist for our convenience and are not interchangeable. Quote responsibly. Cite the source. Do not pluck a technique out of its lineage and re-sell it.',
      'Third — no proselytizing, no advice-giving without consent, no using the platform to recruit for any other practice or product. Disagreements are welcome; contempt is not. Volunteer moderators draw from advanced students once the community matures, with a light touch.',
    ],
  },
  acknowledgments: {
    title: 'Acknowledgments',
    kicker: 'Sources, Teachers, and the Lineages Behind the Work',
    paragraphs: [
      "The course material draws principally from two primary texts: Swami Krishnananda’s 1968 lecture series on the Māṇḍūkya Upaniṣad (Divine Life Society), and Tenzin Wangyal Rinpoche’s The Tibetan Yogas of Dream and Sleep (Snow Lion, 1998), edited by Mark Dahlby. Both sources are gratefully acknowledged.",
      'Background research is grounded in the contemporary integrative literature: Francisco Varela ed., Sleeping, Dreaming, and Dying (1997); Evan Thompson, Waking, Dreaming, Being (2015); B. Alan Wallace, Dreaming Yourself Awake (2012); Andrew Holecek, Dream Yoga (2016); the lucid-dreaming research line from Stephen LaBerge through Voss, Dresler, and Aspy.',
      'The cross-tradition history was developed with reference to the standard scholarship in each field: Patrick Olivelle on the Upaniṣads; Brook Ziporyn on Zhuangzi; William Chittick on Ibn al-ʿArabī; Tanahashi on Dōgen; Nicholas Fry on Saint-Denys. Errors and infelicities in synthesis are ours.',
      'The site is built on the work of the open-source community: React, Vite, Tailwind CSS, and the typography projects already named. We owe each of them.',
    ],
  },
  contact: {
    title: 'Contact',
    kicker: 'Reach Us',
    email: 'admin@svapnaproject.org',
    paragraphs: [
      'Write with questions about the course, the source materials, or the project. We read everything; replies arrive when they arrive.',
      'For corrections — typos, mistranslations, citation errors, mis-attributed lineages — please flag them. Accuracy matters more here than tone.',
      'For permission to translate, adapt, or republish material from this site: yes, in advance, under the terms outlined on the Support page. Please tell us what you made so we can link to it.',
    ],
  },
};
