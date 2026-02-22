'use client';

import { Transition, Dialog, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useCreateVolunteer, useDeleteVolunteer, useGetAllVolunteer, useUpdateVolunteer } from '@/components/hooks/useGetInvolved';
import { Voluneter, Volunetercreate } from '@/components/types/get_involved';

const ComponentsAgsasVolunteer = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data: volunteerResponse, refetch } = useGetAllVolunteer();
    const createMutation = useCreateVolunteer();
    const updateMutation = useUpdateVolunteer();
    const deleteMutation = useDeleteVolunteer();
    const defaultParams: Voluneter = {
        id: 0,
        title: '',
        content: '',
        fullName: '',
        description: '',
        promised_on: '',
        is_active:true,
        createdAt: '',
        updatedAt: '',
    };
    const [params, setParams] = useState<Voluneter>(defaultParams);
    const [items, setItems] = useState<Voluneter[]>([]);
    const [filteredItems, setFilteredItems] = useState<Voluneter[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (volunteerResponse?.data) {
            setItems(volunteerResponse.data);
            setFilteredItems(volunteerResponse.data);
        }
    }, [volunteerResponse]);
    /* --------- PAGINATION STATE (ADDED) --------- */
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

    /* ================= SAVE volunteer ================= */
    const saveVolunteer = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.content) return showMessage('Content is required', 'error');
        if (!params.fullName) return showMessage('Full Name is required', 'error');
        if (!params.description) return showMessage('description is required', 'error');
        if (!params.promised_on) return showMessage('Promissed On is required', 'error');
        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this volunteer?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    updateMutation.mutate(params, {
                        onSuccess: () => {
                            refetch();
                            setAddModal(false);
                            setParams(defaultParams);
                            showMessage('volunteer updated successfully');
                        },
                        onError: () => showMessage('Failed to update volunteer', 'error'),
                    });
                }
            });
        } else {
            const payload: Volunetercreate = {
                title: params.title,
                content: params.content,
                fullName: params.fullName,
                description: params.description,
                promised_on: params.promised_on,
                is_active:params.is_active
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('volunteer added successfully');
                },
            });

        }
    };

    /* ================= EDIT & DELETE ================= */
    const editVolunteer = (item?: Voluneter) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteVolunteer = (item: Voluneter) => {
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
                        showMessage('Volunteer deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete Volunteer', 'error'),
                });
            }
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
                <h2 className="text-xl">Volunteer</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editVolunteer()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Volunteer
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

                    <div className="relative ml-auto w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search Volunteer"
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
                                <th>Content</th>
                                <th>Full Name</th>
                                <th>description</th>
                                <th>Promised On</th>
                                 <th>is Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.content}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.description}</td>
                                    <td>{item.promised_on}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editVolunteer(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteVolunteer(item)}>Delete</button>
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
                                {item.content}<br />
                                {item.fullName}<br />
                                {item.description}<br />
                                {item.promised_on}<br />
                            </div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editVolunteer(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteVolunteer(item)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {/* Add/Edit Modal */}
            <Transition appear show={addModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddModal(false)}>
                    <div className="fixed inset-0 bg-black/60" />
                    <div className="fixed inset-0 flex items-center justify-center px-4">
                        <DialogPanel className="panel w-full max-w-lg p-5 relative">
                            <button onClick={() => setAddModal(false)} className="absolute top-4 right-4">
                                <IconX />
                            </button>

                            <h3 className="text-lg mb-4">{params.id ? 'Edit Volunteer' : 'Add Volunteer'}</h3>

                            <input id="title" className="form-input mb-3" placeholder="Title" value={params.title} onChange={changeValue} />
                            <input id="content" className="form-input mb-3" placeholder="Content" value={params.content} onChange={changeValue} />
                            <input id="fullName" className="form-input mb-3" placeholder="Full Name" value={params.fullName} onChange={changeValue} />
                            <input id="description" className="form-input mb-3" placeholder="description" value={params.description} onChange={changeValue} />
                            <input id="promised_on" type="date" className="form-input mb-3" placeholder="Promised On" value={params.promised_on} onChange={changeValue} />
                             <div className="flex items-center gap-2 mb-3">
                                                <input id="is_active" type="checkbox" checked={params.is_active} onChange={changeValue} />
                                                <label htmlFor="is_active">Active</label>
                                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveVolunteer}>{params.id ? 'Update' : 'Add'}</button>
                            </div>
                        </DialogPanel>
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

export default ComponentsAgsasVolunteer;
