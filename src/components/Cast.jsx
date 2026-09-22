import { useEffect, useRef } from "react";

const CHARACTERS = [
  { id: "orange", delay: "1.1s", z: 4, mx: "-18px", body: "body-orange", eyesTop: "46%", gap: "22px", mouthTop: "62%", mouthW: "26px" },
  { id: "purple", delay: "0s", z: 3, mx: "-14px", body: "body-purple", eyesTop: "34%", gap: "14px", mouthTop: "52%", mouthW: "20px" },
  { id: "pink", delay: "0.4s", z: 2, mx: "-14px", body: "body-pink", eyesTop: "34%", gap: "14px", mouthTop: "48%", mouthW: "16px" },
  { id: "yellow", delay: "0.8s", z: 1, mx: "-14px", body: "body-yellow", eyesTop: "32%", gap: "14px", mouthTop: "50%", mouthW: "22px" },
];

export function Cast({ reaction }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const eyes = rootRef.current?.querySelectorAll(".eye") || [];
    const onMove = (e) => {
      eyes.forEach((eye) => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const dist = Math.min(4, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 25);
        const pupil = eye.querySelector(".pupil");
        if (pupil) pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      });
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={rootRef} className="cast-stage">
      <div className="cast-characters" style={{ gap: "-10px" }}>
        {CHARACTERS.map((c) => (
          <div
            key={c.id}
            className={`char ${reaction || ""}`}
            style={{ margin: `0 ${c.mx}`, zIndex: c.z, animationDelay: c.delay }}
          >
            <div className={`relative ${c.body}`} />
            <div className="eyes" style={{ top: c.eyesTop, gap: c.gap }}>
              <div className="eye">
                <div className="pupil" />
              </div>
              <div className="eye">
                <div className="pupil" />
              </div>
            </div>
            <div
              className="mouth"
              style={{ top: c.mouthTop, width: c.mouthW }}
            />
          </div>
        ))}
      </div>
      <div className="stage-ground" />
    </div>
  );
}
