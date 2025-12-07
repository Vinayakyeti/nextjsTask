import { AnswerReviewForm } from '@/app/components/AnswerReviewForm';

export const metadata = {
  title: 'AI Answer Review | Interview Prep Hub',
  description: 'Get AI-powered feedback on your interview answers',
};

export default function AIReviewPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <AnswerReviewForm />
      </div>
    </div>
  );
}
