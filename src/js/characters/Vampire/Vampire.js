import Character from '../../Character';

export default class Vampire extends Character {
  constructor(level, type = 'vampire') {
    super(level, type);

    if (type !== 'vampire') {
      throw new Error('неправильный класс персонажа');
    }

    this.attack = 25;
    this.defence = 25;
    this.moveDist = 2;
    this.attackDist = 2;
  }
}
