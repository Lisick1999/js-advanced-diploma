import Character from '../../Character';

export default class Undead extends Character {
  constructor(level, type = 'undead') {
    super(level, type);

    if (type !== 'undead') {
      throw new Error('неправильный класс персонажа');
    }

    this.attack = 40;
    this.defence = 10;
    this.moveDist = 4;
    this.attackDist = 1;
  }
}
