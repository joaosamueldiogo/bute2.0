import { Merriweather, Oswald, Roboto } from "next/font/google";

export const merriweatherHeading = Merriweather({subsets:['latin'],variable:'--font-heading'});
export const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
export const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});