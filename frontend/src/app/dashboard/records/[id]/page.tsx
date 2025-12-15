'use client';

import { useEffect, useState, use } from 'react';
import { RecordItem, RecordsService } from '@/services/records.service';

import { useRouter } from 'next/navigation';

export default function RecordDetailsPage({ params }: { params: Promise<{ id: number }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [record, setRecord] = useState<RecordItem | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadOneRecord = async () => {
            try {
                const data = await RecordsService.getById(id);
                setRecord(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadOneRecord();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
    if (!record) return <div className="p-10 text-center text-red-500">Error</div>;

    return (
        <div className="max-w-3xl mx-auto py-10">
            <button
                onClick={() => router.back()}
                className="mb-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                ← Back
            </button>

            <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{record.title}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 border-b pb-8">
                    <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    {record.author && (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                            Author:{' '}
                            {record.author.firstName
                                ? `${record.author.firstName} ${record.author.lastName || ''}`
                                : record.author.email}
                        </span>
                    )}
                </div>

                <div className="prose prose-lg text-gray-700 whitespace-pre-wrap leading-relaxed">{record.content}</div>
            </div>
        </div>
    );
}
