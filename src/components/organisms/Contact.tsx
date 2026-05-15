import Text from "../atoms/Text"
import Title from "../atoms/Title"
import { Facebook, Twitter, Instagram } from "../../../public/assets/icons/icons";

export default function Contact() {
    return (
        <section className="ds-bg-alt py-10 md:py-20">
            <div className="ds-container flex flex-col items-center justify-between gap-10 md:gap-40 md:flex-row">
                <div className="flex flex-col gap-4 w-full md:w-1/2">
                    <Title variant="disabled" size="sm" className="m-0">Contact Us</Title>
                    <Text variant="primary" size="lg" className="m-0">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit odit eos, natus ducimus doloremque laborum repellat porro numquam perspiciatis ullam!</Text>

                    <form action="" method="post" className="flex flex-col w-full gap-4 items-center">
                        <div className="flex w-full gap-4">
                            <input type="text" placeholder="Name"  className="ds-input w-full ds-bg py-4 px-2 ds-rounded-lg" />
                            <input type="tel" placeholder="Phone" className="ds-input w-full ds-bg py-4 px-2 ds-rounded-lg" />
                        </div>
                        <input type="email" placeholder="Email" className="ds-input w-full ds-bg py-4 px-2 ds-rounded-lg" />
                        <textarea placeholder="Message" className="ds-input w-full ds-bg py-4 px-2 ds-rounded-lg"></textarea>
                        <button type="submit" className="ds-btn ds-bg-primary py-4 ds-rounded-lg w-full">Send</button>
                    </form>
                </div>
                <div className="flex flex-col gap-10 justify-start w-full md:w-1/2">
                    <div className="flex flex-col items-start gap-2">
                        <Title variant="disabled" size="sm" className="m-0">Location</Title>
                        <Text variant="primary" size="lg" className="m-0">123 Main St, Anytown, USA</Text>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <Title variant="disabled" size="sm" className="m-0">Email</Title>
                        <Text variant="primary" size="lg" className="m-0">[EMAIL_ADDRESS]</Text>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <Title variant="disabled" size="sm" className="m-0">Phone</Title>
                        <Text variant="primary" size="lg" className="m-0">0555555555</Text>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <Title variant="disabled" size="sm" className="m-0">Social Media</Title>
                        <div className="flex flex-row items-center gap-2">
                            <button className="ds-btn py-2 px-2 ds-rounded-lg"><Facebook size={24} className="ds-text-alt cursor-pointer" /></button>
                            <button className="ds-btn py-2 px-2 ds-rounded-lg"><Twitter size={24} className="ds-text-alt cursor-pointer" /></button>
                            <button className="ds-btn py-2 px-2 ds-rounded-lg"><Instagram size={24} className="ds-text-alt cursor-pointer" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}