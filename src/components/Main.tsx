export interface MainProps {
  children: React.ReactNode;
}

function Main({ children }: MainProps) {
  return <main className="main">{children}</main>;
}

export default Main;
