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
import { HealthProject, HealthProjectCreate, HealthProjectResponse } from '@/components/types/project';
import { createProjectHealth, deleteProjectHealthById, getAllProjectProjectHealth, updateProjectHealthById } from '@/components/services/project';


const ComponentsAgsasProjectHealth = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const defaultParams: HealthProject = {
        id: 0,
        title: '',
        description: '',
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };
    const [params, setParams] = useState<HealthProject>(defaultParams);
    const [items, setItems] = useState<HealthProject[]>([]);
    const [filteredItems, setFilteredItems] = useState<HealthProject[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: HealthProjectResponse = await getAllProjectProjectHealth();
                setItems(res.data);
                setFilteredItems(res.data);
            } catch (error) {
                showMessage('Failed to load health', 'error');
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

    const fetchHealth = async () => {
        try {
            const res = await getAllProjectProjectHealth();
            setFilteredItems(res.data);
        } catch (error) {
            showMessage('Failed to load health', 'error');
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
        mutationFn: (payload: HealthProjectCreate) => createProjectHealth(payload),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('health added successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchHealth();
        },
        onError: () => showMessage('Failed to add health project', 'error'),
    });

    /* ================= UPDATE ================= */
    const updateMutation = useMutation({
        mutationFn: (data: HealthProject) =>
            updateProjectHealthById(data.id, {
                title: data.title,
                description: data.description,
                is_active: data.is_active
            }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('health project updated successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchHealth();
        },
        onError: () => showMessage('Failed to update health project', 'error'),
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProjectHealthById(id),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('health project deleted successfully');
            fetchHealth();
        },
        onError: () => showMessage('Failed to delete health project', 'error'),
    });
    // Save About (Add or Update)
    const HealthProject = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.description) return showMessage('description is required', 'error');

        if (params.id) {
            // Update existing
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this health project?',
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
            const payload: HealthProjectCreate = {
                title: params.title,
                description: params.description,
                is_active: params.is_active
            };
            createMutation.mutate(payload, {
                onSuccess: (res) => {
                    queryClient.invalidateQueries({ queryKey: ['healthprooject'] });
                    showMessage('health project added successfully');
                    setAddModal(false);
                    setParams(defaultParams);
                    fetchHealth();
                },
                onError: (error: any) => {
                    console.error('Create health project error:', error.response?.data || error.message);
                    showMessage('Failed to add health project', 'error');
                },
            });
        }
    };

    // Edit About
    const editHealthProject = (item?: HealthProject) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    // Delete About with confirmation
    const deleteHealthProject = (item: HealthProject) => {
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
                <h2 className="text-xl"> health project</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <button className="btn btn-primary" onClick={() => editHealthProject()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add  health project
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
                            placeholder="Search  health project"
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
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => editHealthProject(item)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteHealthProject(item)}>
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
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editHealthProject(item)}>
                                    Edit
                                </button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteHealthProject(item)}>
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
                                        {params.id ? 'Edit health project' : 'Add  health project'}
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
                                                    onClick={HealthProject}
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

export default ComponentsAgsasProjectHealth;
