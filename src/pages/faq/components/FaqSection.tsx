import { useState, useMemo, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch, FiHelpCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { faqData} from "../faq.data";

// Human-friendly labels for categories
const categoryLabels: Record<string, string> = {
  all: "All Questions",
  general: "General",
  pricing: "Pricing & Access",
  "resume-related": "Resume & Parsing",
  "job-related": "Job Description",
  report: "Reports & ATS",
  ai: "AI Engine",
};

export default function FaqSection() {
  const [selectedType, setSelectedType] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Track multiple open items by unique identifier so opening one doesn't close others
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["0"]));

  // Scroll ref and state for category badges horizontal scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Derive unique categories from data
  const categories = useMemo(() => {
    const types = Array.from(new Set(faqData.map((item) => item.type)));
    return ["all", ...types];
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categories]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 220;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Filter items by selected badge/category and search query
  const filteredFaqs = useMemo(() => {
    return faqData
      .map((item, originalIndex) => ({
        ...item,
        id: String(originalIndex),
      }))
      .filter((item) => {
        const matchesType =
          selectedType === "all" || item.type === selectedType;
        const matchesSearch =
          searchQuery.trim() === "" ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
      });
  }, [selectedType, searchQuery]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: faqData.length };
    faqData.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, []);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIds(new Set(filteredFaqs.map((f) => f.id)));
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Category Badges & Quick Search Header with Bottom Dark Shadow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Badges List with Left & Right Dark Shadows and Scroll Buttons */}
        <div className="relative flex-1 min-w-0 max-w-full">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="absolute left-0.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/95 shadow-md border border-slate-300 flex items-center justify-center text-slate-700 hover:text-(--primaryBlue) hover:scale-110 transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white/95 shadow-md border border-slate-300 flex items-center justify-center text-slate-700 hover:text-(--primaryBlue) hover:scale-110 transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <FiChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Badges Horizontal Scroll View */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((type) => {
              const isSelected = selectedType === type;
              const count = categoryCounts[type] || 0;
              const label = categoryLabels[type] || type.replace("-", " ");

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`group shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? "bg-(--primaryBlue) text-white shadow-sm shadow-indigo-200"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="capitalize">{label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold transition-colors ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input & Expand/Collapse shortcuts */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <button
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-[11px] font-medium"
              title="Expand all currently visible questions"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-[11px] font-medium"
              title="Collapse all questions"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = openIds.has(item.id);
            const badgeLabel = categoryLabels[item.type] || item.type;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-indigo-200 shadow-xs"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Accordion Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left p-4 sm:p-5 gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-start sm:items-center gap-3 pr-2">
                    <span
                      className={`mt-0.5 sm:mt-0 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                        isOpen
                          ? "bg-indigo-50 text-(--primaryBlue)"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                    >
                      {badgeLabel}
                    </span>
                    <h3
                      className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                        isOpen
                          ? "text-(--primaryBlue)"
                          : "text-slate-800 group-hover:text-(--primaryBlue)"
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>

                  {/* Down Icon with smooth rotation */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-indigo-50 text-(--primaryBlue) rotate-180"
                        : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                    }`}
                  >
                    <FiChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Collapsible Answer with smooth CSS grid transition */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                      <div className="pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FiHelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-slate-800">
            No matching questions found
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any questions matching your query in this category.
            Try searching for something else or switch categories.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedType("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-xs font-semibold text-(--primaryBlue) bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
