
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

export type GamepadConnections = Map<number, boolean>;

export interface ControllerInput {
	horizontal: number;
	vertical: number;
	buttonA: number;
	buttonB: number;
	buttonX: number;
	buttonY: number;
	select: number;
	start: number;
}

export default class Gamepad {
	hasSupport: boolean;
	lastConnection: number;
	connections: GamepadConnections = new Map();

	constructor() {
		this.hasSupport = true;
		this.lastConnection = -1;
		const interval = setInterval(() => {
			if (!this.hasSupport) {
				clearInterval(interval);
			}
			if (this.connections.size > this.lastConnection) {
				this.scanGamepads();
			}
		}, 200);
		const self = this;
		window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
			const { gamepad } = event;
			self.connections.set(gamepad.index, gamepad.connected);
		});
		window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
			const { gamepad } = event;
			self.connections.delete(gamepad.index);
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
		this.lastConnection = gamepads.length;
	}

	getInputAtIndex(index: number): ControllerInput {
		const gamepad = navigator.getGamepads()[index];
		const connected = this.connections.get(index);
		if (!connected || !gamepad) {
			return {
				horizontal: 0,
				vertical: 0,
				buttonA: 0,
				buttonB: 0,
				buttonX: 0,
				buttonY: 0,
				select: 0,
				start: 0,
			};
		}
		let horizontal = 0;
		let vertical = 0;
		const [x1, y1] = gamepad.axes;
		horizontal = (Math.abs(x1) > 0.1) ? x1 : 0;
		vertical = (Math.abs(y1) > 0.1) ? y1 : 0;
		return {
			horizontal,
			vertical,
			buttonA: gamepad.buttons[0].value,
			buttonB: gamepad.buttons[1].value,
			buttonX: 0,
			buttonY: 0,
			select: 0,
			start: 0,
		};
	}

	getInputs() {
		return [this.getInputAtIndex(0)];
	}

}
