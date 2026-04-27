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
      "Four further streams develop in parallel: the Daoist tradition of transformation and inner alchemy, from Zhuangzi to Chen Tuan's sleep cultivations; Japanese Buddhist dream culture, including Myōe Kōben's forty-year diary and Dōgen's philosophy of dreaming within a dream; the Sufi sciences of imagination centered on Ibn al-ʿArabī's ʿālam al-mithāl; and the Theravāda treatments of the Pāli commentarial tradition.",
    figures: ['Zhuangzi', 'Chen Tuan', 'Myōe Kōben', 'Dōgen', 'Ibn al-ʿArabī'],
  },
  {
    num: 'IV',
    title: 'Western Rediscovery',
    date: '1860 — 1970',
    blurb:
      "Europe arrives at deliberate dream cultivation through individual experimenters rather than lineages. Saint-Denys's 1867 journal of nearly two thousand dreams, van Eeden's coining of 'lucid dream' in 1913, and Arnold-Forster's practical methods establish the empirical line; Ouspensky, the Surrealists, and the depth psychologies of Freud and Jung supply the contemplative and imaginal frame.",
    figures: ['Hervey de Saint-Denys', 'Frederik van Eeden', 'Mary Arnold-Forster', 'C. G. Jung'],
  },
  {
    num: 'V',
    title: 'The Sleep Laboratory',
    date: '1953 — present',
    blurb:
      'After the discovery of REM sleep, Hearne in 1975 and LaBerge at Stanford in 1980 demonstrate that a lucid dreamer can communicate with the laboratory through pre-arranged eye movements. Subsequent work by Tholey, Voss, Dresler, and Aspy establishes the neural correlates of lucid dreaming, refines its induction, and opens its clinical use for nightmare disorder.',
    figures: ['Stephen LaBerge', 'Paul Tholey', 'Ursula Voss', 'Martin Dresler'],
  },
  {
    num: 'VI',
    title: 'Convergence',
    date: '1987 — present',
    blurb:
      'Through the Mind and Life Institute and bridge figures including Varela, Wallace, Thompson, and Holecek, the contemplative and scientific traditions begin to inform each other. The science vindicates the trainability of dream awareness; the contemplative tradition, in turn, refines the framing — lucid dreaming as foundation rather than goal, situated within ethical and soteriological practice.',
    figures: ['Francisco Varela', 'the 14th Dalai Lama', 'B. Alan Wallace', 'Evan Thompson'],
  },
];

