"use client";
import React, { useState, useEffect } from 'react';
import { Search, Play } from 'lucide-react';
import Link from 'next/link';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Ambil anime populer untuk homepage
  useEffect(() => {
    fetch('https://api.consumet.org/anime/gogoanime/top-airing')
      .then(res => res.json())
      .then(data => setAnimeList(data.results));
  }, []);

  // Logika Pencarian Sederhana
  useEffect(() => {
    if (search.length > 2) {
      fetch(`https://api.consumet.org/anime/gogoanime/${search}`)
        .then(res => res.json())
        .then(data => setSearchResults(data.results));
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const listToDisplay = search.length > 2 ? searchResults : animeList;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header & Search */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* NAMA WEB: ANJIME */}
        <Link href="/" className="text-3xl font-black text-white hover:text-blue-500 transition">
          AN<span className="text-blue-500">JIME</span>
        </Link>
        
        <div className="relative w-full md:w-96">
          <input 
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 px-10 focus:outline-none focus:border-blue-500 transition"
            placeholder="Cari anime..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        </div>
      </header>

      {/* Grid Anime - Responsif */}
      <main className="p-4 md:p-8">
        <h2 className="text-xl font-bold mb-6 text-slate-300">
          {search.length > 2 ? `Hasil Pencarian: ${search}` : 'Trending Sekarang'}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {listToDisplay.map((anime: any) => (
            /* Link ke Halaman Watch */
            <Link href={`/watch/${anime.id}`} key={anime.id} className="group block relative bg-slate-900 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-xlshadow-black/20">
              <img src={anime.image} alt={anime.title} className="w-full h-64 sm:h-72 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-2 h-10">{anime.title}</h3>
                <p className="text-xs text-slate-400 mt-1 bg-slate-800 inline-block px-2 py-0.5 rounded">
                  {anime.episodeNumber ? `Eps ${anime.episodeNumber}` : (anime.releaseDate || 'N/A')}
                </p>
              </div>
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="bg-blue-600 rounded-full p-4 scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play fill="white" size={30} className="text-white" />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
