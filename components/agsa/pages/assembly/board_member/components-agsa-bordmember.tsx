'use client';

import { Transition, Dialog, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useCreateBoardMember, useDeleteBoardMember, useGetAllBoardMember, useGetMemberTypes, useUpdateBoardMember } from '@/components/hooks/useGeneralAssembly';
import { BoardMember, BoardMemberCreate } from '@/components/types/generalAssembly';

// MEMBER TYPE constants
// export const MEMBER_TYPE = {
//     EXECUTIVE: "executive",
//     BOARDOFDIRECTOR: "boardofdirector",
//     EDITOR: "editor",
//     COMMITTEE: "committee",
//     ADVISOR: "advisor",
//     OTHER: "other"
// };
// export const MEMBER_TYPE_OPTIONS = Object.values(MEMBER_TYPE);

const ComponentsAgsasBoradMember = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');
    const { data: memberTypeResponse, isLoading: memberTypeLoading } = useGetMemberTypes();
    const memberTypes: string[] = memberTypeResponse?.data
        ? Object.values(memberTypeResponse.data)
        : [];
    const { data: boardMemberResponse, refetch } = useGetAllBoardMember();
    const createMutation = useCreateBoardMember();
    const updateMutation = useUpdateBoardMember();
    const deleteMutation = useDeleteBoardMember();

    const defaultParams: BoardMember = {
        id: 0,
        full_name: '',
        responsibility: '',
        photo: '', // string | File will be used
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        member_type: '',
        general_assembly_id: 0,
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<BoardMember>(defaultParams);
    const [items, setItems] = useState<BoardMember[]>([]);
    const [filteredItems, setFilteredItems] = useState<BoardMember[]>([]);

    /* ================= FETCH DATA ================= */
    // useEffect(() => {
    //     if (boardMemberResponse?.data?.length) {
    //         const allMembers: BoardMember[] = boardMemberResponse.data.flatMap(ga => ga.boardMembers);
    //         setItems(allMembers);
    //         setFilteredItems(allMembers);
    //     }
    // }, [boardMemberResponse]);
    useEffect(() => {
        if (boardMemberResponse?.data?.length) {
            const allMembers: BoardMember[] = boardMemberResponse.data.flatMap(ga => ga.boardMembers);

            const formattedMembers = allMembers.map(m => ({
                ...m,
                start_date: m.start_date ? new Date(m.start_date).toISOString().split('T')[0] : '',
                end_date: m.end_date ? new Date(m.end_date).toISOString().split('T')[0] : '',
            }));

            setItems(formattedMembers);
            setFilteredItems(formattedMembers);
        }
    }, [boardMemberResponse]);
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
                item.full_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, items]);

    const changeValue = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;

        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            setParams({ ...params, [id]: e.target.checked });
        } else {
            setParams({ ...params, [id]: value });
        }
    };

    /* ================= SAVE board member ================= */
    const saveBoardMember = async () => {
        if (!params.full_name) return showMessage('Full name is required', 'error');
        if (!params.responsibility) return showMessage('Responsibility is required', 'error');

        try {
            // Construct payload
            const payload: BoardMemberCreate = {
                full_name: params.full_name,
                responsibility: params.responsibility,
                description: params.description,
                start_date: params.start_date,
                end_date: params.end_date,
                is_active: params.is_active,
                member_type: params.member_type,
                general_assembly_id: params.general_assembly_id,
                photo: params.photo,
            };

            if (params.id) {
                // Update existing
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to update this board member?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, update it!',
                    cancelButtonText: 'Cancel',
                }).then((result) => {
                    if (result.isConfirmed) {
                        updateMutation.mutate(params, {
                            onSuccess: () => {
                                refetch(); // refresh list
                                setAddModal(false); // close modal
                                setParams(defaultParams); // reset form
                                showMessage('Board member updated successfully');
                            },
                            onError: () => showMessage('Failed to update board member', 'error'),
                        });
                    }
                });
            }
            else {
                // Create new
                createMutation.mutate(payload, {
                    onSuccess: () => {
                        refetch();
                        setAddModal(false);
                        setParams(defaultParams);
                        showMessage('Board member added successfully');
                    },
                    onError: () => showMessage('Failed to add board member', 'error'),
                });
            }
        } catch (error: any) {
            console.error(error);
            showMessage('Something went wrong', 'error');
        }
    };

    /* ================= EDIT & DELETE ================= */
    const editBoardMember = (item?: BoardMember) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteBoardMember = (item: BoardMember) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.full_name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id, {
                    onSuccess: () => {
                        refetch();
                        showMessage('Board member deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete board member', 'error'),
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
                <h2 className="text-xl">Board Members</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editBoardMember()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Board Member
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
                            placeholder="Search Board member"
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
                                <th>Full Name</th>
                                <th>Photo</th>
                                <th>Responsibilities</th>
                                <th>Description</th>
                                <th>Member Type</th>
                                <th>Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.full_name}</td>
                                    <td>
                                        {item.photo ? (
                                            <img
                                                src={
                                                    typeof item.photo === 'string'
                                                        ? `${process.env.NEXT_PUBLIC_API_URL}${item.photo}`
                                                        : URL.createObjectURL(item.photo)
                                                }
                                                alt={item.full_name}
                                                className="h-16 w-24 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                No Photo
                                            </div>
                                        )}
                                    </td>
                                    <td>{item.responsibility}</td>
                                    <td className="max-w-xs break-words whitespace-pre-wrap text-left">
                                        <div className="max-h-32 overflow-y-auto">
                                            {item.description}
                                        </div>
                                    </td>
                                    <td>{item.member_type}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editBoardMember(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteBoardMember(item)}>Delete</button>
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
                            <img
                                src={
                                    typeof item.photo === 'string'
                                        ? `${process.env.NEXT_PUBLIC_API_URL}${item.photo}`
                                        : URL.createObjectURL(item.photo)
                                }
                                alt=""
                                className="mx-auto mb-2 w-20 h-20 rounded-full object-cover"
                            />
                            <div className="text-xl font-bold">{item.full_name}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.responsibility}<br />
                                {item.description}
                            </div>
                            <div className="mt-2">
                                <span className="text-sm">Type: {item.member_type}</span> | <span className="text-sm">Active: {item.is_active ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editBoardMember(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteBoardMember(item)}>Delete</button>
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

                            <h3 className="text-lg mb-4">{params.id ? 'Edit Board Member' : 'Add Board Member'}</h3>

                            <input id="full_name" className="form-input mb-3" placeholder="Full Name" value={params.full_name} onChange={changeValue} />

                            {/* Photo Upload */}
                            <div className="mb-3">
                                <label htmlFor="photo" className="block mb-1 font-medium">Photo</label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="form-input w-full"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setParams({ ...params, photo: file });
                                    }}
                                />
                                {params.photo && typeof params.photo === 'string' && (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${params.photo}`}
                                        alt="Preview"
                                        className="mt-2 h-20 w-20 object-cover rounded"
                                    />
                                )}
                                {params.photo && params.photo instanceof File && (
                                    <img
                                        src={URL.createObjectURL(params.photo)}
                                        alt="Preview"
                                        className="mt-2 h-20 w-20 object-cover rounded"
                                    />
                                )}
                            </div>

                            <textarea id="responsibility" className="form-input mb-3" placeholder="Responsibilities" value={params.responsibility} onChange={changeValue} />
                            <textarea id="description" className="form-input mb-3" placeholder="Description" value={params.description} onChange={changeValue} />
                            <div className="mb-3">
                                <label htmlFor="start_date" className="block mb-1 font-medium">Start Date</label>
                                <input id="start_date" type="date" className="form-input mb-3" value={params.start_date} onChange={changeValue} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="end_date" className="block mb-1 font-medium">End Date</label>
                                <input id="end_date" type="date" className="form-input mb-3" value={params.end_date} onChange={changeValue} min={params.start_date || undefined} />
                            </div>

                            {/* General Assembly Dropdown */}
                            <div className="mb-3">
                                <label htmlFor="general_assembly_id" className="block mb-1 font-medium">General Assembly</label>
                                <select
                                    id="general_assembly_id"
                                    className="form-input w-full"
                                    value={params.general_assembly_id}
                                    onChange={changeValue}
                                >
                                    <option value="">Select Assembly</option>
                                    {boardMemberResponse?.data?.map((assembly) => (
                                        <option key={assembly.id} value={assembly.id}>
                                            {assembly.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="member_type" className="block mb-1 font-medium">
                                    Member Type
                                </label>

                                <select
                                    id="member_type"
                                    className="form-input w-full"
                                    value={params.member_type}
                                    onChange={changeValue}
                                    disabled={memberTypeLoading}
                                >
                                    <option value="">
                                        {memberTypeLoading ? 'Loading...' : 'Select Member Type'}
                                    </option>

                                    {memberTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type.replace(/_/g, ' ').toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="flex items-center gap-2 mb-3">
                                <input id="is_active" type="checkbox" checked={params.is_active} onChange={changeValue} />
                                <label htmlFor="is_active">Active</label>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveBoardMember}>{params.id ? 'Update' : 'Add'}</button>
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

export default ComponentsAgsasBoradMember;
