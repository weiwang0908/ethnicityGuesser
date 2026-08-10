import countriesData from "@/data/countries.json";

/**
 * Country 数据类型（与 data/countries.json 一致）。
 */
export interface Country {
  id: string;
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  image_url: string;
  description: string;
  source_url: string;
}

/** 全部 48 个 country（按数据文件原始顺序） */
export const allCountries: Country[] = countriesData as Country[];

/**
 * 按 slug 查找单个 country。
 */
export function getCountryBySlug(slug: string): Country | undefined {
  return allCountries.find((c) => c.slug === slug);
}

/**
 * 选取同 region 的相关 country（排除当前，最多 count 个，按字母顺序）。
 * 不足时按字母顺序补齐其他 region 的 country 到 max(count, 3)。
 */
export function getRelatedCountries(current: Country, count = 5): Country[] {
  const same = allCountries
    .filter((c) => c.region === current.region && c.slug !== current.slug)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (same.length >= count) {
    return same.slice(0, count);
  }
  const result = [...same];
  const others = allCountries
    .filter((c) => c.region !== current.region && c.slug !== current.slug)
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const o of others) {
    if (result.length >= Math.max(count, 3)) break;
    result.push(o);
  }
  return result.slice(0, Math.max(count, 3));
}

/**
 * 每国简要事实（用于内容生成，使每页内容自然可读且不机械）。
 * population/ethnicGroups/languages/history/culture 均为短句片段，
 * 在生成器中拼成完整段落，避免一望而知的填空感。
 */
interface CountryFacts {
  capital: string;
  population: string;
  languages: string;
  ethnicGroups: string;
  history: string;
  culture: string;
}

