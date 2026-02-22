'use client';

import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { Vacancies, VacanciesCreate, VacanciesResponse } from '@/components/types/news';
import { createVacancies, deleteVacanciesById, getAllVacancies, updateVacanciesById } from '@/components/services/news';

const ComponentsAgsaVacancies = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const defaultParams: Vacancies = {
        id: 0,
        title: '',
        file: null,
        is_active:true,
        createdAt: '',
        updatedAt: '',
    };
    const [params, setParams] = useState<Vacancies>(defaultParams);
    const [items, setItems] = useState<Vacancies[]>([]);
    const [filteredItems, setFilteredItems] = useState<Vacancies[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: VacanciesResponse = await getAllVacancies();
                setItems(res.data);
                setFilteredItems(res.data);
            } catch (error) {
                showMessage('Failed to load vacancies', 'error');
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
    const fetchvacancy = async () => {
        try {
            const res = await getAllVacancies();
            setFilteredItems(res.data);
        } catch (error) {
            showMessage('Failed to load vacancy', 'error');
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

    /* ================= CREATE ================= */
    const createMutation = useMutation({
        mutationFn: (payload: VacanciesCreate) => createVacancies(payload),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('Vacancies added successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchvacancy();
        },
        onError: () => showMessage('Failed to add Vacancies', 'error'),
    });

    /* ================= UPDATE ================= */
    const updateMutation = useMutation({
        mutationFn: (data: Vacancies) =>
            updateVacanciesById(data.id, {
                title: data.title,
                file: data.file,
                is_active: data.is_active,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('vacancies updated successfully');
            setAddModal(false);
            setParams(defaultParams);
            fetchvacancy();
        },
        onError: () => showMessage('Failed to update vacancies', 'error'),
    });

    /* ================= DELETE ================= */
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteVacanciesById(id),
        onSuccess: () => {
            queryClient.invalidateQueries();
            showMessage('Vacancies deleted successfully');
            fetchvacancy();
        },
        onError: () => showMessage('Failed to delete vacancies', 'error'),
    });

    // Save vacancies (Add or Update)
    const VacanciesProject = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.file) return showMessage('file is required', 'error');

        if (params.id) {
            // Update existing
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this vacancies?',
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
            const payload: VacanciesCreate = {
                title: params.title,
                file: params.file,
                is_active: params.is_active,
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['vacancies'] });
                    showMessage('Vacancies added successfully');
                    setAddModal(false);
                    setParams(defaultParams);
                },
                onError: (error: any) => {
                    console.error('Create vacancies error:', error.response?.data || error.message);
                    showMessage('Failed to add vacancies', 'error');
                },
            });
        }
    };

    // Edit vacancies
    const editVacancies = (item?: Vacancies) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    // Delete vacancies
    const deleteVacancies = (item: Vacancies) => {
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
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl">Vacancies</h2>
                <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex gap-3">
                        <button className="btn btn-primary" onClick={() => editVacancies()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Vacancies
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
                            placeholder="Search vacancies"
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
                                <th>File</th>
                                <th>Title</th>
                                <th>Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{renderFile(item.file)}</td>
                                    <td>{item.title}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => editVacancies(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteVacancies(item)}
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
                        <div key={item.id} className="panel p-4 text-center shadow rounded-md flex flex-col">{renderFile(item.file)}
                            <div className="text-xl font-bold">{item.title}</div>
                             <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editVacancies(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteVacancies(item)}>Delete</button>
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
                                        {params.id ? 'Edit vacancies' : 'Add vacancies'}
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
                                            <div className="mb-5">
                                                <label htmlFor="image_url">File Upload</label>
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
                                                    onClick={VacanciesProject}
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

export default ComponentsAgsaVacancies;
