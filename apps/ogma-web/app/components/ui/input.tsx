import * as React from 'react';
import { Button } from './button';

export interface InputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onSubmit, disabled: _disabled, children, placeholder, ...props }, ref) => {
    const [value, setValue] = React.useState('');
    const formRef = React.useRef<HTMLFormElement>(null);
    const disabled = _disabled || !value.replace(/<br>/g, '').trim();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (disabled) return;
      if (!!value.trim()) {
        onSubmit?.(value);
      }
      e.currentTarget.textContent = '';
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const content = e.currentTarget.innerHTML || '';
      setValue(content);

      // Clear the div if it only contains empty elements
      if (!content.replace(/<[^>]*>/g, '').trim()) {
        e.currentTarget.innerHTML = '';
      }
    };

    return (
      <form
        ref={formRef}
        className="transition-shadow duration-300 ease-in-out flex w-full bg-white rounded-md py-2 pl-4 pr-2 gap-1 items-start focus-within:shadow-sm shadow-md"
      >
        <div
          contentEditable
          ref={ref}
          data-placeholder={placeholder}
          className="w-full outline-none self-center empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
          onInput={handleInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              handleSubmit(e);
            }
          }}
          {...props}
        ></div>
        <Button type="submit" disabled={disabled} variant="ghost" className="size-8 rounded-md">
          {children}
        </Button>
      </form>
    );
  }
);
Input.displayName = 'Input';

export { Input };
