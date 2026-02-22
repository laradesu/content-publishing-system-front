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
import { LivelihoodProject, LivelihoodProjectCreate, LivelihoodProjectResponse } from '@/components/types/project';
import { createProjectLivelihood, deleteProjectLivelihoodById, getAllProjectProjectLivelihood, updateProjectLivelihoodById } from '@/components/services/project';


const ComponentsAgsasProjectLivelihood = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const defaultParams: LivelihoodProject = {
        id: 0,
        title: '',
        description: '',
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };
    const [params, setParams] = useState<LivelihoodProject>(defaultParams);
    const [items, setItems] = useState<LivelihoodProject[]>([]);
    const [filteredItems, setFilteredItems] = useState<LivelihoodProject[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: LivelihoodProjectResponse = await getAllProjectProjectLivelihood();
                setItems(res.data);
                setFilteredItems(res.data);
            } catch (error) {
                showMessage('Failed to load livelihood', 'error');
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
    const fetchLivelihood = async () => {
        try {
            const res = await getAllProjectProjectLivelihood();
            setFilteredItems(res.data);
        } catch (error) {
            showMessage('Failed to load livelihood', 'error');
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
        mutationFn: (payload: LivelihoodProjectCreate) => createProjectLivelihood(payload),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('livelihood added successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchLivelihood();
        },
        onError: () => showMessage('Failed to add livelihood', 'error'),
    });

    /* ================= UPDATE ================= */
    const updateMutation = useMutation({
        mutationFn: (data: LivelihoodProject) =>
            updateProjectLivelihoodById(data.id, {
                title: data.title,
                description: data.description,
                is_active: data.is_active
            }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('livelihood updated successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchLivelihood();
        },
        onError: () => showMessage('Failed to update livelihood', 'error'),
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProjectLivelihoodById(id),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('livelihood deleted successfully');
            fetchLivelihood();
        },
        onError: () => showMessage('Failed to delete livelihood', 'error'),
    });
    // Save About (Add or Update)
    const livelihood = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.description) return showMessage('description is required', 'error');

        if (params.id) {
            // Update existing
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this livelihood?',
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
            const payload: LivelihoodProjectCreate = {
                title: params.title,
                description: params.description,
                is_active: params.is_active
            };
            createMutation.mutate(payload, {
                onSuccess: (res) => {
                    queryClient.invalidateQueries({ queryKey: ['livelihood'] });
                    showMessage('livelihood added successfully');
                    setAddModal(false);
                    setParams(defaultParams);
                    fetchLivelihood();
                },
                onError: (error: any) => {
                    console.error('Create livelihood error:', error.response?.data || error.message);
                    showMessage('Failed to add livelihood', 'error');
                },
            });
        }
    };

    // Edit About
    const editLivelihoodProject = (item?: LivelihoodProject) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    // Delete About with confirmation
    const deleteLivelihood = (item: LivelihoodProject) => {
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

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading data</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl"> Livelihood</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <button className="btn btn-primary" onClick={() => editLivelihoodProject()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add  Livelihood
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
                            placeholder="Search  Livelihood"
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
                                <th>Title</th>
                                <th>Description</th>
                                <th>is Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.description}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => editLivelihoodProject(item)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteLivelihood(item)}>
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
                        <div key={item.id} className="panel p-4 text-center shadow rounded-md">
                            <div className="text-xl font-bold">{item.title}</div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.description}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editLivelihoodProject(item)}>
                                    Edit
                                </button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteLivelihood(item)}>
                                    Delete
                                </button>
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
                                        {params.id ? 'Edit Livelihood' : 'Add  Livelihood'}
                                    </div>
                                    <div className="p-5">
                                        <form>
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
                                            <div className="mb-5">
                                                <label htmlFor="text">Description</label>
                                                <textarea
                                                    id="description"
                                                    rows={3}
                                                    placeholder="Enter Text"
                                                    className="form-textarea min-h-[130px]"
                                                    value={params.description}
                                                    onChange={changeValue}
                                                ></textarea>
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
                                                    onClick={livelihood}
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

export default ComponentsAgsasProjectLivelihood;
