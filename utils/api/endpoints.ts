import axios from "axios";
import {
  commentValidation,
  likeValidation,
  TLogin,
  TRegister,
} from "./validations";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";

const backendURL = process.env.NEXT_PUBLIC_Backend_URL;

// --- Auth session flag helpers ---
// We use a lightweight localStorage flag to track whether the user *might*
// have valid httpOnly cookies. This avoids firing profile + renew-token
// requests on every page load when the user is clearly logged out.
const AUTH_FLAG_KEY = "logged_in";

function setAuthFlag() {
  try {
    localStorage.setItem(AUTH_FLAG_KEY, "1");
  } catch {}
}

function clearAuthFlag() {
  try {
    localStorage.removeItem(AUTH_FLAG_KEY);
  } catch {}
}

function hasAuthFlag(): boolean {
  try {
    return localStorage.getItem(AUTH_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

const api = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    alert(error.response.data.message);
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const authState = hasAuthFlag();
      if (!authState) {
        return Promise.reject(error);
      }
      try {
        const result = await axios.post(
          backendURL + "/auth/renew-token",
          {},
          { withCredentials: true },
        );

        if (result.status === 200) {
          return api(originalRequest);
        }
      } catch (renewError) {
        // Token renewal failed — cookies are gone, clear the flag so
        // future page loads skip the profile call entirely.
        clearAuthFlag();
        return Promise.reject(renewError);
      }
    }

    return Promise.reject(error);
  },
);

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inputs: TLogin) => {
      const result = await api.post<TLogin>("/auth/login", inputs);
      return result.data;
    },
    onSuccess: (data) => {
      setAuthFlag();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inputs: TRegister) => {
      const result = await api.post<TRegister>("/auth/register", inputs);
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await api.post("/auth/resend-otp");
      return result.data;
    },
    onSuccess: (data) => {
      console.log("OTP resent successfully", data);
    },
  });
};
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const result = await api.get("/user/profile");
      return result.data.data;
    },

    enabled: typeof window !== "undefined" && hasAuthFlag(),
    retry: false,
  });
};
export const useVerifyAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (otp: number) => {
      const result = await api.patch("/auth/verify-account", { otp });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await api.post("/auth/logout");
      return result.data;
    },
    onSuccess: (data) => {
      clearAuthFlag();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      content: string;
      feeling: {
        emoji: string;
        label: string;
      } | null;
    }) => {
      const result = await api.post("/post/create", data);
      return result.data.data;
    },
    onSuccess: (newPost) => {
      if (!newPost) return;

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                data: [newPost, ...(page.data || [])],
              };
            }
            return page;
          }),
        };
      });
    },
  });
};

export const useGetAllPosts = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["posts", { limit }],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await api.get(`/post?limit=${limit}&pc=${pageParam}`);
      return result.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    enabled: typeof window !== "undefined",
    retry: false,
  });
};

export const useGetAllComments = (
  sourceId: number,
  commentType: any,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["comments", sourceId, commentType],

    queryFn: async ({ pageParam = 0 }) => {
      if (!sourceId) return [];
      const result = await api.get(
        `/post/comments?sourceId=${sourceId}&commentType=${commentType}&limit=${limit}&pc=${pageParam}`,
      );
      return result.data;
    },
    getNextPageParam: (lastPage) => lastPage?.cursor,
    initialPageParam: 0,
    enabled: !!sourceId && typeof window !== "undefined",
    retry: false,
  });
};
export const useGetAllReplie = (
  sourceId: number | undefined | string | null,
  limit: number = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["replie", sourceId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!sourceId) return [];
      const result = await api.get(
        `/post/comments?sourceId=${sourceId}&commentType=replie&limit=${limit}&pc=${pageParam}`,
      );
      return result.data;
    },
    getNextPageParam: (lastPage) => lastPage?.cursor,
    initialPageParam: 0,
    enabled: !!sourceId && typeof window !== "undefined",
    retry: false,
  });
};
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof commentValidation>) => {
      const result = await api.post("/post/comments", data);
      return result.data;
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useAddReplie = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof commentValidation>) => {
      const result = await api.post("/post/comments", data);
      return result.data;
    },
    onSuccess: () => {},
  });
};
export const useAddLike = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof likeValidation>) => {
      const result = await api.patch("/post/likes", data);
      return result.data;
    },
    onSuccess: () => {},
  });
};
export const useBookmarkAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: number) => {
      const result = await api.patch(`/post/bookmark/${postId}`);
      return result.data;
    },
    onSuccess: (data, postId) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["savePosts"] });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;
        if (data.data === true) {
          const filteredData = oldData.pages.map((page: any) => {
            return {
              ...page,
              data: page.data.filter((post: any) => post.id !== postId),
            };
          });
          return { ...oldData, pages: filteredData };
        } else {
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
      });
    },
  });
};
export const useFollowerAction = () => {
  return useMutation({
    mutationFn: async (userId: number) => {
      const result = await api.patch(`/user/follow/${userId}`);
      return result.data;
    },
    onSuccess: () => {},
  });
};
export const useGetAllSavePosts = (limit: number, isActive: boolean) => {
  return useInfiniteQuery({
    queryKey: ["savePosts", { limit, isActive }],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await api.get(
        `/post/bookmarks/?limit=${limit}&pc=${pageParam}`,
      );
      return result.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.cursor,
    enabled: typeof window !== "undefined" && isActive,
    retry: false,
  });
};