const FACTS: Record<string, CountryFacts> = {
  austria: {
    capital: "Vienna",
    population: "approximately 9 million",
    languages: "German (Austrian variety)",
    ethnicGroups:
      "an Austrian German majority alongside Turkish, German, Hungarian, Slovene, Croatian, and Bosnian minorities",
    history:
      "Austria stood at the heart of the Habsburg monarchy and later the Austro-Hungarian Empire, shaping Central European politics for centuries before becoming a small republic after 1918. The 1955 State Treaty restored full sovereignty and declared lasting neutrality.",
    culture:
      "Vienna's musical heritage from Mozart, Strauss, and Mahler remains globally influential, while coffeehouse culture and alpine folk traditions define everyday life.",
  },
  bangladesh: {
    capital: "Dhaka",
    population: "approximately 170 million",
    languages: "Bengali (Bangla)",
    ethnicGroups:
      "a Bengali majority of roughly 98 percent, with Chakma, Marma, Garo, Manipuri, Mro, and other indigenous peoples concentrated in the Chittagong Hill Tracts",
    history:
      "Bengal was a prosperous hub of trade and the Bengal Sultanate before passing under Mughal and then British rule. The 1947 Partition created East Pakistan, which won independence as Bangladesh through the 1971 Liberation War.",
    culture:
      "Bengali literature, Rabindra Sangeet, Pohela Boishakh new year festivities, and a rice-and-fish culinary core shape a distinct regional identity across the Ganges delta.",
  },
  belgium: {
    capital: "Brussels",
    population: "approximately 11.7 million",
    languages: "Dutch (Flemish), French, and German",
    ethnicGroups:
      "Flemish and Walloon communities alongside a large foreign-born population from France, the Netherlands, Italy, Morocco, Romania, and Turkey",
    history:
      "Belgium sat at the crossroads of Spanish, Austrian, French, and Dutch rule before independence in 1830. It became a founding member of the European institutions now hosted in Brussels.",
    culture:
      "Flemish painting from Van Eyck to Rubens, comic art, Trappist brewing, chocolate, and a federal political model built around language communities.",
  },
  brazil: {
    capital: "Brasília",
    population: "approximately 215 million",
    languages: "Portuguese (Brazilian variety)",
    ethnicGroups:
      "a multiracial population of White, Brown (mixed), Black, Indigenous, and Asian Brazilians, with the largest Afro-descendant community outside Africa and a large Italian, German, Japanese, and Lebanese heritage",
    history:
      "Portugal colonized Brazil from 1500, importing millions of enslaved Africans and displacing Indigenous nations. Independence arrived in 1822 as an empire, transitioning to a republic in 1889 and to democracy in 1985.",
    culture:
      "Carnival, samba, bossa nova, capoeira, futebol, candomblé, and Afro-Brazilian cuisine reflect deep African, Indigenous, and European syncretism.",
  },
  china: {
    capital: "Beijing",
    population: "approximately 1.41 billion",
    languages: "Mandarin Chinese (Putonghua) plus many regional varieties",
    ethnicGroups:
      "a Han Chinese majority of about 91 percent together with 55 officially recognized minority nationalities such as Zhuang, Hui, Manchu, Uyghur, Miao, Yi, Tujia, Tibetan, and Mongol",
    history:
      "China's continuous civilization stretches from the Shang and Zhou dynasties through the Qin unification, Han, Tang, Song, Yuan, Ming, and Qing empires, foreign incursions in the 19th century, the 1911 republic, and the 1949 founding of the People's Republic.",
    culture:
      "Confucian ethics, Daoist and Buddhist philosophy, calligraphy, tea ceremony, regional cuisines from Sichuan to Cantonese, and festivals tied to the lunar calendar.",
  },
  "czech-republic": {
    capital: "Prague",
    population: "approximately 10.5 million",
    languages: "Czech",
    ethnicGroups:
      "a Czech majority with Slovak, Vietnamese, Ukrainian, Russian, and Roma minorities",
    history:
      "The medieval Kingdom of Bohemia passed to Habsburg rule, joined Czechoslovakia in 1918, survived Nazi occupation and Communist rule, and split peacefully with Slovakia in 1993.",
    culture:
      "Prague's Gothic and Baroque skyline, the brewing tradition of Pilsner, Dvořák and Smetana's music, and a strong literary heritage from Kafka to Hrabal.",
  },
  denmark: {
    capital: "Copenhagen",
    population: "approximately 5.9 million",
    languages: "Danish",
    ethnicGroups:
      "a Danish majority with Turkish, Polish, Syrian, German, Romanian, and Iraqi minorities",
    history:
      "Viking Age Denmark unified the realm around the 10th century, later ruling England, Norway, and parts of the Baltic. Constitutional monarchy developed from 1849, and the welfare state took shape in the 20th century.",
    culture:
      "Nordic design, Hans Christian Andersen's fairy tales, hygge, New Nordic cuisine, and a strong cycling culture.",
  },
  egypt: {
    capital: "Cairo",
    population: "approximately 110 million",
    languages: "Arabic (Egyptian dialect)",
    ethnicGroups:
      "an Egyptian majority with Bedouin, Nubian, Berber (Amazigh), Beja, and Dom communities",
    history:
      "Pharaonic civilization along the Nile gave rise to one of the world's earliest states, followed by Greek, Roman, Coptic Christian, and Islamic periods. Modern Egypt emerged from the 1952 revolution ending the monarchy.",
    culture:
      "Al-Azhar scholarship, Coptic Christianity, Egyptian cinema and Arabic music, Nile cuisine, and the literary tradition of Naguib Mahfouz.",
  },
  ethiopia: {
    capital: "Addis Ababa",
    population: "approximately 120 million",
    languages: "Amharic plus Oromo, Tigrinya, Somali, Afar, and many others",
    ethnicGroups:
      "more than 80 ethnic groups including Oromo, Amhara, Tigray, Somali, Sidama, Gurage, Wolayta, Afar, and Hadiya",
    history:
      "Ethiopia's Aksumite and later Solomonic Christian kingdoms resisted European colonization except for the 1936–1941 Italian occupation, preserving an ancient state tradition. The 1974 revolution ended the monarchy and the 1991 transition introduced ethnic federalism.",
    culture:
      "Ethiopian Orthodox Christianity, the Ge'ez script, injera cuisine, long-distance running, and a distinctive coffee origin tradition.",
  },
  finland: {
    capital: "Helsinki",
    population: "approximately 5.5 million",
    languages: "Finnish and Swedish",
    ethnicGroups:
      "a Finnish majority with Swedish-speaking Finns, Sami in Lapland, and Estonian, Russian, Iraqi, and Somali minorities",
    history:
      "Finland moved from Swedish rule to a Russian Grand Duchy in 1809, declared independence in 1917, fought the Winter and Continuation Wars, and built a Nordic welfare state.",
    culture:
      "The sauna, Sibelius's music, the Kalevala epic, Moomin stories, design from Marimekko and Alvar Aalto, and education.",
  },
  france: {
    capital: "Paris",
    population: "approximately 68 million",
    languages: "French",
    ethnicGroups:
      "a French population shaped by Breton, Occitan, Corsican, Basque, and Alsatian regional identities alongside large communities of North African, Sub-Saharan African, Indochinese, and Caribbean heritage",
    history:
      "From the Frankish kingdom through the 1789 Revolution and Napoleonic Empire, France shaped modern European politics, secularism (laïcité), and republican ideals across multiple republics.",
    culture:
      "Haute cuisine, wine regions from Bordeaux to Champagne, Impressionist and avant-garde art, cinema, philosophy, and high fashion.",
  },
  germany: {
    capital: "Berlin",
    population: "approximately 84 million",
    languages: "German",
    ethnicGroups:
      "a German majority with Turkish, Polish, Syrian, Romanian, Italian, Greek, and Croatian communities",
    history:
      "The Holy Roman Empire gave way to Prussian-led unification in 1871, two world wars, division into East and West from 1949, and reunification in 1990. Germany is now the largest economy in the European Union.",
    culture:
      "Classical music from Bach to Beethoven, engineering and automotive industries, Oktoberfest and brewing, philosophy from Kant to Nietzsche, and a federal political culture.",
  },
  greece: {
    capital: "Athens",
    population: "approximately 10.4 million",
    languages: "Greek",
    ethnicGroups:
      "a Greek majority with Albanian, Turkish, Roma, Macedonian, Bulgarian, and Pomak minorities",
    history:
      "Ancient Greek city-states seeded Western philosophy, democracy, and drama. After centuries of Byzantine and Ottoman rule, Greece won independence in 1830 and expanded through the Balkan Wars before joining the EU in 1981.",
    culture:
      "Eastern Orthodox Christianity, Mediterranean cuisine, the Olympic heritage, rebetiko and bouzouki music, and island folk traditions.",
  },
  hungary: {
    capital: "Budapest",
    population: "approximately 9.6 million",
    languages: "Hungarian (Magyar)",
    ethnicGroups:
      "a Hungarian majority with Roma, Romanian, German, Slovak, and Croatian minorities",
    history:
      "Magyar tribes settled the Carpathian Basin around 895. Hungary later joined the Habsburg realm, co-ruled the Austro-Hungarian Empire, lost two-thirds of its territory under the 1920 Treaty of Trianon, and joined the EU in 2004.",
    culture:
      "Paprika-rich cuisine from goulash to chimney cake, Liszt and Bartók's music, thermal baths, and folk embroidery.",
  },
  india: {
    capital: "New Delhi",
    population: "approximately 1.42 billion",
    languages: "Hindi and English plus 22 scheduled languages",
    ethnicGroups:
      "Indo-Aryan and Dravidian peoples including Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Punjabi, and Urdu speakers, alongside hundreds of tribal and scheduled communities",
    history:
      "The Indus Valley civilization, successive empires from Maurya and Gupta to Mughal, two centuries of British Raj, and the 1947 independence and Partition into India and Pakistan.",
    culture:
      "Hindu, Muslim, Sikh, Christian, Jain, and Buddhist traditions, Bollywood cinema, classical and folk dance, yoga, and regional cuisines from dosa to biryani.",
  },
  indonesia: {
    capital: "Jakarta",
    population: "approximately 277 million",
    languages: "Indonesian (Bahasa Indonesia) plus over 700 living languages",
    ethnicGroups:
      "Javanese, Sundanese, Madurese, Batak, Betawi, Minangkabau, Bugis, and Dayak among hundreds of distinct peoples across more than 17,000 islands",
    history:
      "The Srivijaya and Majapahit maritime empires gave way to Dutch colonial rule, Japanese occupation, and the 1945 declaration of independence, secured by 1949. Reformasi after 1998 ended the New Order regime.",
    culture:
      "The world's largest Muslim population, batik, gamelan, wayang shadow puppetry, diverse cuisines from rendang to nasi goreng, and Bali's Hindu traditions.",
  },
  iran: {
    capital: "Tehran",
    population: "approximately 88 million",
    languages: "Persian (Farsi) plus Azeri, Kurdish, Gilaki, Luri, Balochi, and Arabic",
    ethnicGroups:
      "Persians, Azeris, Kurds, Lurs, Baloch, Arabs, Turkmens, Qashqai, and Mazandarani among many groups",
    history:
      "The Achaemenid, Parthian, and Sassanid Persian empires fell to Arab conquest in the 7th century. The Safavid dynasty established Shia Islam as state religion, and the 1979 revolution created the Islamic Republic.",
    culture:
      "Persian poetry from Rumi to Hafez, Nowruz new year, miniature painting, carpet weaving, and a refined cuisine centered on rice, herbs, and kebab.",
  },
  iraq: {
    capital: "Baghdad",
    population: "approximately 44 million",
    languages: "Arabic and Kurdish",
    ethnicGroups:
      "Arab Shia, Arab Sunni, Kurdish, Turkmen, Assyrian, Chaldean, Yazidi, and Shabak communities",
    history:
      "Mesopotamia, the cradle of writing and early cities, later hosted the Abbasid Caliphate centered on Baghdad. Modern Iraq was formed under British mandate in 1921, became a republic in 1958, and endured wars and sanctions before 2003.",
    culture:
      "The Tigris and Euphrates rivers, Marsh Arab heritage, ancient Babylonian and Sumerian sites, and a rich cuisine of dolma, masgouf, and biryani.",
  },
  ireland: {
    capital: "Dublin",
    population: "approximately 5.1 million",
    languages: "Irish (Gaeilge) and English",
    ethnicGroups:
      "an Irish majority with Polish, UK, Lithuanian, Romanian, and Brazilian communities",
    history:
      "A Gaelic island shaped by Viking, Norman, and English colonization, the Great Famine of the 1840s, the 1922 independence struggle, and EU membership from 1973 that powered the Celtic Tiger economy.",
    culture:
      "Gaelic games, traditional session music, the literary tradition of Joyce and Yeats, stout brewing, and a global diaspora.",
  },
  israel: {
    capital: "Jerusalem (declared); Tel Aviv as the main commercial center",
    population: "approximately 9.7 million",
    languages: "Hebrew and Arabic",
    ethnicGroups:
      "a Jewish majority including Ashkenazi, Mizrahi, Sephardi, Ethiopian, and Russian-speaking communities, alongside Arab, Armenian, Druze, and Circassian minorities",
    history:
      "Established in 1948 in the former British Mandate of Palestine, Israel absorbed successive waves of Jewish immigration and developed a high-tech economy amid enduring regional conflict.",
    culture:
      "Hebrew revival, Jewish religious traditions, Arab and Mediterranean cuisines, and a globally significant technology sector.",
  },
  italy: {
    capital: "Rome",
    population: "approximately 59 million",
    languages: "Italian",
    ethnicGroups:
      "an Italian majority with Romanian, Maghrebi, Albanian, Chinese, and Ukrainian communities",
    history:
      "The Roman Empire, Renaissance city-states, foreign domination of divided states, and 1861 unification under the House of Savoy produced a republic after the 1946 referendum ending the monarchy.",
    culture:
      "Regional cuisines from pasta to pizza, opera from Verdi to Puccini, Renaissance art and architecture, Catholic heritage, and fashion houses.",
  },
  japan: {
    capital: "Tokyo",
    population: "approximately 124 million",
    languages: "Japanese",
    ethnicGroups:
      "a Japanese majority with Ryukyuan (Okinawan), Ainu, Korean, Chinese, and Brazilian Nikkei minorities",
    history:
      "The Yamato state, Heian court, Kamakura shogunate, and Edo isolation gave way to Meiji modernization, wartime defeat in 1945, and postwar economic growth under a pacifist constitution.",
    culture:
      "Shinto and Buddhist traditions, tea ceremony, ukiyo-e and anime, sushi and ramen, calligraphy, and seasonal festivals.",
  },
  kenya: {
    capital: "Nairobi",
    population: "approximately 54 million",
    languages: "Swahili and English plus Kikuyu, Luhya, Luo, Kalenjin, and others",
    ethnicGroups:
      "Kikuyu, Luhya, Luo, Kalenjin, Kamba, Kisii, Meru, Maasai, Turkana, and Samburu among more than 40 groups",
    history:
      "Kenya's Swahili coast linked inland trade with the Indian Ocean before British colonial rule from 1895. The Mau Mau uprising preceded independence in 1963 under Jomo Kenyatta.",
    culture:
      "Swahili coastal culture, Maasai pastoralism, long-distance running, savanna wildlife tourism, and a thriving Nairobi tech scene.",
  },
  lebanon: {
    capital: "Beirut",
    population: "approximately 5.5 million",
    languages: "Arabic (Lebanese dialect) with French and English widely used",
    ethnicGroups:
      "Maronite Christian, Sunni Muslim, Shia Muslim, Greek Orthodox, Druze, and Armenian communities",
    history:
      "Phoenician city-states, Roman rule, Crusader states, and Ottoman centuries preceded the French Mandate and 1943 independence. The 1975–1990 civil war and later crises shaped modern Lebanon.",
    culture:
      "Cedar symbolism, mezze cuisine, a multilingual literary and musical scene, and Beirut's historic role as a Mediterranean crossroads.",
  },
  malaysia: {
    capital: "Kuala Lumpur",
    population: "approximately 34 million",
    languages: "Malay (Bahasa Malaysia), English, Chinese varieties, and Tamil",
    ethnicGroups:
      "Malay and other Bumiputera peoples, Chinese Malaysians, Indian Malaysians, and Indigenous groups such as the Orang Asli, Iban, and Kadazan-Dusun",
    history:
      "The Malacca Sultanate gave way to Portuguese, Dutch, and British colonial rule, Japanese occupation, and independence in 1957, federating with Sabah and Sarawak in 1963.",
    culture:
      "A multiconfessional mix of Islam, Buddhism, Christianity, Hinduism, and Chinese religions, expressed through food, festivals, and batik textiles.",
  },
  morocco: {
    capital: "Rabat",
    population: "approximately 37 million",
    languages: "Arabic and Tamazight (Berber), with French widely used",
    ethnicGroups:
      "Arab-Berber majority with Sahrawi, Gnawa, and Haratin communities",
    history:
      "Berber dynasties such as the Almoravids and Almohads ruled North Africa and Iberia. French and Spanish protectorates ended in 1956, and the monarchy under the Alaouite dynasty continues today.",
    culture:
      "Medina souks and riads, tagine and couscous, the Gnaoua music tradition, mint tea, and Andalusian heritage.",
  },
  netherlands: {
    capital: "Amsterdam",
    population: "approximately 17.7 million",
    languages: "Dutch, with Frisian official in Friesland",
    ethnicGroups:
      "a Dutch majority with Turkish, Moroccan, Indonesian, Surinamese, Polish, and Antillean communities",
    history:
      "The Republic of the Seven United Provinces led a 17th-century Golden Age of trade, science, and painting. After French and post-Napoleonic kingdoms, the Netherlands developed a constitutional monarchy and welfare state.",
    culture:
      "Cycling, polders and water management, Golden Age painting from Rembrandt to Vermeer, and a liberal social tradition.",
  },
  nigeria: {
    capital: "Abuja",
    population: "approximately 223 million",
    languages: "English plus Hausa, Yoruba, Igbo, and over 500 languages",
    ethnicGroups:
      "Hausa, Yoruba, Igbo, Fulani, Tiv, Ibibio, Kanuri, Edo, Ijaw, and more than 250 other groups",
    history:
      "Hausa city-states, the Yoruba Oyo Empire, and Igbo societies shaped the precolonial landscape before British rule consolidated the colony in 1914. Independence came in 1960, followed by civil war and return to democracy in 1999.",
    culture:
      "Nollywood film, Afrobeats from Fela to modern stars, Jollof rice, Yoruba and Igbo masquerade traditions, and a vast literature.",
  },
  norway: {
    capital: "Oslo",
    population: "approximately 5.5 million",
    languages: "Norwegian (Bokmål and Nynorsk) and Sami in core areas",
    ethnicGroups:
      "a Norwegian majority with Sami, Kven, Polish, Lithuanian, and Swedish minorities",
    history:
      "The Viking Age expansion gave way to unions with Denmark and Sweden before independence in 1905. Oil discoveries in the 1960s funded the sovereign wealth fund now among the world's largest.",
    culture:
      "Fjords and cabins, skiing, the literary tradition of Ibsen and Hamsun, Edvard Grieg's music, and Sami reindeer herding.",
  },
  pakistan: {
    capital: "Islamabad",
    population: "approximately 240 million",
    languages: "Urdu and English plus Punjabi, Pashto, Sindhi, Saraiki, and Balochi",
    ethnicGroups:
      "Punjabi, Pashtun, Sindhi, Saraiki, Muhajir, Baloch, and Kashmiri peoples",
    history:
      "The Indus Valley civilization, Gandharan Buddhism, and a succession of empires preceded the 1947 Partition creating Pakistan. East Pakistan became Bangladesh in 1971, and the country has alternated between civilian and military rule.",
    culture:
      "Sufi poetry and qawwali music, cricket, biryani and kebab cuisine, truck art, and Mughal architectural heritage.",
  },
  philippines: {
    capital: "Manila",
    population: "approximately 117 million",
    languages: "Filipino and English plus Tagalog, Cebuano, Ilocano, and Hiligaynon",
    ethnicGroups:
      "Tagalog, Cebuano, Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, and over 175 ethnolinguistic groups",
    history:
      "Austronesian seafarers, Muslim sultanates in the south, and Spanish colonization from 1565 were followed by American rule, Japanese occupation, and independence in 1946. The 1986 People Power revolution restored democracy.",
    culture:
      "A predominantly Catholic society with regional fiestas, sinigang and adobo dishes, boxing and basketball, and a deep Overseas Filipino worker diaspora.",
  },
  poland: {
    capital: "Warsaw",
    population: "approximately 38 million",
    languages: "Polish",
    ethnicGroups:
      "a Polish majority with Silesian, Kashubian, Ukrainian, Belarusian, German, and Roma minorities",
    history:
      "The Piast dynasty, the Polish-Lithuanian Commonwealth, and the 18th-century partitions by Russia, Prussia, and Austria preceded restored independence in 1918, devastation in World War II, Communist rule, and the 1989 Solidarity transition.",
    culture:
      "Catholic tradition, pierogi and bigos cuisine, Chopin's music, a rich literature, and historic cities rebuilt after wartime destruction.",
  },
  portugal: {
    capital: "Lisbon",
    population: "approximately 10.3 million",
    languages: "Portuguese",
    ethnicGroups:
      "a Portuguese majority with Brazilian, Cape Verdean, Goan, Angolan, and Ukrainian communities",
    history:
      "The 1143 Reconquista kingdom launched the Age of Discoveries in the 15th century, building an empire from Brazil to Macau. The 1974 Carnation Revolution ended dictatorship and released African colonies.",
    culture:
      "Fado music, codfish and pastry traditions, azulejo tilework, port wine, and a global Lusophone cultural footprint.",
  },
  romania: {
    capital: "Bucharest",
    population: "approximately 19 million",
    languages: "Romanian",
    ethnicGroups:
      "a Romanian majority with Hungarian, Roma, Ukrainian, German, and Turkish minorities",
    history:
      "Dacia, Roman colonization, and medieval principalities of Wallachia, Moldavia, and Transylvania preceded the 1877 independence and 1918 union of the regions. Communist rule ended in the 1989 revolution.",
    culture:
      "Eastern Orthodox heritage, the Carpathian landscape, painted monasteries, cabbage rolls (sarmale), and a Latin-language island in Eastern Europe.",
  },
  russia: {
    capital: "Moscow",
    population: "approximately 144 million",
    languages: "Russian plus Tatar, Chechen, Bashkir, Chuvash, and many others",
    ethnicGroups:
      "Russian majority alongside Tatar, Chechen, Bashkir, Chuvash, Yakut, Tuvan, and more than 190 other peoples across eleven time zones",
    history:
      "Kievan Rus, the Mongol yoke, the rise of Muscovy, the Tsardom and Russian Empire, the 1917 Revolution and Soviet Union, and the 1991 dissolution into the Russian Federation.",
    culture:
      "Orthodox Christianity, Tolstoy and Dostoevsky's literature, Tchaikovsky and the Bolshoi ballet, vodka and borscht, and vast landscapes from the taiga to Kamchatka.",
  },
  "saudi-arabia": {
    capital: "Riyadh",
    population: "approximately 36 million",
    languages: "Arabic",
    ethnicGroups:
      "Saudi Arab majority alongside large expatriate communities from South Asia, the wider Arab world, the Philippines, and Africa",
    history:
      "The birthplace of Islam in the 7th century, the Arabian Peninsula later hosted the House of Saud, which unified the kingdom in 1932. Oil wealth from the 1938 discovery transformed the country.",
    culture:
      "The Two Holy Mosques of Mecca and Medina, Bedouin heritage, Arabic poetry, dates and kabsa cuisine, and Vision 2030 reforms.",
  },
  "south-africa": {
    capital: "Pretoria (executive); Cape Town (legislative); Bloemfontein (judicial)",
    population: "approximately 60 million",
    languages: "11 official languages including Zulu, Xhosa, Afrikaans, English, and Sepedi",
    ethnicGroups:
      "Black African peoples such as Zulu, Xhosa, Sotho, Tswana, and Tsonga, alongside Coloured, White (Afrikaner and English), Indian, and Asian communities",
    history:
      "Khoisan and Bantu-speaking societies, Dutch and British colonization, the Boer Wars, and 1910 Union preceded apartheid from 1948. The 1994 democratic transition under Nelson Mandela founded the Rainbow Nation.",
    culture:
      "Rainbow Nation diversity, braai cuisine, vuvuzela and kwaito, township jazz, vineyards, and a powerful Constitutional Court tradition.",
  },
  "south-korea": {
    capital: "Seoul",
    population: "approximately 51 million",
    languages: "Korean",
    ethnicGroups:
      "a Korean majority with small Chinese, Vietnamese, Thai, and Filipino communities",
    history:
      "The Joseon dynasty ended with Japanese colonial rule from 1910. Liberation in 1945, the Korean War, and authoritarian development preceded democratization from 1987 and the Han River economic miracle.",
    culture:
      "K-pop, K-drama, hanok architecture, hanji paper, kimchi and bibimbap cuisine, and a global cultural wave (Hallyu).",
  },
  spain: {
    capital: "Madrid",
    population: "approximately 48 million",
    languages: "Spanish (Castilian), Catalan, Galician, and Basque",
    ethnicGroups:
      "Castilian, Catalan, Galician, Basque, and Andalusian identities alongside Romanian, Moroccan, British, and Latin American communities",
    history:
      "Roman Hispania, Al-Andalus, the Reconquista, the global Spanish Empire, and the 1936–1939 Civil War preceded the 1978 democratic constitution and EU membership.",
    culture:
      "Flamenco, tapas and paella, Gaudí's architecture, the Prado, bullfighting, and distinct regional nationalisms.",
  },
  "sri-lanka": {
    capital: "Sri Jayawardenepura Kotte (legislative); Colombo (commercial)",
    population: "approximately 22 million",
    languages: "Sinhala, Tamil, and English",
    ethnicGroups:
      "Sinhalese, Sri Lankan Tamil, Moor, Indian Tamil, Malay, and Burgher communities",
    history:
      "The ancient Anuradhapura and Polonnaruwa kingdoms, Portuguese, Dutch, and British colonial periods, and 1948 independence preceded the 1983–2009 civil war and post-conflict recovery.",
    culture:
      "Theravada Buddhism, tea plantations, cricket, Kandyan dance, rice and curry, and a multireligious heritage.",
  },
  sweden: {
    capital: "Stockholm",
    population: "approximately 10.5 million",
    languages: "Swedish",
    ethnicGroups:
      "a Swedish majority with Finnish, Syrian, Iraqi, Somali, Polish, and Iranian communities",
    history:
      "Viking expansion, the 17th-century Baltic empire, and a long tradition of neutrality preceded EU membership in 1995. The 20th-century welfare model balanced social protection with an open economy.",
    culture:
      "ABBA and pop music, the Nobel Prize, fika coffee tradition, design from IKEA, and a strong literary and film heritage.",
  },
  switzerland: {
    capital: "Bern",
    population: "approximately 8.8 million",
    languages: "German, French, Italian, and Romansh",
    ethnicGroups:
      "Swiss German, Swiss French, Swiss Italian, and Romansh communities with a foreign-born population of about 25 percent from Germany, Italy, Portugal, France, and the Balkans",
    history:
      "The 1291 Old Swiss Confederacy grew from alpine defense pacts into a federal state. Strict neutrality, direct democracy, and a multilingual cantonal system define modern Switzerland.",
    culture:
      "Banking and watchmaking, chocolate and fondue, alpine skiing, multilingual federal identity, and direct democracy through referendums.",
  },
  thailand: {
    capital: "Bangkok",
    population: "approximately 70 million",
    languages: "Thai",
    ethnicGroups:
      "Thai majority with Chinese, Malay, Karen, Lao, Hmong, and Khmer communities",
    history:
      "The Sukhothai and Ayutthaya kingdoms, the Thonburi interregnum, and the Rattanakosin (Chakri) dynasty made Thailand the only Southeast Asian state to avoid colonization. Constitutional monarchy arrived in 1932.",
    culture:
      "Theravada Buddhism, muay Thai, Thai massage, street food from pad thai to som tam, royal dance-drama (khon), and Songkran festivities.",
  },
  turkey: {
    capital: "Ankara",
    population: "approximately 85 million",
    languages: "Turkish",
    ethnicGroups:
      "a Turkish majority with Kurdish, Zaza, Arab, Laz, Circassian, and Armenian communities",
    history:
      "Anatolia's Hittite, Greek, Byzantine, and Seljuk heritage culminated in the Ottoman Empire. The 1923 republic under Atatürk built a secular nation-state from the empire's Anatolian core.",
    culture:
      "Turkish coffee and tea, kebab cuisine, whirling dervish Sufi tradition, hammam baths, carpets, and a bridge between Europe and Asia.",
  },
  ukraine: {
    capital: "Kyiv",
    population: "approximately 41 million",
    languages: "Ukrainian",
    ethnicGroups:
      "a Ukrainian majority with Russian, Crimean Tatar, Romanian, Belarusian, and Jewish minorities",
    history:
      "Kievan Rus, the Cossack Hetmanate, and periods under Polish-Lithuanian, Russian, and Soviet rule preceded the 1991 independence. Euromaidan in 2014 and the war with Russia reshaped the nation's trajectory.",
    culture:
      "Eastern Orthodox tradition, vyshyvanka embroidered shirts, borscht and salo cuisine, bandura music, and a strong agrarian folk heritage.",
  },
  "united-kingdom": {
    capital: "London",
    population: "approximately 67 million",
    languages: "English, with Welsh, Scots, Scottish Gaelic, and Irish recognized",
    ethnicGroups:
      "English, Scottish, Welsh, and Northern Irish identities alongside large communities of Indian, Pakistani, Bangladeshi, Black African, Black Caribbean, and Polish heritage",
    history:
      "The Acts of Union, the Industrial Revolution, and the British Empire shaped global modern history. Decolonization, EU membership from 1973, and the 2020 Brexit departure define contemporary Britain.",
    culture:
      "Parliamentary democracy, pub culture, Shakespeare and the BBC, the Premier League, and a multiracial society reflected in London.",
  },
  "united-states": {
    capital: "Washington, D.C.",
    population: "approximately 335 million",
    languages: "English (de facto) with Spanish widely spoken",
    ethnicGroups:
      "a multiethnic population including White, Black or African American, Hispanic or Latino, Asian, American Indian and Alaska Native, and Native Hawaiian or Pacific Islander Americans",
    history:
      "Indigenous nations, 13 British colonies, the 1776 Revolution, westward expansion, Civil War, immigration waves, and global superpower status after World War II shape the United States.",
    culture:
      "Hollywood film, jazz and hip-hop, diverse regional cuisines, Silicon Valley technology, sports leagues, and a federal democratic republic.",
  },
  vietnam: {
    capital: "Hanoi",
    population: "approximately 100 million",
    languages: "Vietnamese",
    ethnicGroups:
      "a Kinh (Viet) majority of about 85 percent alongside 53 minority nationalities such as Tay, Thai, Muong, Khmer, Mong, Nung, and Dao",
    history:
      "Dai Viet kingdoms, Chinese millennium, French Indochina from 1887, the 1954 partition, the Vietnam War, and 1975 reunification preceded the 1986 Doi Moi market reforms.",
    culture:
      "Pho and banh mi cuisine, motorbike culture, rice paddy landscapes, Tet lunar new year, water puppetry, and a literate Confucian-Buddhist heritage.",
  },
};

