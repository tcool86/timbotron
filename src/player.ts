import * as Three from 'three';

export default class Player {
	material: Three.Material;
	geometry: Three.BoxGeometry;
	mesh: Three.Mesh;
	body: any;

	constructor(scene: Three.Scene) {
		this.material = new Three.MeshNormalMaterial();
		this.geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);

		this.mesh = new Three.Mesh(this.geometry, this.material);
		this.mesh.position.y = 0;
		this.mesh.position.x = 0;
		scene.add(this.mesh);
		return this;
	}
}
