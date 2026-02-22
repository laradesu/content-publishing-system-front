'use client';

import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { useCreateUser, useDeleteUser, useGetAllUser, useUpdateUser } from '@/components/hooks/useUser';
import { User, UserCreate } from '@/components/types/user';

const ComponentsAgsasUserRegister = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data: userResponse, refetch } = useGetAllUser();
    const createMutation = useCreateUser();
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    const defaultParams: User = {
        id: 0,
        title: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
        is_active: true,
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<User>(defaultParams);
    const [items, setItems] = useState<User[]>([]);
    const [filteredItems, setFilteredItems] = useState<User[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (userResponse?.data) {
            setItems(userResponse.data);
            setFilteredItems(userResponse.data);
        }
    }, [userResponse]);
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
                item.fullName.toLowerCase().includes(search.toLowerCase())
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

    /* ================= SAVE user ================= */
    const saveUser = () => {
        if (!params.title) return showMessage('Title is required', 'error');
        if (!params.fullName) return showMessage('Full Name is required', 'error');
        if (!params.email) return showMessage('Email is required', 'error');
        if (!params.phoneNumber) return showMessage('Phone Number is required', 'error');
        if (!params.username) return showMessage('Username is required', 'error');
        if (!params.id && !params.password) return showMessage('Password is required', 'error');


        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this user?',
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
                            showMessage('user updated successfully');
                        },
                        onError: () => showMessage('Failed to update user', 'error'),
                    });
                }
            });
        } else {
            const payload: UserCreate = {
                title: params.title,
                fullName: params.fullName,
                email: params.email,
                phoneNumber: params.phoneNumber,
                username: params.username,
                password: params.password,
                is_active: params.is_active
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('User added successfully');
                },
            });

        }
    };

    /* ================= EDIT & DELETE ================= */
    const editUser = (item?: User) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteUser = (item: User) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.fullName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id, {
                    onSuccess: () => {
                        refetch();
                        showMessage('User deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete user', 'error'),
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
                <h2 className="text-xl">Users</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editUser()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add User
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
                            placeholder="Search User"
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
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Username</th>
                                <th>is Active</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.username}</td>
                                    <td>{item.is_active ? 'Yes' : 'No'}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editUser(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(item)}>Delete</button>
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
                                {item.fullName}<br />
                                {item.email}<br />
                                {item.phoneNumber}<br />
                                {item.username}<br />
                            </div>
                            <div className="mt-2">
                                Active: {item.is_active ? 'Yes' : 'No'}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editUser(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteUser(item)}>Delete</button>
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

                            <h3 className="text-lg mb-4">{params.id ? 'Edit User' : 'Add User'}</h3>

                            <input id="title" className="form-input mb-3" placeholder="Title" value={params.title} onChange={changeValue} />
                            <input id="fullName" className="form-input mb-3" placeholder="Full Name" value={params.fullName} onChange={changeValue} />
                            <input id="email" className="form-input mb-3" placeholder="Email" value={params.email} onChange={changeValue} />
                            <input id="phoneNumber" className="form-input mb-3" placeholder="Phone Number" value={params.phoneNumber} onChange={changeValue} />
                            <input id="username" className="form-input mb-3" placeholder="Username" value={params.username} onChange={changeValue} />
                            {!params.id && (
                                <input
                                    id="password"
                                    type="password"
                                    className="form-input mb-3"
                                    placeholder="Password"
                                    value={params.password}
                                    onChange={changeValue}
                                />
                            )}
                            <div className="flex items-center gap-2 mb-3">
                                <input id="is_active" type="checkbox" checked={params.is_active} onChange={changeValue} />
                                <label htmlFor="is_active">Active</label>
                            </div>


                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveUser}>{params.id ? 'Update' : 'Add'}</button>
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

export default ComponentsAgsasUserRegister;
