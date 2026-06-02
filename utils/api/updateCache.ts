import { QueryClient } from "@tanstack/react-query";

export default function updateCach({
  queryClient,
  queryKey,
  data,
  postId,
}: {
  queryClient: QueryClient;
  queryKey: string;
  data: any;
  postId: number;
}) {
  queryClient.setQueriesData(
    { queryKey: [queryKey as string] },
    (oldData: any) => {
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
        queryClient.invalidateQueries({ queryKey: [queryKey as string] });
      }
    },
  );
}
