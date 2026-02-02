// import { createClient } from "../supabase/server";

// type Filter = {
//   column: string;
//   value: string | number;
// };

// /** API 관리 객체 */
// export const Api = {
//   /** 데이터 조회 */
//   get: async (table: string, select = "*", filter?: Filter) => {
//     const supabase = await createClient();
//     let query = supabase.from(table).select(select);

//     if (filter) {
//       query = query.eq(filter.column, filter.value);
//     }

//     const { data, error } = await query;

//     if (error) return { data: null, error: error.message };
//     return { data, error: null };
//   },

//   /** 데이터 삽입 */
//   post: async (table: string, data: Record<string, unknown>) => {
//     const supabase = await createClient();
//     const { data: result, error } = await supabase
//       .from(table)
//       .insert(data)
//       .select();

//     if (error) return { data: null, error: error.message };
//     return { data: result, error: null };
//   },

//   /** 데이터 전체 교체 (upsert) */
//   put: async (table: string, data: Record<string, unknown>) => {
//     const supabase = await createClient();
//     const { data: result, error } = await supabase
//       .from(table)
//       .upsert(data)
//       .select();

//     if (error) throw error;
//     return result;
//   },

//   /** 데이터 부분 수정 */
//   patch: async (
//     table: string,
//     data: Record<string, unknown>,
//     filter: Filter
//   ) => {
//     const supabase = await createClient();
//     const { data: result, error } = await supabase
//       .from(table)
//       .update(data)
//       .eq(filter.column, filter.value)
//       .select();

//     if (error) return { data: null, error: error.message };
//     return { data: result, error: null };
//   },

//   /** 데이터 삭제 */
//   delete: async (table: string, filter: Filter) => {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .from(table)
//       .delete()
//       .eq(filter.column, filter.value)
//       .select();

//     if (error) return { data: null, error: error.message };
//     return { data, error: null };
//   },

//   /** 데이터 존재 유무 확인 */
//   exists: async (
//     table: string,
//     column: string,
//     value: string | number | boolean
//   ) => {
//     const supabase = await createClient();

//     const { count, error } = await supabase
//       .from(table)
//       .select("*", { count: "exact", head: true })
//       .eq(column, value);

//     if (error) throw error;

//     return (count ?? 0) > 0;
//   },
// };
