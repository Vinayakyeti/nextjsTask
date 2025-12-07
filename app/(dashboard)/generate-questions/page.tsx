import QuestionGeneratorForm from '@/app/components/QuestionGeneratorForm';

export const metadata = {
  title: 'AI Question Generator - Interview Prep Hub',
  description: 'Generate interview questions using AI for any topic or skill',
};

export default function QuestionGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <QuestionGeneratorForm />
      </div>
    </main>
  );
}
