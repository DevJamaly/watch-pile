interface ViewToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

function ViewToggleButton({ isOpen, onToggle }: ViewToggleButtonProps) {
  return (
    <button className="btn-toggle" data-open={isOpen} onClick={onToggle} />
  );
}

export default ViewToggleButton;
