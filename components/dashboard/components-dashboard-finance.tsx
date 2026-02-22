'use client';
import Dropdown from '@/components/dropdown';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import { IRootState } from '@/store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllNoOfAccounts, useGetAllNoOfAdmins, useGetAllNoOfBoard, useGetAllNoOfComments, useGetAllNoOfMembers } from '../hooks/useDashboard';

const ComponentsDashboardFinance = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: noofAdminsResponse,
    isLoading: isLoadingAdmins,
    refetch: refetchAdmins,
  } = useGetAllNoOfAdmins();

  const {
    data: noofCommentsResponse,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useGetAllNoOfComments();

  const {
    data: noofMembersResponse,
    isLoading: isLoadingMembers,
    refetch: refetchMembers,
  } = useGetAllNoOfMembers();
  
  const {
    data: noofAccountsResponse,
    isLoading: isLoadingAccounts,
    refetch: refetchAccounts,
  } = useGetAllNoOfAccounts();

  const {
    data: noofBoardResponse,
    isLoading: isLoadingBoard,
    refetch: refetchBoard,
  } = useGetAllNoOfBoard();

  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/" className="text-primary hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>All Data</span>
        </li>
      </ul>

      <div className="pt-5">
        <div className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4">
          {/* Admins Card */}
         <div className="panel bg-primary text-white">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">Agsa Admins</div>
              <div className="dropdown">
                <Dropdown
                  offset={[0, 5]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName="hover:opacity-80"
                  button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                >
                  <ul className="text-black dark:text-white-dark">
                    <li>
                      <button type="button" onClick={() => refetchAdmins()}>
                        Refresh Admins
                      </button>
                    </li>
                    <li>
                      <button type="button">Edit Admins</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                {isLoadingAdmins ? 'Loading...' : noofAdminsResponse?.data ?? 0}
              </div>
            </div>
          </div>

          {/* Comments Card */}
      <div className="panel bg-secondary text-white">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">No of Comments</div>
              <div className="dropdown">
                <Dropdown
                  offset={[0, 5]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName="hover:opacity-80"
                  button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                >
                  <ul className="text-black dark:text-white-dark">
                    <li>
                      <button type="button" onClick={() => refetchComments()}>
                        Refresh Comments
                      </button>
                    </li>
                    <li>
                      <button type="button">Edit Comments</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                {isLoadingComments ? 'Loading...' : noofCommentsResponse?.data ?? 0}
              </div>
            </div>
          </div>
            {/* Members Card */}
          <div className="panel bg-primary text-white">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">No of Members</div>
              <div className="dropdown">
                <Dropdown
                  offset={[0, 5]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName="hover:opacity-80"
                  button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                >
                  <ul className="text-black dark:text-white-dark">
                    <li>
                      <button type="button" onClick={() => refetchMembers()}>
                        Refresh Members
                      </button>
                    </li>
                    <li>
                      <button type="button">Edit Members</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                {isLoadingMembers ? 'Loading...' : noofMembersResponse?.data ?? 0}
              </div>
            </div>
          </div>
            {/* Accounts Card */}
          <div className="panel bg-secondary text-white">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">No of Accounts</div>
              <div className="dropdown">
                <Dropdown
                  offset={[0, 5]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName="hover:opacity-80"
                  button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                >
                  <ul className="text-black dark:text-white-dark">
                    <li>
                      <button type="button" onClick={() => refetchMembers()}>
                        Refresh Members
                      </button>
                    </li>
                    <li>
                      <button type="button">Edit Members</button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                {isLoadingAccounts ? 'Loading...' : noofAccountsResponse?.data ?? 0}
              </div>
            </div>
          </div>
             {/* Board Members Card */}
          <div className="panel bg-primary text-white">
            <div className="flex justify-between">
              <div className="text-md font-semibold ltr:mr-1 rtl:ml-1">No of Board Members</div>
              <div className="dropdown">
                <Dropdown
                  offset={[0, 5]}
                  placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                  btnClassName="hover:opacity-80"
                  button={<IconHorizontalDots className="opacity-70 hover:opacity-80" />}
                >
                  <ul className="text-black dark:text-white-dark">
                    <li>
                      <button type="button" onClick={() => refetchBoard()}>
                        Refresh Board Members
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => refetchBoard()}>
                        Edit Board Members
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">
                {isLoadingBoard ? 'Loading...' : noofBoardResponse?.data ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsDashboardFinance;