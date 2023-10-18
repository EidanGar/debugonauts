"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { ControllerRenderProps } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps<T> {
  placeholder?: string
  options: {
    value: T
    label: string
  }[]
  currentValue: T
  onChange?: (value: T) => void
  props: ControllerRenderProps
}

const Combobox = <T,>({
  options,
  currentValue,
  placeholder,
  props,
}: ComboboxProps<T>) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {placeholder ?? options[0].label}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          {...{
            ...props,
            onValueChange: (value) => props.onChange({ target: { value } }),
          }}
        >
          <CommandInput placeholder={placeholder ?? options[0].label} />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={String(option.value)}
                onSelect={(currentValue) => {
                  // Perform a type check or conversion here, depending on your use case
                  const newValue = currentValue as unknown as T // Unsafe cast: Make sure this is valid in your use case
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentValue === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
