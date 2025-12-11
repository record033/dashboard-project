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
    loadRecords();
  }, []);

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

  if (loading) return <div>loading records...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Records</h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Create new record</h3>
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder-gray-400"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Text..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-32 resize-none placeholder-gray-400"
              required
            />
          </div>
          <div className="flex justify-end">
             <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Publish
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {records.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-lg">No records yet</p>
          </div>
        ) : (
          records.map((record) => (
            <Link href={`/dashboard/records/${record.id}`} className="hover:underline" key={record.id} >
              <div 
                
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative flex flex-col"
              >
                {record.author && (
                  <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                    {record.author.firstName 
                     ? `${record.author.firstName} ${record.author.lastName || ''}` 
                     : record.author.email}
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors pr-8">
                    {record.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {record.content}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}