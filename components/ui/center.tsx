export const Center = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#343541]">
      {children}
    </div>
  );
};
