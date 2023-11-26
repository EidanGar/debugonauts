import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react"
import { Command as CommandPrimitive } from "cmdk"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"

interface MultiSelectProps {
  options: string[]
  selectedTags: string[]
  setSelectedTags: Dispatch<SetStateAction<string[]>>
}

const MultiSelect = ({
  options,
  selectedTags,
  setSelectedTags,
}: MultiSelectProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1)

  const handleUnselect = useCallback((option: string) => {
    setSelectedTags((prev) => prev.filter((str) => str !== option))
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelectedTags((prev) => {
              const newselectedTags = [...prev]
              newselectedTags.pop()
              return newselectedTags
            })
          }
        }
        if (e.key === "Escape") {
          input.blur()
        }

        if (e.key === "ArrowDown") {
          setFocusedOptionIndex((prevIndex) =>
            Math.min(prevIndex + 1, options.length - 1)
          )
        }
        if (e.key === "ArrowUp") {
          setFocusedOptionIndex((prevIndex) => Math.max(prevIndex - 1, 0))
        }
      }
    },
    [options.length]
  )

  const MAX_MULTI_SELECT_OPTIONS_SHOWN = 10
  const selectables = options
    .filter((option) => !selectedTags.includes(option))
    .slice(0, MAX_MULTI_SELECT_OPTIONS_SHOWN)

  return (
    <Command
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      className="overflow-visible bg-transparent"
    >
      <div
        className="px-3 py-2 text-sm border rounded-md group border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        aria-owns="listbox"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((option) => (
            <Badge key={option} variant="secondary">
              {option}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select options..."
            className="flex-1 ml-2 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div
            className="absolute top-0 z-10 w-full border rounded-md shadow-md outline-none bg-popover text-popover-foreground animate-in"
            role="listbox"
            id="listbox"
          >
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option, index) => (
                <CommandItem
                  key={option}
                  role="option"
                  aria-selectedTags={index === focusedOptionIndex}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onSelect={(value) => {
                    setInputValue("")
                    setSelectedTags((prev) => [...prev, option])
                    setFocusedOptionIndex(-1)
                  }}
                  className={"cursor-pointer"}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}

export default MultiSelect
