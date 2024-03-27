import React from 'react';

const ErrorPage = ({ errorCode, errorMessage }) => {
    return (
        <div>
            <h1>Error {errorCode}</h1>
            <p>{errorMessage}</p>
            <p>Please try again later.</p>
        </div>
    );
};

export default ErrorPage;