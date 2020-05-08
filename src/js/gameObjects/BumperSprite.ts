import 'phaser';

export default class BumperSprite extends Phaser.Physics.Matter.Sprite {
  private timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, category: number) {
    super(scene.matter.world, x, y, 'bumper');

    this.scene.add.existing(this);
    this.setCircle(8, {
      label: 'bumper',
      isStatic: true,
      collisionFilter: {
        category,
      },
    });

    this.setBounce(1.25);
    this.setFriction(0.5);
    this.setScale(2);
    this.setData({
      score: 100,
      isOn: false,
    }, null);
    this.setDepth(2);
  }

  public onCollide() {
    this.scene.events.emit('score', this.getData('score'));
    this.scene.cameras.main.shake(50, 0.01);
    this.scene.sound.play('bumper');
    this.startInterval();
  }

  private setOn(value: boolean) {
    this.setData('isOn', value);
    this.setFrame(value ? 1 : 0);
  }

  private startInterval() {
    this.stopInterval();
    this.setOn(true);
    this.timer = this.scene.time.addEvent({
      delay: 150,
      callback: function () {
        this.setOn(false);
      },
      callbackScope: this,
    });
  }

  private stopInterval() {
    if (this.timer) {
      this.timer.destroy();
    }
  }
}
