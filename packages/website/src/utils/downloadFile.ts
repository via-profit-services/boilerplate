interface DownloadFileProps {
  url: string;
  filename: string;
}

export const downloadFile = (props: DownloadFileProps) => {
  const { url, filename } = props;
  const ext = url.split('.').reverse()[0];
  const clearedFilename = filename
    .replace(/[`"|\\/:*<>]/g, '') // illegial
    .replace(/^(nul|ext[2-4]|con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, '') // devices
    .replace(/\.$/, '') // replace trailing dot
    .replace(/\s{1,}/, ' ') // replace multiple spaces
    .replace(/\.[a-z0-9-]+$/, ''); // replace ext

  fetch(url)
    .then(resp => resp.blob())
    .then(blob => {
      const href = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = href;
      a.download = `${clearedFilename}.${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(href);
      a.remove();
    })
    .catch(() => {
      console.error('Failed to download file');
    });
};

export default downloadFile;
