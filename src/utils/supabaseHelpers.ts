type FunctionResponse<T> = {
  data: T;
  error: null | {
    message: string;
  };
};

export const handleFunctionResponse = async <T>(response: FunctionResponse<T>) => {
  if (response.error) {
    throw new Error(response.error.message || 'Function call failed');
  }
  
  return response.data;
};