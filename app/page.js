import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import WorkSection from '@/components/WorkSection';
import AdvantagesSection from '@/components/AdvantagesSection';
import AboutSection from '@/components/AboutSection';
import QuestionsSection from '@/components/QuestionsSection';
import { getSections, getProducts } from '@/lib/data';

export default async function Home() {
  const [sections, products] = await Promise.all([getSections(), getProducts()]);

  const hero              = sections.find((s) => s.key === 'hero')       ?? null;
  const productsSection   = sections.find((s) => s.key === 'products')   ?? null;
  const workSection       = sections.find((s) => s.key === 'our-work')   ?? null;
  const advantagesSection = sections.find((s) => s.key === 'advantages') ?? null;
  const aboutSection      = sections.find((s) => s.key === 'about-us')      ?? null;
  const questionsSection  = sections.find((s) => s.key === 'any-questions') ?? null;

  return (
    <main>
      <HeroSection section={hero} />
      <ProductsSection
        products={products}
        title={productsSection?.title ?? null}
      />
      <WorkSection section={workSection} />
      <AdvantagesSection section={advantagesSection} />
      <AboutSection section={aboutSection} />
      <QuestionsSection section={questionsSection} />
    </main>
  );
}
