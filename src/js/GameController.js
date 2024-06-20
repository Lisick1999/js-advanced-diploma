import GameState from './GameState';
import Bowman from './characters/Bowman/Bowman';
import Swordsman from './characters/Swordsman/Swordsman';
import Magician from './characters/Magician/Magician';
import Vampire from './characters/Vampire/Vampire';
import Undead from './characters/Undead/Undead';
import Daemon from './characters/Daemon/Daemon';
import PositionedCharacter from './PositionedCharacter';
import {
  characterGenerator,
  generateTeam,
  posEnemy,
  posPlayer,
} from './generators';
import { getCoordinates, getInfo, randomIndex } from './utils';
import cursors from './cursors';
import GamePlay from './GamePlay';
import themes from './themes';
import Character from './Character';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Vampire, Undead, Daemon];
    this.currentCellIdx = null;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    this.start();
  }

  start() {
    this.createTeams();
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  onNewGameClick() {
    this.blockBoard();
    const { maxScore } = { ...this.gameState };
    this.gameState = new GameState();
    this.gameState.maxScore = maxScore;
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.currentCellIdx = null;
    this.createTeams();
    this.drawBoard();
  }

  onSaveGameClick() {
    this.stateService.save(this.gameState);
  }

  onLoadGameClick() {
    if (this.stateService.storage.length > 0/* сохраненная игра */) {
      const loadedGame = this.stateService.load();
      this.gameState = new GameState();
      this.gameState.level = loadedGame.level;
      this.gameState.charactersCount = loadedGame.charactersCount;
      this.gameState.positions = loadedGame.positions;
      this.gameState.currentMove = loadedGame.currentMove;
      this.gameState.selectedCell = loadedGame.selectedCell;
      this.gameState.selectedCellIndex = loadedGame.selectedCellIndex;
      this.gameState.selectedCharacter = loadedGame.selectedCharacter;
      this.gameState.selectedCellCoordinates = loadedGame.selectedCellCoordinates;
      this.gameState.isAvailableToMove = loadedGame.isAvailableToMove;
      this.gameState.isAvailableToAttack = loadedGame.isAvailableToAttack;
      this.gameState.maxScore = loadedGame.maxScore;
      this.gameState.currentScore = loadedGame.currentScore;
      const playerChars = [];
      const enemyChars = [];
      this.gameState.positions.forEach((pos) => {
        Object.setPrototypeOf(pos.character, Character.prototype);
        if (this.gameState.playerTypes.some((item) => item === pos.character.type)) {
          playerChars.push(pos.character);
        }
        if (this.gameState.enemyTypes.some((item) => item === pos.character.type)) {
          enemyChars.push(pos.character);
        }
      });
      this.gameState.playerTeam = new Team(playerChars);
      this.gameState.enemyTeam = new Team(enemyChars);
      this.drawBoard();
    }
  }

  createTeams() {
    if (this.gameState.level === 1) {
      const { level, charactersCount } = this.gameState;
      this.gameState.playerTeam = generateTeam(this.playerTypes, level, charactersCount);
      this.gameState.enemyTeam = generateTeam(this.enemyTypes, level, charactersCount);
    } else {
      const countForPlayer = this.numberOfCharactersToAdd(this.gameState.playerTeam.characters);
      const countForEnemy = this.numberOfCharactersToAdd(this.gameState.enemyTeam.characters);
      const playerChars = [];
      const enemyChars = [];
      for (let i = 1; i <= countForPlayer; i += 1) {
        playerChars.push(characterGenerator(this.playerTypes, this.gameState.level).next().value);
      }
      for (let i = 1; i <= countForEnemy; i += 1) {
        enemyChars.push(characterGenerator(this.enemyTypes, this.gameState.level).next().value);
      }
      playerChars.forEach((item) => this.gameState.playerTeam.characters.push(item));
      enemyChars.forEach((item) => this.gameState.enemyTeam.characters.push(item));
    }
    const posLeft = posPlayer(this.gameState.charactersCount, this.gamePlay.boardSize);
    const posRight = posEnemy(this.gameState.charactersCount, this.gamePlay.boardSize);
    this.gameState.playerTeam.characters.forEach((item, index) => {
      this.gameState.positions.push(new PositionedCharacter(item, posLeft[index]));
    });
    this.gameState.enemyTeam.characters.forEach((item, index) => {
      this.gameState.positions.push(new PositionedCharacter(item, posRight[index]));
    });
  }

  numberOfCharactersToAdd(team) {
    return this.gameState.charactersCount - team.length;
  }

  async onCellClick(index) {
    const currentCell = this.gamePlay.cells[index];
    const currentCellWithChar = currentCell.firstChild;
    let isEnemy;
    let isAvailableToMove;
    let isAvailableToAttack;

    if (currentCellWithChar) {
      isEnemy = this.gameState.enemyTeam.characters
        .some((item) => currentCellWithChar.classList.contains(item.type));
    }

    if (this.gameState.selectedCell) {
      const { selectedCellCoordinates } = this.gameState;
      const { moveDist } = this.gameState.selectedCharacter;
      const { attackDist } = this.gameState.selectedCharacter;

      isAvailableToMove = this.availableTo(index, selectedCellCoordinates, moveDist);
      isAvailableToAttack = this.availableTo(index, selectedCellCoordinates, attackDist);
    }

    if (currentCellWithChar && !isEnemy) {
      if (this.gameState.selectedCellIndex) {
        this.gamePlay.deselectCell(this.gameState.selectedCellIndex);
      }
      this.gamePlay.selectCell(index);
      this.gameState.selectedCell = currentCell;
      this.gameState.selectedCellIndex = index;
      this.gameState.selectedCharacter = this.findCharacter(index);
      this.gameState.selectedCellCoordinates = getCoordinates(index, this.gamePlay.boardSize);
    }

    if (!currentCellWithChar && isAvailableToMove) {
      this.gamePlay.deselectCell(this.gameState.selectedCellIndex);
      this.gamePlay.deselectCell(this.currentCellIdx);
      this.moveToAnEmptyCell(index);
      if (this.gameState.currentMove === 'player') {
        await this.enemyMove();
      }
    }

    if (currentCellWithChar && isEnemy) {
      if (isAvailableToAttack) {
        this.gamePlay.deselectCell(this.gameState.selectedCellIndex);
        this.gamePlay.deselectCell(this.currentCellIdx);
        const enemyCharacter = this.findCharacter(index);
        await this.attack(this.gameState.selectedCharacter, enemyCharacter, index);
        if (!this.gameState.enemyTeam.characters.length) {
          this.gameLevelUp();
          return;
        }
        if (this.gameState.currentMove === 'player') {
          await this.enemyMove();
        }
      } else {
        GamePlay.showError('Этого противника нельзя атаковать!');
      }
    }
  }

  onCellEnter(index) {
    if (typeof this.currentCellIdx === 'number' && !this.gamePlay.cells[this.currentCellIdx].classList.contains('selected-yellow')) {
      this.gamePlay.deselectCell(this.currentCellIdx);
    }
    const currentCell = this.gamePlay.cells[index];
    const currentCellWithChar = currentCell.firstChild;
    let isEnemy;
    let isAvailableToMove;
    let isAvailableToAttack;

    if (currentCellWithChar) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.showCellTooltip(getInfo(this.findCharacter(index)), index);
      isEnemy = this.gameState.enemyTypes
        .some((item) => currentCellWithChar.classList.contains(item));
    }

    if (this.gameState.selectedCell) {
      const { selectedCellCoordinates } = this.gameState;
      const { moveDist } = this.gameState.selectedCharacter;
      const { attackDist } = this.gameState.selectedCharacter;

      isAvailableToMove = this.availableTo(index, selectedCellCoordinates, moveDist);
      isAvailableToAttack = this.availableTo(index, selectedCellCoordinates, attackDist);
    }

    if (this.gameState.selectedCell) {
      if (isAvailableToMove) {
        if (!currentCellWithChar) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        }
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }

      if (currentCellWithChar && isEnemy) {
        if (isAvailableToAttack) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }

    if (currentCellWithChar && !isEnemy) {
      this.gamePlay.setCursor(cursors.pointer);
    }

    this.currentCellIdx = index;
  }

  onCellLeave(index) {
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
  }

  findCharacter(index) {
    const findIdx = this.gameState.positions.findIndex((item) => item.position === index);
    return this.gameState.positions[findIdx].character;
  }

  availableTo(index, selectedCoordinates, distance) {
    const currentCoordinates = getCoordinates(index, this.gamePlay.boardSize);
    const differenceX = Math.abs(currentCoordinates.x - selectedCoordinates.x);
    const differenceY = Math.abs(currentCoordinates.y - selectedCoordinates.y);
    if (differenceX <= distance && differenceY <= distance
      && (differenceX === differenceY || differenceX === 0 || differenceY === 0)) {
      return true;
    }
    return false;
  }

  clearSelectedCell() {
    this.gameState.selectedCell = null;
    this.gameState.selectedCellIndex = null;
    this.gameState.selectedCharacter = null;
    this.gameState.selectedCellCoordinates = null;
    this.gameState.isAvailableToMove = false;
    this.gameState.isAvailableToAttack = false;
  }

  moveToAnEmptyCell(index) {
    const idx = this.gameState.positions
      .findIndex((item) => item.position === this.gameState.selectedCellIndex);
    this.gameState.positions[idx].position = index;
    this.gamePlay.redrawPositions(this.gameState.positions);
    this.clearSelectedCell();
  }

  async enemyMove() {
    this.gameState.currentMove = 'enemy';
    const { playerTeam } = this.gameState;
    const { enemyTeam } = this.gameState;
    let isAvailableToAttack;
    const arrOfEnemyPos = [];

    this.gameState.playerTeam = enemyTeam;
    this.gameState.enemyTeam = playerTeam;

    this.gameState.positions.forEach((item) => {
      if (this.gameState.enemyTeam.characters.some((char) => char.type === item.character.type)) {
        arrOfEnemyPos.push(item.position);
      }
    });
    /* eslint-disable no-await-in-loop */
    for (const char of this.gameState.playerTeam.characters) {
      if (this.gameState.currentMove === 'enemy') {
        const idx = this.gameState.positions.findIndex((pos) => pos.character === char);
        await this.onCellClick(this.gameState.positions[idx].position);

        const { selectedCellCoordinates } = this.gameState;
        const { attackDist } = this.gameState.selectedCharacter;
        for (const pos of arrOfEnemyPos) {
          isAvailableToAttack = this.availableTo(pos, selectedCellCoordinates, attackDist);
          if (isAvailableToAttack) {
            await this.onCellClick(pos);
            this.gameState.currentMove = 'player';
            this.gameState.playerTeam = playerTeam;
            this.gameState.enemyTeam = enemyTeam;
            break;
          }
        }
      }
    }
    if (this.gameState.currentMove === 'enemy') {
      const { selectedCellCoordinates } = this.gameState;
      const { moveDist } = this.gameState.selectedCharacter;
      const { boardSize } = this.gamePlay;

      await this.onCellClick(randomIndex(selectedCellCoordinates, moveDist, boardSize));
      this.gameState.currentMove = 'player';
      this.gameState.playerTeam = playerTeam;
      this.gameState.enemyTeam = enemyTeam;
    }
  }

  async attack(attacker, target, targetIndex) {
    const damage = Math.floor(Math.max(attacker.attack - target.defence, attacker.attack * 0.2));
    // eslint-disable-next-line no-param-reassign
    target.health -= damage;
    await this.gamePlay.showDamage(targetIndex, damage);
    this.checkDeath(target);
    this.gamePlay.redrawPositions(this.gameState.positions);
    this.clearSelectedCell();
  }

  checkDeath(character) {
    if (character.health <= 0) {
      let idx = this.gameState.positions.findIndex((item) => item.character.health <= 0);
      this.gameState.positions.splice(idx, 1);
      idx = this.gameState.enemyTeam.characters.findIndex((item) => item.health <= 0);
      this.gameState.enemyTeam.characters.splice(idx, 1);
      this.recalculationPoints();
    }
  }

  blockBoard() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.setCursor(cursors.auto);
  }

  drawBoard() {
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  gameLevelUp() {
    if (this.gameState.currentMove === 'enemy') {
      /* eslint-disable no-alert */
      alert('Вы проиграли.\nНажмите "New game".');
      this.blockBoard();
      return;
    }
    this.gameState.level += 1;
    if (this.gameState.level > 4) {
      this.blockBoard();
      /* eslint-disable no-alert */
      alert('Победа!');
    } else {
      /* eslint-disable no-alert */
      alert(`Уровень пройден! Загрузка уровня ${this.gameState.level}`);
      this.gameState.playerTeam.characters.forEach((char) => char.levelUp());
      this.gameState.charactersCount += 1;
      this.gameState.positions = [];
      this.createTeams();
      this.drawBoard();
    }
  }

  recalculationPoints() {
    this.gameState.currentScore += 1;
    if (this.gameState.maxScore < this.gameState.currentScore) {
      this.gameState.maxScore = this.gameState.currentScore;
    }
  }
}
