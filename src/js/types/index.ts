export type GameConfigAttractors = Phaser.Types.Core.GameConfig & {
  physics: {
    matter: {
      plugins: {
        attractors: boolean,
      },
    },
  },
};

export type Keys = Phaser.Types.Input.Keyboard.CursorKeys & {
  W: Phaser.Input.Keyboard.Key
  A: Phaser.Input.Keyboard.Key
  S: Phaser.Input.Keyboard.Key
  D: Phaser.Input.Keyboard.Key
  SPACE: Phaser.Input.Keyboard.Key
};

export type MatterGameObject = Phaser.GameObjects.GameObject
  & Phaser.Physics.Matter.Components.Bounce
  & Phaser.Physics.Matter.Components.Collision
  & Phaser.Physics.Matter.Components.Force
  & Phaser.Physics.Matter.Components.Friction
  & Phaser.Physics.Matter.Components.Gravity
  & Phaser.Physics.Matter.Components.Mass
  & Phaser.Physics.Matter.Components.Sensor
  & Phaser.Physics.Matter.Components.SetBody
  & Phaser.Physics.Matter.Components.Sleep
  & Phaser.Physics.Matter.Components.Static
  & Phaser.Physics.Matter.Components.Transform
  & Phaser.Physics.Matter.Components.Velocity;

export type PinProps = {
  position: Phaser.Math.Vector2
  category: number
}

export type ColliderProps = PinProps & {
  angle: number
  width: number
  height: number
  onCollide: Function
}

export type BumperProps = PinProps & {
  points: number
}

export type MarkerProps = {
  id: string
  frame: number
  depth: number
  position: Phaser.Math.Vector2
  size?: string
}

export type PolygonProps = {
  position: Phaser.Math.Vector2
  color: number
  bounce: number
  friction: number
  category: number
  vertices: object[]
  onCollide?: Function
}

export type SensorProps = {
  position: Phaser.Math.Vector2
  id: string
  isSensor: boolean
  width: number
  height: number
  category: number
  onCollide?: Function
}
