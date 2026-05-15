"use client";
import Text from "@/components/atoms/Text";
import Title from "@/components/atoms/Title";
import { ThemeToggle } from "@/components/atoms/ThemeButton";
import Box from "@/components/molecules/Box";
import { dataBox } from "@/utils/data";
import Images from "@/components/atoms/Images";
import { hero } from "../../public/assets/images/images";
import { Users, Sun } from "../../public/assets/icons/icons";
import Icon from "@/components/atoms/Icon";
import PublicLayout from "@/components/layout/PublicLayout";
import useReveal from "@/animations/Reveal";
import Floating from "@/animations/floating";
import Hero from "@/components/organisms/Hero";
import Special from "@/components/organisms/Special";
import WhyUs from "@/components/organisms/WhyUs";
import Reviwes from "@/components/organisms/Reviews";
import Contact from "@/components/organisms/Contact";

export default function Page() {
  useReveal(".Reveal-Section");
  return (
    <div>
      <PublicLayout>
        
        <Hero />
        <Special />
        <WhyUs />
        <Reviwes />
        <Contact />
      </PublicLayout>
    </div>
  );
}
