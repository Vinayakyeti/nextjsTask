import AnswerReviewForm from '@/app/components/AnswerReviewForm';

export const metadata = {
  title: 'AI Answer Review - Interview Prep Hub',
  description: 'Get AI-powered feedback on your interview answers',
};

export default function AIReviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <AnswerReviewForm />
      </div>
    </main>
  );
}
