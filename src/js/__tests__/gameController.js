import Bowman from '../characters/Bowman/Bowman';
import { getCoordinates, getInfo } from '../utils';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const gameCtrl = new GameController(new GamePlay(), new GameStateService());
const boardSize = 8;

test('check create new Bowman & throw error while creating new Character', () => {
  const bowman = new Bowman(1);
  expect(bowman).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
    moveDist: 2,
    attackDist: 2,
  });

  const inform = getInfo(bowman);
  expect(inform).toBe('\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50');
});

test.each([
  [19, 1, 3],
  [43, 59, 2],
  [13, 14, 3],
  [61, 37, 4],
])('availableTo method, move from cell with index %i to cell with index %i with distance %i', (startCell, endCell, dist) => {
  const result = gameCtrl.availableTo(endCell, getCoordinates(startCell, boardSize), dist);
  expect(result).toBeTruthy();
});
