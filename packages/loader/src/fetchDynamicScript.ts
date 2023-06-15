const urlCache = new Set<string>();

export default async (url: string) => {
  const element = document.createElement('script');

  const cleanup = (): void => {
    if (document.head.contains(element)) {
      document.head.removeChild(element);
    }
  };

  return new Promise<boolean>((resolve, reject) => {
    if (urlCache.has(url)) {
      resolve(false);
    } else {
      urlCache.add(url);

      element.src = url;
      element.type = 'text/javascript';
      element.async = true;

      element.onload = () => {
        // eslint-disable-next-line no-console
        console.debug(`Remote entry fetched from '${url}'.`);

        resolve(true);
      };

      element.onerror = () => {
        const message = `Failed to fetch remote entry from '${url}'.`;
        // eslint-disable-next-line no-console
        console.error(message);
        reject(message);
      };

      document.head.appendChild(element);
    }
  }).finally(cleanup);
};
