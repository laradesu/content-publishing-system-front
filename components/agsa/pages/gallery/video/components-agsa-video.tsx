'use client';

import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useCreateVideo, useDeleteVideo, useGetAllVideo, useUpdateVideo } from '@/components/hooks/useGallery';
import { Video, VideoCreate } from '@/components/types/gallery';

const ComponentsAgsasVideo = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data: videoResponse, refetch } = useGetAllVideo();
    const createMutation = useCreateVideo();
    const updateMutation = useUpdateVideo();
    const deleteMutation = useDeleteVideo();

    const defaultParams: Video = {
        id: 0,
        title: '',
        video: '',
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<Video>(defaultParams);
    const [items, setItems] = useState<Video[]>([]);
    const [filteredItems, setFilteredItems] = useState<Video[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (videoResponse?.data) {
            setItems(videoResponse.data);
            setFilteredItems(videoResponse.data);
        }
    }, [videoResponse]);
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


    /* ================= SAVE video ================= */
    const saveVideo = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.video) return showMessage('Video is required', 'error');

        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this video?',
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
                            showMessage('Video updated successfully');
                        },
                        onError: () => showMessage('Failed to update video', 'error'),
                    });
                }
            });
        } else {
            const payload: VideoCreate = {
                title: params.title,
                video: params.video,
                is_active: params.is_active
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('Video added successfully');
                },
            });

        }
    };

    /* ================= EDIT & DELETE ================= */
    const editVideo = (item?: Video) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteVideo = (item: Video) => {
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
                        showMessage('Video deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete Video', 'error'),
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
                <h2 className="text-xl">Video</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editVideo()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Video
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
                            placeholder="Search Video"
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
                                <th>Video</th>
                                <th>is Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.video ? (
                                        <video
                                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.video}`}
                                            className="mx-auto h-16 w-24 rounded object-cover"
                                            controls={false}
                                            muted
                                            preload="metadata"
                                            onMouseEnter={(e) => e.currentTarget.play()}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                        />
                                    ) : (
                                        <div className="mx-auto h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                            No Video
                                        </div>
                                    )}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editVideo(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteVideo(item)}>Delete</button>
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
                                {item.video ? (
                                    <video
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.video}`}
                                        className="mx-auto h-16 w-24 rounded object-cover"
                                        controls={false}
                                        muted
                                        preload="metadata"
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-400">
                                        No Video
                                    </div>
                                )}<br />
                            </div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editVideo(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteVideo(item)}>Delete</button>
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
                                {params.id ? 'Edit Video' : 'Add Video'}
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
                                    {/* Video Upload */}
                                    <div className="mb-5">
                                        <label htmlFor="video">Video Upload</label>

                                        <input
                                            id="video"
                                            type="file"
                                            accept="video/*"
                                            className="form-input"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                // Optional: validate file type
                                                if (!file.type.startsWith('video/')) {
                                                    alert('Please upload a valid video file');
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setParams({ ...params, video: reader.result as string });
                                                };
                                                reader.readAsDataURL(file); // Base64
                                            }}
                                        />

                                        {/* Video Preview */}
                                        {params.video && (
                                            <video
                                                src={params.video}
                                                controls
                                                className="mt-3 h-32 w-48 rounded object-cover"
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
                                            onClick={saveVideo}
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

export default ComponentsAgsasVideo;
