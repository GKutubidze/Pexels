
export const handleDownload = (url: string,name:string) => {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // Create a temporary URL for the blob
            const blobUrl = window.URL.createObjectURL(new Blob([blob]));

            // Create an anchor element
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${name}.jpg`; // You can set the desired file name here
            link.click();

            // Clean up
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => console.error('Download failed', error));
};