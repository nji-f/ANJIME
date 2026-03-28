"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

export default function WatchPage({ params }: { params: { id: string } }) {
    const animeId = params.id;
    const [animeInfo, setAnimeInfo] = useState<any>(null);
    const [currentEpId, setCurrentEpId] = useState<string | null>(null);
    const [streamData, setStreamData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 1. Ambil Info Detail Anime (untuk daftar episode)
    useEffect(() => {
        setLoading(true);
        fetch(`https://api.consumet.org/anime/gogoanime/info/${animeId}`)
            .then(res => res.json())
            .then(data => {
                setAnimeInfo(data);
                // Set default episode pertama
                if (data.episodes && data.episodes.length > 0) {
                    setCurrentEpId(data.episodes[0].id);
                } else {
                    setLoading(false);
                }
            })
            .catch(() => setLoading(false));
    }, [animeId]);

    // 2. Ambil Link Streaming saat episode dipilih
    useEffect(() => {
        if (currentEpId) {
            setStreamData(null); // Reset player saat loading ep baru
            fetch(`https://api.consumet.org/anime/gogoanime/watch/${currentEpId}`)
                .then(res => res.json())
                .then(data => {
                    setStreamData(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [currentEpId]);

    if (loading && !animeInfo) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Memuat ANJIME...</div>;
    }

    if (!animeInfo) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4 text-center">
            <AlertTriangle className="text-red-500 mb-2" size={48} />
            <p>Gagal memuat anime. API sedang sibuk.</p>
        </div>;
    }

    const currentEpisodeObj = animeInfo.episodes?.find((ep: any) => ep.id === currentEpId);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Header Minimal */}
            <header className="p-4 border-b border-slate-800 flex items-center gap-4">
                <Link href="/" className="text-slate-400 hover:text-white transition">
                    <ChevronLeft size={24} />
                </Link>
                <Link href="/" className="text-2xl font-black text-white">
                    AN<span className="text-blue-500">JIME</span>
                </Link>
            </header>

            <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Bagian Kiri: Video Player */}
                <div className="lg:col-span-3">
                    {/* Container Video Responsif (16:9) */}
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                        {streamData?.embedURL ? (
                            <iframe 
                                src={streamData.embedURL} 
                                className="absolute inset-0 w-full h-full" 
                                allowFullScreen 
                                scrolling="no"
                                title={`Nonton ${animeInfo.title}`}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                <AlertTriangle size={40} className="mb-2 text-yellow-500"/>
                                <p>Loading server video...</p>
                            </div>
                        )}
                    </div>

                    {/* Info Anime di bawah video */}
                    <div className="mt-6 p-5 bg-slate-900 rounded-xl border border-slate-800">
                        <h1 className="text-2xl font-bold">{animeInfo.title}</h1>
                        <p className="text-blue-400 mt-1 font-medium">Episode: {currentEpisodeObj?.number || '??'}</p>
                        <p className="text-slate-400 mt-4 text-sm leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                            {animeInfo.description || 'Tidak ada sinopsis.'}
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan: Daftar Episode (Responsif) */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 sticky top-24">
                        <h2 className="text-lg font-bold mb-4 border-b border-slate-800 pb-2">Daftar Episode</h2>
                        {/* Scrollable area untuk episode banyak */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {animeInfo.episodes?.map((ep: any) => (
                                <button 
                                    key={ep.id}
                                    onClick={() => setCurrentEpId(ep.id)}
                                    className={`p-2 rounded-md text-sm font-semibold transition flex items-center justify-center
                                    ${currentEpId === ep.id 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                >
                                    {ep.number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            
            {/* CSS Sederhana untuk Scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}</style>
        </div>
    );
}
