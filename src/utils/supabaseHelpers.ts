import { FunctionInvokeResponse } from '@supabase/supabase-js';

export const handleFunctionResponse = async <T>(response: FunctionInvokeResponse<T>) => {
  if (response.error) {
    throw new Error(response.error.message || 'Function call failed');
  }
  
  return response.data;
};