import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  className,
  testId,
  disabled = false,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            className={cn("h-8 w-8", className)}
            onClick={onClick}
            disabled={disabled}
            data-testid={testId}
          >
            {Icon && <Icon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ActionButtonGroup = ({ children, className }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {children}
    </div>
  );
};
