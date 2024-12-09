function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // props destruction
  const { children, ...rest } = props;

  return (
    <button
      className="
      transition-[background-color, color, border-color, box-shadow]
      duration-200
      ease-in-out
      shadow-md
      hover:shadow-lg
      active:shadow
      border
      border-button-neutral-background/45
      hover:border-button-neutral-background/75
      active:border-button-neutral-background/25
      bg-button-neutral-background/45
      hover:bg-button-neutral-background/75
      active:bg-button-neutral-background/25
      text-button-neutral-color/85
      hover:text-button-neutral-color
      active:text-button-neutral-color/65
      px-4 py-2 rounded-md backdrop-blur-sm"
      {...rest}
    >
      {children}
    </button>
  );
}

export { Button };
