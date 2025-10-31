import React from "react";

interface AccordionProps {
  question: string;
  children: React.ReactNode;
}

export default function Accordion({ question, children }: AccordionProps) {
  return (
    <div className="collapse collapse-arrow bg-base-100 border-2  border-base-300">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-lg font-semibold">
        {question}
      </div>
      <div className="collapse-content text-md">
        {children}
      </div>
    </div>
  );
}
