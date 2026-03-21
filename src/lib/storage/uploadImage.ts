import { createClient } from "@/lib/supabase/client";

const BUCKET = "novawiki";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type Folder = "documents" | "avatars";

export async function uploadToStorage(
  file: File,
  folder: Folder,
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`허용되지 않는 파일 형식입니다. (${file.type})`);
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const filename = `${folder}/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { upsert: false });

  if (error) {
    throw new Error(error.message ?? "업로드에 실패했습니다.");
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  if (!data.publicUrl) {
    throw new Error("업로드된 파일의 URL을 가져오지 못했습니다.");
  }
  return data.publicUrl;
}

export function uploadDocumentImage(file: File): Promise<string> {
  return uploadToStorage(file, "documents");
}

export function uploadAvatar(file: File): Promise<string> {
  return uploadToStorage(file, "avatars");
}
