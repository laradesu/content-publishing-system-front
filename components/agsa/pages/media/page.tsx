'use client';

import { Transition, Dialog, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useCreateMedia, useDeleteMedia, useGetAllMedia, useUpdateMedia } from '@/components/hooks/useMedia';
import { Media, MediaCreate } from '@/components/types/media';

const ComponentsAgsasMedia = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data: mediaResponse, refetch } = useGetAllMedia();
    const createMutation = useCreateMedia();
    const updateMutation = useUpdateMedia();
    const deleteMutation = useDeleteMedia();

    const defaultParams: Media = {
        id: 0,
        title: '',
        icon: '',
        link: '',
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<Media>(defaultParams);
    const [items, setItems] = useState<Media[]>([]);
    const [filteredItems, setFilteredItems] = useState<Media[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (mediaResponse?.data) {
            setItems(mediaResponse.data);
            setFilteredItems(mediaResponse.data);
        }
    }, [mediaResponse]);
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

    /* ================= SAVE media ================= */
    const saveMedia = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.icon) return showMessage('Icon is required', 'error');
        if (!params.link) return showMessage('Link is required', 'error');
        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this Media?',
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
                            showMessage('Media updated successfully');
                        },
                        onError: () => showMessage('Failed to update media', 'error'),
                    });
                }
            });
        } else {
            const payload: MediaCreate = {
                title: params.title,
                icon: params.icon,
                link: params.link,
                is_active: params.is_active,
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('Media added successfully');
                },
            });

        }
    };

    /* ================= EDIT & DELETE ================= */
    const editMedia = (item?: Media) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteMedia = (item: Media) => {
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
                        showMessage('Media deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete media', 'error'),
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
                <h2 className="text-xl">Media</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editMedia()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Media
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
                            placeholder="Search Media"
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
                                <th>Icon</th>
                                <th>Link</th>
                                <th>is Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.icon ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.icon}`}
                                            alt={item.title}
                                            className="h-16 w-24 object-cover rounded"
                                        />

                                    ) : (
                                        <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}</td>
                                    <td>{item.link}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editMedia(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMedia(item)}>Delete</button>
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
                                {item.icon ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.icon}`}
                                        alt={item.title}
                                        className="w-full h-48 object-cover rounded-md mb-3"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}<br />
                            </div>
                            <div className="text-xl font-bold">{item.link}</div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editMedia(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteMedia(item)}>Delete</button>
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

                            <div className="bg-[#fbfbfb] py-3 text-lg font-medium px-5 dark:bg-[#121c2c]">
                                {params.id ? 'Edit Media' : 'Add Media'}
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

                                    {/* Icon URL */}
                                    {/* Icon Upload */}
                                    <div className="mb-5">
                                        <label htmlFor="image_url">Icon Upload</label>
                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="form-input"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setParams({ ...params, icon: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file); // convert file to Base64
                                                }
                                            }}
                                        />
                                        {params.icon && (
                                            <img
                                                src={params.icon}
                                                alt="Preview"
                                                className="mt-3 h-32 w-48 object-cover rounded"
                                            />
                                        )}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="link">Link</label>
                                        <input
                                            id="link"
                                            type="text"
                                            placeholder="Enter Link"
                                            className="form-input"
                                            value={params.link}
                                            onChange={changeValue}
                                        />
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
                                            onClick={saveMedia}
                                        >
                                            {params.id ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
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

export default ComponentsAgsasMedia;
