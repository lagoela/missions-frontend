interface BookCardProps {
  title: string
  content: string[]
}

const noiseTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`

export default function BookCard({ title, content }: BookCardProps) {
  return (
    <div
      className="rounded-sm px-10 py-9 w-120 h-75 text-left border-l border-black/8 shadow-[2px_2px_6px_rgba(0,0,0,0.15),inset_0_0_40px_rgba(0,0,0,0.04)] font-serif text-[#1a1a1a]"
      style={{ backgroundColor: '#e8e4dc', backgroundImage: noiseTexture }}
    >
      <h2 className="font-serif text-xl font-bold! text-[#111] mb-6 leading-snug">{title}</h2>
      {content.map((line, i) => (
        <p key={i} className="text-[17px] leading-relaxed text-[#1c1c1c] mb-4.5 last:mb-0 tracking-[0.01em]">
          {line}
        </p>
      ))}
    </div>
  )
}
