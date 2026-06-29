import WorkSection from '@/components/WorkSection';
import ProductsSection from '@/components/ProductsSection';
import QuestionsSection from '@/components/QuestionsSection';
import { getSections, getProducts } from '@/lib/data';

export default async function Gallery() {
  const [sections, products] = await Promise.all([getSections(), getProducts()]);

  const workSection      = sections.find((s) => s.key === 'our-work')    ?? null;
  const productsSection  = sections.find((s) => s.key === 'products')    ?? null;
  const questionsSection = sections.find((s) => s.key === 'any-questions') ?? null;

  return (
    <main>
      <WorkSection section={workSection} />
      <ProductsSection
        products={products}
        title={productsSection?.title ?? null}
      />
      <QuestionsSection section={questionsSection} />
    </main>
  );
}
