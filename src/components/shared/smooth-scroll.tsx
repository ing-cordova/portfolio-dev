"use client"

interface SmoothScrollProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export function SmoothScroll({ targetId, children, className }: SmoothScrollProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const navbarHeight = 64; // Height of fixed navbar
      const targetPosition = target.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}