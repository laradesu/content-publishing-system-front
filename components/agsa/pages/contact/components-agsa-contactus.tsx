'use client';

import { Transition, Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';

import { ContactUs, ContactUscreate } from '@/components/types/contact_us';
import { useCreateContactUs, useGetAllContactUs, useUpdateContactUs, useDeleteContactUs } from '../../../hooks/useContactUs';

const ComponentsAgsasContactUs = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [addModal, setAddModal] = useState(false);
    const [search, setSearch] = useState('');

    const { data: contactUsResponse, refetch } = useGetAllContactUs();
    const createMutation = useCreateContactUs();
    const updateMutation = useUpdateContactUs();
    const deleteMutation = useDeleteContactUs();

    const defaultParams: ContactUs = {
        id: 0,
        office_name: '',
        location: '',
        address: '',
        postal_code: '',
        tel: '',
        fax: '',
        email_primary: '',
        createdAt: '',
        updatedAt: '',
    };

    const [params, setParams] = useState<ContactUs>(defaultParams);
    const [items, setItems] = useState<ContactUs[]>([]);
    const [filteredItems, setFilteredItems] = useState<ContactUs[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (contactUsResponse?.data) {
            setItems(contactUsResponse.data);
            setFilteredItems(contactUsResponse.data);
        }
    }, [contactUsResponse]);

    /* ================= SEARCH ================= */
    useEffect(() => {
        setFilteredItems(
            items.filter((item) =>
                item.office_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, items]);

    /* ================= CHANGE VALUE ================= */
    const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setParams({ ...params, [id]: value });
    };

    /* ================= SAVE CONTACT ================= */
    const saveContact = () => {
        if (!params.office_name) return showMessage('Office name is required', 'error');
        if (!params.location) return showMessage('Location is required', 'error');
        if (!params.address) return showMessage('Address is required', 'error');
        if (!params.tel) return showMessage('Telephone is required', 'error');
        if (!params.email_primary) return showMessage('Primary email is required', 'error');

        if (params.id) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to update this contact?',
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
                            showMessage('Contact updated successfully');
                        },
                        onError: () => showMessage('Failed to update contact', 'error'),
                    });
                }
            });
        } else {
            const payload: ContactUscreate = {
                office_name: params.office_name,
                location: params.location,
                address: params.address,
                postal_code: params.postal_code,
                tel: params.tel,
                fax: params.fax,
                email_primary: params.email_primary,
            };
            createMutation.mutate(payload, {
                onSuccess: () => {
                    refetch();
                    setAddModal(false);
                    setParams(defaultParams);
                    showMessage('Contact added successfully');
                },
            });

        }
    };

    /* ================= EDIT & DELETE ================= */
    const editContact = (item?: ContactUs) => {
        setParams(item ? { ...item } : defaultParams);
        setAddModal(true);
    };

    const deleteContact = (item: ContactUs) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.office_name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(item.id, {
                    onSuccess: () => {
                        refetch();
                        showMessage('Contact deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete contact', 'error'),
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
                <h2 className="text-xl">Contact Us</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
                        <button className="btn btn-primary" onClick={() => editContact()}>
                            <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add Contact
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
                            placeholder="Search Contact"
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
                                <th>Office Name</th>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Postal Code</th>
                                <th>Tel</th>
                                <th>Fax</th>
                                <th>Email</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.office_name}</td>
                                    <td>{item.location}</td>
                                    <td>{item.address}</td>
                                    <td>{item.postal_code}</td>
                                    <td>{item.tel}</td>
                                    <td>{item.fax}</td>
                                    <td>{item.email_primary}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => editContact(item)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteContact(item)}>Delete</button>
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
                            <div className="text-xl font-bold">{item.office_name}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item.location}<br />
                                {item.address}<br />
                                {item.postal_code}<br />
                                {item.tel}<br />
                                {item.fax}<br />
                                {item.email_primary}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-primary w-1/2" onClick={() => editContact(item)}>Edit</button>
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteContact(item)}>Delete</button>
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

                            <h3 className="text-lg mb-4">{params.id ? 'Edit Contact' : 'Add Contact'}</h3>

                            <input id="office_name" className="form-input mb-3" placeholder="Office Name" value={params.office_name} onChange={changeValue} />
                            <input id="location" className="form-input mb-3" placeholder="Location" value={params.location} onChange={changeValue} />
                            <input id="address" className="form-input mb-3" placeholder="Address" value={params.address} onChange={changeValue} />
                            <input id="postal_code" className="form-input mb-3" placeholder="Postal Code" value={params.postal_code} onChange={changeValue} />
                            <input id="tel" className="form-input mb-3" placeholder="Telephone" value={params.tel} onChange={changeValue} />
                            <input id="fax" className="form-input mb-3" placeholder="Fax" value={params.fax} onChange={changeValue} />
                            <input id="email_primary" className="form-input mb-3" placeholder="Email" value={params.email_primary} onChange={changeValue} />

                            <div className="flex justify-end gap-3">
                                <button className="btn btn-outline-danger" onClick={() => setAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={saveContact}>{params.id ? 'Update' : 'Add'}</button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default ComponentsAgsasContactUs;
