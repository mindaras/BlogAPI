const toErrorResponse = (e: unknown) => ({ message: (e as Error)?.message });

export { toErrorResponse };
