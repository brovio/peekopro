import { FunctionsResponse } from "@supabase/supabase-js";

export const handleFunctionResponse = async <T>(response: FunctionsResponse<T>) => {
  if (response.error) {
    throw new Error(response.error.message || 'Function call failed');
  }
  
  const data = await response.data;
  return data;
};