/** 默认回退事实（理论上不会用到，因为 48 国都有 FACTS）。 */
const FALLBACK_FACTS: CountryFacts = {
  capital: "the national capital",
  population: "tens of millions of people",
  languages: "the national language",
  ethnicGroups: "a multiethnic population",
  history:
    "The country's history spans precolonial societies, colonial encounters, and modern statehood, shaping its contemporary population.",
  culture:
    "Local cuisine, music, religious traditions, and regional crafts define everyday cultural life.",
};

function factsFor(slug: string): CountryFacts {
  return FACTS[slug] || FALLBACK_FACTS;
}

/**
 * 半球与气候带判定（用于 geography 段落自然可读）。
 */
function describeLocation(lat: number, lng: number): {
  hemisphere: string;
  climateBand: string;
  longitudeHint: string;
} {
  const hemisphere = lat >= 0 ? "the Northern Hemisphere" : "the Southern Hemisphere";
  const absLat = Math.abs(lat);
  let climateBand: string;
  if (absLat < 23.5) {
    climateBand = "a tropical climate band with year-round warmth and pronounced wet and dry seasons";
  } else if (absLat < 35) {
    climateBand = "a subtropical climate band with hot summers and mild winters";
  } else if (absLat < 50) {
    climateBand = "a temperate climate band with four distinct seasons";
  } else if (absLat < 66.5) {
    climateBand = "a cooler temperate to boreal climate band with cold winters";
  } else {
    climateBand = "a subarctic to polar climate band with long winters";
  }
  let longitudeHint: string;
  if (lng >= -30 && lng < 60) {
    longitudeHint = "within the Europe–Africa–Middle East longitudes";
  } else if (lng >= 60 && lng < 150) {
    longitudeHint = "within the Asian–Australasian longitudes";
  } else {
    longitudeHint = "within the American longitudes";
  }
  return { hemisphere, climateBand, longitudeHint };
}

