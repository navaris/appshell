export default <TResource>(url: string) => {
  let status = 'pending';
  let result: TResource | Error;
  const suspender = fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // eslint-disable-next-line consistent-return
  }).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        status = 'success';
        result = data;
      });
    }
    status = 'error';
    result = new Error(`${response.status} ${response.statusText} ${response.url}`);
  });

  return {
    read() {
      if (status === 'pending') {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw suspender as Promise<TResource>;
      } else if (status === 'error') {
        throw result as Error;
      } else if (status === 'success') {
        return result;
      }

      return undefined;
    },
  };
};
