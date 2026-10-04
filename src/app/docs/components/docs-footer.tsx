import { PoweredBySnowflake } from "@/components/shared/powered-by-snowflake";

export function DocsFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-center lg:px-8">
        <PoweredBySnowflake />
        <p className="text-xs text-muted-foreground">
          Synthetic data only. Decision support, not diagnosis.
        </p>
      </div>
    </footer>
  );
}
