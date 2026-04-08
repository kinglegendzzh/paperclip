import { Globe } from "lucide-react";
import { useLocale } from "../context/LocaleContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/**
 * Language switcher button.
 * Only renders when more than one locale is registered in SUPPORTED_LOCALES.
 * In V1 (English-only), this component is hidden.
 */
export function LocaleSwitcher() {
  const { locale, setLocale, supportedLocales } = useLocale();
  const localeEntries = Object.entries(supportedLocales);

  // Don't render if only one locale is available
  if (localeEntries.length <= 1) return null;

  const currentLabel = supportedLocales[locale] ?? locale;

  // Simple cycle through available locales
  const currentIndex = localeEntries.findIndex(([code]) => code === locale);
  const nextIndex = (currentIndex + 1) % localeEntries.length;
  const [nextCode, nextLabel] = localeEntries[nextIndex];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground shrink-0"
          onClick={() => setLocale(nextCode)}
          aria-label={`Switch language to ${nextLabel}`}
          title={`${currentLabel} → ${nextLabel}`}
        >
          <Globe className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{`${currentLabel} → ${nextLabel}`}</TooltipContent>
    </Tooltip>
  );
}
