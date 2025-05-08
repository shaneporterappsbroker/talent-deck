import { ReactNode } from "react";

interface StickyFooterProps {
  children: ReactNode;
}

const StickyFooter = ({ children }: StickyFooterProps) => {
  return children ? (
    <div className="sticky bottom-0 w-full bg-[#343541] border-t-2 border-[#40414f] px-4 py-4">
      {children}
    </div>
  ) : null;
};

export default StickyFooter;
