import React from 'react';

interface BentoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function BentoCard({ title, description, icon, children, className = '' }: BentoCardProps) {
  return (
    <div className={`glass-panel glass-panel-hover p-8 h-full flex flex-col ${className}`}>
      {icon && (
        <div className="mb-6 inline-flex items-center justify-center p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-[#10B981]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      {children && <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.05)]">{children}</div>}
    </div>
  );
}
