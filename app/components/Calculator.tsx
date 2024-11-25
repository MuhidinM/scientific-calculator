"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type CalculatorProps = {
  displayValue: string;
  previousValue: string;
  operator: string | null;
};

export default function Calculator() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<CalculatorProps>({
    displayValue: "0",
    previousValue: "",
    operator: null,
  });

  const handleNumber = (num: string) => {
    if (num === "." && state.displayValue.includes(".")) return;

    setState((prev) => ({
      ...prev,
      displayValue:
        prev.displayValue === "0" && num !== "."
          ? num
          : prev.displayValue + num,
    }));
  };

  const handleOperator = (op: string) => {
    setState((prev) => ({
      displayValue: op,
      previousValue: prev.displayValue,
      operator: op,
    }));
  };

  const handleBackspace = () => {
    setState((prev) => ({
      ...prev,
      displayValue:
        prev.displayValue.length > 1 ? prev.displayValue.slice(0, -1) : "0",
    }));
  };

  const handleClear = () => {
    setState({
      displayValue: "0",
      previousValue: "",
      operator: null,
    });
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ("0123456789.".includes(e.key)) {
        if (e.key === "." && state.displayValue.includes(".")) return;
        handleNumber(e.key);
      } else if (["+", "-"].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === "*" || e.key.toLowerCase() === "x") {
        handleOperator("×");
      } else if (e.key === "/") {
        handleOperator("÷");
      } else if (e.key === "^") {
        handleOperator("^");
      } else if (e.key === "Enter" || e.key === "=") {
        calculate();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
        handleClear();
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "l":
            handleScientific("log");
            break;
          case "s":
            handleScientific("sin");
            break;
          case "o":
            handleScientific("cos");
            break;
          case "t":
            handleScientific("tan");
            break;
          case "p":
            handleScientific("π");
            break;
          case "r":
            handleScientific("√");
            break;
          case "q":
            handleScientific("x²");
            break;
          case "u":
            handleScientific("x³");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state]);

  if (!mounted) {
    return null;
  }

  const scientificButtons = [
    ["%", "MR", "⌫", "C"],
    ["log", "sin", "cos", "tan"],
    ["π", "√", "x²", "x³"],
    ["(", ")", "^", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

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
      case "log":
        result = Math.log10(current);
        break;
    }

    setState({
      displayValue: result.toString(),
      previousValue: "",
      operator: null,
    });
  };

  const toggleSign = () => {
    setState((prev) => ({
      ...prev,
      displayValue: prev.displayValue.startsWith("-")
        ? prev.displayValue.slice(1)
        : "-" + prev.displayValue,
    }));
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
              className={`p-4 text-lg ${
                btn === "C" ? "bg-red-500 hover:bg-red-600" : ""
              }`}
              onClick={() => {
                if ("0123456789.".includes(btn)) {
                  handleNumber(btn);
                } else if ("+-×÷^".includes(btn)) {
                  handleOperator(btn);
                } else if (btn === "=") {
                  calculate();
                } else if (btn === "C") {
                  handleClear();
                } else if (btn === "⌫") {
                  handleBackspace();
                } else if (btn === "±") {
                  toggleSign();
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
