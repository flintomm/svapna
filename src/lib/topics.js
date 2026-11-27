// Everyday topics and occasions, drawn from the same verified passages as the questions.
// A passage belongs to a topic when its own quoted words (or their translation) name it.
import { cards, questions } from './atlas.js';

const T = (slug, name, words, line) => ({ slug, name, re: new RegExp('\\b(' + words + ')', 'i'), line });
export const TOPICS = [
  T('love', 'love', 'love[ds]?\\b|loving|beloved|lover', 'What people have written about love, from the Song of Songs to the twentieth century.'),
  T('friendship', 'friendship', 'friend', 'On friends: what they are for, and what it is to be one.'),
  T('grief', 'grief', 'grief|griev|mourn|sorrow|weep|wept|lament|bereav|tears', 'On grief and mourning, in the words of people who lived through it.'),
  T('death', 'death', 'death|die[ds]?\\b|dying|dead\\b|grave\\b|mortal', 'On death and dying, across four thousand years.'),
  T('courage', 'courage', 'courag|brave|bravery|valou?r|fearless|coward', 'On courage and its absence.'),
  T('fear', 'fear', 'fear|afraid|dread|terror', 'On fear: what it is, and what to do with it.'),
  T('hope', 'hope', 'hope[ds]?\\b|hoping|hopeful|despair', 'On hope and despair.'),
  T('happiness', 'happiness', 'happy|happiness|joy\\b|joys\\b|joyful|content(ed|ment)\\b|bliss', 'On happiness and where it is found.'),
  T('suffering', 'suffering', 'suffer|pain\\b|pains\\b|misery|affliction|anguish', 'On suffering and pain.'),
  T('solitude', 'solitude', 'solitude|alone\\b|lonely|loneliness|solitary|hermit', 'On being alone.'),
  T('humility', 'humility', 'humble|humility|humiliat|pride\\b|proud|vanity|arrogan', 'On humility and pride.'),
  T('anger', 'anger', 'anger|angry|wrath|rage\\b|hatred|hate[ds]?\\b|revenge', 'On anger, hatred and revenge.'),
  T('wisdom', 'wisdom', 'wisdom|wise\\b|wiser|sage\\b|fool', 'On wisdom and folly.'),
  T('truth', 'truth', 'truth|true\\b|falsehood|lie\\b|lies\\b|deceiv', 'On truth and falsehood.'),
  T('knowledge', 'knowledge', 'knowledge|know\\b|knows\\b|knowing|ignoran|learn', 'On knowledge, learning and ignorance.'),
  T('freedom', 'freedom', 'freedom|free\\b|liberty|slave|slavery|bondage|chains', 'On freedom and bondage.'),
  T('fate', 'fate', 'fate[ds]?\\b|destiny|fortune|chance\\b|providence|decree', 'On fate, fortune and chance.'),
  T('desire', 'desire', 'desire|craving|lust|longing|appetite|passion', 'On desire and longing.'),
  T('wealth', 'wealth and poverty', 'wealth|riches|rich\\b|poor\\b|poverty|money|gold\\b', 'On wealth and poverty.'),
  T('time', 'time', 'time\\b|times\\b|years\\b|age\\b|old age|youth|eternity|moment', 'On time, youth and age.'),
  T('god', 'God', 'god\\b|gods\\b|lord\\b|heaven|divine|creator', 'On God, the gods and heaven.'),
  T('soul', 'the soul', 'soul|spirit\\b|spirits\\b|self\\b', 'On the soul and the self.'),
  T('mind', 'the mind', 'mind\\b|minds\\b|thought|reason\\b|heart\\b', 'On the mind, thought and the heart.'),
  T('virtue', 'virtue', 'virtue|virtuous|goodness|righteous|duty|honou?r', 'On virtue, duty and honour.'),
  T('justice', 'justice', 'justice|just\\b|unjust|injustice|law\\b|laws\\b', 'On justice and law.'),
  T('kindness', 'kindness', 'kind\\b|kindness|compassion|mercy|pity|charity|generos', 'On kindness, compassion and mercy.'),
  T('nature', 'nature', 'nature\\b|earth\\b|sea\\b|river|mountain|flower|tree', 'On nature and the earth.'),
  T('children', 'children and upbringing', 'child|children|son\\b|daughter|father|mother|born\\b|birth', 'On children, parents and upbringing.'),
  T('work', 'work', 'work\\b|works\\b|labou?r|toil|effort|idle', 'On work and effort.'),
  T('change', 'change', 'change|changing|impermanen|pass(es|ing)? away|fleeting|transien', 'On change and impermanence.'),
];
const seen = new Set();
const unique = cards.filter(c => { const k = c.name + '|' + c.excerpt; if (seen.has(k)) return false; seen.add(k); return true; });
const qOf = Object.fromEntries(questions.map(q => [q.id, q]));
const home = c => qOf[c.question || 'relationships'];
const text = c => (c.translation ? c.translation + ' ' : '') + (c.lang ? '' : c.excerpt);
export const topics = TOPICS.map(t => ({ ...t, passages: unique.filter(c => t.re.test(text(c))).map(c => ({ ...c, home: home(c) })).sort((a, b) => a.sortYear - b.sortYear) })).filter(t => t.passages.length >= 10);
export const short = c => (c.translation || c.excerpt).split(/\s+/).length;

