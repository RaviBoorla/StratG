'use client';

import WorkItemForm from '@/components/WorkItemForm';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/work-items');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Create New Work Item</h1>
        <p className="text-gray-600 mt-2">Fill the form below. Title field auto-saves.</p>
      </div>

      <WorkItemForm onSuccess={handleSuccess} />
    </div>
  );
}