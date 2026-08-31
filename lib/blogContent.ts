import postsData from "@/data/blog-posts.json";
import phenotypesData from "@/data/phenotypes.json";

/**
 * Blog 数据类型（与 data/blog-posts.json 一致）。
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingMinutes: number;
  image_url: string;
  image_alt: string;
  relatedPhenotypes: string[];
}

/** 全部文章（按日期倒序） */
export const allBlogPosts: BlogPost[] = (postsData as BlogPost[]).sort((a, b) =>
  b.date.localeCompare(a.date)
);

/** 按 slug 查找单篇文章 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return allBlogPosts.find((p) => p.slug === slug);
}

/** 分类标签 → 展示名 */
export const CATEGORY_LABELS: Record<string, string> = {
  genetics: "Genetics",
  phenotypes: "Phenotypes",
  history: "History",
};

/**
 * 文章关联的 phenotype 完整数据（供内链卡渲染）。
 */
interface PhenotypeRef {
  slug: string;
  name: string;
  region: string;
  description: string;
}

export function getRelatedPhenotypes(post: BlogPost): PhenotypeRef[] {
  const all = phenotypesData as PhenotypeRef[];
  return post.relatedPhenotypes
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is PhenotypeRef => Boolean(p));
}

/**
 * 文章正文内容模型：小节（H2）由标题 + 段落 + 可选要点列表组成，
 * 文末可附 FAQ。正文存于代码库内容模块，MVP 不引入 MDX 管线
 * （spec：新增文章 = 数据条目 + 内容模块 + git commit）。
 */
export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogArticleContent {
  sections: BlogSection[];
  faq?: BlogFaqItem[];
}

