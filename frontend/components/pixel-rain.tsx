"use client"

const PIXELS = [
    { left: "4%",  delay: "-1s",  duration: "5s",  size: 24, color: "#a855f7" },
    { left: "10%", delay: "-3s",  duration: "6s",  size: 18, color: "#22d3ee" },
    { left: "17%", delay: "-5s",  duration: "7s",  size: 32, color: "#f472b6" },
    { left: "25%", delay: "-2s",  duration: "5.5s",size: 20, color: "#4ade80" },
    { left: "33%", delay: "-4s",  duration: "6.5s",size: 28, color: "#a855f7" },
    { left: "41%", delay: "-1.5s",duration: "5s",  size: 36, color: "#22d3ee" },
    { left: "49%", delay: "-6s",  duration: "7s",  size: 20, color: "#f472b6" },
    { left: "57%", delay: "-2.5s",duration: "6s",  size: 30, color: "#4ade80" },
    { left: "65%", delay: "-4.5s",duration: "5.5s",size: 22, color: "#a855f7" },
    { left: "73%", delay: "-1s",  duration: "6.5s",size: 18, color: "#22d3ee" },
    { left: "81%", delay: "-3.5s",duration: "5s",  size: 28, color: "#f472b6" },
    { left: "89%", delay: "-5.5s",duration: "7s",  size: 20, color: "#4ade80" },
    { left: "7%",  delay: "-2s",  duration: "6s",  size: 16, color: "#22d3ee" },
    { left: "22%", delay: "-4s",  duration: "5.5s",size: 26, color: "#f472b6" },
    { left: "38%", delay: "-0.5s",duration: "6s",  size: 18, color: "#4ade80" },
    { left: "54%", delay: "-3s",  duration: "5s",  size: 32, color: "#a855f7" },
    { left: "70%", delay: "-6s",  duration: "7s",  size: 20, color: "#22d3ee" },
    { left: "85%", delay: "-1.5s",duration: "5.5s",size: 24, color: "#f472b6" },
    { left: "14%", delay: "-4.5s",duration: "6s",  size: 16, color: "#a855f7" },
    { left: "46%", delay: "-2.5s",duration: "5s",  size: 22, color: "#4ade80" },
]

export default function PixelRain() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>{`
                @keyframes pixel-float {
                    0%   { transform: translateY(0) rotate(0deg);         opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translateY(-110vh) rotate(180deg);  opacity: 0; }
                }
            `}</style>
            {PIXELS.map((p, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: p.left,
                        bottom: "-10px",
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        opacity: 0.75,
                        imageRendering: "pixelated",
                        animation: `pixel-float ${p.duration} ${p.delay} infinite linear`,
                    }}
                />
            ))}
        </div>
    )
}
