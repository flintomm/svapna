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

// Per-module deepening: background essay, reader cross-links, annotated further
// reading, and theme links. Keyed by module.num. Drawn from the lesson plans
// + research files in /reference-material/.
export const moduleDeepening = {
  '01': {
    background:
      "The earliest Indian sources on dream do not ask what dreams mean — they ask what dream experience reveals about the structure of consciousness itself. The Vedic seers had already noted that the same person who walks abroad by day wanders elsewhere by night; the Bṛhadāraṇyaka's Yājñavalkya, in dialogue with King Janaka, made the more radical claim that the dreamer fashions the dream from impressions of the waking day. By the time of the Māṇḍūkya Upaniṣad, twelve compressed verses laid out a four-state schema — waking, dreaming, deep sleep, and the witnessing turīya — that would become the philosophical bedrock for almost every later Asian tradition of dream practice. The early Buddhist tradition approached the question more cautiously: the Milindapañha's Nāgasena distinguished four causes of dreams without granting them epistemic authority. What the student should hold this week is the distinction between the content of a dream and the awareness that knows it. That distinction, drawn carefully here, is what makes the rest of the course intelligible.",
    reader_passages: [
      { source: 'mandukya', section_id: 'mandukya_04', label: "Invocation and Verses — Krishnananda's reading of the twelve verses, pp. 9–14" },
      { source: 'mandukya', section_id: 'mandukya_06', label: 'The Individual and the Absolute — the four-state schema and its philosophical stakes, pp. 30–46' },
      { source: 'mandukya', section_id: 'mandukya_08', label: 'The Mystery of Dream and Sleep — Krishnananda on svapna and suṣupti, pp. 64–79' },
    ],
    further_reading: [
      { author: 'Olivelle, Patrick', title: 'The Early Upaniṣads: Annotated Text and Translation (Oxford, 1998)', note: "The standard scholarly translation, indispensable for the Bṛhadāraṇyaka's Book IV — the Yājñavalkya–Janaka dialogue that is the foundational Indian text on dream-construction." },
      { author: "Doniger O'Flaherty, Wendy", title: 'Dreams, Illusion, and Other Realities (Chicago, 1984)', note: 'The canonical comparative study; chapters 1–3 establish the broader Indian background within which the Māṇḍūkya sits.' },
      { author: 'Fort, Andrew', title: 'The Self and Its States: A States of Consciousness Doctrine in Advaita Vedānta (Motilal Banarsidass, 1990)', note: 'Traces the four-state model from its Upaniṣadic emergence through its Advaita Vedānta systematization, useful for seeing how the schema was elaborated by the later tradition.' },
      { author: 'Anacker, Stefan, trans.', title: 'Seven Works of Vasubandhu (Motilal Banarsidass, 1984)', note: "Includes the Viṃśatikā, in which Vasubandhu deploys dream as the central illustration of the Yogācāra claim that experience is appearance-only." },
      { author: 'Kapstein, Matthew', title: "Reason's Traces: Identity and Interpretation in Indian and Tibetan Buddhist Thought (Wisdom, 2001)", note: "Chapter 5 reads Vasubandhu's dream-argument with philosophical care and bridges the Indian sources to the Tibetan inheritance." },
    ],
    theme_links: ['four_states_of_consciousness', 'om_pranava', 'witness_consciousness_atman'],
  },
  '02': {
    background:
      "Dream yoga reaches Tibet in the eighth century with the Indian tantric master Padmasambhava and the early-translation (snga 'gyur) lineages, and arrives within a framework that subordinates the dream-state to a much larger map of consciousness — the six bardos, the intermediate states through which awareness passes between waking, sleeping, meditative absorption, and the moment of death. What the student needs to grasp this week is not yet the technical practice, but the framing within which the practice will later be received: the bardos are structurally analogous, dream is one of them, and the skill cultivated in the dream-bardo is continuous with the skill needed at the moment of dying. The Nyingma tradition, descended from the early transmission, develops this framing within a Dzogchen view in which dream is treated less as something to be controlled than as a display of rigpa — naked awareness — to be recognized and rested in. Tenzin Wangyal's introductory chapters open the door to that view; the question to chew on is why dream practice would be taken so seriously, in this tradition, that it became a rehearsal for death.",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_05_chapter', label: "Dream and Reality — Tenzin Wangyal's opening on the parity of waking and dream" },
      { source: 'tibetan_yogas', section_id: 'tibetan_06_chapter', label: 'How Experience Arises — the construction of experience in waking and dream' },
      { source: 'tibetan_yogas', section_id: 'tibetan_16_chapter', label: 'Vision, Action, Dream, Death — the four bardo-analogous states framing dream practice' },
    ],
    further_reading: [
      { author: 'van Schaik, Sam', title: 'Tibet: A History (Yale, 2011)', note: 'The best one-volume political and religious history of Tibet, providing essential context for the institutional development of the dream-yoga lineages.' },
      { author: 'Tulku Thondup', title: 'Hidden Teachings of Tibet: An Explanation of the Terma Tradition of the Nyingma School (Wisdom, 1986)', note: "Definitive treatment of the terma tradition, including the mind-treasures (dgongs gter) received in dream that distinguish the Tibetan transmission." },
      { author: 'Snellgrove, David', title: 'Indo-Tibetan Buddhism (Shambhala, 2003 [orig. 1987])', note: 'The classic scholarly history of the transmission from India to Tibet; rich on the early tantric origins of the dream-yoga inheritance.' },
      { author: 'Dudjom Rinpoche', title: 'The Nyingma School of Tibetan Buddhism: Its Fundamentals and History, trans. Dorje and Kapstein (Wisdom, 1991)', note: 'The encyclopedic Nyingma history; the most authoritative source available in English for the lineage Padmasambhava founds.' },
    ],
    theme_links: ['four_states_of_consciousness', 'rigpa_kunzhi', 'bardo_death'],
  },
  '03': {
    background:
      "The Bön tradition is institutionally distinct from Tibetan Buddhism but has been in conversation with it for over a millennium, and the careful contemporary scholarship treats their dream-yoga literatures as parallel developments rather than derivatives. Bön traces itself to Tonpa Shenrab Miwoche, a buddha-figure said to have taught a complete dharma-system in the Zhang Zhung region long before Śākyamuni. Whatever the historical core, the textual lineage is real and ancient, and includes a Mother Tantra (Ma rgyud) tradition that is the direct source of Tenzin Wangyal Rinpoche's presentation. What the Bön Dzogchen stream contributes — and what makes it the right teacher this week — is its emphasis on the practice of natural light: the recognition that there is, beneath the noise of dreaming, a clarity that has always been present, and that the practitioner's task is not to produce lucidity but to stop obscuring what is already luminous. The four foundational practices and the practice of zhiné (calm abiding) build the platform; the energy body and the chakras provide the substrate; the recognition of mind's nature is the goal toward which the whole edifice tilts.",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_07_chapter', label: 'The Energy Body — channels, prāṇa, and the substrate of dream awareness' },
      { source: 'tibetan_yogas', section_id: 'tibetan_09_chapter', label: 'Images from the Mother Tantra — the Bön framing of dream practice' },
      { source: 'tibetan_yogas', section_id: 'tibetan_17_chapter', label: 'Calm Abiding: Zhiné — the foundation practice that anchors dream-yoga' },
      { source: 'tibetan_yogas', section_id: 'tibetan_18_chapter', label: 'Four Foundational Practices — the Bön preliminary work' },
    ],
    further_reading: [
      { author: 'Namkhai Norbu', title: 'Dream Yoga and the Practice of Natural Light (Snow Lion, revised 2002)', note: 'The foundational modern Dzogchen text in English on dream and natural-light practice; pairs naturally with Tenzin Wangyal as a second lineage view.' },
      { author: 'Kvaerne, Per', title: 'The Bon Religion of Tibet: The Iconography of a Living Tradition (Shambhala, 1995)', note: 'Scholarly history of the Bön tradition, providing the institutional framework within which the Mother Tantra material sits.' },
      { author: 'Karmay, Samten', title: 'The Great Perfection: A Philosophical and Meditative Teaching of Tibetan Buddhism (Brill, 1988)', note: 'Comparative Buddhist/Bön Dzogchen treatment by the senior scholar in this area; dense but rewarding for the philosophical foundations.' },
      { author: 'Tenzin Wangyal Rinpoche', title: 'Wonders of the Natural Mind (Snow Lion, 2000)', note: "Tenzin Wangyal's broader Bön Dzogchen presentation, providing context for the dream-yoga material that the Module 3 reading focuses on." },
      { author: 'Wallace, B. Alan', title: "Stilling the Mind: Shamatha Teachings from Düdjom Lingpa's Vajra Essence (Wisdom, 2011)", note: "Most direct contemporary Western treatment of the zhiné practice that anchors Tenzin Wangyal's Part Three." },
    ],
    theme_links: ['energy_body_chakras', 'rigpa_kunzhi', 'sleep_yoga_clear_light', 'obstacles'],
  },
  '04': {
    background:
      "Chinese dream-thinking moves on a different axis than the Indian. Where the Upaniṣadic tradition asks what dream is, the early Daoist sources — beginning with Zhuangzi's butterfly passage in the fourth century BCE — locate the interesting question in the transformation between states rather than in the truth-status of either. The butterfly does not argue that dream is real or unreal; it disturbs the practitioner's confidence that the boundary between Zhuang Zhou and the butterfly is fixed in the way the boundary-drawer supposes. The Liezi, several centuries later, develops the framework of spirit-cultivation (shen-xiu) in which waking practice shapes dream and dream-state feeds back into waking cultivation — a bidirectional model that Indian and Tibetan traditions do not quite parallel. Japanese Buddhist sources add a third register: Myōe Kōben's nearly forty-year dream diary, the locus classicus of treating dream as continuous with waking practice; and Dōgen's Mu chū setsu mu, in which the dream is not a category opposed to reality but the activity through which buddha-nature expresses itself. What the comparative essay this week asks of the student is to feel the texture of frameworks that arrive at related conclusions through genuinely different starting points.",
    reader_passages: [],
    further_reading: [
      { author: 'Ziporyn, Brook, trans.', title: 'Zhuangzi: The Complete Writings (Hackett, 2020)', note: 'The best contemporary rendering of the Zhuangzi, with notes that illuminate the butterfly passage and its central position in world dream-philosophy.' },
      { author: 'Tanabe, George', title: "Myōe the Dreamkeeper: Fantasy and Knowledge in Early Kamakura Buddhism (Harvard, 1992)", note: "The standard scholarly study of Myōe's Yume no Ki, with translations of substantial selections from the longest sustained pre-modern dream diary." },
      { author: 'Tanahashi, Kazuaki, ed.', title: "Treasury of the True Dharma Eye: Zen Master Dōgen's Shōbōgenzō (Shambhala, 2010)", note: "The standard contemporary translation; the fascicle Mu chū setsu mu is the locus classicus of Dōgen's dream-philosophy and the right anchor for the comparative essay." },
      { author: 'Kohn, Livia', title: 'Sitting in Oblivion: The Heart of Daoist Meditation (Three Pines, 2010)', note: "The senior Daoist studies scholar's synthesis of meditation traditions, with substantial treatment of the Zhuangzi-Liezi background and later neidan developments." },
      { author: 'Kawai, Hayao', title: 'The Buddhist Priest Myōe: A Life of Dreams (Lapis, 1992)', note: "Jungian reading of the Yume no Ki by Japan's most prominent twentieth-century analytical psychologist; the framing is sometimes anachronistic but the intimacy with the material produces real insights." },
    ],
    theme_links: ['dream_yoga_practice', 'illusory_body_emptiness', 'witness_consciousness_atman'],
  },
  '05': {
    background:
      "The Six Yogas of Naropa are the technical core of Tibetan dream yoga as the Kagyu tradition transmits it. Synthesized in the eleventh century from the Indian mahāsiddha Tilopa's teachings and systematized by Naropa, they arrive in Tibet through Marpa the Translator and become, through Milarepa and Gampopa, one of the most institutionally stable bodies of contemplative instruction in the Tibetan canon: inner heat (tummo), illusory body (sgyu lus), dream (rmi lam), clear light ('od gsal), bardo, and transference ('pho ba). The six are not independent practices but a single integrated arc, and dream yoga sits at the center of it — drawing on inner heat below it and opening into clear light above it. What the student should hold this week is the staged structure of the practice itself: recognition first (knowing the dream as dream), then transformation (changing dream-content to demonstrate its mental nature), then illusion (seeing through the dream's apparent solidity from within it), then meditation on the dream's suchness. The text the practitioner studies is Tenzin Wangyal's Part Three; the secondary literature, especially Mullin and Holecek, fills in the Kagyu and Geluk technical vocabulary that the Bön presentation does not always foreground.",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_19_chapter', label: 'Preparation for the Night — the evening sequence preceding dream-yoga' },
      { source: 'tibetan_yogas', section_id: 'tibetan_20_chapter', label: 'The Main Practice — the staged practice of dream yoga proper' },
      { source: 'tibetan_yogas', section_id: 'tibetan_21_chapter', label: 'Lucidity — what recognition looks like and what stabilizes it' },
      { source: 'tibetan_yogas', section_id: 'tibetan_25_chapter', label: 'Integration — how dream practice extends into the rest of life' },
    ],
    further_reading: [
      { author: 'Mullin, Glenn, trans.', title: "Tsongkhapa's Six Yogas of Naropa (Snow Lion, 2005)", note: 'The standard accessible scholarly treatment of the Geluk recension; rigorous on the technical vocabulary that the popular literature often elides.' },
      { author: 'Mullin, Glenn, trans.', title: "The Six Yogas of Naropa: Tsongkhapa's Commentary (Snow Lion, 1996)", note: 'Companion volume; together with the Tsongkhapa volume, the most complete English access to the staged structure of the practice.' },
      { author: 'Khenchen Thrangu Rinpoche', title: 'Journey of the Mind: Putting the Teachings on the Bardo into Effective Practice (Namo Buddha, 2002)', note: 'Clear contemporary teaching on dream and sleep yoga from a senior Kagyu lineage holder; less technical than Mullin, more practical.' },
      { author: 'Holecek, Andrew', title: 'Dream Yoga: Illuminating Your Life Through Lucid Dreaming and the Tibetan Yogas of Sleep (Sounds True, 2016)', note: 'Course secondary reading; the most accessible contemporary integration of the Six Yogas tradition with the Western lucid-dreaming literature.' },
      { author: 'Chang, Garma C.C.', title: 'The Six Yogas of Naropa and Teachings on Mahamudra (Snow Lion, 1986)', note: 'Older but useful second translation; the comparison with Mullin illuminates interpretive choices that shape how the practice is received.' },
    ],
    theme_links: ['dream_yoga_practice', 'lucidity_in_dream', 'obstacles', 'energy_body_chakras'],
  },
  '06': {
    background:
      "Illusory body practice is the daytime side of the night practice the previous module introduced. Where dream yoga asks the practitioner to recognize the dream while in it, illusory body asks the practitioner to recognize waking experience as having the same constructed character — not in a dismissive or skeptical way, but in the precise sense Vasubandhu's Viṃśatikā had argued centuries earlier and Gauḍapāda's Kārikā had defended: the apparent solidity of waking objects is no firmer than the apparent solidity of dream objects, and the conviction we have of waking-reality is a function of being in waking-state rather than of waking-state being more real than dream. The practice is not a philosophical exercise. It is a sustained reorientation of attention through the day — treating one's reflection in a mirror, one's voice on a recording, the apparent solidity of the body and its environment as illusory in the technical Buddhist sense (māyā, sgyu ma). What this prepares is the recognition that, by the time the practitioner is dreaming, will be required without effort. The week's review of the practice journal asks the student to notice whether the day has begun to soften — whether what was felt as solid at the start of the course is felt as somewhat more permeable now.",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_05_chapter', label: 'Dream and Reality — the parity argument and its illusory-body application' },
      { source: 'tibetan_yogas', section_id: 'tibetan_22_chapter', label: 'The Obstacles — what blocks recognition in dream and in waking practice' },
      { source: 'tibetan_yogas', section_id: 'tibetan_23_chapter', label: 'Controlling and Respecting Dreams — the discipline of the daytime view' },
      { source: 'tibetan_yogas', section_id: 'tibetan_24_chapter', label: 'Simple Practices — daytime exercises that build the illusory-body capacity' },
    ],
    further_reading: [
      { author: 'Holecek, Andrew', title: 'Dreams of Light: The Profound Daytime Practice of Lucid Dreaming (Sounds True, 2020)', note: "Holecek's companion volume to Dream Yoga, focused on the daytime illusory-body practice; the most extended contemporary treatment in English." },
      { author: 'Lusthaus, Dan', title: 'Buddhist Phenomenology: A Philosophical Investigation of Yogācāra Buddhism (Routledge, 2002)', note: 'The most thorough corrective to the simplified consciousness-only reading of Yogācāra; provides the philosophical infrastructure that makes illusory-body practice intelligible as more than metaphor.' },
      { author: 'Young, Serenity', title: 'Dreaming in the Lotus: Buddhist Dream Narrative, Imagery, and Practice (Wisdom, 1999)', note: 'Broader cultural history of Buddhist dream traditions; useful for situating the illusory-body framing within the wider Mahāyāna inheritance.' },
      { author: 'Hillman, James', title: 'The Dream and the Underworld (Harper, 1979)', note: 'The principal post-Jungian re-framing of dream as a domain in its own right rather than a code; a useful Western counterpoint that resonates unexpectedly with the illusory-body view.' },
    ],
    theme_links: ['illusory_body_emptiness', 'dream_yoga_practice', 'karma_traces'],
  },
  '07': {
    background:
      "Sleep yoga is the practice the contemplative tradition takes most seriously and the modern lucid-dreaming literature handles least well. Where dream yoga cultivates awareness within dream content, sleep yoga cultivates awareness in the dreamless state — the suṣupti the Chāndogya Upaniṣad first treated as evidentially significant, the kunzhi (alaya) of the Bön and Nyingma Dzogchen traditions, the clear light ('od gsal) of the Six Yogas. The claim the tradition makes is precise: the dreamless state is not absence; it is awareness without object, and that awareness is cultivable. The practitioner who can rest in clear light during deep sleep has access to a stratum of mind that ordinary waking and dreaming both cover over. The Mandukya's account of suṣupti, paired with Tenzin Wangyal's Part Four and Five, gives the student the philosophical vocabulary and the practice instructions together. What this week asks is not that the student succeed at the practice — sleep yoga proper takes years — but that the student begin to register the difference between the absence of objects (which sleep produces routinely) and the awareness that knows the absence (which the practice trains). The distinction is small. Almost everything the deep tradition does sits on it.",
    reader_passages: [
      { source: 'mandukya', section_id: 'mandukya_09', label: 'Consciousness and Sleep — Krishnananda on suṣupti as a state of awareness, pp. 80–85' },
      { source: 'tibetan_yogas', section_id: 'tibetan_27_chapter', label: 'Sleep and Falling Asleep — the transition into clear light' },
      { source: 'tibetan_yogas', section_id: 'tibetan_28_chapter', label: 'Three Kinds of Sleep — the typology of sleep states' },
      { source: 'tibetan_yogas', section_id: 'tibetan_33_chapter', label: 'Sleep Practice — the main sleep-yoga practice from Part Five' },
    ],
    further_reading: [
      { author: 'Wallace, B. Alan', title: 'Dreaming Yourself Awake: Lucid Dreaming and Tibetan Dream Yoga for Insight and Transformation (Shambhala, 2012)', note: 'The single most-developed contemplative-scientific bridge text; particularly strong on the sleep-yoga and clear-light material that lucid-dreaming literature typically ignores.' },
      { author: 'Thompson, Evan', title: 'Waking, Dreaming, Being: Self and Consciousness in Neuroscience, Meditation, and Philosophy (Columbia, 2015)', note: 'The most rigorous contemporary philosophical treatment of the four states, including a careful engagement with the question of awareness in dreamless sleep.' },
      { author: 'Varela, Francisco, ed.', title: 'Sleeping, Dreaming, and Dying: An Exploration of Consciousness with the Dalai Lama (Wisdom, 1997)', note: "Records the 1992 Mind and Life dialogue; the Dalai Lama's discussion of sleep yoga and clear light is the most accessible primary-source statement of the tradition's most advanced claim." },
      { author: 'Namkhai Norbu', title: 'Dream Yoga and the Practice of Natural Light (Snow Lion, revised 2002)', note: "Dzogchen treatment of the dreamless-state practice as natural light; pairs naturally with Tenzin Wangyal's Part Four." },
    ],
    theme_links: ['sleep_yoga_clear_light', 'four_states_of_consciousness', 'rigpa_kunzhi', 'witness_consciousness_atman'],
  },
  '08': {
    background:
      "Daoist sleep cultivation arrives at the dreamless state from a different starting point. Where the Indian and Tibetan traditions analyze the structure of consciousness and treat sleep as one of its states, the Daoist tradition treats the body as the site of cultivation and the night as one of the principal periods in which the three treasures — jing (essence), qi (vital energy), and shen (spirit) — are refined or dissipated. The neidan (inner alchemy) tradition that crystallizes in the Tang and Song dynasties develops a precise framework for what happens in sleep: the natural flow in which jing descends and is lost, qi dissipates outward, and shen fragments into ordinary thought is reversed (ni), so that jing returns to qi, qi to shen, and shen to xu, emptiness. Chen Tuan, the great sleep-immortal of Mount Hua, is the figure around whom the developed sleep-cultivation tradition organizes; his Twenty-Four Sleep Exercises, preserved in the Quanzhen Daoist lineage, pair specific bodily postures with specific contemplative orientations across the night. What the student should notice this week is the bidirectional structure: waking practice shapes dream-state, dream-state feeds back into waking cultivation, and the embryo of immortality (shengtai) — the inner-alchemical product the practice gestates — develops in the territory between them.",
    reader_passages: [],
    further_reading: [
      { author: 'Wong, Eva', title: 'Cultivating Stillness: A Taoist Manual for Transforming Body and Mind (Shambhala, 1992)', note: "Foundational Quanzhen Daoist meditation text translated with extensive introductions; the right entry point for the framework within which Chen Tuan's sleep tradition operates." },
      { author: 'Liu Kuan Yu', title: 'Taoist Yoga: Alchemy and Immortality (Weiser, 1973)', note: 'Older translation of neidan materials including the Chen Tuan sleep tradition; uses Wade-Giles throughout, but contains technical sleep-cultivation literature available nowhere else in English.' },
      { author: 'Kohn, Livia', title: 'Sitting in Oblivion: The Heart of Daoist Meditation (Three Pines, 2010)', note: "The senior Daoist studies scholar's synthesis of meditation traditions, with substantial treatment of sleep practices and the broader contemplative framework." },
      { author: 'Robinet, Isabelle', title: 'Taoist Meditation: The Mao-shan Tradition of Great Purity (SUNY, 1993)', note: 'Scholarly account of early Daoist contemplative practice, providing the prehistory from which the later neidan sleep traditions emerge.' },
    ],
    theme_links: ['sleep_yoga_clear_light', 'energy_body_chakras', 'dream_yoga_practice'],
  },
  '09': {
    background:
      "The mid-course paper sits where it does — at the threshold between practice that has been individually motivated and practice that requires a wider orientation — because the tradition itself places bodhicitta at this point. Bodhicitta is the awakening mind, the mind that turns toward the welfare of all beings rather than toward its own attainments. The traditions that take dream practice most seriously are unanimous on this: dream-yoga without bodhicitta as its ground is, in the technical Buddhist sense, not dream-yoga at all. It is technique without substance. The reasons given are several. Dream practice without compassionate motivation tends to ossify into self-cultivation projects that lose their depth at exactly the point where depth is required. The phenomena it produces — vivid lucid dreams, the flexible mastery of dream-content, even early access to clear light — become acquisitions rather than openings. And the practice's deeper applications, in the bardo and in the moment of dying, draw on the same orientation of heart that bodhicitta names. Tenzin Wangyal's chapters on chöd and on the integration of practice with daily life, together with Krishnananda's reading of the universal Vaiśvānara, offer two routes into the same recognition: the practitioner is not the only one in the room.",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_13_chapter', label: 'Discovery of Chöd — Machig Labdrön and the offering of the dream-body' },
      { source: 'tibetan_yogas', section_id: 'tibetan_14_chapter', label: 'Two Levels of Practice — relative and ultimate, and bodhicitta as the ground' },
      { source: 'mandukya', section_id: 'mandukya_07', label: 'The Universal Vaiśvānara — Krishnananda on the universal dimension of waking awareness, pp. 47–63' },
      { source: 'mandukya', section_id: 'mandukya_10', label: 'The God of the Universe — the universal in the personal, pp. 86–91' },
    ],
    further_reading: [
      { author: 'Shantideva', title: 'The Way of the Bodhisattva (Bodhicaryāvatāra), trans. Padmakara Translation Group (Shambhala, 2006)', note: 'The classical Indian Mahāyāna text on bodhicitta; the philosophical and devotional foundation that the Tibetan dream-yoga tradition presupposes.' },
      { author: 'Goleman, Daniel', title: 'Destructive Emotions: A Scientific Dialogue with the Dalai Lama (Bantam, 2003)', note: 'Mind and Life dialogue on emotions; provides important context for the broader project of contemplative-scientific dialogue on the question of compassion.' },
      { author: 'Pema Chödrön', title: 'The Places That Scare You: A Guide to Fearlessness in Difficult Times (Shambhala, 2001)', note: 'Contemporary teaching on bodhicitta in a Western register that pairs naturally with the chöd material introduced in the week\'s reading.' },
      { author: 'Halifax, Joan', title: 'Standing at the Edge: Finding Freedom Where Fear and Courage Meet (Flatiron, 2018)', note: 'A senior Western Zen teacher\'s treatment of compassion as the ground of practice; useful for the integration the mid-course paper asks the student to perform.' },
    ],
    theme_links: ['compassion_bodhicitta', 'dream_yoga_practice', 'witness_consciousness_atman'],
  },
  '10': {
    background:
      "The bardo teachings are the framing within which the Tibetan tradition takes dream practice with the seriousness it does. The six bardos — birth-and-life, dream, meditative absorption, dying, dharmatā, and becoming — are structurally analogous: six instances of awareness presented with appearances that may or may not be recognized as productions of mind. The skill required to navigate one is the skill required to navigate the others. This is the claim that gives dream-yoga its weight. It is not principally about producing lucid dreams. It is about cultivating, in a state available every night, the recognition that will be required at the moment of dying, when the conditions are far less favorable. Karma Lingpa's fourteenth-century terma cycle — known in the West as the Tibetan Book of the Dead — is the classical text. The convergence with the Sufi 'ālam al-mithāl, the imaginal world Ibn al-ʿArabī treats as a real ontological domain between the spiritual and the material, is one of the great unexplored comparative questions. What the student should hold this week is not the metaphysical content of the bardo doctrine but its practical force: this practice, taken seriously, is preparation for what every practitioner will eventually face.",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_29_chapter', label: 'Sleep Practice and Dream Practice — the relationship between nightly practice and the bardo' },
      { source: 'tibetan_yogas', section_id: 'tibetan_42_chapter', label: 'Mind and Rigpa — the awareness that survives the transition' },
      { source: 'tibetan_yogas', section_id: 'tibetan_43_chapter', label: 'The Base: Kunzhi — the substrate that the bardo teachings address' },
    ],
    further_reading: [
      { author: 'Padmasambhava (Karma Lingpa terma)', title: 'The Tibetan Book of the Dead: First Complete Translation, trans. Gyurme Dorje (Penguin, 2005)', note: 'The most complete contemporary English translation of the Bardo Thödol cycle; replaces the older Evans-Wentz and Fremantle/Trungpa versions for serious study.' },
      { author: 'Sogyal Rinpoche', title: 'The Tibetan Book of Living and Dying (HarperOne, 1992)', note: 'The most influential contemporary presentation of the bardo teachings for Western readers; integrates dream yoga and the moment of dying within a single contemplative arc.' },
      { author: 'Corbin, Henry', title: "Creative Imagination in the Sufism of Ibn 'Arabi (Princeton, 1969)", note: "The foundational Western treatment of the 'ālam al-mithāl, the Sufi imaginal world that converges with the bardo as a real ontological domain between material and spiritual reality." },
      { author: 'Chittick, William', title: "The Sufi Path of Knowledge: Ibn al-'Arabi's Metaphysics of Imagination (SUNY, 1989)", note: 'The most accessible scholarly engagement with Ibn al-ʿArabī in English; pairs with Corbin to open the comparative question with the bardo.' },
      { author: 'Halifax, Joan', title: 'Being with Dying: Cultivating Compassion and Fearlessness in the Presence of Death (Shambhala, 2008)', note: "Contemporary integration of contemplative training with end-of-life care; the practical descendant of the bardo tradition's claim that practice prepares for dying." },
    ],
    theme_links: ['bardo_death', 'rigpa_kunzhi', 'sleep_yoga_clear_light', 'compassion_bodhicitta'],
  },
  '11': {
    background:
      "The contemporary Western practitioner is doing the practice in conditions the tradition was not designed for. The Tibetan student of three centuries ago was a monastic, with a teacher, a regular schedule, a community of fellow practitioners, and a long arc of preliminary practice before approaching dream-yoga. The contemporary practitioner is typically none of these things — householder, working adult, often a parent, with sleep that is interrupted, mornings that are rushed, evenings that are full. What this module asks is not that the student find the conditions the tradition assumes but that they make the practice fit the conditions they actually have. The traditional sources, read carefully, support this. Tenzin Wangyal's Integration chapters insist that the practice is not an event in the day but a quality of attention through it; the Daoist tradition's bidirectional model treats waking practice and night practice as a single cycle; the chöd lineage explicitly addresses the practice in non-monastic life. The practice plan the student writes this week is not a schedule. It is a working answer to the question the tradition keeps asking and the contemporary student has to keep answering: what would it look like, in this life, to take this practice seriously for the next ten years?",
    reader_passages: [
      { source: 'tibetan_yogas', section_id: 'tibetan_25_chapter', label: 'Integration — the practice as a quality of attention through the day' },
      { source: 'tibetan_yogas', section_id: 'tibetan_38_chapter', label: 'Integration (sleep practice) — sustaining the practice across the cycle' },
      { source: 'tibetan_yogas', section_id: 'tibetan_39_chapter', label: 'Continuity — the long arc of practice across years' },
      { source: 'tibetan_yogas', section_id: 'tibetan_37_chapter', label: 'Supportive Practices — what makes the practice sustainable' },
    ],
    further_reading: [
      { author: 'Wallace, B. Alan', title: 'The Attention Revolution: Unlocking the Power of the Focused Mind (Wisdom, 2006)', note: "Wallace's practical framework for contemplative practice in non-monastic contexts; the foundation on which his dream-yoga work assumes the householder is standing." },
      { author: 'Morley, Charlie', title: 'Dreams of Awakening: Lucid Dreaming and Mindfulness of Dream and Sleep (Hay House, 2013)', note: 'Contemporary teacher trained in the Tibetan tradition who presents an accessible integration of practice with modern life; especially useful for the practical scaffolding.' },
      { author: 'Tenzin Wangyal Rinpoche', title: 'Spontaneous Creativity: Meditations for Manifesting Your Positive Qualities (Hay House, 2018)', note: 'Recent accessible work that deploys contemporary framings extensively while remaining rooted in the Bön tradition; demonstrates how the lineage adapts to contemporary householder conditions.' },
    ],
    theme_links: ['dream_recall_journaling', 'dream_yoga_practice', 'obstacles', 'karma_traces'],
  },
  '12': {
    background:
      "The modern scientific era arrives late to a tradition the contemplatives have been working in for two and a half millennia. Aserinsky and Kleitman's 1953 discovery of REM sleep made the dreaming brain visible in the laboratory; Hearne's 1975 demonstration at Hull, and LaBerge's independent 1980 verification at Stanford, established that the lucid dreamer can communicate volitionally from inside a dream — confirming, from the outside, what the contemplative traditions had always known from inside. The subsequent half-century has filled in the picture: the gamma-band signature of lucid dreaming (Voss et al. 2009), the dorsolateral prefrontal correlates (Dresler et al. 2012), the metacognitive infrastructure (Filevich et al. 2015), the comparative effectiveness of induction techniques (Aspy et al. 2017), the pharmacological enhancement with galantamine (LaBerge et al. 2018), the clinical applications for nightmare disorder. What the final paper asks of the student is to read this literature with the lineage intact — to recognize what the science has confirmed, what the contemplative tradition has refined in the science, and where the two genuinely diverge. The reductive view that lucid dreaming is the goal is the one most readily transmitted by the popular literature and the one the tradition most consistently corrects. The middle position — the practice taken seriously without naive reception, the science engaged without the loss of the tradition's depth — is what the course has been training the student, twelve weeks, to occupy.",
    reader_passages: [],
    further_reading: [
      { author: 'LaBerge, Stephen, and Howard Rheingold', title: 'Exploring the World of Lucid Dreaming (Ballantine, 1990)', note: 'The course primary reading for this module; the foundational accessible synthesis of the LaBerge research program and the entry point to the modern scientific era.' },
      { author: 'Thompson, Evan', title: 'Waking, Dreaming, Being: Self and Consciousness in Neuroscience, Meditation, and Philosophy (Columbia, 2015)', note: 'The most rigorous contemporary philosophical treatment of the four states; the book that most successfully holds the contemplative and scientific framings together without collapsing one into the other.' },
      { author: 'Stickgold, Robert, and Antonio Zadra', title: 'When Brains Dream: Exploring the Science and Mystery of Sleep (Norton, 2021)', note: 'The most recent accessible scientific synthesis; includes substantial coverage of lucid dreaming and the contemporary therapeutic applications.' },
      { author: 'Solms, Mark', title: 'The Hidden Spring: A Journey to the Source of Consciousness (Norton, 2021)', note: 'The most recent major synthesis from a clinical-neurological perspective; engages dreams centrally as part of a broader theory of consciousness that the contemplative tradition is well-positioned to converse with.' },
      { author: 'Saint-Denys, Hervey de', title: 'Dreams and How to Guide Them, trans. Nicholas Fry (Duckworth, 1982; orig. French 1867)', note: 'The foundational text of the modern Western dream-cultivation tradition; the methods Saint-Denys describes anticipate nearly every modern lucid-dreaming induction technique and remain worth reading first-hand.' },
    ],
    theme_links: ['lucidity_in_dream', 'dream_yoga_practice', 'sleep_yoga_clear_light', 'dream_recall_journaling'],
  },
};

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
