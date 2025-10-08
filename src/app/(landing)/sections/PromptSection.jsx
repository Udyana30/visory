"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, useRef, useMemo, useLayoutEffect, useState } from "react";
import { Color } from "three";
import { Paperclip, Image, Video, Mic, User, ChevronDown } from "lucide-react";

const hexToNormalizedRGB = (hex) => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 + 0.4 * sin(
    5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset)
    + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))
  );
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref.current) ref.current.scale.set(viewport.width, viewport.height, 1);
  }, [viewport]);

  useFrame((_, delta) => {
    ref.current.material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});

const Silk = ({ speed = 5, scale = 1, color = "#808080", noiseIntensity = 1, rotation = 0 }) => {
  const meshRef = useRef();
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  return (
    <Canvas dpr={[1, 2]} frameloop="always">
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

const TOOL_OPTIONS = [
  { icon: Image, label: "Image", value: "image" },
  { icon: Video, label: "Video", value: "video" },
  { icon: Mic, label: "Voice", value: "voice" },
  { icon: User, label: "Avatar", value: "avatar" }
];

const MODEL_OPTIONS = ["Brainwave 2.5", "Brainwave 2.0", "Brainwave 1.5"];

export default function PromptSection() {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleQuickPrompt = (text) => setPrompt(text);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setShowTools(false);
  };

  const getSelectedToolIcon = () => {
    if (!selectedTool) return null;
    const tool = TOOL_OPTIONS.find(t => t.value === selectedTool);
    return tool ? tool.icon : null;
  };

  const SelectedIcon = getSelectedToolIcon();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
  
      <div className="absolute inset-0 w-full h-full">
        <Silk 
        speed={5} 
        scale={1} 
        color="#ffffff" 
        noiseIntensity={1} 
        rotation={0} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] [text-shadow:_0_5px_15px_rgb(25_25_25_/_70%)]">
            What do you want to create?
          </h1>
          <p className="text-base md:text-lg text-white mb-12 max-w-2xl mx-auto leading-normal drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] [text-shadow:_0_2px_2px_rgb(25_25_25_/_60%)]">
            <span className="md:text-xl">
              Turn your ideas into stunning visual creations
            </span>
            <br />
            Create ads, content, or stories with a simple prompt.
          </p>

          {/* Prompt Box */}
          <div className="max-w-3xl mx-auto mb-8 relative z-10">
            <div className="relative rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              <div className="relative rounded-3xl bg-black/40 backdrop-blur-md border border-white/30">
                <div className="p-6 min-h-[140px] relative">
                  {!prompt && !isFocused && (
                    <div className="absolute left-6 top-6 text-white/50 text-base md:text-lg pointer-events-none select-none">
                      Describe your idea...
                    </div>
                  )}
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full resize-none border-none outline-none text-white bg-transparent text-base md:text-lg leading-relaxed z-10 relative"
                    rows="3"
                  />
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/20 relative z-20">
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Tools Menu with Selected Icon */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowTools((prev) => !prev);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                          selectedTool 
                            ? "bg-white text-black border-white" 
                            : "text-white/70 hover:text-white hover:bg-white/10 border-white/30"
                        }`}
                      >
                        {SelectedIcon ? (
                          <>
                            <SelectedIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{TOOL_OPTIONS.find(t => t.value === selectedTool)?.label}</span>
                          </>
                        ) : (
                          <span className="text-sm">Tools</span>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${showTools ? "rotate-180" : ""}`}
                        />
                      </button>

                      {showTools && (
                        <div className="absolute top-full left-0 mt-2 bg-gray-800/95 backdrop-blur-xl border border-white/30 rounded-xl overflow-hidden shadow-2xl min-w-[160px] z-[100]">
                          {TOOL_OPTIONS.map(({ icon: Icon, label, value }) => (
                            <button
                              key={value}
                              onClick={() => handleToolSelect(value)}
                              className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 w-full text-left transition-colors ${
                                selectedTool === value ? "bg-white/10" : ""
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>

                    <button className="bg-white text-black px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                      <span className="text-sm font-medium">Send</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/* Quick Prompts */}
           <div className="flex flex-wrap justify-center gap-3 mt-10 mb-20 max-w-3xl mx-auto">
              {[
                "Generate a dramatic video shot of Los Angeles",
                "Make an ad photo for my black tea",
                "Design a minimalist living room",
              ].map((text) => (
                <button
                  key={text}
                  onClick={() => handleQuickPrompt(text)}
                  className="backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm ring-1 ring-white/20 hover:ring-white/40 transition-all"
                >
                  {text}
                </button>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
