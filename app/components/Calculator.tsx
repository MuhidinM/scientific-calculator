"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type CalculatorProps = {
  displayValue: string;
  previousValue: string;
  operator: string | null;
};

export default function Calculator() {
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<CalculatorProps>({
    displayValue: "0",
    previousValue: "",
    operator: null,
  });

  // Use useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null or loading state until component is mounted
  if (!mounted) {
    return null; // or return a loading spinner
  }

  const scientificButtons = [
    ["sin", "cos", "tan", "π"],
    ["√", "x²", "x³", "^"],
    ["(", ")", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

  const handleNumber = (num: string) => {
    setState((prev) => ({
      ...prev,
      displayValue: prev.displayValue === "0" ? num : prev.displayValue + num,
    }));
  };

  const handleOperator = (op: string) => {
    setState((prev) => ({
      displayValue: "0",
      previousValue: prev.displayValue,
      operator: op,
    }));
  };

  const calculate = () => {
    if (!state.previousValue || !state.operator) return;

    const prev = parseFloat(state.previousValue);
    const current = parseFloat(state.displayValue);
    let result = 0;

    switch (state.operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        result = prev / current;
        break;
      case "^":
        result = Math.pow(prev, current);
        break;
    }

    setState({
      displayValue: result.toString(),
      previousValue: "",
      operator: null,
    });
  };

  const handleScientific = (func: string) => {
    const current = parseFloat(state.displayValue);
    let result = 0;

    switch (func) {
      case "sin":
        result = Math.sin(current);
        break;
      case "cos":
        result = Math.cos(current);
        break;
      case "tan":
        result = Math.tan(current);
        break;
      case "π":
        result = Math.PI;
        break;
      case "√":
        result = Math.sqrt(current);
        break;
      case "x²":
        result = Math.pow(current, 2);
        break;
      case "x³":
        result = Math.pow(current, 3);
        break;
    }

    setState({
      displayValue: result.toString(),
      previousValue: "",
      operator: null,
    });
  };

  return (
    <div className="w-96 bg-slate-900 p-4 rounded-lg shadow-xl">
      <div className="bg-slate-800 p-4 rounded-lg mb-4">
        <div className="text-right text-2xl text-white font-mono">
          {state.displayValue}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {scientificButtons.map((row, i) =>
          row.map((btn, j) => (
            <Button
              key={`${i}-${j}`}
              variant="secondary"
              className="p-4 text-lg"
              onClick={() => {
                if ("0123456789.".includes(btn)) {
                  handleNumber(btn);
                } else if ("+-×÷^".includes(btn)) {
                  handleOperator(btn);
                } else if (btn === "=") {
                  calculate();
                } else {
                  handleScientific(btn);
                }
              }}
            >
              {btn}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
