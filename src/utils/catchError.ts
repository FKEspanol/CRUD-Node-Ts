const catchError = (error: any): void => {
    if (error instanceof Error) {
        console.log(error.message);
    }
};

export { catchError };
