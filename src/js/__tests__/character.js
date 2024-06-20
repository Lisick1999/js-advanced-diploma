import Bowman from '../characters/Bowman/Bowman';
import Daemon from '../characters/Daemon/Daemon';
import Magician from '../characters/Magician/Magician';
import Swordsman from '../characters/Swordsman/Swordsman';
import Undead from '../characters/Undead/Undead';
import Vampire from '../characters/Vampire/Vampire';
import Character from '../Character';

test.each([
  ['Bowman', Bowman, 1],
  ['Daemon', Daemon, 1],
  ['Magician', Magician, 1],
  ['Swordsman', Swordsman, 1],
  ['Undead', Undead, 1],
  ['Vampire', Vampire, 1],
])('create an instance of %s', (_, ClassName, level) => {
  expect(new ClassName(level)).toBeInstanceOf(ClassName);
});

test('preventing the creation of Character objects', () => {
  expect(() => new Character(1, 'daemon')).toThrow(new Error('создайте конкретного персонажа'));
});