/** 同 region 的代表性格（用于 demographics / culture 段落衔接）。 */
function regionCharacter(region: string): string {
  switch (region) {
    case "Europe":
      return "a long history of state formation, urbanization, and migration has produced populations with strong regional variation in pigmentation, facial morphology, and stature";
    case "East Asia":
      return "millennia of shared East Asian population history have shaped broadly similar facial features with subtle variation across national boundaries";
    case "South Asia":
      return "one of the most genetically and phenotypically diverse regions in the world, with deep caste, language, and geography-driven variation";
    case "Southeast Asia":
      return "an overlap zone of East Asian, South Asian, and Australo-Melanesian ancestry that produces distinctive national phenotype profiles";
    case "Middle East":
      return "a crossroads of Arabian, Persian, Levantine, and Anatolian populations whose average faces reflect centuries of trade and migration";
    case "North Africa":
      return "an overlap of Berber (Amazigh), Arab, Mediterranean, and Sub-Saharan ancestry along the Sahara's northern edge";
    case "Sub-Saharan Africa":
      return "the most genetically diverse part of the planet, with national average faces capturing only a fraction of that internal variation";
    case "South America":
      return "a population shaped by European colonization, African diaspora, and Indigenous ancestry in varying regional mixes";
    case "North America":
      return "a population built from Indigenous nations, European colonization, African diaspora, and successive immigration waves";
    default:
      return "a population shaped by layered migration, trade, and state formation";
  }
}

