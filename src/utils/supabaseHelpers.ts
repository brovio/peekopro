import { FunctionResponse } from '@supabase/supabase-js';

export const handleFunctionResponse = async <T>(response: FunctionResponse<T>) => {
  if (response.error) {
    throw new Error(response.error.message || 'Function call failed');
  }
  
  return response.data;
};