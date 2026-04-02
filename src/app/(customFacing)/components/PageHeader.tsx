interface PageHeaderProps {
  accent: string;
  title?: string;
  subtitle?: string;
}

// Reusable subpage header
export function PageHeader({ accent, title, subtitle }: PageHeaderProps) {
  return (
    <div className="pb-16 pt-2">
      <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
        <span className="text-primary">{accent}</span>
        {title && (
          <>
            <br />
            <span className="text-gray-900">{title}</span>
          </>
        )}
      </h1>
      {subtitle && <p className="mt-4 text-lg text-gray-600 max-w-2xl">{subtitle}</p>}
    </div>
  );
}
