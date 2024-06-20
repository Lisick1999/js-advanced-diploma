/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns string - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  let position = 'center';

  if (index === 0) {
    position = 'top-left';
  } else if (index === boardSize ** 2 - 1) {
    position = 'bottom-right';
  } else if (index === boardSize - 1) {
    position = 'top-right';
  } else if (index < boardSize) {
    position = 'top';
  } else if (index === boardSize ** 2 - boardSize) {
    position = 'bottom-left';
  } else if (index < boardSize ** 2 && index > boardSize ** 2 - boardSize) {
    position = 'bottom';
  } else if ((index + 1) % boardSize === 0
    && index !== boardSize ** 2 - 1 && index !== boardSize - 1) {
    position = 'right';
  } else if (index % boardSize === 0 && index !== 0 && index !== boardSize ** 2 - boardSize) {
    position = 'left';
  }

  return position;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getInfo(character) {
  const levelInfo = String.fromCodePoint(0x1F396) + character.level;
  const attackInfo = String.fromCodePoint(0x2694) + character.attack;
  const defenceInfo = String.fromCodePoint(0x1F6E1) + character.defence;
  const healthInfo = String.fromCodePoint(0x2764) + character.health;

  return `${levelInfo} ${attackInfo} ${defenceInfo} ${healthInfo}`;
}

export function getCoordinates(index, square) {
  const coordinates = { x: null, y: null };
  if (!index) {
    coordinates.x = 1;
    coordinates.y = 1;
  }
  if (index && index < square) {
    coordinates.x = 1;
    coordinates.y = index + 1;
  }
  if (index >= square) {
    if (index % square === 0) {
      coordinates.x = Math.ceil((index + 1) / square);
      coordinates.y = 1;
    } else {
      coordinates.x = Math.ceil(index / square);
      coordinates.y = (index % square) + 1;
    }
  }
  return coordinates;
}

function getIndex(coordinates, square) {
  return (coordinates.x - 1) * square - 1 + coordinates.y;
}

export function randomIndex(selectedCoordinates, distance, square) {
  let coordinates;

  const isNotValid = (coords) => {
    const diffX = Math.abs(coords.x - selectedCoordinates.x);
    const diffY = Math.abs(coords.y - selectedCoordinates.y);

    return (
      (coords.x === selectedCoordinates.x && coords.y === selectedCoordinates.y)
      || coords.x > square || coords.y > square
      || coords.x <= 0 || coords.y <= 0
      || diffX > distance || diffY > distance
      || (diffX !== diffY && diffX !== 0 && diffY !== 0)
    );
  };

  do {
    coordinates = {
      x: Math.floor(Math.random() * (distance * 2 + 1)) + (selectedCoordinates.x - distance),
      y: Math.floor(Math.random() * (distance * 2 + 1)) + (selectedCoordinates.y - distance),
    };
  } while (isNotValid(coordinates));

  return getIndex(coordinates, square);
}
