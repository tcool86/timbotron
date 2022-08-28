
interface GamepadButton {
	pressed: boolean;
	touched: boolean;
	value: number;
}

interface GamepadController {
	id: string;
	index: number;
	connected: boolean;
	axes: readonly number[];
	buttons: readonly GamepadButton[];
	mapping: string;
	timestamp: number;
	vibrationActuator?: unknown;
}

export default class Gamepad {
	hasSupport: boolean;
	lastConnection: number;
	controllers: GamepadController[];

	constructor() {
		this.hasSupport = true;
		this.lastConnection = -1;
		this.controllers = [];
		const interval = setInterval(() => {
			if (!this.hasSupport) {
				clearInterval(interval);
			}
			if (this.controllers.length > this.lastConnection) {
				this.scanGamepads();
			}
		}, 200);
		const self = this;
		window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
			const { gamepad } = event;
			console.log(gamepad);
			if (!self.controllers[gamepad.index]?.connected) {
				self.controllers[gamepad.index] = gamepad;
			}
		});
		window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
			const { gamepad } = event;
			delete this.controllers[gamepad.index];
		});
	}

	scanGamepads() {
		const browserGamepadSupport = Boolean(navigator.getGamepads) ?? false;
		let gamepads;
		if (browserGamepadSupport) {
			gamepads = navigator.getGamepads();
		} else {
			console.warn("This browser doesn't support gamepads");
			this.hasSupport = false;
			return;
		}
		for (let index in gamepads) {
			const gamepad = gamepads[index];
			if (typeof gamepad?.index === 'number') {
				this.controllers[gamepad?.index] = gamepad;
			}
		}
		this.lastConnection = gamepads.length;
	}

	player1() {
		const [gamepad] = navigator.getGamepads();
		if (gamepad === null) {
			return { horiz: 0, vert: 0, a: 0, b: 0 };
		}
		let horiz = 0;
		let vert = 0;
		const [x1, y1] = gamepad.axes;
		horiz = (Math.abs(x1) > 0.1) ? x1 : 0;
		vert = (Math.abs(y1) > 0.1) ? y1 : 0;

		return { horiz, vert, a: gamepad.buttons[0].value, b: gamepad.buttons[1].value };
	}

}