// Occasions: short sets chosen by hand from passages both readers agreed on, across traditions.
const O = (slug, title, short_, line, ids) => ({ slug, title, short: short_, line, ids });
const byId = Object.fromEntries(cards.map(c => [c.id, c]));
export const occasions = [
  O('a-funeral', 'Words for a funeral or a memorial', 'A funeral', 'Short passages on death from many traditions. They do not agree about what follows it, so choose the ones that are true for the person being remembered.',
    ['kahlil-gibran-death', 'tiruvalluvar-death', 'quran-death', 'rumi-death', 'plato-death', 'emily-bronte-death', 'laozi-death', 'confucius-death', 'epicurus-death', 'zhuangzi-death', 'browning-death', 'koroa-of-mangaia-death', 'ila-informants-death', 'al-ghazali-death', 'epictetus-death', 'pyramid-texts-death']),
  O('someone-grieving', 'Words for someone who is grieving', 'Grief', 'Passages by people who knew sorrow and wrote about it plainly.',
    ['julian-aguon-suffering', 'oscar-wilde-suffering', 'web-du-bois-suffering', 'the-wanderer-solitude-or-company', 'bhagavad-gita-suffering', 'hafez-suffering', 'bahaullah-happiness', 'naupata-of-mangaia-death', 'koroa-of-mangaia-death', 'homer-suffering', 'browning-death', 'baki-free-will', 'jose-hernandez-suffering', 'cicero-suffering']),
  O('a-hard-time', 'Words for a hard time', 'A hard time', 'What people in many centuries said to themselves, and to each other, when things went badly.',
    ['epictetus-suffering', 'friedrich-nietzsche-suffering', 'geshe-chekawa-suffering', 'dalai-lama-suffering', 'ganda-proverbs-suffering', 'nabi-suffering', 'seneca-suffering', 'ashanti-proverbs-suffering', 'hafez-suffering', 'bhagavad-gita-suffering', 'isaiah-suffering', 'proverbs-suffering', 'julian-aguon-suffering', 'yoruba-proverbs-suffering']),
  O('a-graduation', 'Words for a graduation or a new start', 'A new start', 'Passages on making a life: on effort, learning and choosing.',
    ['amado-nervo-free-will', 'ben-zoma', 'swahili-proverbs-given-or-made', 'socrates-meaning', 'seneca-meaning', 'cj-dennis-meaning', 'horacio-quiroga-given-or-made', 'voltaire-meaning', 'frederick-douglass-given-or-made', 'casely-hayford-given-or-made', 'panchatantra-given-or-made', 'aristotle-given-or-made', 'johann-wolfgang-von-goethe-given-or-made', 'yuan-liaofan-free-will', 'james-lionel-michael-free-will', 'rabindranath-tagore-given-or-made']),
  O('a-friend', 'Words for a friend', 'A friend', 'On friendship and being together, for a card, a toast or a letter.',
    ['marcus-tullius-cicero-inward-or-others', 'proverbs', 'ben-sira-solitude-or-company', 'aristotle-inward-or-others', 'ibn-miskawayh-relationships', 'meng-haoran-solitude-or-company', 'william-cowper-solitude-or-company', 'panchatantra-self-or-others-first', 'rustaveli-self-or-others-first', 'rahman-baba-self-or-others-first', 'nandi-proverbs-solitude-or-company', 'book-of-psalms-solitude-or-company', 'kahlil-gibran-solitude-or-company', 'rabindranath-tagore-inward-or-others']),
  O('time-alone', 'Words for time alone', 'Time alone', 'On solitude, by people who chose it or made their peace with it.',
    ['yoshida-kenko', 'john-milton-solitude-or-company', 'wang-wei-solitude-or-company', 'liu-zongyuan-solitude-or-company', 'marban-solitude-or-company', 'ralph-waldo-emerson-solitude-or-company', 'johann-wolfgang-von-goethe-solitude-or-company', 'katherine-mansfield-solitude-or-company', 'william-hazlitt-solitude-or-company', 'blaise-pascal-solitude-or-company', 'charles-eastman', 'william-cowper-solitude-or-company', 'seneca-solitude-or-company', 'kate-chopin-solitude-or-company']),
  O('being-put-down', 'Words for when you have been put down', 'Being put down', 'On insult, mockery and being looked down on, from people who met it and kept their footing.',
    ['marcus-aurelius-humiliation', 'diogenes-the-cynic-humiliation', 'hong-yingming-humiliation', 'booker-t-washington-humiliation', 'liliuokalani-humiliation', 'confucius-humiliation', 'song-rongzi-humiliation', 'epictetus-humiliation', 'akkosa-sutta-humiliation', 'jane-austen-humiliation', 'wang-yangming-humiliation', 'thomas-hobbes-humiliation', 'john-cassian-humiliation']),
].map(o => ({ ...o, passages: o.ids.map(id => byId[id]).filter(Boolean).map(c => ({ ...c, home: home(c) })) }));
