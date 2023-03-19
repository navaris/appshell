import React, { FC } from 'react';

type ErrorMessageProps = { message: string };

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => (
  <>
    <h3>Something went wrong!</h3>
    {message}
  </>
);

export default ErrorMessage;
