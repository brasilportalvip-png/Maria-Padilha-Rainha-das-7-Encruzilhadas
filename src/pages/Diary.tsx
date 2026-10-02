import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { PenTool, Trash2, Calendar, AlertCircle, BookOpen, Plus, Tag } from 'lucide-react';
import { DiaryEntry } from '../types/spiritual';

export const Diary: React.FC = () => {
  const { diary, addDiaryEntry, deleteDiaryEntry } = useApp();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DiaryEntry['category']>('sonho');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addDiaryEntry(title, content, category);
    
    // Reset Form
    setTitle('');
    setContent('');
    setCategory('sonho');
    setShowForm(false);
  };

  const getCategoryBadge = (cat: DiaryEntry['category']) => {
    const badges = {
      sonho: { text: '💤 Sonho', color: 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300' },
      sinal: { text: '🦋 Sinal', color: 'bg-amber-950/50 border-amber-500/30 text-amber-300' },
      intuicao: { text: '👁️ Intuição', color: 'bg-purple-950/50 border-purple-500/30 text-purple-300' },
      acontecimento: { text: '🕯️ Acontecimento', color: 'bg-red-950/50 border-red-500/30 text-red-300' }
    };
    const current = badges[cat] || badges['sonho'];
    return (
      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wider uppercase font-mono ${current.color}`}>
        {current.text}
      </span>
    );
  };

  return (
    <div id="mp_diary_portal" className="mx-auto max-w-5xl px-4 py-8 text-white">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-900 pb-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-[#D4AF37]">
            Diário Espiritual Privado
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Anote suas experiências extra-sensoriais, sonhos reveladores ou sinais do cotidiano para acompanhar sua evolução espiritual de forma 100% segura.
          </p>
        </div>

        <button
          id="btn_toggle_diary_form"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-red-800 to-red-650 hover:from-red-700 hover:to-red-600 text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer transition-all"
        >
          {showForm ? 'Fechar Registro' : 'Registrar Nova Vivência'}
        </button>
      </div>

      {/* NEW ENTRY FORM */}
      {showForm && (
        <motion.div
          id="diary_form_container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border border-gray-800 bg-black/75 p-5 md:p-6 shadow-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">Título do Acontecimento</label>
                <input
                  id="diary_title"
                  type="text"
                  placeholder="Ex: Borboleta preta no quarto / Sonho com Maria Padilha"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">Categoria de Vivência</label>
                <select
                  id="diary_category_select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DiaryEntry['category'])}
                  className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                >
                  <option value="sonho">Sonho 💤</option>
                  <option value="sinal">Sinal / Sincronia 🦋</option>
                  <option value="intuicao">Intuição / Visão 👁️</option>
                  <option value="acontecimento">Acontecimento Físico 🕯️</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">Relato Completo das Emoções & Sinais</label>
              <textarea
                id="diary_content"
                rows={4}
                placeholder="Descreva detalhadamente o que sentiu, as cores, os sons ou o mistério que vivenciou..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                id="btn_cancel_diary"
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-1.5 rounded text-xs text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                id="btn_save_diary_entry"
                type="submit"
                className="px-5 py-1.5 rounded bg-gradient-to-r from-red-800 to-red-650 hover:from-red-700 hover:to-red-600 text-xs font-bold uppercase text-white shadow"
              >
                Salvar no Diário
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* DIARY ENTRIES LIST */}
      {diary.length === 0 ? (
        <div className="rounded-xl border border-gray-900 bg-black/40 p-12 text-center">
          <BookOpen className="mx-auto w-10 h-10 text-gray-600 mb-2" />
          <h3 className="font-serif text-base font-bold text-gray-300">Seu diário está em branco.</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            Registrar seus sentimentos e intuições ajuda a mapear sua evolução energética. Clique no botão acima para registrar!
          </p>
        </div>
      ) : (
        <div id="diary_entries_list" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diary.map((entry) => (
            <motion.div
              key={entry.id}
              id={`diary_entry_card_${entry.id}`}
              className="rounded-xl border border-gray-800 bg-black/60 p-5 backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getCategoryBadge(entry.category)}
                  
                  <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-red-500" />
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <h4 className="font-serif text-sm font-bold text-[#FDF5E6] border-b border-gray-900 pb-1.5">
                  {entry.title}
                </h4>
                
                <p className="text-[11.5px] text-gray-300 mt-2.5 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-900 flex justify-end">
                <button
                  id={`btn_delete_diary_${entry.id}`}
                  onClick={() => deleteDiaryEntry(entry.id)}
                  title="Excluir relato"
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Apagar Relato
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
