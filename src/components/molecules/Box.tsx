import Title from "../atoms/Title";
import Text from "../atoms/Text";
import { useTranslations } from "next-intl";
import Icon from "../atoms/Icon";
import { ComponentType } from "react";

interface Props {
  title: string;
  text: string;
  IconComponent: ComponentType<{ size?: number | undefined; className?: string | undefined; }>;
}

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
export default function Box({ title, text, IconComponent }: Props) {
  const t = useTranslations();
  return (
    <div className="ds-bg p-8 ds-shadow-md ds-rounded-md w-45 lg:w-75 flex flex-col items-center justify-center gap-4">
      <Icon IconComponent={IconComponent} size={40} color="disabled" />
      <Title variant="primary" size={isMobile ? "sm" : "md"} center={true}>
        {t(title)}
      </Title>
      <Text variant="disabled" size={"sm"} center={true}>
        {t(text)}
      </Text>
    </div>
  );
}
