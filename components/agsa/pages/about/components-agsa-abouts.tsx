'use client';
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useGetAllAbout } from '../../../hooks/useAbout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateAbout } from '../../../hooks/useAbout';
import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';
import { AboutRes, AboutCreate } from '@/components/types/about';
import { updateAboutById, deleteAboutById } from '../../../services/about';

const ComponentsAgsasAbouts = () => {
  const queryClient = useQueryClient();
  const { data: aboutsResponse, isLoading, error } = useGetAllAbout();

  const [view, setView] = useState<'list' | 'grid'>('list');
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const defaultParams: AboutRes = {
    id: 0,
    title: '',
    text: '',
    icon: '',
    createdAt: '',
    updatedAt: '',
  };
  const [params, setParams] = useState<AboutRes>(defaultParams);
  const [filteredItems, setFilteredItems] = useState<AboutRes[]>([]);

  // Initialize filteredItems
  useEffect(() => {
    if (aboutsResponse) setFilteredItems(aboutsResponse.data);
  }, [aboutsResponse]);

  // Search filter
  useEffect(() => {
    if (!aboutsResponse) return;
    setFilteredItems(
      aboutsResponse.data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, aboutsResponse]);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setParams({ ...params, [id]: value });
  };

  // Mutations
  const createMutation = useCreateAbout();

  const updateMutation = useMutation({
    mutationFn: (data: AboutRes) => {
      // Only send fields backend expects
      const { id, title, text, icon } = data;
      return updateAboutById(id, {
        id,
        title,
        text,
        icon: icon && icon.startsWith('http') ? icon : '', // Joi validation
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutget'] });
      showMessage('About updated successfully');
      setAddModal(false);
      setParams(defaultParams);
    },
    onError: (error: any) => {
      console.error('Update About error:', error.response?.data || error.message);
      showMessage('Failed to update About', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAboutById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutget'] });
      showMessage('About deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete About error:', error.response?.data || error.message);
      showMessage('Failed to delete About', 'error');
    },
  });

  // Save About (Add or Update)
  const saveAbout = () => {
    if (!params.title) return showMessage('Title is required', 'error');
    if (!params.text) return showMessage('Text is required', 'error');

    if (params.id) {
      // Update existing
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this About?',
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
      const payload: AboutCreate = {
        title: params.title,
        text: params.text,
        icon: params.icon && params.icon.startsWith('http') ? params.icon : '',
      };
      createMutation.mutate(payload, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['aboutget'] });
          showMessage('About added successfully');
          setAddModal(false);
          setParams(defaultParams);
        },
        onError: (error: any) => {
          console.error('Create About error:', error.response?.data || error.message);
          showMessage('Failed to add About', 'error');
        },
      });
    }
  };

  // Edit About
  const editAbout = (item?: AboutRes) => {
    setParams(item ? { ...item } : defaultParams);
    setAddModal(true);
  };

  // Delete About with confirmation
  const deleteAbout = (item: AboutRes) => {
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

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading data</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl">Abouts</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={() => editAbout()}>
              <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add About
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
              placeholder="Search Abouts"
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
                <th>Text</th>
                <th className="!text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td className="max-w-[400px] break-words whitespace-normal">{item.text}</td>
                  <td className="!text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => editAbout(item)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAbout(item)}>
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
            <div key={item.id} className="panel p-4 text-center shadow rounded-md">
              <div className="text-xl font-bold">{item.title}</div>
              <div className="text-white-dark break-words whitespace-normal max-h-32 overflow-y-auto">
                {item.text}
              </div>
              <div className="mt-4 flex justify-between gap-2">
                <button className="btn btn-outline-primary w-1/2" onClick={() => editAbout(item)}>
                  Edit
                </button>
                <button className="btn btn-outline-danger w-1/2" onClick={() => deleteAbout(item)}>
                  Delete
                </button>
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
                    {params.id ? 'Edit About' : 'Add About'}
                  </div>
                  <div className="p-5">
                    <form>
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
                        <label htmlFor="text">Text</label>
                        <textarea
                          id="text"
                          rows={3}
                          placeholder="Enter Text"
                          className="form-textarea min-h-[130px]"
                          value={params.text}
                          onChange={changeValue}
                        ></textarea>
                      </div>
                      <div className="mb-5">
                        <label htmlFor="icon">Icon (URL or leave empty)</label>
                        <input
                          id="icon"
                          type="text"
                          placeholder="Enter Icon URL"
                          className="form-input"
                          value={params.icon}
                          onChange={changeValue}
                        />
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
                          onClick={saveAbout}
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
    </div>
  );
};

export default ComponentsAgsasAbouts;
