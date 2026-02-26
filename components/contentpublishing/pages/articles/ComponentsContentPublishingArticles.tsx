'use client';

import { Transition, Dialog, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Article, ArticleCreate } from '@/components/types/article';
import { useCreateArticle, useDeleteArticle, useGetAllArticle, useUpdateArticle } from '@/components/hooks/useArticle';

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const ComponentsContentPublishingArticles = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [publishFilter, setPublishFilter] = useState<'all' | 'published' | 'unpublished'>('all');

    const { data: articleResponse, refetch } = useGetAllArticle();
    const createMutation = useCreateArticle();
    const updateMutation = useUpdateArticle();
    const deleteMutation = useDeleteArticle();

    const defaultParams: Article = {
        id: 0,
        title: '',
        body: '',
        tags: [],
        is_published: false,
        author_id: 0,
        created_at: '',
        updated_at: '',
    };

    const [params, setParams] = useState<Article>(defaultParams);
    type ArticleWithAuthor = Article & { author_name: string };
    const [items, setItems] = useState<ArticleWithAuthor[]>([]);
    const [filteredItems, setFilteredItems] = useState<ArticleWithAuthor[]>([]);

    // ==================== New Features ====================
    const [showPreview, setShowPreview] = useState(false); // Markdown Preview
    const [draftSaved, setDraftSaved] = useState(false); // Draft autosave toast

    // ==================== Load and Save drafts ====================
    const DRAFT_KEY = 'article_draft';

    // Load draft when opening the modal
    useEffect(() => {
        if (addModal) {
            const draft = localStorage.getItem(DRAFT_KEY);
            if (draft) {
                try {
                    const parsed = JSON.parse(draft);
                    setParams(parsed);
                } catch (e) {
                    console.error('Failed to parse draft', e);
                    setParams(defaultParams);
                }
            } else {
                setParams(defaultParams);
            }
        }
    }, [addModal]);

    // Autosave draft every 3 seconds while modal is open
    useEffect(() => {
        if (!addModal) return;

        const timer = setInterval(() => {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(params));
            setDraftSaved(true);
            setTimeout(() => setDraftSaved(false), 1500);
        }, 3000);

        return () => clearInterval(timer);
    }, [params, addModal]);

    // ==================== Load articles ====================
    useEffect(() => {
        if (articleResponse?.data?.length) {
            const allArticles: ArticleWithAuthor[] =
                (articleResponse.data as any[]).flatMap((author: any) =>
                    author.articles.map((article: any) => ({
                        ...article,
                        author_name: author.name,
                    }))
                );

            setItems(allArticles);
            setFilteredItems(allArticles);
        }
    }, [articleResponse]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalItems = filteredItems?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredItems?.slice(startIndex, endIndex);

    // ==================== FILTERING ====================
    useEffect(() => {
        let filtered = items;

        if (search) filtered = filtered.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
        if (tagFilter) filtered = filtered.filter(item => item.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase())));
        if (publishFilter !== 'all') filtered = filtered.filter(item => publishFilter === 'published' ? item.is_published : !item.is_published);

        setFilteredItems(filtered);
        setCurrentPage(1);
    }, [search, tagFilter, publishFilter, items]);

    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            setParams({ ...params, [id]: e.target.checked });
        } else {
            setParams({ ...params, [id]: value });
        }
    };

    // ==================== Save Article ====================
    const saveArticle = async () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.body) return showMessage('Body is required', 'error');
        if (!params.tags) return showMessage('Tags is required', 'error');
        if (!params.author_id) return showMessage('Author is required', 'error');

        try {
            const payload: ArticleCreate = { title: params.title, body: params.body, tags: params.tags, is_published: params.is_published, author_id: params.author_id };

            if (params.id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to update this Article?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, update it!',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                        updateMutation.mutate(params, {
                            onSuccess: () => {
                                refetch();
                                setAddModal(false);
                                setParams(defaultParams);
                                localStorage.removeItem(DRAFT_KEY); // clear draft
                                showMessage('Article updated successfully');
                            },
                            onError: () => showMessage('Failed to update Article', 'error'),
                        });
                    }
                });
            } else {
                createMutation.mutate(payload, {
                    onSuccess: () => {
                        refetch();
                        setAddModal(false);
                        setParams(defaultParams);
                        localStorage.removeItem(DRAFT_KEY); // clear draft
                        showMessage('Article added successfully');
                    },
                    onError: () => showMessage('Failed to add Article', 'error'),
                });
            }
        } catch (error: any) {
            console.error(error);
            showMessage('Something went wrong', 'error');
        }
    };

    const editArticle = (item?: Article) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteArticle = (item: Article) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id, {
                    onSuccess: () => {
                        refetch();
                        showMessage('Article deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete Article', 'error'),
                });
            }
        });
    };

    const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
        Swal.fire({ toast: true, position: 'top', showConfirmButton: false, timer: 3000, icon: type, title: msg });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl">Articles</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editArticle()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Article
                        </button>
                        <button className={`btn btn-outline-primary p-2 ${view === 'list' && 'bg-primary text-white'}`} onClick={() => setView('list')}>
                            <IconListCheck />
                        </button>
                        <button className={`btn btn-outline-primary p-2 ${view === 'grid' && 'bg-primary text-white'}`} onClick={() => setView('grid')}>
                            <IconLayoutGrid />
                        </button>
                    </div>

                    <div className="relative ml-auto w-full sm:w-auto flex gap-2 items-center">
                        <input type="text" placeholder="Search Article" className="peer form-input py-2 ltr:pr-11 rtl:pl-11" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <div className="absolute top-1/2 -translate-y-1/2 ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </div>

                        <input type="text" placeholder="Filter by Tag" className="form-input py-2" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} />

                        <select className="form-input py-2" value={publishFilter} onChange={(e) => setPublishFilter(e.target.value as 'all' | 'published' | 'unpublished')}>
                            <option value="all">All</option>
                            <option value="published">Published</option>
                            <option value="unpublished">Unpublished</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List / Grid View */}
            {view === 'list' ? (
                <div className="panel mt-5 overflow-hidden border-0 p-0">
                    <table className="table-striped table-hover w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Tags</th>
                                <th>Is Published</th>
                                <th>Author</th>
                                {/* <th>Comments</th> */}
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td><ReactMarkdown>{item.body}</ReactMarkdown></td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.tags.join(', ')}</td>
                                    <td>{item.is_published ? 'Yes' : 'No'}</td>
                                    <td>{item.author_name}</td>
                                    {/* <td>💬 Coming soon</td> */}
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editArticle(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteArticle(item)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="panel p-4 text-center shadow rounded-md">
                            <div className="text-xl font-bold">{item.title}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                <ReactMarkdown>{item.body}</ReactMarkdown><br />
                                {item.tags.join(', ')}<br />
                            </div>
                            <div className="mt-2">
                                <span className="text-sm">Author: {item.author_name}</span> | <span className="text-sm">Is Published: {item.is_published ? 'Yes' : 'No'}</span>
                            </div>
                            {/* <div className="mt-2 text-sm text-gray-500 border-t pt-2">💬 Comments feature coming soon...</div> */}
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editArticle(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteArticle(item)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Transition appear show={addModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddModal(false)}>
                    <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center px-4">
                        <DialogPanel className="panel w-full max-w-lg p-5 relative">
                            <button onClick={() => setAddModal(false)} className="absolute top-4 right-4" aria-label="Close Modal">
                                <IconX />
                            </button>

                            <h3 className="text-lg mb-4">{params.id ? 'Edit Article' : 'Add Article'}</h3>

                            <input id="title" className="form-input mb-3" placeholder="Title" value={params.title} onChange={changeValue} aria-label="Article Title" />

                            {/* Markdown Preview Toggle */}
                            <div className="mb-3 flex gap-2 items-center">
                                <button type="button" className={`btn btn-outline-primary ${!showPreview && 'bg-primary text-white'}`} onClick={() => setShowPreview(false)}>Edit</button>
                                <button type="button" className={`btn btn-outline-primary ${showPreview && 'bg-primary text-white'}`} onClick={() => setShowPreview(true)}>Preview</button>
                            </div>

                            {/* Rich text editor / preview */}
                            {showPreview ? (
                                <div className="border p-3 max-h-64 overflow-y-auto bg-gray-50">
                                    <ReactMarkdown>{params.body}</ReactMarkdown>
                                </div>
                            ) : (
                                <ReactQuill theme="snow" value={params.body} onChange={(value) => setParams({ ...params, body: value })} />
                            )}

                            <div className="mb-5">
                                <label>Tags</label>
                                {params.tags.map((tags, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input type="text" className="form-input flex-1" value={tags} onChange={(e) => {
                                            const updated = [...params.tags];
                                            updated[index] = e.target.value;
                                            setParams({ ...params, tags: updated });
                                        }} placeholder={`Tag ${index + 1}`} />
                                        <button type="button" className="btn btn-outline-danger" onClick={() => {
                                            const updated = [...params.tags];
                                            updated.splice(index, 1);
                                            setParams({ ...params, tags: updated });
                                        }}>Remove</button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline-primary mt-2" onClick={() => setParams({ ...params, tags: [...params.tags, ''] })}>Add Tags</button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <input id="is_published" type="checkbox" checked={params.is_published} onChange={changeValue} />
                                <label htmlFor="is_published">Published/UnPublish</label>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="author_id" className="block mb-1 font-medium">Author</label>
                                <select id="author_id" className="form-input w-full" value={params.author_id} onChange={changeValue}>
                                    <option value={0}>Select Author</option>
                                    {articleResponse?.data?.map((author: any) => (
                                        <option key={author.id} value={author.id}>{author.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Draft saved toast */}
                            {draftSaved && (
                                <div className="fixed top-5 right-5 bg-green-500 text-white px-3 py-2 rounded shadow-md z-50">
                                    Draft Saved
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveArticle}>{params.id ? 'Update' : 'Add'}</button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-4">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded bg-primary text-white disabled:bg-gray-300`}>Previous</button>
                <span className="flex items-center px-3 text-sm font-medium">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded bg-primary text-white disabled:bg-gray-300`}>Next</button>
            </div>
        </div>
    );
};

export default ComponentsContentPublishingArticles;