// Curriculum: six phases, each containing two modules with full lesson plans.
// `focus` is the short overview-card description; `synthesis` is the longer
// phase-level paragraph shown on the phase detail page.
export const curriculumPhases = [
  {
    phase: 'I',
    title: 'Foundation',
    weeks: '01—02',
    focus:
      "The student installs the four-state model of the Māṇḍūkya and begins the dream journal the same evening Module 1 begins. The Padmasambhava lineage and Tenzin Wangyal's Part One supply the working frame.",
    practices: ['Dream journal', 'Sleep hygiene', 'Reading aloud', 'Daily sitting'],
    synthesis:
      'These two weeks install the conceptual ground the rest of the course rests on. Module 1 introduces the Upaniṣadic distinction between content and witnessing across the four states of consciousness; Module 2 places that distinction inside the Tibetan bardo framework descending from Padmasambhava. The student should expect to leave this phase with a working vocabulary for awareness as continuous through waking, dream, and sleep, and with the dream journal and nightly intention practice already underway.',
    modules: [
      {
        num: '01',
        title: 'The Indian Roots',
        week: 'Week 1',
        objectives: [
          'Distinguish the four states of consciousness (jāgrat, svapna, suṣupti, turīya) in the Māṇḍūkya Upaniṣad.',
          'Hold the distinction between dream content and the awareness that witnesses it.',
          "Apply Nāgasena's fourfold typology of dream causes from the Milindapañha to one's own dream material.",
          "Establish a sustained dream journal as the course's primary instrument.",
        ],
        primary_reading: 'Māṇḍūkya Upaniṣad (full text, with at least one commentary).',
        secondary_reading: 'Milindapañha selections on dreams; Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep (1998), Introduction.',
        practice:
          'Set up the dream journal and write in it each morning, recording absence as carefully as presence. Mid-week, sit for fifteen minutes in silent attention to the four states — waking, transition, dream recall, witnessing — without forcing any conclusion.',
        prompt:
          'Drawing on the readings, describe the relationship between content and witnessing in the four states of consciousness, using one example from your own experience to illustrate the distinction.',
        key_terms: ['jāgrat', 'svapna', 'suṣupti', 'turīya', 'Māṇḍūkya Upaniṣad', 'Milindapañha'],
      },
      {
        num: '02',
        title: 'Tibetan Foundations',
        week: 'Week 2',
        objectives: [
          'Trace the lineage from Padmasambhava through the Nyingma stream and locate dream yoga within it.',
          'Enumerate the six bardos and articulate their structural analogy.',
          'Situate Dzogchen and the recognition of rigpa in relation to dream practice.',
          'Begin nightly intention-setting before sleep.',
        ],
        primary_reading: 'Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep (1998), Part One (Foundations).',
        secondary_reading: 'Selections from the Bardo Thödol cycle (dream bardo passages); Andrew Holecek, Dream Yoga (2016), Chapters 1–2.',
        practice:
          'Each night before sleep, sit briefly and generate the wish for clear awareness through the night, holding the intention without straining. Continue the dream journal and note any shift in recall as the intention practice settles.',
        prompt:
          "Describe the bardo framework as you understand it from this week's readings, and assess what it adds — or what it costs — to treat dream practice as continuous with the practice for the moment of death.",
        key_terms: ['Padmasambhava', 'Nyingma', 'bardo', 'terma', 'rigpa', 'Dzogchen'],
      },
    ],
  },
  {
    phase: 'II',
    title: 'Awareness',
    weeks: '03—04',
    focus:
      'The student deepens recall through the Bön natural-light orientation and turns to the Chinese sources, holding the butterfly passage and selected Chan koans alongside the daytime quality of attention.',
    practices: ['Natural-light practice', 'Zhiné (calm abiding)', 'Comparative reflection', 'Recall consolidation'],
    synthesis:
      'The second phase widens the field beyond the Indian–Tibetan axis and asks what it means to be awake during the day. Module 3 brings the Bön emphasis on natural light and the claim that the dream is shaped by the day; Module 4 sets the Chinese tradition — Zhuangzi, Chan, and the inner alchemical lineage — beside what has come before. The student should leave this phase able to feel the distinct flavors of each tradition without prematurely collapsing them into a single vocabulary.',
    modules: [
      {
        num: '03',
        title: 'The Bön Tradition',
        week: 'Week 3',
        objectives: [
          'Distinguish Yungdrung Bön from the older shamanic stream and from Tibetan Buddhism proper.',
          "Articulate Tenzin Wangyal's three phases of practice: daytime preparation, nighttime preparation, integration.",
          'Differentiate the Bön aim of recognition in the dreamless state (sleep of clear light) from ordinary dream yoga.',
          'Begin a daytime recognition practice and a nighttime tiglé visualization.',
        ],
        primary_reading: 'Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep (1998), Part Two (The Practice of Dream Yoga), through the integration chapter.',
        secondary_reading: null,
        practice:
          "Pick one routine moment a day — making tea, walking through a doorway, looking up from a screen — and recognize, for that moment, the dreamlike quality of what is appearing. At night, follow Tenzin Wangyal's instructions for the throat-center tiglé visualization without expectation.",
        prompt:
          "Identify one feature of your daily life that, by Tenzin Wangyal's account, is currently shaping the quality of your sleep and dream, and describe what would have to be different for it to support rather than impede the practice.",
        key_terms: ['Bön', 'Yungdrung', 'tiglé', 'ösel', 'natural light', 'sleep of clear light'],
      },
      {
        num: '04',
        title: 'Chinese Sources',
        week: 'Week 4',
        objectives: [
          'Read the Zhuangzi butterfly passage as a teaching on identity rather than mere skepticism.',
          'Characterize the Chan refusal to give a technical account of practice in deep sleep.',
          'Sketch the philosophical ground of neidan and the three treasures (jing, qi, shen).',
          'Place the Chinese material in dialogue with the Tibetan material from Modules 2 and 3.',
        ],
        primary_reading: 'Zhuangzi, inner chapters (focus on the butterfly passage and the chapter on the equality of things), Ziporyn translation.',
        secondary_reading: 'Selected Chan koans on sleep and waking; Eva Wong, Cultivating Stillness, introduction to Daoist inner alchemy.',
        practice:
          'Sit in silence for twenty minutes mid-week, noticing the transitions in attention without intervening. Carry the question of porous boundaries between states into ordinary moments without trying to resolve it.',
        prompt:
          'Choose one specific question — the role of the body in dream practice, the treatment of the transition into sleep, or what each tradition takes recognition to mean — and develop a careful comparison between the Chinese and Tibetan material.',
        key_terms: ['Zhuangzi', 'huà', 'Chan', 'neidan', 'jing', 'qi', 'shen'],
      },
    ],
  },
  {
    phase: 'III',
    title: 'Induction',
    weeks: '05—06',
    focus:
      'With the Six Yogas of Nāropa as the technical core, the student begins formal induction and illusory-body practice, treating waking experience with the same attention one would bring to a dream.',
    practices: ['MILD intention', 'Reality testing', 'Illusory body', 'Six Yogas study'],
    synthesis:
      'Having established the philosophical ground, the course turns to method. Module 5 lays out the four practices of dream yoga from the Six Yogas of Naropa — recognition, transformation, illusion, suchness — and restricts the student to the first. Module 6 grounds night practice in its daytime correlate: gyulü, illusory body. The takeaway is that nighttime recognition stabilizes only when the day has been trained, and that the early stages of the work are more delicate than they look.',
    modules: [
      {
        num: '05',
        title: 'The Six Yogas of Naropa',
        week: 'Week 5',
        objectives: [
          'Locate dream yoga (milam) within the architecture of the Six Yogas — tummo, gyulü, milam, ösel, phowa, bardo.',
          'Trace the lineage from Tilopa and Naropa through Marpa, Milarepa, and Tsongkhapa.',
          'Distinguish the four practices of dream yoga in their proper order and rationale.',
          'Cultivate recognition without action — the first practice — without straying into transformation.',
        ],
        primary_reading: 'Glenn Mullin, The Six Yogas of Naropa, the dream yoga chapter.',
        secondary_reading: 'Andrew Holecek, Dream Yoga (2016), Chapters 3–4; Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep, Part Three (the four practices).',
        practice:
          "Continue nightly intention-setting, this week aimed specifically at recognition without action. If recognition arises in a dream, simply rest in the noticing — no flying, no testing, no doing — and bring the brevity rather than the drama into the morning's journal.",
        prompt:
          'Describe the four practices of dream yoga in your own words, in their proper order, and identify which one you can authentically begin to engage with at your current level of practice — without bypass.',
        key_terms: ['milam', 'tummo', 'gyulü', 'ösel', 'phowa', 'Six Yogas of Naropa'],
      },
      {
        num: '06',
        title: 'Illusory Body',
        week: 'Week 6',
        objectives: [
          "Describe the three forms of gyulü, including pure illusory body as the deity's form.",
          'Contrast illusory body practice with the Western reality check and articulate the philosophical disagreement underneath.',
          'Sustain illusory body practice across several daily moments and observe where the mind insists on solidity.',
          'Submit a structured review of the practice journal.',
        ],
        primary_reading: 'Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep, the daytime practice chapters (re-read with fresh eyes).',
        secondary_reading: 'Andrew Holecek, Dream Yoga (2016), on the daily preparation.',
        practice:
          'Choose three or four moments per day — the cup, the doorway, the conversation — and at each one, soften the assumption that what is appearing is independently real. Where accessible, sit briefly in front of a mirror without agenda and notice the felt difference, or its absence, between body and image.',
        prompt:
          "Submit a structured review of the week's practice journal, naming which moments you chose, what you noticed, where resistance arose, and where softening became available.",
        key_terms: ['gyulü', 'illusory body', 'yidam', 'pure illusory body', 'magical display', 'reality check'],
      },
    ],
  },
  {
    phase: 'IV',
    title: 'Stabilization',
    weeks: '07—08',
    focus:
      "Sleep yoga is introduced through Tenzin Wangyal's Part Four and the Māṇḍūkya's suṣupti passages, with the Daoist Chen Tuan tradition supplying the parallel framework of postures and three-treasure cultivation.",
    practices: ['Sleep yoga', 'Dream stabilization', 'Twenty-Four Sleep Exercises', 'Hypnagogic attention'],
    synthesis:
      "These two weeks take the practice into the deep dreamless state from two different angles. Module 7 develops Tenzin Wangyal's sleep yoga, with its thread of awareness descending into suṣupti and the honest acknowledgement that healthy sleep architecture is required. Module 8 returns to the Chinese material and treats Daoist sleep cultivation in the Chen Tuan lineage, where the body's three treasures rather than awareness itself are the primary object of attention. The student leaves with two compatible but distinct frameworks for the night.",
    modules: [
      {
        num: '07',
        title: 'Sleep Yoga',
        week: 'Week 7',
        objectives: [
          'Distinguish sleep yoga from dream yoga as practices addressed to different states.',
          'Describe the natural light (ösel) and the lamp-in-the-sealed-pot image of unrecognized awareness.',
          'Account honestly for the dependence of sleep yoga on undisturbed sleep architecture.',
          'Begin a heart-center tiglé visualization at the threshold of sleep.',
        ],
        primary_reading: 'Tenzin Wangyal Rinpoche, The Tibetan Yogas of Dream and Sleep, Part Four (sleep yoga, in full).',
        secondary_reading: 'Māṇḍūkya Upaniṣad on suṣupti, re-read with the contemporary readings in mind.',
        practice:
          'Each night, gently visualize a luminous tiglé at the heart center and cultivate the orientation the tradition calls being aware of being aware. Do not try to prevent sleep; cultivate a thread of awareness that goes with the dropping, and note in the journal what arises in the transition and on waking.',
        prompt:
          'Describe the distinction between dream yoga and sleep yoga, then describe what would have to change in your current life and sleep, if anything, for sleep yoga to become accessible at depth.',
        key_terms: ['ösel', 'suṣupti', 'natural light', 'tiglé', 'clear light', 'sleep yoga'],
      },
      {
        num: '08',
        title: 'Daoist Sleep Cultivation',
        week: 'Week 8',
        objectives: [
          'Outline the neidan framework and its cultivation of jing, qi, and shen.',
          'Describe the postures, breath patterns, and points of attention attributed to the Chen Tuan lineage.',
          'Contrast the Tibetan aim of recognition with the Daoist aim of waking nourished, with the three treasures intact.',
          'Read dream content as diagnostic of energetic state.',
        ],
        primary_reading: 'Eva Wong, Cultivating Stillness, opening sections.',
        secondary_reading: 'Selections on Chen Tuan and the Twenty-Four Sleep Exercises; Livia Kohn, Sitting in Oblivion, brief excerpts on Daoist meditation and sleep.',
        practice:
          'Adopt the right-side sleep posture — right hand under the cheek, left hand on the thigh, one knee slightly drawn up — with attention resting at the lower dantian, two to three finger widths below the navel. Avoid elaborate breath practices; let the simple posture and simple attention be sufficient.',
        prompt:
          'Describe the Daoist sleep cultivation framework in your own words and assess what it offers that the Tibetan framework does not — and what the Tibetan framework offers that the Daoist does not.',
        key_terms: ['neidan', 'Chen Tuan', 'dantian', 'jing', 'qi', 'shen', 'wu wei'],
      },
    ],
  },
  {
    phase: 'V',
    title: 'Deepening',
    weeks: '09—10',
    focus:
      'Bodhicitta becomes the ground of the practice through Śāntideva and the lojong tradition, and the bardo teachings re-frame dream-yoga as rehearsal for the moment of dying.',
    practices: ['Bodhicitta cultivation', 'Lojong slogans', 'Dream tonglen', 'Bardo contemplation'],
    synthesis:
      "The course's spine. Module 9 names bodhicitta as the ground without which the technical achievements of the previous weeks remain a sophisticated shell, and integrates the eight prior modules through a sustained mid-course paper. Module 10 turns to the bardo teachings in full and treats dream and sleep practice as rehearsal for the dissolutions of dying. The student should expect this phase to reframe what the rest of the course has built, not to add new technique.",
    modules: [
      {
        num: '09',
        title: 'Bodhicitta',
        week: 'Week 9',
        objectives: [
          'Define bodhicitta and articulate the structural argument for its necessity in genuine practice.',
          'Apply bodhicitta to the dream state through nightly generation of the wish before sleep.',
          'Describe dream tonglen as the integration of dream yoga and lojong.',
          'Integrate Modules 1–9 through a sustained mid-course paper.',
        ],
        primary_reading: 'Śāntideva, Bodhicaryāvatāra, Chapter 1.',
        secondary_reading: 'Pema Chödrön or Traleg Kyabgon on bodhicitta in daily life; Tenzin Wangyal Rinpoche, brief passages on motivation, re-read.',
        practice:
          'Each night, sit briefly before sleep and generate, in your own words, the wish that whatever recognition arises serve the awakening of all beings — and write the wish into the dream journal. If recognition arises in a dream, meet the dream figures with the compassion that would be appropriate toward beings in waking life.',
        prompt:
          'Develop a sustained argument about the relationship between bodhicitta and dream practice, integrating at least three traditions covered so far and articulating in your own words why the lineage treats compassion as the ground rather than as a decoration.',
        key_terms: ['bodhicitta', 'Mahayana', 'tonglen', 'lojong', 'Bodhicaryāvatāra', 'yidam'],
      },
      {
        num: '10',
        title: 'The Bardo Teachings',
        week: 'Week 10',
        objectives: [
          'Distinguish the chikai, chönyi, and sidpa bardos within the fuller six-bardo enumeration.',
          'Trace the dissolutions at the moment of dying and locate the clear light of death.',
          'Articulate the structural analogy between deep sleep and the post-dissolution state.',
          'Hold the bardo framework usefully without requiring belief in postmortem states.',
        ],
        primary_reading: 'Selections from the Bardo Thödol on the moment of dying and the clear light bardo.',
        secondary_reading: 'Trungpa or Gyurme Dorje commentary on the bardo of dharmatā; Sogyal Rinpoche, The Tibetan Book of Living and Dying, on the relevance of dream yoga to dying.',
        practice:
          'Sit for twenty-five minutes mid-week in silent contemplation of impermanence — without drama, without conclusion. Continue the dream journal with attention to any shifts in the felt quality of the dream-day boundary.',
        prompt:
          "Describe the relationship between dream practice and the moment of dying as the lineage understands it, and describe what this framework changes for you, if anything, in how you approach this week's practice.",
        key_terms: ['chikai bardo', 'chönyi bardo', 'sidpa bardo', 'dharmatā', 'clear light of death', 'impermanence'],
      },
    ],
  },
  {
    phase: 'VI',
    title: 'Integration',
    weeks: '11—12',
    focus:
      "The student designs a sustainable householder practice and reads the modern scientific literature on lucid dreaming with the lineage's framework intact, holding both registers without collapsing one into the other.",
    practices: ['Householder rhythm', 'Practice plan', 'Scientific literacy', 'Continuing review'],
    synthesis:
      "The closing phase asks how the practice carries. Module 11 is the honest one: a practice plan written for the student's actual life, not the idealized one, with frank attention to disrupted sleep, substances, and seasons of fragmentation. Module 12 returns to the Western scientific literature — LaBerge, MILD, WBTB, the clinical work on nightmare disorder — and reads it with the lineage intact, neither dismissed nor mistaken for the whole. The course ends, the practice does not.",
    modules: [
      {
        num: '11',
        title: 'Householder Practice',
        week: 'Week 11',
        objectives: [
          "Distinguish an idealized practice from the practice that survives the practitioner's actual life.",
          'Identify the three portable forms — bodhicitta, recognition of the dreamlike, intention before sleep — that travel into any conditions.',
          'Hold disrupted sleep, substances, and life seasons honestly without denial or self-flagellation.',
          'Produce a written practice plan sustainable for twelve months.',
        ],
        primary_reading: 'Tenzin Wangyal Rinpoche, the chapters on integration, re-read.',
        secondary_reading: 'Selected interviews and writings on householder practice (Pema Chödrön, Roshi Joan Halifax).',
        practice:
          'Inventory honestly which conditions in your current life support the practice and which impede it; what is changeable and what is not. Test a draft practice plan mentally against the past month and ask whether it would have survived the worst week.',
        prompt:
          'Write a detailed practice plan for the next twelve months, addressing the daily form of the practice, the dream journal, supports, response to fragmentation, and what aspects of life you intend to leave as they are.',
        key_terms: ['householder', 'wu wei', 'bodhicitta', 'REM suppression', 'integration', 'lojong'],
      },
      {
        num: '12',
        title: 'Modern Science',
        week: 'Week 12',
        objectives: [
          "Trace the modern scientific study of lucid dreaming from LaBerge's Stanford work onward.",
          'Evaluate MILD, WBTB, and the clinical literature on lucid dreaming therapy for nightmare disorder.',
          'Identify the framing limits — quality of awareness, bodhicitta, integration with path — that the science by its nature does not address.',
          'Articulate, at length, what twelve weeks of careful engagement have established for the student.',
        ],
        primary_reading: 'Stephen LaBerge, Exploring the World of Lucid Dreaming (1990), Chapters 1–2 and the chapters on induction techniques.',
        secondary_reading: 'Contemporary review article on the neuroscience of lucid dreaming; clinical literature on lucid dreaming therapy for nightmares (Krakow et al., Spoormaker et al.).',
        practice:
          'Continue the established nightly practice — intention, posture, journal — while drafting the final paper. Read the science as a competent road atlas of a country whose history and culture you have studied elsewhere; let the practice, not the technique log, be the measure.',
        prompt:
          'Write a sustained, integrative paper articulating what you have come to think, over twelve weeks of study, about dream practice as the Asian traditions have transmitted it and as it might be received in contemporary life.',
        key_terms: ['lucid dreaming', 'MILD', 'WBTB', 'REM', 'metacognition', 'polysomnography'],
      },
    ],
  },
];

