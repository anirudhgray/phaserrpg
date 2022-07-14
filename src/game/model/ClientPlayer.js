import Phaser from 'phaser';

class ClientPlayer extends Phaser.GameObjects.Container {
  _playerId;

  constructor(scene, x, y, playerId, playerName, avatar, gridEngine, socket) {
    super(scene, x, y);
    this.sprite = scene.add.sprite(0, 0, 'player');
    this.sprite.setOrigin(0.5, 0.5).setDisplaySize(50, 50);
    this.sprite.scale = 3
    this.sprite.setDepth(2)

    this._playerId = playerId;

    this.nameText = scene.add.text(0, -45, playerName);
    this.add(this.sprite);
    this.add(this.nameText);

    console.log(socket._id)

    if (socket._id === this._playerId) {
      scene.cameras.main.startFollow(this, true)
      scene.cameras.main.roundPixels = true
      scene.cameras.main.setFollowOffset(-this.sprite.width, -this.sprite.height * 2)
    }

    gridEngine.addCharacter({
      id: playerId,
      sprite: this.sprite,
      startPosition: {x,y},
      walkingAnimationMapping: avatar,
      container: this
    })

    scene.add.existing(this);
  }

  get playerId() {
    return this._playerId;
  }
}

export default ClientPlayer;