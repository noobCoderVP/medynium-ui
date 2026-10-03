import { Shell } from "./components/shell";

export default function WorkstationLayout({ children }: LayoutProps<"/">) {
  return <Shell>{children}</Shell>;
}
