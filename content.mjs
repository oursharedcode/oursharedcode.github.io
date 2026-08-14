/**
 * The page, in six languages. One record per locale; build.mjs turns each into
 * a standalone HTML file.
 *
 * The English record is the original. It is the source the other five were
 * translated from, and it is the only one the owner wrote himself, so it is
 * the one that moves first when anything changes.
 *
 * Three strings here are NOT free translations. They are copied from
 * freeieltsbooks.net's own locale files (site/src/i18n/<locale>.json in the
 * ielts_books repo), because a reader arriving from that site must not find
 * the same sentence worded two ways:
 *
 *   title     <- supportTitle   (this page is linked by that exact title)
 *   back      <- backHome
 *   tip       <- the cost clause inside disclaimerP5
 *
 * That last one is the load-bearing copy. "hosting, domain, translation costs"
 * is asserted in twenty other published places — disclaimerP5 in six locales
 * and the IMPRINT map printed in all thirteen book editions — and the whole
 * point of the exercise is that a reader comparing this page with the imprint
 * of the book they just downloaded finds no daylight. The noun list here is
 * lifted from each locale's disclaimerP5 verbatim. If the cost basis ever
 * genuinely changes, all twenty-six copies move together, or none of them do.
 */

// Shared across every locale — never translated, never localised.
export const KOFI_URL = 'https://ko-fi.com/freeenglishbooks';
export const BMC_URL = 'https://buymeacoffee.com/freeenglishbooks';
export const BOOKS_URL = 'https://freeieltsbooks.net/';
export const BASE_URL = 'https://www.oursharedcode.com/free-english-books';

// Locale slug -> URL segment. These match freeieltsbooks.net's slugs exactly
// (site/src/i18n/index.ts `locales`), so /free-english-books/pt-br pairs with
// freeieltsbooks.net/pt-br and a reader never has to guess the other half.
export const LOCALES = ['en', 'hi', 'vi', 'pt-br', 'zh', 'ar'];

// BCP-47 tags for hreflang and og:locale. Copied from the books site's `bcp47`
// map for the same reason the strings are: the two sites describe the same
// six audiences and should describe them identically to a crawler.
export const BCP47 = {
  en: 'en',
  hi: 'hi',
  vi: 'vi',
  'pt-br': 'pt-BR',
  zh: 'zh-Hans', // the books and UI are Simplified
  ar: 'ar',
};

export const RTL = ['ar'];

