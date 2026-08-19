"use client";

import { KeyboardEvent, useCallback, useId, useRef, useState } from "react";
import { useClickAway } from "react-use";

export type NiceSelectOption = {
  value: string;
  text: string;
};

type NiceSelectProps = {
  options: NiceSelectOption[];
  defaultCurrent: number;
  placeholder: string;
  className?: string;
  onChange: (item: NiceSelectOption, name: string) => void;
  name: string;
};

const NiceSelect = ({
  options,
  defaultCurrent,
  placeholder,
  className,
  onChange,
  name,
}: NiceSelectProps) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<NiceSelectOption | undefined>(
    options[defaultCurrent],
  );
  const listboxId = useId();
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);
  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(ref, onClose);

  const currentHandler = (item: NiceSelectOption) => {
    setCurrent(item);
    onChange(item, name);
    onClose();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((currentOpen) => !currentOpen);
    }

    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    item: NiceSelectOption,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      currentHandler(item);
    }
  };

  return (
    <div
      className={`nice-select form-select-lg mb-3 ${className || ""} ${open ? "open" : ""}`}
      role="combobox"
      aria-controls={listboxId}
      aria-expanded={open}
      tabIndex={0}
      onClick={() => setOpen((prev) => !prev)}
      onKeyDown={handleTriggerKeyDown}
      ref={ref}
    >
      <span className="current">{current?.text || placeholder}</span>
      <ul
        id={listboxId}
        className="list"
        role="listbox"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {options?.map((item, i) => (
          <li
            key={i}
            data-value={item.value}
            className={`option ${
              item.value === current?.value ? "selected focus" : ""
            }`}
            style={{ fontSize: "14px" }}
            role="option"
            aria-selected={item.value === current?.value}
            tabIndex={open ? 0 : -1}
            onClick={() => currentHandler(item)}
            onKeyDown={(event) => handleOptionKeyDown(event, item)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NiceSelect;
