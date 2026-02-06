export const CASE_NAMES = [
  { ru: 'Именительный', uz: 'Бош келишик', question: 'кто? что?' },
  { ru: 'Родительный', uz: 'Қаратқич келишик', question: 'кого? чего?' },
  { ru: 'Дательный', uz: 'Жўналиш келишик', question: 'кому? чему?' },
  { ru: 'Винительный', uz: 'Тушум келишик', question: 'кого? что?' },
  { ru: 'Творительный', uz: 'Ўрин-пайт келишик', question: 'кем? чем?' },
  { ru: 'Предложный', uz: 'Чиқиш келишик', question: 'о ком? о чём?' },
];

export const GENDERS = { м: 'Мужской', ж: 'Женский', ср: 'Средний', мн: 'Множественное' };

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uz-UZ');
}

export function getLevelFromXp(xp) {
  return Math.floor(xp / 100) + 1;
}

export function getXpForNextLevel(xp) {
  const currentLevel = getLevelFromXp(xp);
  return currentLevel * 100;
}
