import AboutSection    from '@/components/AboutSection';
import WorkSection     from '@/components/WorkSection';
import QuestionsSection from '@/components/QuestionsSection';
import { getSections } from '@/lib/data';

export const metadata = { title: 'About Us' };

export default async function AboutPage() {
  const sections = await getSections();

  const aboutSection     = sections.find((s) => s.key === 'about-us')      ?? null;
  const workSection      = sections.find((s) => s.key === 'our-work')       ?? null;
  const questionsSection = sections.find((s) => s.key === 'any-questions')  ?? null;

  return (
    <main>
      <AboutSection    section={aboutSection} />
      <WorkSection     section={workSection} />
      <QuestionsSection section={questionsSection} />
    </main>
  );
}
