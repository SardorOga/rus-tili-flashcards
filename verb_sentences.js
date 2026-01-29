// Fellar uchun gap mashqlari
// Har bir gap: { vI: verb index, asp: 'nsv'|'sv', tense: 'present'|'past'|'future', pIdx: person/gender index, sentence: gap, answer: to'g'ri javob }

const VERB_SENTENCES = [
    // делать / сделать - qilmoq
    { vI: 0, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ домашнее задание каждый день.", answer: "делаю" },
    { vI: 0, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Вчера я ___ всю работу.", answer: "сделал" },
    { vI: 0, asp: 'sv', tense: 'future', pIdx: 0, sentence: "Завтра я ___ это обязательно.", answer: "сделаю" },
    { vI: 0, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Он ___ ошибки в тексте.", answer: "делает" },

    // читать / прочитать - o'qimoq
    { vI: 1, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ книгу каждый вечер.", answer: "читаю" },
    { vI: 1, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я уже ___ эту книгу.", answer: "прочитал" },
    { vI: 1, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ это письмо завтра.", answer: "прочитаешь" },
    { vI: 1, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Они ___ газеты по утрам.", answer: "читают" },

    // писать / написать - yozmoq
    { vI: 2, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ письмо другу.", answer: "пишу" },
    { vI: 2, asp: 'sv', tense: 'past', pIdx: 1, sentence: "Ты уже ___ сочинение?", answer: "написала" },
    { vI: 2, asp: 'sv', tense: 'future', pIdx: 3, sentence: "Мы ___ отчёт на следующей неделе.", answer: "напишем" },
    { vI: 2, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Она ___ стихи.", answer: "пишет" },

    // говорить / сказать - gapirmoq
    { vI: 3, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ по-русски.", answer: "говорю" },
    { vI: 3, asp: 'sv', tense: 'past', pIdx: 2, sentence: "Он ___ мне правду.", answer: "сказал" },
    { vI: 3, asp: 'sv', tense: 'future', pIdx: 0, sentence: "Я ___ тебе позже.", answer: "скажу" },
    { vI: 3, asp: 'nsv', tense: 'present', pIdx: 4, sentence: "Вы ___ слишком быстро.", answer: "говорите" },

    // смотреть / посмотреть - qaramoq
    { vI: 4, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ телевизор вечером.", answer: "смотрю" },
    { vI: 4, asp: 'sv', tense: 'past', pIdx: 3, sentence: "Мы ___ этот фильм вчера.", answer: "посмотрели" },
    { vI: 4, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ на это завтра.", answer: "посмотришь" },
    { vI: 4, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Дети ___ мультфильмы.", answer: "смотрят" },

    // слушать / послушать - tinglamoq
    { vI: 5, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ музыку каждый день.", answer: "слушаю" },
    { vI: 5, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ твой совет.", answer: "послушал" },
    { vI: 5, asp: 'sv', tense: 'future', pIdx: 4, sentence: "Вы ___ эту песню?", answer: "послушаете" },
    { vI: 5, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Она ___ радио.", answer: "слушает" },

    // знать / узнать - bilmoq
    { vI: 6, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ этого человека.", answer: "знаю" },
    { vI: 6, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ об этом вчера.", answer: "узнал" },
    { vI: 6, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ правду скоро.", answer: "узнаешь" },
    { vI: 6, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Они ___ много языков.", answer: "знают" },

    // понимать / понять - tushunmoq
    { vI: 7, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ тебя хорошо.", answer: "понимаю" },
    { vI: 7, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Наконец я ___!", answer: "понял" },
    { vI: 7, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ это позже.", answer: "поймёшь" },
    { vI: 7, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Он не ___ шутки.", answer: "понимает" },

    // учить / выучить - o'rganmoq
    { vI: 8, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ русский язык.", answer: "учу" },
    { vI: 8, asp: 'sv', tense: 'past', pIdx: 3, sentence: "Мы ___ все слова.", answer: "выучили" },
    { vI: 8, asp: 'sv', tense: 'future', pIdx: 0, sentence: "Я ___ это стихотворение.", answer: "выучу" },
    { vI: 8, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Студенты ___ новые слова.", answer: "учат" },

    // работать / поработать - ishlamoq
    { vI: 9, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ в офисе.", answer: "работаю" },
    { vI: 9, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я хорошо ___ сегодня.", answer: "поработал" },
    { vI: 9, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Она ___ врачом.", answer: "работает" },
    { vI: 9, asp: 'nsv', tense: 'present', pIdx: 3, sentence: "Мы ___ вместе.", answer: "работаем" },

    // есть / съесть - yemoq
    { vI: 10, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ завтрак.", answer: "ем" },
    { vI: 10, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я уже ___ обед.", answer: "съел" },
    { vI: 10, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ это яблоко?", answer: "съешь" },
    { vI: 10, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Дети ___ мороженое.", answer: "едят" },

    // пить / выпить - ichmoq
    { vI: 11, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ кофе по утрам.", answer: "пью" },
    { vI: 11, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ весь чай.", answer: "выпил" },
    { vI: 11, asp: 'sv', tense: 'future', pIdx: 3, sentence: "Мы ___ за твоё здоровье!", answer: "выпьем" },
    { vI: 11, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Он ___ много воды.", answer: "пьёт" },

    // идти / пойти - yurmoq
    { vI: 12, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ домой.", answer: "иду" },
    { vI: 12, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ в магазин вчера.", answer: "пошёл" },
    { vI: 12, asp: 'sv', tense: 'future', pIdx: 3, sentence: "Мы ___ в кино завтра.", answer: "пойдём" },
    { vI: 12, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Они ___ на работу.", answer: "идут" },

    // ехать / поехать - bormoq (transport)
    { vI: 13, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ на автобусе.", answer: "еду" },
    { vI: 13, asp: 'sv', tense: 'past', pIdx: 3, sentence: "Мы ___ в Москву летом.", answer: "поехали" },
    { vI: 13, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ со мной?", answer: "поедешь" },
    { vI: 13, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Он ___ на машине.", answer: "едет" },

    // покупать / купить - sotib olmoq
    { vI: 14, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ продукты каждую неделю.", answer: "покупаю" },
    { vI: 14, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ новый телефон.", answer: "купил" },
    { vI: 14, asp: 'sv', tense: 'future', pIdx: 0, sentence: "Я ___ тебе подарок.", answer: "куплю" },
    { vI: 14, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Она ___ одежду.", answer: "покупает" },

    // давать / дать - bermoq
    { vI: 15, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ тебе книгу.", answer: "даю" },
    { vI: 15, asp: 'sv', tense: 'past', pIdx: 2, sentence: "Он ___ мне совет.", answer: "дал" },
    { vI: 15, asp: 'sv', tense: 'future', pIdx: 0, sentence: "Я ___ тебе ответ завтра.", answer: "дам" },
    { vI: 15, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Родители ___ детям деньги.", answer: "дают" },

    // брать / взять - olmoq
    { vI: 16, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ зонт с собой.", answer: "беру" },
    { vI: 16, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ твою ручку.", answer: "взял" },
    { vI: 16, asp: 'sv', tense: 'future', pIdx: 0, sentence: "Я ___ отпуск в июле.", answer: "возьму" },
    { vI: 16, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Она ___ книги в библиотеке.", answer: "берёт" },

    // любить / полюбить - sevmoq
    { vI: 17, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ читать.", answer: "люблю" },
    { vI: 17, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ этот город сразу.", answer: "полюбил" },
    { vI: 17, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Он ___ свою работу.", answer: "любит" },
    { vI: 17, asp: 'nsv', tense: 'present', pIdx: 5, sentence: "Все ___ лето.", answer: "любят" },

    // хотеть / захотеть - xohlamoq
    { vI: 18, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ есть.", answer: "хочу" },
    { vI: 18, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Вдруг я ___ спать.", answer: "захотел" },
    { vI: 18, asp: 'nsv', tense: 'present', pIdx: 1, sentence: "Ты ___ чаю?", answer: "хочешь" },
    { vI: 18, asp: 'nsv', tense: 'present', pIdx: 3, sentence: "Мы ___ помочь.", answer: "хотим" },

    // мочь / смочь - qila olmoq
    { vI: 19, asp: 'nsv', tense: 'present', pIdx: 0, sentence: "Я ___ говорить по-английски.", answer: "могу" },
    { vI: 19, asp: 'sv', tense: 'past', pIdx: 0, sentence: "Я ___ решить эту задачу.", answer: "смог" },
    { vI: 19, asp: 'sv', tense: 'future', pIdx: 1, sentence: "Ты ___ это сделать?", answer: "сможешь" },
    { vI: 19, asp: 'nsv', tense: 'present', pIdx: 2, sentence: "Она ___ петь красиво.", answer: "может" }
];

console.log("VERB_SENTENCES loaded:", VERB_SENTENCES.length, "sentences");
