'use client';

import { useEffect, useState } from 'react';
import { RecordItem, RecordsService } from '@/services/records.service';
import Link from 'next/link';

export default function RecordsPage() {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const loadRecords = async () => {
            try {
                const data = await RecordsService.getAll();
                setRecords(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadRecords();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            const newRecord = await RecordsService.create(title, content);
            setRecords([newRecord, ...records]);
            setTitle('');
            setContent('');
        } catch (e) {
            alert('error creating record');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('delete this record?')) return;

        try {
            await RecordsService.delete(id);
            setRecords(records.filter((r) => r.id !== id));
        } catch (e) {
            alert('unable to delete record');
        }
    };

    if (loading) return <div className="p-8 text-gray-500">loading records...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Records</h1>

            {/* Form Container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Create new record</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-24 placeholder-gray-400"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm">
                            Publish
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Author
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/records/${record.id}`}
                                                className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                {record.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {record.content}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record.author && (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {record.author.firstName
                                                            ? `${record.author.firstName} ${record.author.lastName || ''}`
                                                            : 'Unknown'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{record.author.email}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                title="Delete">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
