import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { applyFacialHair } from "./facialHair";

// Oxford blue. The shirt and trousers share one untextured material, so a
// straight colour swap covers the whole outfit.
const OUTFIT_COLOR = "#002147";
const OUTFIT_MESHES = ["BODYSHIRT", "Pant"];

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc?v=2",
          "MyCharacter12"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            applyFacialHair(character);
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;

                // Recolour the outfit. GLTFLoader strips dots from names, so
                // the shirt mesh is "BODYSHIRT" - matching "BODY.SHIRT" never
                // fired, which is why it stayed the model's near-black.
                if (mesh.material && OUTFIT_MESHES.includes(mesh.name)) {
                  const newMat = (
                    mesh.material as THREE.Material
                  ).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color(OUTFIT_COLOR);
                  mesh.material = newMat;
                }

                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            const footR = character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            
            const footL = character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;

            // Monitor scale is handled by GsapScroll.ts animations

            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