export const library = [
  // Primary sources — chronological
  { type: 'Primary', title: 'Bṛhadāraṇyaka Upaniṣad', author: 'Anonymous', year: 'c. 700 BCE' },
  { type: 'Primary', title: 'Chāndogya Upaniṣad', author: 'Anonymous', year: 'c. 700 BCE' },
  { type: 'Primary', title: 'Māṇḍūkya Upaniṣad', author: 'Anonymous', year: 'c. 500 BCE' },
  { type: 'Primary', title: 'Zhuangzi (Inner Chapters)', author: 'Zhuang Zhou', year: 'c. 4th c. BCE' },
  { type: 'Primary', title: 'Milindapañha', author: 'attrib. Nāgasena', year: 'c. 1st c. BCE' },
  { type: 'Primary', title: 'Oneirocritica', author: 'Artemidorus of Daldis', year: 'c. 2nd c. CE' },
  { type: 'Primary', title: 'Viṃśatikā', author: 'Vasubandhu', year: 'c. 4th c. CE' },
  { type: 'Primary', title: 'Māṇḍūkya-Kārikā', author: 'Gauḍapāda', year: 'c. 7th c. CE' },
  { type: 'Primary', title: 'Fuṣūṣ al-Ḥikam', author: 'Ibn al-ʿArabī', year: 'c. 1229' },
  { type: 'Primary', title: 'Shōbōgenzō, "Mu chū setsu mu"', author: 'Dōgen', year: '1242' },
  { type: 'Primary', title: 'Bardo Thödol cycle', author: 'rev. Karma Lingpa', year: '14th c.' },
  { type: 'Primary', title: 'Les rêves et les moyens de les diriger', author: 'Hervey de Saint-Denys', year: '1867' },
  { type: 'Primary', title: 'A Study of Dreams', author: 'Frederik van Eeden', year: '1913' },
  { type: 'Primary', title: 'Studies in Dreams', author: 'Mary Arnold-Forster', year: '1921' },
  // Modern texts — chronological
  { type: 'Text', title: 'Exploring the World of Lucid Dreaming', author: 'LaBerge & Rheingold', year: '1990' },
  { type: 'Text', title: 'Dream Yoga and the Practice of Natural Light', author: 'Namkhai Norbu', year: '1992' },
  { type: 'Text', title: 'Sleeping, Dreaming, and Dying', author: 'Francisco Varela (ed.)', year: '1997' },
  { type: 'Text', title: 'The Tibetan Yogas of Dream and Sleep', author: 'Tenzin Wangyal Rinpoche', year: '1998' },
  { type: 'Text', title: 'Dreaming Yourself Awake', author: 'B. Alan Wallace', year: '2012' },
  { type: 'Text', title: 'Waking, Dreaming, Being', author: 'Evan Thompson', year: '2015' },
  { type: 'Text', title: 'Dream Yoga', author: 'Andrew Holecek', year: '2016' },
  { type: 'Text', title: 'When Brains Dream', author: 'Stickgold & Zadra', year: '2021' },
  // Papers — chronological
  { type: 'Paper', title: 'Lucid dreaming verified by volitional communication during REM sleep', author: 'LaBerge et al.', year: '1981' },
  { type: 'Paper', title: 'Lucid dreaming: a state of consciousness with features of both waking and non-lucid dreaming', author: 'Voss et al.', year: '2009' },
  { type: 'Paper', title: 'Neural correlates of dream lucidity obtained from contrasting lucid versus non-lucid REM sleep', author: 'Dresler et al.', year: '2012' },
  { type: 'Paper', title: 'Reality testing and the mnemonic induction of lucid dreams', author: 'Aspy et al.', year: '2017' },
  { type: 'Paper', title: 'Pre-sleep treatment with galantamine stimulates lucid dreaming', author: 'LaBerge, LaMarca & Baird', year: '2018' },
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

// About-page sub-sections — wired to footer "Index" links.
// Each is its own simple content page, reachable from the footer.
export const aboutPages = {
  colophon: {
    title: 'Colophon',
    kicker: 'On the Making of This Site',
    paragraphs: [
      'Svapna is built in the editorial-minimalist register: white field, hairline rules, no rounded edges, generous negative space. The visual language is meant to recede so the reading can come forward.',
      'Display type is set in Cormorant Garamond, a contemporary revival of the Garamond family by Christian Thalmann. Labels and metadata are set in JetBrains Mono. Roman numerals and editorial marks (Vol. I / Iss. I / MMXXVI) are set as-is in the display face.',
      'The site is a single-page React application, built with Vite and styled with Tailwind. Source is open at github.com/flintomm/svapna. Hosted on GitHub Pages, deployed automatically on each push to main. No analytics, no tracking, no advertising. Ever.',
    ],
  },
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
      'The course material draws principally from two primary texts: Swami Krishnananda’s 1968 lecture series on the Māṇḍūkya Upaniṣad (Divine Life Society), and Tenzin Wangyal Rinpoche’s The Tibetan Yogas of Dream and Sleep (Snow Lion, 1998), edited by Mark Dahlby. Both sources are gratefully acknowledged.',
      'Background research is grounded in the contemporary integrative literature: Francisco Varela ed., Sleeping, Dreaming, and Dying (1997); Evan Thompson, Waking, Dreaming, Being (2015); B. Alan Wallace, Dreaming Yourself Awake (2012); Andrew Holecek, Dream Yoga (2016); the lucid-dreaming research line from Stephen LaBerge through Voss, Dresler, and Aspy.',
      'The cross-tradition history was developed with reference to the standard scholarship in each field: Patrick Olivelle on the Upaniṣads; Brook Ziporyn on Zhuangzi; William Chittick on Ibn al-ʿArabī; Tanahashi on Dōgen; Nicholas Fry on Saint-Denys. Errors and infelicities in synthesis are ours.',
      'The site is built on the work of the open-source community: React, Vite, Tailwind CSS, and the typography projects already named. We owe each of them.',
    ],
  },
  contact: {
    title: 'Contact',
    kicker: 'Reach Us',
    paragraphs: [
      'For questions about the course, the source materials, or the project: open an issue at github.com/flintomm/svapna or write to hello@svapna.example. We read everything; replies arrive when they arrive.',
      'For corrections — typos, mistranslations, citation errors, mis-attributed lineages — please flag them. Accuracy matters more here than tone.',
      'For permission to translate, adapt, or republish material from this site: yes, in advance, under the terms outlined on the Support page. Please tell us what you made so we can link to it.',
    ],
  },
};
