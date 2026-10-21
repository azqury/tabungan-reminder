"use client";
import { useEffect, useRef, useState } from "react";

const fmt = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function CurrencyInput({
  name,
  placeholder,
  defaultValue,
  className,
  required,
}: {
  name: string;
  placeholder?: string;
  defaultValue?: number | string;
  className?: string;
  required?: boolean;
}) {
  const initial = defaultValue ? String(Math.round(Number(defaultValue))) : "";
  const [digits, setDigits] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);

  // Kosongkan lagi setelah form berhasil dikirim
  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;
    const onReset = () => setDigits(initial);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [initial]);

  return (
    <>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        required={required}
        className={className}
        value={fmt(digits)}
        onChange={(e) =>
          setDigits(e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 15))
        }
      />
      <input type="hidden" name={name} value={digits} />
    </>
  );
}
