import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = "w-7 h-7", size = 28 }: BrandLogoProps) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <Image
        src="/brand/logo-mark-black.png"
        alt="ProSkillAI"
        width={size}
        height={size}
        className="w-full h-full object-contain dark:hidden"
        priority
      />
      <Image
        src="/brand/logo-mark-white.png"
        alt="ProSkillAI"
        width={size}
        height={size}
        className="w-full h-full object-contain hidden dark:block"
        priority
      />
    </div>
  );
}
