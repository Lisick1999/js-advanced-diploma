import Character from '../../Character';

export default class Bowman extends Character {
  constructor(level, type = 'bowman') {
    super(level, type);

    if (type !== 'bowman') {
      throw new Error('неправильный класс персонажа');
    }

    this.attack = 25;
    this.defence = 25;
    this.moveDist = 2;
    this.attackDist = 2;
  }
}
