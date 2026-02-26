'use client';

import { Transition, Dialog, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useCreateAuthor, useDeleteAuthor, useGetAllAuthor, useUpdateAuthor } from '@/components/hooks/useAuthor';
import { Author } from '@/components/types/author';

const ComponentsContentPublishingAuthor = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');
    const { data: authorResponse, refetch } = useGetAllAuthor();
    const createMutation = useCreateAuthor();
    const updateMutation = useUpdateAuthor();
    const deleteMutation = useDeleteAuthor();

    const defaultParams: Author = {
        id: 0,
        name: '',
        email: '',
        created_at: '',
        updated_at: '',
    };

    const [params, setParams] = useState<Author>(defaultParams);
    const [items, setItems] = useState<Author[]>([]);
    const [filteredItems, setFilteredItems] = useState<Author[]>([]);

    // Fetch data
    useEffect(() => {
        if (authorResponse?.data?.length) {
            const normalizedItems: Author[] = authorResponse.data.map(item => ({
                ...item,
                name: item.name ?? '',        // replace null with empty string
                email: item.email ?? '', // replace null with empty string
            }));
            setItems(normalizedItems);
            setFilteredItems(normalizedItems);
        }
    }, [authorResponse]);

    /* --------- PAGINATION STATE (ADDED) --------- */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // change if you want

    const totalItems = filteredItems.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = filteredItems?.slice(startIndex, endIndex);
    // Search
    useEffect(() => {
        setFilteredItems(
            items.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, items]);

    // Input change handler
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

    // Save (Add / Update)
    const saveAuthor = () => {
        if (!params.name) return showMessage('Name is required', 'error');
         if (!params.email) return showMessage('Email is required', 'error');
        // Only send title and sub_title for creation
        const payload = {
            name: params.name,
            email: params.email,
        };

        if (params.id) {
            // Update
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this author?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, update it!',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    updateMutation.mutate({ id: params.id, ...payload }, {
                        onSuccess: () => {
                            refetch();
                            setAddModal(false);
                            setParams(defaultParams);
                            showMessage('Author updated successfully');
                        },
                        onError: () => showMessage('Failed to update author', 'error'),
                    });
                }
            });
        } else {
            // Create
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('Author added successfully');
                },
                onError: () => showMessage('Failed to add author', 'error'),
            });
        }
    };


    // Edit
    const editAuthor = (item?: Author) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    // Delete
    const deleteAuthor = (item: Author) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id, {
                    onSuccess: () => {
                        refetch();
                        showMessage('Author deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete author', 'error'),
                });
            }
        });
    };

    // Toast
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
                <h2 className="text-xl">Author</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editAuthor()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Author
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
                            placeholder="Search Author"
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
                                <th>Name</th>
                                <th>Email</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editAuthor(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAuthor(item)}>Delete</button>
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
                            <div className="text-xl font-bold">{item.name}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.email}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editAuthor(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteAuthor(item)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <Transition appear show={addModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddModal(false)}>
                    <div className="fixed inset-0 bg-black/60" />
                    <div className="fixed inset-0 flex items-center justify-center px-4">
                        <DialogPanel className="panel w-full max-w-lg p-5 relative">
                            <button onClick={() => setAddModal(false)} className="absolute top-4 right-4">
                                <IconX />
                            </button>

                            <h3 className="text-lg mb-4">{params.id ? 'Edit Aurhor' : 'Add Author'}</h3>

                            <input id="name" className="form-input mb-3" placeholder="Name" value={params.name} onChange={changeValue} />
                            <input id="email" className="form-input mb-3" placeholder="Email" value={params.email} onChange={changeValue} />
                
                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveAuthor}>{params.id ? 'Update' : 'Add'}</button>
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

export default ComponentsContentPublishingAuthor;
