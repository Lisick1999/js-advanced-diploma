import Team from './Team';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const typesIndex = Math.floor(Math.random() * allowedTypes.length);
  const typesLvl = Math.floor(Math.random() * maxLevel + 1);

  yield new allowedTypes[typesIndex](typesLvl);
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде-characterCount.
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const characters = [];

  for (let i = 0; i < characterCount; i += 1) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return new Team(characters);
}

export const posPlayer = (characterCount, boardSize) => {
  const left = [];
  const positions = new Set();

  for (let i = 0; i < boardSize ** 2; i += 1) {
    if (i === 0 || i === 1 || i % boardSize === 0 || i % boardSize === 1) {
      left.push(i);
    }
  }
  while (positions.size < characterCount) {
    positions.add(left[Math.floor(Math.random() * left.length)]);
  }

  return [...positions];
};

export const posEnemy = (characterCount, boardSize) => {
  const right = [];
  const positions = new Set();

  for (let i = 0; i < boardSize ** 2; i += 1) {
    if (i === boardSize - 2 || i === boardSize - 1 || (i + 2) % boardSize === 0
      || (i + 1) % boardSize === 0) {
      right.push(i);
    }
  }
  while (positions.size < characterCount) {
    positions.add(right[Math.floor(Math.random() * right.length)]);
  }

  return [...positions];
};
