'use client';

import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { News, NewsCreate, NewsResponse } from '@/components/types/news';
import { createNews, deleteNewsById, getAllNews, updateNewsById } from '@/components/services/news';

const ComponentsAgsasNews = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const defaultParams: News = {
        id: 0,
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };
    const [params, setParams] = useState<News>(defaultParams);
    const [items, setItems] = useState<News[]>([]);
    const [filteredItems, setFilteredItems] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: NewsResponse = await getAllNews();
                setItems(res.data);
                setFilteredItems(res.data);
            } catch (error) {
                showMessage('Failed to load news', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    /* --------- PAGINATION STATE (ADDED) --------- */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // change if you want

    const totalItems = filteredItems?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = filteredItems?.slice(startIndex, endIndex);
    const fetchNews = async () => {
        try {
            const res = await getAllNews();
            setFilteredItems(res.data);
        } catch (error) {
            showMessage('Failed to load newst', 'error');
        }
    };

    /* ================= SEARCH ================= */
    useEffect(() => {
        setFilteredItems(
            items.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, items]);

    const changeValue = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value, type } = e.target;
        setParams(prev => ({
            ...prev,
            [id]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
        }));
    };

    /* ================= CREATE ================= */
    const createMutation = useMutation({
        mutationFn: (payload: NewsCreate) => createNews(payload),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('News added successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchNews();
        },
        onError: () => showMessage('Failed to add news', 'error'),
    });

    /* ================= UPDATE ================= */
    const updateMutation = useMutation({
        mutationFn: (data: News) =>
            updateNewsById(data.id, {
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                image_url: data.image_url,
                is_active: data.is_active,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('News updated successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchNews();
        },
        onError: () => showMessage('Failed to update news', 'error'),
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteNewsById(id),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('News deleted successfully');
            fetchNews();
        },
        onError: () => showMessage('Failed to delete news', 'error'),
    });

    // Save News (Add or Update)
    const NewsProject = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.content) return showMessage('Content is required', 'error');

        if (params.id) {
            // Update existing
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this news?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    updateMutation.mutate(params);
                }
            });
        } else {
            // Create new
            const payload: NewsCreate = {
                title: params.title,
                content: params.content,
                excerpt: params.excerpt,
                image_url: params.image_url,
                is_active: params.is_active,
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['news'] });
                    showMessage('News added successfully');
                    setAddModal(false);
                    setParams(defaultParams);
                },
                onError: (error: any) => {
                    console.error('Create news error:', error.response?.data || error.message);
                    showMessage('Failed to add news', 'error');
                },
            });
        }
    };

    // Edit News
    const editNews = (item?: News) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    // Delete News
    const deleteNews = (item: News) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id);
            }
        });
    };

    // Toast message
    const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
        Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            icon: type,
            title: msg,
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">News</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <button className="btn btn-primary" onClick={() => editNews()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add News
                        </button>
                        <button
                            className={`btn btn-outline-primary p-2 ${view === 'list' && 'bg-primary text-white'}`}
                            onClick={() => setView('list')}
                        >
                            <IconListCheck />
                        </button>
                        <button
                            className={`btn btn-outline-primary p-2 ${view === 'grid' && 'bg-primary text-white'}`}
                            onClick={() => setView('grid')}
                        >
                            <IconLayoutGrid />
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search news"
                            className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 ltr:right-[11px] rtl:left-[11px]">
                            <IconSearch className="mx-auto" />
                        </div>
                    </div>
                </div>
            </div>

            {/* List / Grid View */}
            {view === 'list' ? (
                <div className="panel mt-5 overflow-hidden border-0 p-0">
                    <table className="table-striped table-hover w-full">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Excerpt</th>
                                <th>Content</th>
                                <th>Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.image_url ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`}
                                                alt={item.title}
                                                className="h-16 w-24 object-cover rounded"
                                            />

                                        ) : (
                                            <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td>{item.title}</td>
                                    <td className="max-w-[200px] break-words whitespace-normal">{item.excerpt}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.content}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => editNews(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteNews(item)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="panel p-4 text-center shadow rounded-md flex flex-col">
                            {item.image_url ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url}`}
                                    alt={item.title}
                                    className="w-full h-48 object-cover rounded-md mb-3"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                            <div className="text-xl font-bold">{item.title}</div>
                            <div className="text-gray-600 italic mt-1 mb-2">{item.excerpt}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.content}
                            </div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editNews(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteNews(item)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Transition appear show={addModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddModal(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="panel w-full max-w-lg rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setAddModal(false)}
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium px-5 dark:bg-[#121c2c]">
                                        {params.id ? 'Edit news' : 'Add news'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            {/* Title */}
                                            <div className="mb-5">
                                                <label htmlFor="title">Title</label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    placeholder="Enter Title"
                                                    className="form-input"
                                                    value={params.title}
                                                    onChange={changeValue}
                                                />
                                            </div>

                                            {/* Excerpt */}
                                            <div className="mb-5">
                                                <label htmlFor="excerpt">Excerpt</label>
                                                <textarea
                                                    id="excerpt"
                                                    rows={2}
                                                    placeholder="Enter Excerpt"
                                                    className="form-textarea"
                                                    value={params.excerpt}
                                                    onChange={changeValue}
                                                ></textarea>
                                            </div>

                                            {/* Content */}
                                            <div className="mb-5">
                                                <label htmlFor="content">Content</label>
                                                <textarea
                                                    id="content"
                                                    rows={4}
                                                    placeholder="Enter Content"
                                                    className="form-textarea min-h-[130px]"
                                                    value={params.content}
                                                    onChange={changeValue}
                                                ></textarea>
                                            </div>

                                            {/* Image URL */}
                                            {/* Image Upload */}
                                            <div className="mb-5">
                                                <label htmlFor="image_url">Image Upload</label>
                                                <input
                                                    id="image_url"
                                                    type="file"
                                                    accept="image/*"
                                                    className="form-input"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setParams({ ...params, image_url: reader.result as string });
                                                            };
                                                            reader.readAsDataURL(file); // convert file to Base64
                                                        }
                                                    }}
                                                />
                                                {params.image_url && (
                                                    <img
                                                        src={params.image_url}
                                                        alt="Preview"
                                                        className="mt-3 h-32 w-48 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <input id="is_active" type="checkbox" checked={params.is_active} onChange={changeValue} />
                                                <label htmlFor="is_active">Active</label>
                                            </div>

                                            <div className="mt-8 flex justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setAddModal(false)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                    onClick={NewsProject}
                                                >
                                                    {params.id ? 'Update' : 'Add'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* ================= PAGINATION ================= */}
            <div className="flex justify-center mt-10 gap-4">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded bg-primary text-white disabled:bg-gray-300`}
                >
                    Previous
                </button>

                <span className="flex items-center px-3 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() =>
                        setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded bg-primary text-white disabled:bg-gray-300`}
                >
                    Next
                </button>
            </div>
        </div>

    );
};

export default ComponentsAgsasNews;
