import Character from '../../Character';

export default class Swordsman extends Character {
  constructor(level, type = 'swordsman') {
    super(level, type);

    if (type !== 'swordsman') {
      throw new Error('неправильный класс персонажа');
    }

    this.attack = 40;
    this.defence = 10;
    this.moveDist = 4;
    this.attackDist = 1;
  }
}