export const CONTENT = {
  // -------------------------------------------------------------- English --
  en: {
    title: 'From Band 5.5 to Band 8 — A True Story',
    description:
      'How I went from band 5.5 to band 8 in nineteen months, and why I wrote free English exam preparation books.',
    // The label the "English" button carries on the other five pages. It is
    // written in English on purpose: a reader who cannot read the page they
    // landed on has to recognise this word without reading the page.
    englishLabel: 'English',
    // The language's own name, used in the row on the English pages.
    nativeName: 'English',
    lede: 'Hi friends,<br>\n  I created <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    affiliation:
      "This page is mine personally &mdash; it isn't part of that site, and it isn't\n  affiliated with, endorsed by, or connected to IELTS, the British Council,\n  IDP, or Cambridge Assessment English.",
    story: [
      'I started at band 5.5.',
      "The first thing that changed wasn't my English. I told myself <em>you can do\n  it</em> &mdash; and on the days that didn't feel true, I told myself again.\n  Motivation looks like the least practical thing on this list. It's the reason\n  the rest of it lasted nineteen months instead of two weeks.",
      "Then I stopped writing in general words. I'd write <em>a bad thing</em> where\n  I meant <em>an economic disaster</em>. That vagueness was most of what was\n  holding my score down &mdash; the ideas were there, and the language flattened\n  them. I started a notebook of collocations, the words that live next to each\n  other, and kept adding to it until the phrases came out without being fetched.",
      "For speaking, I recorded my own voice and listened back. It's uncomfortable,\n  and it's the fastest way to hear what an examiner hears. Then I listened to\n  the news and to podcasts for the rhythm rather than the vocabulary &mdash;\n  where a fluent speaker slows down, runs words together, stops &mdash; and\n  imitated it.",
      'Nineteen months of daily practice took me from 5.5 to 8.',
      "Afterwards I decided to share what I'd worked out, as free English exam\n  preparation books. They're free to download, with no sign-up and no account,\n  at <a href=\"" + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    ],
    tip:
      "You can leave a voluntary tip here. It covers hosting, domain, translation\n  costs &mdash; nothing is sold, and it isn't required to use any of the books.",
    kofi: 'Support me on Ko-fi',
    bmc: 'Buy me a coffee',
    tipNote: 'Any amount, one time. It opens on their site, not mine.',
    back: 'Back to the books',
  },

  // ---------------------------------------------------------------- Hindi --
  hi: {
    title: 'बैंड 5.5 से बैंड 8 तक — एक सच्ची कहानी',
    description:
      'उन्नीस महीनों में मैं बैंड 5.5 से बैंड 8 तक कैसे पहुँचा, और मैंने मुफ़्त अंग्रेज़ी परीक्षा तैयारी की किताबें क्यों लिखीं।',
    englishLabel: 'English',
    // The language's own name, used in the row on the English pages.
    nativeName: 'हिन्दी',
    lede:
      'नमस्ते दोस्तों,<br>\n  मैंने <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a> बनाई है।',
    affiliation:
      'यह पृष्ठ व्यक्तिगत रूप से मेरा है &mdash; यह उस साइट का हिस्सा नहीं है, और इसका\n  IELTS, British Council, IDP या Cambridge Assessment English से न कोई संबंध है,\n  न उनका समर्थन प्राप्त है, न कोई जुड़ाव।',
    story: [
      'मैंने बैंड 5.5 से शुरुआत की थी।',
      'सबसे पहले जो चीज़ बदली, वह मेरी अंग्रेज़ी नहीं थी। मैंने खुद से कहा &mdash;\n  <em>तुम कर सकते हो</em> &mdash; और जिन दिनों यह सच नहीं लगता था, उन दिनों मैंने\n  खुद से फिर कहा। इस सूची में प्रेरणा सबसे कम व्यावहारिक चीज़ लगती है। यही वजह है\n  कि बाकी सब दो हफ़्ते नहीं, उन्नीस महीने चला।',
      'फिर मैंने सामान्य शब्दों में लिखना छोड़ दिया। जहाँ मेरा मतलब\n  <em>एक आर्थिक तबाही</em> से होता, वहाँ मैं <em>एक बुरी बात</em> लिख देता था।\n  मेरा स्कोर ज़्यादातर इसी अस्पष्टता ने रोक रखा था &mdash; विचार मौजूद थे, और भाषा\n  उन्हें सपाट कर देती थी। मैंने कोलोकेशन की एक नोटबुक शुरू की &mdash; वे शब्द जो\n  एक-दूसरे के साथ रहते हैं &mdash; और उसमें तब तक जोड़ता रहा जब तक वाक्यांश बिना\n  ढूँढे ही न निकलने लगे।',
      'बोलने के लिए, मैंने अपनी आवाज़ रिकॉर्ड की और उसे सुना। यह असहज करता है, और\n  परीक्षक को जो सुनाई देता है उसे सुनने का यह सबसे तेज़ तरीका है। फिर मैंने समाचार\n  और पॉडकास्ट शब्दावली के लिए नहीं, बल्कि लय के लिए सुने &mdash; कहाँ एक धाराप्रवाह\n  वक्ता धीमा होता है, शब्दों को जोड़ देता है, रुकता है &mdash; और उसकी नक़ल की।',
      'उन्नीस महीने के रोज़ाना अभ्यास ने मुझे 5.5 से 8 तक पहुँचाया।',
      'उसके बाद मैंने तय किया कि जो मैंने समझा, उसे मुफ़्त अंग्रेज़ी परीक्षा तैयारी की\n  किताबों के रूप में साझा करूँ। वे मुफ़्त डाउनलोड के लिए हैं, न साइन-अप, न खाता,\n  <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a> पर।',
    ],
    tip:
      'आप यहाँ स्वेच्छा से एक टिप दे सकते हैं। यह केवल होस्टिंग, डोमेन और अनुवाद की\n  लागत में सहायता करती है &mdash; कुछ भी बेचा नहीं जाता, और किसी भी किताब के\n  इस्तेमाल के लिए यह ज़रूरी नहीं है।',
    kofi: 'Ko-fi पर मेरा सहयोग करें',
    bmc: 'मुझे एक कॉफ़ी पिलाएँ',
    tipNote: 'कोई भी राशि, एक बार। यह उनकी साइट पर खुलता है, मेरी साइट पर नहीं।',
    back: 'किताबों पर वापस जाएँ',
  },

  // ----------------------------------------------------------- Vietnamese --
  vi: {
    title: 'Từ Band 5.5 lên Band 8 — Một câu chuyện có thật',
    description:
      'Tôi đã đi từ band 5.5 lên band 8 trong mười chín tháng như thế nào, và vì sao tôi viết những cuốn sách luyện thi tiếng Anh miễn phí.',
    englishLabel: 'English',
    // The language's own name, used in the row on the English pages.
    nativeName: 'Tiếng Việt',
    lede:
      'Chào các bạn,<br>\n  tôi là người đã tạo ra <a href="' +
      BOOKS_URL +
      '" rel="noopener">freeieltsbooks.net</a>.',
    affiliation:
      'Trang này là của riêng tôi &mdash; nó không thuộc trang web kia, và không liên\n  kết, không được chứng thực bởi, cũng không có quan hệ gì với IELTS, British\n  Council, IDP hay Cambridge Assessment English.',
    story: [
      'Tôi bắt đầu ở band 5.5.',
      'Điều đầu tiên thay đổi không phải là tiếng Anh của tôi. Tôi tự nhủ\n  <em>mình làm được</em> &mdash; và vào những ngày điều đó nghe không thật, tôi\n  lại tự nhủ lần nữa. Động lực có vẻ là thứ ít thực tế nhất trong danh sách này.\n  Nó là lý do mọi thứ còn lại kéo dài mười chín tháng thay vì hai tuần.',
      'Rồi tôi thôi viết bằng những từ chung chung. Tôi hay viết\n  <em>một điều tồi tệ</em> trong khi ý tôi là <em>một thảm họa kinh tế</em>. Sự mơ\n  hồ đó là phần lớn thứ ghìm điểm của tôi lại &mdash; ý tưởng thì có, còn ngôn ngữ\n  làm chúng bẹp đi. Tôi bắt đầu một cuốn sổ ghi các collocation, những từ hay đứng\n  cạnh nhau, và cứ thêm vào cho đến khi các cụm từ tự bật ra mà không phải đi tìm.',
      'Với phần nói, tôi ghi âm giọng mình rồi nghe lại. Việc đó khó chịu, và là cách\n  nhanh nhất để nghe được điều mà giám khảo nghe thấy. Sau đó tôi nghe tin tức và\n  podcast để lấy nhịp điệu chứ không phải từ vựng &mdash; chỗ người nói trôi chảy\n  chậm lại, nối các từ, dừng lại &mdash; rồi bắt chước.',
      'Mười chín tháng luyện tập mỗi ngày đưa tôi từ 5.5 lên 8.',
      'Sau đó tôi quyết định chia sẻ những gì mình đã đúc kết, dưới dạng sách luyện thi\n  tiếng Anh miễn phí. Sách tải miễn phí, không đăng ký và không tài khoản, tại\n  <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    ],
    tip:
      'Bạn có thể để lại một khoản ủng hộ tự nguyện ở đây. Nó chỉ dùng để trang trải\n  chi phí lưu trữ, tên miền và dịch thuật &mdash; không có gì được bán, và nó không\n  bắt buộc để dùng bất kỳ cuốn sách nào.',
    kofi: 'Ủng hộ tôi trên Ko-fi',
    bmc: 'Mời tôi một ly cà phê',
    tipNote: 'Số tiền tùy ý, một lần. Nó mở trên trang của họ, không phải trang của tôi.',
    back: 'Quay lại trang sách',
  },

  // ------------------------------------------------ Portuguese (Brazilian) --
  'pt-br': {
    title: 'De Band 5.5 a Band 8 — Uma história real',
    description:
      'Como fui do band 5.5 ao band 8 em dezenove meses, e por que escrevi livros gratuitos de preparação para exames de inglês.',
    englishLabel: 'English',
    // The language's own name, used in the row on the English pages.
    nativeName: 'Português',
    lede:
      'Olá, amigos,<br>\n  eu criei o <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    affiliation:
      'Esta página é minha, pessoalmente &mdash; não faz parte daquele site e não é\n  afiliada, endossada nem ligada ao IELTS, ao British Council, ao IDP ou ao\n  Cambridge Assessment English.',
    story: [
      'Comecei no band 5.5.',
      'A primeira coisa que mudou não foi o meu inglês. Eu dizia a mim mesmo\n  <em>você consegue</em> &mdash; e nos dias em que isso não parecia verdade, eu\n  dizia de novo. A motivação parece a coisa menos prática desta lista. É a razão\n  de o resto ter durado dezenove meses, e não duas semanas.',
      'Depois parei de escrever com palavras genéricas. Eu escrevia\n  <em>uma coisa ruim</em> onde queria dizer <em>um desastre econômico</em>. Essa\n  vagueza era a maior parte do que segurava a minha nota &mdash; as ideias estavam\n  lá, e a língua as achatava. Comecei um caderno de colocações, as palavras que\n  vivem umas ao lado das outras, e fui acrescentando até as expressões saírem sem\n  eu ter de buscá-las.',
      'Para o speaking, gravei a minha própria voz e escutei. É desconfortável, e é a\n  maneira mais rápida de ouvir o que o examinador ouve. Depois passei a ouvir\n  noticiários e podcasts pelo ritmo, não pelo vocabulário &mdash; onde um falante\n  fluente desacelera, junta as palavras, para &mdash; e imitei.',
      'Dezenove meses de prática diária me levaram de 5.5 a 8.',
      'Depois disso decidi compartilhar o que eu tinha descoberto, em forma de livros\n  gratuitos de preparação para exames de inglês. São gratuitos para baixar, sem\n  cadastro e sem conta, em\n  <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    ],
    tip:
      'Você pode deixar uma contribuição voluntária aqui. Ela cobre apenas os custos de\n  hospedagem, domínios e tradução &mdash; nada é vendido, e não é necessária para\n  usar nenhum dos livros.',
    kofi: 'Apoie-me no Ko-fi',
    bmc: 'Pague-me um café',
    tipNote: 'Qualquer valor, uma única vez. Abre no site deles, não no meu.',
    back: 'Voltar aos livros',
  },

  // -------------------------------------------------- Chinese (Simplified) --
  // -------------------------------------------------- Chinese (Simplified) --
  //
  // Two typographic rules this block follows and the other five do not.
  //
  // No source line wrapping. A newline in HTML markup renders as a space, and
  // Chinese has no spaces between words, so a wrapped source line put a
  // visible gap in the middle of a sentence — caught by rendering the page,
  // not by reading the file. Every string here stays on one line however long
  // it gets.
  //
  // The dash is —— (two em dashes, no surrounding spaces), which is the
  // Chinese dash. A single spaced &mdash; is the English one and reads as
  // foreign punctuation here. The title already used —— before this file
  // existed; the body now agrees with it.
  zh: {
    title: '从 5.5 分到 8 分 —— 一个真实的故事',
    description: '我如何在十九个月里从 5.5 分考到 8 分，以及我为什么写了免费的英语考试备考书。',
    englishLabel: 'English',
    // The language's own name, used in the row on the English pages.
    nativeName: '中文',
    lede: '朋友们好，<br>\n  <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a> 是我做的。',
    affiliation:
      '这个页面属于我个人——它不是那个网站的一部分，也与 IELTS、British Council、IDP 或 Cambridge Assessment English 没有隶属、认可或关联关系。',
    story: [
      '我是从 5.5 分开始的。',
      '最先改变的并不是我的英语。我对自己说<em>你可以做到</em>——在那些听起来不像真话的日子里，我就再说一遍。在这份清单里，动力看上去是最不实用的一项。它却是其余一切能坚持十九个月、而不是两个星期的原因。',
      '然后我不再用笼统的词写作。我想说的是<em>一场经济灾难</em>，写出来却是<em>一件坏事</em>。把我的分数压住的，多半就是这种含糊——想法本来就在，是语言把它们压平了。我开始记一本搭配（collocation）笔记，也就是那些常常挨在一起的词，一直往里加，直到这些短语不用去找就能出来。',
      '口语方面，我录下自己的声音再听回去。这并不舒服，却是听见考官所听见的最快方式。之后我听新闻和播客，听的是节奏而不是词汇——流利的人在哪里放慢、在哪里把词连起来、在哪里停顿——然后模仿。',
      '十九个月的每日练习把我从 5.5 分带到了 8 分。',
      '后来我决定把自己摸索出来的东西分享出来，做成免费的英语考试备考书。它们可以免费下载，无需注册、无需账户，就在 <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>。',
    ],
    tip: '你可以在这里留下一笔自愿的赞赏。它仅用于支付托管、域名与翻译费用——所有资料均不出售，而且使用任何一本书都不需要它。',
    kofi: '在 Ko-fi 上支持我',
    bmc: '请我喝杯咖啡',
    tipNote: '金额随意，仅一次。它会在他们的网站上打开，而不是我的网站。',
    back: '返回书籍页面',
  },

  // --------------------------------------------------------------- Arabic --
  ar: {
    title: 'من Band 5.5 إلى Band 8 — قصة حقيقية',
    description:
      'كيف انتقلت من الدرجة 5.5 إلى الدرجة 8 في تسعة عشر شهرًا، ولماذا كتبت كتبًا مجانية للتحضير لامتحانات الإنجليزية.',
    englishLabel: 'English',
    // The language's own name, used in the row on the English pages.
    nativeName: 'العربية',
    lede:
      'مرحبًا أصدقائي،<br>\n  أنا من أنشأ <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    affiliation:
      'هذه الصفحة تخصّني شخصيًا &mdash; فهي ليست جزءًا من ذلك الموقع، وليست تابعة\n  لـ IELTS أو British Council أو IDP أو Cambridge Assessment English، ولا معتمدة\n  منها ولا مرتبطة بها.',
    story: [
      'بدأت من الدرجة 5.5.',
      'أول ما تغيّر لم يكن إنجليزيتي. قلت لنفسي <em>أنت قادر على ذلك</em> &mdash; وفي\n  الأيام التي لم يبدُ فيها ذلك صحيحًا، قلتها لنفسي من جديد. يبدو الحافز أقلّ الأشياء\n  عمليةً في هذه القائمة. وهو السبب في أن ما تبقّى استمرّ تسعة عشر شهرًا بدل أسبوعين.',
      'ثم توقفت عن الكتابة بكلمات عامة. كنت أكتب <em>أمرًا سيئًا</em> وأنا أقصد\n  <em>كارثة اقتصادية</em>. ذلك الغموض كان معظم ما يبقي درجتي منخفضة &mdash; الأفكار\n  كانت موجودة، واللغة كانت تسطّحها. بدأت دفترًا للمتلازمات اللفظية، أي الكلمات التي\n  تعيش بجوار بعضها، وظللت أضيف إليه حتى صارت العبارات تأتي من تلقاء نفسها دون أن\n  أبحث عنها.',
      'أما المحادثة، فكنت أسجّل صوتي وأستمع إليه. الأمر غير مريح، وهو أسرع طريقة لتسمع\n  ما يسمعه المصحّح. ثم استمعت إلى الأخبار وإلى البودكاست من أجل الإيقاع لا المفردات\n  &mdash; أين يبطئ المتحدث الطليق، وأين يصل الكلمات، وأين يتوقف &mdash; وقلّدت ذلك.',
      'تسعة عشر شهرًا من الممارسة اليومية أخذتني من 5.5 إلى 8.',
      'بعد ذلك قررت أن أشارك ما توصّلت إليه، في صورة كتب مجانية للتحضير لامتحانات\n  الإنجليزية. تحميلها مجاني، بلا تسجيل وبلا حساب، على\n  <a href="' + BOOKS_URL + '" rel="noopener">freeieltsbooks.net</a>.',
    ],
    tip:
      'يمكنك أن تترك هنا تبرّعًا طوعيًا. هو يغطي تكاليف الاستضافة والنطاقات والترجمة\n  فقط &mdash; لا يُباع شيء، وليس مطلوبًا لاستخدام أيٍّ من الكتب.',
    kofi: 'ادعمني على Ko-fi',
    bmc: 'اشترِ لي قهوة',
    tipNote: 'أي مبلغ، مرة واحدة. يفتح على موقعهم لا على موقعي.',
    back: 'العودة إلى الكتب',
  },
};
