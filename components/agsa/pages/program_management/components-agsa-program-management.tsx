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

import {
    getAllProgramManagement,
    createProgramManagement,
    updateProgramManagementById,
    deleteProgramManagementById,
} from '../../../services/programManagement';

import {
    ProgramManagement,
    ProgramManagementcreate,
    ProgramManagementResponse,
} from '@/components/types/program_managament';

const ComponentsAgsasProgramManagement = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    /* ================= DEFAULT PARAMS ================= */
    const defaultParams: ProgramManagement = {
        id: 0,
        title: '',
        objectives: '',
        strategies: '',
        main_activities: [], // ✅ array
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<ProgramManagement>(defaultParams);
    const [items, setItems] = useState<ProgramManagement[]>([]);
    const [filteredItems, setFilteredItems] = useState<ProgramManagement[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res: ProgramManagementResponse = await getAllProgramManagement();
    //             setItems(res.data);
    //             setFilteredItems(res.data);
    //         } catch (error) {
    //             showMessage('Failed to load Program Management', 'error');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);
    const fetchProgramManagement = async () => {
        try {
            const res: ProgramManagementResponse = await getAllProgramManagement();
            setItems(res.data);
            setFilteredItems(res.data);
        } catch (error) {
            showMessage('Failed to load Program Management', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramManagement();
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // change if you want

    const totalItems = filteredItems?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = filteredItems?.slice(startIndex, endIndex);


    /* ================= SEARCH ================= */
    useEffect(() => {
        setFilteredItems(
            items.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, items]);

    /* ================= CHANGE VALUE ================= */
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
        mutationFn: (payload: ProgramManagementcreate) =>
            createProgramManagement(payload),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('Program added successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchProgramManagement();
        },
        onError: () => showMessage('Failed to add Program', 'error'),
    });

    /* ================= UPDATE ================= */
    const updateMutation = useMutation({
        mutationFn: (data: ProgramManagement) =>
            updateProgramManagementById(data.id, {
                title: data.title,
                objectives: data.objectives,
                strategies: data.strategies,
                main_activities: data.main_activities,
                is_active: data.is_active
            }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('Program updated successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchProgramManagement();
        },
        onError: () => showMessage('Failed to update Program', 'error'),
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProgramManagementById(id),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('Program deleted successfully');
            fetchProgramManagement();
        },
        onError: () => showMessage('Failed to delete Program', 'error'),
    });

    /* ================= SAVE ================= */
    const saveProgram = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.objectives) return showMessage('Objectives is required', 'error');
        if (!params.strategies) return showMessage('Strategies is required', 'error');

        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this Program?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
            }).then((result) => {
                if (result.isConfirmed) updateMutation.mutate(params);
            });
        } else {
            const payload: ProgramManagementcreate = {
                title: params.title,
                objectives: params.objectives,
                strategies: params.strategies,
                main_activities: params.main_activities,
                is_active: params.is_active
            };
            createMutation.mutate(payload);
        }
    };

    const editProgram = (item?: ProgramManagement) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteProgram = (item: ProgramManagement) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(item.id);
        });
    };

    /* ================= TOAST ================= */
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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl">Program Management</h2>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Add + List/Grid buttons */}
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editProgram()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Program
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

                    {/* Search input */}
                    <div className="relative ml-auto w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search Program"
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

            {/* List View */}
            {view === 'list' ? (
                <div className="panel mt-5 overflow-hidden border-0 p-0">
                    <table className="table-striped table-hover w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Objectives</th>
                                <th>Strategies</th>
                                <th>Main Activities</th>
                                <th>is Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.objectives}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.strategies}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.main_activities.join(', ')}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center">
                                        <div className="flex justify-center gap-4">
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => editProgram(item)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProgram(item)}>
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
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.objectives}<br />{item.strategies}<br />{item.main_activities.join(', ')}
                            </div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editProgram(item)}>
                                    Edit
                                </button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteProgram(item)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Transition appear show={addModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddModal(false)}>
                    <div className="fixed inset-0 bg-black/60" />
                    <div className="fixed inset-0 flex items-center justify-center px-4">
                        <DialogPanel className="panel w-full max-w-lg p-5 relative">
                            <button onClick={() => setAddModal(false)} className="absolute top-4 right-4">
                                <IconX />
                            </button>

                            <h3 className="text-lg mb-4">
                                {params.id ? 'Edit Program' : 'Add Program'}
                            </h3>

                            <input id="title" className="form-input mb-3" placeholder="Title" value={params.title} onChange={changeValue} />
                            <textarea id="objectives" className="form-textarea mb-3" placeholder="Objectives" value={params.objectives} onChange={changeValue} />
                            <textarea id="strategies" className="form-textarea mb-3" placeholder="Strategies" value={params.strategies} onChange={changeValue} />

                            {/* Main Activities Array */}
                            <div className="mb-5">
                                <label>Main Activities</label>
                                {params.main_activities.map((activity, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="form-input flex-1"
                                            value={activity}
                                            onChange={(e) => {
                                                const updated = [...params.main_activities];
                                                updated[index] = e.target.value;
                                                setParams({ ...params, main_activities: updated });
                                            }}
                                            placeholder={`Activity ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => {
                                                const updated = [...params.main_activities];
                                                updated.splice(index, 1);
                                                setParams({ ...params, main_activities: updated });
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-outline-primary mt-2"
                                    onClick={() =>
                                        setParams({ ...params, main_activities: [...params.main_activities, ''] })
                                    }
                                >
                                    Add Activity
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <input id="is_active" type="checkbox" checked={params.is_active} onChange={changeValue} />
                                <label htmlFor="is_active">Active</label>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveProgram}>
                                    {params.id ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
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

export default ComponentsAgsasProgramManagement;
