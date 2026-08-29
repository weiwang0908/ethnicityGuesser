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
};

/**
 * 获取文章正文；slug 未注册时返回 undefined。
 */
export function getArticleContent(slug: string): BlogArticleContent | undefined {
  return ARTICLES[slug];
}
