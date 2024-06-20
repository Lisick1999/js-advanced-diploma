import Character from '../../Character';

export default class Magician extends Character {
  constructor(level, type = 'magician') {
    super(level, type);

    if (type !== 'magician') {
      throw new Error('неправильный класс персонажа');
    }

    this.attack = 10;
    this.defence = 40;
    this.moveDist = 1;
    this.attackDist = 4;
  }
}