/** slug → 正文内容 */
const ARTICLES: Record<string, BlogArticleContent> = {
  "why-northern-europeans-have-light-eyes": {
    sections: [
      {
        heading: "One Mutation, One Ancestor",
        paragraphs: [
          "Every blue-eyed person alive today appears to descend from a single common ancestor. In 2008, a team at the University of Copenhagen led by Hans Eiberg showed that blue-eyed individuals from places as far apart as Denmark, Turkey, and Jordan all carry the same variant — rs12913832 — sitting on the same stretch of DNA around it. That shared genetic background, or haplotype, is the signature of a founder mutation: one change that happened once, in one person, and then spread.",
          "The mutation itself is strikingly small. It does not damage a gene; it is a single letter change in a regulatory region of HERC2, right next to OCA2 on chromosome 15. OCA2 is one of the most important pigment genes in the body — when it fails completely, the result is albinism. This variant simply turns OCA2 down, and studies of iris pigmentation suggest it can cut melanin production in the iris by as much as fivefold. The change likely occurred between roughly 6,000 and 10,000 years ago, probably somewhere in or near the Black Sea region, at the dawn of the Neolithic.",
          "The allele behaves mostly like a recessive trait: it usually takes two copies, one from each parent, for blue eyes to appear. Today its frequency peaks around the Baltic — in Estonia and Finland, large majorities of the population carry light eyes — and falls off steadily with distance from that corner of Europe.",
        ],
      },
      {
        heading: "Why Blue Eyes Are Actually Not Blue",
        paragraphs: [
          "There is no blue pigment in a blue eye. The color comes from physics. The iris contains melanin, which absorbs incoming light, and a mesh of collagen fibers in the stroma, which scatter it. Short wavelengths — the ones we perceive as blue — scatter most strongly. In a dark brown iris, abundant melanin absorbs the light before scattering matters. In a blue iris, melanin is so sparse that the scattering wins, and the eye returns blue light to the viewer.",
          "It is the same mechanism, Rayleigh scattering, that makes the sky look blue. Green and hazel eyes sit in between: some melanin, some scattering, sometimes with a yellowish lipochrome pigment shifting the mixture toward green. Brown was the original human setting — the ancestral condition our species carried out of Africa — and it remains the global default by a wide margin.",
        ],
      },
      {
        heading: "What Ancient DNA Reveals",
        paragraphs: [
          "Sequencing ancient skeletons has rewritten this story twice over. Hunter-gatherers who lived in Germany, Scandinavia, and the eastern Baltic shortly after the last ice age were, by some counts, half or more blue-eyed — yet their skin was still relatively dark. Light eyes, in other words, are older in Europe than light skin. The combination of dark hair, dark-ish skin, and blue eyes that Mesolithic genomes show is one no living population matches today.",
          "Then farming arrived. Anatolian farmers who spread into Europe from the southeast carried brown eyes (and lighter skin), and for a few thousand years the blue-eye variant diluted across much of the continent. Later migrations from the steppe, plus renewed selection, appear to have pushed light eyes back up in the north. When Homer mentions glaucos eyes in Greek poetry, blue eyes were already old news in the Baltic. The full picture is still debated — some researchers argue for earlier, glacial origins of the variant — but the broad arc holds: one mutation, repeatedly reshuffled by migration, and almost certainly amplified by selection rather than chance alone.",
        ],
      },
      {
        heading: "Why Did It Spread? The Competing Theories",
        paragraphs: [
          "A trait that offers no obvious survival advantage should not go from one individual to half a continent in a few hundred generations. That is the puzzle of light eyes, and there are three main candidate answers.",
        ],
        bullets: [
          "Sexual selection: The oldest and best-known hypothesis, argued by Peter Frost in 2006, notes that Europe's hair and eye colors are unusually diverse for one region — the signature of selection that favors rare, attention-grabbing variants in mate choice. Ice-age hunting conditions may have skewed sex ratios and intensified competition, giving striking colors an edge.",
          "A self-reinforcing loop: A 2025 paper by Paola Bressan proposes that blue eyes spread like a peacock's tail — a 'greenbeard' effect. People who find blue eyes attractive preferentially mate with blue-eyed partners and, because eye color is visible at birth, may invest more in blue-eyed children. Preference and trait reinforce each other, accelerating the spread.",
          "Drift and demography: Small, partially isolated post-glacial populations could carry the variant to high frequency by chance. Most researchers treat drift as a helper, not the whole story, because the speed and geographic pattern of the spread argue for something stronger.",
        ],
      },
      {
        heading: "The Vitamin D Explanation - and Why It Fails",
        paragraphs: [
          "The popular answer — that pale eyes let in more light in dim northern latitudes, like skin lightening for vitamin D — does not survive scrutiny. Eyes do not synthesize vitamin D; that happens in skin. If anything, the trade-off runs the other way: pale irises block bright and ultraviolet light worse than dark ones, and light eyes are associated with somewhat higher light sensitivity and risk of certain eye conditions. Whatever pushed blue eyes to Baltic frequencies, it was not eyesight.",
          "That asymmetry is exactly why most current explanations land on social rather than ecological selection. A mutation with a mild health cost that spread anyway was probably valued, consciously or not, by the people who carried it and the people who chose them as partners.",
        ],
      },
      {
        heading: "What Light Eyes Are Not",
        paragraphs: [
          "One regulatory SNP is not an identity. It says nothing about the rest of a person's genome, their ancestry in general, or who they are. Most genetic variation in northern Europe is shared with the rest of the world — the light-eye variant is one conspicuous exception, not the tip of some deeper divergence. It is a reminder that the features our eyes latch onto are a thin, unrepresentative slice of human variation.",
          "That is also how the quiz on this site treats it. In the phenotype catalogue, light eyes are one recorded trait of historical European populations like the Aisto Nordid — a description of a distribution roughly 1,500 years ago, not a statement about any person playing the game today.",
        ],
      },
    ],
    faq: [
      {
        question: "Are blue eyes going extinct?",
        answer: "No. The variant is mostly recessive, so it can hide in carriers for generations, and recessive alleles fade very slowly even under mixing. Frequencies are gradually declining in populations with high migration and intermarriage, but 'extinct' — a claim that circulates every few years — misreads how recessive inheritance works.",
      },
      {
        question: "Can two brown-eyed parents have a blue-eyed child?",
        answer: "Yes. If both parents carry one copy of the rs12913832 blue-eye allele, each child has roughly a one-in-four chance of inheriting two copies and having blue eyes. Eye color also involves other loci, which is why the simple Punnett-square story sometimes fails.",
      },
      {
        question: "Do blue eyes see differently?",
        answer: "People with light eyes tend to be more sensitive to bright light and glare, and some studies find slightly elevated risks of UV-related eye conditions. The differences are small and say nothing about visual acuity.",
      },
    ],
  },
  "what-is-a-phenotype-not-a-race": {
    sections: [
      {
        heading: "A Word Invented to End a Confusion",
        paragraphs: [
          "The word phenotype is barely a century old. It was coined around 1909 by the Danish botanist Wilhelm Johannsen, who wanted a clean split between two things his era kept muddling: the hereditary material an organism carries — the genotype — and the observable traits it actually shows — the phenotype. Johannsen's distinction seems obvious now, but it was radical then. It severed the visible from the inherited, and it created the vocabulary modern genetics still runs on.",
          "The term landed in a field that needed it badly. Nineteenth-century anthropology had spent decades sorting humanity into 'types' and 'races' based on faces and skulls, treating appearance as a direct readout of biological essence. The genotype-phenotype distinction broke that assumption: what you see on the outside is the product of genes, environment, and development tangled together — not a transparent window into the bloodline.",
        ],
      },
      {
        heading: "What Counts as a Phenotype",
        paragraphs: [
          "A phenotype is any observable characteristic of an organism: height, skin tone, hair form, eye color, skull proportions, blood type, disease resistance. The key points are three.",
        ],
        bullets: [
          "Genes plus environment: The same genotype produces different phenotypes in different conditions — human height, for example, has risen across whole countries as nutrition improved, without any genetic change.",
          "Polygenic: Most visible human traits are shaped by many genes at once, plus their interactions. Eye color is unusually simple; nearly everything else is not.",
          "Statistical, not absolute: A phenotype describes tendencies across a population, not a rule every member follows. Individual variation within any group dwarfs the average differences between groups.",
        ],
      },
      {
        heading: "Where the Historical Catalogue Comes From",
        paragraphs: [
          "The 240 phenotypes referenced by this site come from the typological anthropology of the nineteenth and twentieth centuries — researchers like Eickstedt, Lundman, and Biasutti, who compiled named types such as Nordid, Huanghoid, and Bantuid, each with a described face, a set of traits, and a geographic center of distribution. We keep the catalogue as what it is: a historical record of how trained observers documented visible variation, anchored to distributions from roughly 1,500 years ago.",
          "The honest framing also states the catalogue's limits. It was assembled before genetics could check it, from samples that were small and uneven, by observers working inside their own era's assumptions. Some types blend into their neighbors; some entries contradict each other. It is a useful map of documented appearance patterns, not a genetic census.",
        ],
      },
      {
        heading: "Why a Phenotype Is Not a Race",
        paragraphs: [
          "The distinction matters because race, as a biological category, fails empirically — and phenotypes are precisely where people most often mistake description for division. Two findings anchor this.",
          "First: clines, not categories. In a 1962 essay, the biological anthropologist Frank Livingstone wrote that 'there are no races, only clines.' A cline is a gradual geographic gradient in the frequency of a trait or gene. Skin tone darkens along a smooth gradient from the poles toward the equator; the sickle-cell trait follows malaria's map; the blue-eye variant fades outward from the Baltic. Each trait has its own gradient, pointing its own direction — and that is the problem for race as a category. A classification system needs boundaries; human variation is a patchwork of overlapping slopes.",
          "Second: variation is local. In 1972, Richard Lewontin measured genetic diversity across human populations using the protein markers available at the time and found that about 85.4 percent of human genetic variation exists within populations — within a village, within a so-called race — while only about 6.3 percent separates the major geographic regions. Two neighbors are, on average, more genetically different from each other than two continents' averages are from each other. Later genomic work has refined the numbers, but the shape of the result has held.",
          "What this means is simple: the traits our eyes are wired to notice — face shape, skin tone, hair — are a small, unrepresentative sample of the genome, tuned hard by selection in different environments, while the rest of our genes say we are one recently-expanded, thoroughly mixed species. A phenotype catalogue describes that visible surface. It cannot carve the species into kinds, because no such carving exists.",
        ],
      },
      {
        heading: "How to Read the Game",
        paragraphs: [
          "This is why Ethnicity Guesser is a geography quiz and not an identity tool. The composite faces in the game are statistical averages of documented appearance patterns; guessing where a pattern was historically common is a challenge in regional knowledge, in the same family as flag quizzes and map games. The score measures how well you know a 1,500-year-old distribution map — not anything about yourself.",
          "It is also why every page on this site carries the same disclaimer: phenotypes describe historical appearance patterns, not modern nationality, DNA ancestry, or personal identity. You can use a face to practice geography. You cannot use it to sort people into races — and neither could the anthropologists whose catalogue we preserve. For how we source and correct entries, see the editorial policy.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a phenotype the same as an ethnicity?",
        answer: "No. Ethnicity is a social and cultural identity — language, heritage, community. A phenotype is a bundle of observable physical traits with a documented historical distribution. One country contains many phenotypes, and one phenotype can span many countries and ethnic groups.",
      },
      {
        question: "Can a DNA test tell me my phenotype?",
        answer: "Not reliably in both directions. Your DNA influences your visible traits, but ancestry and appearance are only loosely coupled: a person genetically matched to one region can look like another, and vice versa. If you want your genetic ancestry, take a DNA test; this site estimates nothing about you.",
      },
      {
        question: "Why are the distributions from 1,500 years ago?",
        answer: "The historical typologies we preserve were assembled before modern migration and intermarriage reshaped populations. Anchoring to roughly 500 CE keeps the map stable and honest about what it is — a historical reconstruction, not a snapshot of any living population.",
      },
    ],
  },
  "the-evolutionary-story-behind-andean-faces": {
    sections: [
      {
        heading: "A Face Built for Thin Air",
        paragraphs: [
          "Stand at 4,000 meters in the Peruvian highlands and the air carries roughly 60 percent of the oxygen it does at sea level. The body that has lived there for generations responds in ways that are profoundly physical—larger chest volume, more red blood cells, a higher density of capillaries in the lungs. What is easier to miss, because it is slower and silent, is that the skull itself was part of the same negotiation.",
          "The face of the highland Andes tends to be moderately broad, with high cheekbones, a nose that is often relatively broad at the base, and a rounded, domed cranial vault that many older anthropologists called Andid. This is not a random shape. A rounder, fuller vault concentrates heat close to the head in a cold, high-altitude setting, and a somewhat broad, flat profile pads the face against frostbite in a way a thin, narrow face does not. It is the same logic that gives Arctic populations long, cold-relaying noses and sinuses—a face is partly a climate instrument, and the Andes wrote their own prescription into it.",
          "That was the framework of the old typological literature, which treated the Andid face as a stable adaptation to the puna, the cold high plain above the tree line. The catalogue this site preserves keeps that description, anchored to roughly 1,500 years ago, precisely because it is a useful record of what trained observers documented—not because it explains every face you might meet in Cusco or La Paz today.",
        ],
      },
      {
        heading: "Deeper Than the Face: Oxygen Genetics",
        paragraphs: [
          "Modern genomics has found the real signature of Andean adaptation, and it is not in the cheekbones. A variant in the gene EPAS1—the same gene famously altered in Tibetans—is common in highland Andean populations and helps regulate the body's response to low oxygen. There are also striking changes in genes involved in heart-remodeling and vascular tone, because blood that carries more oxygen also moves more sluggishly and demands a heart that can handle it.",
          "The striking point is that Tibetans and Andeans hit very similar solutions independently. They are separated by thousands of years of history and tens of thousands of kilometers; their ancestors diverged long before either reached a high plateau. Yet both turned on overlapping genetic machinery to solve the same problem. Convergent adaptation on this scale is a reminder of how powerfully environment sculpts the human body—and how much of that sculpting happens beneath the skin, invisible to the typologist who only measures a head.",
        ],
      },
      {
        heading: "Thousands of Years of High-Altitude Living",
        paragraphs: [
          "People have lived in the Andes longer than almost anywhere else at this altitude. Archaeologists have found evidence of human occupation in highland caves more than 10,000 years ago, and by 4,000 to 5,000 years ago populations were farming potatoes and quinoa and living permanently above 3,500 meters. That is not a blink of evolutionary time, but it is long enough for selection to act on a trait that matters for survival—and for generations to be shaped, face and all, by the thin air.",
          "There is a bias to note here. Cities like La Paz sit above 3,600 meters, so modern high-altitude Andean populations are heavily represented in high-environment samples. But the Andes are a tilted staircase, not a single step. Coastal Peru is desert at sea level; the eastern slopes drain into the Amazon basin. People move up and down that staircase, and a valley community at 2,500 meters is not genetically or morphologically a carbon copy of a puna village at 4,200. As in most of the world, a region is a gradient, not a single stamp.",
        ],
      },
      {
        heading: "The Complications After 1492",
        paragraphs: [
          "No discussion of the Andes can ignore the last five centuries, because the region's faces bear the record of it. The Spanish conquest brought large-scale forced migration, disease that devastated highland populations, and centuries of mixing between Indigenous peoples, Europeans, and the African-descended populations who were brought to work in mines and plantations. The result is that modern Andean populations are, on average, a mixture—with Indigenous ancestry concentrated roughly in proportion to altitude. A community on the altiplano may share 85 percent or more of its ancestry with pre-Columbian Indigenous groups; a coastal cosmopolitan city may have a very different profile.",
          "This matters for how we read any historical catalogue. A phenotype named for its highland center describes a distribution that was truer several centuries ago than it is today, and the Andid entries here are best understood as describing the Indigenous highland pattern, not the full genetic reality of any modern country. The disclaimer that runs across this site applies nowhere more than here: we describe historical appearance patterns, not modern nationality or identity.",
          "None of this makes a composite of the Andes 'wrong.' It makes it a tool with a date stamp—a map of where a certain documented face used to be common, not a verdict on who lives there now. That distinction is the whole point of the project, and it is worth repeating in the middle of a story about mountains and blood.",
        ],
      },
      {
        heading: "What the Andid Entries Record",
        paragraphs: [
          "The catalogue breaks the Andean pattern into subtypes—North Andid, Central Andid, South Andid—that reflect the old typologists' sense of regional shading rather than hard genetic boundaries. The borders between these subtypes are exactly where the classification system is most artificial, and also most useful as a historical document: it shows us how observers of the 1800s and early 1900s carved a complex, continuous geography into diagrammable units.",
          "Read that way, the Andid entries are not a cage for a living population. They are a preserved notation—a V1 of a sketch that modern genetics has redrawn, with far more nuance, but with the same broad conclusion: the highlands shaped the people who stayed in them, in the face and below it, in ways we can still measure and understand.",
        ],
      },
      {
        heading: "A Measurement, Not a Judgment",
        paragraphs: [
          "It is easy to slip from 'this face was common in a place 1,500 years ago' to 'these people are this phenotype,' and the second sentence is exactly the kind of claim this site refuses to make. A phenotype is a statistical tendency in a historical sample—a Central Andid composite is an average of documented faces, not a mold that any individual must fit. Genetically, highland Andeans share most of their genome with people everywhere else; the adaptations that stand out are a handful of oxygen genes, not a whole separate category of human.",
          "So when you guess the Andes in the quiz and get it right, what you have correctly recognized is a historical landscape—the cold, high, inwardly-turned face of the mountains as recorded by the people who catalogued it. You have not classified a person, and no composite face on this site is meant to let you. That is what makes it a game about geography, and why it can stay one.",
        ],
      },
    ],
    faq: [
      {
        question: "Why do highland faces look rounder than lowland ones?",
        answer: "Cold and hypoxia select for faces that conserve heat and pad sensitive tissue: a fuller cranial vault, broader cheekbones, and a thicker facial mask. It is the same environmental logic seen in Arctic populations, expressed differently at altitude.",
      },
      {
        question: "Is Andean adaptation the same as Tibetan adaptation?",
        answer: "Remarkably similar in effect but independently evolved. Both populations carry changes around the EPAS1 oxygen-regulating gene, but the specific variants differ because the two lineages reached their highlands separately. Convergent evolution, not shared descent.",
      },
      {
        question: "Does being Andid say anything about someone's DNA identity?",
        answer: "No. The phenotype catalogue describes documented appearance patterns from roughly 1,500 years ago. Modern Andean people are genetically mixed, and the entrance is a small set of altitude-adaptation genes—not a category that maps onto any modern identity.",
      },
    ],
  },
  "how-average-face-composites-are-made": {
    sections: [
      {
        heading: "The Photograph Is Not the Face",
        paragraphs: [
          "Every face you see in the quiz is built from many faces, not one. The process starts with a plain confession: no single photograph can represent a population. One person's nose, one person's brow, one person's scar and smile all arrive in the frame by accident. To describe a pattern, you need to strip away the accidents—which is precisely what an average face does.",
          "An average (or composite) face is created by aligning a set of individual photographs so that their features sit on top of one another, then averaging the shape and the shading at every point. Done well, the result is a face no one exactly has, one that reads as 'generic' because it is literally the center of a cluster of real faces. This is the same technique the nineteenth-century polymath Francis Galton experimented with when he exposed several portraits onto a single photographic plate, hoping to distill a 'type.' The modern computer version is vastly cleaner, but the idea is Galton's.",
        ],
      },
      {
        heading: "Align, Average, Repeat",
        paragraphs: [
          "The technical recipe has four steps, and the first two determine everything.",
        ],
        bullets: [
          "Collect: gather a sample of faces that share the quality you care about—in this project, a documented phenotype from a defined historical region. Sample size and consistency matter more than almost anything else.",
          "Align: mark each photo with matching reference points—the pupils, the tip of the nose, the corners of the mouth. The software deforms every face to a common grid so that the nose of one sits on the nose of another. Wrong alignment means a blurry, unrecognizable mess.",
          "Average shape: take the mean position of every landmark across all faces. This produces a single, undistorted geometry—the 'average skull,' so to speak.",
          "Average texture: warp each original photo to that average shape, then blend the pixel colors. Smoothing out lighting differences yields the final, eerily calm composite.",
        ],
      },
      {
        heading: "Why an Average Face Looks So Attractive",
        paragraphs: [
          "People are strikingly consistent in rating composite faces as more attractive than most of the individual faces that went into them. The effect is partly cosmetic—averaging removes asymmetries, blemishes, and the small deviations that make a face distinctive. It is also partly perceptual: our visual system implicitly compares a face to an internal average, so a face close to the average of its category simply registers as 'normal,' and normal reads as pleasing.",
          "That is a virtue and a warning for anything built on composites. The smooth, appealing face that emerges is a statistical center, and it inevitably flatters the group it describes. A composite of a given phenotype looks a bit better, a bit calmer, than any one of its members. Keeping that in mind stops us from treating the image as a portrait of a real person—it is a diagram drawn in light.",
        ],
      },
      {
        heading: "What Composites Can and Cannot Show",
        paragraphs: [
          "Composites are powerful exactly because they compress a noisy sample into a single legible image. They can reveal a population's central facial architecture—relative brow size, cheekbone prominence, nose width, jaw shape—at a glance, the way an average of spoken sentences would reveal a language's grammar.",
          "But their limits are the same as any average. They hide diversity: a group made of half very-broad and half very-narrow faces averages into a medium face that no one has. They carry whatever bias the sample carried: a set of faces photographed in one town, or drawn from the athletes of one era, quietly smuggles that town or era into the 'average.' And they can never tell you who any particular person is. For all these reasons, the composites here are presented as what they are—historical reconstructions of catalogued appearance patterns—rather than as specimens of living people.",
        ],
      },
      {
        heading: "From Photographs to the Quiz",
        paragraphs: [
          "Our workflow leans on existing, carefully assembled phenotype data rather than starting from raw photos for every entry. Where source photographs are available and licensed, we build composites from them using the align-and-average method above; where they are not, we generate consistent avatar-style faces programmatically from the documented physical traits of each phenotype, using the same coordinate-space logic so that every entry sits on the same mental grid.",
          "That consistency is the quiet work of the project. A Hallstatt composite and an Aisto Nordid composite must be comparable—same gaze, same lighting, same neutral expression—or the whole comparison collapses into a pile of inconsistent apples and oranges. Standardizing the pipeline is what lets a player glance at a face and think 'Europe,' not 'that one photograph was brighter,' and a game built on such an intuition needs its inputs to be as fair as the scoring.",
        ],
      },
      {
        heading: "An Average Is an Argument, Not a Verdict",
        paragraphs: [
          "A composite face is an argument about what a group's center of gravity looks like—an honest, useful, and limited kind of claim. It is not a verdict about any individual, and it is not a statement that a group is 'really' one face. The whole reason this site needs composites at all is that the underlying truth is diversity: phenotypes are statistical tendencies with documented historical distributions, and an average is the cleanest way to draw a tendency.",
          "When you play the quiz, you are reading those drawings. You guess where a central tendency was historically common, and the satisfaction is in recognizing a pattern on a map—not in labeling a person. An average made fair, presented honestly, is one of the best teaching tools in anthropology: it shows that every group centers somewhere, and that nowhere does a single face tell the whole story.",
        ],
      },
    ],
    faq: [
      {
        question: "Is an average face a real person?",
        answer: "No. It is the statistical center of a sample of aligned faces—a shape and a texture that no single person has. Reading it as a portrait would be like treating the mean of a set of heights as one particular height everyone has.",
      },
      {
        question: "Can an average hide differences within a group?",
        answer: "Always. Averaging erases variation by design: a group split between broad-faced and narrow-faced members will average into a medium face nobody matches. That is why composites describe centers, never capture individuals.",
      },
      {
        question: "How is a fair composite made?",
        answer: "By keeping every input in the sample, aligning them consistently, and standardizing lighting and expression so one face isn't visually louder than another. Fair io composites let a viewer compare patterns rather than photography accidents.",
      },
    ],
  },
};

/**
 * 获取文章正文；slug 未注册时返回 undefined。
 */
export function getArticleContent(slug: string): BlogArticleContent | undefined {
  return ARTICLES[slug];
}
