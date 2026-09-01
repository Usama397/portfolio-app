import * as THREE from "three";

/**
 * Light beard and moustache for the character.
 *
 * It is painted onto the face material rather than added as geometry, so it
 * deforms with the head for free and can never poke through.
 *
 * Every constant is in the model's bind space, measured off the face mesh: the
 * mouth opening spans y 12.36 - 12.82 and the nose tip sits at y 12.95.
 */
const FACE_MESH = "Face002";

const BEARD_TINT = new THREE.Color(0.24, 0.19, 0.17);
const BEARD_STRENGTH = 1.0;
const BEARD_ROUGHNESS = 0.92;

const glslBeard = /* glsl */ `
  varying vec3 vBindPos;

  float bhStep(float a, float b, float x) {
    float t = clamp((x - a) / (b - a), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  float bhHash(vec3 p) {
    vec3 q = floor((p - vec3(0.0, 12.9, 0.1)) * 190.0);
    return fract(sin(dot(q, vec3(41.3, 289.1, 73.7))) * 43758.5453);
  }

  float bhBeard(vec3 p) {
    float ax = abs(p.x);
    float s = p.x / 0.557;
    float lipTop = 12.732 + 0.088 * s + 0.055 * s * s;
    float lipBot = 12.363 + 0.240 * s * s;

    // jaw line: low over the chin, rising into short sideburns
    float jaw = 12.40 + 0.58 * ax * ax;
    float m = bhStep(jaw + 0.055, jaw - 0.05, p.y);

    // leave the lips bare
    m *= 1.0 - bhStep(lipBot - 0.055, lipBot - 0.012, p.y)
             * bhStep(lipTop + 0.055, lipTop + 0.012, p.y)
             * bhStep(0.72, 0.60, ax);

    // moustache: thickest either side of the philtrum, tapering into the
    // beard at the corners of the mouth
    float g = p.x / 0.20;
    float thick = 0.21 * (1.0 - 0.55 * exp(-g * g)) * bhStep(0.60, 0.34, ax);
    m = max(m, bhStep(lipTop - 0.05, lipTop - 0.01, p.y)
             * bhStep(lipTop + thick + 0.04, lipTop + thick - 0.03, p.y));

    // thinner up the cheeks, gone round the back of the jaw
    m *= mix(1.0, 0.72, bhStep(12.6, 13.1, p.y));
    m *= bhStep(-0.40, -0.10, p.z);

    // stubble grain, strongest where the beard is already thinning out
    float n = bhHash(p);
    m *= mix(1.0, 0.62 + 0.55 * n, 0.55 * (1.0 - m));

    return clamp(m, 0.0, 1.0);
  }
`;

export const applyFacialHair = (character: THREE.Object3D) => {
  const face = character.getObjectByName(FACE_MESH) as THREE.Mesh | undefined;
  if (!face || !face.material) return;

  // the face shares its material with the ears and neck, so work on a copy
  const material = (face.material as THREE.MeshStandardMaterial).clone();

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uBeardTint = { value: BEARD_TINT };
    shader.uniforms.uBeardStrength = { value: BEARD_STRENGTH };

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBindPos;")
      // `position` is the pre-skinning attribute, so the beard stays put on the
      // face however the head is posed
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n  vBindPos = position;"
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 uBeardTint;
        uniform float uBeardStrength;
        ${glslBeard}`
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float bhAmount = bhBeard(vBindPos) * uBeardStrength;
        diffuseColor.rgb *= mix(vec3(1.0), uBeardTint, bhAmount);`
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, ${BEARD_ROUGHNESS.toFixed(
          2
        )}, bhAmount);`
      );
  };

  material.customProgramCacheKey = () => "character-beard";
  face.material = material;
};
