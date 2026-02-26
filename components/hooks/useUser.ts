// hooks/useMember.ts
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { User, UserCreate, UserLoginCreate, UserResponse } from "../types/user";
import { useRouter } from 'next/navigation';
import { createUser, deleteUserById, getAllUser, getUserById, updateUserById, UserLogin } from "../services/user";
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreate) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] }); // REFRESH the list
    },
  });
};

export const useGetAllUser= () => {
  return useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: async () => {
      const res: UserResponse = await getAllUser(); 
      return res; 
    },
  });
};
export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id, // only run when id exists
  });
};

// Update user
export const useUpdateUser= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: User) => updateUserById(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Delete user
export const useDeleteUser= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUserById(id),
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useUserLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: UserLogin,
    onSuccess: (response) => {
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard_ui');
      }
    },
    onError: (error: any) => {
      // error.response?.data?.message (if backend sends it)
      console.error('Login failed', error);
    },
  });
};