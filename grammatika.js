const GRAMMAR_CASES = [
    {
        id: 1,
        name: "Именительный",
        nameUz: "Bosh kelishik",
        question: "кто? что?",
        questionUz: "kim? nima?",
        color: "#6366f1",
        explanation: {
            ru: "Это основной, начальный падеж. Слово в именительном падеже отвечает на вопросы «кто?» или «что?». Это форма слова, которую вы найдёте в словаре.",
            uz: "Bu asosiy, boshlang'ich kelishik. So'z \"kim?\" yoki \"nima?\" savollariga javob beradi. Lug'atda so'zlar aynan shu shaklda yoziladi."
        },
        whenToUse: [
            {
                ru: "Подлежащее — кто или что делает действие",
                uz: "Ega — kim yoki nima ish bajarayotganini bildiradi",
                example: { ru: "Студент читает книгу.", uz: "Talaba kitob o'qiydi.", highlight: "Студент" }
            },
            {
                ru: "После слова «это»",
                uz: "\"Это\" (bu) so'zidan keyin",
                example: { ru: "Это новый дом.", uz: "Bu yangi uy.", highlight: "дом" }
            },
            {
                ru: "После глагола «быть» (есть, был, будет)",
                uz: "\"Bo'lmoq\" fe'lidan keyin (есть, был, будет)",
                example: { ru: "Мой брат — врач.", uz: "Mening akam — shifokor.", highlight: "врач" }
            },
            {
                ru: "Когда называем или представляем кого-то",
                uz: "Biror kishini tanishtirganда yoki nomlaganda",
                example: { ru: "Меня зовут Анвар.", uz: "Mening ismim Anvar.", highlight: "Анвар" }
            }
        ],
        endings: {
            masculine: {
                singular: "— (нулевое) / -ь",
                plural: "-ы, -и",
                examples: [
                    { sg: "студент", pl: "студенты" },
                    { sg: "дом", pl: "дома" },
                    { sg: "учитель", pl: "учителя" }
                ]
            },
            feminine: {
                singular: "-а, -я, -ь",
                plural: "-ы, -и",
                examples: [
                    { sg: "книга", pl: "книги" },
                    { sg: "земля", pl: "земли" },
                    { sg: "тетрадь", pl: "тетради" }
                ]
            },
            neuter: {
                singular: "-о, -е, -ие",
                plural: "-а, -я, -ия",
                examples: [
                    { sg: "окно", pl: "окна" },
                    { sg: "море", pl: "моря" },
                    { sg: "здание", pl: "здания" }
                ]
            }
        },
        adjEndings: {
            masculine: { sg: "-ый, -ий, -ой", pl: "-ые, -ие", example: { sg: "новый дом", pl: "новые дома" } },
            feminine: { sg: "-ая, -яя", pl: "-ые, -ие", example: { sg: "новая книга", pl: "новые книги" } },
            neuter: { sg: "-ое, -ее", pl: "-ые, -ие", example: { sg: "новое окно", pl: "новые окна" } }
        },
        examples: [
            { ru: "Красивая девушка идёт по улице.", uz: "Chiroyli qiz ko'chada ketayapti.", highlight: "Красивая девушка" },
            { ru: "Большой город никогда не спит.", uz: "Katta shahar hech qachon uxlamaydi.", highlight: "Большой город" },
            { ru: "Маленький ребёнок играет.", uz: "Kichkina bola o'ynayapti.", highlight: "Маленький ребёнок" },
            { ru: "Русский язык — красивый.", uz: "Rus tili — chiroyli.", highlight: "Русский язык" },
            { ru: "Холодная зима закончилась.", uz: "Sovuq qish tugadi.", highlight: "Холодная зима" },
            { ru: "Это хороший учитель.", uz: "Bu yaxshi o'qituvchi.", highlight: "хороший учитель" }
        ],
        commonMistakes: [
            {
                wrong: "Мне нравится красивая музыка. → Кто? Что? — музыка ✓",
                correct: "Именительный падеж используется, когда слово — подлежащее или после «это».",
                explanation: {
                    ru: "Помните: именительный — это начальная форма слова. Если слово отвечает на вопрос «кто?» или «что?» как подлежащее — это именительный падеж.",
                    uz: "Eslab qoling: bosh kelishik — so'zning boshlang'ich shakli. Agar so'z \"kim?\" yoki \"nima?\" savoliga ega sifatida javob bersa — bu bosh kelishik."
                }
            }
        ]
    },
    {
        id: 2,
        name: "Родительный",
        nameUz: "Qaratqich kelishik",
        question: "кого? чего?",
        questionUz: "kimning? nimaning?",
        color: "#8b5cf6",
        explanation: {
            ru: "Родительный падеж показывает принадлежность (чей?), отсутствие (нет чего?) и количество (много чего?). Это один из самых частых падежей в русском языке.",
            uz: "Qaratqich kelishik egalikni (kimning?), yo'qlikni (nima yo'q?) va miqdorni (nima ko'p?) bildiradi. Rus tilida eng ko'p ishlatiladigan kelishiklardan biri."
        },
        whenToUse: [
            {
                ru: "Принадлежность — чей? чья? чьё?",
                uz: "Egalik — kimning? nimaning?",
                example: { ru: "Книга брата лежит на столе.", uz: "Akaning kitobi stolda yotibdi.", highlight: "брата" }
            },
            {
                ru: "Отсутствие — после «нет», «не было», «не будет»",
                uz: "Yo'qlik — \"нет\", \"не было\", \"не будет\" dan keyin",
                example: { ru: "У меня нет машины.", uz: "Mening mashinam yo'q.", highlight: "машины" }
            },
            {
                ru: "Количество — много, мало, сколько, несколько",
                uz: "Miqdor — ko'p, oz, qancha, bir necha",
                example: { ru: "В классе много студентов.", uz: "Sinfda ko'p talaba bor.", highlight: "студентов" }
            },
            {
                ru: "После предлогов: от, до, из, без, для, у, около, после",
                uz: "Predloglardan keyin: от, до, из, без, для, у, около, после",
                example: { ru: "Я пришёл из магазина.", uz: "Men do'kondan keldim.", highlight: "магазина" }
            },
            {
                ru: "После числительных 2, 3, 4 + родительный единственного",
                uz: "2, 3, 4 sonlaridan keyin — birlik qaratqich",
                example: { ru: "У меня два брата.", uz: "Mening ikki akam bor.", highlight: "брата" }
            }
        ],
        endings: {
            masculine: {
                singular: "-а, -я",
                plural: "-ов, -ев, -ей, —",
                examples: [
                    { sg: "студента", pl: "студентов" },
                    { sg: "дома", pl: "домов" },
                    { sg: "учителя", pl: "учителей" }
                ]
            },
            feminine: {
                singular: "-ы, -и",
                plural: "—, -ей",
                examples: [
                    { sg: "книги", pl: "книг" },
                    { sg: "земли", pl: "земель" },
                    { sg: "тетради", pl: "тетрадей" }
                ]
            },
            neuter: {
                singular: "-а, -я",
                plural: "—, -ей, -ий",
                examples: [
                    { sg: "окна", pl: "окон" },
                    { sg: "моря", pl: "морей" },
                    { sg: "здания", pl: "зданий" }
                ]
            }
        },
        adjEndings: {
            masculine: { sg: "-ого, -его", pl: "-ых, -их", example: { sg: "нового дома", pl: "новых домов" } },
            feminine: { sg: "-ой, -ей", pl: "-ых, -их", example: { sg: "новой книги", pl: "новых книг" } },
            neuter: { sg: "-ого, -его", pl: "-ых, -их", example: { sg: "нового окна", pl: "новых окон" } }
        },
        examples: [
            { ru: "Это машина моего отца.", uz: "Bu mening otamning mashinasi.", highlight: "отца" },
            { ru: "У неё нет времени.", uz: "Uning vaqti yo'q.", highlight: "времени" },
            { ru: "Я купил килограмм сахара.", uz: "Men bir kilo shakar sotib oldim.", highlight: "сахара" },
            { ru: "Мы приехали из Ташкента.", uz: "Biz Toshkentdan keldik.", highlight: "Ташкента" },
            { ru: "Около дома растёт дерево.", uz: "Uy yonida daraxt o'smoqda.", highlight: "дома" },
            { ru: "Без хорошего образования трудно.", uz: "Yaxshi ma'lumotsiz qiyin.", highlight: "хорошего образования" }
        ],
        commonMistakes: [
            {
                wrong: "У меня нет брат.",
                correct: "У меня нет брата.",
                explanation: {
                    ru: "После «нет» всегда используется родительный падеж: нет кого? чего? — нет брата.",
                    uz: "\"Нет\" dan keyin har doim qaratqich kelishik ishlatiladi: нет кого? чего? — нет брата."
                }
            },
            {
                wrong: "Много студент в классе.",
                correct: "Много студентов в классе.",
                explanation: {
                    ru: "После слов «много», «мало», «сколько» нужен родительный падеж множественного числа.",
                    uz: "\"Много\", \"мало\", \"сколько\" so'zlaridan keyin ko'plik qaratqich kelishik kerak."
                }
            }
        ]
    },
    {
        id: 3,
        name: "Дательный",
        nameUz: "Jo'nalish kelishik",
        question: "кому? чему?",
        questionUz: "kimga? nimaga?",
        color: "#06b6d4",
        explanation: {
            ru: "Дательный падеж показывает, кому или чему направлено действие. Отвечает на вопросы «кому?» и «чему?». Часто используется с глаголами давать, помогать, звонить.",
            uz: "Jo'nalish kelishik harakat kimga yoki nimaga qaratilganini ko'rsatadi. \"Kimga?\" va \"nimaga?\" savollariga javob beradi. Ko'pincha bermoq, yordam bermoq, qo'ng'iroq qilmoq fe'llari bilan ishlatiladi."
        },
        whenToUse: [
            {
                ru: "Кому даём, говорим, пишем, звоним",
                uz: "Kimga beramiz, gapiramiz, yozamiz, qo'ng'iroq qilamiz",
                example: { ru: "Я дал книгу другу.", uz: "Men do'stimga kitob berdim.", highlight: "другу" }
            },
            {
                ru: "Возраст — кому сколько лет",
                uz: "Yosh — kimga necha yosh",
                example: { ru: "Мне двадцать лет.", uz: "Menga yigirma yosh.", highlight: "Мне" }
            },
            {
                ru: "Нравится, нужно, можно, надо + кому",
                uz: "Yoqmoq, kerak, mumkin + kimga",
                example: { ru: "Студентам нужен словарь.", uz: "Talabalarga lug'at kerak.", highlight: "Студентам" }
            },
            {
                ru: "После предлогов «к» (к кому?) и «по» (по чему?)",
                uz: "\"К\" (kimga qarab?) va \"по\" (nima bo'ylab?) predloglaridan keyin",
                example: { ru: "Я иду к врачу.", uz: "Men shifokorga ketayapman.", highlight: "врачу" }
            },
            {
                ru: "Кому помогаем, мешаем, советуем",
                uz: "Kimga yordam beramiz, xalaqit beramiz, maslahat beramiz",
                example: { ru: "Мама помогает дочери.", uz: "Ona qiziga yordam beradi.", highlight: "дочери" }
            }
        ],
        endings: {
            masculine: {
                singular: "-у, -ю",
                plural: "-ам, -ям",
                examples: [
                    { sg: "студенту", pl: "студентам" },
                    { sg: "дому", pl: "домам" },
                    { sg: "учителю", pl: "учителям" }
                ]
            },
            feminine: {
                singular: "-е, -и",
                plural: "-ам, -ям",
                examples: [
                    { sg: "книге", pl: "книгам" },
                    { sg: "земле", pl: "землям" },
                    { sg: "тетради", pl: "тетрадям" }
                ]
            },
            neuter: {
                singular: "-у, -ю",
                plural: "-ам, -ям",
                examples: [
                    { sg: "окну", pl: "окнам" },
                    { sg: "морю", pl: "морям" },
                    { sg: "зданию", pl: "зданиям" }
                ]
            }
        },
        adjEndings: {
            masculine: { sg: "-ому, -ему", pl: "-ым, -им", example: { sg: "новому другу", pl: "новым друзьям" } },
            feminine: { sg: "-ой, -ей", pl: "-ым, -им", example: { sg: "новой подруге", pl: "новым подругам" } },
            neuter: { sg: "-ому, -ему", pl: "-ым, -им", example: { sg: "новому окну", pl: "новым окнам" } }
        },
        examples: [
            { ru: "Я позвонил маме.", uz: "Men onaga qo'ng'iroq qildim.", highlight: "маме" },
            { ru: "Учитель объяснил ученикам правило.", uz: "O'qituvchi o'quvchilarga qoidani tushuntirdi.", highlight: "ученикам" },
            { ru: "Ему нравится музыка.", uz: "Unga musiqa yoqadi.", highlight: "Ему" },
            { ru: "Сестре исполнилось восемнадцать лет.", uz: "Singil o'n sakkiz yoshga to'ldi.", highlight: "Сестре" },
            { ru: "Детям нужно больше гулять.", uz: "Bolalarga ko'proq sayr qilish kerak.", highlight: "Детям" },
            { ru: "Я написал письмо бабушке.", uz: "Men buviga xat yozdim.", highlight: "бабушке" }
        ],
        commonMistakes: [
            {
                wrong: "Я звоню мама.",
                correct: "Я звоню маме.",
                explanation: {
                    ru: "После глагола «звонить» нужен дательный падеж: звоню кому? — маме.",
                    uz: "\"Звонить\" fe'lidan keyin jo'nalish kelishik kerak: звоню кому? — маме."
                }
            },
            {
                wrong: "Мне двадцать год.",
                correct: "Мне двадцать лет.",
                explanation: {
                    ru: "Возраст: мне/тебе/ему (дательный) + число + лет/год/года.",
                    uz: "Yosh: мне/тебе/ему (jo'nalish) + son + лет/год/года."
                }
            }
        ]
    },
    {
        id: 4,
        name: "Винительный",
        nameUz: "Tushum kelishik",
        question: "кого? что?",
        questionUz: "kimni? nimani?",
        color: "#f59e0b",
        explanation: {
            ru: "Винительный падеж показывает прямой объект действия — на кого или на что направлено действие. Отвечает на вопросы «кого?» и «что?». Самый частый падеж после именительного.",
            uz: "Tushum kelishik to'g'ri to'ldiruvchini — harakat kimga yoki nimaga qaratilganini ko'rsatadi. \"Kimni?\" va \"nimani?\" savollariga javob beradi. Bosh kelishikdan keyin eng ko'p ishlatiladigan kelishik."
        },
        whenToUse: [
            {
                ru: "Прямое дополнение — что делаем? с чем?",
                uz: "To'g'ri to'ldiruvchi — nimani qilamiz?",
                example: { ru: "Я читаю книгу.", uz: "Men kitob o'qiyapman.", highlight: "книгу" }
            },
            {
                ru: "Направление движения — куда? (в, на)",
                uz: "Harakat yo'nalishi — qayerga? (в, на)",
                example: { ru: "Я иду в школу.", uz: "Men maktabga ketayapman.", highlight: "школу" }
            },
            {
                ru: "День недели — в какой день?",
                uz: "Hafta kuni — qaysi kuni?",
                example: { ru: "Мы встретимся в среду.", uz: "Biz chorshanba kuni uchrashamiz.", highlight: "среду" }
            },
            {
                ru: "После глаголов: видеть, знать, любить, ждать, слушать",
                uz: "Fe'llardan keyin: ko'rmoq, bilmoq, sevmoq, kutmoq, tinglamoq",
                example: { ru: "Я люблю свою маму.", uz: "Men onamni sevaman.", highlight: "маму" }
            }
        ],
        endings: {
            masculine: {
                singular: "неодуш.: = Им. / одуш.: = Род. (-а, -я)",
                plural: "неодуш.: = Им. / одуш.: = Род.",
                examples: [
                    { sg: "дом (неод.) / брата (одуш.)", pl: "дома (неод.) / братьев (одуш.)" },
                    { sg: "стол (неод.) / друга (одуш.)", pl: "столы (неод.) / друзей (одуш.)" }
                ]
            },
            feminine: {
                singular: "-у, -ю",
                plural: "неодуш.: = Им. / одуш.: = Род.",
                examples: [
                    { sg: "книгу", pl: "книги (неод.) / сестёр (одуш.)" },
                    { sg: "землю", pl: "земли (неод.)" },
                    { sg: "тетрадь", pl: "тетради" }
                ]
            },
            neuter: {
                singular: "= Именительный (-о, -е)",
                plural: "= Именительный (-а, -я)",
                examples: [
                    { sg: "окно", pl: "окна" },
                    { sg: "море", pl: "моря" },
                    { sg: "здание", pl: "здания" }
                ]
            }
        },
        adjEndings: {
            masculine: { sg: "неодуш.: -ый/-ий / одуш.: -ого/-его", pl: "неодуш.: -ые/-ие / одуш.: -ых/-их", example: { sg: "новый дом / нового друга", pl: "новые дома / новых друзей" } },
            feminine: { sg: "-ую, -юю", pl: "неодуш.: -ые/-ие / одуш.: -ых/-их", example: { sg: "новую книгу", pl: "новые книги / новых подруг" } },
            neuter: { sg: "-ое, -ее", pl: "-ые, -ие", example: { sg: "новое окно", pl: "новые окна" } }
        },
        examples: [
            { ru: "Мама готовит вкусный обед.", uz: "Ona mazali tushlik tayyorlayapti.", highlight: "вкусный обед" },
            { ru: "Дети смотрят интересный фильм.", uz: "Bolalar qiziqarli film ko'rayapti.", highlight: "интересный фильм" },
            { ru: "Я встретил старого друга.", uz: "Men eski do'stimni uchratdim.", highlight: "старого друга" },
            { ru: "Студенты изучают русский язык.", uz: "Talabalar rus tilini o'rganayapti.", highlight: "русский язык" },
            { ru: "Мы поедем в новый город.", uz: "Biz yangi shaharga boramiz.", highlight: "новый город" },
            { ru: "Она купила красивую сумку.", uz: "U chiroyli sumka sotib oldi.", highlight: "красивую сумку" }
        ],
        commonMistakes: [
            {
                wrong: "Я вижу студент.",
                correct: "Я вижу студента.",
                explanation: {
                    ru: "Одушевлённые существительные мужского рода в винительном = родительному: студент → студента.",
                    uz: "Jonli otlar mujskoy rodda tushum = qaratqichga: студент → студента."
                }
            },
            {
                wrong: "Я читаю книга.",
                correct: "Я читаю книгу.",
                explanation: {
                    ru: "Женский род меняет окончание: -а → -у, -я → -ю.",
                    uz: "Jenskiy rod qo'shimchasi o'zgaradi: -а → -у, -я → -ю."
                }
            }
        ]
    },
    {
        id: 5,
        name: "Творительный",
        nameUz: "Vosita kelishik",
        question: "кем? чем?",
        questionUz: "kim bilan? nima bilan?",
        color: "#22c55e",
        explanation: {
            ru: "Творительный падеж показывает, с кем или чем мы делаем что-то, каким инструментом пользуемся. Отвечает на вопросы «кем?» и «чем?». Часто используется с предлогом «с» (с кем?).",
            uz: "Vosita kelishik kim bilan yoki nima bilan ish qilayotganimizni, qanday asbob ishlatayotganimizni ko'rsatadi. \"Kim bilan?\" va \"nima bilan?\" savollariga javob beradi. Ko'pincha \"с\" (bilan) predlogi bilan ishlatiladi."
        },
        whenToUse: [
            {
                ru: "С кем? — совместное действие (с + творительный)",
                uz: "Kim bilan? — birgalikdagi harakat (с + vosita)",
                example: { ru: "Я гуляю с другом.", uz: "Men do'stim bilan sayr qilyapman.", highlight: "другом" }
            },
            {
                ru: "Чем? — инструмент, средство",
                uz: "Nima bilan? — asbob, vosita",
                example: { ru: "Я пишу ручкой.", uz: "Men ruchka bilan yozyapman.", highlight: "ручкой" }
            },
            {
                ru: "Профессия — работать кем? быть кем?",
                uz: "Kasb — kim bo'lib ishlash?",
                example: { ru: "Он работает врачом.", uz: "U shifokor bo'lib ishlaydi.", highlight: "врачом" }
            },
            {
                ru: "Время — утром, вечером, весной, летом, осенью, зимой",
                uz: "Vaqt — ertalab, kechqurun, bahorda, yozda, kuzda, qishda",
                example: { ru: "Летом мы ездим на море.", uz: "Yozda biz dengizga boramiz.", highlight: "Летом" }
            },
            {
                ru: "После предлогов: с, за, между, над, под, перед",
                uz: "Predloglardan keyin: с, за, между, над, под, перед",
                example: { ru: "Кошка сидит под столом.", uz: "Mushuk stol tagida o'tiribdi.", highlight: "столом" }
            }
        ],
        endings: {
            masculine: {
                singular: "-ом, -ем, -ём",
                plural: "-ами, -ями",
                examples: [
                    { sg: "студентом", pl: "студентами" },
                    { sg: "домом", pl: "домами" },
                    { sg: "учителем", pl: "учителями" }
                ]
            },
            feminine: {
                singular: "-ой, -ей, -ью",
                plural: "-ами, -ями",
                examples: [
                    { sg: "книгой", pl: "книгами" },
                    { sg: "землёй", pl: "землями" },
                    { sg: "тетрадью", pl: "тетрадями" }
                ]
            },
            neuter: {
                singular: "-ом, -ем",
                plural: "-ами, -ями",
                examples: [
                    { sg: "окном", pl: "окнами" },
                    { sg: "морем", pl: "морями" },
                    { sg: "зданием", pl: "зданиями" }
                ]
            }
        },
        adjEndings: {
            masculine: { sg: "-ым, -им", pl: "-ыми, -ими", example: { sg: "новым другом", pl: "новыми друзьями" } },
            feminine: { sg: "-ой, -ей", pl: "-ыми, -ими", example: { sg: "новой книгой", pl: "новыми книгами" } },
            neuter: { sg: "-ым, -им", pl: "-ыми, -ими", example: { sg: "новым окном", pl: "новыми окнами" } }
        },
        examples: [
            { ru: "Я пью чай с молоком.", uz: "Men sut bilan choy ichyapman.", highlight: "молоком" },
            { ru: "Брат стал инженером.", uz: "Aka muhandis bo'ldi.", highlight: "инженером" },
            { ru: "Мы разговариваем с соседями.", uz: "Biz qo'shnilar bilan gaplashyapmiz.", highlight: "соседями" },
            { ru: "Она режет хлеб ножом.", uz: "U pichoq bilan non kesyapti.", highlight: "ножом" },
            { ru: "Зимой на улице холодно.", uz: "Qishda ko'chada sovuq.", highlight: "Зимой" },
            { ru: "За домом находится сад.", uz: "Uy orqasida bog' bor.", highlight: "домом" }
        ],
        commonMistakes: [
            {
                wrong: "Он работает врач.",
                correct: "Он работает врачом.",
                explanation: {
                    ru: "После глаголов «работать», «быть», «стать» нужен творительный падеж: кем? — врачом.",
                    uz: "\"Работать\", \"быть\", \"стать\" fe'llaridan keyin vosita kelishik kerak: кем? — врачом."
                }
            },
            {
                wrong: "Я иду с друг.",
                correct: "Я иду с другом.",
                explanation: {
                    ru: "После предлога «с» (= вместе) нужен творительный падеж: с кем? — с другом.",
                    uz: "\"С\" (bilan) predlogidan keyin vosita kelishik kerak: с кем? — с другом."
                }
            }
        ]
    },
    {
        id: 6,
        name: "Предложный",
        nameUz: "O'rin-payt kelishik",
        question: "о ком? о чём? где?",
        questionUz: "kim haqida? nima haqida? qayerda?",
        color: "#ef4444",
        explanation: {
            ru: "Предложный падеж всегда используется с предлогом — «в», «на», «о», «об», «при». Показывает место (где?) и тему разговора (о чём?). Без предлога этот падеж не существует!",
            uz: "O'rin-payt kelishik har doim predlog bilan ishlatiladi — \"в\", \"на\", \"о\", \"об\", \"при\". Joyni (qayerda?) va suhbat mavzusini (nima haqida?) bildiradi. Predlogsiz bu kelishik mavjud emas!"
        },
        whenToUse: [
            {
                ru: "Место — где? (в + предложный, на + предложный)",
                uz: "Joy — qayerda? (в + o'rin-payt, на + o'rin-payt)",
                example: { ru: "Я живу в Ташкенте.", uz: "Men Toshkentda yashayman.", highlight: "Ташкенте" }
            },
            {
                ru: "Тема разговора — о ком? о чём?",
                uz: "Suhbat mavzusi — kim haqida? nima haqida?",
                example: { ru: "Мы говорим о погоде.", uz: "Biz ob-havo haqida gaplashyapmiz.", highlight: "погоде" }
            },
            {
                ru: "Транспорт — на чём? (ехать на автобусе)",
                uz: "Transport — nimada? (avtobusda bormoq)",
                example: { ru: "Я еду на автобусе.", uz: "Men avtobusda ketayapman.", highlight: "автобусе" }
            },
            {
                ru: "Время — в каком месяце? в каком году?",
                uz: "Vaqt — qaysi oyda? qaysi yilda?",
                example: { ru: "Он родился в январе.", uz: "U yanvarda tug'ilgan.", highlight: "январе" }
            },
            {
                ru: "После предлога «при» — при каком условии?",
                uz: "\"При\" predlogidan keyin — qanday sharoitda?",
                example: { ru: "При хорошей погоде мы поедем.", uz: "Ob-havo yaxshi bo'lsa, boramiz.", highlight: "хорошей погоде" }
            }
        ],
        endings: {
            masculine: {
                singular: "-е, -и, -у (в шкафу)",
                plural: "-ах, -ях",
                examples: [
                    { sg: "студенте", pl: "студентах" },
                    { sg: "доме", pl: "домах" },
                    { sg: "учителе", pl: "учителях" }
                ]
            },
            feminine: {
                singular: "-е, -и",
                plural: "-ах, -ях",
                examples: [
                    { sg: "книге", pl: "книгах" },
                    { sg: "земле", pl: "землях" },
                    { sg: "тетради", pl: "тетрадях" }
                ]
            },
            neuter: {
                singular: "-е, -и",
                plural: "-ах, -ях",
                examples: [
                    { sg: "окне", pl: "окнах" },
                    { sg: "море", pl: "морях" },
                    { sg: "здании", pl: "зданиях" }
                ]
            }
        },
        adjEndings: {
            masculine: { sg: "-ом, -ем", pl: "-ых, -их", example: { sg: "новом доме", pl: "новых домах" } },
            feminine: { sg: "-ой, -ей", pl: "-ых, -их", example: { sg: "новой книге", pl: "новых книгах" } },
            neuter: { sg: "-ом, -ем", pl: "-ых, -их", example: { sg: "новом окне", pl: "новых окнах" } }
        },
        examples: [
            { ru: "Дети играют в парке.", uz: "Bolalar parkda o'ynayapti.", highlight: "парке" },
            { ru: "Книга лежит на столе.", uz: "Kitob stolda yotibdi.", highlight: "столе" },
            { ru: "Я думаю о будущем.", uz: "Men kelajak haqida o'ylayapman.", highlight: "будущем" },
            { ru: "Студенты учатся в университете.", uz: "Talabalar universitetda o'qiydi.", highlight: "университете" },
            { ru: "Мы живём в большом городе.", uz: "Biz katta shaharda yashaymiz.", highlight: "большом городе" },
            { ru: "Она рассказала о своей семье.", uz: "U o'z oilasi haqida gapirib berdi.", highlight: "семье" }
        ],
        commonMistakes: [
            {
                wrong: "Я живу в Ташкент.",
                correct: "Я живу в Ташкенте.",
                explanation: {
                    ru: "После «в» и «на» (где?) нужен предложный падеж: в чём? — в Ташкенте.",
                    uz: "\"В\" va \"на\" (qayerda?) dan keyin o'rin-payt kelishik kerak: в чём? — в Ташкенте."
                }
            },
            {
                wrong: "Мы говорим о друг.",
                correct: "Мы говорим о друге.",
                explanation: {
                    ru: "После «о/об» всегда предложный падеж: о ком? — о друге.",
                    uz: "\"О/об\" dan keyin har doim o'rin-payt kelishik: о ком? — о друге."
                }
            }
        ]
    }
];
