import { Combobox } from "@base-ui/react/combobox";
import type { AssignmentOption } from "./types";

export function AssignmentPicker({
  options,
  value,
  label,
  onChange,
}: {
  options: AssignmentOption[];
  value: AssignmentOption | null;
  label: string;
  onChange: (value: AssignmentOption | null) => void;
}) {
  return (
    <Combobox.Root
      items={options}
      value={value}
      onValueChange={onChange}
      isItemEqualToValue={(item, selected) => item.value === selected.value}
    >
      <div className="flex items-center rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring/50 ">
        <Combobox.Input
          aria-label={label}
          placeholder="Без заняття"
          title={value?.label}
          className="h-9 w-full min-w-0 bg-transparent px-2 text-sm outline-none cursor-pointer"
        />
        <Combobox.Trigger
          type="button"
          aria-label={`Вибрати заняття: ${label}`}
          className="shrink-0 px-2 py-1 cursor-pointer"
        >
          ▾
        </Combobox.Trigger>
        {value && (
          <Combobox.Clear
            type="button"
            aria-label={`Очистити: ${label}`}
            className="shrink-0 px-2 py-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ×
          </Combobox.Clear>
        )}
      </div>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="z-50">
          <Combobox.Popup className="w-80 max-w-[90vw] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md">
            <Combobox.Empty className="p-3 text-sm text-muted-foreground">
              Нічого не знайдено.
            </Combobox.Empty>
            <Combobox.List className="max-h-64 overflow-y-auto p-1">
              {(option: AssignmentOption) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className="cursor-default rounded-md px-3 py-2 text-sm data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:font-semibold"
                >
                  {option.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