export interface CountryContent {
  demographics: string;
  geography: string;
  history: string;
  culture: string;
}

/**
 * 生成单个 country 的四段介绍（demographics / geography / history / culture）。
 *
 * 每段 200–400 词，结合该国的 FACTS 表 + region 上下文 + 经纬度判定，
 * 拼成自然可读的英文段落，避免一望而知的填空感。
 */
export function generateCountryContent(country: Country): CountryContent {
  const f = factsFor(country.slug);
  const { hemisphere, climateBand, longitudeHint } = describeLocation(
    country.lat,
    country.lng
  );
  const region = country.region;
  const name = country.name;
  const regionChar = regionCharacter(region);

  const capitalLead = f.capital.includes(";")
    ? `The capital is ${f.capital}, concentrating`
    : `${f.capital} serves as the capital and the largest urban center, concentrating`;
  const demographics = [
    `${name} is a country in ${region} with a population of ${f.population}. ${capitalLead} political institutions, universities, and much of the urban population. The national population is ${f.ethnicGroups}. This composition reflects ${regionChar}.`,
    `Languages are central to national identity: ${f.languages} dominate public life, education, and media. Most citizens are functionally bilingual or multilingual, and urban centers host growing communities of migrant and minority-language speakers. Age structure varies between younger, fast-growing urban cohorts and ageing rural populations, with internal migration toward the capital and major cities continuing to reshape the demographic map.`,
    `When an average face composite is generated for ${name}, it statistically aggregates these demographic layers rather than representing any single individual. The composite reflects the most common facial features within the majority population together with the visible influence of historically significant minorities, and it should be read as a statistical impression of recurring traits rather than a portrait of a real person.`,
  ].join(" ");

  const geography = [
    `${name} is located in ${hemisphere} ${longitudeHint}, roughly centered on coordinates ${country.lat.toFixed(
      2
    )}° latitude and ${country.lng.toFixed(2)}° longitude. The country sits within ${climateBand}. Its position within ${region} places it alongside neighboring states with which it shares historical trade routes, religious traditions, and migration corridors, and the modern border configuration is the product of centuries of state formation and treaty-making.`,
    `Terrain and climate shape where people live. Inland basins, river valleys, and coastal plains tend to be the most densely settled, while mountain ranges, deserts, or dense forests historically limited permanent settlement and preserved linguistic and phenotypic diversity in more isolated pockets. The combination of latitude, elevation, and proximity to the sea determines the agricultural calendar, the staple crops, and the architectural styles that together form the visible texture of daily life.`,
    `For an average face composite, geography matters because population movement tends to follow rivers, coasts, and mountain passes. ${name}'s particular location has channeled inward and outward migration along predictable routes, and the resulting gene flow is part of what the composite captures. The country's neighbors and their own average face composites often show overlapping but distinguishable features, which is part of why comparing composites across ${region} is informative.`,
  ].join(" ");

  const history = [
    `${f.history} Each phase left demographic deposits: conquests, displacements, religious conversions, trade diasporas, and refugee movements all altered who lived within the borders of present-day ${name}.`,
    `In the modern era the consolidation of a national state, the spread of mass education, and improvements in transport accelerated internal homogenization even as global migration reintroduced diversity. Border changes, decolonization, and economic migration in the 19th and 20th centuries redistributed communities and created diaspora populations abroad, some of whom later returned. These movements are encoded, in a statistical sense, in the average face composite generated for ${name}.`,
    `Because the composite is a snapshot of recurring features in the contemporary population, it reflects the cumulative outcome of this layered history rather than any single ancestral group. Comparing ${name}'s composite with those of neighbors in ${region} and with related populations further afield can make those historical layers visible, while reminding the viewer that an average is always an abstraction over real, individual human variation.`,
  ].join(" ");

  const culture = [
    `${f.culture} Religious life, family structure, and the rhythm of seasonal festivals organize the calendar, while regional crafts, music, and oral traditions preserve older layers of identity even within a modernizing national culture.`,
    `Food is one of the most accessible windows into national life. Staple grains, cooking fats, spice blends, and fermentation techniques vary across ${region} and even within ${name}, and they carry traces of trade, migration, and climate. Music and dance traditions likewise mix Indigenous, imported, and locally invented elements, and in many cases have become recognizable national exports consumed worldwide.`,
    `The cultural texture of ${name} is part of the context in which the average face composite should be read. Clothing, grooming, and photographic conventions all influence which faces enter a composite and how they are perceived, even when the underlying facial morphology is statistically representative. Together, the demographics, geography, history, and culture described above frame what the ${name.toLowerCase()} average face composite does, and does not, show.`,
  ].join(" ");

  return { demographics, geography, history, culture };
}
