import ThemeProvider from "./ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import ReactQueryProvider from "./ReactQueryProvider";

interface Props {
  children: React.ReactNode;
}
export default function AppProviders({ children }: Props) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
