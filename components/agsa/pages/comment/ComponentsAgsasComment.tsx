'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import { Comment } from '@/components/types/comment';
import { useDeleteComment, useGetAllComment } from '@/components/hooks/useComment';

const ComponentsAgsasComment = () => {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [search, setSearch] = useState('');

    const { data: commentResponse, refetch } = useGetAllComment();
    const deleteMutation = useDeleteComment();

    const [items, setItems] = useState<Comment[]>([]);
    const [filteredItems, setFilteredItems] = useState<Comment[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        if (commentResponse?.data) {
            setItems(commentResponse.data);
            setFilteredItems(commentResponse.data);
        }
    }, [commentResponse]);
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
                item.full_name && item.full_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, items]);

    const deleteComment = (item: Comment) => {
        const id = item.id;
        if (!id) return; // now TypeScript knows id is number below

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item.full_name ?? 'this comment'}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id, { // safe, TypeScript sees id is number
                    onSuccess: () => {
                        refetch();
                        showMessage('Comment deleted successfully');
                    },
                    onError: () => showMessage('Failed to delete comment', 'error'),
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
                <h2 className="text-xl">Comment</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex gap-3 items-center">
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
                            placeholder="Search Comment"
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
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Message</th>
                                <th className="!text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.full_name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phone}</td>
                                    <td className="max-w-[400px] break-words whitespace-normal">{item.message}</td>
                                    <td className="!text-center flex justify-center gap-2">
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteComment(item)}>Delete</button>
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
                            <div className="text-xl font-bold">{item?.full_name}</div>
                            <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                                {item?.email}<br />
                                {item?.phone}<br />
                                {item?.message}
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteComment(item)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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

export default ComponentsAgsasComment;
