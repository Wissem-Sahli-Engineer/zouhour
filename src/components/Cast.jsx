import { useEffect, useRef } from "react";

const CHARACTERS = [
  { id: "orange", delay: "1.1s", z: 4, mx: "-18px", body: "w-[170px] h-[100px] rounded-[100px_100px_24px_24px] bg-gradient-to-br from-[#fb923c] to-[#ea580c]", eyesTop: "46%", gap: "22px", mouthTop: "62%", mouthW: "26px" },
  { id: "purple", delay: "0s", z: 3, mx: "-14px", body: "w-[120px] h-[210px] rounded-[34px] bg-gradient-to-br from-[#9d6bfa] to-[#7c4de0]", eyesTop: "34%", gap: "14px", mouthTop: "52%", mouthW: "20px" },
  { id: "pink", delay: "0.4s", z: 2, mx: "-14px", body: "w-[88px] h-[150px] rounded-[30px] bg-gradient-to-br from-[#f472b6] to-[#db2777]", eyesTop: "34%", gap: "14px", mouthTop: "48%", mouthW: "16px" },
  { id: "yellow", delay: "0.8s", z: 1, mx: "-14px", body: "w-[96px] h-[118px] rounded-[26px] bg-gradient-to-br from-[#fde047] to-[#eab308]", eyesTop: "32%", gap: "14px", mouthTop: "50%", mouthW: "22px" },
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
    <div ref={rootRef} className="cast-stage relative flex h-full flex-1 items-end justify-center overflow-hidden bg-surface">
      <div className="relative flex items-end pb-[70px]" style={{ gap: "-10px" }}>
        {CHARACTERS.map((c) => (
          <div
            key={c.id}
            className={`char relative flex items-center justify-center ${reaction || ""}`}
            style={{ margin: `0 ${c.mx}`, zIndex: c.z, animationDelay: c.delay }}
          >
            <div className={`relative ${c.body}`} />
            <div className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2" style={{ top: c.eyesTop, gap: c.gap }}>
              <div className="eye flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,.05)]">
                <div className="pupil h-[7px] w-[7px] rounded-full bg-ink" />
              </div>
              <div className="eye flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,.05)]">
                <div className="pupil h-[7px] w-[7px] rounded-full bg-ink" />
              </div>
            </div>
            <div
              className="absolute left-1/2 h-[3px] -translate-x-1/2 rounded-[0_0_10px_10px] bg-ink"
              style={{ top: c.mouthTop, width: c.mouthW }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
}
