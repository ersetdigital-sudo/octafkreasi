'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { supabase } from '@/lib/supabase';

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export default function AdminBlogTulisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [category, setCategory] = useState('Tips Travel');
  const [status, setStatus] = useState('draft');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const computedReadTime = useMemo(() => {
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} menit`;
  }, [wordCount]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Placeholder.configure({ placeholder: 'Mulai menulis artikel...' }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] px-6 py-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const count = countWords(html);
      setWordCount(count);
    },
  });

  // Load existing post if editing
  useEffect(() => {
    if (editId) {
      supabase.from('blog_posts').select('*').eq('id', editId).single().then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setExcerpt(data.excerpt || '');
          setImage(data.image || '');
          setCategory(data.category || 'Tips Travel');
          setStatus(data.status || 'draft');
          if (editor && data.content) {
            editor.commands.setContent(data.content);
            setWordCount(countWords(data.content));
          }
        }
      });
    }
  }, [editId, editor]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editId) {
      setSlug(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [title, editId]);

  // Auto-save every 30 seconds
  const autoSave = useCallback(async () => {
    if (!title || !editor) return;
    const content = editor.getHTML();
    const payload = { title, slug, excerpt, content, image, category, status, read_time: computedReadTime, updated_at: new Date().toISOString() };

    if (editId) {
      await supabase.from('blog_posts').update(payload).eq('id', editId);
    }
    setLastSaved(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
  }, [title, slug, excerpt, image, category, status, computedReadTime, editor, editId]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const handleSave = async (publishStatus: string) => {
    if (!title.trim()) { setNotification('Judul artikel wajib diisi'); setTimeout(() => setNotification(''), 3000); return; }
    setSaving(true);

    const content = editor?.getHTML() || '';
    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = { title, slug: finalSlug, excerpt, content, image, category, status: publishStatus, read_time: computedReadTime, updated_at: new Date().toISOString() };

    if (editId) {
      await supabase.from('blog_posts').update(payload).eq('id', editId);
    } else {
      await supabase.from('blog_posts').insert(payload);
    }

    setSaving(false);
    router.push('/admin/blog');
  };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push('/admin/blog')} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          <span className="text-sm font-medium text-gray-700">{editId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
          {lastSaved && <span className="text-[11px] text-gray-400">Tersimpan {lastSaved}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleSave('draft')} disabled={saving} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Simpan Draft
          </button>
          <button type="button" onClick={() => handleSave('published')} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Publish'}
          </button>
        </div>
      </div>

      {notification && <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 lg:mx-6">{notification}</div>}

      {/* Main Content */}
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        {/* Editor Area */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul Artikel"
            className="w-full border-0 bg-transparent text-2xl font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none lg:text-3xl"
          />

          {/* Slug */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-400">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border-0 bg-transparent text-xs text-gray-600 focus:outline-none"
              placeholder="slug-url"
            />
          </div>

          {/* Excerpt */}
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat artikel (tampil di listing blog)..."
            rows={2}
            className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
          />

          {/* Toolbar */}
          {editor && <EditorToolbar editor={editor} />}

          {/* Editor */}
          <div className="relative mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <EditorContent editor={editor} />
            {/* Word Counter */}
            <div className="absolute bottom-2 right-3 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
              {wordCount} kata
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full space-y-4 lg:w-[260px]">
          {/* Thumbnail */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900">Thumbnail</h3>
            <input
              type="url"
              value={image}
              onChange={(e) => { setImage(e.target.value); setImageError(false); }}
              placeholder="URL gambar thumbnail (Cloudinary)"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
            {/* Thumbnail Preview */}
            <div className="mt-2 h-32 w-full overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              {image && !imageError ? (
                <img
                  src={image}
                  alt="Preview thumbnail"
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                    </svg>
                    <p className="mt-1 text-[10px] text-gray-400">{image ? 'Gambar tidak valid' : 'Preview thumbnail'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900">Pengaturan</h3>
            <div>
              <label className="text-[11px] font-medium text-gray-600">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none">
                <option>Tips Travel</option>
                <option>Destinasi</option>
                <option>Kuliner</option>
                <option>Budaya</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-gray-600">Waktu Baca</label>
              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
                {computedReadTime} <span className="text-gray-400">(otomatis)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditorToolbar({ editor }: { editor: any }) {
  const addImage = () => {
    const url = prompt('URL gambar (Cloudinary):');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = prompt('URL link:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const btn = (active: boolean) => `rounded p-1.5 transition-colors ${active ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-0.5 rounded-t-xl border border-b-0 border-gray-200 bg-gray-50 px-2 py-1.5">
      {/* Headings */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))} title="H1">
        <span className="text-xs font-bold">H1</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="H2">
        <span className="text-xs font-bold">H2</span>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="H3">
        <span className="text-xs font-bold">H3</span>
      </button>
      <div className="mx-1 h-4 w-px bg-gray-300" />

      {/* Formatting */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="Bold">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="Italic">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m-2 0l-4 16m0 0h4" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Underline">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v7a5 5 0 0010 0V4M5 20h14" /></svg>
      </button>
      <div className="mx-1 h-4 w-px bg-gray-300" />

      {/* Lists */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Bullet List">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Numbered List">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.242 5.992h12m-12 6.003h12m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 11-1.087 0H2.99m.247 5.174h.992c.983 0 1.303 1.384.388 1.756-.652.265-1.38.39-1.38.39" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Quote">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
      </button>
      <div className="mx-1 h-4 w-px bg-gray-300" />

      {/* Horizontal Rule & Table */}
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Horizontal Line">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" /></svg>
      </button>
      <button type="button" onClick={insertTable} className={btn(false)} title="Insert Table">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M10.875 12h2.25m-2.25 0c-.621 0-1.125.504-1.125 1.125M12 12c.621 0 1.125.504 1.125 1.125m-2.25 0v1.5c0 .621.504 1.125 1.125 1.125m0-3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125" /></svg>
      </button>
      <div className="mx-1 h-4 w-px bg-gray-300" />

      {/* Align */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))} title="Align Left">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h10.5m-10.5 5.25h16.5" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))} title="Align Center">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6.75 12h10.5M3.75 17.25h16.5" /></svg>
      </button>
      <div className="mx-1 h-4 w-px bg-gray-300" />

      {/* Insert */}
      <button type="button" onClick={addImage} className={btn(false)} title="Insert Image (Cloudinary URL)">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" /></svg>
      </button>
      <button type="button" onClick={addLink} className={btn(editor.isActive('link'))} title="Insert Link">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
      </button>
      <div className="mx-1 h-4 w-px bg-gray-300" />

      {/* Undo/Redo */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Undo">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="Redo">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
      </button>
    </div>
  );
}
