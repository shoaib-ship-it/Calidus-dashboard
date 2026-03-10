import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const RatingStars = ({ rating, maxRating = 5, size = "sm", showValue = true }) => {
  const sizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizes[size], "fill-amber-400 text-amber-400")}
          />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizes[size], "text-muted")} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={cn(sizes[size], "fill-amber-400 text-amber-400")} />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizes[size], "text-muted")}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};
