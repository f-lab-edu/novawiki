import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";
import type { ProfileType } from "./types";

const profileQueryKey = () => defaultQueryKey(["profile"]);

export const profileQueryOptions = () =>
  defaultQueryOptions<ProfileType>(profileQueryKey(), "/api/user/profile");
