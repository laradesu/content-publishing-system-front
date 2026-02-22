'use client';

import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import { useCreateReport, useDeleteReport, useGetAllReport, useUpdateReport } from '@/components/hooks/useDocument';
import { Report, ReportCreate } from '@/components/types/document';

const ComponentsAgsasReport = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data: reportResponse, refetch } = useGetAllReport();
    const createMutation = useCreateReport();
    const updateMutation = useUpdateReport();
    const deleteMutation = useDeleteReport();

    const defaultParams: Report = {
        id: 0,
        title: '',
        file: null,
        is_active: true,
        content: '',
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<Report>(defaultParams);
    const [items, setItems] = useState<Report[]>([]);
    const [filteredItems, setFilteredItems] = useState<Report[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (reportResponse?.data) {
            setItems(reportResponse.data);
            setFilteredItems(reportResponse.data);
        }
    }, [reportResponse]);
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
    /* ================= FILE TYPE HELPER ================= */
    const getFileType = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (!ext) return 'unknown';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'pdf';
        if (['doc', 'docx'].includes(ext)) return 'word';
        if (['xls', 'xlsx'].includes(ext)) return 'excel';
        return 'other';
    };
    /* ================= SAVE Report ================= */
    const saveReport = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.content) return showMessage('Content is required', 'error');
        if (!params.file) return showMessage('File is required', 'error');

        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this report?',
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
                            showMessage('Report updated successfully');
                        },
                        onError: () => showMessage('Failed to update report', 'error'),
                    });
                }
            });
        } else {
            const payload: ReportCreate = {
                title: params.title,
                content: params.content,
                file: params.file,
                is_active: params.is_active,
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('Report added successfully');
                },
            });

        }
    };

    /* ================= EDIT & DELETE ================= */
    const editReport = (item?: Report) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteReport = (item: Report) => {
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
                        showMessage('Report deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete report', 'error'),
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
    /* ================= FILE RENDERER ================= */
    const renderFile = (file: string | File | null) => {
        if (!file) {
            return (
                <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    No File
                </div>
            );
        }

        let fileUrl: string;
        let type: string;

        if (typeof file === 'string') {
            fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file}`;
            type = getFileType(file); // your existing function
        } else {
            fileUrl = URL.createObjectURL(file);
            type = file.type.startsWith('image/')
                ? 'image'
                : file.type.includes('pdf')
                    ? 'pdf'
                    : file.type.includes('word') || file.type.includes('officedocument.wordprocessingml')
                        ? 'word'
                        : file.type.includes('excel') || file.type.includes('spreadsheetml')
                            ? 'excel'
                            : 'other';
        }

        switch (type) {
            case 'image':
                return <img src={fileUrl} alt="file" className="h-16 w-24 object-cover rounded" />;
            case 'pdf':
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="h-16 w-24 bg-red-100 text-red-600 rounded flex items-center justify-center font-semibold hover:underline">
                        <FaFilePdf size={20} />
                    </a>
                );
            case 'word':
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="h-16 w-24 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-semibold hover:underline">
                        <FaFileWord size={20} />
                    </a>
                );
            case 'excel':
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="h-16 w-24 bg-green-100 text-green-600 rounded flex items-center justify-center font-semibold hover:underline">
                        <FaFileExcel size={20} />
                    </a>
                );
            default:
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="h-16 w-24 bg-gray-200 text-gray-600 rounded flex items-center justify-center font-semibold hover:underline">
                        <FaFileAlt size={20} />
                    </a>
                );
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl">Report</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editReport()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Report
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
                            placeholder="Search Report"
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
                                <th>File</th>
                                 <th>Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.title}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.content}</td>
                                    <td>{renderFile(item.file)}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editReport(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteReport(item)}>Delete</button>
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
                            <div className="text-xl font-bold">{item.title}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.content}
                            </div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {renderFile(item.file)}
                            </div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editReport(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteReport(item)}>Delete</button>
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
                                {params.id ? 'Edit reports' : 'Add reports'}
                            </div>
                            <div className="p-5">
                                <form>
                                    {/* Title */}
                                    <div className="mb-5">
                                        <label htmlFor="title">Title</label>
                                        <textarea
                                            id="title"
                                            placeholder="Enter Title"
                                            className="form-input"
                                            value={params.title}
                                            onChange={changeValue}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="content">Content</label>
                                        <textarea
                                            id="content"
                                            placeholder="Enter Content"
                                            className="form-input"
                                            value={params.content}
                                            onChange={changeValue}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="file">File Upload</label>
                                        <input
                                            id="file"
                                            type="file"
                                            className="form-input"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setParams({ ...params, file }); // file is now File | null
                                            }}
                                        />
                                        {params.file && (
                                            typeof params.file === 'string' ? (
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_API_URL}${params.file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-3 text-sm text-gray-600 underline"
                                                >
                                                    Current file
                                                </a>
                                            ) : (
                                                params.file.type.startsWith('image/') ? (
                                                    <img
                                                        src={URL.createObjectURL(params.file)}
                                                        alt="Preview"
                                                        className="mt-3 h-32 w-48 object-cover rounded"
                                                    />
                                                ) : (
                                                    <p className="mt-3 text-sm text-gray-600">
                                                        Selected file: {params.file.name}
                                                    </p>
                                                )
                                            )
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
                                            onClick={saveReport}
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

export default ComponentsAgsasReport;
