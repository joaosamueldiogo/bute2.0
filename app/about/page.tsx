import { CarousselItem, InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Designer  from "../../public/images/Designer.jpg"
import Developer  from "../../public/images/Developer.jpg"
import Manager  from "../../public/images/Manager.jpg"
import MusicalAdvisor  from "../../public/images/MusicalAdvisor.jpg"
import SalesMan  from "../../public/images/SalesMan.jpg"
import SpiritualAdvisor  from "../../public/images/SpiritualAdvisor.jpg"
import Breadcrumbs from "@/components/ui/songs/breadcrumbs";
import { oswald } from "@/components/ui/fonts";

const carousselItems: CarousselItem[] = [
  {
      name: "Designer",
      quote: "This is the first quote.",
      img: Designer
  },
  {
      name: "Developer",
      quote: "This is the second quote.",
      img: Developer,
  },
  {
      name: "Manager",
      quote: "This is the third quote.",
      img: Manager
  },
  {
    name: "Musical Specialist",
    quote: "This is the third quote.",
    img: MusicalAdvisor
  },
  {
    name: "Sales Director",
    quote: "This is the third quote.",
    img: SalesMan
  },
  {
    name: "Spiritual Advisor",
    quote: "This is the third quote.",
    img: SpiritualAdvisor
  }
];


export default async function About() {
  const shuffledItems = carousselItems
  .map(item => ({ item, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ item }) => item);

  return <>

    <section className="flex-col-center w-full gap-4 p-4">
      <div className="flex-col-center w-full gap-4 p-4">
        <h2 className={`text-heading dark:text-heading-dark text-large ${oswald.className}`}>Saber Mais</h2>	
        <div className="max-w-[30rem] text-ellipsis bg-surface-300 dark:bg-surface-dark-300 p-4 rounded-lg text-light">
          <h3 className="text-lg">Olá!</h3>
          <p>
          A <span className={`text-primary-200 ${oswald.className} text-[1.5rem]`}>MÚSICA</span> é um instrumento valioso no nosso caminho Ajuda-nos a rezar e a expressar algumas coisas a <span className={`text-primary-200 ${oswald.className} text-[1.5rem]`}>DEUS</span> quando não conseguemimos fazê-lo sozinhos.
          </p>
          <p>
          Além disso, a música também dá forma à nossa <span className={`text-primary-200 ${oswald.className} text-[1.5rem]`}>ALEGRIA</span> de sermos cristãos.
          </p>
          <p>
          Assim, surge este novo <span className={`text-primary-200 ${oswald.className} text-[1.5rem]`}>BUTE</span> à distância de um dedo, com cânticos novos e inspiradores.
          </p>
          <p>
          Quem sabe se a próxima edição não será feita por <span className={`text-primary-200 ${oswald.className} text-[1.5rem]`}>TI?</span> 
          </p>
          <h2 className="mt-6 text-2xl text-bold">Bute lá cantar?</h2>
        </div>
      </div>
      

      <div className="flex-col-center w-full gap-4 p-4 overflow-hidden">
        <h2 className={`text-heading dark:text-heading-dark text-large ${oswald.className}`}>Equipa</h2>	
        <InfiniteMovingCards
          items={shuffledItems.slice(0, Math.ceil(carousselItems.length / 2))}
          direction="right"
          speed="fast"
          pauseOnHover={false}
        />
        <InfiniteMovingCards
          items={shuffledItems.slice(Math.ceil(carousselItems.length / 2))}
          direction="left"
          speed="fast"
          pauseOnHover={false}
        />
      </div>
    </section>
  </>
}
