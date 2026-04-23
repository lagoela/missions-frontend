const noiseTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`

interface LoginPopupProps {
  onLogin: () => void
  onClose: () => void
}

export default function LoginPopup({ onLogin, onClose }: LoginPopupProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-8"
      style={{ backgroundColor: 'rgba(58, 53, 48, 0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-[360px] px-10 py-9 rounded-sm border-l border-black/8 shadow-[2px_2px_6px_rgba(0,0,0,0.25),inset_0_0_40px_rgba(0,0,0,0.04)] flex flex-col items-center gap-6 text-center"
        style={{ backgroundColor: '#e8e4dc', backgroundImage: noiseTexture }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="font-serif text-xs tracking-[0.25em] uppercase text-[#3a3530]/60">You've reached the limit</p>
          <div className="w-8 h-px bg-[#3a3530]/30" />
        </div>

        <p className="font-serif text-[17px] leading-relaxed text-[#1c1c1c]">
          Log in to unlock <strong>10 missions</strong> at a time and generate as many as you need.
        </p>

        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={onLogin}
            className="w-full font-serif text-sm tracking-widest uppercase text-[#e8e4dc] bg-[#3a3530] px-6 py-2.5 rounded-sm hover:bg-[#2a2520] transition-colors duration-200 cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={onClose}
            className="font-serif text-xs tracking-[0.2em] uppercase text-[#3a3530]/50 hover:text-[#3a3530]/80 transition-colors duration-200 cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
